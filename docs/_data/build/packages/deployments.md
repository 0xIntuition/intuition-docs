---
title: '@0xintuition/deployments guide'
slug: /build/packages/deployments
sidebar_position: 13
---

Resolve the shared ABI, bytecode, address, and chain metadata consumed by all protocol packages.

Candidate source version: **0.1.0**. [Release compatibility](../compatibility.md) explains publication and deployment prerequisites.

## Install

```sh
npm install @0xintuition/deployments@0.1.0 viem@^2
```

Use ESM imports. Required peers: `viem ^2.0.0`.

## Main surface

| Export or operation                        | Purpose                             |
| ------------------------------------------ | ----------------------------------- |
| `getMultiVaultAddressFromChainId(chainId)` | Configured deployment address       |
| `intuitionMainnet / intuitionTestnet`      | Chain definitions                   |
| `MultiVaultAbi`                            | Core ABI                            |
| `/bytecode`                                | Separate deploy-bytecode entrypoint |

## First use

```ts
import {
  getMultiVaultAddressFromChainId,
  intuitionTestnet,
} from '@0xintuition/deployments';
console.log(getMultiVaultAddressFromChainId(intuitionTestnet.id));
```

## Integration decisions

An address lookup does not prove that its deployment implements a candidate ABI. Metalayer bytecode exports are runtime code, and MultiVault bytecode has a library link placeholder. Do not treat every Bytecode export as ready-to-deploy creation code.

## Source and full contract

[Source and package guide](https://github.com/0xIntuition/packages/tree/1dc7103d2a05f23bc565a81df4b001336ce9ba53/packages/deployments) · [npm package](https://www.npmjs.com/package/@0xintuition/deployments). The [machine-readable manifest](/intuition-release.json) lists all declared public subpaths and peer dependencies. Npm links name the intended package; this page does not assert that the candidate has been published.
