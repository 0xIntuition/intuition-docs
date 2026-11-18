---
title: "Bonding curves"
sidebar_label: "Bonding curves"
description: "Work through share conversion and rounding on a linear curve, then see how a flat-price curve can charge different fees across tiers."
kind: concept
reader: ["app"]
packages: ["@0xintuition/curves", "@0xintuition/protocol"]
depends_on: ["vaults"]
---

<AppliesTo />

A bonding curve answers two questions for a vault at a particular moment. How many shares will a deposit buy? How many assets will a redemption return? The curve defines the conversion rule. Some curves also charge fees that depend on how much is already in the vault or when a holder acquired shares.

**Builds on:** [Vaults, shares and positions](/docs/concepts/vaults).

**Implemented by:** [curves](/docs/reference/packages/curves), [protocol](/docs/reference/packages/protocol).

## How it works

On an initialized **linear curve**, the asset value of one share is proportional to the ratio of total assets to total shares. Depositing at that ratio need not raise the price. If a vault receives additional assets without minting shares, each existing share represents more assets. A **progressive curve** uses a different rule. Its marginal price grows with total share supply according to its slope. [Linear pricing](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/curves/src/linear-curve.ts) · [Progressive pricing](https://github.com/0xIntuition/intuition-contracts-v2/blob/82cfcdb832c100fd2e53ee3f474289ae14cc6020/src/protocol/curves/ProgressiveCurve.sol)

The **dynamic-fee flat-price curve** keeps the underlying conversion at par and varies the fee. A deposit spanning several tiers pays each band’s configured rate on the portion in that band. The contract tracks a holder’s shares in lots according to their entry tiers, and redeems the highest-tier lots first. To estimate a holder's redemption, account for those lots as well as MultiVault’s fees. A vault-wide preview uses the current tier for the account-less curve fee. [Dynamic-fee curve and holder quotes](https://github.com/0xIntuition/intuition-contracts-v2/blob/82cfcdb832c100fd2e53ee3f474289ae14cc6020/src/protocol/curves/DynamicFeeFlatPriceCurve.sol)

## Example

Imagine an initialized linear vault with 3 asset units and 2 share units. To find the shares for a deposit of 2 net asset units, multiply by the share supply and divide by the asset balance. The result, `2 × 2 / 3`, rounds down to **1 share unit**. To acquire exactly 1 share unit at that state would require `1 × 3 / 2` rounded **up to 2 asset units**. To acquire exactly 2 share units requires 3 asset units.

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

The `n` suffix denotes a JavaScript `bigint`. These small values illustrate integer rounding using only the curve. For a proposed transaction, a MultiVault preview also applies the relevant fees and initialization costs. [Deposit calculation](https://github.com/0xIntuition/intuition-contracts-v2/blob/82cfcdb832c100fd2e53ee3f474289ae14cc6020/src/libraries/MultiVaultLib.sol)

## Common mistakes

- **Choosing a curve by a familiar number.** Check the selected deployment’s curve registry and configuration before interpreting a curve ID.
- **Applying the last tier’s fee to the whole deposit.** A deposit can cross several fee bands even while the underlying asset-to-share price stays flat.
- **Deriving minimum proceeds from a curve quote alone.** A holder-specific curve quote can still exclude MultiVault's protocol and exit fees.

## Next

[Signals](/docs/concepts/signals) interprets positions priced by these curves. [Fees, epochs and rewards](/docs/concepts/fees-and-rewards) distinguishes the charges on a transaction from a holder’s eligibility for emissions.
