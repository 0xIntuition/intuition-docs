---
title: Run your own node
sidebar_label: Run your own node
description: Build Core from a pinned fork, check local services and enable indexing to read an on-chain atom.
kind: how-to
reader: ["operator"]
packages: []
---

Build a Core node from your fork and verify that it can serve an atom from the chain you choose.

## Before you start

Install Git, Docker with Compose v2, Bun 1.3.11, Node 20 or newer, and `curl`. Start the Docker daemon and leave at least 5 GiB free. The first build downloads packages and supporting images. The initial read checks use the default ports and public-read mode. [Core workspace](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/package.json) · [Bootstrap checks](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/scripts/bootstrap.sh)

## Steps

### 1. Fork and pin Core

Fork [Intuition Core](https://github.com/0xIntuition/intuition-core/tree/a402f880600f92969dc8fb013ca0f69fc9a02420) into your account. Replace `YOUR_GITHUB_USERNAME` with the owner of your fork.

```sh
git clone https://github.com/YOUR_GITHUB_USERNAME/intuition-core.git
cd intuition-core
git remote add upstream https://github.com/0xIntuition/intuition-core.git
git fetch upstream a402f880600f92969dc8fb013ca0f69fc9a02420
git switch -c local-node a402f880600f92969dc8fb013ca0f69fc9a02420
git rev-parse HEAD
git branch --show-current
```

Before building, check that the last two commands print the full commit above and `local-node`. Run the remaining commands from the repository root.

### 2. Build the services and check the data stores

```sh
scripts/bootstrap.sh --no-start
docker compose -f docker-compose.yml up -d --build
COMPOSE_FILE=docker-compose.yml scripts/bootstrap.sh --skip-install
docker compose -f docker-compose.yml ps -a
curl -fsS http://localhost:3000/health
curl -fsS http://localhost:3000/api/stats
curl -fsS http://localhost:3000/api/predicates
```

Bootstrap creates `.env` if absent and installs the frozen Bun dependencies. Compose builds Core from the selected source. The final bootstrap call waits for the Query API. Expect the two database migration jobs to exit successfully, the health response to contain `"status":"ok"`, and the last requests to return JSON. A fresh graph can have zero atoms.

The default stack runs a knowledge graph in Postgres, a Timescale event store, Redis, three workers for parsing, classification and enrichment, the Query API on 3000, and stateless atom services on 4010. The Explorer runs separately on 3100. Chain ingestion and projections start with the indexing profile. [Service definitions](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/docker-compose.yml) · [Datastore definitions](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/docker-compose.datastores.yml) · [Explorer startup](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/README.md#the-explorer)

### 3. Select a deployment and enable indexing

For a first atom on a chain you control, follow [Run a local devnet](/docs/core/local-devnet). For an existing deployment, set these values in `.env` from its deployment record and RPC provider:

| Setting | Value to supply |
| --- | --- |
| `INTUITION_RPC_URL` | RPC for that chain, reachable from the indexer container. |
| `CHAIN_ID` | Numeric chain ID for that RPC and deployment. |
| `MULTIVAULT_CONTRACT_ADDRESS` | MultiVault proxy that emitted the events you want. |
| `MULTIVAULT_START_BLOCK` | Verified deployment block for that proxy to capture its full history, or a later start for a deliberately partial history. |
| `MULTIVAULT_END_BLOCK` | Optional inclusive last block. Leave empty to follow the chain head. |

Keep the RPC, chain ID, proxy and block range together. An example start block from another deployment on the same network can skip events. For a bounded check, choose a window containing a known `AtomCreated` receipt and keep its term ID.

```sh
docker compose -f docker-compose.yml --profile indexing up -d --build
COMPOSE_FILE=docker-compose.yml scripts/bootstrap.sh --indexing --skip-install
```

For the default host ports, `make status` lists the services and `make logs SERVICE=indexer` follows ingestion logs. [Operator commands](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/Makefile)

Use **one ingester** for a given store and scope. Compose provides Redis, but the pinned Rust indexer starts its event handlers without acquiring a Redis leader lock. [Ingestion startup](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/crates/rindexer-ingestion/src/main.rs) · [Event handlers](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/crates/rindexer-ingestion/src/handlers.rs)

## Check the result

Paste the term ID from the `AtomCreated` event into the prompt. The default public read requires no API key.

```sh
printf 'Term ID from the receipt: '
read -r TERM_ID
curl -fsS "http://localhost:3000/api/atoms/${TERM_ID}"
```

For a fresh on-chain atom, expect `data.id` to equal that term ID and `data.isOnchain` to be `true`. The indexer records the event in Timescale, then the core entities projection writes the public KG row. Parsing and enrichment can still be pending. A healthy API alone confirms access to the KG. Creating an off-chain atom through `POST /api/atoms` bypasses ingestion. [Core entities projection](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/crates/projections/src/projection/dual/core_entities.rs) · [Query a Core node](/docs/build/query-core)

## Troubleshooting

On a 404, compare the receipt’s emitting contract and block with the configured window, then inspect indexer progress and projection checkpoints. An empty window produces no matching rows. A prior off-chain row at the same ID keeps its existing chain flag when the projection encounters the ID again. Check the receipt and stored event separately. [Troubleshooting](/docs/core/troubleshooting)

## Related

[Configuration](/docs/core/configuration) · [Scope what you index](/docs/core/indexing-scope) · [Upstream node guide](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/docs/run-your-own-node.md)
