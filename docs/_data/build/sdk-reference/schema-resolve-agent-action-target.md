---
title: 'Resolve action targets'
slug: /build/sdk-reference/schema-resolve-agent-action-target
---

API for `@0xintuition/sdk@4.0.0-alpha.0`. [Compatibility](../compatibility.md) · [Source](https://github.com/0xIntuition/packages/blob/dde4fdf5774447b84cd0b820593fb0db7366e58d/packages/sdk/src/actions/schema/resolve-agent-action-target.ts).

Import from `@0xintuition/sdk/actions`.

Signatures show the exact accepted inputs and return types. Named input/output structures and dependency-injection types are listed below; viem and protocol types come from their respective packages. Preparation and quote functions can perform RPC reads. Envelope builders on the action-envelope pages use caller-supplied read context and perform no RPC reads or signing. **`feeProxyExecutePlan` sends transactions**; the other SDK actions on these pages prepare transactions or read data.

## resolveAgentActionTarget

Resolve a chain and contract intent through the deployment catalog. Unsupported or withheld targets throw.

[Source](https://github.com/0xIntuition/packages/blob/dde4fdf5774447b84cd0b820593fb0db7366e58d/packages/sdk/src/actions/schema/resolve-agent-action-target.ts#L38)

```ts
function resolveAgentActionTarget(
  intent: AgentActionTargetIntent,
): AgentActionTarget;
```

## Imported type provenance

Public import locations and the definitions used by these signatures and helper types. Value imports appear where a dependency hook uses `typeof`.

| Name in this module       | Public import                                                             | Definition                                                           |
| ------------------------- | ------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| `AgentActionTarget`       | `import type { AgentActionTarget } from '@0xintuition/sdk/actions'`       | [AgentActionTarget](./schema-types.md#agentactiontarget)             |
| `AgentActionTargetIntent` | `import type { AgentActionTargetIntent } from '@0xintuition/sdk/actions'` | [AgentActionTargetIntent](./schema-types.md#agentactiontargetintent) |
