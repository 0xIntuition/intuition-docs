---
title: Build action plans and envelopes
sidebar_label: Build action plans and envelopes
description: Prepare JSON-serializable action envelopes with explicit context, review their intent, and keep execution separate.
kind: how-to
reader: ["app", "agent"]
packages: ["@0xintuition/sdk", "@0xintuition/cli"]
---

<AppliesTo />

Prepare a serializable action envelope that an application or agent can review before a separate executor submits it.

## Before you start

Install the packages used by the example:

```sh
npm install --save-exact @0xintuition/sdk@4.0.0 @0xintuition/protocol@4.0.0 @0xintuition/ids@0.1.0 viem@2.31.4
```

Envelope builders in `@0xintuition/sdk/actions` are client-free: they accept caller-supplied context and do not obtain quotes, sign, or send transactions. Read-backed action helpers and executors are separate APIs.

## Steps

### 1. Supply explicit operation context

Select the chain, contract capability, receiver, term, curve, payment, and minimum output. For operations requiring costs, balances, fees, or previews, obtain that context for the chosen deployment first. Missing required context throws; the envelope builder does not fetch it for you.

### 2. Encode and validate offline

{/* example:start examples/v2/first-write/src/action-plans.ts#action-envelope */}
```ts
import {
  multiVaultMulticallEnvelope,
  validateAgentActionEnvelope,
} from '@0xintuition/sdk/actions';
import { multiVaultDepositEncode } from '@0xintuition/protocol';
import { calculateAtomId } from '@0xintuition/ids';

// Illustrative inputs only: no claim that this term exists on testnet.
const receiver = '0x0000000000000000000000000000000000000001';
const termId = calculateAtomId('docs:offline-envelope-fixture');
const calldata = multiVaultDepositEncode(receiver, termId, 1n, 1n);
const envelope = multiVaultMulticallEnvelope({
  chainId: 13579,
  subCalls: [{ calldata, value: 1_000_000_000_000_000n }],
});
validateAgentActionEnvelope(envelope);
console.log(JSON.stringify(envelope, null, 2));
```
{/* example:end */}

This fixture only demonstrates encoding. Its term may not exist on testnet, and `1n` minimum shares is illustrative, not a slippage policy. Payment values become decimal strings in the envelope so JSON serialization preserves integer precision. The builder aligns the subcalls with their values and computes the total payment.

### 3. Review before execution

Compare every step's chain, destination, receiver, calldata, value, minimum output, and deadline with the intended operation. Structural validation does not prove current pricing, signer authorization, term existence, or contract capability. Refresh reads and simulate against the selected implementation before passing reviewed steps to an authorized executor. Handle ordered receipts and partial completion explicitly.

| Task | Envelope exports | Context to supply |
| --- | --- | --- |
| Deposit or redeem | `multiVaultDepositEnvelope`, `multiVaultRedeemEnvelope` | Vault, balances, applicable fees, previews |
| Create and seed | `multiVaultCreateAndSeedEnvelope` | Atom/triple payloads, creation costs, previews |
| Batch calls | `multiVaultMulticallEnvelope` | Encoded calls and per-call values |
| URI atoms through FeeProxy | `feeProxyCreateAtomsWithUrisEnvelope` | Creation cost and FeeProxy fee guard |
| Lock or claim | `trustBondingLockEnvelope`, `trustBondingClaimEnvelope` | Lock, epoch, and claim state |

### 4. Replace deprecated CLI aliases

Use SDK envelope exports for new code. For example, the old CLI `buildMultiVaultDepositPlan` alias maps to `multiVaultDepositEnvelope`. The aliases retain their input/output contract for the documented migration window, and metadata identifies the SDK as their owner. The `intuition` executable exposes encoders; it has no plan subcommand.

## Check the result

`JSON.stringify(envelope)` succeeds and schema validation accepts the result. No RPC request, signature, or transaction occurs. The [generated plan reference](/docs/reference/sdk/plans-multivault) defines exact inputs and output structures. Deployment metadata is a catalog rather than live capability discovery; paths requiring the withheld TrustSwapAndBridgeRouter address throw.

## Related

[Protocol writes](/docs/concepts/protocol-writes), [SDK](/docs/reference/packages/sdk), [CLI](/docs/reference/packages/cli), and [action schema](/docs/reference/sdk/schema-types). Source: [action plan ownership and alias map](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/sdk/docs/action-plans.md).
