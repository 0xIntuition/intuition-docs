---
title: Choose Your Path
sidebar_label: Choose Your Path
sidebar_position: 3
description: Find the best way to get started with Intuition based on your goals
---

# Choose Your Path

Not sure where to start? Pick the path that matches your goal.

## I Want to...

### Build a Frontend App (Most Common)

**Use the SDK** - High-level TypeScript SDK with React hooks.

- Best for: Web apps, dashboards, social platforms
- Abstracts complexity
- React integration ready
- **Start here:** [SDK Quick Start](/docs/guides/developer-tools/sdk/getting-started/quick-start)

### Query Data Only (No Writes)

**Use GraphQL API** - Read-only queries for the knowledge graph.

- Best for: Analytics, dashboards, data visualization
- No wallet needed for reads
- Powerful filtering and aggregation
- **Start here:** [GraphQL Setup](/docs/guides/developer-tools/graphql-api/getting-started/client-setup)

### Build Smart Contract Integration

**Use Protocol Package** - Low-level contract interactions.

- Best for: Other smart contracts, custom logic, gas optimization
- Direct contract calls
- Full control
- **Start here:** [Protocol Configuration](/docs/guides/developer-tools/protocol/getting-started/configuration)

### Understand the System First

**Read Concepts** - Learn how Intuition works.

- Atoms, Triples, Signals
- Economics and incentives
- Architecture
- **Start here:** [Primitives Overview](/docs/guides/core-concepts/primitives/overview)

### See Complete Examples

**Follow Tutorials** - Build real applications step-by-step.

- Reputation system
- Curated lists
- Social attestations
- **Start here:** [Tutorials](/docs/guides/tutorials/overview)

## Decision Tree

```mermaid
graph TD
    A[What are you building?] --> B[Web Application]
    A --> C[Smart Contract]
    A --> D[Data Analysis]
    A --> E[Just Learning]

    B --> F[Use SDK]
    C --> G[Use Protocol Package]
    D --> H[Use GraphQL API]
    E --> I[Read Concepts]

    F --> J[SDK Quick Start]
    G --> K[Protocol Setup]
    H --> L[GraphQL Setup]
    I --> M[Primitives Overview]
```

## Comparison Table

| Goal | Tool | Complexity | Best For |
|------|------|-----------|----------|
| Build web app | SDK | Low | Frontend developers |
| Query data | GraphQL | Low | Analytics, read-only |
| Contract integration | Protocol | High | Solidity developers |
| Learn system | Concepts | N/A | Everyone |

## Still Unsure?

Join our [Discord](https://discord.gg/intuition) and ask the community!

## Next Steps

Once you've chosen your path:

1. Follow the quick start guide for your chosen tool
2. Read through the [Core Concepts](/docs/guides/core-concepts/primitives/overview)
3. Try a [Tutorial](/docs/guides/tutorials/overview)
4. Join the [Community](/docs/guides/resources/community-and-support)
