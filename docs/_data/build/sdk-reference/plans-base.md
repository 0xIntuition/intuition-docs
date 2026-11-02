---
title: 'Bridge action envelopes'
slug: /build/sdk-reference/plans-base
---

Generated from the published SDK **4.0.0-alpha.0** source. See [release compatibility](../compatibility.md) before installing or connecting to a deployment. Regenerate with `node scripts/generate-package-reference.js /path/to/packages`.

Import from `@0xintuition/sdk/actions`. [Implementation and internal helpers](https://github.com/0xIntuition/packages/blob/dde4fdf5774447b84cd0b820593fb0db7366e58d/packages/sdk/src/actions/plans/base.ts).

Signatures show the exact accepted inputs and return types. Named input/output structures and dependency-injection types are listed below; viem and protocol types come from their respective packages. Preparation and quote functions can perform RPC reads. Envelope builders on the action-envelope pages use caller-supplied read context and perform no RPC reads or signing. **`feeProxyExecutePlan` sends transactions**; the other SDK actions on these pages prepare transactions or read data.

## baseTrustBridgeToIntuitionEnvelope

Encode approval and Base-to-Intuition TRUST bridge steps using supplied allowance and fee context, without RPC or signing.

[Source](https://github.com/0xIntuition/packages/blob/dde4fdf5774447b84cd0b820593fb0db7366e58d/packages/sdk/src/actions/plans/base.ts#L80)

```ts
function baseTrustBridgeToIntuitionEnvelope(
  inputs: BuildBaseTrustBridgeToIntuitionPlanInputs,
): Promise<import('@0xintuition/sdk/actions').AgentActionEnvelope>;
```

## intuitionTrustBridgeToBaseEnvelope

Encode Intuition-to-Base TRUST bridge steps using supplied fee context, without RPC or signing.

[Source](https://github.com/0xIntuition/packages/blob/dde4fdf5774447b84cd0b820593fb0db7366e58d/packages/sdk/src/actions/plans/base.ts#L162)

```ts
function intuitionTrustBridgeToBaseEnvelope(
  inputs: BuildIntuitionTrustBridgeToBasePlanInputs,
): Promise<import('@0xintuition/sdk/actions').AgentActionEnvelope>;
```

## baseERC20BridgeToIntuitionEnvelope

Encode ERC-20 approval and bridge steps from Base using supplied allowance and fee context.

[Source](https://github.com/0xIntuition/packages/blob/dde4fdf5774447b84cd0b820593fb0db7366e58d/packages/sdk/src/actions/plans/base.ts#L220)

```ts
function baseERC20BridgeToIntuitionEnvelope(
  inputs: BuildBaseERC20BridgeToIntuitionPlanInputs,
): Promise<import('@0xintuition/sdk/actions').AgentActionEnvelope>;
```

## intuitionERC20BridgeToBaseEnvelope

Encode ERC-20 approval and bridge steps from Intuition using supplied allowance and fee context.

[Source](https://github.com/0xIntuition/packages/blob/dde4fdf5774447b84cd0b820593fb0db7366e58d/packages/sdk/src/actions/plans/base.ts#L316)

```ts
function intuitionERC20BridgeToBaseEnvelope(
  inputs: BuildIntuitionERC20BridgeToBasePlanInputs,
): Promise<import('@0xintuition/sdk/actions').AgentActionEnvelope>;
```

## Imported type provenance

Public import locations and the definitions used by these signatures and helper types. Value imports appear where a dependency hook uses `typeof`.

| Name in this module | Public import                                                   | Definition                                                                                                                                                      |
| ------------------- | --------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `MetaBridgeAsset`   | `import type { MetaBridgeAsset } from '@0xintuition/periphery'` | [Source definition](https://github.com/0xIntuition/packages/blob/dde4fdf5774447b84cd0b820593fb0db7366e58d/packages/deployments/src/periphery-deployments.ts#L6) |
| `Address`           | `import type { Address } from 'viem'`                           | Owned by the external package.                                                                                                                                  |

## Input and result types

Exported declarations are public imports from the SDK subpath above. Module-local helper aliases describe accepted shapes but are not public exports.

### BridgeFeeReadContext

Public export.

```ts
export type BridgeFeeReadContext = {
  bridgeFee?: bigint;
};
```

### ApprovalBridgePlanReadContext

Public export.

```ts
export type ApprovalBridgePlanReadContext = BridgeFeeReadContext & {
  currentAllowance?: bigint;
};
```

### BaseTrustBridgePlanReadContext

Public export.

```ts
export type BaseTrustBridgePlanReadContext = ApprovalBridgePlanReadContext;
```

### BuildBaseTrustBridgeToIntuitionPlanInputs

Public export.

```ts
export type BuildBaseTrustBridgeToIntuitionPlanInputs = {
  owner: Address;
  recipient: Address;
  trustAmount: bigint;
  trustAddress?: Address;
  readContext?: BaseTrustBridgePlanReadContext;
};
```

### BuildIntuitionTrustBridgeToBasePlanInputs

Public export.

```ts
export type BuildIntuitionTrustBridgeToBasePlanInputs = {
  owner: Address;
  recipient: Address;
  trustAmount: bigint;
  metaNativeSpokeAddress?: Address;
  readContext?: BridgeFeeReadContext;
};
```

### BuildBaseERC20BridgeToIntuitionPlanInputs

Public export.

```ts
export type BuildBaseERC20BridgeToIntuitionPlanInputs = {
  owner: Address;
  recipient: Address;
  asset: MetaBridgeAsset;
  amount: bigint;
  assetAddress?: Address;
  metaERC20HubAddress?: Address;
  readContext?: ApprovalBridgePlanReadContext;
};
```

### BuildIntuitionERC20BridgeToBasePlanInputs

Public export.

```ts
export type BuildIntuitionERC20BridgeToBasePlanInputs = {
  owner: Address;
  recipient: Address;
  asset: MetaBridgeAsset;
  amount: bigint;
  metaERC20SpokeAddress?: Address;
  readContext?: BridgeFeeReadContext;
};
```
