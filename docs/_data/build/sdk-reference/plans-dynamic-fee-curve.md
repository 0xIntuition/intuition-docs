---
title: 'Dynamic-fee action envelopes'
slug: /build/sdk-reference/plans-dynamic-fee-curve
---

Generated from the published SDK **4.0.0-alpha.0** source. See [release compatibility](../compatibility.md) before installing or connecting to a deployment. Regenerate with `node scripts/generate-package-reference.js /path/to/packages`.

Import from `@0xintuition/sdk/actions`. [Implementation and internal helpers](https://github.com/0xIntuition/packages/blob/dde4fdf5774447b84cd0b820593fb0db7366e58d/packages/sdk/src/actions/plans/dynamic-fee-curve.ts).

Signatures show the exact accepted inputs and return types. Named input/output structures and dependency-injection types are listed below; viem and protocol types come from their respective packages. Preparation and quote functions can perform RPC reads. Envelope builders on the action-envelope pages use caller-supplied read context and perform no RPC reads or signing. **`feeProxyExecutePlan` sends transactions**; the other SDK actions on these pages prepare transactions or read data.

## dynamicFeeCurveDepositEnvelope

Builds a deposit plan into a dynamic-fee vault: resolves the curve from the registry,
quotes the piecewise deposit fee (exact across every band traversed, not just the
pre-deposit tier), and returns the MultiVault `deposit` calldata sized against the
slippage-floored share quote.

[Source](https://github.com/0xIntuition/packages/blob/dde4fdf5774447b84cd0b820593fb0db7366e58d/packages/sdk/src/actions/plans/dynamic-fee-curve.ts#L135)

```ts
function dynamicFeeCurveDepositEnvelope(
  inputs: BuildDynamicFeeCurveDepositPlanInputs,
): Promise<import('@0xintuition/sdk/actions').AgentActionEnvelope>;
```

- **`inputs`**: Chain, contract addresses, the receiver/term/curve to deposit into, and precomputed read values.
- **returns**: An agent-action envelope with the deposit step and the quote it was built from.

## dynamicFeeCurveClaimEnvelope

Builds a batched claim plan for a dynamic-fee curve: settles the caller-supplied
candidate terms and pays out the total claimable across all of them in one `claim`
transaction.

[Source](https://github.com/0xIntuition/packages/blob/dde4fdf5774447b84cd0b820593fb0db7366e58d/packages/sdk/src/actions/plans/dynamic-fee-curve.ts#L252)

```ts
function dynamicFeeCurveClaimEnvelope(
  inputs: BuildDynamicFeeCurveClaimPlanInputs,
): Promise<import('@0xintuition/sdk/actions').AgentActionEnvelope>;
```

- **`inputs`**: The curve address, the claiming account, and the candidate term IDs to settle.
- **returns**: An agent-action envelope with the claim step and the claimable breakdown it was built from.

## Imported type provenance

Public import locations and the definitions used by these signatures and helper types. Value imports appear where a dependency hook uses `typeof`.

| Name in this module | Public import                         | Definition                     |
| ------------------- | ------------------------------------- | ------------------------------ |
| `Address`           | `import type { Address } from 'viem'` | Owned by the external package. |
| `Hex`               | `import type { Hex } from 'viem'`     | Owned by the external package. |

## Input and result types

Exported declarations are public imports from the SDK subpath above. Module-local helper aliases describe accepted shapes but are not public exports.

### IntuitionCoreChainId

Module-local helper; not a public export.

```ts
type IntuitionCoreChainId = 1155 | 13579;
```

### MultiVaultPreviewDepositResult

Module-local helper; not a public export.

```ts
type MultiVaultPreviewDepositResult =
  | readonly [bigint, bigint]
  | {
      sharesOut: bigint;
      assetsAfterFees: bigint;
    };
```

### DynamicFeeCurvePlanConfig

Public export.

```ts
export type DynamicFeeCurvePlanConfig = {
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

### DynamicFeeCurveTierOverrideRead

Public export.

```ts
export type DynamicFeeCurveTierOverrideRead = readonly [
  boolean,
  number,
  number,
];
```

### DynamicFeeCurveDepositPlanReadContext

Public export.

```ts
export type DynamicFeeCurveDepositPlanReadContext = {
  curveAddress?: Address;
  config?: DynamicFeeCurvePlanConfig;
  /** Per-tier manual fee override reads, indexed by tier (0-based, matching `config.tierCount`). */
  tierFeeOverrides?: readonly DynamicFeeCurveTierOverrideRead[];
  quoteDepositFee?: bigint;
  previewDeposit?: MultiVaultPreviewDepositResult;
  entryFeeAmount?: bigint;
  protocolFeeAmount?: bigint;
  currentSharePrice?: bigint;
  /** `MultiVault.getVault(termId, curveId).totalShares` — zero means this deposit bootstraps the vault. */
  vaultTotalShares?: bigint;
  /** Only consulted on an empty vault, to double the min-share bootstrap cost for a triple. */
  isTriple?: boolean;
  /** `MultiVault.getGeneralConfig().minShare` — only consulted on an empty vault. */
  minShare?: bigint;
  /** `BondingCurveRegistry.previewMint(minShare, 0, 0, curveId)` — only consulted on an empty vault. */
  previewMint?: bigint;
  /** `totalShares` of the DEFAULT curve's vault, which is what the entry-fee threshold is measured on. */
  defaultVaultTotalShares?: bigint;
  /** `MultiVault.getGeneralConfig().feeThreshold`. Below it the entry fee is waived entirely. */
  feeThreshold?: bigint;
  /** `DynamicFeeFlatPriceCurve.vaultStake(termId)` — what the tier traversal is keyed on. */
  vaultStake?: bigint;
  /** `MultiVault.getGeneralConfig().feeDenominator`, which every MultiVault fee rate is expressed against. */
  feeDenominator?: bigint;
  /** `MultiVault.getAtomConfig().atomWalletDepositFee`, charged on every atom deposit. */
  atomWalletDepositFee?: bigint;
  /** `MultiVault.atomDepositFractionAmount(feeBase)`, charged on a triple deposit. */
  atomDepositFractionAmount?: bigint;
  /** The three atoms under a triple, whose fee thresholds gate the fraction above. */
  tripleAtomIds?: readonly [Hex, Hex, Hex];
};
```

### DynamicFeeCurveClaimPlanReadContext

Public export.

```ts
export type DynamicFeeCurveClaimPlanReadContext = {
  claimableAcross?: bigint;
  /** Per-term pending reads, in the same order as `termIds`. */
  pendingFor?: readonly bigint[];
  /** `DynamicFeeFlatPriceCurve.bankedEarnings(account)` — the settled half of the balance. */
  bankedEarnings?: bigint;
};
```

### BuildDynamicFeeCurveDepositPlanInputs

Public export.

```ts
export type BuildDynamicFeeCurveDepositPlanInputs = {
  chainId?: IntuitionCoreChainId;
  multiVaultAddress: Address;
  bondingCurveRegistryAddress: Address;
  receiver: Address;
  termId: Hex;
  curveId: bigint;
  assetsIn: bigint;
  slippageBps?: bigint;
  readContext?: DynamicFeeCurveDepositPlanReadContext;
};
```

### BuildDynamicFeeCurveClaimPlanInputs

Public export.

```ts
export type BuildDynamicFeeCurveClaimPlanInputs = {
  chainId?: IntuitionCoreChainId;
  curveAddress: Address;
  account: Address;
  termIds: Hex[];
  readContext?: DynamicFeeCurveClaimPlanReadContext;
};
```
