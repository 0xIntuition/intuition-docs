---
title: '@0xintuition/protocol'
sidebar_label: 'Protocol'
description: 'Choose explicit read, encode, or write behavior for core Intuition contracts using typed viem wrappers.'
kind: reference
reader: ["app"]
packages: ["@0xintuition/protocol"]
---

<AppliesTo />

## What it's for

Typed wrappers, encoders, ABIs, and receipt parsers for core contracts including MultiVault, TrustBonding, WrappedTrust, and emissions controllers. It reads and writes chain state; it does not serve the indexed graph from a Core node.

## When to use it

Use a read wrapper for RPC state, an `Encode` helper for calldata, or a write wrapper when your application is ready to request a transaction. Use [SDK actions](/docs/reference/packages/sdk) for higher-level plans and [periphery](/docs/reference/packages/periphery) for FeeProxy and bridges. For indexed graph reads, [query a Core node](/docs/build/query-core).

## Install

```sh
npm install @0xintuition/protocol@4.0.0 viem@2.31.4
```

Use ESM on Node 20+ or a compatible browser. Configure matching chain, address, public client, and wallet client when needed.

## Entry points

| Subpath | Purpose |
| --- | --- |
| `.` | Core wrappers, encoders, ABIs, events, deployments, networks, and types |
| `./contracts` | Named ABI and bytecode re-exports from deployments |

The root does not export deployment bytecode or curve math. Import pure math from [curves](/docs/reference/packages/curves).

## Depends on and works with

Runtime package dependency: [deployments](/docs/reference/packages/deployments). Peer dependency: `viem ^2.0.0`.

`ReadConfig` contains `address` and `publicClient`; `WriteConfig` also contains `walletClient`. Contract artifacts target MultiVault v1.1.0, but a recorded address alone does not prove that the deployed implementation supports every artifact function. Verify capability on the intended deployment before a write.

## Example

This pure function encodes an existing term's deposit call from caller-supplied values. It returns hex calldata without RPC or a wallet request.

{/* example:start examples/v2/first-write/src/package-examples.ts#protocol-encoding */}
```ts
import { multiVaultDepositEncode } from '@0xintuition/protocol';
import type { Address, Hex } from 'viem';

// Caller-supplied values must describe an existing term and chosen curve.
export function encodeDeposit(
  receiver: Address,
  termId: Hex,
  curveId: bigint,
  minShares: bigint,
) {
  return multiVaultDepositEncode(receiver, termId, curveId, minShares);
}
```
{/* example:end */}

`multiVaultDepositEncode` takes receiver, term ID, curve ID, and minimum shares in that order. The deposit assets are the transaction's separate native `value`, not another encoder argument. ABI encoding can reject malformed values; it cannot verify term existence, current fees, available funds, or slippage.

Read wrappers make RPC calls and can fail on transport, address, ABI, or contract errors. Write wrappers have real side effects. For example, `multiVaultCreateAtomsWithUris(config, inputs)` accepts `inputs.args` as creator, atom-data array, asset array, and URI arrays, plus `value` equal to the sum of assets; it validates locally, simulates, and then calls the wallet. Optional `uriLimits` validate supplied live limits. Simulation remains authoritative for duplicates, approvals, cost, and live configuration.

Receipt parsers fetch and filter logs. Supply the expected emitter where supported and handle empty results before reading an event. A hash or an encoded call alone is not confirmation.

## Related concepts

[Protocol writes](/docs/concepts/protocol-writes) covers the transaction lifecycle. [Representation profiles](/docs/concepts/representation-profiles) explains the atom data and companion context that a creation call can carry.

## Source

[Package README](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/protocol/README.md), [root exports](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/protocol/src/index.ts), [deposit encoder](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/protocol/src/core/multivault/deposit-encode.ts), and [URI-aware creation wrapper](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/protocol/src/core/multivault/create-atoms-with-uris.ts).
