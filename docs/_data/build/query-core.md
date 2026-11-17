---
title: Query a Core node
sidebar_label: Query a Core node
description: Build the pinned Core source and read its graph through contract-backed HTTP operations.
kind: how-to
reader: ["app", "operator"]
packages: []
---

Run your own Core node from source and read its indexed graph through the Query API.

## Before you start

Read [indexing and querying](/docs/concepts/indexing-and-querying) to see how chain events reach the API. Core is an application you fork and build from its repository. Install Git, Docker with Compose v2, Bun 1.3.11, Node 20 or newer, and `curl`; keep at least 5 GiB free. The initial setup downloads dependencies and supporting images. No wallet or API key is required for default public reads.

Core source: [a402f880600f92969dc8fb013ca0f69fc9a02420](https://github.com/0xIntuition/intuition-core/tree/a402f880600f92969dc8fb013ca0f69fc9a02420). Supporting image tags can move; the source pin is not a promise of identical container artifacts.

## Steps

### 1. Fork and pin the source

Fork [Intuition Core](https://github.com/0xIntuition/intuition-core), replace the username placeholder, and select the documented source revision:

```sh
git clone https://github.com/YOUR_GITHUB_USERNAME/intuition-core.git
cd intuition-core
git remote add upstream https://github.com/0xIntuition/intuition-core.git
git fetch upstream a402f880600f92969dc8fb013ca0f69fc9a02420
git switch -c local-node a402f880600f92969dc8fb013ca0f69fc9a02420
git rev-parse HEAD
```

Verify that the final command prints the selected commit. A fork lets you maintain your own changes while keeping this baseline identifiable.

### 2. Build locally and wait for health

```sh
scripts/bootstrap.sh --no-start
docker compose -f docker-compose.yml up -d --build
COMPOSE_FILE=docker-compose.yml scripts/bootstrap.sh --skip-install
curl -fsS http://localhost:3000/health
```

The first command creates `.env` if needed and installs the frozen Bun lockfile. The second explicitly rebuilds Core services from source. The third reuses installed dependencies and waits for API health. Explicit Compose selection avoids inheriting a published-image override.

The default stack starts databases, migrations, the Query API on port 3000, atom services on port 4010, and parse/classification/enrichment workers. It does **not** start chain ingestion or projections automatically. API liveness does not prove chain indexing or provider completion.

### 3. Read a bounded page

```sh
curl -fsS 'http://localhost:3000/api/atoms?limit=10&offset=0'
curl -fsS http://localhost:3000/api/predicates
curl -fsS http://localhost:3000/api/stats
```

Atom lists return `data` and `pagination`. `pagination.count` counts rows in that response, not all matching records. The default limit is 25, with a maximum of 100. Public reads return active, public rows; an empty page is a valid result on a fresh node. Substring `q` filtering is not semantic ranking, and offsets can shift as rows arrive.

This typed helper validates only the contract fields it uses and keeps processing state distinct from chain presence:

{/* example:start examples/v2/core-query-api/src/read-atoms.ts#read-atoms */}
```ts
type AtomSummary = {
  id: string;
  isOnchain: boolean;
  classificationType: string;
  parseStatus: string;
  classificationStatus: string;
  enrichmentStatus: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export async function readAtoms() {
  const response = await fetch(
    'http://localhost:3000/api/atoms?limit=10&offset=0',
    {
      method: 'GET',
      signal: AbortSignal.timeout(5_000),
    },
  );
  if (!response.ok)
    throw new Error(`Core request failed: HTTP ${response.status}`);
  const payload: unknown = await response.json();
  if (
    !isRecord(payload) ||
    !Array.isArray(payload.data) ||
    !isRecord(payload.pagination)
  ) {
    throw new Error('Unexpected Core list response');
  }
  const atoms: AtomSummary[] = payload.data.map((row: unknown) => {
    if (
      !isRecord(row) ||
      typeof row.isOnchain !== 'boolean' ||
      ![
        'id',
        'classificationType',
        'parseStatus',
        'classificationStatus',
        'enrichmentStatus',
      ].every((key) => typeof row[key] === 'string')
    ) {
      throw new Error('Unexpected Core atom summary');
    }
    return {
      id: row.id as string,
      isOnchain: row.isOnchain,
      classificationType: row.classificationType as string,
      parseStatus: row.parseStatus as string,
      classificationStatus: row.classificationStatus as string,
      enrichmentStatus: row.enrichmentStatus as string,
    };
  });
  return { atoms, pagination: payload.pagination };
}
// Call readAtoms() only after starting your own Core node.
```
{/* example:end */}

Import and call `readAtoms()` after your node is running. It has no top-level request.

| Operation | Purpose |
| --- | --- |
| `GET /api/atoms/{id}` | One public atom and its documented processing fields. |
| `GET /api/atoms/{id}/triples` | Triples touching the atom in any subject, predicate, or object position. |
| `GET /api/atoms/{id}/artifacts` | Provider artifacts and their statuses. |
| `GET /api/triples` | Filter by `subject_id`, `predicate_id`, or `object_id`; use `expand=terms` for term summaries. |
| `GET /api/stats/pipeline` | Processing-stage counts. |
| `GET /api/schema` | Local knowledge-graph table metadata; this remains unauthenticated even in gated mode. |

Use complete term IDs from your own records. The pinned OpenAPI does not specify every optional semantic extension returned by the implementation; this guide makes no guarantee about additional identity, context, resolution, or display payloads. Predicate-list records also need checking before protocol use: a node's seeded vocabulary is not a substitute for the packages' canonical predicate bytes and IDs.

### 4. Choose how records reach your node

**Index a chain.** Set `INTUITION_RPC_URL`, `CHAIN_ID`, `MULTIVAULT_CONTRACT_ADDRESS`, and `MULTIVAULT_START_BLOCK` for your chosen deployment in `.env`. `MULTIVAULT_END_BLOCK` optionally bounds the range. Then explicitly enable indexing:

```sh
docker compose -f docker-compose.yml --profile indexing up -d --build
COMPOSE_FILE=docker-compose.yml scripts/bootstrap.sh --indexing --skip-install
```

A successful chain receipt can precede the projected Core record. Check network selection, indexing scope, and ingestion/projection progress before concluding a record is missing. The source commit does not choose a chain deployment for you.

**Insert off-chain records.** In default `API_AUTH=public-read`, writes require an operator-issued writable key. Keep it on the server and send `Authorization: Bearer <your key>`. `POST /api/atoms` accepts an `input` string; `POST /api/triples` accepts `subject_id`, `predicate_id`, and `object_id` for existing terms. Send an anchor's exact `data` as `input`, without serializing that string twice or reformatting its bytes. First creation returns 201; an existing record returns 200, with the response's `created` flag indicating the outcome.

These writes change only that node's off-chain graph. They do not submit a chain transaction or register URI context on-chain. Creating chain terms and waiting for indexing is a separate workflow. Processing after insertion is asynchronous and may be skipped or fail; do not promise completion merely because insertion succeeded.

## Check the result

A healthy `/health` response has `status: "ok"`; a degraded response reports `status: "degraded"` and `database: "unreachable"`. Read results reflect your node's data, so this guide does not prescribe graph counts. Inspect `isOnchain` separately from parse, classification, and enrichment statuses.

The optional semantic API flag `API_ATOM_SEMANTIC_READS_ENABLED` and worker flags `WORKERS_IID_READ_ENABLED` and `WORKERS_IID_RESOLUTION_ENABLED` default off independently. Enabling the API flag alone does not activate worker resolution or guarantee provider artifacts.

## Troubleshooting

| Result | Check |
| --- | --- |
| Connection refused | Compose status, API logs, and host port configuration. |
| 401 `api_key_required` or `invalid_api_key` | Correct node, bearer header, and active key. |
| 403 `api_key_not_writable` | A writable key for the authorized mutation. |
| 400 `invalid_input` or `invalid_term_id` | Valid input and complete 32-byte term IDs. |
| 413 `input_too_large` | Input size; store large assets separately. |
| 404 `not_found` | The requested term may be absent or not public. |
| Empty or pending metadata | Worker configuration, diagnostics, provider support, and credentials. |

Auth modes are `open`, `public-read`, and `gated`; choose the policy for your deployment deliberately. Use `make status`, `make logs SERVICE=api`, and `make down` for routine operations. `make down` preserves data volumes.

## Related

[Build a music catalog](/docs/examples/music-catalog) produces exact local atom and predicate data. [Protocol writes](/docs/concepts/protocol-writes) explains the separate on-chain boundary.

Pinned sources: [OpenAPI contract](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/docs/openapi.yaml), [API reference](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/docs/api-reference.md), [bootstrap script](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/scripts/bootstrap.sh), [Compose services](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/docker-compose.yml), and [configuration](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/docs/configuration.md).
