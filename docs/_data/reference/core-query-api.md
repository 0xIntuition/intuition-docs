---
title: Core Query API
sidebar_label: Core Query API
description: Look up the methods, paths, credentials and response shapes exposed by a self-hosted Core Query API.
kind: reference
reader: ["app", "operator"]
packages: []
---

The Query API serves the knowledge graph on your own Core node. Its default address is `http://localhost:3000`. Two write operations also let you add off-chain atoms and triples. To build the service from the pinned source and make your first indexed read, see [Run a Core node](/docs/core/run-a-node) and [Query a Core node](/docs/build/query-core).

## Access and errors

The node operator sets `API_AUTH`. In the default `public-read` mode, reads are anonymous and writes require a writable key. In `gated` mode, ordinary reads also require a valid key. Health and schema discovery allow anonymous requests in every mode. In `open` mode, the operator permits anonymous reads and writes.

Send a Query API key in `Authorization: Bearer <key>`. The service recognizes keys with the `ik_` prefix. A recognized key that is unknown or revoked returns HTTP 401 with `invalid_api_key`, even on a public path. The service treats other bearer formats as absent. For example, an anonymous request to list atoms on a gated node returns HTTP 401 with this body.

```json
{"error":"api_key_required"}
```

Supply a valid key for that node. If a write returns HTTP 403 with `api_key_not_writable`, the key is valid but lacks write permission. Query errors have an `error` string and may include a `message`. Outside the health probe, HTTP 429 with `rate_limited` supplies a `retry-after` delay in seconds. HTTP 500 with `internal_error` indicates a server failure. [Access control and handlers](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/services/api/src/app.ts) · [Bearer key format](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/services/api/src/auth.ts)

## Health and schema discovery

### `GET /health`

Checks API access to its database. Takes no parameters. HTTP 200 returns `{"status":"ok"}`. HTTP 503 returns `{"status":"degraded","database":"unreachable"}`. A healthy service can still be catching up on chain data.

### `GET /api/schema`

Returns metadata for base tables in the local `kg` database schema. Takes no parameters. The HTTP 200 body contains `data.schema` (always `kg`), `data.generatedAt` and `data.tables`. Each table describes its columns, primary key, foreign keys, constraints and indexes.

## Reading atoms, triples and graph activity

These reads use the node's ordinary read permissions. A paginated response contains a `data` array and `pagination` with `limit`, `offset` and `count`. Use a page size from 1 to 100 (default 25) and a nonnegative offset (default 0). The count is the number of rows returned on this page. To request another full page, advance the offset by the page size.

### `GET /api/atoms`

Lists active public atoms, newest first. Use `classification_type` to filter by classification, `q` for a text search, and `limit` and `offset` to page. HTTP 200 returns atom summaries with the ID, creation time, raw type, resolved data, classification type and separate parse, classification and enrichment statuses. This search asks for up to two matching atoms.

```sh
curl -sS 'http://localhost:3000/api/atoms?q=archive&limit=2&offset=0'
```

If this node has no matching public atoms, HTTP 200 returns an empty page.

```json
{"data":[],"pagination":{"limit":2,"offset":0,"count":0}}
```

Here the zero count applies only to this search. Omit `q` to see whether the node has other public atoms.

### `GET /api/atoms/{id}`

Supply an atom's protocol ID in the path. HTTP 200 returns one atom under `data`, including processing details and graph-degree `stats`, which can be null. HTTP 404 with `not_found` means no matching atom is visible. The `isOnchain` flag describes the stored row. An atom first created off-chain can retain `false` when a later chain projection encounters that ID. Check the transaction receipt and event for chain creation, the projection checkpoint for indexing progress, and the atom's stage fields for processing. [Core projection](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/crates/projections/src/projection/dual/core_entities.rs)

### `GET /api/atoms/{id}/triples`

Supply an atom ID to find visible triples where it occupies any of the three positions. HTTP 200 returns a page of triples, including an empty page when none match. Accepts `limit`, `offset` and `expand=terms`. Expansion adds `subject`, `predicate` and `object` summaries with ID, data, classification type and raw type. A term whose atom is unavailable in the public view yields a null summary.

### `GET /api/atoms/{id}/artifacts`

Supply an atom ID and optional `limit` and `offset`. HTTP 200 returns a page of enrichment artifacts, including their kind, version, status, source URI, data, extracted fields and error where available. A visible atom can have an empty artifact page. HTTP 404 with `not_found` means the atom itself is unavailable.

### `GET /api/triples`

Lists active public triples. Combine `subject_id`, `predicate_id` and `object_id` to filter specific positions. Use `limit`, `offset` and optional `expand=terms`. HTTP 200 returns a page of triple records with their own ID and the ordered `subjectId`, `predicateId` and `objectId` fields.

### `GET /api/triples/{id}`

Supply a triple ID to fetch a single visible triple. HTTP 200 returns the record under `data`. Use `expand=terms` for the same three term summaries available on lists. HTTP 404 with `not_found` means no matching triple is visible.

### `GET /api/events`

Reads the public graph activity feed, newest first. Filter by `entity_kind` (`node`, `triple`, `predicate` or `artifact`), `event_type` or `entity_id`. Page with `limit` and `offset`. HTTP 200 returns a page of events with the time, kind, type, entity ID and payload. Both off-chain and on-chain activity can appear.

### `GET /api/predicates`

Lists the predicate registry in slug order. Takes no parameters. HTTP 200 returns only `data`, an array of predicate records. Each includes an ID, string `slug` and `label`, and a `description` field whose value can be null.

### `GET /api/stats/pipeline`

Counts public atoms by processing stage and status. Takes no parameters. HTTP 200 returns `data.parse`, `data.classification` and `data.enrichment`, each mapping observed statuses to counts.

### `GET /api/stats`

Takes no parameters. HTTP 200 returns integer counts under `data.atoms`, `data.triples`, `data.accounts` and `data.predicates`. The first two count active public records on this node.

## Writing off-chain records

Both operations accept JSON and use the node's write permissions. They create or find records in the local knowledge graph without signing a transaction or minting an on-chain term. HTTP 201 means newly created and HTTP 200 means already present. Both return `data.id`, `data.created` and `data.createdBy`. The last field identifies the submitting key's account, or is null for an anonymous write.

### `POST /api/atoms`

Send one `input` string containing text, a URL or serialized JSON. The string must contain a non-whitespace character and fit within 64,000 UTF-16 code units. This example request body represents a JSON document as a string.

```json
{"input":"{\"name\":\"Archive catalogue\"}"}
```

Submitting the same input bytes derives the same atom ID. Malformed JSON returns HTTP 400 with `invalid_json`. A missing, blank or non-string input returns HTTP 400 with `invalid_input`. An oversized input returns HTTP 413 with `input_too_large`.

### `POST /api/triples`

Supply an object with three string fields. Put the ID of the entity the claim describes in `subject_id`, the relationship's term ID in `predicate_id`, and the target's term ID in `object_id`. Use existing term IDs from your node, each `0x` followed by 64 hexadecimal digits. This same ordered triple of IDs derives the same triple ID each time. HTTP 400 indicates malformed JSON (`invalid_json`), a missing or empty field (`invalid_input`), or a malformed term ID (`invalid_term_id`).

The complete request and response schemas are in the [pinned Query API specification](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/docs/openapi.yaml).
