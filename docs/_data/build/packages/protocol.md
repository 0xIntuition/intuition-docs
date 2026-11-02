---
title: '@0xintuition/protocol guide'
slug: /build/packages/protocol
sidebar_position: 16
---

Call or encode core protocol contracts with explicit viem clients and deployment configuration.

Published alpha version: **3.0.0-alpha.0**. [Release compatibility](../compatibility.md) records npm publication, peer dependencies, and deployment boundaries.

## Install

```sh
npm install @0xintuition/protocol@3.0.0-alpha.0 viem@^2
```

Use ESM imports. Required peers: `viem ^2.0.0`.

## Main surface

| Export or operation             | Purpose                               |
| ------------------------------- | ------------------------------------- |
| `ReadConfig`                    | Contract address and public client    |
| `WriteConfig`                   | Read configuration plus wallet client |
| `multiVaultCreateAtomsWithUris` | URI-aware atom registration wrapper   |
| `multiVaultDepositEncode`       | Pure calldata encoder for a deposit   |

## First use

Start with the [on-chain guide](../guides/onchain.md), configure the matching deployment and viem clients, then choose read, encode, or write behavior deliberately. The [upstream guide](https://github.com/0xIntuition/packages/tree/dde4fdf5774447b84cd0b820593fb0db7366e58d/packages/protocol/README.md) contains the contract wrapper conventions.

## Integration decisions

Read wrappers call RPC. Write wrappers can submit transactions; Encode helpers only build calldata. Periphery bridges and FeeProxy live in periphery. Use sdk/actions when you need a higher-level quote or plan.

## Select the effect you need

- **Read wrappers** use `ReadConfig` and query the selected RPC.
- **Write wrappers** use `WriteConfig`, simulate where implemented, and can request a wallet transaction.
- **Encode helpers** return calldata from explicit parameters and perform no RPC or signing. Their parameter shape can differ from the write wrapper; use the exported declaration.
- **Receipt parsers** filter event logs; pass the expected emitter when supported and handle no-match `[]`/`null` results.

The core includes MultiVault, TrustBonding, WrappedTrust, and related contracts. ABIs and deployment metadata come from `deployments`; `/contracts` also exposes contract artifacts and bytecode. Periphery FeeProxy and bridge wrappers live in the separate `periphery` package. See the [SDK envelope guide](../guides/action-envelopes.md) for application-level batching.

## Source and full contract

[Source and package guide](https://github.com/0xIntuition/packages/tree/dde4fdf5774447b84cd0b820593fb0db7366e58d/packages/protocol) · [npm package](https://www.npmjs.com/package/@0xintuition/protocol/v/3.0.0-alpha.0). The [machine-readable manifest](/intuition-release.json) lists all declared public subpaths and peer dependencies. Exact npm versions, tarball integrity, and observed dist-tags are recorded in the manifest.
