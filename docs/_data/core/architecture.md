---
title: "Architecture"
sidebar_label: "Architecture"
description: "Trace a chain event through the event store, graph projections and processing workers to the Query API."
kind: concept
reader: ["operator"]
packages: []
---

A successful receipt containing MultiVault’s `AtomCreated` log records the creation of an atom on that chain. To read that atom from your own Core node, the node must first index the event and project it into its knowledge graph. You can also create an atom directly in that local graph.

## How it works

### Follow one atom from the chain

Suppose MultiVault emits `AtomCreated` for the UTF-8 bytes of `hello`. Those bytes are also written as `0x68656c6c6f`. Both representations produce the atom ID `0xa0e157e5fa1b17d3b54ec73622ce3317296920a06502661617613d59f58e947e`. A triple has its own ID derived from three term IDs in subject, predicate, object order. This lets a reader start with the same data and find the same term across stores. [ID derivation](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/packages/database-kg/src/actions/ids.ts) · [Known-answer tests](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/packages/database-kg/src/actions/ids.test.ts)

1. **Ingest the log.** With the indexing profile enabled for that chain and MultiVault, the Rust indexer decodes the log. It writes the event to TimescaleDB’s `event_store` and its typed `atom_created_events` table in one transaction. The two rows share a sequence number. The transaction hash and log index let you trace the specific emission. [Ingestion storage](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/crates/rindexer-ingestion/src/storage.rs) · [Event store migration](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/migrations/timescale/001_create_event_store.sql)
2. **Project it into the graph.** The `core_entities` projection reads from its saved checkpoint. It writes the term to TimescaleDB, then writes the atom to `kg.nodes` in a separate Postgres database. An indexed triple goes into `kg.triples`. Other projections maintain market read models such as vaults and positions in TimescaleDB, with their own checkpoints. Each checkpoint records progress for a projection and its destination, so a restart can replay a batch. [Projection writes](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/crates/projections/src/projection/dual/core_entities.rs) · [Checkpoint handling](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/crates/projections/src/worker/core_entities.rs)
3. **Process and read the node.** A newly indexed public atom starts with pending worker stages. Parsing interprets its input, classification assigns a type, and enrichment can attach provider artifacts. The Query API serves the public graph from Postgres. You can use `GET /api/atoms/{id}` while enrichment is still pending. For triples, Postgres keeps six indexes, one for every ordering of subject, predicate and object. A predicate-first lookup can use its own index even though the triple ID always uses subject first. The adjacency table also indexes relationships by source and neighbor. [Data model](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/docs/data-model.md) · [Graph schema and indexes](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/packages/database-kg/drizzle/0000_kg_core_init.sql)

### Start with the local graph

Send `{"input":"hello"}` to `POST /api/atoms` with write access. A new local atom returns HTTP 201 and the same ID as above. Sending the same input again returns HTTP 200 with `created: false`. This path writes to the KG and queues the same processing stages without submitting a chain transaction. If an on-chain creation arrives later, the projection skips the existing node on ID conflict. Its `isOnchain` field can remain false even after the event was indexed. Use the receipt and corresponding event-store row to trace the chain creation. [Creation handler](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/services/api/src/app.ts) · [Node persistence](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/packages/database-kg/src/actions/nodes.ts) · [Projection conflict handling](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/crates/projections/src/projection/dual/core_entities.rs)

### Locate a delay

The default stack serves the local graph. Chain ingestion and projections require the `indexing` profile, and Explorer runs separately as an API client. Run one ingester for the configured scope. Compose supplies Redis and the shared configuration names `REDIS_LEADER_KEY` and `REDIS_LEADER_TTL_SEC`, but the ingestion entrypoint starts indexing without acquiring that lock. [Compose profiles](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/docker-compose.yml) · [Ingestion entrypoint](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/crates/rindexer-ingestion/src/main.rs) · [Indexer startup](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/crates/rindexer-ingestion/src/handlers.rs)

| What you can see | What to check next |
| --- | --- |
| A successful receipt, but no matching event | Check that the indexer follows the receipt’s chain and MultiVault address, and that its block range includes the receipt block. Compare the block hash with the canonical chain if a reorganization is possible. |
| A matching event, but no public atom | Compare the event sequence with the core entities projection’s checkpoint. Read the KG on the same node by term ID. Market projection progress is independent. |
| A public atom with incomplete processing | Inspect the stage, attempts and lease expiry. An expired lease allows another worker to claim unfinished work while attempts remain. After the cap, an expired claim can become a terminal failure. Use the recorded stage error to diagnose it. |

[Architecture overview](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/docs/architecture.md) · [Checkpoint schema](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/migrations/timescale/003_create_projection_checkpoints.sql) · [Worker lease recovery](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/services/workers/src/kg/atom-parsing/index.ts)

## Related

- [Query a Core node](/docs/build/query-core) to read the atom, its relationships and artifacts through your own Query API.
- [How Core uses the packages](/docs/core/packages) identifies the libraries behind identity and processing.
