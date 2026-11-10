---
title: Intuition developer documentation
sidebar_label: Introduction
sidebar_position: 0
description: Build with Intuition V2 using shared identities, relationships, and on-chain signals.
---

Intuition lets applications describe entities, connect them through shared relationships, and record what people trust. Its packages, APIs, and protocol give developers common building blocks for knowledge graphs, discovery tools, reputation systems, and AI applications.

An **atom** identifies an entity. A **triple** connects a subject, predicate, and object. A **signal** expresses an economic position on a term through the protocol. Applications choose how to display, evaluate, and use that information.

## Start building with Intuition V2

[Build with Intuition](./build/overview.md) introduces the concepts through working code. Begin with [your first atom](./build/guides/first-atom.md), then [build a music catalog](./build/guides/music-catalog.md) that combines identities, classifications, and relationships. Both run locally before you connect any service.

| Find what you need                                       | What is inside                                                                |
| -------------------------------------------------------- | ----------------------------------------------------------------------------- |
| [Build with Intuition](./build/overview.md)              | Tutorials that connect concepts into application workflows                    |
| [Packages](./build/packages/index.md)                    | Libraries grouped by task, installation instructions, examples, and npm links |
| [API reference](./build/sdk-reference/index.md)          | SDK function signatures, inputs, return types, and effects                    |
| [GraphQL API](./graphql-api/overview.mdx)                 | Queries for indexed atoms, triples, vaults, and activity                      |
| [Network quick starts](./quick-start/network-details.md) | Networks, RPC endpoints, deployments, and test tokens                         |

The Intuition V2 developer experience uses independently versioned npm packages. The guides specify exact alpha releases; [versions and compatibility](./build/compatibility.md) explains which packages and environments work together.

## Explore the platform

The [Intuition Network](./intuition-network/index.md) hosts the protocol. [Smart contracts](./intuition-smart-contracts/index.md) manage terms, vaults, and positions. APIs expose indexed graph data, while local libraries help you create consistent identities and relationships in your own application.

For a guided course, starter application, or coding-agent setup, see [developer resources](./getting-started/developer-resources.md). For conceptual background, explore [atoms, triples, and signals](./intuition-concepts/primitives/index.md). Existing applications can follow the [upgrade guide](./build/migration.md).
