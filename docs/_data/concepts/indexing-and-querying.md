---
title: "Indexing and querying"
sidebar_label: "Indexing and querying"
description: "Trace a protocol write from receipt to projection on a self-hosted Core node, and distinguish chain indexing from off-chain inserts and worker processing."
kind: concept
reader: ["app", "operator"]
packages: []
depends_on: ["protocol-writes", "atom-runtime"]
---

Indexing makes chain events available to readers of a Core node you run. Its indexer records events, projections turn them into graph records, and workers can parse, classify, and enrich the atoms. V2 applications read the resulting graph through that node’s Query API. A receipt can arrive before the node has ingested and projected the corresponding atom event.

**Builds on:** [Protocol writes](/docs/concepts/protocol-writes), [Atom runtime and pipelines](/docs/concepts/atom-runtime).

**Implemented by:** [Intuition Core](/docs/build/query-core).

## How it works

Fork and clone Intuition Core and build the pinned source. The default Compose stack serves the off-chain graph. To ingest chain events, configure the chain RPC, chain ID, MultiVault address and start block, then enable the `indexing` profile. That profile runs ingestion and projections. [Source setup](/docs/build/query-core), [Compose services](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/docker-compose.yml).

The indexer decodes events into the TimescaleDB event store. Projections record their progress in checkpoints as they populate read models and copy atoms and triples into the Postgres knowledge graph. Workers claim atom processing stages and persist outcomes there. The API reads from the knowledge graph, so an atom can be visible while enrichment is pending or has failed. [Architecture](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/docs/architecture.md), [data model](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/docs/data-model.md).

The node also accepts off-chain inserts. Under its default public-read policy, a writable key authorizes `POST /api/atoms` with an `input` string. A successful insert creates a node-local record. Registering the same bytes on-chain requires a separate protocol write and indexing its event. [Query API contract](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/docs/openapi.yaml).

There is no V2 GraphQL endpoint yet; one is planned for Intuition Core. The V1 GraphQL API is documented in the [V1 docs](/docs/v1/graphql-api/overview).

## Example

A catalog derives an atom ID for its chosen recording bytes. Keep that ID throughout the following checks.

| Observation | What the catalog knows |
| --- | --- |
| A wallet returns a transaction hash | It can track the submitted transaction on the chosen chain. |
| A successful receipt for the creation includes the atom event | The write executed. The catalog's node might still be behind that block. |
| `GET /api/atoms/{id}` returns the atom | The node can serve that record. Inspect `isOnchain` to distinguish an indexed chain record from an off-chain insert. |
| The atom has processing statuses | Read `parseStatus`, `classificationStatus`, and `enrichmentStatus` separately. Inspect available artifacts at `GET /api/atoms/{id}/artifacts` before displaying provider evidence. |

If the receipt is successful and the atom is absent, check the node's chain, MultiVault address, block range, and projection progress. Repeating the chain write would address none of these causes. [Query a Core node](/docs/build/query-core).

## Common mistakes

- Assuming an off-chain insert will publish itself. The API response records what happened on that node. A chain submission requires separate authorization.
- Expecting semantic fields after enabling one flag. `API_ATOM_SEMANTIC_READS_ENABLED`, `WORKERS_IID_READ_ENABLED`, and `WORKERS_IID_RESOLUTION_ENABLED` each default to false. The API setting controls presentation. The worker settings control IID reads and provider resolution. Use the documented response fields and inspect the actual processing state. [Configuration](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/docs/configuration.md), [worker defaults](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/services/workers/src/shared/config.ts).
- Using a seeded predicate's label to prepare a protocol triple. Verify the canonical predicate data and ID before constructing the triple. [Predicate registry](/docs/reference/packages/predicates).

## Next

[Query a Core node](/docs/build/query-core) walks through building the source, selecting the indexing profile, and reading your own graph.
