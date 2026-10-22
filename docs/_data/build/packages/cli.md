---
title: '@0xintuition/cli guide'
slug: /build/packages/cli
sidebar_position: 18
---

Discover encoders and produce deterministic calldata or action envelopes for agents and scripts.

Candidate source version: **0.1.0**. [Release compatibility](../compatibility.md) explains publication and deployment prerequisites.

## Install

```sh
npm install @0xintuition/cli@0.1.0
```

Use ESM imports.

## Main surface

| Export or operation                | Purpose                                |
| ---------------------------------- | -------------------------------------- |
| `intuition --help`                 | Discover executable commands           |
| `AgentActionEnvelope`              | Structured plan contract               |
| `buildMultiVaultDepositPlan`       | Deterministic deposit plan builder     |
| `buildMultiVaultCreateAndSeedPlan` | Deterministic create/seed plan builder |

## First use

```sh
npx @0xintuition/cli@0.1.0 --help
```

Start with encoder discovery before constructing an action envelope. The command does not sign or send transactions.

## Integration decisions

The CLI owns no wallet/public client, simulation, or submission. A plan still requires deployment compatibility checks, simulation where supported, authorization, and an external executor.

## Source and full contract

[Source and package guide](https://github.com/0xIntuition/packages/tree/1dc7103d2a05f23bc565a81df4b001336ce9ba53/packages/cli) · [npm package](https://www.npmjs.com/package/@0xintuition/cli). The [machine-readable manifest](/intuition-release.json) lists all declared public subpaths and peer dependencies. Npm links name the intended package; this page does not assert that the candidate has been published.
