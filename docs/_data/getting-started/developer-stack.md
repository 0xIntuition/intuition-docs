---
title: Developer Stack
sidebar_label: Developer Stack
sidebar_position: 2
description: Choose the right tool or resource for building with Intuition
keywords: [developer tools, sdk, protocol, graphql, smart contracts, templates, ai skills, learn intuition, getting started, comparison]
---


# Developer Tools

Choose the right tool for your use case.

## Guided Learning and Starter Apps

Use these resources when you are learning the protocol, starting a new app, or working with an AI coding agent.

### Learn Intuition

Interactive course that teaches atoms, triples, signals, protocol reads, protocol writes, and app building inside Claude Code.

**Use when:**
- You want a guided path through the protocol before building.
- You are onboarding yourself or an AI-assisted workflow.
- You want a course that ends with a template-based capstone.

**[Learn Intuition](/docs/getting-started/learn-intuition)**

### Templates

Official starter apps for direct protocol exploration and production-style application patterns.

**Use when:**
- You want a working app instead of a blank repository.
- You need wallet, protocol, GraphQL, or SIWE patterns already wired.
- You want agent-readable project context included from the start.

**[Templates](/docs/getting-started/templates)**

### AI Skills

Agent-facing protocol context for Claude Code, Codex, and compatible AI coding agents.

**Use when:**
- You are asking an agent to write or modify Intuition protocol code.
- You need canonical ABIs, addresses, value calculations, and unsigned transaction parameters.
- You want to reduce LLM mistakes around bytes32 IDs, batch-only creation, and bonding curves.

**[AI Skills](/docs/getting-started/ai-skills)**

## Core Building Surfaces

### SDK (Recommended for Most Developers)

High-level TypeScript SDK with React integration.

**Use when:**
- Building web applications
- Want simplicity and speed
- Need React hooks
- Prefer abstraction over low-level control

**[→ SDK Overview](/docs/intuition-sdk/quick-start)**

### Protocol Package

Low-level contract interactions for advanced use cases.

**Use when:**
- Integrating with other smart contracts
- Need maximum control and flexibility
- Optimizing gas costs
- Building on Solidity

**[→ Protocol Overview](/docs/protocol/getting-started/overview)**

### GraphQL API

Query the knowledge graph with GraphQL.

**Use when:**
- Read-only queries
- Building analytics dashboards
- Data visualization
- No wallet needed for reads

**[→ GraphQL Overview](/docs/graphql-api/overview)**

### Smart Contracts

Direct contract interactions and ABIs.

**Use when:**
- Building with Solidity
- Need contract addresses
- Verifying on-chain data
- Auditing contracts

**[→ Contracts Overview](/docs/intuition-smart-contracts)**

## Comparison

| Feature | SDK | Protocol | GraphQL | Contracts |
|---------|-----|----------|---------|-----------|
| Abstraction | High | Low | N/A | Lowest |
| React Hooks | ✅ Yes | ❌ No | ❌ No | ❌ No |
| TypeScript | ✅ Yes | ✅ Yes | ✅ Yes | Solidity |
| Writes | ✅ Yes | ✅ Yes | Limited | ✅ Yes |
| Reads | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes |
| Learning Curve | Easy | Medium | Easy | Hard |

## Still Unsure?

See [Choose Your Path](/docs/getting-started/choose-your-path) for a decision tree, or use the [Developer Resources](/docs/getting-started/developer-resources) index for courses, templates, and AI-agent resources.
