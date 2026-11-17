---
title: "Resolve action targets"
sidebar_label: "Resolve action targets"
description: "SDK declarations for resolve action targets. Inputs, return types, defaults, effects, and immutable source links."
kind: reference
reader: ["app", "agent"]
packages: ["@0xintuition/sdk"]
generated_by: scripts/generate-package-reference.js
---

<AppliesTo />

API for `@0xintuition/sdk@4.0.0`. [Compatibility](/docs/reference/compatibility) · [Source](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/sdk/src/actions/schema/resolve-agent-action-target.ts).

Import from `@0xintuition/sdk/actions`.

Signatures show the exact accepted inputs and return types. Named input/output structures and dependency-injection types are listed below; viem and protocol types come from their respective packages. Preparation and quote functions can perform RPC reads. Envelope builders on the action-envelope pages use caller-supplied read context and perform no RPC reads or signing. **`feeProxyExecutePlan` sends transactions**; the other SDK actions on these pages prepare transactions or read data.

## resolveAgentActionTarget

Resolve a chain and contract intent through the deployment catalog. Unsupported or withheld targets throw.

[Source](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/sdk/src/actions/schema/resolve-agent-action-target.ts#L38)

```ts
function resolveAgentActionTarget(
  intent: AgentActionTargetIntent,
): AgentActionTarget;
```

## Imported type provenance

Public import locations and the definitions used by these signatures and helper types. Value imports appear where a dependency hook uses `typeof`.

| Name in this module       | Public import                                                             | Definition                                                                          |
| ------------------------- | ------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| `AgentActionTarget`       | `import type { AgentActionTarget } from '@0xintuition/sdk/actions'`       | [AgentActionTarget](/docs/reference/sdk/schema-types#agentactiontarget)             |
| `AgentActionTargetIntent` | `import type { AgentActionTargetIntent } from '@0xintuition/sdk/actions'` | [AgentActionTargetIntent](/docs/reference/sdk/schema-types#agentactiontargetintent) |
