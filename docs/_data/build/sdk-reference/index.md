---
title: API reference
slug: /build/sdk-reference/index
sidebar_position: 0
---

Look up SDK functions for hosted graph reads, protocol actions, and serializable action envelopes. These pages document `@0xintuition/sdk@4.0.0-alpha.0`. Start with [querying the graph](../guides/sdk-reads.md) or [preparing an action](../guides/onchain.md) for a worked example, then use this reference for exact inputs, return types, defaults, and effects.

| Reference                                                | Main operations                                                            | Effects                                         |
| -------------------------------------------------------- | -------------------------------------------------------------------------- | ----------------------------------------------- |
| [API client](./api.md)                                   | Atom/triple lookups and endpoint selection                                 | HTTP reads when methods are called              |
| [MultiVault](./multivault.md)                            | Fees, deposits, redemptions, create/seed, on-behalf-of creation, multicall | RPC reads and transaction preparation           |
| [Dynamic-fee curves](./dynamic-fee-curve.md)             | Tier ladders, quotes, claims and earnings projections                      | RPC reads and transaction preparation           |
| [FeeProxy URI creation](./fee-proxy.md)                  | URI-aware atom creation quote/request                                      | RPC reads and preparation                       |
| [FeeProxy plans](./fee-proxy-builders.md)                | Readiness, routed deposit/create plans, execution                          | Plans read state; `feeProxyExecutePlan` submits |
| [Affiliate profile](./fee-proxy-affiliate-profile.md)    | Status, fees and headroom                                                  | RPC reads                                       |
| [Refund preparation](./fee-proxy-claim-refund-if-any.md) | Pending refund and optional claim request                                  | RPC read; returns transaction or null           |
| [TrustBonding](./trust-bonding.md)                       | Rewards, claim eligibility, locks, restake plans and timelines             | RPC reads and transaction preparation           |
| [Portfolio](./portfolio.md)                              | Explicit position list and actionable state                                | RPC reads; no global position discovery         |

## Common configuration

The core protocol exports these structural types:

```ts
type ReadConfig = {
  address: Address;
  publicClient: PublicClient;
};
type WriteConfig = {
  address: Address;
  publicClient: PublicClient;
  walletClient: WalletClient;
};
```

`Address`, `PublicClient`, and `WalletClient` are viem types. Import the actual configuration types from `@0xintuition/protocol`. Set `address` to the contract required by that function: a FeeProxy configuration is not a MultiVault configuration. Some planners accept `WriteConfig` even though they do not submit; follow the signature instead of inferring effects from the type name.

Amounts and shares use `bigint` base units. `Hex` term IDs are protocol IDs, not IID strings. Optional dependency arguments are testing/customization hooks; omit them in normal integrations. Quotes can become stale. Low-level protocol re-exports, constants, and utility implementations remain documented by their owning [package references](../packages/index.md).

Type definitions explain the accepted inputs and outputs. Follow each page's documented import path; supporting types shown from source may not be exported individually.

For executable examples use the [on-chain guide](../guides/onchain.md) and [read-client guide](../guides/sdk-reads.md). Declarations on reference pages are not standalone programs.

## Serializable action envelopes

All envelope functions import from `@0xintuition/sdk/actions`; source directories are not additional npm subpaths. Start with the [envelope recipe](../guides/action-envelopes.md), then read [MultiVault envelopes](./plans-multivault.md), [bridge envelopes](./plans-base.md), [dynamic-fee envelopes](./plans-dynamic-fee-curve.md), [FeeProxy envelopes](./plans-fee-proxy.md), [TrustBonding envelopes](./plans-trust-bonding.md), [schema helpers](./schema-create-agent-action-envelope.md), [target resolution](./schema-resolve-agent-action-target.md), and [schema types](./schema-types.md).
