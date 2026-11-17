---
title: '@0xintuition/curves'
sidebar_label: 'Curves'
description: 'Calculate local curve previews and fee quotes using explicit integer units, state, and configuration.'
kind: reference
reader: ["app"]
packages: ["@0xintuition/curves"]
---

<AppliesTo />

## What it's for

Pure math for linear, progressive, and offset-progressive curves, fee calculations, and dynamic-fee distributions. It computes from supplied state and parameters without RPC, wallets, or deployment selection.

## When to use it

Use it for local previews or calculations from a known state snapshot. Use [protocol](/docs/reference/packages/protocol) or [SDK actions](/docs/reference/packages/sdk) when you need live contract state. A mathematically valid quote does not prove that a deployment uses those parameters or will execute at that price.

## Install

```sh
npm install @0xintuition/curves@0.1.0
```

Use ESM on Node 20+ or a compatible browser with BigInt support.

## Entry points

| Subpath | Purpose |
| --- | --- |
| `.` | Curve factories, conversions, previews, fees, distributions, math, and types |

Source module names such as `linear-curve` and `fees` are not public import subpaths.

## Depends on and works with

Runtime package dependencies: none. Peer dependencies: none.

The SDK consumes these calculations. Supply compatible current curve configuration, fees, and state from the intended contract; pure math has no way to establish their provenance.

## Example

This synthetic state has three asset base units and two share base units. Integer deposit conversion rounds down, while minting an exact number of shares rounds the required assets up.

{/* example:start examples/v2/first-write/src/package-examples.ts#curve-preview */}
```ts
import { createLinearCurve, type CurveState } from '@0xintuition/curves';

const curve = createLinearCurve();
const state: CurveState = { totalAssets: 3n, totalShares: 2n };
export const preview = {
  depositShares: curve.previewDeposit(2n, state),
  mintAssets: curve.previewMint(2n, state),
};
console.log(preview); // 1n share for a deposit; 3n assets to mint 2n shares.
```
{/* example:end */}

Use `bigint` base units throughout. The example's `2n` means two base units, not two TRUST. `WAD` is the package's fixed-point scale of 10 to the power of 18; fee rates use the supplied denominator or the specific helper's basis-point contract. Avoid converting large values through JavaScript `number`.

Linear deposit and redeem previews round down; mint and withdraw previews round up. Invalid states can throw, such as nonzero shares with zero assets when converting assets to shares. These local previews exclude transaction gas and any fees you have not explicitly included.

Fee helpers include exact-net gross-up for atom/triple creation and deposits. The bounded search returns a quote achieving the requested net amount, but independently rounded fees can permit multiple solutions, so it does not promise the smallest gross debit. Dynamic-fee helpers require current lots, tier occupancy, configuration, and accumulators as applicable; the top tier's unbounded edge and width are `null`.

## Related concepts

[Protocol writes](/docs/concepts/protocol-writes) explains where a quote becomes a reviewed transaction. [How the pieces fit](/docs/get-started/how-it-fits) distinguishes pure helpers from live contract operations.

## Source

[Package README](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/curves/README.md), [linear math](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/curves/src/linear-curve.ts), and [fee helpers](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/curves/src/fees.ts).
