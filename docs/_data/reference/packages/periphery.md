---
title: '@0xintuition/periphery'
sidebar_label: 'Periphery'
description: 'Use direct FeeProxy, router, and bridge wrappers with explicit deployment and execution boundaries.'
kind: reference
reader: ["app"]
packages: ["@0xintuition/periphery"]
---

<AppliesTo />

## What it's for

Direct wrappers and encoders for FeeProxy, the swap-and-bridge router, and meta-bridge contracts. It also exposes their shared artifacts and address helpers.

## When to use it

Use it for individual periphery calls or deterministic calldata. Use [SDK actions](/docs/reference/packages/sdk) when you need a multi-step plan. WrappedTrust and other core contracts belong to [protocol](/docs/reference/packages/protocol).

## Install

```sh
npm install @0xintuition/periphery@0.1.0 viem@2.31.4
```

Use ESM on Node 20+ or a compatible browser.

## Entry points

| Subpath | Purpose |
| --- | --- |
| `.` | Periphery ABIs, bytecode, deployments, client wrappers, and encoders |

## Depends on and works with

Runtime package dependency: [deployments](/docs/reference/packages/deployments). Peer dependency: `viem ^2.0.0`.

The pinned map provides FeeProxy addresses on Intuition mainnet and testnet. Bridge support is narrower: MetaERC20Hub is Base-mainnet scoped, and MetaERC20Spoke and MetaNativeSpoke are Intuition-mainnet scoped. FeeProxy support does not imply testnet bridge support.

## Example

Prepare the target and calldata for a refund claim to a caller-supplied recipient. No refund ledger is read, and no claim is submitted.

{/* example:start examples/v2/first-write/src/package-examples.ts#refund-encoding */}
```ts
import {
  feeProxyClaimRefundToEncode,
  getFeeProxyAddressFromChainId,
} from '@0xintuition/periphery';
import type { Address as RefundRecipient } from 'viem';

export function encodeRefund(recipient: RefundRecipient) {
  return {
    to: getFeeProxyAddressFromChainId(13579),
    data: feeProxyClaimRefundToEncode(recipient),
    value: 0n,
  };
}
```
{/* example:end */}

Encoding checks ABI argument shape, not the caller's pending refund. A real application first reads the correct account's refund ledger, reviews the recipient and chain, and separately executes with an authorized wallet. RPC reads can reject; write wrappers can simulate and submit transactions according to their specific implementation.

The pinned router address lookup throws because the older Base router does not match the encoded `deadline` argument. Do not invent an address to make the encoder executable. An encoder can exist before a compatible target is available; unsupported bridge combinations and missing deployment lookups must be handled explicitly.

## Related concepts

- [Fees, epochs and rewards](/docs/concepts/fees-and-rewards)
- [Protocol writes](/docs/concepts/protocol-writes)

See also [Build action plans and envelopes](/docs/build/action-plans).

## Source

[Package README](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/periphery/README.md), [refund encoder](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/periphery/src/fee-proxy/claim-refund-to-encode.ts), and [router lookup](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/periphery/src/utils/get-trust-swap-and-bridge-router-address-from-chain-id.ts).
