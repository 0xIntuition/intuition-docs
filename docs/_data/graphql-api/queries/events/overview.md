---
title: Events Queries
sidebar_label: Overview
sidebar_position: 1
description: Query raw blockchain events from the Intuition protocol
keywords: [graphql, events, blockchain, transactions, logs]
---

# Events Queries

Query raw blockchain events emitted by the Intuition protocol contracts. Events provide low-level access to all protocol interactions.

## Available Queries

| Query | Description |
|-------|-------------|
| [`events`](./list-events) | Query events with filtering and pagination |
| [`events_aggregate`](./aggregate-events) | Aggregate statistics for events |

## What Are Events?

Events are blockchain log entries emitted by smart contracts. The Intuition indexer captures:

- **AtomCreated**: New atoms minted
- **TripleCreated**: New triples created
- **Deposited**: ETH staked on positions
- **Redeemed**: ETH withdrawn from positions
- **FeesTransferred**: Protocol fees collected

## Quick Start

```typescript
import { GraphQLClient } from 'graphql-request'
import { API_URL_PROD } from '@0xintuition/graphql'

const client = new GraphQLClient(API_URL_PROD)

// Get recent events
const query = `
  query GetEvents($limit: Int!) {
    events(
      order_by: { block_number: desc }
      limit: $limit
    ) {
      id
      type
      block_number
      block_timestamp
      transaction_hash
      data
    }
  }
`

const data = await client.request(query, { limit: 20 })
```

## Event Types

| Type | Description |
|------|-------------|
| `AtomCreated` | Atom minted on-chain |
| `TripleCreated` | Triple created |
| `Deposited` | Stake deposited |
| `Redeemed` | Stake withdrawn |
| `FeesTransferred` | Fees sent to protocol |

## Events vs Signals

| Aspect | Events | Signals |
|--------|--------|---------|
| Level | Raw blockchain logs | Enriched data |
| Context | Minimal | Full account/atom details |
| Use case | Analytics, debugging | User-facing features |

## Related Documentation

- [List Events](./list-events) - Query events with filters
- [Aggregate Events](./aggregate-events) - Event statistics
- [Signals](/docs/graphql-api/queries/signals/overview) - Enriched event data
