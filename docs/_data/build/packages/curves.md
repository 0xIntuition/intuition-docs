---
title: '@0xintuition/curves guide'
slug: /build/packages/curves
sidebar_position: 16
---

Calculate local curve previews and exact-net gross-up quotes using explicit state and parameters.

Candidate source version: **0.1.0**. [Release compatibility](../compatibility.md) explains publication and deployment prerequisites.

## Install

```sh
npm install @0xintuition/curves@0.1.0
```

Use ESM imports.

## Main surface

| Export or operation         | Purpose                                         |
| --------------------------- | ----------------------------------------------- |
| `createLinearCurve()`       | Linear preview implementation                   |
| `grossUpAtomDeposit`        | Gross amount for an exact net atom deposit      |
| `grossUpTripleDeposit`      | Gross amount for an exact net triple deposit    |
| `dynamicFeeQuoteDepositFee` | Dynamic-fee preview from explicit configuration |

## First use

```ts
import { createLinearCurve } from '@0xintuition/curves';
console.log(
  createLinearCurve().previewDeposit(100n, {
    totalAssets: 0n,
    totalShares: 0n,
  }),
);
```

## Integration decisions

Use bigint base units and current fee/curve configuration. Quotes are not execution guarantees. Exact contract parity and overflow/revert behavior are release qualification gates; an exact-net solution need not be the smallest gross solution.

## Source and full contract

[Source and package guide](https://github.com/0xIntuition/packages/tree/1dc7103d2a05f23bc565a81df4b001336ce9ba53/packages/curves) · [npm package](https://www.npmjs.com/package/@0xintuition/curves). The [machine-readable manifest](/intuition-release.json) lists all declared public subpaths and peer dependencies. Npm links name the intended package; this page does not assert that the candidate has been published.
