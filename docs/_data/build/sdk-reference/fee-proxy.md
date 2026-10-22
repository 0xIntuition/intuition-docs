---
title: 'FeeProxy URI creation'
slug: /build/sdk-reference/fee-proxy
---

Generated from the upcoming SDK **4.0.0** source. See [release compatibility](../compatibility.md) before installing or connecting to a deployment. Regenerate with `node scripts/generate-package-reference.js /path/to/packages`.

Import from `@0xintuition/sdk/actions`. [Implementation and internal helpers](https://github.com/0xIntuition/packages/blob/1dc7103d2a05f23bc565a81df4b001336ce9ba53/packages/sdk/src/actions/fee-proxy.ts).

Signatures show the exact accepted inputs and return types. Named input/output structures and dependency-injection types are listed below; viem and protocol types come from their respective packages. Preparation and quote functions can perform RPC reads. **`feeProxyExecutePlan` sends transactions**; the other SDK actions on these pages prepare transactions or read data.

## feeProxyPrepareCreateAtomsWithUrisTx

Prepares a `createAtomsWithUrisVia` transaction routed through an affiliate: reads
the live URI bounds and validates every atom's URI list against them, computes the
affiliate's creation-fee value (so the caller can size `msg.value` and a
`FeeGuard` cap correctly), and returns the calldata.

[Source](https://github.com/0xIntuition/packages/blob/1dc7103d2a05f23bc565a81df4b001336ce9ba53/packages/sdk/src/actions/fee-proxy.ts#L82)

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

## Input and result types

```ts
export type FeeProxyCreateAtomsWithUrisQuote = {
  affiliate: Address;
  totalGrossAssets: bigint;
  previewedFee: bigint;
  previewedForwarded: bigint;
  maxUriCount: number;
  maxUriLength: number;
};

export type FeeProxyPrepareCreateAtomsWithUrisTxResult = {
  args: readonly [Address, Hex[], bigint[], Hex[][], FeeGuard];
  calldata: Hex;
  value: bigint;
  quote: FeeProxyCreateAtomsWithUrisQuote;
};

type FeeProxyCreateAtomsWithUrisDeps = {
  previewCreationFee: typeof feeProxyPreviewCreationFee;
  getAtomUriConfig: typeof multiVaultGetAtomUriConfig;
};
```
