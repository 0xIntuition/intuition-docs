---
title: Templates
sidebar_label: Templates
sidebar_position: 7
description: Fork official Intuition starter templates for protocol exploration and production-style apps
keywords: [intuition templates, starter app, React, Next.js, Vite, GraphQL, SIWE]
---

# Templates

Our official templates give you working Intuition applications with protocol calls, wallet integration, and agent-readable project context already in place.

## Choose a Template

| Template | Best For | Stack | Repository |
| --- | --- | --- | --- |
| Basic Template | Learning protocol functions directly and exploring every operation as a form. | Vite, React, RainbowKit, wagmi, viem, Tailwind, shadcn/ui | [intuition-basic-template](https://github.com/0xIntuition/intuition-basic-template) |
| Advanced Template | Building a production-style app with server reads, wallet writes, and auth. | Next.js App Router, GraphQL, RainbowKit, wagmi, viem, SIWE, Tailwind | [intuition-advanced-template](https://github.com/0xIntuition/intuition-advanced-template) |

## Basic Template

Use the basic template when you want a small app that exposes protocol functions directly. It includes tabs for atoms, triples, deposits, redemptions, vault state, and protocol config.

```bash
git clone https://github.com/0xIntuition/intuition-basic-template.git
cd intuition-basic-template
bun install
cp .env.example .env
bun dev
```

The basic template is intentionally direct:

- Protocol calls go through `@0xintuition/protocol`.
- Wallet and chain state come from wagmi and RainbowKit.
- No GraphQL, indexer, server components, auth layer, or wrapper abstractions.
- Forms show the flow from wallet connection to protocol call to decoded onchain result.

Use it for quick tests or to understand how each protocol operation works before designing a larger app.

## Advanced Template

Use the advanced template when you want a realistic application pattern. It implements curated lists on the Intuition knowledge graph with GraphQL reads, protocol writes, and self-hosted *Sign-In with Ethereum* for authentication.

```bash
git clone https://github.com/0xIntuition/intuition-advanced-template.git
cd intuition-advanced-template
bun install
cp .env.example .env
bun dev
```

The advanced template includes:

- Next.js App Router pages and server components.
- Public Intuition testnet GraphQL reads by default.
- Protocol writes through `@0xintuition/protocol`.
- Curated list browsing, item creation, and staking flows.
- Self-hosted SIWE auth through local API routes.

Use it when your app needs both knowledge graph reads and wallet-based writes.

## Agent-Ready Project Context

Both templates are written to be used with AI coding agents. Their READMEs include file maps, code paths, protocol constraints, and suggested prompts. Agent rules live in `.agents/INSTRUCTIONS.md` and are symlinked to `CLAUDE.md`, `CODEX.md`, and `AGENTS.md` through agentsync.

After a fresh clone, run the template's agentsync command if the symlinks need to be recreated:

```bash
bun run agents:apply
```

Before asking an agent to change protocol behavior, we suggest installing the [AI skills](/docs/getting-started/ai-skills) so it has the canonical Intuition contract context.

## Next Steps

- [Learn Intuition](/docs/getting-started/learn-intuition) - run the course before using a template.
- [SDK Quick Start](/docs/intuition-sdk/quick-start) - understand the SDK surface.
- [Protocol Overview](/docs/protocol/getting-started/overview) - inspect lower-level contract integration docs.
- [GraphQL Client Setup](/docs/graphql-api/getting-started/client-setup) - add read queries to your app.
