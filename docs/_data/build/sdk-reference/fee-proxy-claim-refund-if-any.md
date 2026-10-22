---
title: 'FeeProxy refund preparation'
slug: /build/sdk-reference/fee-proxy-claim-refund-if-any
---

Generated from the upcoming SDK **4.0.0** source. See [release compatibility](../compatibility.md) before installing or connecting to a deployment. Regenerate with `node scripts/generate-package-reference.js /path/to/packages`.

Import from `@0xintuition/sdk/actions`. [Implementation and internal helpers](https://github.com/0xIntuition/packages/blob/1dc7103d2a05f23bc565a81df4b001336ce9ba53/packages/sdk/src/actions/fee-proxy-claim-refund-if-any.ts).

Signatures show the exact accepted inputs and return types. Named input/output structures and dependency-injection types are listed below; viem and protocol types come from their respective packages. Preparation and quote functions can perform RPC reads. **`feeProxyExecutePlan` sends transactions**; the other SDK actions on these pages prepare transactions or read data.

## feeProxyClaimRefundIfAny

Checks the pull-fallback refund ledger and builds a `claimRefundTo` transaction only when the
user is owed something. FeeProxy pushes excess `msg.value` back first and only credits the
ledger when that push fails, so for most callers this returns `null`; it never builds a claim
that would revert `FeeProxy_NoRefundOwed`.

[Source](https://github.com/0xIntuition/packages/blob/1dc7103d2a05f23bc565a81df4b001336ce9ba53/packages/sdk/src/actions/fee-proxy-claim-refund-if-any.ts#L30)

```ts
function feeProxyClaimRefundIfAny(
  config: ReadConfig,
  inputs: {
    user: Address;
    recipient?: Address;
  },
): Promise<FeeProxyRefundClaim | null>;
```

- **`config`**: FeeProxy address and public client.
- **`inputs`**: The ledger owner, and where to send the refund (defaults to the owner). Pass a
  different recipient when the owner is a contract whose `receive` reverts.
- **returns**: The claim transaction and amount, or `null` when nothing is owed.

## Input and result types

```ts
export type FeeProxyRefundClaim = {
  amount: bigint;
  tx: {
    /** The ledger owner. Only this account can claim its refund. */
    from: Address;
    to: Address;
    data: Hex;
    value: bigint;
  };
};
```
