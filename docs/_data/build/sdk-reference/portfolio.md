---
title: 'Portfolio reads'
slug: /build/sdk-reference/portfolio
---

Generated from the upcoming SDK **4.0.0** source. See [release compatibility](../compatibility.md) before installing or connecting to a deployment. Regenerate with `node scripts/generate-package-reference.js /path/to/packages`.

Import from `@0xintuition/sdk/actions`. [Implementation and internal helpers](https://github.com/0xIntuition/packages/blob/1dc7103d2a05f23bc565a81df4b001336ce9ba53/packages/sdk/src/actions/portfolio.ts).

Signatures show the exact accepted inputs and return types. Named input/output structures and dependency-injection types are listed below; viem and protocol types come from their respective packages. Preparation and quote functions can perform RPC reads. **`feeProxyExecutePlan` sends transactions**; the other SDK actions on these pages prepare transactions or read data.

## portfolioGetIntuitionPositionsSnapshot

Read balances and vault state for the explicitly supplied account and term/curve positions. This does not discover every position held by an account.

[Source](https://github.com/0xIntuition/packages/blob/1dc7103d2a05f23bc565a81df4b001336ce9ba53/packages/sdk/src/actions/portfolio.ts#L79)

```ts
function portfolioGetIntuitionPositionsSnapshot(
  configs: {
    multiVault: ReadConfig;
    trustBonding: ReadConfig;
  },
  inputs: {
    account: Address;
    positions: PortfolioPositionInput[];
    includeUtilization?: boolean;
    nowTimestamp?: bigint;
  },
  deps?: PortfolioDeps,
): Promise<PortfolioIntuitionPositionsSnapshot>;
```

Defaults: `deps = defaultPortfolioDeps`. Dependency arguments are optional test/customization hooks; normal consumers use the built-in dependencies.

## portfolioGetActionableState

Combine position snapshots with TrustBonding claim state so an application can decide which actions to offer.

[Source](https://github.com/0xIntuition/packages/blob/1dc7103d2a05f23bc565a81df4b001336ce9ba53/packages/sdk/src/actions/portfolio.ts#L128)

```ts
function portfolioGetActionableState(
  configs: {
    multiVault: ReadConfig;
    trustBonding: ReadConfig;
    wrappedTrust?: ReadConfig;
  },
  inputs: {
    account: Address;
    positions: PortfolioPositionInput[];
    nowTimestamp?: bigint;
    recipient?: string | null;
    expectedWrappedTrustSpend?: bigint;
  },
  deps?: PortfolioDeps,
): Promise<PortfolioActionableState>;
```

Defaults: `deps = defaultPortfolioDeps`. Dependency arguments are optional test/customization hooks; normal consumers use the built-in dependencies.

## Input and result types

```ts
export type PortfolioPositionInput = {
  termId: Hex;
  curveId: bigint;
};

export type PortfolioIntuitionPositionsSnapshot = {
  account: Address;
  positions: MultiVaultUserPositionSnapshot[];
  trustBonding: {
    dashboard: TrustBondingRewardsDashboard;
    lockState: TrustBondingLockStateSummary;
  };
  totals: {
    totalShares: bigint;
    totalEstimatedAssets: bigint;
    totalEstimatedRedeemableAssets: bigint;
  };
};

export type PortfolioActionableState = {
  account: Address;
  claim: TrustBondingClaimActionState;
  lock: TrustBondingLockStateSummary;
  redeemablePositions: Array<{
    termId: Hex;
    curveId: bigint;
    maxRedeemShares: bigint;
    estimatedAssetsForMaxRedeem: bigint;
    canRedeem: boolean;
  }>;
  approval: {
    checked: boolean;
    currentAllowance: bigint | null;
    requiredAllowance: bigint;
    required: boolean;
  };
  prioritizedCtas: string[];
};

type PortfolioDeps = {
  getUserPositionSnapshot: typeof multivaultGetUserPositionSnapshot;
  getRewardsDashboard: typeof trustBondingGetRewardsDashboard;
  getLockStateSummary: typeof trustBondingGetLockStateSummary;
  getClaimActionState: typeof trustBondingGetClaimActionState;
  getWrappedTrustAllowance: typeof wrappedTrustAllowance;
};
```
