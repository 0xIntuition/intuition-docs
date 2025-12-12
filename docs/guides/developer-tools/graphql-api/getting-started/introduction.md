---
title: Introduction
sidebar_label: Introduction
sidebar_position: 1
description: Introduction to the Intuition GraphQL API and its capabilities
keywords: [graphql, api, intuition, introduction, endpoints]
---

# GraphQL API Introduction

The Intuition GraphQL API provides comprehensive access to the Intuition knowledge graph, including atoms (entities), triples (relationships), vaults (asset pools), and user positions. The API is powered by Hasura and offers rich querying capabilities with filtering, sorting, pagination, and aggregations.

## Public Endpoints

No authentication required to access the GraphQL API:

- **Mainnet**: `https://mainnet.intuition.sh/v1/graphql`
- **Testnet**: `https://testnet.intuition.sh/v1/graphql`

## Interactive Explorers

Explore the API interactively with Apollo Studio Sandbox:

- [Mainnet Explorer](https://studio.apollographql.com/sandbox/explorer?endpoint=https%3A%2F%2Fmainnet.intuition.sh%2Fv1%2Fgraphql)
- [Testnet Explorer](https://studio.apollographql.com/sandbox/explorer?endpoint=https%3A%2F%2Ftestnet.intuition.sh%2Fv1%2Fgraphql)

## Core Concepts

### Atoms

**Atoms** are the fundamental entities in the Intuition knowledge graph. Each atom represents an identity, concept, or piece of data (e.g., a person, organization, tag, or blockchain address).

### Triples

**Triples** are statements that connect atoms in subject-predicate-object relationships. For example: `(Alice, knows, Bob)` or `(Document, hasTag, TypeScript)`.

### Vaults

**Vaults** are asset pools associated with atoms and triples. Users deposit assets into vaults and receive shares based on bonding curves.

### Positions

**Positions** represent user ownership (shares) in vaults. Each position tracks an account's shares in a specific vault.

### Accounts

**Accounts** are blockchain addresses participating in the protocol, including:
- User wallets
- Atom wallets (smart contract wallets for atoms)
- Protocol vaults

### Deposits & Redemptions

**Deposits** are transactions where users add assets to vaults and receive shares. **Redemptions** are the reverse: users burn shares to withdraw assets.

### Events

**Events** capture the complete on-chain event history, including deposits, redemptions, atom creation, triple creation, and more.

### Stats

**Stats** provide protocol-wide statistics and aggregated metrics.

## Key Features

The Hasura-powered GraphQL schema provides:

### Powerful Filtering

Use boolean expressions to filter results with operators like `_eq`, `_neq`, `_gt`, `_gte`, `_lt`, `_lte`, `_in`, `_nin`, `_like`, `_ilike`, `_is_null`, `_and`, `_or`, and `_not`.

### Flexible Sorting

Sort results by multiple fields in ascending or descending order using the `order_by` parameter.

### Pagination

Efficiently paginate through large result sets using `limit` and `offset` parameters.

### Aggregations

Compute statistics like count, sum, average, min, max, standard deviation, and variance without fetching all nodes.

### Relationships

Navigate the knowledge graph through nested queries that follow relationships between atoms, triples, vaults, and positions.

### Primary Key Lookups

Directly fetch individual records by primary key for optimal performance.

### Real-time Subscriptions

Subscribe to real-time updates using cursor-based streaming for live data feeds.

### Database Functions

Leverage backend functions for complex queries like social graph traversal, semantic search, and position filtering.

## Use Cases

The GraphQL API enables a wide range of applications:

- **Knowledge Graph Exploration**: Discover atoms, triples, and their relationships
- **Social Feed Building**: Track positions and activities from followed accounts
- **Analytics Dashboards**: Analyze trends, volumes, and statistics over time
- **Position Monitoring**: Track user positions and vault performance
- **Search Interfaces**: Implement global search across accounts, atoms, and triples
- **Real-time Applications**: Build live dashboards with subscription-based updates

## Next Steps

- [Client Setup](/docs/guides/developer-tools/graphql-api/getting-started/client-setup) - Configure a GraphQL client in your preferred language
- [Schema Reference](/docs/guides/developer-tools/graphql-api/getting-started/schema-reference) - Learn about schema features and introspection
- [Query Patterns](/docs/guides/developer-tools/graphql-api/queries/atoms/single-atom) - Explore common query patterns

## Resources

- **GraphQL Official Docs**: https://graphql.org/learn/
- **Hasura GraphQL Docs**: https://hasura.io/docs/latest/queries/postgres/index/
- **Intuition Protocol Docs**: https://docs.intuition.systems
