---
title: Run a local devnet
sidebar_label: Run a local devnet
description: Run a local Anvil chain, deploy the contracts from source tooling and follow an indexed atom into Core.
kind: tutorial
reader: ["operator", "app"]
packages: []
---

**Time:** 30 minutes · **Steps:** 4

## What you'll build

Run an Anvil chain on your machine, deploy the real protocol contracts, and find the deployer's acceptance atom in your own Core Query API. The time is a planning estimate. Initial downloads and compilation depend on your machine.

## Before you start

Use Git, a running Docker daemon with Compose v2, Bun 1.3.11, Node 20 or newer, `curl`, `jq` and at least 5 GiB of free space. Use a local environment you control. The deployer sends transactions on this disposable development chain using its built-in local account. [Core workspace](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/package.json) · [Local chain configuration](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/docker-compose.yml#L187-L220)

## Steps

### 1. Prepare the pinned fork

Fork [Intuition Core](https://github.com/0xIntuition/intuition-core/tree/a402f880600f92969dc8fb013ca0f69fc9a02420), replace the username and run:

```sh
git clone https://github.com/YOUR_GITHUB_USERNAME/intuition-core.git
cd intuition-core
git remote add upstream https://github.com/0xIntuition/intuition-core.git
git fetch upstream a402f880600f92969dc8fb013ca0f69fc9a02420
git switch -c local-devnet a402f880600f92969dc8fb013ca0f69fc9a02420
git rev-parse HEAD
git branch --show-current
```

Once the output matches the pinned commit and branch `local-devnet`, run `scripts/bootstrap.sh --no-start`. This prepares `.env` and installs the frozen dependencies. If you already have a fork at that commit, use its working branch and check its name before continuing.

### 2. Start the chain and deploy

```sh
docker compose -f docker-compose.yml --profile devnet up -d --build anvil devnet-deploy
```

Anvil runs chain 31337 and persists its state in a Docker volume. The one-shot deployer waits for a healthy chain, deploys the contracts from pinned artifacts, then creates a unique atom with URI context. On subsequent runs it can reuse the recorded deployment if the chain, deployer and proxy code match. Each acceptance run still creates a new local atom. [Deploy CLI](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/packages/contracts/src/deploy/cli.ts) · [Deployment sequence](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/packages/contracts/src/deploy/system.ts)

### 3. Verify the deployment before using its address

Wait for the one-shot container and inspect its logs. A successful detached startup only means Docker started the job.

```sh
job_id=$(docker compose -f docker-compose.yml --profile devnet ps -a -q devnet-deploy)
if [ -n "$job_id" ] && [ "$(docker wait "$job_id")" = 0 ]; then
  docker logs "$job_id"
  jq '{chainId, MultiVault, deployBlock}' devnet/deployments-devnet.json
else
  docker compose -f docker-compose.yml --profile devnet logs devnet-deploy
  printf '%s\n' 'Deployment incomplete. Resolve the error before indexing.' >&2
fi
```

Proceed only after exit code 0 and the log lines `ACCEPTANCE PASSED` and `DONE`. Save the printed transaction hash, block and `termId`. Acceptance checks the receipt for both `AtomCreated` and `AtomContextRegistered` with that term ID and checks the URI bytes. The CLI writes the state file **before** acceptance, so file existence alone is insufficient. [Acceptance checks](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/packages/contracts/src/deploy/acceptance.ts) · [State file ordering](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/packages/contracts/src/deploy/cli.ts#L152-L172)

### 4. Point Core at the accepted deployment

Edit the existing entries in `.env`. Set `MULTIVAULT_CONTRACT_ADDRESS` to the exact `MultiVault` from step 3 and `MULTIVAULT_START_BLOCK` to the numeric `deployBlock`. Confirm the recorded `chainId` is 31337. Set the remaining entries as follows:

```text
INTUITION_RPC_URL=http://anvil:8545
CHAIN_ID=31337
MULTIVAULT_END_BLOCK=
USE_TYPED_READER=true
```

Containers reach Anvil by service name. Host tools reach it at `http://localhost:8545`. Leave the end block empty so the ingester follows the local chain. The typed reader consumes the event tables used by the graph and URI-context projections. [Local settings](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/example.env#L49-L70)

## Run it

```sh
docker compose -f docker-compose.yml --profile devnet --profile indexing up -d --build
docker compose -f docker-compose.yml --profile devnet --profile indexing ps -a
curl -fsS http://localhost:3000/health
printf 'Paste the acceptance term ID: '
read -r TERM_ID
curl -fsS "http://localhost:3000/api/atoms/${TERM_ID}"
```

Expect the ingester to record the receipt's event and the core entities projection to insert a public KG row. In the detail response, `data.id` should match your saved term ID and `data.isOnchain` should be `true`. If the API is healthy but returns 404 for this ID, check whether the indexer has reached the receipt's block, then check projection progress. Keep the original term ID if the deployer runs again. [Event handlers](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/crates/rindexer-ingestion/src/handlers.rs) · [Troubleshooting](/docs/core/troubleshooting)

## Next steps

To try two repeatable IID fixtures, review the [fixture script](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/packages/contracts/scripts/devnet-create-iid-fixtures.ts) before running `bun run devnet:fixtures:iid` against your local Anvil instance. It requires a state file for chain 31337, defaults to the local RPC, checks whether each term exists, then simulates and submits a local transaction for each missing term. It reports `created` or `already-created` and prints term IDs you can use with the same atom detail request. [Query a Core node](/docs/build/query-core)

When finished, stop the stack while preserving the databases and Anvil state. [Core devnet guide](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/docs/local-devnet.md)

```sh
docker compose -f docker-compose.yml --profile devnet --profile indexing down
```
