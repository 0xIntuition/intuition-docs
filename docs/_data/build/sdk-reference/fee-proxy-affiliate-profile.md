---
title: 'FeeProxy affiliate profile'
slug: /build/sdk-reference/fee-proxy-affiliate-profile
---

Generated from the upcoming SDK **4.0.0** source. See [release compatibility](../compatibility.md) before installing or connecting to a deployment. Regenerate with `node scripts/generate-package-reference.js /path/to/packages`.

Import from `@0xintuition/sdk/actions`. [Implementation and internal helpers](https://github.com/0xIntuition/packages/blob/1dc7103d2a05f23bc565a81df4b001336ce9ba53/packages/sdk/src/actions/fee-proxy-affiliate-profile.ts).

Signatures show the exact accepted inputs and return types. Named input/output structures and dependency-injection types are listed below; viem and protocol types come from their respective packages. Preparation and quote functions can perform RPC reads. **`feeProxyExecutePlan` sends transactions**; the other SDK actions on these pages prepare transactions or read data.

## feeProxyGetAffiliateProfile

Reads everything a builder dashboard shows for one affiliate in one batched read: the registry
row (fees, fee recipient, registration time, pause flag), whether it is active, its aggregate
stats, the protocol caps and the registration fee. Uses the chain's Multicall3 (or the canonical
address); when the batch is unavailable or any leg fails it falls back to individual reads.

[Source](https://github.com/0xIntuition/packages/blob/1dc7103d2a05f23bc565a81df4b001336ce9ba53/packages/sdk/src/actions/fee-proxy-affiliate-profile.ts#L136)

```ts
function feeProxyGetAffiliateProfile(
  config: ReadConfig,
  inputs: {
    affiliate: Address;
  },
): Promise<FeeProxyAffiliateProfile>;
```

- **`config`**: FeeProxy address and public client.
- **`inputs`**: The affiliate to profile.
- **returns**: The normalised profile: raw fees, fees as percentages, and headroom against the caps.

## Input and result types

```ts
export type FeeProxyAffiliateStats = ContractFunctionReturnType<
  typeof FeeProxyAbi,
  'view',
  'affiliateStats'
>;

export type FeeProxyFeeHeadroom = {
  depositBps: bigint;
  creationBps: bigint;
  depositFixedFee: bigint;
  creationFixedFee: bigint;
};

export type FeeProxyAffiliateProfile = {
  affiliate: Address;
  registered: boolean;
  /** Registered and not row-paused: the condition every routing call checks. */
  active: boolean;
  paused: boolean;
  /** Unix seconds; zero when unregistered. */
  registeredAt: bigint;
  feeRecipient: Address;
  fees: FeeConfig;
  /** The bps fields as percentages, for display (`250n` bps is `2.5`). */
  feePercent: { deposit: number; creation: number };
  caps: { maxFeeBps: bigint; maxFixedFee: bigint; maxFeePercent: number };
  headroom: FeeProxyFeeHeadroom;
  /**
   * Whether each side's row is within the current protocol caps. Routing on a side that is over
   * the cap reverts until the affiliate lowers its fees.
   */
  withinCaps: { deposit: boolean; creation: boolean };
  registrationFee: bigint;
  stats: FeeProxyAffiliateStats;
};

type AffiliateProfileReads = {
  config: ContractFunctionReturnType<
    typeof FeeProxyAbi,
    'view',
    'affiliateConfig'
  >;
  active: boolean;
  stats: FeeProxyAffiliateStats;
  maxFeeBps: bigint;
  maxFixedFee: bigint;
  registrationFee: bigint;
};
```
