---
title: '@0xintuition/sdk guide'
slug: /build/packages/sdk
sidebar_position: 19
---

Build integrations with hosted GraphQL reads, deterministic utilities, and explicit on-chain action plans.

Published alpha version: **4.0.0-alpha.0**. [Release compatibility](../compatibility.md) records npm publication, peer dependencies, and deployment boundaries.

## Install

```sh
npm install @0xintuition/sdk@4.0.0-alpha.0 viem@^2
```

Use ESM imports. Required peers: `viem ^2.0.0`.

## Main surface

| Export or operation                | Purpose                                     |
| ---------------------------------- | ------------------------------------------- |
| `createIntuitionApiClient(config)` | Narrow hosted-schema read client from /api  |
| `multivaultCreateAndSeedTerm`      | Create/seed plan from /actions              |
| `feeProxyBuildCreateViaPlan`       | Signer-attributed routed creation plan      |
| `feeProxyExecutePlan`              | Submits transactions and waits for receipts |

## First use

```ts
import {
  createIntuitionApiClient,
  getIntuitionApiUrl,
} from '@0xintuition/sdk/api';
const api = createIntuitionApiClient({
  baseUrl: getIntuitionApiUrl('testnet'),
});
// Calling api.atoms.getById({ termId }) makes an HTTP request.
```

## Integration decisions

This is the SDK 4 alpha release. It does not own IPFS uploads, framework hooks, general search, or product auth. The existing SDK v3 examples on this site are a separate generation. See the full function reference for exact parameter and result types.

[API client reference](../sdk-reference/api.md) · [MultiVault](../sdk-reference/multivault.md) · [FeeProxy](../sdk-reference/fee-proxy-builders.md) · [Dynamic fees](../sdk-reference/dynamic-fee-curve.md) · [TrustBonding](../sdk-reference/trust-bonding.md) · [Portfolio](../sdk-reference/portfolio.md).

## Action envelopes and root export changes

Pure `*Envelope` builders and the `AgentActionEnvelope` schema now belong to `sdk/actions`. They use supplied read context and emit JSON steps; RPC-backed quote/preparation functions still accept viem clients. Follow [action envelopes](../guides/action-envelopes.md) for a complete offline recipe and links to all 15 builders.

The SDK root exports SDK-owned APIs and selected ID/configuration types. It no longer re-exports the entire protocol or ID package. Import low-level functions from `protocol` or `sdk/protocol`, deterministic IDs from `ids`, canonical predicate data from `predicates`, and math from `curves`. See [migration](../migration.md).

## Source and full contract

[Source and package guide](https://github.com/0xIntuition/packages/tree/dde4fdf5774447b84cd0b820593fb0db7366e58d/packages/sdk) · [npm package](https://www.npmjs.com/package/@0xintuition/sdk/v/4.0.0-alpha.0). The [machine-readable manifest](/intuition-release.json) lists all declared public subpaths and peer dependencies. Exact npm versions, tarball integrity, and observed dist-tags are recorded in the manifest.
