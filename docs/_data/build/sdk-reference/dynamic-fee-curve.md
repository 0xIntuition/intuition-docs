---
title: 'Dynamic-fee curve actions'
slug: /build/sdk-reference/dynamic-fee-curve
---

Generated from the upcoming SDK **4.0.0** source. See [release compatibility](../compatibility.md) before installing or connecting to a deployment. Regenerate with `node scripts/generate-package-reference.js /path/to/packages`.

Import from `@0xintuition/sdk/actions`. [Implementation and internal helpers](https://github.com/0xIntuition/packages/blob/1dc7103d2a05f23bc565a81df4b001336ce9ba53/packages/sdk/src/actions/dynamic-fee-curve.ts).

Signatures show the exact accepted inputs and return types. Named input/output structures and dependency-injection types are listed below; viem and protocol types come from their respective packages. Preparation and quote functions can perform RPC reads. **`feeProxyExecutePlan` sends transactions**; the other SDK actions on these pages prepare transactions or read data.

## dynamicFeeCurveGetTierOverrides

Reads every tier's manual fee override for a curve, in the shape the pure tier maths takes.

The live contract consults `tierFeeOverride[tier]` before falling back to the formulaic rate, so
any off-chain rendering of the ladder or its rates must do the same or it silently disagrees
wherever an override is set. Exported because it is a prerequisite for using `@0xintuition/curves`
directly — without it, every consumer rediscovers both the tier range and the fact that the two
rate fields are `uint16`, which viem decodes as a JS `number` while `DynamicFeeTierOverride`
declares them as `bigint`. An unchecked pass-through type-checks and then throws inside the first
`mulDivUp`.

[Source](https://github.com/0xIntuition/packages/blob/1dc7103d2a05f23bc565a81df4b001336ce9ba53/packages/sdk/src/actions/dynamic-fee-curve.ts#L180)

```ts
function dynamicFeeCurveGetTierOverrides(
  config: ReadConfig,
  inputs: {
    config: DynamicFeeConfig;
  },
  deps?: Pick<DynamicFeeCurveDeps, 'tierFeeOverride'>,
): Promise<Map<bigint, DynamicFeeTierOverride>>;
```

- **`config`**: Curve address and public client.
- **`inputs`**: The curve's config, which carries the tier count to walk.
- **`deps`**: Injectable protocol read primitives.
- **returns**: The set overrides, keyed by tier. Tiers without an override are absent.

Defaults: `deps = defaultDynamicFeeCurveDeps`. Dependency arguments are optional test/customization hooks; normal consumers use the built-in dependencies.

## dynamicFeeCurveGetTierLadder

Resolves a dynamic-fee curve's tier ladder for the current vault state — the tier
math itself is pure (`@0xintuition/curves`), fed by a single on-chain config read.

[Source](https://github.com/0xIntuition/packages/blob/1dc7103d2a05f23bc565a81df4b001336ce9ba53/packages/sdk/src/actions/dynamic-fee-curve.ts#L218)

```ts
function dynamicFeeCurveGetTierLadder(
  configs: {
    bondingCurveRegistry: ReadConfig;
    curveReadConfig: Omit<ReadConfig, 'address'>;
  },
  inputs: {
    curveId: bigint;
  },
  deps?: Pick<
    DynamicFeeCurveDeps,
    'curveAddresses' | 'getConfig' | 'tierFeeOverride'
  >,
): Promise<{
  curveAddress: Address;
  config: DynamicFeeConfig;
  overrides: Map<bigint, DynamicFeeTierOverride>;
  tierLadder: DynamicFeeTierLadderEntry[];
}>;
```

- **`configs`**: `bondingCurveRegistry` (to resolve the curve address) and the shared read config the resolved curve is read through.
- **`inputs`**: The curve ID to resolve and quote.
- **`deps`**: Injectable protocol read primitives.
- **returns**: The curve address, its config, its overrides, and the full tier ladder.

Defaults: `deps = defaultDynamicFeeCurveDeps`. Dependency arguments are optional test/customization hooks; normal consumers use the built-in dependencies.

## dynamicFeeCurveQuoteDepositPlan

Quotes a deposit into a dynamic-fee vault: resolves the curve from the registry, reads the
on-chain piecewise deposit-fee quote (exact across every band the deposit traverses, not just the
pre-deposit tier), and composes it with the standard MultiVault deposit quote.

Also reports the traversal itself — which tier the vault starts in, which it lands in, and the
per-band split — because a piecewise fee that arrives as a single number cannot be explained to
the person paying it.

[Source](https://github.com/0xIntuition/packages/blob/1dc7103d2a05f23bc565a81df4b001336ce9ba53/packages/sdk/src/actions/dynamic-fee-curve.ts#L254)

```ts
function dynamicFeeCurveQuoteDepositPlan(
  configs: {
    multiVault: ReadConfig;
    bondingCurveRegistry: ReadConfig;
  },
  inputs: {
    termId: Hex;
    curveId: bigint;
    assetsIn: bigint;
    slippageBps?: bigint;
  },
  deps?: DynamicFeeCurveDeps,
): Promise<DynamicFeeCurveDepositQuotePlan>;
```

- **`configs`**: `multiVault` and `bondingCurveRegistry` read configs.
- **`inputs`**: The term/curve to deposit into and the gross asset amount.
- **`deps`**: Injectable protocol read primitives.
- **returns**: The combined dynamic-fee-curve and MultiVault deposit quote.

Defaults: `deps = defaultDynamicFeeCurveDeps`. Dependency arguments are optional test/customization hooks; normal consumers use the built-in dependencies.

## dynamicFeeCurvePrepareDepositTx

Prepare encoded deposit arguments and minimum shares from a dynamic-fee quote, without submitting a transaction.

[Source](https://github.com/0xIntuition/packages/blob/1dc7103d2a05f23bc565a81df4b001336ce9ba53/packages/sdk/src/actions/dynamic-fee-curve.ts#L323)

```ts
function dynamicFeeCurvePrepareDepositTx(
  configs: {
    multiVault: ReadConfig;
    bondingCurveRegistry: ReadConfig;
  },
  inputs: {
    receiver: Address;
    termId: Hex;
    curveId: bigint;
    assetsIn: bigint;
    slippageBps?: bigint;
  },
  deps?: DynamicFeeCurveDeps,
): Promise<DynamicFeeCurvePrepareDepositTxResult>;
```

- **`configs`**: `multiVault` and `bondingCurveRegistry` read configs.
- **`inputs`**: The receiver, term/curve to deposit into, and the gross asset amount.
- **`deps`**: Injectable protocol read primitives.
- **returns**: The deposit calldata, args, value, and the quote it was built from.

Defaults: `deps = defaultDynamicFeeCurveDeps`. Dependency arguments are optional test/customization hooks; normal consumers use the built-in dependencies.

## dynamicFeeCurveQuoteRedeemPlan

Quotes a redeem out of a dynamic-fee vault for a specific account.

The withdrawal rate on this curve keys on the tiers the ACCOUNT entered at, not on where the vault
sits now, and the two diverge in both directions as the vault moves. A position is a set of lots,
one per band the holder entered through, and a redeem unwinds them highest tier first, so a single
redemption can be priced at several rates at once. This adds that context to the generic
account-aware MultiVault quote: the lots in unwind order, the one the next share out comes from,
where the vault currently is, and whether the account holds any lot at all — an account with none
falls back to the vault's tier, which is the one case where the two coincide by construction.

[Source](https://github.com/0xIntuition/packages/blob/1dc7103d2a05f23bc565a81df4b001336ce9ba53/packages/sdk/src/actions/dynamic-fee-curve.ts#L364)

```ts
function dynamicFeeCurveQuoteRedeemPlan(
  configs: {
    multiVault: ReadConfig;
    bondingCurveRegistry: ReadConfig;
  },
  inputs: {
    termId: Hex;
    curveId: bigint;
    account: Address;
    sharesIn: bigint;
    slippageBps?: bigint;
  },
  deps?: DynamicFeeCurveDeps,
): Promise<DynamicFeeCurveRedeemQuotePlan>;
```

- **`configs`**: `multiVault` and `bondingCurveRegistry` read configs.
- **`inputs`**: The term/curve, the redeeming account, the share count and optional slippage.
- **`deps`**: Injectable protocol read primitives.
- **returns**: The account's payout, its fee breakdown, and the tiers behind the withdrawal rate.

Defaults: `deps = defaultDynamicFeeCurveDeps`. Dependency arguments are optional test/customization hooks; normal consumers use the built-in dependencies.

## dynamicFeeCurvePrepareRedeemTx

Prepares a redeem transaction out of a dynamic-fee vault, floored against the redeeming account's
own payout rather than a holder-agnostic one.

[Source](https://github.com/0xIntuition/packages/blob/1dc7103d2a05f23bc565a81df4b001336ce9ba53/packages/sdk/src/actions/dynamic-fee-curve.ts#L438)

```ts
function dynamicFeeCurvePrepareRedeemTx(
  configs: {
    multiVault: ReadConfig;
    bondingCurveRegistry: ReadConfig;
  },
  inputs: {
    receiver: Address;
    termId: Hex;
    curveId: bigint;
    account: Address;
    sharesIn: bigint;
    slippageBps?: bigint;
  },
  deps?: DynamicFeeCurveDeps,
): Promise<DynamicFeeCurvePrepareRedeemTxResult>;
```

- **`configs`**: `multiVault` and `bondingCurveRegistry` read configs.
- **`inputs`**: The receiver, term/curve, redeeming account, share count and optional slippage.
- **`deps`**: Injectable protocol read primitives.
- **returns**: The redeem calldata, args, and the quote it was built from.

Defaults: `deps = defaultDynamicFeeCurveDeps`. Dependency arguments are optional test/customization hooks; normal consumers use the built-in dependencies.

## dynamicFeeCurveProjectDepositEarnings

Projects what a deposit's curve fee EARNS — for every tier, and optionally for one holder.

This is the other half of a deposit quote. The fee side has always been answerable; the earning
side is what makes an early position worth taking, and it needs the fulcrum kernel: each
traversed band's slice of the fee is spread over the tiers below it by a sliding triangular
window, gated on `minEligibleTierStakeBps`, with the depositor's own landing changing the
denominators between bands. The kernel maths is `dynamicFeeDistributeDeposit` in
`@0xintuition/curves`, a floor-exact mirror of the contract's `recordDeposit`; this function
feeds it the on-chain state it needs (config, overrides, per-tier occupancy and accumulators, the
depositor's lots) and, for a named holder, sums their lots so the projection is wei-exact rather
than approximately pro-rata. A holder with lots at several tiers earns at each of them.

A projection is a statement about the CURRENT state: another deposit landing first changes the
denominators, exactly as it would change a price quote.

[Source](https://github.com/0xIntuition/packages/blob/1dc7103d2a05f23bc565a81df4b001336ce9ba53/packages/sdk/src/actions/dynamic-fee-curve.ts#L508)

```ts
function dynamicFeeCurveProjectDepositEarnings(
  configs: {
    multiVault: ReadConfig;
    bondingCurveRegistry: ReadConfig;
  },
  inputs: {
    termId: Hex;
    curveId: bigint;
    assetsIn: bigint;
    depositor?: Address;
    holder?: Address;
  },
  deps?: DynamicFeeCurveDeps,
): Promise<DynamicFeeCurveEarningsProjection>;
```

- **`configs`**: `multiVault` and `bondingCurveRegistry` read configs.
- **`inputs`**: The term/curve and gross deposit, the depositor (when they hold a position), and optionally a holder to project for.
- **`deps`**: Injectable protocol read primitives.
- **returns**: The per-tier distribution of the deposit's curve fee, and the named holder's exact earning.

Defaults: `deps = defaultDynamicFeeCurveDeps`. Dependency arguments are optional test/customization hooks; normal consumers use the built-in dependencies.

## dynamicFeeCurveGetClaimableAcrossTerms

Reads what an account can claim across a set of terms, and where it comes from.

`claimable(account, termId)` is the obvious read and the wrong one for a multi-term total: it
folds in the account's banked (term-independent) balance on every call, so summing or filtering by
it per term double-counts that component, and the error grows with the number of positions held.
`claimableAcross` is the total `claim` would actually pay; `pendingFor` is the additive per-term
part; `bankedEarnings` is the settled remainder. Returning all three is what lets a consumer show
the breakdown without reconstructing it wrongly.

[Source](https://github.com/0xIntuition/packages/blob/1dc7103d2a05f23bc565a81df4b001336ce9ba53/packages/sdk/src/actions/dynamic-fee-curve.ts#L631)

```ts
function dynamicFeeCurveGetClaimableAcrossTerms(
  config: ReadConfig,
  inputs: {
    account: Address;
    termIds: Hex[];
  },
  deps?: Pick<
    DynamicFeeCurveDeps,
    'claimableAcross' | 'pendingFor' | 'bankedEarnings'
  >,
): Promise<DynamicFeeCurveClaimableAcrossTermsResult>;
```

- **`config`**: Read config for the dynamic-fee curve.
- **`inputs`**: The account and the candidate term IDs to check.
- **`deps`**: Injectable protocol read primitives.
- **returns**: The total claimable across the supplied terms, which of them are non-zero, and the split.

Defaults: `deps = defaultDynamicFeeCurveDeps`. Dependency arguments are optional test/customization hooks; normal consumers use the built-in dependencies.

## dynamicFeeCurvePrepareClaimTx

Builds a batched claim transaction for a dynamic-fee curve: discovers which terms hold a claimable
balance for the account, then returns one `claim` calldata settling all of them at once.

Having nothing to claim is an ordinary state, not an error, so it comes back as `isClaimable:
false` rather than as a thrown exception a UI has to catch to render a zero. Term IDs are
de-duplicated because the contract reverts with `DynamicFeeFlatPriceCurve_DuplicateTermIds` on a
repeat.

[Source](https://github.com/0xIntuition/packages/blob/1dc7103d2a05f23bc565a81df4b001336ce9ba53/packages/sdk/src/actions/dynamic-fee-curve.ts#L675)

```ts
function dynamicFeeCurvePrepareClaimTx(
  config: ReadConfig,
  inputs: {
    account: Address;
    termIds: Hex[];
  },
  deps?: Pick<
    DynamicFeeCurveDeps,
    'claimableAcross' | 'pendingFor' | 'bankedEarnings'
  >,
): Promise<DynamicFeeCurvePrepareClaimTxResult>;
```

- **`config`**: Read config for the dynamic-fee curve.
- **`inputs`**: The account and the candidate term IDs to settle.
- **`deps`**: Injectable protocol read primitives.
- **returns**: The claim calldata, args, the claimable breakdown, and whether it is worth sending.

Defaults: `deps = defaultDynamicFeeCurveDeps`. Dependency arguments are optional test/customization hooks; normal consumers use the built-in dependencies.

## Imported type provenance

Public import locations and the definitions used by these signatures and helper types. Value imports appear where a dependency hook uses `typeof`.

| Name in this module                       | Public import                                                                     | Definition                                                                                                                                                                                  |
| ----------------------------------------- | --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `DynamicFeeAccumulators`                  | `import type { DynamicFeeAccumulators } from '@0xintuition/curves'`               | [Source definition](https://github.com/0xIntuition/packages/blob/1dc7103d2a05f23bc565a81df4b001336ce9ba53/packages/curves/src/types.ts#L133)                                                |
| `DynamicFeeConfig`                        | `import type { DynamicFeeConfig } from '@0xintuition/curves'`                     | [Source definition](https://github.com/0xIntuition/packages/blob/1dc7103d2a05f23bc565a81df4b001336ce9ba53/packages/curves/src/types.ts#L89)                                                 |
| `DynamicFeeDepositBand`                   | `import type { DynamicFeeDepositBand } from '@0xintuition/curves'`                | [Source definition](https://github.com/0xIntuition/packages/blob/1dc7103d2a05f23bc565a81df4b001336ce9ba53/packages/curves/src/types.ts#L142)                                                |
| `DynamicFeeDepositDistribution`           | `import type { DynamicFeeDepositDistribution } from '@0xintuition/curves'`        | [Source definition](https://github.com/0xIntuition/packages/blob/1dc7103d2a05f23bc565a81df4b001336ce9ba53/packages/curves/src/dynamic-fee-distribution.ts#L92)                              |
| `DynamicFeeTierLadderEntry`               | `import type { DynamicFeeTierLadderEntry } from '@0xintuition/curves'`            | [Source definition](https://github.com/0xIntuition/packages/blob/1dc7103d2a05f23bc565a81df4b001336ce9ba53/packages/curves/src/types.ts#L170)                                                |
| `DynamicFeeTierOccupancy`                 | `import type { DynamicFeeTierOccupancy } from '@0xintuition/curves'`              | [Source definition](https://github.com/0xIntuition/packages/blob/1dc7103d2a05f23bc565a81df4b001336ce9ba53/packages/curves/src/dynamic-fee-distribution.ts#L63)                              |
| `DynamicFeeTierOverride`                  | `import type { DynamicFeeTierOverride } from '@0xintuition/curves'`               | [Source definition](https://github.com/0xIntuition/packages/blob/1dc7103d2a05f23bc565a81df4b001336ce9ba53/packages/curves/src/types.ts#L109)                                                |
| `bondingCurveRegistryCurveAddresses`      | `import { bondingCurveRegistryCurveAddresses } from '@0xintuition/protocol'`      | [Source definition](https://github.com/0xIntuition/packages/blob/1dc7103d2a05f23bc565a81df4b001336ce9ba53/packages/protocol/src/core/bonding-curve-registry/curve-addresses.ts#L12)         |
| `dynamicFeeFlatPriceCurveAccFeePerShare`  | `import { dynamicFeeFlatPriceCurveAccFeePerShare } from '@0xintuition/protocol'`  | [Source definition](https://github.com/0xIntuition/packages/blob/1dc7103d2a05f23bc565a81df4b001336ce9ba53/packages/protocol/src/core/dynamic-fee-flat-price-curve/acc-fee-per-share.ts#L14) |
| `dynamicFeeFlatPriceCurveBankedEarnings`  | `import { dynamicFeeFlatPriceCurveBankedEarnings } from '@0xintuition/protocol'`  | [Source definition](https://github.com/0xIntuition/packages/blob/1dc7103d2a05f23bc565a81df4b001336ce9ba53/packages/protocol/src/core/dynamic-fee-flat-price-curve/banked-earnings.ts#L14)   |
| `dynamicFeeFlatPriceCurveClaimableAcross` | `import { dynamicFeeFlatPriceCurveClaimableAcross } from '@0xintuition/protocol'` | [Source definition](https://github.com/0xIntuition/packages/blob/1dc7103d2a05f23bc565a81df4b001336ce9ba53/packages/protocol/src/core/dynamic-fee-flat-price-curve/claimable-across.ts#L14)  |
| `dynamicFeeFlatPriceCurveGetConfig`       | `import { dynamicFeeFlatPriceCurveGetConfig } from '@0xintuition/protocol'`       | [Source definition](https://github.com/0xIntuition/packages/blob/1dc7103d2a05f23bc565a81df4b001336ce9ba53/packages/protocol/src/core/dynamic-fee-flat-price-curve/get-config.ts#L17)        |
| `dynamicFeeFlatPriceCurveLotRewardDebt`   | `import { dynamicFeeFlatPriceCurveLotRewardDebt } from '@0xintuition/protocol'`   | [Source definition](https://github.com/0xIntuition/packages/blob/1dc7103d2a05f23bc565a81df4b001336ce9ba53/packages/protocol/src/core/dynamic-fee-flat-price-curve/lot-reward-debt.ts#L13)   |
| `dynamicFeeFlatPriceCurvePendingFor`      | `import { dynamicFeeFlatPriceCurvePendingFor } from '@0xintuition/protocol'`      | [Source definition](https://github.com/0xIntuition/packages/blob/1dc7103d2a05f23bc565a81df4b001336ce9ba53/packages/protocol/src/core/dynamic-fee-flat-price-curve/pending-for.ts#L15)       |
| `dynamicFeeFlatPriceCurveQuoteDepositFee` | `import { dynamicFeeFlatPriceCurveQuoteDepositFee } from '@0xintuition/protocol'` | [Source definition](https://github.com/0xIntuition/packages/blob/1dc7103d2a05f23bc565a81df4b001336ce9ba53/packages/protocol/src/core/dynamic-fee-flat-price-curve/quote-deposit-fee.ts#L15) |
| `dynamicFeeFlatPriceCurveTierFeeOverride` | `import { dynamicFeeFlatPriceCurveTierFeeOverride } from '@0xintuition/protocol'` | [Source definition](https://github.com/0xIntuition/packages/blob/1dc7103d2a05f23bc565a81df4b001336ce9ba53/packages/protocol/src/core/dynamic-fee-flat-price-curve/tier-fee-override.ts#L12) |
| `dynamicFeeFlatPriceCurveTierStake`       | `import { dynamicFeeFlatPriceCurveTierStake } from '@0xintuition/protocol'`       | [Source definition](https://github.com/0xIntuition/packages/blob/1dc7103d2a05f23bc565a81df4b001336ce9ba53/packages/protocol/src/core/dynamic-fee-flat-price-curve/tier-stake.ts#L13)        |
| `dynamicFeeFlatPriceCurveUserLots`        | `import { dynamicFeeFlatPriceCurveUserLots } from '@0xintuition/protocol'`        | [Source definition](https://github.com/0xIntuition/packages/blob/1dc7103d2a05f23bc565a81df4b001336ce9ba53/packages/protocol/src/core/dynamic-fee-flat-price-curve/user-lots.ts#L13)         |
| `dynamicFeeFlatPriceCurveVaultStake`      | `import { dynamicFeeFlatPriceCurveVaultStake } from '@0xintuition/protocol'`      | [Source definition](https://github.com/0xIntuition/packages/blob/1dc7103d2a05f23bc565a81df4b001336ce9ba53/packages/protocol/src/core/dynamic-fee-flat-price-curve/vault-stake.ts#L13)       |
| `ReadConfig`                              | `import type { ReadConfig } from '@0xintuition/protocol'`                         | [Source definition](https://github.com/0xIntuition/packages/blob/1dc7103d2a05f23bc565a81df4b001336ce9ba53/packages/protocol/src/types.ts#L3)                                                |
| `Address`                                 | `import type { Address } from 'viem'`                                             | Owned by the external package.                                                                                                                                                              |
| `Hex`                                     | `import type { Hex } from 'viem'`                                                 | Owned by the external package.                                                                                                                                                              |
| `MultiVaultDepositQuotePlan`              | `import type { MultiVaultDepositQuotePlan } from '@0xintuition/sdk/actions'`      | [MultiVaultDepositQuotePlan](./multivault.md#multivaultdepositquoteplan)                                                                                                                    |
| `MultiVaultRedeemQuotePlan`               | `import type { MultiVaultRedeemQuotePlan } from '@0xintuition/sdk/actions'`       | [MultiVaultRedeemQuotePlan](./multivault.md#multivaultredeemquoteplan)                                                                                                                      |
| `multivaultQuoteDepositPlan`              | `import { multivaultQuoteDepositPlan } from '@0xintuition/sdk/actions'`           | [Source definition](https://github.com/0xIntuition/packages/blob/1dc7103d2a05f23bc565a81df4b001336ce9ba53/packages/sdk/src/actions/multivault.ts#L676)                                      |
| `multivaultQuoteRedeemPlan`               | `import { multivaultQuoteRedeemPlan } from '@0xintuition/sdk/actions'`            | [Source definition](https://github.com/0xIntuition/packages/blob/1dc7103d2a05f23bc565a81df4b001336ce9ba53/packages/sdk/src/actions/multivault.ts#L871)                                      |

## External input and result structures

These declarations belong to the named packages, not to the SDK. Nested supporting types retain their owning source links.

### DynamicFeeAccumulators

[Source definition](https://github.com/0xIntuition/packages/blob/1dc7103d2a05f23bc565a81df4b001336ce9ba53/packages/curves/src/types.ts#L133)

```ts
export type DynamicFeeAccumulators = Map<bigint, bigint>;
```

### DynamicFeeConfig

[Source definition](https://github.com/0xIntuition/packages/blob/1dc7103d2a05f23bc565a81df4b001336ce9ba53/packages/curves/src/types.ts#L89)

```ts
export type DynamicFeeConfig = {
  width0: bigint;
  tierCount: bigint;
  tierWidthGrowthBps: bigint;
  depositBaseBps: bigint;
  depositGrowthBps: bigint;
  depositCapBps: bigint;
  depositFulcrumAlphaBps: bigint;
  depositKernelSpread: bigint;
  redeemFulcrumAlphaBps: bigint;
  redeemKernelSpread: bigint;
  redeemBaseBps: bigint;
  redeemGrowthBps: bigint;
  redeemCapBps: bigint;
  redeemToFulcrumTiersBps: bigint;
  depositToPriorTierBps: bigint;
  minEligibleTierStakeBps: bigint;
};
```

### DynamicFeeDepositBand

[Source definition](https://github.com/0xIntuition/packages/blob/1dc7103d2a05f23bc565a81df4b001336ce9ba53/packages/curves/src/types.ts#L142)

```ts
export type DynamicFeeDepositBand = {
  tier: bigint;
  feeBps: bigint;
  assets: bigint;
  fee: bigint;
};
```

### DynamicFeeDepositDistribution

[Source definition](https://github.com/0xIntuition/packages/blob/1dc7103d2a05f23bc565a81df4b001336ce9ba53/packages/curves/src/dynamic-fee-distribution.ts#L92)

```ts
export type DynamicFeeDepositDistribution = {
  /** Credited tiers in ascending order. Tiers that received nothing are absent. */
  perTier: DynamicFeeTierPayout[];
  /**
   * Fee no cohort was there to earn at the schedule rate — protocol accrual. A first-tier deposit
   * has no prior tier at all; past that it is the part of a pool the prior ladder's occupancy could
   * not absorb once every tier is paid at the schedule ceiling.
   */
  toProtocol: bigint;
  /** Occupancy as the contract leaves it: fee-independent, with the deposit's stake landed. */
  occupancyAfter: DynamicFeeTierOccupancy;
  /** The accumulators as the contract leaves them, the supplied values plus this deposit's deltas. */
  accFeePerShareAfter: DynamicFeeAccumulators;
  /** The bands the stake traversed, in ascending order, with each band's slice of the fee. */
  bands: DynamicFeeDepositBandLanding[];
  /** The depositor's lots as the contract leaves them. */
  depositorAfter: DynamicFeeLots;
  /** The depositor's highest lot after the deposit, or `DYNAMIC_FEE_NO_LOT` when they hold none. */
  topTierAfter: bigint;
  /**
   * What the replay banked into the account-wide settled balance. A deposit settles only the lots
   * it tops up, so this is non-zero only when a band lands on a lot that had earned something.
   */
  banked: bigint;
};
```

### DynamicFeeTierLadderEntry

[Source definition](https://github.com/0xIntuition/packages/blob/1dc7103d2a05f23bc565a81df4b001336ce9ba53/packages/curves/src/types.ts#L170)

```ts
export type DynamicFeeTierLadderEntry = {
  tier: bigint;
  upperEdge: bigint | null;
  width: bigint | null;
  depositFeeBps: bigint;
  redeemFeeBps: bigint;
};
```

### DynamicFeeTierOccupancy

[Source definition](https://github.com/0xIntuition/packages/blob/1dc7103d2a05f23bc565a81df4b001336ce9ba53/packages/curves/src/dynamic-fee-distribution.ts#L63)

```ts
export type DynamicFeeTierOccupancy = Map<bigint, bigint>;
```

### DynamicFeeTierOverride

[Source definition](https://github.com/0xIntuition/packages/blob/1dc7103d2a05f23bc565a81df4b001336ce9ba53/packages/curves/src/types.ts#L109)

```ts
export type DynamicFeeTierOverride = {
  isSet: boolean;
  depositFeeBps: bigint;
  redeemFeeBps: bigint;
};
```

### DynamicFeeTierPayout

[Source definition](https://github.com/0xIntuition/packages/blob/1dc7103d2a05f23bc565a81df4b001336ce9ba53/packages/curves/src/dynamic-fee-distribution.ts#L66)

```ts
export type DynamicFeeTierPayout = {
  tier: bigint;
  /** Assets credited to this tier's cohort in total. */
  amount: bigint;
  /**
   * The exact `accFeePerShare` increment the contract writes for this tier, in `ACC_PRECISION`.
   * A holder's pending delta is `floor(stake * accAfter / ACC) - floor(stake * accBefore / ACC)`,
   * which is what makes wei-exact per-account projection possible.
   */
  accDelta: bigint;
};
```

### DynamicFeeDepositBandLanding

[Source definition](https://github.com/0xIntuition/packages/blob/1dc7103d2a05f23bc565a81df4b001336ce9ba53/packages/curves/src/dynamic-fee-distribution.ts#L79)

```ts
export type DynamicFeeDepositBandLanding = {
  tier: bigint;
  stake: bigint;
  fee: bigint;
};
```

### DynamicFeeLots

[Source definition](https://github.com/0xIntuition/packages/blob/1dc7103d2a05f23bc565a81df4b001336ce9ba53/packages/curves/src/types.ts#L130)

```ts
export type DynamicFeeLots = Map<bigint, DynamicFeeLot>;
```

### DynamicFeeLot

[Source definition](https://github.com/0xIntuition/packages/blob/1dc7103d2a05f23bc565a81df4b001336ce9ba53/packages/curves/src/types.ts#L120)

```ts
export type DynamicFeeLot = {
  stake: bigint;
  rewardDebt: bigint;
};
```

## Input and result types

Exported declarations are public imports from the SDK subpath above. Module-local helper aliases describe accepted shapes but are not public exports.

### DynamicFeeCurveDepositQuotePlan

Public export.

```ts
export type DynamicFeeCurveDepositQuotePlan = {
  curveId: bigint;
  curveAddress: Address;
  termId: Hex;
  assetsIn: bigint;
  curveFee: bigint;
  tierLadder: DynamicFeeTierLadderEntry[];
  /** Where the vault sits before the deposit, and where this deposit leaves it. */
  startTier: bigint;
  landingTier: bigint;
  vaultStakeBefore: bigint;
  /**
   * The tier bands the FEE quote traverses, and what each one costs — the walk behind `curveFee`,
   * available before the trade.
   *
   * This is the fee walk, not the landing walk: it advances by the fee base net of the CURVE fee
   * only, mirroring the on-chain `quoteDepositFee`, while the shares that actually land are also
   * net of MultiVault's protocol, entry and term fees. The landing (what `DepositBandRecorded`
   * emits, and what `landingTier` reports) can therefore stop a band short of the last band here.
   * Both walks are the contract's own; they answer different questions.
   */
  bands: DynamicFeeDepositBand[];
  multiVaultQuote: MultiVaultDepositQuotePlan;
};
```

### DynamicFeeCurvePrepareDepositTxResult

Public export.

```ts
export type DynamicFeeCurvePrepareDepositTxResult = {
  args: readonly [Address, Hex, bigint, bigint];
  calldata: Hex;
  value?: bigint;
  quote: DynamicFeeCurveDepositQuotePlan;
};
```

### DynamicFeeCurveRedeemQuotePlan

Public export.

```ts
export type DynamicFeeCurveRedeemQuotePlan = {
  curveId: bigint;
  curveAddress: Address;
  termId: Hex;
  account: Address;
  /**
   * The account's lots, highest tier first — the order the redeem unwinds them, and the order the
   * withdrawal fee is priced in: each portion at the rate of the band it entered through.
   */
  lots: Array<{ tier: bigint; stake: bigint }>;
  /**
   * The lot the redeem draws from first, so the rate on the next share out. `DYNAMIC_FEE_NO_LOT`
   * when the account holds no lot at all.
   */
  topTier: bigint;
  /** Where the vault currently sits, which is NOT what a holder's fee keys on. */
  vaultTier: bigint;
  /** True when the account holds no lot, so the vault's tier prices the whole redemption. */
  usesVaultTierFallback: boolean;
  multiVaultQuote: MultiVaultRedeemQuotePlan;
};
```

### DynamicFeeCurvePrepareRedeemTxResult

Public export.

```ts
export type DynamicFeeCurvePrepareRedeemTxResult = {
  args: readonly [Address, Hex, bigint, bigint, bigint];
  calldata: Hex;
  quote: DynamicFeeCurveRedeemQuotePlan;
};
```

### DynamicFeeCurveClaimableAcrossTermsResult

Public export.

```ts
export type DynamicFeeCurveClaimableAcrossTermsResult = {
  account: Address;
  termIds: Hex[];
  totalClaimable: bigint;
  claimableTermIds: Hex[];
  /** The account-wide settled balance, which `claimable` folds into every per-term answer. */
  bankedEarnings: bigint;
  /** The unsettled part, per term. Additive, unlike `claimable`. */
  pendingByTermId: Array<{ termId: Hex; pending: bigint }>;
};
```

### DynamicFeeCurvePrepareClaimTxResult

Public export.

```ts
export type DynamicFeeCurvePrepareClaimTxResult = {
  args: readonly [readonly Hex[]];
  calldata: Hex;
  claimable: DynamicFeeCurveClaimableAcrossTermsResult;
  /** False when there is nothing to settle. The calldata is still well-formed; sending it wastes gas. */
  isClaimable: boolean;
};
```

### DynamicFeeCurveDeps

Module-local helper; not a public export.

```ts
type DynamicFeeCurveDeps = {
  curveAddresses: typeof bondingCurveRegistryCurveAddresses;
  getConfig: typeof dynamicFeeFlatPriceCurveGetConfig;
  tierFeeOverride: typeof dynamicFeeFlatPriceCurveTierFeeOverride;
  quoteDepositFee: typeof dynamicFeeFlatPriceCurveQuoteDepositFee;
  claimableAcross: typeof dynamicFeeFlatPriceCurveClaimableAcross;
  pendingFor: typeof dynamicFeeFlatPriceCurvePendingFor;
  bankedEarnings: typeof dynamicFeeFlatPriceCurveBankedEarnings;
  vaultStake: typeof dynamicFeeFlatPriceCurveVaultStake;
  userLots: typeof dynamicFeeFlatPriceCurveUserLots;
  tierStake: typeof dynamicFeeFlatPriceCurveTierStake;
  accFeePerShare: typeof dynamicFeeFlatPriceCurveAccFeePerShare;
  /**
   * The depositor's stored lot debts, which decide what a deposit topping up an earning lot banks.
   * Optional so offline callers that inject every read can omit it; without it the projection
   * checkpoints the depositor's lots at the current accumulators and reports nothing banked.
   */
  lotRewardDebt?: typeof dynamicFeeFlatPriceCurveLotRewardDebt;
  quoteDepositPlan: typeof multivaultQuoteDepositPlan;
  quoteRedeemPlan: typeof multivaultQuoteRedeemPlan;
};
```

### DynamicFeeCurveEarningsProjection

Public export.

```ts
export type DynamicFeeCurveEarningsProjection = {
  termId: Hex;
  curveId: bigint;
  curveAddress: Address;
  assetsIn: bigint;
  /** The curve fee this deposit pays, which is exactly what the distribution below hands out. */
  curveFee: bigint;
  /** Where the fee goes: per-tier cohort payouts and the exact accumulator deltas. */
  distribution: DynamicFeeDepositDistribution;
  /** Per-tier occupancy the distribution ran against, for rendering "who earns" honestly. */
  occupancy: DynamicFeeTierOccupancy;
  /** Per-tier accumulators the distribution ran against, the "before" the projection measures from. */
  accFeePerShare: DynamicFeeAccumulators;
  /** Present when a holder was named: their lots, total stake, and wei-exact projected earning. */
  holder?: {
    account: Address;
    lots: Array<{ tier: bigint; stake: bigint }>;
    stake: bigint;
    /** The pending delta the contract will write for this holder if the deposit executes now. */
    projectedEarning: bigint;
  };
};
```
