---
title: Configuration
sidebar_label: Configuration
description: Find documented Core settings by service, default, and the environment where each takes effect.
kind: reference
reader: ["operator"]
packages: []
---

This reference covers the settings listed in the [configuration reference for this Core revision](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/docs/configuration.md). Each table identifies where a value takes effect. A native process reads its environment. Compose uses the repository’s `.env` for substitution only where a service explicitly references that variable. For a process setting absent from the stock service mapping, add it to that service’s environment in your fork and recreate the service. Keep credentials out of source control. [Compose service definitions](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/docker-compose.yml) · [Example environment](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/example.env)

## Datastores

| Setting | Consumer and default |
| --- | --- |
| `DATABASE_KG_URL` | The Query API, KG migration and workers need the KG connection. Projections use it to write graph entities and context evidence. Optional for the standalone projections binary. Compose supplies the container DSN to all four. |
| `DATABASE_TIMESCALE_URL` | Host-side Timescale client, tests and migration helper. The example environment points to host port 5433. Tests requiring the database can skip when unset. |
| `DATABASE_URL` | Required event-store DSN for ingestion, projections and the Timescale migration job. Compose sets the container DSN. |
| `REDIS_URL` | The local example uses `redis://localhost:6379`; Compose supplies `redis://redis:6379` to the indexer. |
| `REDIS_LEADER_KEY`, `REDIS_LEADER_TTL_SEC` | Shared Rust configuration defaults to `ingestion_leader_lock` and 15 seconds. Stock Compose does not forward either. The current Rust ingester acquires no Redis leader lock. Run one ingester per store and scope. |

Use the actual service credentials in place of `USER` and `PASSWORD`. The host maps Timescale to a different port so both servers can run:

| Connection | Host process | Process on Compose network |
| --- | --- | --- |
| KG | `postgresql://USER:PASSWORD@localhost:5432/intuition_kg` | `postgresql://USER:PASSWORD@postgres-kg:5432/intuition_kg` |
| Event store | `postgresql://USER:PASSWORD@localhost:5433/intuition_timescale` | `postgresql://USER:PASSWORD@timescale:5432/intuition_timescale` |

[Datastore port mappings](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/docker-compose.datastores.yml) · [Shared configuration parser](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/crates/shared/src/config.rs) · [Ingestion startup](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/crates/rindexer-ingestion/src/main.rs) · [Timescale migration helper](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/scripts/timescale-migrate.sh)

## Ingestion

Stock Compose forwards the four deployment settings and optional last block to the indexing profile. The four required settings in the example environment start empty.

| Setting | Consumer and default |
| --- | --- |
| `INTUITION_RPC_URL` | Required chain RPC, reachable from the indexer. |
| `CHAIN_ID` | Required numeric chain ID. Both the manifest and the running generated network client need it. |
| `MULTIVAULT_CONTRACT_ADDRESS` | Required address of the MultiVault proxy to index. |
| `MULTIVAULT_START_BLOCK` | Required inclusive start block. Use the deployment block for full history. |
| `MULTIVAULT_END_BLOCK` | Optional inclusive last block. Empty follows the head. |
| `RINDEXER_MANIFEST_PATH` | Native binary defaults to `./rindexer.yaml`. The image sets `/rindexer/rindexer.yaml`; its entrypoint renders the template before launch. |
| `METRICS_PORT` | Indexer metrics and health listener defaults to 9091. Compose fixes and publishes 9091. |
| `RINDEXER_HEALTH_PORT` | The entrypoint substitutes this into the manifest. Compose supplies 8080 inside the container. Only the separate metrics listener is published by default. |

[Manifest template](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/crates/rindexer-ingestion/rindexer.yaml) · [Container entrypoint](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/crates/rindexer-ingestion/entrypoint.sh) · [Network client](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/crates/rindexer-ingestion/src/rindexer_lib/typings/networks.rs) · [Indexer image](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/docker/Dockerfile.ingestion)

## Projections

| Setting | Consumer and default |
| --- | --- |
| `SURREAL_DB_URL` | Compose explicitly sets an empty value to select the no-op graph sink. Keep it empty for Postgres-only Core. The standalone parser falls back to `ws://localhost:8000` when the variable is absent. |
| `USE_TYPED_READER` | Compose forwards it with default `true`, selecting the typed event tables including URI context. The standalone binary defaults to `false`. |
| `ENABLED_PROJECTIONS` | Optional comma-separated allowlist. A nonempty list takes precedence over the denylist. Set on the projections process or add a Compose environment mapping. |
| `DISABLED_PROJECTIONS` | Optional comma-separated denylist. Both lists start empty in the binary. When this setting is missing or empty, Compose supplies `funnel_tracker,user_activity_batch,vault_state:dual,vault_holders_index:dual`. |
| `PROJECTIONS_BATCH_SIZE`, `PROJECTIONS_POLL_INTERVAL_MS` | Process defaults of 500 rows and 1000 milliseconds. Neither variable is forwarded by stock Compose. |
| `PROJECTIONS_METRICS_PORT` | Process default 9092. Compose fixes and publishes 9092. Check liveness at `/health/live`. |

