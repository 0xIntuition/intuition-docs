---
title: '@0xintuition/sdk'
sidebar_label: 'SDK'
description: 'Prepare protocol actions and JSON-serializable envelopes with explicit inputs, effects, and execution boundaries.'
kind: reference
reader: ["app", "agent"]
packages: ["@0xintuition/sdk"]
---

<AppliesTo />

## What it's for

Application-level protocol actions, quote preparation, wallet workflows, and JSON-serializable action envelopes. It combines lower-level contracts and math into explicit workflows without owning your application's storage or transaction authorization.

## When to use it

Use actions for a deposit, redemption, creation, FeeProxy, or TrustBonding workflow; use pure envelope builders when another component will review and execute the plan. For indexed V2 graph data, [query a Core node](/docs/build/query-core). Use [protocol](/docs/reference/packages/protocol) for individual contract wrappers and [React](/docs/reference/packages/react) for hooks.

## Install

```sh
npm install @0xintuition/sdk@4.0.0 viem@2.31.4
```

Use ESM on Node 20+ or a compatible browser. There is no CommonJS entry point.

## Entry points

| Subpath | Purpose |
| --- | --- |
| `.` | SDK-owned workflows, actions, utilities, and selected shared types |
| `./api` | Read-client exports; see the V1 boundary below |
| `./actions` | Quotes, transaction preparation, pure envelopes, and envelope schemas |
| `./protocol` | Explicit low-level protocol escape hatch |
| `./trust-swap-and-bridge-router` | Router workflows subject to deployment support |
| `./utils` | SDK formatting helpers |

The `./api` read client calls the V1 GraphQL API; see [The SDK read client](/docs/build/read-with-sdk).

## Depends on and works with

Runtime package dependencies: [curves](/docs/reference/packages/curves), [deployments](/docs/reference/packages/deployments), [ids](/docs/reference/packages/ids), [periphery](/docs/reference/packages/periphery), and [protocol](/docs/reference/packages/protocol). Peer dependency: `viem ^2.0.0`.

The root no longer re-exports the full protocol or ID packages. Import those APIs from their own packages, and canonical predicate data from [predicates](/docs/reference/packages/predicates). Your application selects an upload provider and supplies any resulting content URI; the SDK does not upload it for you.

## Example

This pure builder accepts a synthetic quote as `readContext` and produces one deposit step. It performs no RPC request, simulation, signing, or submission. The recipient and quote are fixtures, and the computed term ID does not assert that the atom exists on testnet.

{/* example:start examples/v2/first-write/src/package-examples.ts#sdk-envelope */}
```ts
import { multiVaultDepositEnvelope } from '@0xintuition/sdk/actions';
import { calculateAtomId } from '@0xintuition/ids';
import { getMultiVaultAddressFromChainId as getEnvelopeTarget } from '@0xintuition/deployments';

// Synthetic quote and recipient; this atom has not been registered on-chain.
export const envelope = await multiVaultDepositEnvelope({
  chainId: 13579,
  multiVaultAddress: getEnvelopeTarget(13579),
  receiver: '0x1111111111111111111111111111111111111111',
  termId: calculateAtomId('Synthetic package reference'),
  curveId: 1n,
  assetsIn: 1000n,
  slippageBps: 100n,
  readContext: {
    previewDeposit: { sharesOut: 500n, assetsAfterFees: 990n },
    entryFeeAmount: 5n,
    protocolFeeAmount: 5n,
    currentSharePrice: 2_000_000_000_000_000_000n,
  },
});
export const envelopeJson = JSON.stringify(envelope);
console.log(envelope.action, envelope.steps.length);
```
{/* example:end */}

The result's action is `multivault.deposit`, its steps contain encoded calldata and decimal-string values, and `JSON.stringify` succeeds. Missing required read context rejects the builder. In a real workflow, obtain current context for the intended chain, address, term, and curve, then review and simulate before separately authorizing execution. A valid schema proves the envelope's shape, not its economic outcome or authority to spend.

Distinguish pure `*Envelope` builders from RPC-backed quote/preparation helpers and transaction executors such as `feeProxyExecutePlan`. An encoded plan is not a transaction receipt. [Build action plans and envelopes](/docs/build/action-plans) explains the boundary; the [generated action reference](/docs/reference/sdk/plans-multivault) supplies exact parameter types.

## Related concepts

[Protocol writes](/docs/concepts/protocol-writes) explains planning, signing, and submission. The [migration guide](/docs/get-started/migrate-from-v1) maps previous imports to the new package boundaries.

## Source

[Package README](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/sdk/README.md), [action plans](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/sdk/docs/action-plans.md), [envelope implementation](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/sdk/src/actions/plans/multivault.ts), and [root export migration](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/sdk/docs/migration.md). The upstream README's “v1 design” terminology names its integration design, not this site's V1 documentation generation.
