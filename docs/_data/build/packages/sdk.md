---
title: '@0xintuition/sdk guide'
slug: /build/packages/sdk
sidebar_position: 17
---

Build integrations with hosted GraphQL reads, deterministic utilities, and explicit on-chain action plans.

Candidate source version: **4.0.0**. [Release compatibility](../compatibility.md) explains publication and deployment prerequisites.

## Install

```sh
npm install @0xintuition/sdk@4.0.0 viem@^2
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

This is the SDK 4 candidate. It does not own IPFS uploads, framework hooks, general search, or product auth. The existing SDK v3 examples on this site are a separate generation. See the full function reference for exact parameter and result types.

[API client reference](../sdk-reference/api.md) · [MultiVault](../sdk-reference/multivault.md) · [FeeProxy](../sdk-reference/fee-proxy-builders.md) · [Dynamic fees](../sdk-reference/dynamic-fee-curve.md) · [TrustBonding](../sdk-reference/trust-bonding.md) · [Portfolio](../sdk-reference/portfolio.md).

## Source and full contract

[Source and package guide](https://github.com/0xIntuition/packages/tree/1dc7103d2a05f23bc565a81df4b001336ce9ba53/packages/sdk) · [npm package](https://www.npmjs.com/package/@0xintuition/sdk). The [machine-readable manifest](/intuition-release.json) lists all declared public subpaths and peer dependencies. Npm links name the intended package; this page does not assert that the candidate has been published.
