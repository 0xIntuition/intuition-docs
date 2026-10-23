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

## Imported type provenance

Public import locations and the definitions used by these signatures and helper types. Value imports appear where a dependency hook uses `typeof`.

| Name in this module | Public import                                              | Definition                                                                                                                                    |
| ------------------- | ---------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `ReadConfig`        | `import type { ReadConfig } from '@0xintuition/periphery'` | [Source definition](https://github.com/0xIntuition/packages/blob/1dc7103d2a05f23bc565a81df4b001336ce9ba53/packages/periphery/src/types.ts#L3) |
| `Address`           | `import type { Address } from 'viem'`                      | Owned by the external package.                                                                                                                |
| `Hex`               | `import type { Hex } from 'viem'`                          | Owned by the external package.                                                                                                                |

## External input and result structures

These declarations belong to the named packages, not to the SDK. Nested supporting types retain their owning source links.

### ReadConfig

[Source definition](https://github.com/0xIntuition/packages/blob/1dc7103d2a05f23bc565a81df4b001336ce9ba53/packages/periphery/src/types.ts#L3)

```ts
export type ReadConfig = {
  address: Address;
  publicClient: PublicClient;
};
```

## Input and result types

Exported declarations are public imports from the SDK subpath above. Module-local helper aliases describe accepted shapes but are not public exports.

### FeeProxyRefundClaim

Public export.

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
