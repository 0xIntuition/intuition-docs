---
title: Developer Stack
sidebar_label: Developer Stack
sidebar_position: 2
description: Choose the right tool for building with Intuition
keywords: [developer tools, sdk, protocol, graphql, smart contracts, getting started, comparison]
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

**[→ SDK Overview](/docs/intuition-sdk/quick-start)**

## Protocol Package

Low-level contract interactions for advanced use cases.

**Use when:**
- Integrating with other smart contracts
- Need maximum control and flexibility
- Optimizing gas costs
- Building on Solidity

**[→ Protocol Overview](/docs/protocol/getting-started/overview)**

## GraphQL API

Query the knowledge graph with GraphQL.

**Use when:**
- Read-only queries
- Building analytics dashboards
- Data visualization
- No wallet needed for reads

**[→ GraphQL Overview](/docs/graphql-api/overview)**

## Smart Contracts

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

See [Choose Your Path](/docs/getting-started/choose-your-path) for a decision tree.
