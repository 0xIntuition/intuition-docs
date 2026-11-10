---
title: 'TrustBonding action envelopes'
slug: /build/sdk-reference/plans-trust-bonding
---

API for `@0xintuition/sdk@4.0.0-alpha.0`. [Compatibility](../compatibility.md) · [Source](https://github.com/0xIntuition/packages/blob/dde4fdf5774447b84cd0b820593fb0db7366e58d/packages/sdk/src/actions/plans/trust-bonding.ts).

Import from `@0xintuition/sdk/actions`.

Signatures show the exact accepted inputs and return types. Named input/output structures and dependency-injection types are listed below; viem and protocol types come from their respective packages. Preparation and quote functions can perform RPC reads. Envelope builders on the action-envelope pages use caller-supplied read context and perform no RPC reads or signing. **`feeProxyExecutePlan` sends transactions**; the other SDK actions on these pages prepare transactions or read data.

## trustBondingClaimEnvelope

Build reward-claim steps from supplied epoch and claim state, without fetching or submitting.

[Source](https://github.com/0xIntuition/packages/blob/dde4fdf5774447b84cd0b820593fb0db7366e58d/packages/sdk/src/actions/plans/trust-bonding.ts#L192)

```ts
function trustBondingClaimEnvelope(
  inputs: BuildTrustBondingClaimPlanInputs,
): Promise<import('@0xintuition/sdk/actions').AgentActionEnvelope>;
```

## trustBondingLockEnvelope

Build the applicable lock action from supplied lock state and time, without fetching or submitting.

[Source](https://github.com/0xIntuition/packages/blob/dde4fdf5774447b84cd0b820593fb0db7366e58d/packages/sdk/src/actions/plans/trust-bonding.ts#L239)

```ts
function trustBondingLockEnvelope(
  inputs: BuildTrustBondingLockPlanInputs,
): Promise<import('@0xintuition/sdk/actions').AgentActionEnvelope>;
```

## trustBondingClaimAndRestakeEnvelope

Build ordered claim and restake steps from supplied reward and target-vault context.

[Source](https://github.com/0xIntuition/packages/blob/dde4fdf5774447b84cd0b820593fb0db7366e58d/packages/sdk/src/actions/plans/trust-bonding.ts#L308)

```ts
function trustBondingClaimAndRestakeEnvelope(
  inputs: BuildTrustBondingClaimAndRestakePlanInputs,
): Promise<import('@0xintuition/sdk/actions').AgentActionEnvelope>;
```

## Imported type provenance

Public import locations and the definitions used by these signatures and helper types. Value imports appear where a dependency hook uses `typeof`.

| Name in this module                | Public import                                                                      | Definition                                                                                 |
| ---------------------------------- | ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| `Address`                          | `import type { Address } from 'viem'`                                              | Owned by the external package.                                                             |
| `Hex`                              | `import type { Hex } from 'viem'`                                                  | Owned by the external package.                                                             |
| `MultiVaultDepositPlanReadContext` | `import type { MultiVaultDepositPlanReadContext } from '@0xintuition/sdk/actions'` | [MultiVaultDepositPlanReadContext](./plans-multivault.md#multivaultdepositplanreadcontext) |

## Input and result types

Exported declarations are public imports from the SDK subpath above. Module-local helper aliases describe accepted shapes but are not public exports.

### IntuitionCoreChainId

Module-local helper; not a public export.

```ts
type IntuitionCoreChainId = 1155 | 13579;
```

### TrustBondingClaimPlanReadContext

Module-local helper; not a public export.

```ts
type TrustBondingClaimPlanReadContext = {
  currentEpoch?: bigint;
  previousEpoch?: bigint;
  claimableRewards?: bigint;
  hasClaimedPreviousEpochRewards?: boolean;
};
```

### TrustBondingLockPlanReadContext

Module-local helper; not a public export.

```ts
type TrustBondingLockPlanReadContext = {
  lockedAmount?: bigint;
  lockEnd?: bigint;
};
```

### TrustBondingRestakeTarget

Module-local helper; not a public export.

```ts
type TrustBondingRestakeTarget =
  | {
      kind: 'trust-bonding';
      wrappedTrustAddress: Address;
      beneficiary?: Address;
    }
  | {
      kind: 'multivault';
      multiVaultAddress: Address;
      receiver?: Address;
      termId: Hex;
      curveId: bigint;
      slippageBps?: bigint;
      readContext?: Pick<MultiVaultDepositPlanReadContext, 'previewDeposit'>;
    };
```

### BuildTrustBondingClaimPlanInputs

Public export.

```ts
export type BuildTrustBondingClaimPlanInputs = {
  chainId?: IntuitionCoreChainId;
  trustBondingAddress: Address;
  account: Address;
  recipient?: string | null;
  readContext?: TrustBondingClaimPlanReadContext;
};
```

### BuildTrustBondingLockPlanInputs

Public export.

```ts
export type BuildTrustBondingLockPlanInputs = {
  chainId?: IntuitionCoreChainId;
  trustBondingAddress: Address;
  account: Address;
  amountDelta?: bigint;
  unlockTime?: bigint;
  nowTimestamp?: bigint;
  readContext?: TrustBondingLockPlanReadContext;
};
```

### BuildTrustBondingClaimAndRestakePlanInputs

Public export.

```ts
export type BuildTrustBondingClaimAndRestakePlanInputs = {
  chainId?: IntuitionCoreChainId;
  trustBondingAddress: Address;
  account: Address;
  recipient?: Address | null;
  readContext?: TrustBondingClaimPlanReadContext;
  target: TrustBondingRestakeTarget;
};
```
