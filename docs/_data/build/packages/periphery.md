---
title: '@0xintuition/periphery guide'
slug: /build/packages/periphery
sidebar_position: 17
---

Use direct FeeProxy, router, and meta-bridge wrappers and encoders.

Published alpha version: **0.1.0-alpha.1**. [Release compatibility](../compatibility.md) records npm publication, peer dependencies, and deployment boundaries.

## Install

```sh
npm install @0xintuition/periphery@0.1.0-alpha.1 viem@^2
```

Use ESM imports. Required peers: `viem ^2.0.0`.

## Main surface

| Export or operation                             | Purpose                                  |
| ----------------------------------------------- | ---------------------------------------- |
| `getFeeProxyAddressFromChainId(chainId)`        | FeeProxy deployment lookup               |
| `getMetaNativeSpokeAddressFromChainId(chainId)` | Native spoke lookup                      |
| `feeProxyPendingRefund`                         | Read the pull-refund ledger              |
| `feeProxyClaimRefundToEncode`                   | Encode a refund claim without submitting |

## First use

```ts
import { getFeeProxyAddressFromChainId } from '@0xintuition/periphery';
console.log(getFeeProxyAddressFromChainId(13579));
```

## Integration decisions

The candidate router address lookup throws while a matching redeployment is pending. Bridge support differs by chain; do not infer testnet bridge availability from FeeProxy support.

## Source and full contract

[Source and package guide](https://github.com/0xIntuition/packages/tree/dde4fdf5774447b84cd0b820593fb0db7366e58d/packages/periphery) · [npm package](https://www.npmjs.com/package/@0xintuition/periphery/v/0.1.0-alpha.1). The [machine-readable manifest](/intuition-release.json) lists all declared public subpaths and peer dependencies. Exact npm versions, tarball integrity, and observed dist-tags are recorded in the manifest.
