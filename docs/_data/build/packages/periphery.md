---
title: '@0xintuition/periphery guide'
slug: /build/packages/periphery
sidebar_position: 15
---

Use direct FeeProxy, router, and meta-bridge wrappers and encoders.

Candidate source version: **0.1.0**. [Release compatibility](../compatibility.md) explains publication and deployment prerequisites.

## Install

```sh
npm install @0xintuition/periphery@0.1.0 viem@^2
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

[Source and package guide](https://github.com/0xIntuition/packages/tree/1dc7103d2a05f23bc565a81df4b001336ce9ba53/packages/periphery) · [npm package](https://www.npmjs.com/package/@0xintuition/periphery). The [machine-readable manifest](/intuition-release.json) lists all declared public subpaths and peer dependencies. Npm links name the intended package; this page does not assert that the candidate has been published.
