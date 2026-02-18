---
title: Subscriptions Overview
sidebar_label: Overview
sidebar_position: 1
description: Real-time subscriptions with cursor-based streaming
keywords: [graphql, subscription, real-time, websocket, stream]
---

# Subscriptions Overview

The GraphQL API supports real-time subscriptions for live data updates using cursor-based streaming.

## Basic Subscription Pattern

```graphql
subscription WatchAtoms(
  $cursor: [atoms_stream_cursor_input]!
  $batchSize: Int!
) {
  atoms_stream(
    cursor: $cursor
    batch_size: $batchSize
  ) {
    term_id
    label
    created_at
  }
}
```

## Variables

```json
{
  "cursor": [{
    "initial_value": { "created_at": "2024-01-01T00:00:00Z" },
    "ordering": "ASC"
  }],
  "batchSize": 10
}
```

## Cursor Configuration

- **initial_value**: Starting point for the stream
- **ordering**: Sort direction (ASC or DESC)
- **batch_size**: Number of items per batch

## When to Use Subscriptions

**Use subscriptions when:**
- Building real-time dashboards
- Monitoring live protocol activity
- Creating notification systems
- Data changes frequently

**Use polling when:**
- Data updates infrequently
- Real-time updates aren't critical
- Minimizing server connections

## Available Streaming Subscriptions

All query tables have corresponding streaming subscriptions. Here's the complete list:

### Core Entity Streams

| Subscription | Description |
|--------------|-------------|
| `accounts_stream` | Account updates |
| `atoms_stream` | New and updated atoms |
| `atom_values_stream` | Atom value changes |
| `terms_stream` | Term updates |
| `triples_stream` | Triple updates |
| `vaults_stream` | Vault state changes |
| `positions_stream` | Position changes |
| `signals_stream` | New signals (deposits/redemptions) |
| `deposits_stream` | Deposit transactions |
| `redemptions_stream` | Redemption transactions |
| `events_stream` | Blockchain events |
| `fee_transfers_stream` | Fee transfer events |

### Value Object Streams

| Subscription | Description |
|--------------|-------------|
| `things_stream` | Thing entity updates |
| `persons_stream` | Person entity updates |
| `organizations_stream` | Organization updates |
| `books_stream` | Book entity updates |
| `json_objects_stream` | JSON object updates |
| `text_objects_stream` | Text object updates |
| `byte_object_stream` | Binary object updates |

### Analytics Streams

| Subscription | Description |
|--------------|-------------|
| `stats_stream` | Protocol statistics |
| `share_price_changes_stream` | Share price changes |
| `share_price_change_stats_daily_stream` | Daily price stats |
| `share_price_change_stats_hourly_stream` | Hourly price stats |
| `signal_stats_daily_stream` | Daily signal stats |
| `signal_stats_hourly_stream` | Hourly signal stats |
| `term_total_state_change_stats_daily_stream` | Daily term state changes |
| `chainlink_prices_stream` | Chainlink price updates |

### Relationship Streams

| Subscription | Description |
|--------------|-------------|
| `following_stream` | Following relationship changes |
| `predicate_objects_stream` | Predicate-object updates |
| `triple_term_stream` | Triple-term mappings |
| `triple_vault_stream` | Triple-vault mappings |
| `cached_images_stream` | Cached image updates |

## Subscription Examples

### Watch New Signals

```graphql
subscription WatchSignals(
  $cursor: [signals_stream_cursor_input]!
  $batchSize: Int!
) {
  signals_stream(
    cursor: $cursor
    batch_size: $batchSize
  ) {
    id
    delta
    account { label }
    atom { label }
    block_timestamp
  }
}
```

### Watch Position Changes

```graphql
subscription WatchPositions(
  $cursor: [positions_stream_cursor_input]!
  $accountId: String!
  $batchSize: Int!
) {
  positions_stream(
    cursor: $cursor
    batch_size: $batchSize
    where: { account_id: { _eq: $accountId } }
  ) {
    id
    shares
    vault {
      term {
        atom { label }
      }
    }
    updated_at
  }
}
```

### Watch Share Price Changes

```graphql
subscription WatchPrices(
  $cursor: [share_price_changes_stream_cursor_input]!
  $termId: String!
  $batchSize: Int!
) {
  share_price_changes_stream(
    cursor: $cursor
    batch_size: $batchSize
    where: { term_id: { _eq: $termId } }
  ) {
    id
    share_price
    block_timestamp
  }
}
```

## Connection Setup

### WebSocket URL

```text
wss://mainnet.intuition.sh/v1/graphql
wss://testnet.intuition.sh/v1/graphql
```

### Apollo Client Setup

```typescript
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { createClient } from 'graphql-ws'

const wsLink = new GraphQLWsLink(
  createClient({
    url: 'wss://mainnet.intuition.sh/v1/graphql',
    connectionParams: {
      // Add any required headers
    },
    retryAttempts: 5,
    shouldRetry: () => true
  })
)
```

## Best Practices

1. **Store last cursor** to resume after disconnection
2. **Use batch_size** to control data flow (10-50)
3. **Filter subscriptions** with where clauses
4. **Handle reconnections** gracefully
5. **Unsubscribe when components unmount**
6. **Use appropriate cursor ordering** (ASC for historical catch-up, DESC for latest first)
