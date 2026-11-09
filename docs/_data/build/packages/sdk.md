---
title: '@0xintuition/sdk'
sidebar_label: 'SDK'
slug: /build/packages/sdk
sidebar_position: 19
---

Build integrations with hosted GraphQL reads, deterministic utilities, and explicit on-chain action plans.

Version **4.0.0-alpha.0** · [npm](https://www.npmjs.com/package/@0xintuition/sdk/v/4.0.0-alpha.0) · [Compatibility](../compatibility.md)

## Install

```sh
npm install @0xintuition/sdk@4.0.0-alpha.0 viem@^2
```

Use ESM imports. Required peers: `viem ^2.0.0`.

## API overview

| Export or operation                | Purpose                                     |
| ---------------------------------- | ------------------------------------------- |
| `createIntuitionApiClient(config)` | Narrow hosted-schema read client from /api  |
| `multivaultCreateAndSeedTerm`      | Create/seed plan from /actions              |
| `feeProxyBuildCreateViaPlan`       | Signer-attributed routed creation plan      |
| `feeProxyExecutePlan`              | Submits transactions and waits for receipts |

## Example

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

## Usage notes

Use this package for hosted graph reads and protocol actions. Add the [React package](./react.md) for hooks and an application-owned storage provider for uploads. If your project uses `@0xintuition/sdk@3.0.1`, follow the [upgrade guide](../migration.md) before copying these imports. See the [API reference](../sdk-reference/index.md) for parameter and result types.

[API client reference](../sdk-reference/api.md) · [MultiVault](../sdk-reference/multivault.md) · [FeeProxy](../sdk-reference/fee-proxy-builders.md) · [Dynamic fees](../sdk-reference/dynamic-fee-curve.md) · [TrustBonding](../sdk-reference/trust-bonding.md) · [Portfolio](../sdk-reference/portfolio.md).

## Action envelopes and root export changes

Pure `*Envelope` builders and the `AgentActionEnvelope` schema now belong to `sdk/actions`. They use supplied read context and emit JSON steps; RPC-backed quote/preparation functions still accept viem clients. Follow [action envelopes](../guides/action-envelopes.md) for a complete offline recipe and links to all 15 builders.

The SDK root exports SDK-owned APIs and selected ID/configuration types. It no longer re-exports the entire protocol or ID package. Import low-level functions from `protocol` or `sdk/protocol`, deterministic IDs from `ids`, canonical predicate data from `predicates`, and math from `curves`. See [migration](../migration.md).

## Further reading

[Source and package guide](https://github.com/0xIntuition/packages/tree/dde4fdf5774447b84cd0b820593fb0db7366e58d/packages/sdk) · [npm package](https://www.npmjs.com/package/@0xintuition/sdk/v/4.0.0-alpha.0).
