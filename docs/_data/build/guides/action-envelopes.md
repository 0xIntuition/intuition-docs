---
title: 'Build serializable action plans for applications and agents'
sidebar_label: 'Share action envelopes'
slug: /build/guides/action-envelopes
sidebar_position: 7
---

The SDK provides the client-free action-envelope builders formerly exported by the CLI. They take explicit inputs and caller-supplied read context, then return JSON-serializable steps for a separate executor. They perform no RPC requests, signatures, or transaction submission.

```sh
npm install @0xintuition/sdk@4.0.0-alpha.0 @0xintuition/protocol@3.0.0-alpha.0 viem@^2
```

Use [RPC-backed action helpers](./onchain.md) when you want the SDK to obtain a quote directly from your public client. Use envelopes when a server, agent, or approval system needs to exchange a structured plan.

## Encode and validate a batch offline

This builds a testnet multicall envelope. The amount and term are illustrative; the code does not assert that the term exists or that the deployment supports the call.

```ts
import {
  multiVaultMulticallEnvelope,
  validateAgentActionEnvelope,
} from '@0xintuition/sdk/actions';
import { multiVaultDepositEncode } from '@0xintuition/protocol';
import { calculateAtomId } from '@0xintuition/ids';

const data = multiVaultDepositEncode(
  '0x0000000000000000000000000000000000000001',
  calculateAtomId('int:isrc:USRC17607839'),
  1n,
  1n,
);
const envelope = multiVaultMulticallEnvelope({
  chainId: 13579,
  subCalls: [{ calldata: data, value: 1_000_000_000_000_000n }],
});
validateAgentActionEnvelope(envelope);
console.log(JSON.stringify(envelope, null, 2));
```

Install `@0xintuition/ids@0.1.0-alpha.1` as well because the example imports it directly. The `1n` minimum shares is illustrative, not a slippage policy; use a fresh quote to set it before any real transaction. The multicall builder aligns each subcall with its value and encodes their aggregate payment. Envelope values are decimal strings so JSON serialization does not lose bigint precision.

## Select a builder

| Operation                 | SDK actions exports                                                                                                                                    | Supplied context                                       |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------ |
| Deposit or redeem         | `multiVaultDepositEnvelope`, `multiVaultRedeemEnvelope`                                                                                                | Vault, balances, fee applicability, previews           |
| Create and seed           | `multiVaultCreateAndSeedEnvelope`, `multiVaultOnBehalfOfCreationEnvelope`                                                                              | Atom/triple payloads, costs, preview/read data         |
| Batch calls               | `multiVaultMulticallEnvelope`                                                                                                                          | Encoded subcalls and per-call values                   |
| Dynamic-fee deposit/claim | `dynamicFeeCurveDepositEnvelope`, `dynamicFeeCurveClaimEnvelope`                                                                                       | Curve configuration, tiers, claim state                |
| URI creation via FeeProxy | `feeProxyCreateAtomsWithUrisEnvelope`                                                                                                                  | Protocol creation cost and expected FeeProxy fee guard |
| Lock or claim rewards     | `trustBondingLockEnvelope`, `trustBondingClaimEnvelope`, `trustBondingClaimAndRestakeEnvelope`                                                         | Lock, epoch, claim, and restake target state           |
| Bridge                    | `baseTrustBridgeToIntuitionEnvelope`, `intuitionTrustBridgeToBaseEnvelope`, `baseERC20BridgeToIntuitionEnvelope`, `intuitionERC20BridgeToBaseEnvelope` | Allowance and bridge-fee reads, supported deployment   |

Missing required read context throws; these builders do not fetch it for you. Pass an explicit chain ID rather than relying on mainnet defaults. For exact structures see the [MultiVault envelopes](../sdk-reference/plans-multivault.md), [dynamic-fee envelopes](../sdk-reference/plans-dynamic-fee-curve.md), [FeeProxy envelopes](../sdk-reference/plans-fee-proxy.md), [TrustBonding envelopes](../sdk-reference/plans-trust-bonding.md), and [bridge envelopes](../sdk-reference/plans-base.md).

## Review and execute separately

An [AgentActionEnvelope](../sdk-reference/schema-types.md) includes a schema version, action, ordered steps, and optional metadata, estimates, and warnings. Each step records the target chain/contract, calldata, and value. The [schema helpers](../sdk-reference/schema-create-agent-action-envelope.md) check structural validity; they do not establish that the quote is current, the calldata fulfills your intent, or the signer is authorized.

Before execution, compare chain, destination, receiver, amounts, minimum output, deadlines, and total value with your approved operation. Refresh state and simulate against the selected implementation. Execute the steps in order with an authorized signer and handle receipts and partial completion explicitly. The SDK's separate `feeProxyExecutePlan` helper sends transactions; it is not an envelope validator.

Deployment metadata is a catalog, not live capability discovery. The TrustSwapAndBridgeRouter target remains withheld in this release, so paths that resolve it throw. See [compatibility](../compatibility.md).

## Migrate CLI plan imports

Replace `buildMultiVaultDepositPlan` from `@0xintuition/cli` with `multiVaultDepositEnvelope` from `@0xintuition/sdk/actions`, and use the same migration for the other plan families. Deprecated CLI aliases retain their input/output contract for one release, but `metadata.source.package` now identifies `@0xintuition/sdk`. The `intuition` executable exposes encoders and has no plan subcommand. The [full alias map](https://github.com/0xIntuition/packages/blob/dde4fdf5774447b84cd0b820593fb0db7366e58d/packages/sdk/docs/action-plans.md) covers all 15 builders.
