---
title: Signals Queries
sidebar_label: Overview
sidebar_position: 1
description: Query deposit and redemption signals with rich context
keywords: [graphql, signals, deposits, redemptions, activity]
---

# Signals Queries

Signals represent deposit and redemption events in the Intuition protocol. Unlike raw blockchain events, signals include enriched context such as account labels, atom metadata, and related positions.

## Available Queries

| Query | Description |
|-------|-------------|
| [`signals`](./list-signals) | Query signals with filtering and pagination |
| [`signals_aggregate`](./aggregate-signals) | Aggregate statistics for signals |
| [`signals_from_following`](./signals-from-following) | Query signals from followed accounts |

## What Are Signals?

Signals are contextual representations of position changes:

- **Deposits**: When an account stakes ETH on an atom or triple
- **Redemptions**: When an account withdraws from a position

Each signal includes:
- The account that made the action
- The target atom or triple
- Amount and shares involved
- Timestamp and block information
- Full context of related entities

## Quick Start

```typescript
import { GraphQLClient } from 'graphql-request'
import { API_URL_PROD } from '@0xintuition/graphql'

const client = new GraphQLClient(API_URL_PROD)

// Get recent signals
const query = `
  query GetSignals($limit: Int!) {
    signals(limit: $limit, order_by: { block_timestamp: desc }) {
      id
      signal_type
      delta
      account {
        label
        image
      }
      atom {
        label
      }
      block_timestamp
    }
  }
`

const data = await client.request(query, { limit: 20 })
```

## Signal Types

| Type | Description |
|------|-------------|
| `Deposit` | Staking ETH on a position |
| `Redemption` | Withdrawing from a position |

## Common Filters

```graphql
# Filter by signal type
signals(where: { signal_type: { _eq: "Deposit" } })

# Filter by account
signals(where: { account_id: { _eq: "0x..." } })

# Filter by atom
signals(where: { atom_id: { _eq: "0x..." } })

# Filter by date range
signals(where: {
  block_timestamp: {
    _gte: "2024-01-01T00:00:00Z",
    _lte: "2024-01-31T23:59:59Z"
  }
})
```

## Related Documentation

- [List Signals](./list-signals) - Query signals with filters
- [Aggregate Signals](./aggregate-signals) - Signal statistics
- [Signals from Following](./signals-from-following) - Social signal feed
- [Activity Feed Example](/docs/graphql-api/examples/activity-feed) - Building activity feeds
