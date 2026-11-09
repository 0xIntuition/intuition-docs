---
title: 'Action envelope types'
slug: /build/sdk-reference/schema-types
---

API for `@0xintuition/sdk@4.0.0-alpha.0`. [Compatibility](../compatibility.md) · [Source](https://github.com/0xIntuition/packages/blob/dde4fdf5774447b84cd0b820593fb0db7366e58d/packages/sdk/src/actions/schema/types.ts).

Import from `@0xintuition/sdk/actions`.

Signatures show the exact accepted inputs and return types. Named input/output structures and dependency-injection types are listed below; viem and protocol types come from their respective packages. Preparation and quote functions can perform RPC reads. Envelope builders on the action-envelope pages use caller-supplied read context and perform no RPC reads or signing. **`feeProxyExecutePlan` sends transactions**; the other SDK actions on these pages prepare transactions or read data.

## Constants

```ts
export const agentActionSchemaVersion = '1.0.0' as const;
export const supportedAgentActionChainIds = [1155, 13579, 8453, 84532] as const;
```

## Imported type provenance

Public import locations and the definitions used by these signatures and helper types. Value imports appear where a dependency hook uses `typeof`.

| Name in this module | Public import                         | Definition                     |
| ------------------- | ------------------------------------- | ------------------------------ |
| `Address`           | `import type { Address } from 'viem'` | Owned by the external package. |
| `Hex`               | `import type { Hex } from 'viem'`     | Owned by the external package. |

## Input and result types

Exported declarations are public imports from the SDK subpath above. Module-local helper aliases describe accepted shapes but are not public exports.

### SupportedAgentActionChainId

Public export.

```ts
export type SupportedAgentActionChainId =
  (typeof supportedAgentActionChainIds)[number];
```

### MetaBridgeAsset

Public export.

```ts
export type MetaBridgeAsset = 'USDC' | 'WETH';
```

### AgentActionSurface

Public export.

```ts
export type AgentActionSurface = 'core' | 'periphery';
```

### AgentActionTargetFlow

Public export.

```ts
export type AgentActionTargetFlow =
  | 'trust'
  | 'multivault'
  | 'trustbonding'
  | 'wrapped-trust'
  | 'base-emissions-controller'
  | 'satellite-emissions-controller'
  | 'bridge-asset'
  | 'trust-swap-and-bridge-router'
  | 'meta-bridge'
  | 'atom-warden'
  | 'dynamic-fee-flat-price-curve'
  | 'fee-proxy';
```

### AgentActionTargetContract

Public export.

```ts
export type AgentActionTargetContract =
  | 'trust'
  | 'multivault'
  | 'trustbonding'
  | 'wrapped-trust'
  | 'base-emissions-controller'
  | 'satellite-emissions-controller'
  | 'base-bridge-asset'
  | 'trust-swap-and-bridge-router'
  | 'meta-native-spoke'
  | 'meta-erc20-hub'
  | 'meta-erc20-spoke'
  | 'atom-warden'
  | 'dynamic-fee-flat-price-curve'
  | 'fee-proxy';
```

### AgentActionTargetDeploymentName

Public export.

```ts
export type AgentActionTargetDeploymentName =
  | 'Trust'
  | 'MultiVault'
  | 'TrustBonding'
  | 'WrappedTrust'
  | 'BaseEmissionsController'
  | 'SatelliteEmissionsController'
  | 'BaseBridgeAsset'
  | 'TrustSwapAndBridgeRouter'
  | 'MetaNativeSpoke'
  | 'MetaERC20Hub'
  | 'MetaERC20Spoke'
  | 'AtomWarden'
  | 'DynamicFeeFlatPriceCurve'
  | 'FeeProxy';
```

### JsonPrimitive

Public export.

```ts
export type JsonPrimitive = boolean | number | string | null;
```

### JsonValue

Public export.

```ts
export type JsonValue = JsonPrimitive | JsonObject | JsonValue[];
```

### JsonObject

Public export.

```ts
export type JsonObject = {
  [key: string]: JsonValue;
};
```

### AgentActionMetadata

Public export.

```ts
export type AgentActionMetadata = {
  label?: string;
  description?: string;
  tags?: string[];
  source?: {
    package: string;
    module: string;
    method: string;
  };
  context?: JsonObject;
};
```

### AgentActionTarget

Public export.

```ts
export type AgentActionTarget =
  | {
      chainId: 8453;
      chainName: 'Base';
      surface: 'core';
      flow: 'trust';
      contract: 'trust';
      deploymentName: 'Trust';
      address: Address;
    }
  | {
      chainId: 84532;
      chainName: 'Base Sepolia';
      surface: 'core';
      flow: 'trust';
      contract: 'trust';
      deploymentName: 'Trust';
      address: Address;
    }
  | {
      chainId: 1155;
      chainName: 'Intuition';
      surface: 'core';
      flow: 'multivault';
      contract: 'multivault';
      deploymentName: 'MultiVault';
      address: Address;
    }
  | {
      chainId: 13579;
      chainName: 'Intuition Testnet';
      surface: 'core';
      flow: 'multivault';
      contract: 'multivault';
      deploymentName: 'MultiVault';
      address: Address;
    }
  | {
      chainId: 1155;
      chainName: 'Intuition';
      surface: 'core';
      flow: 'trustbonding';
      contract: 'trustbonding';
      deploymentName: 'TrustBonding';
      address: Address;
    }
  | {
      chainId: 13579;
      chainName: 'Intuition Testnet';
      surface: 'core';
      flow: 'trustbonding';
      contract: 'trustbonding';
      deploymentName: 'TrustBonding';
      address: Address;
    }
  | {
      chainId: 1155;
      chainName: 'Intuition';
      surface: 'core';
      flow: 'wrapped-trust';
      contract: 'wrapped-trust';
      deploymentName: 'WrappedTrust';
      address: Address;
    }
  | {
      chainId: 13579;
      chainName: 'Intuition Testnet';
      surface: 'core';
      flow: 'wrapped-trust';
      contract: 'wrapped-trust';
      deploymentName: 'WrappedTrust';
      address: Address;
    }
  | {
      chainId: 8453;
      chainName: 'Base';
      surface: 'core';
      flow: 'base-emissions-controller';
      contract: 'base-emissions-controller';
      deploymentName: 'BaseEmissionsController';
      address: Address;
    }
  | {
      chainId: 84532;
      chainName: 'Base Sepolia';
      surface: 'core';
      flow: 'base-emissions-controller';
      contract: 'base-emissions-controller';
      deploymentName: 'BaseEmissionsController';
      address: Address;
    }
  | {
      chainId: 1155;
      chainName: 'Intuition';
      surface: 'core';
      flow: 'satellite-emissions-controller';
      contract: 'satellite-emissions-controller';
      deploymentName: 'SatelliteEmissionsController';
      address: Address;
    }
  | {
      chainId: 13579;
      chainName: 'Intuition Testnet';
      surface: 'core';
      flow: 'satellite-emissions-controller';
      contract: 'satellite-emissions-controller';
      deploymentName: 'SatelliteEmissionsController';
      address: Address;
    }
  | {
      chainId: 8453;
      chainName: 'Base';
      surface: 'periphery';
      flow: 'bridge-asset';
      contract: 'base-bridge-asset';
      deploymentName: 'BaseBridgeAsset';
      address: Address;
      asset: MetaBridgeAsset;
    }
  | {
      chainId: 8453;
      chainName: 'Base';
      surface: 'periphery';
      flow: 'trust-swap-and-bridge-router';
      contract: 'trust-swap-and-bridge-router';
      deploymentName: 'TrustSwapAndBridgeRouter';
      address: Address;
    }
  | {
      chainId: 1155;
      chainName: 'Intuition';
      surface: 'periphery';
      flow: 'meta-bridge';
      contract: 'meta-native-spoke';
      deploymentName: 'MetaNativeSpoke';
      address: Address;
    }
  | {
      chainId: 8453;
      chainName: 'Base';
      surface: 'periphery';
      flow: 'meta-bridge';
      contract: 'meta-erc20-hub';
      deploymentName: 'MetaERC20Hub';
      address: Address;
      asset: MetaBridgeAsset;
    }
  | {
      chainId: 1155;
      chainName: 'Intuition';
      surface: 'periphery';
      flow: 'meta-bridge';
      contract: 'meta-erc20-spoke';
      deploymentName: 'MetaERC20Spoke';
      address: Address;
      asset: MetaBridgeAsset;
    }
  | {
      chainId: 1155;
      chainName: 'Intuition';
      surface: 'core';
      flow: 'atom-warden';
      contract: 'atom-warden';
      deploymentName: 'AtomWarden';
      address: Address;
    }
  | {
      chainId: 13579;
      chainName: 'Intuition Testnet';
      surface: 'core';
      flow: 'atom-warden';
      contract: 'atom-warden';
      deploymentName: 'AtomWarden';
      address: Address;
    }
  // DynamicFeeFlatPriceCurve is resolved per-vault via the BondingCurveRegistry, and the
  // deployments map records only the testnet curve, so the caller supplies the
  // already-resolved address on the intent rather than it being looked up.
  | {
      chainId: 1155;
      chainName: 'Intuition';
      surface: 'core';
      flow: 'dynamic-fee-flat-price-curve';
      contract: 'dynamic-fee-flat-price-curve';
      deploymentName: 'DynamicFeeFlatPriceCurve';
      address: Address;
    }
  | {
      chainId: 13579;
      chainName: 'Intuition Testnet';
      surface: 'core';
      flow: 'dynamic-fee-flat-price-curve';
      contract: 'dynamic-fee-flat-price-curve';
      deploymentName: 'DynamicFeeFlatPriceCurve';
      address: Address;
    }
  // The caller supplies the already-resolved FeeProxy address on the intent rather than it
  // being looked up.
  | {
      chainId: 1155;
      chainName: 'Intuition';
      surface: 'periphery';
      flow: 'fee-proxy';
      contract: 'fee-proxy';
      deploymentName: 'FeeProxy';
      address: Address;
    }
  | {
      chainId: 13579;
      chainName: 'Intuition Testnet';
      surface: 'periphery';
      flow: 'fee-proxy';
      contract: 'fee-proxy';
      deploymentName: 'FeeProxy';
      address: Address;
    };
```

### AgentActionTargetIntent

Public export.

```ts
export type AgentActionTargetIntent =
  | {
      chainId: 8453;
      contract:
        | 'trust'
        | 'base-emissions-controller'
        | 'trust-swap-and-bridge-router';
    }
  | {
      chainId: 84532;
      contract: 'trust' | 'base-emissions-controller';
    }
  | {
      chainId: 1155 | 13579;
      contract:
        | 'multivault'
        | 'trustbonding'
        | 'wrapped-trust'
        | 'satellite-emissions-controller';
    }
  | {
      chainId: 1155;
      flow: 'meta-bridge';
      contract: 'meta-native-spoke';
    }
  | {
      chainId: 8453;
      flow: 'bridge-asset';
      contract: 'base-bridge-asset';
      asset: MetaBridgeAsset;
    }
  | {
      chainId: 8453;
      flow: 'meta-bridge';
      contract: 'meta-erc20-hub';
      asset: MetaBridgeAsset;
    }
  | {
      chainId: 1155;
      flow: 'meta-bridge';
      contract: 'meta-erc20-spoke';
      asset: MetaBridgeAsset;
    }
  | {
      chainId: 1155 | 13579;
      contract: 'atom-warden';
    }
  | {
      chainId: 1155 | 13579;
      contract: 'dynamic-fee-flat-price-curve';
      address: Address;
    }
  | {
      chainId: 1155 | 13579;
      contract: 'fee-proxy';
      address: Address;
    };
```

### AgentActionStep

Public export.

```ts
export type AgentActionStep = {
  id: string;
  to: Address;
  data: Hex;
  value?: `${bigint}`;
  target: AgentActionTarget;
  metadata?: AgentActionMetadata;
};
```

### CreateAgentActionStepInput

Public export.

```ts
export type CreateAgentActionStepInput =
  | AgentActionStep
  | {
      id: string;
      data: Hex;
      value?: `${bigint}`;
      intent: AgentActionTargetIntent;
      metadata?: AgentActionMetadata;
    };
```

### AgentActionEnvelope

Public export.

```ts
export type AgentActionEnvelope = {
  schemaVersion: typeof agentActionSchemaVersion;
  action: string;
  steps: AgentActionStep[];
  metadata?: AgentActionMetadata;
  estimates?: JsonObject;
  warnings?: string[];
};
```
