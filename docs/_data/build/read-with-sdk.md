---
title: The SDK read client
sidebar_label: The SDK read client
description: Understand which V1 endpoints the pinned SDK read client calls and use Core for indexed V2 reads.
kind: reference
reader: ["app"]
packages: ["@0xintuition/sdk"]
---

<AppliesTo />

For indexed V2 reads, run a Core node and use its [Query API](/docs/build/query-core). The pinned SDK read client calls the hosted V1 GraphQL API and is not a V2 read path.

There is no V2 GraphQL endpoint yet; one is planned for Intuition Core. The V1 GraphQL API is documented in the [V1 docs](/docs/v1/graphql-api/overview).

## Endpoint mapping

`getIntuitionApiUrl('mainnet' | 'testnet')` selects these V1 endpoints:

| Selection | Endpoint |
| --- | --- |
| `mainnet` | `https://mainnet.intuition.sh/v1/graphql` |
| `testnet` | `https://testnet.intuition.sh/v1/graphql` |

The `@0xintuition/sdk/api` client remains part of the pinned package's public exports. Its endpoint mapping does not change when you start Core, whose Query API has a separate HTTP contract. V1 endpoints remain supported through the V1 documentation.

## Scope

The client exposes atom lookups by ID, label, or data and triple lookup by ID. It is not a general search, traversal, or write API. A label is not a unique identity. Missing rows return `null`; HTTP and GraphQL failures throw. See the [generated API reference](/docs/reference/sdk/api) for the exported types and signatures.

Source: [SDK endpoint constants and client interface](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/sdk/src/api/index.ts). This page describes that pinned implementation; it does not promise a future endpoint migration.
