---
title: 'Create and validate action envelopes'
slug: /build/sdk-reference/schema-create-agent-action-envelope
---

API for `@0xintuition/sdk@4.0.0-alpha.0`. [Compatibility](../compatibility.md) · [Source](https://github.com/0xIntuition/packages/blob/dde4fdf5774447b84cd0b820593fb0db7366e58d/packages/sdk/src/actions/schema/create-agent-action-envelope.ts).

Import from `@0xintuition/sdk/actions`.

Signatures show the exact accepted inputs and return types. Named input/output structures and dependency-injection types are listed below; viem and protocol types come from their respective packages. Preparation and quote functions can perform RPC reads. Envelope builders on the action-envelope pages use caller-supplied read context and perform no RPC reads or signing. **`feeProxyExecutePlan` sends transactions**; the other SDK actions on these pages prepare transactions or read data.

## bigintToDecimalString

Convert a bigint to its decimal string representation for a JSON action envelope.

[Source](https://github.com/0xIntuition/packages/blob/dde4fdf5774447b84cd0b820593fb0db7366e58d/packages/sdk/src/actions/schema/create-agent-action-envelope.ts#L23)

```ts
function bigintToDecimalString(value: bigint): `${bigint}`;
```

## validateAgentActionStep

Validate a step target, calldata, and decimal value. Throws for invalid input; does not simulate the transaction.

[Source](https://github.com/0xIntuition/packages/blob/dde4fdf5774447b84cd0b820593fb0db7366e58d/packages/sdk/src/actions/schema/create-agent-action-envelope.ts#L240)

```ts
function validateAgentActionStep(
  step: AgentActionStep,
  index?,
): AgentActionStep;
```

Defaults: `index = 0`. Dependency arguments are optional test/customization hooks; normal consumers use the built-in dependencies.

## createAgentActionStep

Resolve a supported target intent and construct a validated action step.

[Source](https://github.com/0xIntuition/packages/blob/dde4fdf5774447b84cd0b820593fb0db7366e58d/packages/sdk/src/actions/schema/create-agent-action-envelope.ts#L261)

```ts
function createAgentActionStep(
  input: CreateAgentActionStepInput,
  index?,
): AgentActionStep;
```

Defaults: `index = 0`. Dependency arguments are optional test/customization hooks; normal consumers use the built-in dependencies.

## validateAgentActionEnvelope

Validate envelope schema, metadata, unique step IDs, and individual steps. Does not authorize or execute them.

[Source](https://github.com/0xIntuition/packages/blob/dde4fdf5774447b84cd0b820593fb0db7366e58d/packages/sdk/src/actions/schema/create-agent-action-envelope.ts#L294)

```ts
function validateAgentActionEnvelope(
  envelope: AgentActionEnvelope,
): AgentActionEnvelope;
```

## createAgentActionEnvelope

Construct and validate a JSON-serializable envelope of ordered transaction steps.

[Source](https://github.com/0xIntuition/packages/blob/dde4fdf5774447b84cd0b820593fb0db7366e58d/packages/sdk/src/actions/schema/create-agent-action-envelope.ts#L312)

```ts
function createAgentActionEnvelope(
  inputs: CreateAgentActionEnvelopeInputs,
): AgentActionEnvelope;
```

## Imported type provenance

Public import locations and the definitions used by these signatures and helper types. Value imports appear where a dependency hook uses `typeof`.

| Name in this module          | Public import                                                                | Definition                                                                 |
| ---------------------------- | ---------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| `AgentActionEnvelope`        | `import type { AgentActionEnvelope } from '@0xintuition/sdk/actions'`        | [AgentActionEnvelope](./schema-types.md#agentactionenvelope)               |
| `AgentActionMetadata`        | `import type { AgentActionMetadata } from '@0xintuition/sdk/actions'`        | [AgentActionMetadata](./schema-types.md#agentactionmetadata)               |
| `AgentActionStep`            | `import type { AgentActionStep } from '@0xintuition/sdk/actions'`            | [AgentActionStep](./schema-types.md#agentactionstep)                       |
| `CreateAgentActionStepInput` | `import type { CreateAgentActionStepInput } from '@0xintuition/sdk/actions'` | [CreateAgentActionStepInput](./schema-types.md#createagentactionstepinput) |
| `JsonObject`                 | `import type { JsonObject } from '@0xintuition/sdk/actions'`                 | [JsonObject](./schema-types.md#jsonobject)                                 |

## Input and result types

Exported declarations are public imports from the SDK subpath above. Module-local helper aliases describe accepted shapes but are not public exports.

### CreateAgentActionEnvelopeInputs

Public export.

```ts
export type CreateAgentActionEnvelopeInputs = {
  action: string;
  steps: CreateAgentActionStepInput[];
  metadata?: AgentActionMetadata;
  estimates?: JsonObject;
  warnings?: string[];
};
```
