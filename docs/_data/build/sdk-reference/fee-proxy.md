---
title: 'FeeProxy URI creation'
slug: /build/sdk-reference/fee-proxy
---

Generated from the published SDK **4.0.0-alpha.0** source. See [release compatibility](../compatibility.md) before installing or connecting to a deployment. Regenerate with `node scripts/generate-package-reference.js /path/to/packages`.

Import from `@0xintuition/sdk/actions`. [Implementation and internal helpers](https://github.com/0xIntuition/packages/blob/dde4fdf5774447b84cd0b820593fb0db7366e58d/packages/sdk/src/actions/fee-proxy.ts).

Signatures show the exact accepted inputs and return types. Named input/output structures and dependency-injection types are listed below; viem and protocol types come from their respective packages. Preparation and quote functions can perform RPC reads. Envelope builders on the action-envelope pages use caller-supplied read context and perform no RPC reads or signing. **`feeProxyExecutePlan` sends transactions**; the other SDK actions on these pages prepare transactions or read data.

## feeProxyPrepareCreateAtomsWithUrisTx

Prepares a `createAtomsWithUrisVia` transaction routed through an affiliate: reads
the live URI bounds and validates every atom's URI list against them, computes the
affiliate's creation-fee value (so the caller can size `msg.value` and a
`FeeGuard` cap correctly), and returns the calldata.

[Source](https://github.com/0xIntuition/packages/blob/dde4fdf5774447b84cd0b820593fb0db7366e58d/packages/sdk/src/actions/fee-proxy.ts#L82)

```ts
function feeProxyPrepareCreateAtomsWithUrisTx(
  configs: {
    feeProxy: ReadConfig;
    multiVault: ReadConfig;
  },
  inputs: {
    affiliate: Address;
    atomDatas: Hex[];
    assets: bigint[];
    uris: Hex[][];
    feeGuard: FeeGuard;
  },
  deps?: FeeProxyCreateAtomsWithUrisDeps,
): Promise<FeeProxyPrepareCreateAtomsWithUrisTxResult>;
```

- **`configs`**: `feeProxy` and `multiVault` read configs (both resolve against the same public client).
- **`inputs`**: The affiliate, per-atom data/assets/URIs, and the caller's front-run guard.
- **`deps`**: Injectable protocol/periphery read primitives.
- **returns**: The `createAtomsWithUrisVia` calldata, args, gross value, and the fee/bounds quote it was built from.

Defaults: `deps = defaultFeeProxyCreateAtomsWithUrisDeps`. Dependency arguments are optional test/customization hooks; normal consumers use the built-in dependencies.

## Imported type provenance

Public import locations and the definitions used by these signatures and helper types. Value imports appear where a dependency hook uses `typeof`.

| Name in this module          | Public import                                                         | Definition                                                                                                                                                                  |
| ---------------------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `FeeGuard`                   | `import type { FeeGuard } from '@0xintuition/periphery'`              | [Source definition](https://github.com/0xIntuition/packages/blob/dde4fdf5774447b84cd0b820593fb0db7366e58d/packages/periphery/src/fee-proxy/types.ts#L2)                     |
| `feeProxyPreviewCreationFee` | `import { feeProxyPreviewCreationFee } from '@0xintuition/periphery'` | [Source definition](https://github.com/0xIntuition/packages/blob/dde4fdf5774447b84cd0b820593fb0db7366e58d/packages/periphery/src/fee-proxy/preview-creation-fee.ts#L12)     |
| `multiVaultGetAtomUriConfig` | `import { multiVaultGetAtomUriConfig } from '@0xintuition/protocol'`  | [Source definition](https://github.com/0xIntuition/packages/blob/dde4fdf5774447b84cd0b820593fb0db7366e58d/packages/protocol/src/core/multivault/get-atom-uri-config.ts#L12) |
| `ReadConfig`                 | `import type { ReadConfig } from '@0xintuition/protocol'`             | [Source definition](https://github.com/0xIntuition/packages/blob/dde4fdf5774447b84cd0b820593fb0db7366e58d/packages/protocol/src/types.ts#L3)                                |
| `Address`                    | `import type { Address } from 'viem'`                                 | Owned by the external package.                                                                                                                                              |
| `Hex`                        | `import type { Hex } from 'viem'`                                     | Owned by the external package.                                                                                                                                              |

## Supporting input and result structures

These declarations retain their owning source links. Internal supporting types describe accepted shapes but are not standalone public imports.

### FeeGuard

[Source definition](https://github.com/0xIntuition/packages/blob/dde4fdf5774447b84cd0b820593fb0db7366e58d/packages/periphery/src/fee-proxy/types.ts#L2)

```ts
export type FeeGuard = {
  maxFeeBps: bigint;
  maxFixedFee: bigint;
};
```

## Input and result types

Exported declarations are public imports from the SDK subpath above. Module-local helper aliases describe accepted shapes but are not public exports.

### FeeProxyCreateAtomsWithUrisQuote

Public export.

```ts
export type FeeProxyCreateAtomsWithUrisQuote = {
  affiliate: Address;
  totalGrossAssets: bigint;
  previewedFee: bigint;
  previewedForwarded: bigint;
  maxUriCount: number;
  maxUriLength: number;
};
```

### FeeProxyPrepareCreateAtomsWithUrisTxResult

Public export.

```ts
export type FeeProxyPrepareCreateAtomsWithUrisTxResult = {
  args: readonly [Address, Hex[], bigint[], Hex[][], FeeGuard];
  calldata: Hex;
  value: bigint;
  quote: FeeProxyCreateAtomsWithUrisQuote;
};
```

### FeeProxyCreateAtomsWithUrisDeps

Module-local helper; not a public export.

```ts
type FeeProxyCreateAtomsWithUrisDeps = {
  previewCreationFee: typeof feeProxyPreviewCreationFee;
  getAtomUriConfig: typeof multiVaultGetAtomUriConfig;
};
```
