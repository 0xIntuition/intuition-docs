---
title: '@0xintuition/protocol guide'
slug: /build/packages/protocol
sidebar_position: 14
---

Call or encode core protocol contracts with explicit viem clients and deployment configuration.

Candidate source version: **4.0.0**. [Release compatibility](../compatibility.md) explains publication and deployment prerequisites.

## Install

```sh
npm install @0xintuition/protocol@4.0.0 viem@^2
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

Start with the [on-chain guide](../guides/onchain.md), configure the matching deployment and viem clients, then choose read, encode, or write behavior deliberately. The [upstream guide](https://github.com/0xIntuition/packages/tree/1dc7103d2a05f23bc565a81df4b001336ce9ba53/packages/protocol/README.md) contains the contract wrapper conventions.

## Integration decisions

Read wrappers call RPC. Write wrappers can submit transactions; Encode helpers only build calldata. Periphery bridges and FeeProxy live in periphery. Use sdk/actions when you need a higher-level quote or plan.

## Source and full contract

[Source and package guide](https://github.com/0xIntuition/packages/tree/1dc7103d2a05f23bc565a81df4b001336ce9ba53/packages/protocol) · [npm package](https://www.npmjs.com/package/@0xintuition/protocol). The [machine-readable manifest](/intuition-release.json) lists all declared public subpaths and peer dependencies. Npm links name the intended package; this page does not assert that the candidate has been published.
