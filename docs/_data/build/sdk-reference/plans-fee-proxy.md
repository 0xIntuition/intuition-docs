---
title: 'FeeProxy action envelopes'
slug: /build/sdk-reference/plans-fee-proxy
---

API for `@0xintuition/sdk@4.0.0-alpha.0`. [Compatibility](../compatibility.md) · [Source](https://github.com/0xIntuition/packages/blob/dde4fdf5774447b84cd0b820593fb0db7366e58d/packages/sdk/src/actions/plans/fee-proxy.ts).

Import from `@0xintuition/sdk/actions`.

Signatures show the exact accepted inputs and return types. Named input/output structures and dependency-injection types are listed below; viem and protocol types come from their respective packages. Preparation and quote functions can perform RPC reads. Envelope builders on the action-envelope pages use caller-supplied read context and perform no RPC reads or signing. **`feeProxyExecutePlan` sends transactions**; the other SDK actions on these pages prepare transactions or read data.

## feeProxyCreateAtomsWithUrisEnvelope

Builds a `createAtomsWithUrisVia` plan routed through an affiliate: validates every
atom's URI list against the live URI bounds, quotes the affiliate's creation fee, and
returns the calldata.

[Source](https://github.com/0xIntuition/packages/blob/dde4fdf5774447b84cd0b820593fb0db7366e58d/packages/sdk/src/actions/plans/fee-proxy.ts#L43)

```ts
function feeProxyCreateAtomsWithUrisEnvelope(
  inputs: BuildFeeProxyCreateAtomsWithUrisPlanInputs,
): Promise<import('@0xintuition/sdk/actions').AgentActionEnvelope>;
```

- **`inputs`**: Chain, contract addresses, the affiliate, per-atom data/assets/URIs, the caller's fee guard, and precomputed read values.
- **returns**: An agent-action envelope with the creation step and the fee/bounds quote it was built from.

## Imported type provenance

Public import locations and the definitions used by these signatures and helper types. Value imports appear where a dependency hook uses `typeof`.

| Name in this module | Public import                         | Definition                     |
| ------------------- | ------------------------------------- | ------------------------------ |
| `Address`           | `import type { Address } from 'viem'` | Owned by the external package. |
| `Hex`               | `import type { Hex } from 'viem'`     | Owned by the external package. |

## Input and result types

Exported declarations are public imports from the SDK subpath above. Module-local helper aliases describe accepted shapes but are not public exports.

### IntuitionCoreChainId

Module-local helper; not a public export.

```ts
type IntuitionCoreChainId = 1155 | 13579;
```

### FeeProxyFeeGuardPlanInput

Public export.

```ts
export type FeeProxyFeeGuardPlanInput = {
  maxFeeBps: bigint;
  maxFixedFee: bigint;
};
```

### FeeProxyCreateAtomsWithUrisPlanReadContext

Public export.

```ts
export type FeeProxyCreateAtomsWithUrisPlanReadContext = {
  previewCreationFee?: readonly [bigint, bigint];
  atomUriConfig?: readonly [number, number];
};
```

### BuildFeeProxyCreateAtomsWithUrisPlanInputs

Public export.

```ts
export type BuildFeeProxyCreateAtomsWithUrisPlanInputs = {
  chainId?: IntuitionCoreChainId;
  feeProxyAddress: Address;
  multiVaultAddress: Address;
  affiliate: Address;
  atomDatas: Hex[];
  assets: bigint[];
  uris: Hex[][];
  feeGuard: FeeProxyFeeGuardPlanInput;
  readContext?: FeeProxyCreateAtomsWithUrisPlanReadContext;
};
```
