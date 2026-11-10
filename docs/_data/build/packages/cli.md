---
title: '@0xintuition/cli'
sidebar_label: 'CLI'
slug: /build/packages/cli
sidebar_position: 20
---

Discover encoders and produce deterministic calldata for agents and scripts. Use SDK actions for new action-envelope integrations.

Version **0.1.0-alpha.0** · [npm](https://www.npmjs.com/package/@0xintuition/cli/v/0.1.0-alpha.0) · [Compatibility](../compatibility.md)

## Install

```sh
npm install @0xintuition/cli@0.1.0-alpha.0
```

Use ESM imports.

## API overview

| Export or operation                | Purpose                           |
| ---------------------------------- | --------------------------------- |
| `intuition --help`                 | Discover executable commands      |
| `AgentActionEnvelope`              | Structured plan contract          |
| `buildMultiVaultDepositPlan`       | Deprecated alias; use SDK actions |
| `buildMultiVaultCreateAndSeedPlan` | Deprecated alias; use SDK actions |

## Example

```sh
npx @0xintuition/cli@0.1.0-alpha.0 --help
```

Start with encoder discovery before constructing an action envelope. The command does not sign or send transactions.

## Usage notes

The executable has no plan command. Library `build*Plan` aliases are deprecated for one release; use the [SDK envelope APIs](../guides/action-envelopes.md). Their `metadata.source.package` identifies the SDK. The CLI owns no wallet/public client, simulation, or submission. A plan still requires deployment compatibility checks, simulation where supported, authorization, and an external executor.

## Further reading

[Source and package guide](https://github.com/0xIntuition/packages/tree/dde4fdf5774447b84cd0b820593fb0db7366e58d/packages/cli) · [npm package](https://www.npmjs.com/package/@0xintuition/cli/v/0.1.0-alpha.0).