[Projection parser and selection rules](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/crates/projections/src/config.rs) · [Reader selection](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/crates/projections/src/main.rs) · [Compose projection settings](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/docker-compose.yml#L254-L279)

## Query API and Explorer

| Setting | Consumer and default |
| --- | --- |
| `API_PORT` | Query API process defaults to 3000. Stock Compose sets the container listener to 3000. |
| `API_AUTH` | Compose forwards `public-read` by default. Graph reads are public and writes need a writable key. In `gated` mode graph reads also require a key; `/health` and `/api/schema` remain public. Reserve `open` for a local disposable node where unattributed writes are intentional. |
| `API_ALLOWED_ORIGINS` | Forwarded comma-separated CORS origin allowlist. Empty allows all origins. Include your Explorer origin when restricting access. |
| `API_ATOM_SEMANTIC_READS_ENABLED` | Forwarded, default `false`. Adds raw input, identity, classification, context, resolution and display fields to atom reads. |
| `VITE_API_URL` | Explorer API base. The client defaults to `http://localhost:3000` when unset. Supply the intended base when building for another host. |
| `VITE_ATOM_SEMANTIC_READS_ENABLED` | Explorer build/start flag, default `false`. Enables the presentation of semantic fields. Enable the API response fields first and rebuild or restart the Explorer with its own setting. |

[Query API parser](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/services/api/src/config.ts) · [API path and write permissions](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/services/api/src/app.ts) · [Explorer client](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/apps/explorer/src/lib/api.ts) · [Presentation flag](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/apps/explorer/src/lib/atom-presentation.ts) · [Explorer build arguments](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/docker/Dockerfile.explorer)

## Workers

The following are worker process defaults. Of these settings, stock Compose forwards the processing scope and the two IID flags. The remaining entries need explicit process configuration to override.

| Setting | Default and effect |
| --- | --- |
| `WORKERS_PORT` | Base health port 4110. Default parse, classification and enrichment listeners use 4110, 4112 and 4111 respectively. Each serves `/healthz`. |
| `WORKERS_CONCURRENCY` | 4 concurrent items per worker. |
| `WORKERS_LEASE_MS`, `WORKERS_MAX_ATTEMPTS` | 60000 ms per stage lease and 5 attempts per stage. Expired claims can be recovered. |
| `WORKERS_PARSE_REMOTE_FETCH` | `true` enables fetching remote input during parsing. Set false for isolated operation. |
| `WORKERS_PARSE_ALLOW_HTTP`, `WORKERS_PARSE_ALLOW_PRIVATE_NETWORKS` | Both `false`. Plain HTTP and requests to private network targets are blocked by default. |
| `WORKERS_PARSE_IPFS_GATEWAY_BASE_URL` | Optional IPFS gateway override, unset by default. |
| `WORKERS_PROCESSING_SCOPE` | `full` by default. `music`, `podcasts` and `music-and-podcasts` restrict enrichment after classification. |
| `WORKERS_IID_READ_ENABLED` | `false`. Enables IID inspection and supplies registry and ladder bindings to the workers. The entrypoint checks the installed package versions when enabled. |
| `WORKERS_IID_RESOLUTION_ENABLED` | `false`. Independently permits provider resolution for IID enrichment plans. Enable worker reads and verify the bindings before enabling resolution. |

Worker IID reads, worker resolution and API semantic reads are **three independent settings**. Turning one on leaves the others at their configured values. Explorer presentation is a fourth, client-side choice. [Worker settings](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/services/workers/src/shared/config.ts) · [Worker entrypoint](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/services/workers/src/index.ts) · [Enrichment decisions](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/services/workers/src/kg/atom-enrichment/index.ts)

## Atom services and provider credentials

| Setting | Consumer and default |
| --- | --- |
| `ATOM_SERVICES_PORT` | Stateless processing service, default 4010. Stock Compose fixes the container listener to 4010. |
| `ATOM_SERVICES_AUTH_TOKEN` | Optional service bearer token, unset by default. To require it, explicitly pass it into the atom-services process or add a service environment mapping. Adding it only to the host `.env` does not require a bearer token in the stock container. The service exempts `/health`, `/ready` and `/metrics`. Query API keys govern a different service. |
| `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET` | Optional Spotify credential pair. Configure both to use authenticated Spotify enrichment. |
| `GITHUB_TOKEN`, `ETHERSCAN_API_KEY`, `BRANDFETCH_API_KEY` | Optional credentials for their respective providers. Public GitHub data can be fetched without a token. |
| `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, `GOOGLE_GENERATIVE_AI_API_KEY` | Reserved search or embedding credentials, blank in the example environment. The stock processing services have no active enrichment wiring for these keys. |

Compose forwards the Spotify pair, GitHub, Etherscan and Brandfetch credentials to the workers and atom services. They start empty. A provider can skip an item or return less data when a credential is absent. [Service parser](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/services/atom-services/src/config.ts) · [Service bearer middleware](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/services/atom-services/src/middleware/auth.ts) · [Provider mappings](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/docker-compose.yml#L80-L136) · [Example credentials](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/example.env#L85-L105)

{/* cspell:words RINDEXER healthz Brandfetch */}
