---
title: 'MultiVault action envelopes'
slug: /build/sdk-reference/plans-multivault
---

API for `@0xintuition/sdk@4.0.0-alpha.0`. [Compatibility](../compatibility.md) · [Source](https://github.com/0xIntuition/packages/blob/dde4fdf5774447b84cd0b820593fb0db7366e58d/packages/sdk/src/actions/plans/multivault.ts).

Import from `@0xintuition/sdk/actions`.

Signatures show the exact accepted inputs and return types. Named input/output structures and dependency-injection types are listed below; viem and protocol types come from their respective packages. Preparation and quote functions can perform RPC reads. Envelope builders on the action-envelope pages use caller-supplied read context and perform no RPC reads or signing. **`feeProxyExecutePlan` sends transactions**; the other SDK actions on these pages prepare transactions or read data.

## multiVaultDepositEnvelope

Build a JSON-serializable deposit envelope using caller-supplied vault, fee, and preview context. Missing required context throws.

[Source](https://github.com/0xIntuition/packages/blob/dde4fdf5774447b84cd0b820593fb0db7366e58d/packages/sdk/src/actions/plans/multivault.ts#L200)

```ts
function multiVaultDepositEnvelope(
  inputs: BuildMultiVaultDepositPlanInputs,
): Promise<import('@0xintuition/sdk/actions').AgentActionEnvelope>;
```

## multiVaultRedeemEnvelope

Build a JSON-serializable redemption envelope using caller-supplied balance, fee, and preview context.

[Source](https://github.com/0xIntuition/packages/blob/dde4fdf5774447b84cd0b820593fb0db7366e58d/packages/sdk/src/actions/plans/multivault.ts#L274)

```ts
function multiVaultRedeemEnvelope(
  inputs: BuildMultiVaultRedeemPlanInputs,
): Promise<import('@0xintuition/sdk/actions').AgentActionEnvelope>;
```

## multiVaultCreateAndSeedEnvelope

Build ordered atom, triple, and seed-deposit steps from explicit creation costs and read context.

[Source](https://github.com/0xIntuition/packages/blob/dde4fdf5774447b84cd0b820593fb0db7366e58d/packages/sdk/src/actions/plans/multivault.ts#L345)

```ts
function multiVaultCreateAndSeedEnvelope(
  inputs: BuildMultiVaultCreateAndSeedPlanInputs,
): Promise<import('@0xintuition/sdk/actions').AgentActionEnvelope>;
```

## multiVaultOnBehalfOfCreationEnvelope

Builds an on-behalf-of creation plan: `createAtomsFor` / `createTriplesFor` require
`creator` to have granted `caller` CREATION approval first, so this prepends an
`approve` step when the caller reports it isn't granted yet. The approval step and
the creation steps have DIFFERENT required signers (`creator` vs `caller`), surfaced
per-step via `metadata.context.signer` — routing each step to the right signer is the
caller's responsibility.

[Source](https://github.com/0xIntuition/packages/blob/dde4fdf5774447b84cd0b820593fb0db7366e58d/packages/sdk/src/actions/plans/multivault.ts#L525)

```ts
function multiVaultOnBehalfOfCreationEnvelope(
  inputs: BuildMultiVaultOnBehalfOfCreationPlanInputs,
): Promise<import('@0xintuition/sdk/actions').AgentActionEnvelope>;
```

- **`inputs`**: Chain, MultiVault address, the creator/caller pair, the atoms/triples to create, and the caller's current CREATION/DEPOSIT/REDEMPTION approval state (read live before invoking this plan).
- **returns**: An agent-action envelope with the ordered approval (if needed) and creation steps.

## multiVaultMulticallEnvelope

Builds a consolidated payable `multicall` batch: assembles the `bytes[]` sub-call
array against the aligned `uint256[]` per-sub-call value array, the fiddliest part of
building this call by hand.

[Source](https://github.com/0xIntuition/packages/blob/dde4fdf5774447b84cd0b820593fb0db7366e58d/packages/sdk/src/actions/plans/multivault.ts#L597)

```ts
function multiVaultMulticallEnvelope(
  inputs: BuildMultiVaultMulticallPlanInputs,
): import('@0xintuition/sdk/actions').AgentActionEnvelope;
```

- **`inputs`**: Chain and the sub-calls to batch, each with its own calldata and value allocation.
- **returns**: An agent-action envelope with the single `multicall` step.

## Imported type provenance

Public import locations and the definitions used by these signatures and helper types. Value imports appear where a dependency hook uses `typeof`.

| Name in this module         | Public import                                 | Definition                                                                                                                                                |
| --------------------------- | --------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Address`                   | `import type { Address } from 'viem'`         | Owned by the external package.                                                                                                                            |
| `Hex`                       | `import type { Hex } from 'viem'`             | Owned by the external package.                                                                                                                            |
| `CurveRedeemFeeReadContext` | Internal supporting type; not a public import | [Source definition](https://github.com/0xIntuition/packages/blob/dde4fdf5774447b84cd0b820593fb0db7366e58d/packages/sdk/src/actions/plans/helpers.ts#L144) |
| `MultiVaultFeeReadContext`  | Internal supporting type; not a public import | [Source definition](https://github.com/0xIntuition/packages/blob/dde4fdf5774447b84cd0b820593fb0db7366e58d/packages/sdk/src/actions/plans/helpers.ts#L78)  |

## Supporting input and result structures

These declarations retain their owning source links. Internal supporting types describe accepted shapes but are not standalone public imports.

### CurveRedeemFeeReadContext

[Source definition](https://github.com/0xIntuition/packages/blob/dde4fdf5774447b84cd0b820593fb0db7366e58d/packages/sdk/src/actions/plans/helpers.ts#L144)

```ts
export type CurveRedeemFeeReadContext = {
  curveAddress?: Address;
  hasRedeemFeeHook?: boolean;
  curveRedeemFee?: bigint;
};
```

### MultiVaultFeeReadContext

[Source definition](https://github.com/0xIntuition/packages/blob/dde4fdf5774447b84cd0b820593fb0db7366e58d/packages/sdk/src/actions/plans/helpers.ts#L78)

```ts
export type MultiVaultFeeReadContext = {
  /** `totalShares` of the vault being deposited into. Zero means this deposit bootstraps it. */
  vaultTotalShares?: bigint;
  /** `totalShares` of the DEFAULT curve's vault, which is what the fee threshold is measured on. */
  defaultVaultTotalShares?: bigint;
  defaultCurveId?: bigint;
  registryAddress?: Address;
  minShare?: bigint;
  feeThreshold?: bigint;
  /** `MultiVault.getGeneralConfig().feeDenominator`, which every fee rate is expressed against. */
  feeDenominator?: bigint;
  isTriple?: boolean;
  /** What `previewMint(minShare, 0, 0, curveId)` returns on the target curve. */
  minShareCostPerUnit?: bigint;
  /** `MultiVault.getAtomConfig().atomWalletDepositFee`, charged on every atom deposit. */
  atomWalletDepositFee?: bigint;
  /** `MultiVault.atomDepositFractionAmount(feeBase)`, charged on every triple deposit. */
  atomDepositFractionAmount?: bigint;
  /** The three atoms under a triple, whose thresholds gate the fraction above. */
  tripleAtomIds?: readonly [Hex, Hex, Hex];
};
```

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

### MultiVaultPreviewRedeemResult

Module-local helper; not a public export.

```ts
type MultiVaultPreviewRedeemResult =
  | readonly [bigint, bigint]
  | {
      assetsOut: bigint;
      sharesUsed: bigint;
    };
```

### MultiVaultPreviewCreateResult

Module-local helper; not a public export.

```ts
type MultiVaultPreviewCreateResult =
  | readonly [bigint, bigint, bigint]
  | {
      sharesOut: bigint;
      feeBaseAssets: bigint;
      assetsAfterFees: bigint;
    };
```

### MultiVaultDepositPlanReadContext

Public export.

```ts
export type MultiVaultDepositPlanReadContext = MultiVaultFeeReadContext & {
  previewDeposit?: MultiVaultPreviewDepositResult;
  entryFeeAmount?: bigint;
  protocolFeeAmount?: bigint;
  currentSharePrice?: bigint;
};
```

### MultiVaultRedeemPlanReadContext

Public export.

```ts
export type MultiVaultRedeemPlanReadContext = MultiVaultFeeReadContext &
  CurveRedeemFeeReadContext & {
    /** Gross assets the shares convert to, before any fee. Replaces the holder-agnostic preview. */
    convertToAssets?: bigint;
    exitFeeAmount?: bigint;
    protocolFeeAmount?: bigint;
    currentSharePrice?: bigint;
  };
```

### MultiVaultCreatePlanReadContext

Public export.

```ts
export type MultiVaultCreatePlanReadContext = {
  previewCreate?: MultiVaultPreviewCreateResult;
};
```

### MultiVaultCreateAtomPlanInput

Public export.

```ts
export type MultiVaultCreateAtomPlanInput = {
  termId: Hex;
  data: Hex;
  assetsIn: bigint;
  readContext?: MultiVaultCreatePlanReadContext;
};
```

### MultiVaultCreateTriplePlanInput

Public export.

```ts
export type MultiVaultCreateTriplePlanInput = {
  termId: Hex;
  subjectId: Hex;
  predicateId: Hex;
  objectId: Hex;
  assetsIn: bigint;
  readContext?: MultiVaultCreatePlanReadContext;
};
```

### MultiVaultSeedDepositPlanInput

Public export.

```ts
export type MultiVaultSeedDepositPlanInput = {
  termId: Hex;
  curveId: bigint;
  assetsIn: bigint;
  slippageBps?: bigint;
  readContext?: MultiVaultDepositPlanReadContext;
};
```

### BuildMultiVaultDepositPlanInputs

Public export.

```ts
export type BuildMultiVaultDepositPlanInputs = {
  chainId?: IntuitionCoreChainId;
  multiVaultAddress: Address;
  receiver: Address;
  termId: Hex;
  curveId: bigint;
  assetsIn: bigint;
  slippageBps?: bigint;
  value?: bigint;
  readContext?: MultiVaultDepositPlanReadContext;
};
```

### BuildMultiVaultRedeemPlanInputs

Public export.

```ts
export type BuildMultiVaultRedeemPlanInputs = {
  chainId?: IntuitionCoreChainId;
  multiVaultAddress: Address;
  receiver: Address;
  termId: Hex;
  curveId: bigint;
  /** The account redeeming. A curve whose withdrawal rate keys on the holder needs to know who. */
  account: Address;
  sharesIn: bigint;
  slippageBps?: bigint;
  readContext?: MultiVaultRedeemPlanReadContext;
};
```

### BuildMultiVaultCreateAndSeedPlanInputs

Public export.

```ts
export type BuildMultiVaultCreateAndSeedPlanInputs = {
  chainId?: IntuitionCoreChainId;
  multiVaultAddress: Address;
  receiver: Address;
  atomsToCreate?: MultiVaultCreateAtomPlanInput[];
  triplesToCreate?: MultiVaultCreateTriplePlanInput[];
  seedDeposits?: MultiVaultSeedDepositPlanInput[];
};
```

### MultiVaultOnBehalfOfAtomPlanInput

Public export.

```ts
export type MultiVaultOnBehalfOfAtomPlanInput = { data: Hex; assets: bigint };
```

### MultiVaultOnBehalfOfTriplePlanInput

Public export.

```ts
export type MultiVaultOnBehalfOfTriplePlanInput = {
  subjectId: Hex;
  predicateId: Hex;
  objectId: Hex;
  assets: bigint;
};
```

### BuildMultiVaultOnBehalfOfCreationPlanInputs

Public export.

```ts
export type BuildMultiVaultOnBehalfOfCreationPlanInputs = {
  chainId?: IntuitionCoreChainId;
  multiVaultAddress: Address;
  creator: Address;
  caller: Address;
  atoms?: MultiVaultOnBehalfOfAtomPlanInput[];
  triples?: MultiVaultOnBehalfOfTriplePlanInput[];
  approvalAlreadyGranted: boolean;
  /**
   * Whether `creator` already granted `caller` DEPOSIT/REDEMPTION approval. `approve`
   * REPLACES the caller's entire approval bitmask rather than adding a bit, so these
   * must be read live before invoking this plan — omitting them (or defaulting them to
   * `false`) would silently revoke any existing grant the approval step writes over.
   */
  hasDepositApproval: boolean;
  hasRedemptionApproval: boolean;
};
```

### MultiVaultMulticallSubCallPlanInput

Public export.

```ts
export type MultiVaultMulticallSubCallPlanInput = {
  calldata: Hex;
  value: bigint;
};
```

### BuildMultiVaultMulticallPlanInputs

Public export.

```ts
export type BuildMultiVaultMulticallPlanInputs = {
  chainId?: IntuitionCoreChainId;
  subCalls: MultiVaultMulticallSubCallPlanInput[];
};
```
