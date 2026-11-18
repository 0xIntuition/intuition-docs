---
title: Test locally
sidebar_label: Test locally
description: Choose a funded testnet account or build a local Anvil deployment and follow its indexed atoms through your own Core node.
kind: how-to
reader: ["app"]
packages: ["@0xintuition/deployments"]
---

<AppliesTo />

Test a contract interaction on Intuition testnet, or deploy on your own Anvil chain and trace a new atom into Core.

## Before you start

Choose testnet to exercise a shared deployment or Anvil to control the chain, deployment and indexing start block. Review [package installation](/docs/build/install) and [how indexing works](/docs/concepts/indexing-and-querying). Testnet writes require a throwaway account you control. For Anvil, use a trusted development machine with Git, Docker Compose v2, Bun 1.3.11, Node 20 or newer, `curl`, `jq`, and at least 5 GiB free. The first build needs network access for dependencies and images.

## Steps

### 1. Choose your test route

**Testnet.** Check that your client reports chain 13579 and resolves the published testnet MultiVault using [Connect to a network](/docs/build/connect). For a write, request tTRUST for your test account's public address, then follow the first-write walkthrough to review the atom, payment and gas before confirming. Check for a successful receipt and record its term ID. If you also index testnet, use a start block verified for that exact contract. Core's upstream smoke-test window uses a historical deployment. [Testnet faucet](https://testnet.hub.intuition.systems/) · [First testnet write](/docs/get-started/first-write) · [Deployment definitions](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/packages/contracts/src/addresses.ts).

**Local Anvil.** Continue below for chain 31337. The deployer sends transactions only on your local chain when run with these Compose services. Use an isolated development machine for the stock configuration. On a shared or reachable host, bind published ports to loopback, including Anvil (`127.0.0.1:8545:8545`), Postgres, TimescaleDB and Redis. Replace the development database credentials before startup. Keep Anvil’s listener inside its container reachable by the deployer and indexer. [Run a local devnet](/docs/core/local-devnet) · [Anvil port mapping](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/docker-compose.yml#L187-L192)

### 2. Fork Core and prepare the pinned source

Fork the Core repository, replace `YOUR_GITHUB_USERNAME` with the owner of your fork, and run these commands in the directory where you want to keep the clone. Verify the printed commit before proceeding. Bootstrap creates `.env` from `example.env` if needed and installs the frozen Bun lockfile. [Pinned bootstrap script](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/scripts/bootstrap.sh).

```sh
git clone https://github.com/YOUR_GITHUB_USERNAME/intuition-core.git
cd intuition-core
git remote add upstream https://github.com/0xIntuition/intuition-core.git
git fetch upstream a402f880600f92969dc8fb013ca0f69fc9a02420
git switch -c local-devnet a402f880600f92969dc8fb013ca0f69fc9a02420
git rev-parse HEAD
scripts/bootstrap.sh --no-start
```

### 3. Deploy the local MultiVault and read its state file

Start Anvil, then run the source-built deployment job in the foreground. Continue only after it prints `==> DONE` and exits successfully. It writes its state file before running the acceptance transaction, which creates a local atom and checks its events. Rerunning the job can create another acceptance atom even when it reuses the contracts. [Deployer](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/packages/contracts/src/deploy/cli.ts) · [Acceptance transaction](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/packages/contracts/src/deploy/acceptance.ts).

```sh
docker compose -f docker-compose.yml --profile devnet up -d anvil &&
  docker compose -f docker-compose.yml --profile devnet run --build --rm devnet-deploy
```

Compose mounts `./devnet` from the host at `/state` in the deployer. Inspect the generated proxy and the block where it was deployed.

```sh
jq -e 'select(.chainId == 31337) | {chainId, MultiVault, deployBlock}' \
  devnet/deployments-devnet.json
```

### 4. Index that deployment

In the Core checkout's `.env`, edit the existing entries shown below. Replace the two placeholders with the exact `MultiVault` address and decimal `deployBlock` from step 3. Keep `MULTIVAULT_END_BLOCK` empty to follow the local head. The indexer runs inside Compose and reaches Anvil by service name. Host-side RPC clients reach the same chain at `http://localhost:8545`. [Environment settings](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/example.env).

```dotenv
INTUITION_RPC_URL=http://anvil:8545
CHAIN_ID=31337
MULTIVAULT_CONTRACT_ADDRESS=<your generated MultiVault>
MULTIVAULT_START_BLOCK=<your generated deployBlock>
MULTIVAULT_END_BLOCK=
USE_TYPED_READER=true
```

Enable both profiles and build the graph services from the pinned Compose file. Naming the services starts their datastore and migration dependencies and leaves the completed deployment job out of this step. From the host, check the API once the database migrations finish. [Source Compose file](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/docker-compose.yml).

```sh
docker compose -f docker-compose.yml --profile devnet --profile indexing up -d --build \
  anvil api indexer projections
curl -fsS http://localhost:3000/health
```

## Check the result

A healthy API can still be catching up to Anvil. Request one public atom. This command uses port 3000, the default host mapping. If the page is empty, expect `count: 0` and `firstId: null`.

```sh
page=$(curl -fsS 'http://localhost:3000/api/atoms?limit=1&offset=0') &&
  printf '%s\n' "$page" | jq '{pagination, firstId: .data[0].id}'
```

Once the page contains a term ID, fetch that record. Compare its ID with the term ID in the deployer's acceptance output when inspecting the same atom. Look for `isOnchain: true` on the atom projected from Anvil. The parse status can remain pending with the processing workers stopped.

```sh
atom_id=$(printf '%s\n' "$page" | jq -er '.data[0].id | strings | select(test("^0x[0-9a-fA-F]{64}$"))') &&
  curl -fsS "http://localhost:3000/api/atoms/$atom_id" | jq '.data | {id, isOnchain, parseStatus}'
```

## Troubleshooting

| Symptom | Next check |
| --- | --- |
| Deployment job exits with an error | Read the error and verify the Anvil service is healthy. A state file may already exist even if acceptance failed. |
| Empty page after the API becomes healthy | Inspect `docker compose -f docker-compose.yml logs indexer projections`. Check the configured chain, proxy address and start block against the active deployment. |
| Testnet receipt succeeds but the local API has no record | Confirm that this Core instance is indexing the testnet contract and that its configured range covers the transaction's block. |

## Related

[Query a Core node](/docs/build/query-core) covers host ports, read policies and graph operations. The pinned [local devnet guide](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/docs/local-devnet.md) describes Anvil state persistence.
