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

The API provides streaming subscriptions for all major entities:

### Core Entity Streams

| Subscription | Description |
|--------------|-------------|
| `atoms_stream` | New and updated atoms |
| `triples_stream` | New and updated triples |
| `accounts_stream` | Account updates |
| `positions_stream` | Position changes |
| `vaults_stream` | Vault updates |

### Activity Streams

| Subscription | Description |
|--------------|-------------|
| `signals_stream` | Real-time deposits and redemptions |
| `events_stream` | Raw blockchain events |
| `deposits_stream` | Deposit events |
| `redemptions_stream` | Redemption events |

### Price & Stats Streams

| Subscription | Description |
|--------------|-------------|
| `share_price_changes_stream` | Share price updates |
| `chainlink_prices_stream` | Oracle price updates |
| `fee_transfers_stream` | Protocol fee transfers |
| `stats_stream` | Protocol statistics updates |

### Social Streams

| Subscription | Description |
|--------------|-------------|
| `following_stream` | Following relationship changes |

## WebSocket Connection

Connect using a WebSocket client:

```typescript
import { createClient } from 'graphql-ws'

const client = createClient({
  url: 'wss://mainnet.intuition.sh/v1/graphql',
})

// Subscribe to signals
const unsubscribe = client.subscribe(
  {
    query: `
      subscription WatchSignals($cursor: [signals_stream_cursor_input]!) {
        signals_stream(cursor: $cursor, batch_size: 10) {
          id
          signal_type
          delta
          account {
            label
          }
          atom {
            label
          }
          block_timestamp
        }
      }
    `,
    variables: {
      cursor: [{
        initial_value: { block_timestamp: new Date().toISOString() },
        ordering: 'ASC'
      }]
    }
  },
  {
    next: (data) => {
      console.log('New signal:', data)
    },
    error: (error) => {
      console.error('Subscription error:', error)
    },
    complete: () => {
      console.log('Subscription complete')
    }
  }
)
```

## Example: Live Activity Feed

```typescript
import { createClient } from 'graphql-ws'

const client = createClient({
  url: 'wss://mainnet.intuition.sh/v1/graphql',
})

function createActivityFeed(onSignal: (signal: Signal) => void) {
  return client.subscribe(
    {
      query: `
        subscription LiveActivityFeed($cursor: [signals_stream_cursor_input]!) {
          signals_stream(cursor: $cursor, batch_size: 5) {
            id
            signal_type
            delta
            account {
              label
              image
            }
            atom {
              label
              image
            }
            triple {
              subject { label }
              predicate { label }
              object { label }
            }
            block_timestamp
          }
        }
      `,
      variables: {
        cursor: [{
          initial_value: { block_timestamp: new Date().toISOString() },
          ordering: 'ASC'
        }]
      }
    },
    {
      next: (result) => {
        const signals = result.data?.signals_stream || []
        signals.forEach(onSignal)
      },
      error: console.error
    }
  )
}
```

## Example: Position Price Alerts

```typescript
function watchPositionPrices(
  vaultId: string,
  onPriceChange: (price: string) => void
) {
  return client.subscribe(
    {
      query: `
        subscription WatchVaultPrice(
          $vault_id: String!
          $cursor: [share_price_changes_stream_cursor_input]!
        ) {
          share_price_changes_stream(
            cursor: $cursor
            batch_size: 1
            where: { vault_id: { _eq: $vault_id } }
          ) {
            new_share_price
            block_timestamp
          }
        }
      `,
      variables: {
        vault_id: vaultId,
        cursor: [{
          initial_value: { block_timestamp: new Date().toISOString() },
          ordering: 'ASC'
        }]
      }
    },
    {
      next: (result) => {
        const changes = result.data?.share_price_changes_stream || []
        changes.forEach(change => onPriceChange(change.new_share_price))
      }
    }
  )
}
```

## Best Practices

1. **Store last cursor** to resume after disconnection
2. **Use batch_size** to control data flow (10-50)
3. **Filter subscriptions** with where clauses
4. **Handle reconnections** gracefully
5. **Implement exponential backoff** for reconnection attempts
6. **Clean up subscriptions** when components unmount

## Related

- [Real-time Positions](/docs/graphql-api/subscriptions/real-time-positions) - Position updates
- [Price Updates](/docs/graphql-api/subscriptions/price-updates) - Price streaming
- [Subscriptions vs Polling](/docs/graphql-api/best-practices/subscriptions-vs-polling) - When to use each
