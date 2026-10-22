---
title: 'MultiVault actions'
slug: /build/sdk-reference/multivault
---

Generated from the upcoming SDK **4.0.0** source. See [release compatibility](../compatibility.md) before installing or connecting to a deployment. Regenerate with `node scripts/generate-package-reference.js /path/to/packages`.

Import from `@0xintuition/sdk/actions`. [Implementation and internal helpers](https://github.com/0xIntuition/packages/blob/1dc7103d2a05f23bc565a81df4b001336ce9ba53/packages/sdk/src/actions/multivault.ts).

Signatures show the exact accepted inputs and return types. Named input/output structures and dependency-injection types are listed below; viem and protocol types come from their respective packages. Preparation and quote functions can perform RPC reads. **`feeProxyExecutePlan` sends transactions**; the other SDK actions on these pages prepare transactions or read data.

## multivaultResolveDepositFeeBase

Resolves the base MultiVault will charge fees on for a deposit.

On a vault's first deposit MultiVault nets a min-share bootstrap cost out of the gross assets
BEFORE computing any fee (doubled for triples) — see `MultiVaultLib._calculateAtomDeposit`. A quote
that applies fee rates to the gross amount therefore disagrees with the contract on exactly that
deposit, in every fee component at once. Exported because more than one quote needs it, and
because a consumer reconciling a quote against a receipt needs to know which number was quoted.

[Source](https://github.com/0xIntuition/packages/blob/1dc7103d2a05f23bc565a81df4b001336ce9ba53/packages/sdk/src/actions/multivault.ts#L498)

```ts
function multivaultResolveDepositFeeBase(
  config: ReadConfig,
  inputs: {
    termId: Hex;
    curveId: bigint;
    assetsIn: bigint;
  },
  deps?: MultiVaultDepositFeeBaseDeps,
): Promise<MultiVaultDepositFeeBase>;
```

- **`config`**: MultiVault address and public client.
- **`inputs`**: The term, curve and gross assets being deposited.
- **returns**: The fee base, whether this is the bootstrapping deposit, and what the bootstrap cost.

Defaults: `deps = defaultDepositFeeBaseDeps`. Dependency arguments are optional test/customization hooks; normal consumers use the built-in dependencies.

## multivaultQuoteTermDepositFee

The term-type-specific deposit fee: the atom-wallet cut on an atom, or the underlying-atom
fraction on a triple.

MultiVault charges this alongside its entry and protocol fees, so a quote that reports only those
two can never sum to the shares actually minted. On an atom it is `atomWalletDepositFee` applied
to the fee base; on a triple it is `atomDepositFractionForTriple`, waived unless ALL THREE
underlying atoms are individually above the fee threshold.

[Source](https://github.com/0xIntuition/packages/blob/1dc7103d2a05f23bc565a81df4b001336ce9ba53/packages/sdk/src/actions/multivault.ts#L545)

```ts
function multivaultQuoteTermDepositFee(
  config: ReadConfig,
  inputs: {
    termId: Hex;
    feeBaseAssets: bigint;
  },
  deps?: MultiVaultDepositFeeBaseDeps & MultiVaultTermFeeDeps,
): Promise<{
  kind: 'atom-wallet' | 'atom-deposit-fraction';
  fee: bigint;
  waived: boolean;
}>;
```

- **`config`**: MultiVault address and public client.
- **`inputs`**: The term and the fee base to charge on.
- **`deps`**: Injectable protocol read primitives.
- **returns**: The fee and which kind it is.

Defaults: `deps = {
		...defaultDepositFeeBaseDeps,
		...defaultTermFeeDeps,
	}`. Dependency arguments are optional test/customization hooks; normal consumers use the built-in dependencies.

## multivaultWillChargeEntryFee

Whether MultiVault will charge its entry fee on a deposit into this term.

Waived while the DEFAULT curve's vault holds fewer shares than `feeThreshold`: fees are routed
into that vault, and donating them into a near-empty share supply would move its price. A quote
that assumes the fee always applies overstates it.

[Source](https://github.com/0xIntuition/packages/blob/1dc7103d2a05f23bc565a81df4b001336ce9ba53/packages/sdk/src/actions/multivault.ts#L600)

```ts
function multivaultWillChargeEntryFee(
  config: ReadConfig,
  inputs: {
    termId: Hex;
  },
  deps?: MultiVaultFeeContextDeps,
): Promise<boolean>;
```

- **`config`**: MultiVault address and public client.
- **`inputs`**: The term being deposited into.
- **returns**: True if the entry fee applies.

Defaults: `deps = defaultFeeContextDeps`. Dependency arguments are optional test/customization hooks; normal consumers use the built-in dependencies.

## multivaultWillChargeExitFee

Whether MultiVault will charge its exit fee on a redemption.

Same threshold as the entry fee, measured on what the default vault would be LEFT with — so
whether it applies depends on the size of the redemption, not only on the term.

[Source](https://github.com/0xIntuition/packages/blob/1dc7103d2a05f23bc565a81df4b001336ce9ba53/packages/sdk/src/actions/multivault.ts#L625)

```ts
function multivaultWillChargeExitFee(
  config: ReadConfig,
  inputs: {
    termId: Hex;
    curveId: bigint;
    sharesIn: bigint;
  },
  deps?: MultiVaultFeeContextDeps,
): Promise<boolean>;
```

- **`config`**: MultiVault address and public client.
- **`inputs`**: The term, curve and share count being redeemed.
- **returns**: True if the exit fee applies.

Defaults: `deps = defaultFeeContextDeps`. Dependency arguments are optional test/customization hooks; normal consumers use the built-in dependencies.

## multivaultQuoteCurveRedeemFee

The curve-level withdrawal fee for a specific account, or zero if the curve charges none.

Curve-agnostic: it asks the curve whether it has a redeem hook and, if so, quotes it for THIS
account. MultiVault's own `previewRedeem` quotes the same hook with the zero address, which on a
curve whose rate keys on the holder's entry tier is a different — and for a slippage floor,
unusable — number.

[Source](https://github.com/0xIntuition/packages/blob/1dc7103d2a05f23bc565a81df4b001336ce9ba53/packages/sdk/src/actions/multivault.ts#L655)

```ts
function multivaultQuoteCurveRedeemFee(
  config: ReadConfig,
  inputs: {
    termId: Hex;
    curveId: bigint;
    account: Address;
    assetsBeforeFees: bigint;
  },
  deps?: MultiVaultCurveRedeemFeeDeps,
): Promise<{
  curveAddress: Address | null;
  curveFee: bigint;
}>;
```

- **`config`**: MultiVault address and public client.
- **`inputs`**: The term, curve, redeeming account and gross assets.
- **returns**: The curve's withdrawal fee for that account, and the curve it was quoted from.

Defaults: `deps = defaultCurveRedeemFeeDeps`. Dependency arguments are optional test/customization hooks; normal consumers use the built-in dependencies.

## multivaultQuoteDepositPlan

Read current vault and fee state and return a deposit quote, including expected output and the minimum shares to accept. No transaction is sent.

[Source](https://github.com/0xIntuition/packages/blob/1dc7103d2a05f23bc565a81df4b001336ce9ba53/packages/sdk/src/actions/multivault.ts#L676)

```ts
function multivaultQuoteDepositPlan(
  config: ReadConfig,
  inputs: {
    termId: Hex;
    curveId: bigint;
    assetsIn: bigint;
    slippageBps?: bigint;
  },
  deps?: MultiVaultQuoteDeps,
): Promise<MultiVaultDepositQuotePlan>;
```

Defaults: `deps = defaultQuoteDeps`. Dependency arguments are optional test/customization hooks; normal consumers use the built-in dependencies.

## multivaultPrepareDepositTx

Prepares a deposit transaction sized against its own quote.

MultiVault deposits exactly `msg.value`, so the transaction value IS the deposit: it defaults to
`assetsIn`, the amount the quote and its slippage floor were computed for. An explicit `value`
is passed through as given.

[Source](https://github.com/0xIntuition/packages/blob/1dc7103d2a05f23bc565a81df4b001336ce9ba53/packages/sdk/src/actions/multivault.ts#L757)

```ts
function multivaultPrepareDepositTx(
  config: WriteConfig,
  inputs: {
    receiver: Address;
    termId: Hex;
    curveId: bigint;
    assetsIn: bigint;
    slippageBps?: bigint;
    value?: bigint;
  },
  deps?: MultiVaultQuoteDeps,
): Promise<MultiVaultPrepareDepositTxResult>;
```

- **`config`**: MultiVault address and viem clients.
- **`inputs`**: Receiver, term, curve, gross assets, optional slippage and optional explicit value.
- **`deps`**: Injectable protocol read primitives.
- **returns**: The deposit calldata, args, the value to send with it, and the quote it was built from.

Defaults: `deps = defaultQuoteDeps`. Dependency arguments are optional test/customization hooks; normal consumers use the built-in dependencies.

## multivaultGetUserPositionSnapshot

Read an account balance and vault state for one term/curve pair and return its current position snapshot.

[Source](https://github.com/0xIntuition/packages/blob/1dc7103d2a05f23bc565a81df4b001336ce9ba53/packages/sdk/src/actions/multivault.ts#L788)

```ts
function multivaultGetUserPositionSnapshot(
  config: ReadConfig,
  inputs: {
    account: Address;
    termId: Hex;
    curveId: bigint;
    includeUtilization?: boolean;
  },
  deps?: MultiVaultPositionDeps,
): Promise<MultiVaultUserPositionSnapshot>;
```

Defaults: `deps = defaultPositionDeps`. Dependency arguments are optional test/customization hooks; normal consumers use the built-in dependencies.

## multivaultQuoteRedeemPlan

Quotes what a SPECIFIC account receives for redeeming shares, and the floor to send with it.

`account` is required, and that is the point. MultiVault's `previewRedeem` quotes any curve redeem
hook with the zero address, so on a curve whose withdrawal rate keys on where the holder entered
it returns a number that belongs to no one — and a `minAssets` derived from it is wrong in both
directions: too loose when it understates the payout, and unmeetable (the redeem reverts) when it
overstates it. This composes the payout from parts that each know who is asking: MultiVault's
gross conversion, its protocol fee, its exit fee where that fee actually applies, and the curve's
own account-aware quote.

[Source](https://github.com/0xIntuition/packages/blob/1dc7103d2a05f23bc565a81df4b001336ce9ba53/packages/sdk/src/actions/multivault.ts#L871)

```ts
function multivaultQuoteRedeemPlan(
  config: ReadConfig,
  inputs: {
    termId: Hex;
    curveId: bigint;
    account: Address;
    sharesIn: bigint;
    slippageBps?: bigint;
  },
  deps?: MultiVaultRedeemQuoteDeps,
): Promise<MultiVaultRedeemQuotePlan>;
```

- **`config`**: MultiVault address and public client.
- **`inputs`**: The term, curve, redeeming account, share count and optional slippage.
- **`deps`**: Injectable protocol read primitives.
- **returns**: The account's payout, its fee breakdown, and a slippage floor derived from it.

Defaults: `deps = defaultRedeemQuoteDeps`. Dependency arguments are optional test/customization hooks; normal consumers use the built-in dependencies.

## multivaultPrepareRedeemTx

Prepares a redeem transaction for a specific account, sized against its own quote.

[Source](https://github.com/0xIntuition/packages/blob/1dc7103d2a05f23bc565a81df4b001336ce9ba53/packages/sdk/src/actions/multivault.ts#L939)

```ts
function multivaultPrepareRedeemTx(
  config: WriteConfig,
  inputs: {
    receiver: Address;
    termId: Hex;
    curveId: bigint;
    account: Address;
    sharesIn: bigint;
    slippageBps?: bigint;
  },
  deps?: MultiVaultRedeemQuoteDeps,
): Promise<MultiVaultPrepareRedeemTxResult>;
```

- **`config`**: MultiVault address and viem clients.
- **`inputs`**: Receiver, term, curve, redeeming account, share count and optional slippage.
- **`deps`**: Injectable protocol read primitives.
- **returns**: The redeem calldata, args, and the quote it was built from.

Defaults: `deps = defaultRedeemQuoteDeps`. Dependency arguments are optional test/customization hooks; normal consumers use the built-in dependencies.

## multivaultCreateAndSeedTerm

Prepare ordered atom creation, triple creation, and seed-deposit steps with their quotes and total value. Requires WriteConfig in this candidate, but does not submit the plan.

[Source](https://github.com/0xIntuition/packages/blob/1dc7103d2a05f23bc565a81df4b001336ce9ba53/packages/sdk/src/actions/multivault.ts#L969)

```ts
function multivaultCreateAndSeedTerm(
  config: WriteConfig,
  inputs: {
    receiver: Address;
    atomsToCreate?: MultiVaultCreateAtomInput[];
    triplesToCreate?: MultiVaultCreateTripleInput[];
    seedDeposits?: MultiVaultSeedDepositInput[];
  },
  deps?: MultiVaultCreateAndSeedDeps,
): Promise<MultiVaultCreateAndSeedTermPlan>;
```

Defaults: `deps = defaultCreateAndSeedDeps`. Dependency arguments are optional test/customization hooks; normal consumers use the built-in dependencies.

## multivaultGetUtilizationAnalyticsBundle

Read protocol and personal utilization over the requested epochs and return an analytics bundle.

[Source](https://github.com/0xIntuition/packages/blob/1dc7103d2a05f23bc565a81df4b001336ce9ba53/packages/sdk/src/actions/multivault.ts#L1099)

```ts
function multivaultGetUtilizationAnalyticsBundle(
  config: ReadConfig,
  inputs: {
    account?: Address;
    startEpoch?: bigint;
    endEpoch?: bigint;
  },
  deps?: MultiVaultUtilizationDeps,
): Promise<MultiVaultUtilizationAnalyticsBundle>;
```

Defaults: `deps = defaultUtilizationDeps`. Dependency arguments are optional test/customization hooks; normal consumers use the built-in dependencies.

## multivaultPrepareOnBehalfOfCreationPlan

Prepares an on-behalf-of creation plan: `createAtomsFor` / `createTriplesFor` require
`creator` to have granted `caller` CREATION approval first, so this reads that
approval state and — if missing — prepends the `approve` calldata as its own step.
The approval step and the creation steps have DIFFERENT required signers
(`creator` vs `caller`); the caller of this function is responsible for routing each
step to the right signer, in order.

[Source](https://github.com/0xIntuition/packages/blob/1dc7103d2a05f23bc565a81df4b001336ce9ba53/packages/sdk/src/actions/multivault.ts#L1247)

```ts
function multivaultPrepareOnBehalfOfCreationPlan(
  config: ReadConfig,
  inputs: {
    creator: Address;
    caller: Address;
    atoms?: MultiVaultOnBehalfOfAtomInput[];
    triples?: MultiVaultOnBehalfOfTripleInput[];
  },
  deps?: MultiVaultOnBehalfOfCreationDeps,
): Promise<MultiVaultOnBehalfOfCreationPlan>;
```

- **`config`**: Read config for MultiVault.
- **`inputs`**: The creator being created for, the caller acting on their behalf, and the atoms/triples to create.
- **`deps`**: Injectable protocol read primitives.
- **returns**: The ordered steps (approval, if needed, then creation) and whether approval was already in place.

Defaults: `deps = defaultOnBehalfOfCreationDeps`. Dependency arguments are optional test/customization hooks; normal consumers use the built-in dependencies.

## multivaultPrepareMulticallTx

Assembles a consolidated payable `multicall` batch: the `bytes[]` sub-call array and
the `uint256[]` per-sub-call value array must stay aligned and their values must sum
to exactly `msg.value` — the fiddliest part of building this call by hand.

[Source](https://github.com/0xIntuition/packages/blob/1dc7103d2a05f23bc565a81df4b001336ce9ba53/packages/sdk/src/actions/multivault.ts#L1339)

```ts
function multivaultPrepareMulticallTx(
  subCalls: MultiVaultMulticallSubCall[],
): MultiVaultPrepareMulticallTxResult;
```

- **`subCalls`**: The sub-calls to batch, each with its own calldata and value allocation.
- **returns**: The `multicall` calldata, args, and the total value the batch requires.

## Input and result types

```ts
type PreviewDepositTuple = readonly [bigint, bigint] & {
  shares?: bigint;
  assetsAfterFees?: bigint;
};

type PreviewCreateTuple = readonly [bigint, bigint, bigint] & {
  shares?: bigint;
  feeBaseAssets?: bigint;
  assetsAfterFees?: bigint;
};

export type MultiVaultDepositQuotePlan = {
  termId: Hex;
  curveId: bigint;
  assetsIn: bigint;
  /** What every fee was actually charged on — `assetsIn` less any min-share bootstrap cost. */
  feeBaseAssets: bigint;
  minShareCost: bigint;
  isFirstDeposit: boolean;
  sharesOut: bigint;
  minSharesOut: bigint;
  assetsAfterFees: bigint;
  /** Zero when MultiVault waives it below `feeThreshold`. */
  entryFee: bigint;
  entryFeeWaived: boolean;
  protocolFee: bigint;
  /**
   * The term-type-specific fee charged alongside the other two: the atom-wallet cut on an atom,
   * the underlying-atom fraction on a triple. Without it the components cannot sum to the whole.
   */
  termFee: bigint;
  termFeeKind: 'atom-wallet' | 'atom-deposit-fraction';
  termFeeWaived: boolean;
  totalEstimatedFees: bigint;
  currentSharePrice: bigint;
  effectivePricePerShare: bigint | null;
  slippageBps: bigint;
};

export type MultiVaultPrepareDepositTxResult = {
  args: readonly [Address, Hex, bigint, bigint];
  calldata: Hex;
  /** The value to send: the deposit itself, `assetsIn` unless an explicit value was passed. */
  value: bigint;
  quote: MultiVaultDepositQuotePlan;
};

export type MultiVaultUserPositionSnapshot = {
  account: Address;
  termId: Hex;
  curveId: bigint;
  shares: bigint;
  maxRedeemShares: bigint;
  estimatedAssetsForCurrentShares: bigint;
  estimatedAssetsForMaxRedeem: bigint;
  currentSharePrice: bigint;
  vaultTotalAssets: bigint;
  vaultTotalShares: bigint;
  utilization?: {
    epoch: bigint;
    totalForEpoch: bigint;
    userForEpoch: bigint;
    userInEpoch: bigint;
  };
};

export type MultiVaultRedeemQuotePlan = {
  termId: Hex;
  curveId: bigint;
  /** The account whose payout this is. A redeem quote is meaningless without one. */
  account: Address;
  sharesIn: bigint;
  sharesUsed: bigint;
  assetsBeforeFees: bigint;
  assetsOut: bigint;
  minAssetsOut: bigint;
  /** Zero when MultiVault waives it below `feeThreshold`. */
  exitFee: bigint;
  exitFeeWaived: boolean;
  protocolFee: bigint;
  /** The curve's own withdrawal fee for THIS account. Zero on a curve without a redeem hook. */
  curveFee: bigint;
  curveAddress: Address | null;
  totalEstimatedFees: bigint;
  currentSharePrice: bigint;
  effectivePricePerShare: bigint | null;
  slippageBps: bigint;
};

export type MultiVaultPrepareRedeemTxResult = {
  args: readonly [Address, Hex, bigint, bigint, bigint];
  calldata: Hex;
  quote: MultiVaultRedeemQuotePlan;
};

export type MultiVaultCreateAtomInput = {
  termId: Hex;
  data: Hex;
  assetsIn: bigint;
};

export type MultiVaultCreateTripleInput = {
  termId: Hex;
  subjectId: Hex;
  predicateId: Hex;
  objectId: Hex;
  assetsIn: bigint;
};

export type MultiVaultSeedDepositInput = {
  termId: Hex;
  curveId: bigint;
  assetsIn: bigint;
  slippageBps?: bigint;
};

export type MultiVaultCreateAndSeedStep = {
  type: 'create-atoms' | 'create-triples' | 'deposit-batch';
  calldata: Hex;
  value?: bigint;
};

export type MultiVaultCreateAndSeedTermPlan = {
  receiver: Address;
  createAtomPreviews: Array<{
    termId: Hex;
    assetsIn: bigint;
    sharesOut: bigint;
    feeBaseAssets: bigint;
    assetsAfterFees: bigint;
  }>;
  createTriplePreviews: Array<{
    termId: Hex;
    assetsIn: bigint;
    sharesOut: bigint;
    feeBaseAssets: bigint;
    assetsAfterFees: bigint;
  }>;
  seedDepositQuotes: MultiVaultDepositQuotePlan[];
  steps: MultiVaultCreateAndSeedStep[];
  totalValue: bigint;
};

export type MultiVaultUtilizationEpochPoint = {
  epoch: bigint;
  totalForEpoch: bigint;
  deltaFromPreviousTotal: bigint | null;
  userForEpoch?: bigint;
  userInEpoch?: bigint | null;
  deltaFromPreviousUser?: bigint | null;
};

export type MultiVaultUtilizationAnalyticsBundle = {
  startEpoch: bigint;
  endEpoch: bigint;
  currentEpoch: bigint;
  account?: Address;
  lastActiveEpoch?: bigint;
  aggregateTotalUtilization: bigint;
  aggregateUserUtilization?: bigint;
  points: MultiVaultUtilizationEpochPoint[];
};

type MultiVaultFeeContextDeps = {
  getVault: typeof multiVaultGetVault;
  getGeneralConfig: typeof multiVaultGetGeneralConfig;
  getBondingCurveConfig: typeof multiVaultGetBondingCurveConfig;
};

type MultiVaultDepositFeeBaseDeps = MultiVaultFeeContextDeps & {
  isTriple: typeof multiVaultIsTriple;
  previewMint: typeof bondingCurveRegistryPreviewMint;
};

type MultiVaultTermFeeDeps = {
  getAtomConfig: typeof multiVaultGetAtomConfig;
  getTriple: typeof multiVaultGetTriple;
  atomDepositFractionAmount: typeof multiVaultAtomDepositFractionAmount;
};

type MultiVaultCurveRedeemFeeDeps = {
  getBondingCurveConfig: typeof multiVaultGetBondingCurveConfig;
  curveAddresses: typeof bondingCurveRegistryCurveAddresses;
  hasRedeemFeeHook: typeof baseCurveHasRedeemFeeHook;
  quoteRedeemFee: typeof baseCurveQuoteRedeemFee;
};

type MultiVaultQuoteDeps = MultiVaultDepositFeeBaseDeps &
  MultiVaultTermFeeDeps & {
    previewDeposit: typeof multiVaultPreviewDeposit;
    entryFeeAmount: typeof multiVaultEntryFeeAmount;
    protocolFeeAmount: typeof multiVaultProtocolFeeAmount;
    currentSharePrice: typeof multiVaultCurrentSharePrice;
  };

type MultiVaultRedeemQuoteDeps = MultiVaultFeeContextDeps &
  MultiVaultCurveRedeemFeeDeps & {
    convertToAssets: typeof multiVaultConvertToAssets;
    exitFeeAmount: typeof multiVaultExitFeeAmount;
    protocolFeeAmount: typeof multiVaultProtocolFeeAmount;
    currentSharePrice: typeof multiVaultCurrentSharePrice;
  };

type MultiVaultPositionDeps = {
  getShares: typeof multiVaultGetShares;
  maxRedeem: typeof multiVaultMaxRedeem;
  convertToAssets: typeof multiVaultConvertToAssets;
  currentSharePrice: typeof multiVaultCurrentSharePrice;
  getVault: typeof multiVaultGetVault;
  currentEpoch: typeof multiVaultCurrentEpoch;
  getTotalUtilizationForEpoch: typeof multiVaultGetTotalUtilizationForEpoch;
  getUserUtilizationForEpoch: typeof multiVaultGetUserUtilizationForEpoch;
  getUserUtilizationInEpoch: typeof multiVaultGetUserUtilizationInEpoch;
};

type MultiVaultCreateAndSeedDeps = MultiVaultQuoteDeps & {
  previewAtomCreate: typeof multiVaultPreviewAtomCreate;
  previewTripleCreate: typeof multiVaultPreviewTripleCreate;
};

type MultiVaultUtilizationDeps = {
  currentEpoch: typeof multiVaultCurrentEpoch;
  getTotalUtilizationForEpoch: typeof multiVaultGetTotalUtilizationForEpoch;
  getUserUtilizationForEpoch: typeof multiVaultGetUserUtilizationForEpoch;
  getUserUtilizationInEpoch: typeof multiVaultGetUserUtilizationInEpoch;
  getUserLastActiveEpoch: typeof multiVaultGetUserLastActiveEpoch;
};

export type MultiVaultDepositFeeBase = {
  /** The amount every fee — MultiVault's and the curve's — is actually charged on. */
  feeBaseAssets: bigint;
  /** True when this deposit is the one that bootstraps the vault's minimum share supply. */
  isFirstDeposit: boolean;
  /** What the bootstrap costs, netted out before any fee. Zero on an established vault. */
  minShareCost: bigint;
};

export type MultiVaultOnBehalfOfAtomInput = { data: Hex; assets: bigint };

export type MultiVaultOnBehalfOfTripleInput = {
  subjectId: Hex;
  predicateId: Hex;
  objectId: Hex;
  assets: bigint;
};

export type MultiVaultOnBehalfOfCreationStep = {
  type: 'approve' | 'create-atoms-for' | 'create-triples-for';
  // The account that must sign this step. The approval leg is signed by `creator`
  // (granting `caller` CREATION approval); the creation legs are signed by `caller`.
  signer: 'creator' | 'caller';
  calldata: Hex;
  value?: bigint;
};

export type MultiVaultOnBehalfOfCreationPlan = {
  creator: Address;
  caller: Address;
  approvalAlreadyGranted: boolean;
  steps: MultiVaultOnBehalfOfCreationStep[];
};

type MultiVaultOnBehalfOfCreationDeps = {
  isApprovedToCreate: typeof multiVaultIsApprovedToCreate;
  isApprovedToDeposit: typeof multiVaultIsApprovedToDeposit;
  isApprovedToRedeem: typeof multiVaultIsApprovedToRedeem;
};

export type MultiVaultMulticallSubCall = {
  calldata: Hex;
  value: bigint;
};

export type MultiVaultPrepareMulticallTxResult = {
  args: readonly [readonly Hex[], readonly bigint[]];
  calldata: Hex;
  value: bigint;
};
```
