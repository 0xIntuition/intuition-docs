---
title: 'TrustBonding actions'
slug: /build/sdk-reference/trust-bonding
---

Generated from the upcoming SDK **4.0.0** source. See [release compatibility](../compatibility.md) before installing or connecting to a deployment. Regenerate with `node scripts/generate-package-reference.js /path/to/packages`.

Import from `@0xintuition/sdk/actions`. [Implementation and internal helpers](https://github.com/0xIntuition/packages/blob/1dc7103d2a05f23bc565a81df4b001336ce9ba53/packages/sdk/src/actions/trust-bonding.ts).

Signatures show the exact accepted inputs and return types. Named input/output structures and dependency-injection types are listed below; viem and protocol types come from their respective packages. Preparation and quote functions can perform RPC reads. **`feeProxyExecutePlan` sends transactions**; the other SDK actions on these pages prepare transactions or read data.

## trustBondingGetRewardsDashboard

Read epoch, utilization, balance, and reward information for the selected account and return a dashboard snapshot.

[Source](https://github.com/0xIntuition/packages/blob/1dc7103d2a05f23bc565a81df4b001336ce9ba53/packages/sdk/src/actions/trust-bonding.ts#L308)

```ts
function trustBondingGetRewardsDashboard(
  config: ReadConfig,
  inputs: {
    account: Address;
  },
  deps?: TrustBondingDashboardDeps,
): Promise<TrustBondingRewardsDashboard>;
```

Defaults: `deps = defaultTrustBondingDeps`. Dependency arguments are optional test/customization hooks; normal consumers use the built-in dependencies.

## trustBondingGetClaimActionState

Determine whether the selected account can claim rewards and return the reason and claim state for the UI.

[Source](https://github.com/0xIntuition/packages/blob/1dc7103d2a05f23bc565a81df4b001336ce9ba53/packages/sdk/src/actions/trust-bonding.ts#L348)

```ts
function trustBondingGetClaimActionState(
  config: ReadConfig,
  inputs: {
    account: Address;
    recipient?: string | null;
  },
  deps?: TrustBondingDashboardDeps,
): Promise<TrustBondingClaimActionState>;
```

Defaults: `deps = defaultTrustBondingDeps`. Dependency arguments are optional test/customization hooks; normal consumers use the built-in dependencies.

## trustBondingPrepareLockAction

Determine the applicable lock operation and prepare its calldata and value. The result describes the action; it does not request a signature.

[Source](https://github.com/0xIntuition/packages/blob/1dc7103d2a05f23bc565a81df4b001336ce9ba53/packages/sdk/src/actions/trust-bonding.ts#L456)

```ts
function trustBondingPrepareLockAction(
  config: ReadConfig,
  inputs: {
    account: Address;
    amountDelta?: bigint;
    unlockTime?: bigint;
    nowTimestamp?: bigint;
  },
  deps?: TrustBondingLockDeps,
): Promise<TrustBondingLockActionPlan>;
```

Defaults: `deps = defaultTrustBondingLockDeps`. Dependency arguments are optional test/customization hooks; normal consumers use the built-in dependencies.

## trustBondingClaimAndRestakePlan

Prepare ordered claim and restake steps using the current account and lock state. Review the plan before executing it.

[Source](https://github.com/0xIntuition/packages/blob/1dc7103d2a05f23bc565a81df4b001336ce9ba53/packages/sdk/src/actions/trust-bonding.ts#L570)

```ts
function trustBondingClaimAndRestakePlan(
  config: ReadConfig,
  inputs: {
    account: Address;
    recipient?: Address;
    target:
      | {
          kind: 'trust-bonding';
          wrappedTrustAddress: Address;
          beneficiary?: Address;
        }
      | {
          kind: 'multivault';
          receiver?: Address;
          termId: Hex;
          curveId: bigint;
          multiVaultConfig: WriteConfig;
          slippageBps?: bigint;
        };
  },
  deps?: TrustBondingClaimAndRestakeDeps,
): Promise<TrustBondingClaimAndRestakePlanResult>;
```

Defaults: `deps = defaultTrustBondingClaimAndRestakeDeps`. Dependency arguments are optional test/customization hooks; normal consumers use the built-in dependencies.

## trustBondingGetLockStateSummary

Read the account lock balance, expiry, and related state into a normalized summary.

[Source](https://github.com/0xIntuition/packages/blob/1dc7103d2a05f23bc565a81df4b001336ce9ba53/packages/sdk/src/actions/trust-bonding.ts#L695)

```ts
function trustBondingGetLockStateSummary(
  config: ReadConfig,
  inputs: {
    account: Address;
    nowTimestamp?: bigint;
  },
  deps?: TrustBondingLockDeps,
): Promise<TrustBondingLockStateSummary>;
```

Defaults: `deps = defaultTrustBondingLockDeps`. Dependency arguments are optional test/customization hooks; normal consumers use the built-in dependencies.

## trustBondingGetEpochRewardsTimeline

Read reward information across the requested epoch window and return timeline points for presentation.

[Source](https://github.com/0xIntuition/packages/blob/1dc7103d2a05f23bc565a81df4b001336ce9ba53/packages/sdk/src/actions/trust-bonding.ts#L731)

```ts
function trustBondingGetEpochRewardsTimeline(
  config: ReadConfig,
  inputs: {
    account: Address;
    startEpoch: bigint;
    endEpoch: bigint;
  },
  deps?: TrustBondingTimelineDeps,
): Promise<TrustBondingEpochRewardsTimeline>;
```

Defaults: `deps = defaultTrustBondingTimelineDeps`. Dependency arguments are optional test/customization hooks; normal consumers use the built-in dependencies.

## Input and result types

```ts
type ApyTuple = readonly [bigint, bigint] & {
  currentApy?: bigint;
  maxApy?: bigint;
};

type UserInfoTuple = readonly [
  bigint,
  bigint,
  bigint,
  bigint,
  bigint,
  bigint,
] & {
  personalUtilization?: bigint;
  eligibleRewards?: bigint;
  maxRewards?: bigint;
  lockedAmount?: bigint;
  lockEnd?: bigint;
  bondedBalance?: bigint;
};

type LockedTuple = readonly [bigint, bigint] & {
  amount?: bigint;
  end?: bigint;
};

type UserRewardsForEpochTuple = readonly [bigint, bigint] & {
  currentRewards?: bigint;
  maxRewards?: bigint;
};

export type TrustBondingUserInfoSnapshot = {
  personalUtilization: bigint;
  eligibleRewards: bigint;
  maxRewards: bigint;
  lockedAmount: bigint;
  lockEnd: bigint;
  bondedBalance: bigint;
};

export type TrustBondingRewardsDashboard = {
  account: Address;
  currentEpoch: bigint;
  previousEpoch: bigint;
  currentEpochEndTimestamp: bigint;
  userInfo: TrustBondingUserInfoSnapshot;
  currentClaimableRewards: bigint;
  userApy: {
    currentApy: bigint;
    maxApy: bigint;
  };
  systemApy: {
    currentApy: bigint;
    maxApy: bigint;
  };
  hasClaimedPreviousEpochRewards: boolean;
};

export type TrustBondingClaimActionReason =
  | 'can-claim'
  | 'invalid-recipient'
  | 'too-early'
  | 'already-claimed'
  | 'nothing-to-claim'
  | 'inconsistent-state';

export type TrustBondingClaimActionState = {
  account: Address;
  recipient: Address | null;
  currentEpoch: bigint;
  previousEpoch: bigint | null;
  claimableRewards: bigint;
  hasClaimedPreviousEpochRewards: boolean | null;
  canClaim: boolean;
  reason: TrustBondingClaimActionReason;
  ctaLabel: string;
};

export type TrustBondingLockActionKind =
  | 'createLock'
  | 'increaseAmount'
  | 'increaseUnlockTime'
  | 'increaseAmountAndTime'
  | 'withdrawAndCreateLock';

export type TrustBondingLockActionPlan = {
  account: Address;
  action: TrustBondingLockActionKind;
  args: readonly bigint[];
  calldata: Hex;
  lockedAmount: bigint;
  lockEnd: bigint;
  nowTimestamp: bigint;
  isExpired: boolean;
};

export type TrustBondingClaimAndRestakeStep = {
  type:
    | 'claimRewards'
    | 'wrappedTrustDeposit'
    | 'wrappedTrustApprove'
    | 'trustBondingDepositFor'
    | 'multiVaultDeposit';
  to: Address;
  calldata: Hex;
  value?: bigint;
  estimatedAmount: bigint;
};

export type TrustBondingClaimAndRestakePlanResult = {
  account: Address;
  recipient: Address;
  claimableRewards: bigint;
  target: 'trust-bonding' | 'multivault';
  steps: TrustBondingClaimAndRestakeStep[];
  estimatedSharesOut?: bigint;
  minSharesOut?: bigint;
};

export type TrustBondingLockStateSummary = {
  account: Address;
  lockedAmount: bigint;
  lockEnd: bigint;
  nowTimestamp: bigint;
  isExpired: boolean;
  timeRemaining: bigint;
  nextActions: TrustBondingLockActionKind[];
};

export type TrustBondingEpochRewardsPoint = {
  epoch: bigint;
  eligibleRewards: bigint;
  currentRewards: bigint;
  maxRewards: bigint;
  hasClaimed: boolean;
  personalUtilizationRatio: bigint;
  systemUtilizationRatio: bigint;
  statusLabel: 'claimed' | 'claimable' | 'unclaimed' | 'no-rewards';
};

export type TrustBondingEpochRewardsTimeline = {
  account: Address;
  startEpoch: bigint;
  endEpoch: bigint;
  currentEpoch: bigint;
  totalEligibleRewards: bigint;
  totalCurrentRewards: bigint;
  totalMaxRewards: bigint;
  points: TrustBondingEpochRewardsPoint[];
};

type TrustBondingDashboardDeps = {
  currentEpoch: typeof trustBondingCurrentEpoch;
  previousEpoch: typeof trustBondingPreviousEpoch;
  epochTimestampEnd: typeof trustBondingEpochTimestampEnd;
  getUserInfo: typeof trustBondingGetUserInfo;
  getUserCurrentClaimableRewards: typeof trustBondingGetUserCurrentClaimableRewards;
  getUserApy: typeof trustBondingGetUserApy;
  getSystemApy: typeof trustBondingGetSystemApy;
  hasClaimedRewardsForEpoch: typeof trustBondingHasClaimedRewardsForEpoch;
};

type TrustBondingLockDeps = {
  locked: typeof trustBondingLocked;
  lockedEnd: typeof trustBondingLockedEnd;
};

type TrustBondingClaimAndRestakeDeps = {
  getClaimActionState: typeof trustBondingGetClaimActionState;
  previewDeposit: typeof multiVaultPreviewDeposit;
};

type TrustBondingTimelineDeps = {
  currentEpoch: typeof trustBondingCurrentEpoch;
  userEligibleRewardsForEpoch: typeof trustBondingUserEligibleRewardsForEpoch;
  hasClaimedRewardsForEpoch: typeof trustBondingHasClaimedRewardsForEpoch;
  getUserRewardsForEpoch: typeof trustBondingGetUserRewardsForEpoch;
  getPersonalUtilizationRatio: typeof trustBondingGetPersonalUtilizationRatio;
  getSystemUtilizationRatio: typeof trustBondingGetSystemUtilizationRatio;
};
```
