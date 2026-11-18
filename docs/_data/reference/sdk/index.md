---
title: "SDK function reference"
sidebar_label: "SDK function reference"
description: "Find public SDK functions, action envelopes, types, defaults, and effects at the pinned source revision."
kind: reference
reader: ["app", "agent"]
packages: ["@0xintuition/sdk"]
generated_by: scripts/generate-package-reference.js
---

<AppliesTo />

Look up declarations for `@0xintuition/sdk@4.0.0`. For indexed graph reads, start with [Query a Core node](/docs/build/query-core). For transactions, start with [Prepare and send transactions](/docs/build/action-plans).

Each page lists exact inputs, return types, defaults, effects, and source lines. These declarations describe the API; executable usage examples live in the build guides. Module-local helper types are distinguished from public imports.

| Reference                                                                                       | Source module                                                                                                                                                                                             |
| ----------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [API client](/docs/reference/sdk/api)                                                           | [`api/index.ts`](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/sdk/src/api/index.ts)                                                                     |
| [MultiVault actions](/docs/reference/sdk/multivault)                                            | [`actions/multivault.ts`](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/sdk/src/actions/multivault.ts)                                                   |
| [Dynamic-fee curve actions](/docs/reference/sdk/dynamic-fee-curve)                              | [`actions/dynamic-fee-curve.ts`](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/sdk/src/actions/dynamic-fee-curve.ts)                                     |
| [FeeProxy URI creation](/docs/reference/sdk/fee-proxy)                                          | [`actions/fee-proxy.ts`](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/sdk/src/actions/fee-proxy.ts)                                                     |
| [FeeProxy plans and execution](/docs/reference/sdk/fee-proxy-builders)                          | [`actions/fee-proxy-builders.ts`](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/sdk/src/actions/fee-proxy-builders.ts)                                   |
| [FeeProxy affiliate profile](/docs/reference/sdk/fee-proxy-affiliate-profile)                   | [`actions/fee-proxy-affiliate-profile.ts`](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/sdk/src/actions/fee-proxy-affiliate-profile.ts)                 |
| [FeeProxy refund preparation](/docs/reference/sdk/fee-proxy-claim-refund-if-any)                | [`actions/fee-proxy-claim-refund-if-any.ts`](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/sdk/src/actions/fee-proxy-claim-refund-if-any.ts)             |
| [TrustBonding actions](/docs/reference/sdk/trust-bonding)                                       | [`actions/trust-bonding.ts`](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/sdk/src/actions/trust-bonding.ts)                                             |
| [Portfolio reads](/docs/reference/sdk/portfolio)                                                | [`actions/portfolio.ts`](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/sdk/src/actions/portfolio.ts)                                                     |
| [Bridge action envelopes](/docs/reference/sdk/plans-base)                                       | [`actions/plans/base.ts`](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/sdk/src/actions/plans/base.ts)                                                   |
| [MultiVault action envelopes](/docs/reference/sdk/plans-multivault)                             | [`actions/plans/multivault.ts`](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/sdk/src/actions/plans/multivault.ts)                                       |
| [Dynamic-fee action envelopes](/docs/reference/sdk/plans-dynamic-fee-curve)                     | [`actions/plans/dynamic-fee-curve.ts`](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/sdk/src/actions/plans/dynamic-fee-curve.ts)                         |
| [FeeProxy action envelopes](/docs/reference/sdk/plans-fee-proxy)                                | [`actions/plans/fee-proxy.ts`](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/sdk/src/actions/plans/fee-proxy.ts)                                         |
| [TrustBonding action envelopes](/docs/reference/sdk/plans-trust-bonding)                        | [`actions/plans/trust-bonding.ts`](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/sdk/src/actions/plans/trust-bonding.ts)                                 |
| [Create and validate action envelopes](/docs/reference/sdk/schema-create-agent-action-envelope) | [`actions/schema/create-agent-action-envelope.ts`](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/sdk/src/actions/schema/create-agent-action-envelope.ts) |
| [Resolve action targets](/docs/reference/sdk/schema-resolve-agent-action-target)                | [`actions/schema/resolve-agent-action-target.ts`](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/sdk/src/actions/schema/resolve-agent-action-target.ts)   |
| [Action envelope types](/docs/reference/sdk/schema-types)                                       | [`actions/schema/types.ts`](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/sdk/src/actions/schema/types.ts)                                               |

## Using the reference

Amounts and shares use `bigint` base units. Term IDs are protocol IDs, not IID strings. Use each page’s public import paths; source directories do not add package entry points. Optional dependency parameters are customization and testing hooks. Quotes can become stale before execution.

Review [SDK packages](/docs/reference/packages/sdk), [Compatibility](/docs/reference/compatibility), [the SDK read client](/docs/build/read-with-sdk), and [action envelopes](/docs/build/action-plans) before integrating.
