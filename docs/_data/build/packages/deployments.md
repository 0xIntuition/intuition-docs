---
title: '@0xintuition/deployments guide'
slug: /build/packages/deployments
sidebar_position: 15
---

Resolve the shared ABI, bytecode, address, and chain metadata consumed by all protocol packages.

Published alpha version: **0.1.0-alpha.1**. [Release compatibility](../compatibility.md) records npm publication, peer dependencies, and deployment boundaries.

## Install

```sh
npm install @0xintuition/deployments@0.1.0-alpha.1 viem@^2
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

[Source and package guide](https://github.com/0xIntuition/packages/tree/dde4fdf5774447b84cd0b820593fb0db7366e58d/packages/deployments) · [npm package](https://www.npmjs.com/package/@0xintuition/deployments/v/0.1.0-alpha.1). The [machine-readable manifest](/intuition-release.json) lists all declared public subpaths and peer dependencies. Exact npm versions, tarball integrity, and observed dist-tags are recorded in the manifest.
