---
title: Connect to a network
sidebar_label: Connect to a network
description: Select a network, verify its RPC chain ID, and read the atom creation cost from the MultiVault deployed there.
kind: how-to
reader: ["app"]
packages: ["@0xintuition/deployments", "@0xintuition/protocol"]
---

<AppliesTo />

Connect a read-only client to Intuition mainnet, testnet, or local Anvil and verify the MultiVault by reading its atom creation cost.

## Before you start

Use Node 22.21.0 and the dependencies in the [pinned install guide](/docs/build/install). The commands below run from a checkout of the docs repository containing the example. Install its dependencies with `npm ci --prefix examples/v2 --ignore-scripts`. For Anvil, complete the deployment step in [Test locally](/docs/build/test-locally) first. The helper needs only the public RPC and contract address. [Complete connection helper](https://github.com/0xIntuition/intuition-docs/blob/bb420395aff3432f1f5da08cb76ac75a99945bff/examples/v2/first-write/src/connect-guide.ts).

## Steps

### 1. Choose the chain and deployment together

| Target | Chain ID | RPC seen by the caller | MultiVault source |
| --- | --- | --- | --- |
| Intuition mainnet | 1155 | `https://rpc.intuition.systems/http` | Mainnet package entry |
| Intuition testnet | 13579 | `https://testnet.rpc.intuition.systems/http` | Testnet package entry |
| Local Anvil | 31337 | `http://localhost:8545` on the host, `http://anvil:8545` inside Core's Compose network | `.MultiVault` from your completed deployment's `devnet/deployments-devnet.json` |

The deployments package resolves an override for the named contract and chain first, then consults its built-in table. A missing entry throws. The package has no built-in MultiVault for 31337, so copy the proxy address generated for your running Anvil. [Network definitions](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/deployments/src/networks.ts) and [address lookup](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/deployments/src/helpers.ts).

{/* example:start examples/v2/first-write/src/connect-guide.ts#choose-network */}
```ts
import {
  getMultiVaultAddressFromChainId,
  intuitionMainnet,
  intuitionTestnet,
} from '@0xintuition/deployments';
import { multiVaultGetAtomCost } from '@0xintuition/protocol';
import {
  createPublicClient,
  getAddress,
  http,
  isAddress,
  zeroAddress,
} from 'viem';
import { foundry } from 'viem/chains';

export function networkSettings(args: string[]) {
  const [name, deployedAddress] = args;
  if (args.length === 1 && (name === 'mainnet' || name === 'testnet')) {
    const chain = name === 'mainnet' ? intuitionMainnet : intuitionTestnet;
    return {
      chain,
      rpc: chain.rpcUrls.default.http[0],
      address: getMultiVaultAddressFromChainId(chain.id),
    };
  }

  if (args.length !== 2 || (name !== 'local' && name !== 'local-container'))
    throw new Error(
      'Choose mainnet, testnet, local ADDRESS or local-container ADDRESS.',
    );
  if (
    deployedAddress?.length !== 42 ||
    !isAddress(deployedAddress) ||
    deployedAddress === zeroAddress
  )
    throw new Error(
      'Supply the MultiVault proxy address from your local deployment.',
    );
  return {
    chain: foundry,
    rpc: name === 'local' ? 'http://localhost:8545' : 'http://anvil:8545',
    address: getMultiVaultAddressFromChainId(foundry.id, {
      MultiVault: { [foundry.id]: getAddress(deployedAddress) },
    }),
  };
}
```
{/* example:end */}

### 2. Verify the chain before calling the contract

The client asks the RPC for its actual chain ID. After a match, `multiVaultGetAtomCost` reads the selected MultiVault's base creation cost in wei. Run one command for your chosen network.

{/* example:start examples/v2/first-write/src/connect-guide.ts#verify-connection */}
```ts
export async function connect(args: string[]) {
  const { chain, rpc, address } = networkSettings(args);
  const publicClient = createPublicClient({
    chain,
    transport: http(rpc, { timeout: 5000, retryCount: 0 }),
  });
  const actual = await publicClient.getChainId();
  if (actual !== chain.id)
    throw new Error(
      `Expected chain ${chain.id}, but the RPC returned ${actual}.`,
    );
  const atomCost = await multiVaultGetAtomCost({ publicClient, address });
  return {
    chainId: actual,
    multiVault: address,
    atomCostWei: atomCost.toString(),
  };
}
```
{/* example:end */}

```sh
node examples/v2/first-write/src/connect-guide.ts testnet
```

Use `mainnet` for mainnet. For a local read on your host, set `CORE_DIR` to your Core checkout and use the file produced by the successful deployment job. With `jq` installed, run the following command from the docs checkout.

```sh
vault=$(jq -er 'select(.chainId == 31337) | .MultiVault' "$CORE_DIR/devnet/deployments-devnet.json") &&
  node examples/v2/first-write/src/connect-guide.ts local "$vault"
```

An application running inside the same Compose network can use `local-container` with that address. Anvil's service name resolves there. A browser or Node process running on the host uses `localhost`.

## Check the result

The CLI prints `chainId`, `multiVault` and a decimal string named `atomCostWei`. Compare the chain ID to the table and, on Anvil, the proxy to the generated deployment file. The observed cost belongs to that contract at read time. Mainnet uses TRUST and testnet uses tTRUST, each with 18 decimal places. [Public deployment table](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/deployments/src/deployments.ts).

## Troubleshooting

| Result | What to check |
| --- | --- |
| Unexpected chain ID | Confirm which RPC the selected environment reaches. |
| Connection refused on 31337 | Check Anvil is running and choose the hostname for your calling process. |
| Missing address, empty return data, or reverted read | Verify the proxy belongs to this chain and still has the expected contract after any local redeployment. |

## Related

[Protocol writes](/docs/concepts/protocol-writes) explains what changes when you introduce a signer. To read indexed atoms and triples, [query your own Core node](/docs/build/query-core).
