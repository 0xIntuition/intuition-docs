---
title: Atom services API
sidebar_label: Atom services API
description: Classify and enrich input through Core’s atom service and interpret batch, readiness, and error responses.
kind: reference
reader: ["app", "operator"]
packages: []
---

Core’s atom service classifies input over HTTP and can run enrichment plugins against the result. It listens on `http://localhost:4010` in the default Core stack. Processing is stateless by default. To build and start the service from your fork, see [Run a Core node](/docs/core/run-a-node). To retrieve records already indexed by your node, see [Query a Core node](/docs/build/query-core).

## Access and request errors

Send POST bodies as `application/json`. The four processing routes and the batch status route allow anonymous access unless the service receives `ATOM_SERVICES_AUTH_TOKEN`. When configured, send the operator-supplied value as `Authorization: Bearer <token>`. The stock Compose file does not forward this variable automatically. Operators using Compose must pass it into the atom-services container to enable the gate. Health, readiness and metrics are public and exempt from request throttling. [Service authentication](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/services/atom-services/src/middleware/auth.ts) · [Compose configuration](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/docker-compose.yml)

A request failure returns `ok: false` and an `error` object with `code`, `message` and optional `details` and `requestId`. For example, a gated request with a missing or incorrect token returns HTTP 401.

```json
{
  "ok": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Missing or invalid bearer token.",
    "requestId": "example-request"
  }
}
```

HTTP 400 with `INVALID_JSON` means the body could not be decoded. With `VALIDATION_ERROR`, the JSON was readable but failed the request schema. Look in `error.details.issues` for the affected field. HTTP 429 with `RATE_LIMITED` includes a `retry-after` delay in seconds. HTTP 500 with `INTERNAL_ERROR` signals an unexpected service error.

## Processing a single input

### `POST /v1/classify`

Use this when you have raw input and want its classification. Send the string in `input` (1–10,000 UTF-16 code units). Optional fields include `mode`, `inputIntent`, `classificationSessionId`, `pluginIds`, `policy` and `clientHints`. The defaults are `progressive` mode and `generic` intent.

```json
{"input":"Archive catalogue"}
```

HTTP 200 returns the classification result directly. It includes `ok: true`, a `classificationSessionId`, and a `status` of `placeholder`, `partial` or `complete`. Depending on the result, `classification`, `resolved` and `resolverErrors` can supply more detail. [Classification request and result schemas](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/atom-classification/src/types.ts)

### `POST /v1/enrich`

Use this when classification has already identified the atom. Supply `input.atomType`, the classification engine and timestamp under `input.source`, and either `input.jsonLd` or a canonical `input.identifier`. The following request body describes an already classified Thing.

```json
{
  "input": {
    "atomType": "thing",
    "jsonLd": {"@context": "https://schema.org", "@type": "Thing", "name": "Archive catalogue"},
    "source": {"classificationEngine": "local", "classifiedAt": "2026-01-01T00:00:00Z"}
  }
}
```

An optional `enrichment` object selects a `preset`, `plugins` or `artifactClasses` and can set `concurrency`, `timeoutMs` or `traceId`. HTTP 200 returns an enrichment result with `status` (`success`, `partial` or `failed`), `artifacts`, `errors`, `skipped`, `timings` and an optional `traceId`. A skipped plugin has a `pluginId` and a `reason`. For a partial result, inspect both the artifacts produced and the plugin errors before deciding whether to retry. [Classified input and enrichment result schemas](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/atom-enrichment/src/types.ts)

### `POST /v1/process`

Use this to classify raw input and enrich it in one request. Send `rawInput` (a string of 1–10,000 UTF-16 code units) with optional `classification`, `enrichment`, `traceId` and `persistence` fields.

```json
{"rawInput":"Archive catalogue","classification":{"mode":"progressive"}}
```

HTTP 200 returns `runId`, `mode: "process"`, overall `status`, the `classification` result, nullable `enrichment`, `timings`, `observability`, `persistence` and an optional `traceId`. Use the stage results to interpret the overall status.

- If `enrichment` is null, classification produced no input suitable for the enrichment step. The overall run can still succeed if classification completed.
- If classification is incomplete or an enrichment run finishes partially or fails, process reports `partial`. Inspect the classification and any enrichment diagnostics.
- If classification completes and enrichment reports `success`, process reports `success`. Read the artifacts array to see what the plugins actually returned.

By default, `persistence.status` is `not_requested`. To hand a result to storage, request `persistence.enabled: true` on a service that has persistence enabled and an adapter configured. Otherwise the request returns HTTP 400 with `PERSISTENCE_NOT_AVAILABLE`. Check the persistence status separately from the processing status. [Processing outcomes](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/services/atom-services/src/service/processing.ts) · [Persistence handoff](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/services/atom-services/src/service/persistence.ts)

## Submitting and polling a batch

### `POST /v1/process/batch`

Send a `jobs` array of process request bodies. The schema accepts 1–200 jobs. The service also enforces `ATOM_SERVICES_BATCH_MAX_ITEMS`, which defaults to 25. A batch within the schema limit but above the configured cap returns HTTP 400 with `BATCH_LIMIT_EXCEEDED`. The persistence requirement applies to each job.

```json
{"jobs":[{"rawInput":"Archive catalogue"},{"rawInput":"Library index"}]}
```

HTTP 202 acknowledges submission. For example, a two-item batch returns an object like this.

```json
{"jobId":"batch-example","status":"accepted","submittedAt":"2026-01-01T00:00:00Z","total":2}
```

### `GET /v1/process/batch/:jobId`

Replace `:jobId` with the ID from your own submission. HTTP 200 returns `jobId`, `status`, `submittedAt`, `total`, `completed` and `results`, with `startedAt` and `finishedAt` as available. Poll while the status is `queued` or `running`. The terminal states are `complete`, `partial` and `failed`. Each item identifies its original index and contains a status and a response, or a null response with an error if execution threw.

The service keeps jobs in process memory. A restart loses them, and new submissions can clear completed jobs past the retention period (one hour by default). An unknown, expired or lost ID returns HTTP 404 with `BATCH_JOB_NOT_FOUND`. [Batch storage and status transitions](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/services/atom-services/src/service/batch-store.ts)

## Checking service health

### `GET /health`

Takes no parameters. HTTP 200 returns JSON with `ok: true`, `service: "atom-services"`, `status: "healthy"`, `timestamp` and `uptimeMs`. Use this to check that the process responds.

### `GET /ready`

Takes no parameters. HTTP 200 with `status: "ready"` means the preset registry and persistence readiness checks passed. HTTP 503 with `status: "degraded"` means a readiness check failed. Both responses include `ok`, `service`, `timestamp`, `dependencies`, `presets` and `warnings` to help the operator identify the condition.

### `GET /metrics`

Takes no parameters. HTTP 200 returns plain text in Prometheus exposition format. Use it to collect service metrics, including HTTP request counts. [Service handlers](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/services/atom-services/src/app.ts) · [Request and response contracts](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/services/atom-services/src/contracts.ts)
