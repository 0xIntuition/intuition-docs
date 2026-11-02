---
title: '@0xintuition/curves guide'
slug: /build/packages/curves
sidebar_position: 18
---

Calculate local curve previews and exact-net gross-up quotes using explicit state and parameters.

Published alpha version: **0.1.0-alpha.1**. [Release compatibility](../compatibility.md) records npm publication, peer dependencies, and deployment boundaries.

## Install

```sh
npm install @0xintuition/curves@0.1.0-alpha.1
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

## Curve and fee families

All functions are exported from the package root; source module names are not additional import subpaths. Linear, progressive, and offset-progressive families expose factories, conversion, price, and deposit/mint/redeem/withdraw previews. Fee helpers expose atom/triple deposit previews, fee breakdowns, and exact-net gross-up for creation or deposits.

Dynamic-fee helpers include tier ladders and deposit bands, lot-aware redemption quotes, `dynamicFeeDistributeDeposit`, `dynamicFeeDistributeRedeem`, and `dynamicFeeProjectHolderEarning`. Supply current configuration, lots, tier occupancy, and accumulators. `dynamicFeeTierLadder` reports an unbounded top tier with `null` edge/width.

Gross-up uses bounded logarithmic search; `fixupIterations` counts search steps. Rounding can yield multiple gross solutions for one exact net amount, so the result does not promise the smallest wallet debit.

## Source and full contract

[Source and package guide](https://github.com/0xIntuition/packages/tree/dde4fdf5774447b84cd0b820593fb0db7366e58d/packages/curves) · [npm package](https://www.npmjs.com/package/@0xintuition/curves/v/0.1.0-alpha.1). The [machine-readable manifest](/intuition-release.json) lists all declared public subpaths and peer dependencies. Exact npm versions, tarball integrity, and observed dist-tags are recorded in the manifest.
