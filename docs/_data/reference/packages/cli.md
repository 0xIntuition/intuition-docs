---
title: '@0xintuition/cli'
sidebar_label: 'CLI'
description: 'Discover contract encoders and generate calldata without configuring a wallet or submitting transactions.'
kind: reference
reader: ["app", "agent"]
packages: ["@0xintuition/cli"]
---

<AppliesTo />

## What it's for

An `intuition` executable for encoder discovery and deterministic calldata generation, plus library exports for encoders and compatibility plan aliases. It does not own public clients, wallets, simulation, or submission.

## When to use it

Use it when a script or agent needs to discover an encoder or prepare a specific contract call. Use [SDK actions](/docs/reference/packages/sdk) for new action-envelope integrations. The executable has no plan command; its library's deprecated `build*Plan` aliases delegate to SDK-owned envelope builders.

## Install

```sh
npm install @0xintuition/cli@0.1.0
```

Use Node 20+ and ESM for library imports. The executable bundles its protocol, periphery, and SDK code; published types still reference those dependency APIs.

## Entry points

| Subpath | Purpose |
| --- | --- |
| `.` | Calldata encoders, envelope schemas, and deprecated plan aliases |

The `intuition` binary is a package executable, not an additional import subpath.

## Depends on and works with

Runtime package dependencies: [periphery](/docs/reference/packages/periphery), [protocol](/docs/reference/packages/protocol), and [sdk](/docs/reference/packages/sdk). Peer dependencies: none. `viem` is an ordinary runtime dependency in the package manifest.

An external executor owns deployment compatibility, fresh reads, simulation, approval, and signing. Envelope metadata identifies the SDK as the builder even when called through a deprecated CLI alias.

## Example

Discover core MultiVault write encoders using the exact package pin:

```sh
npx @0xintuition/cli@0.1.0 encoders list --surface core --contract multivault --kind write --json
```

The command prints the encoder catalog and does not submit a transaction. For `encode`, `--args` must be a JSON array; pass ABI integers as decimal strings to avoid JavaScript number precision loss. Invalid command arguments or unsupported encoders fail instead of producing a usable call.

Target support is contract-specific. Core targets cover the relevant Intuition mainnet/testnet and Base/Base Sepolia contracts; this does not make every contract available on every chain. Canonical bridge targets are mainnet-only, and the router lookup throws while a compatible redeployment is absent from the pinned map. FeeProxy and dynamic-fee curve intents carry explicit addresses and accept Intuition mainnet or testnet; accepting a chain ID does not prove deployment capability.

Review [action plans](/docs/build/action-plans) before handing encoded output to an executor. Encoding is neither execution authorization nor a successful simulation.

## Related concepts

[Protocol writes](/docs/concepts/protocol-writes) separates preparation, approval, and execution.

## Source

[Package README](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/cli/README.md), [network support matrix](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/cli/docs/network-support-matrix.md), and [executable source](https://github.com/0xIntuition/packages/tree/4e9af1373b81a453d16bc650983138e35afb97d1/packages/cli/src/bin).
