---
title: 'FeeProxy plans and execution'
slug: /build/sdk-reference/fee-proxy-builders
---

Generated from the upcoming SDK **4.0.0** source. See [release compatibility](../compatibility.md) before installing or connecting to a deployment. Regenerate with `node scripts/generate-package-reference.js /path/to/packages`.

Import from `@0xintuition/sdk/actions`. [Implementation and internal helpers](https://github.com/0xIntuition/packages/blob/1dc7103d2a05f23bc565a81df4b001336ce9ba53/packages/sdk/src/actions/fee-proxy-builders.ts).

Signatures show the exact accepted inputs and return types. Named input/output structures and dependency-injection types are listed below; viem and protocol types come from their respective packages. Preparation and quote functions can perform RPC reads. **`feeProxyExecutePlan` sends transactions**; the other SDK actions on these pages prepare transactions or read data.

## feeProxyGetReadiness

Checks everything a FeeProxy deposit or create needs before it can land, mirroring the checks
the contract makes in order: the global pause, an active affiliate, the affiliate's fees on the
used side within the current protocol caps, and the MultiVault approvals. First reads FeeProxy's
`multiVault()` and throws unless it is `configs.multiVault`, where the approvals are read.

Deposits need `receiver` to have approved FeeProxy for DEPOSIT, and, when `receiver` is not the
caller, `receiver` to have approved the caller for DEPOSIT too (`FeeProxy_ReceiverNotApproved`).
Both approvals are signed by `receiver`. Creates need the caller to have approved FeeProxy for
CREATION. Approval steps preserve every bit already granted and merge requirements on the same
pair into one `approve`, because `approve` overwrites the bitmask.

[Source](https://github.com/0xIntuition/packages/blob/1dc7103d2a05f23bc565a81df4b001336ce9ba53/packages/sdk/src/actions/fee-proxy-builders.ts#L275)

```ts
function feeProxyGetReadiness(
  configs: FeeProxyConfigs,
  inputs: FeeProxyReadinessInputs,
  deps?: FeeProxyReadinessDeps,
): Promise<FeeProxyReadiness>;
```

- **`configs`**: FeeProxy and MultiVault read configs.
- **`inputs`**: The caller, the affiliate, the deposit receiver (defaults to the caller) and the route kinds to check.
- **`deps`**: Injectable read primitives.
- **returns**: Whether the route is ready, what is missing, the approval transactions that fix it, and any pending refund.

Defaults: `deps = defaultReadinessDeps`. Dependency arguments are optional test/customization hooks; normal consumers use the built-in dependencies.

## feeProxyQuoteDepositVia

Quotes a FeeProxy deposit: the affiliate fee from on-chain `previewDepositFee` on the total gross,
the per-leg forwarded split (FeeProxy `_allocate`, cross-checked against the preview), then
`MultiVault.previewDeposit` on each forwarded leg for the expected shares. `minShares` is
previewed on each leg's `minForwardedAssets`, so a fee cut before inclusion cannot trip it. One
leg quotes `depositVia`; several (or `batch: true`) quote `depositBatchVia`, which charges one
fixed fee for the whole batch. First reads FeeProxy's `multiVault()` and throws unless it is
`configs.multiVault`.

[Source](https://github.com/0xIntuition/packages/blob/1dc7103d2a05f23bc565a81df4b001336ce9ba53/packages/sdk/src/actions/fee-proxy-builders.ts#L477)

```ts
function feeProxyQuoteDepositVia(
  configs: FeeProxyConfigs,
  inputs: FeeProxyDepositQuoteInputs,
  deps?: FeeProxyDepositQuoteDeps,
): Promise<FeeProxyDepositViaQuote>;
```

- **`configs`**: FeeProxy and MultiVault read configs.
- **`inputs`**: The affiliate, the deposits, slippage in bps (default 100) and whether to force the batch entry point.
- **`deps`**: Injectable read primitives.
- **returns**: The quote, including the exact value to send and the pinned `FeeGuard`.

Defaults: `deps = defaultDepositQuoteDeps`. Dependency arguments are optional test/customization hooks; normal consumers use the built-in dependencies.

## feeProxyBuildDepositViaPlan

Builds a FeeProxy deposit plan: readiness, then the quote, then ordered steps — any missing
MultiVault approvals first, then `depositVia` / `depositBatchVia` carrying the quoted value,
`minShares` and the pinned `FeeGuard`. Throws when FeeProxy does not forward to
`configs.multiVault`, or when the route has a blocker no approval can fix (paused proxy, inactive
affiliate, fees over the caps). Send with `feeProxyExecutePlan` or any signer, step by step.

[Source](https://github.com/0xIntuition/packages/blob/1dc7103d2a05f23bc565a81df4b001336ce9ba53/packages/sdk/src/actions/fee-proxy-builders.ts#L611)

```ts
function feeProxyBuildDepositViaPlan(
  configs: FeeProxyConfigs,
  inputs: {
    user: Address;
    affiliate: Address;
    receiver?: Address;
    deposits: FeeProxyDepositInput[];
    slippageBps?: bigint;
    batch?: boolean;
  },
  deps?: FeeProxyReadinessDeps & FeeProxyDepositQuoteDeps,
): Promise<FeeProxyDepositViaPlan>;
```

- **`configs`**: FeeProxy and MultiVault read configs.
- **`inputs`**: The caller, the affiliate, the receiver (defaults to the caller), the deposits and slippage.
- **`deps`**: Injectable read primitives.
- **returns**: The plan.

Defaults: `deps = {
		...defaultReadinessDeps,
		...defaultDepositQuoteDeps,
	}`. Dependency arguments are optional test/customization hooks; normal consumers use the built-in dependencies.

## feeProxyBuildCreateViaPlan

Builds a FeeProxy creation plan. Each term is grossed up so that after the affiliate's creation
bps and its fixed fee (charged once per call) and FeeProxy's pro-rata split, the amount MultiVault
receives for that term is at least its creation cost plus the intended deposit, and stays so if
the affiliate lowers either fee before the call lands. The total is the least for which the
gross-up's per-term split does both, so a term can receive a few wei more than its target (the
last term most). The gross-up is computed in bigint (`feeProxyGrossUpForTargets`), then the
total is checked against on-chain `previewCreationFee`; any disagreement throws rather than
sending a mispriced call. Atoms and triples are separate calls, each paying its own fixed fee.
First reads FeeProxy's `multiVault()` and throws unless it is `configs.multiVault`.

[Source](https://github.com/0xIntuition/packages/blob/1dc7103d2a05f23bc565a81df4b001336ce9ba53/packages/sdk/src/actions/fee-proxy-builders.ts#L738)

```ts
function feeProxyBuildCreateViaPlan(
  configs: FeeProxyConfigs,
  inputs: {
    user: Address;
    affiliate: Address;
    atoms?: FeeProxyCreateAtomInput[];
    triples?: FeeProxyCreateTripleInput[];
    depositPerTerm?: bigint;
  },
  deps?: FeeProxyCreatePlanDeps,
): Promise<FeeProxyCreateViaPlan>;
```

- **`configs`**: FeeProxy and MultiVault read configs.
- **`inputs`**: The caller (also the creator), the affiliate, atoms and/or triples, and the default deposit per term.
- **`deps`**: Injectable read primitives.
- **returns**: The plan, with the gross-up quote per call.

Defaults: `deps = defaultCreatePlanDeps`. Dependency arguments are optional test/customization hooks; normal consumers use the built-in dependencies.

## feeProxyExecutePlan

Sends a FeeProxy plan's steps in order from one wallet, waiting for each receipt before the
next (an approval must be mined before the routed call that needs it). Refuses up front, before
sending anything, when a step must be signed by a different account — for example a receiver's
approval in a delegated deposit; send those steps from the receiver's wallet first.

[Source](https://github.com/0xIntuition/packages/blob/1dc7103d2a05f23bc565a81df4b001336ce9ba53/packages/sdk/src/actions/fee-proxy-builders.ts#L979)

```ts
function feeProxyExecutePlan(
  config: {
    walletClient: WalletClient;
    publicClient: PublicClient;
  },
  plan: {
    steps: readonly FeeProxyPlanStep[];
  },
): Promise<FeeProxyExecutedStep[]>;
```

- **`config`**: The signing wallet client and a public client for receipts.
- **`plan`**: Any plan with `steps`.
- **returns**: Each step with its transaction hash and receipt.

## Input and result types

```ts
type FeeProxyConfigs = { feeProxy: ReadConfig; multiVault: ReadConfig };

export type FeeProxyRouteKind = 'deposit' | 'create';

export type FeeProxyPlanStepKind =
  | 'approve'
  | 'deposit-via'
  | 'deposit-batch-via'
  | 'create-atoms-via'
  | 'create-atoms-with-uris-via'
  | 'create-triples-via';

export type FeeProxyPlanStep = {
  kind: FeeProxyPlanStepKind;
  /** The account that must sign and send this step. Approval steps may need a different signer. */
  from: Address;
  to: Address;
  data: Hex;
  value: bigint;
  description: string;
};

export type FeeProxyReadinessIssueCode =
  | 'proxy-paused'
  | 'affiliate-not-registered'
  | 'affiliate-paused'
  | 'deposit-fees-over-cap'
  | 'creation-fees-over-cap'
  | 'receiver-has-not-approved-proxy-for-deposit'
  | 'receiver-has-not-approved-caller-for-deposit'
  | 'caller-has-not-approved-proxy-for-creation';

export type FeeProxyReadinessIssue = {
  code: FeeProxyReadinessIssueCode;
  message: string;
  /** True when one of the returned approval steps resolves it; false when only an admin or the affiliate can. */
  fixable: boolean;
};

export type FeeProxyReadiness = {
  ready: boolean;
  user: Address;
  affiliate: Address;
  receiver: Address;
  kinds: FeeProxyRouteKind[];
  missing: FeeProxyReadinessIssue[];
  /** Ready-to-send MultiVault `approve` transactions that clear every fixable issue. */
  approvalSteps: FeeProxyPlanStep[];
  /** The user's pull-fallback refund balance. Claim it with `feeProxyClaimRefundIfAny`. */
  pendingRefund: bigint;
};

type FeeProxyTargetDeps = {
  multiVault: typeof feeProxyMultiVault;
};

type FeeProxyReadinessDeps = FeeProxyTargetDeps & {
  paused: typeof feeProxyPaused;
  affiliateConfig: typeof feeProxyAffiliateConfig;
  maxFeeBps: typeof feeProxyMaxFeeBps;
  maxFixedFee: typeof feeProxyMaxFixedFee;
  pendingRefund: typeof feeProxyPendingRefund;
  isApprovedToDeposit: typeof multiVaultIsApprovedToDeposit;
  isApprovedToRedeem: typeof multiVaultIsApprovedToRedeem;
  isApprovedToCreate: typeof multiVaultIsApprovedToCreate;
};

type FeeProxyDepositQuoteDeps = FeeProxyTargetDeps & {
  affiliateConfig: typeof feeProxyAffiliateConfig;
  previewDepositFee: typeof feeProxyPreviewDepositFee;
  previewDeposit: typeof multiVaultPreviewDeposit;
  getGeneralConfig: typeof multiVaultGetGeneralConfig;
};

type FeeProxyCreatePlanDeps = FeeProxyReadinessDeps & {
  previewCreationFee: typeof feeProxyPreviewCreationFee;
  getAtomCost: typeof multiVaultGetAtomCost;
  getTripleCost: typeof multiVaultGetTripleCost;
  getAtomUriConfig: typeof multiVaultGetAtomUriConfig;
  calculateAtomId: typeof multiVaultCalculateAtomId;
  calculateTripleId: typeof multiVaultCalculateTripleId;
  previewAtomCreate: typeof multiVaultPreviewAtomCreate;
  previewTripleCreate: typeof multiVaultPreviewTripleCreate;
};

type ApprovalRequirement = {
  /** The account that calls `MultiVault.approve`. */
  granter: Address;
  /** The account being approved. */
  spender: Address;
  bit: number;
  code: FeeProxyReadinessIssueCode;
  message: string;
};

type FeeProxyReadinessInputs = {
  user: Address;
  affiliate: Address;
  receiver?: Address;
  kinds: FeeProxyRouteKind[];
};

export type FeeProxyDepositInput = {
  termId: Hex;
  curveId: bigint;
  grossAssets: bigint;
};

export type FeeProxyDepositLegQuote = FeeProxyDepositInput & {
  /** What MultiVault receives for this leg after the affiliate fee and the pro-rata split. */
  forwardedAssets: bigint;
  /**
   * The least this leg can receive if the affiliate lowers its deposit fee before the call lands
   * (the `FeeGuard` lets decreases through). A lower fee forwards more in total, but the last leg of a
   * batch takes the rounding remainder and can get up to one wei per other leg less than quoted.
   * Equal to `forwardedAssets` for every other leg.
   */
  minForwardedAssets: bigint;
  /** `MultiVault.previewDeposit` on the forwarded amount. */
  expectedShares: bigint;
  /** `MultiVault.previewDeposit` on `minForwardedAssets`, less slippage: the `minShares` the call carries. */
  minShares: bigint;
};

export type FeeProxyDepositViaQuote = {
  affiliate: Address;
  method: 'depositVia' | 'depositBatchVia';
  legs: FeeProxyDepositLegQuote[];
  totalGrossAssets: bigint;
  affiliateFee: bigint;
  totalForwardedAssets: bigint;
  slippageBps: bigint;
  /** The exact `msg.value` to send: the total gross. Anything above it is refunded. */
  value: bigint;
  /** Pinned to the affiliate's current deposit fees, so the call reverts if they rise before it lands. */
  feeGuard: FeeGuard;
};

type FeeProxyDepositQuoteInputs = {
  affiliate: Address;
  deposits: FeeProxyDepositInput[];
  slippageBps?: bigint;
  batch?: boolean;
};

export type FeeProxyDepositViaPlan = {
  readiness: FeeProxyReadiness;
  quote: FeeProxyDepositViaQuote;
  /** Approvals first (possibly signed by the receiver), then the routed deposit. */
  steps: FeeProxyPlanStep[];
  value: bigint;
};

export type FeeProxyCreateAtomInput = {
  data: Hex;
  /** Creation-time context URIs. Any atom with URIs routes the whole set through `createAtomsWithUrisVia`. */
  uris?: Hex[];
  /** Assets to land in the new vault on top of the creation cost; defaults to `depositPerTerm`. */
  deposit?: bigint;
};

export type FeeProxyCreateTripleInput = {
  subjectId: Hex;
  predicateId: Hex;
  objectId: Hex;
  /** Assets to land in the new vault on top of the creation cost; defaults to `depositPerTerm`. */
  deposit?: bigint;
};

export type FeeProxyCreateViaQuote = FeeProxyGrossUp & {
  method: 'createAtomsVia' | 'createAtomsWithUrisVia' | 'createTriplesVia';
  /** `MultiVault.getAtomCost()` or `getTripleCost()`: every forwarded leg must cover it. */
  costPerTerm: bigint;
  /** The intended deposit per term on top of the cost. */
  deposits: bigint[];
  /** The term IDs the call will create, in leg order. */
  termIds: Hex[];
  /**
   * `previewAtomCreate` / `previewTripleCreate` on each forwarded leg at the quoted fee. A triple
   * whose atoms are created earlier in the same plan is previewed against the state before those
   * atoms exist.
   */
  expectedShares: bigint[];
  /** The exact `msg.value` to send: the total gross. */
  value: bigint;
  /** Pinned to the affiliate's current creation fees. */
  feeGuard: FeeGuard;
};

export type FeeProxyCreateViaPlan = {
  readiness: FeeProxyReadiness;
  atoms?: FeeProxyCreateViaQuote;
  triples?: FeeProxyCreateViaQuote;
  /** Approval first, then atoms, then triples (so triples can reference atoms from the same plan). */
  steps: FeeProxyPlanStep[];
  value: bigint;
};

export type FeeProxyExecutedStep = {
  step: FeeProxyPlanStep;
  hash: Hex;
  receipt: TransactionReceipt;
};
```
