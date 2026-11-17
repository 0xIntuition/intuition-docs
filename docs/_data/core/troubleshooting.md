---
title: Troubleshooting
sidebar_label: Troubleshooting
description: Diagnose common startup, indexing, authentication and enrichment problems in a self-hosted node.
kind: how-to
reader: ["operator"]
packages: []
---

Locate the first failing stage between container startup, chain ingestion and the public graph response.

## Before you start

Work in your Core fork. Keep the Compose file, profiles, host ports and deployment record you used to start the node. For a missing atom, have its exact term ID, emitting proxy, transaction hash and receipt block ready. Keep credentials out of logs you share. [Run your own node](/docs/core/run-a-node)

## Steps

### 1. Establish which processes are healthy

```sh
docker compose -f docker-compose.yml --profile indexing ps -a
docker compose -f docker-compose.yml logs --tail=60 api migrate postgres-kg
curl -fsS http://localhost:3000/health
```

Use your actual host port. The two migration jobs should finish with exit code 0. The API's `status: "ok"` proves it can query the KG. A 503 with `database: "unreachable"` directs you to the KG container, migration and API connection first. The default stack has no indexer or projections until you select the indexing profile. For a devnet, include `--profile devnet` when inspecting the chain and deployer. [Health handler](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/services/api/src/app.ts#L219-L227) · [Service dependencies](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/docker-compose.yml)

| Symptom and observation | Smallest corrective action and expected result |
| --- | --- |
| Compose reports a host port is in use. | Identify the existing listener. If it should stay, change `API_HOST_PORT` or `ATOM_SERVICES_HOST_PORT` and recreate that service. Their container listeners stay 3000 and 4010. Worker ports have fixed Compose mappings; free the host port or edit its published side in your fork. Check the new host port. Bootstrap accepts `API_URL` for a remapped health check. |
| Docker Desktop stopped and several services show exit 255 together. | Restart Docker, then repeat the source Compose startup with your original profiles and volumes. Check that migration jobs succeed and projections resume from their checkpoints. |
| Rust services reject Postgres time zone UTC despite working application connections, especially after a disk filled. | Check free disk space and the affected database container's `/usr/share/zoneinfo/Etc/UTC`. Its first four bytes should be `TZif`. Zeroed bytes support an incomplete image extraction. Protect the database volumes, free space, stop the stack without deleting volumes, and re-pull the affected Timescale image after clearing the damaged image copy. Restart with the same profiles and verify the Rust connection. Both database services use that image. |

Removing volumes deletes local database contents and, for a devnet, may delete chain state. Normal Compose shutdown preserves volumes. [Port mappings](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/docker-compose.yml) · [Database images](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/docker-compose.datastores.yml) · [Bootstrap health URL](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/scripts/bootstrap.sh) · [Startup failure symptoms](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/docs/troubleshooting.md)

### 2. Follow a missing event from the chain to the KG

```sh
docker compose -f docker-compose.yml --profile indexing logs --tail=60 indexer projections
curl -fsS http://localhost:9091/metrics
curl -fsS http://localhost:9092/health/live
```

- **No ingester or no events.** Start one ingester with the indexing profile and source build. Check the RPC, chain ID, emitting proxy and block window against the receipt. A window containing no matching events yields no atom. One that reached its configured end can exit successfully. To follow the head, clear the end block and recreate the indexer. The pinned ingestion process has no Redis leader lock. [Ingestion startup](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/crates/rindexer-ingestion/src/main.rs) · [Bounded-range entrypoint](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/crates/rindexer-ingestion/entrypoint.sh)
- **The client reports that the chain ID is missing.** Set `CHAIN_ID` in the running indexer’s environment as well as the rendered manifest. Recreate the container after correcting `.env`. The generated client reads that variable at startup and expects an integer. Verify that the indexer resumes recording progress. [Network client](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/crates/rindexer-ingestion/src/rindexer_lib/typings/networks.rs)
- **The event exists but the API returns 404.** Verify the event's term ID, transaction and log coordinates in your event store. Check the `core_entities` projection is enabled and can reach the KG. In Timescale, inspect its `projection_checkpoints` record for the last block and sequence number. Once it catches up, a fresh on-chain atom should be active and public and appear at its exact ID. The API filters for both properties. [Projection checkpoints](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/crates/projections/src/resilience/checkpoint.rs) · [KG projection](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/crates/projections/src/projection/dual/core_entities.rs)
- **The ID exists with `isOnchain: false` despite a receipt.** An off-chain row may have used the same bytes first. When an insert encounters an existing KG ID, it keeps that row, including its chain flag. Check the original receipt and indexed event separately. Use the [local devnet acceptance atom](/docs/core/local-devnet) for a fresh end-to-end check. [KG insertion rule](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/crates/projections/src/projection/dual/core_entities.rs#L382-L400)

### 3. Match permission errors to the right service

For Query API requests, `401 api_key_required` means the operation needs a key, while `401 invalid_api_key` means the supplied credential failed validation. Supply a valid operator-issued bearer key for this node. For `403 api_key_not_writable`, use a key with write permission for the intended operation. Verify with an authorized request. Public-read allows anonymous graph reads; gated mode requires a key for those reads. Atom services on 4010 has a separately configured service bearer. [Query API access checks](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/services/api/src/app.ts#L134-L210) · [Service bearer configuration](/docs/core/configuration#atom-services-and-provider-credentials)

### 4. Check processing after the record appears

Inspect `parseStatus`, `classificationStatus`, `enrichmentStatus` and the reason accompanying a skipped or failed enrichment. Use the following default host ports:

```sh
curl -fsS http://localhost:4110/healthz
curl -fsS http://localhost:4112/healthz
curl -fsS http://localhost:4111/healthz
docker compose -f docker-compose.yml logs --tail=60 workers-enrichment
```

A skipped item can be correct for a plain string, an unmatched processing scope, an unavailable provider credential or disabled IID resolution. Check the input and recorded reason before changing configuration. A scope change leaves existing rows and artifacts in place. If a worker stopped during a stage, restore the worker and its KG connection. The stage claim can be recovered after its lease expires, subject to the attempt limit. Check for new stage progress and distinguish an exhausted attempt count from a missing process. [Worker settings](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/services/workers/src/shared/config.ts) · [Stage claims](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/packages/database-kg/src/actions/processing.ts) · [Enrichment decisions](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/services/workers/src/kg/atom-enrichment/index.ts)

## Check the result

Re-run the read or health check that first failed. For a newly indexed atom, compare the exact receipt term ID to the returned `data.id` and check `data.isOnchain`. Verify processing separately if your application needs classification or artifacts. [Query a Core node](/docs/build/query-core)

## Related

[Configuration](/docs/core/configuration) · [Scope what you index](/docs/core/indexing-scope)

{/* cspell:words zoneinfo */}
