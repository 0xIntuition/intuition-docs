---
title: Where to Start
sidebar_label: Where to Start
sidebar_position: 1
description: Choose the right tool for building with Intuition
---

# Developer Tools

Choose the right tool for your use case.

## SDK (Recommended for Most Developers)

High-level TypeScript SDK with React integration.

**Use when:**
- Building web applications
- Want simplicity and speed
- Need React hooks
- Prefer abstraction over low-level control

**[→ SDK Overview](/docs/guides/developer-tools/sdk/getting-started/quick-start)**

## Protocol Package

Low-level contract interactions for advanced use cases.

**Use when:**
- Integrating with other smart contracts
- Need maximum control and flexibility
- Optimizing gas costs
- Building on Solidity

**[→ Protocol Overview](/docs/guides/developer-tools/protocol/getting-started/overview)**

## GraphQL API

Query the knowledge graph with GraphQL.

**Use when:**
- Read-only queries
- Building analytics dashboards
- Data visualization
- No wallet needed for reads

**[→ GraphQL Overview](/docs/guides/developer-tools/graphql-api/overview)**

## Smart Contracts

Direct contract interactions and ABIs.

**Use when:**
- Building with Solidity
- Need contract addresses
- Verifying on-chain data
- Auditing contracts

**[→ Contracts Overview](/docs/guides/developer-tools/contracts/overview)**

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

See [Choose Your Path](/docs/getting-started/choose-your-path) for a decision tree.
