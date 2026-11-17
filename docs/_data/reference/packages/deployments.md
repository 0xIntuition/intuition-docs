---
title: '@0xintuition/deployments'
sidebar_label: 'Deployments'
description: 'Select pinned chain metadata, contract addresses, ABIs, and separately imported bytecode.'
kind: reference
reader: ["app"]
packages: ["@0xintuition/deployments"]
---

<AppliesTo />

## What it's for

The shared source of contract ABIs, deployment addresses, chain definitions, and bytecode consumed by the protocol packages. Address selection is a local lookup; it does not query or deploy a contract.

## When to use it

Use it when you need metadata without the protocol wrapper layer. Use [protocol](/docs/reference/packages/protocol) for contract operations. A configured address proves that the pinned map contains an entry, not that its live implementation has a particular capability.

## Install

```sh
npm install @0xintuition/deployments@0.1.0 viem@2.31.4
```

Use ESM on Node 20+ or a compatible browser.

## Entry points

| Subpath | Purpose |
| --- | --- |
| `.` | Contract ABIs, address maps, chain definitions, and lookup helpers |
| `./bytecode` | Separate contract bytecode exports |

Bytecode stays off the root entry point so address and ABI consumers need not include it.

## Depends on and works with

Runtime package dependencies: none. Peer dependency: `viem ^2.0.0`.

Protocol, periphery, SDK, CLI, and React integrations share this metadata. Core and periphery address maps have different supported contract/chain combinations. The named Intuition chain definitions describe mainnet and testnet; Base and Base Sepolia addresses appear for applicable Base-side contracts.

## Example

Select the testnet chain and its pinned MultiVault entry without a request:

{/* example:start examples/v2/first-write/src/package-examples.ts#deployment-selection */}
```ts
import {
  getMultiVaultAddressFromChainId,
  intuitionTestnet,
} from '@0xintuition/deployments';

export const target = {
  chainId: intuitionTestnet.id,
  address: getMultiVaultAddressFromChainId(intuitionTestnet.id),
};
console.log(target);
```
{/* example:end */}

`getContractAddressFromChainId` and the named core helpers throw when neither an override nor the canonical table supplies an address. Core helpers accept optional `AddressOverrides`; keep overrides specific to the intended deployment. This example reports metadata only, with no claim of a live testnet receipt or current deployment validation.

ABIs and bytecode have distinct uses. Metalayer `MetaERC20Hub`, `MetaERC20Spoke`, and `MetaNativeSpoke` bytecode exports contain deployed runtime code, not creation code. `MultiVaultBytecode` contains an unresolved library link placeholder; link it with the matching contract build's references before any deployment. Do not treat every bytecode export as ready to deploy.

## Related concepts

[Protocol writes](/docs/concepts/protocol-writes) explains why an action needs both a chain and a compatible target.

## Source

[Package README](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/deployments/README.md), [lookup helpers](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/deployments/src/helpers.ts), and [contract artifact provenance](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/docs/contract-artifacts.md).
