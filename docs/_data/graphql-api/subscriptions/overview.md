---
title: Subscriptions Overview
sidebar_label: Overview
sidebar_position: 1
description: Real-time subscriptions with cursor-based streaming
keywords: [graphql, subscription, real-time, websocket, stream]
---

# Subscriptions Overview

The GraphQL API supports real-time subscriptions for live data updates using cursor-based streaming.

## Available Subscriptions

The following streaming subscriptions are available:

### Core Entity Streams

| Subscription | Description |
|--------------|-------------|
| `atoms_stream` | Stream new and updated atoms |
| `triples_stream` | Stream new and updated triples |
| `terms_stream` | Stream all term updates |
| `vaults_stream` | Stream vault changes |
| `positions_stream` | Stream position updates |
| `accounts_stream` | Stream account changes |

### Activity Streams

| Subscription | Description |
|--------------|-------------|
| `signals_stream` | Stream deposits and redemptions |
| `events_stream` | Stream raw blockchain events |
| `fee_transfers_stream` | Stream fee transfer events |

### Price & Stats Streams

| Subscription | Description |
|--------------|-------------|
| `share_price_changes_stream` | Stream vault price changes |
| `chainlink_prices_stream` | Stream oracle price updates |
| `stats_stream` | Stream protocol statistics |

### Social Streams

| Subscription | Description |
|--------------|-------------|
| `following_stream` | Stream following relationship changes |
| `signals_from_following_stream` | Stream activity from followed accounts |
| `positions_from_following_stream` | Stream positions from followed accounts |

### Statistics Streams

| Subscription | Description |
|--------------|-------------|
| `signal_stats_daily_stream` | Stream daily signal stats |
| `signal_stats_hourly_stream` | Stream hourly signal stats |
| `signal_stats_weekly_stream` | Stream weekly signal stats |
| `signal_stats_monthly_stream` | Stream monthly signal stats |

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

## Subscription Examples

### Real-Time Signals Feed

```graphql
subscription WatchSignals($batchSize: Int!) {
  signals_stream(
    cursor: { initial_value: { block_timestamp: "now()" } }
    batch_size: $batchSize
  ) {
    id
    account_id
    delta
    signal_type
    block_timestamp
    account {
      label
      image
    }
    term {
      atom { label }
      triple {
        subject { label }
        predicate { label }
        object { label }
      }
    }
  }
}
```

### Position Updates

```graphql
subscription WatchPositions($accountId: String!, $batchSize: Int!) {
  positions_stream(
    where: { account_id: { _eq: $accountId } }
    cursor: { initial_value: { updated_at: "now()" } }
    batch_size: $batchSize
  ) {
    id
    shares
    vault {
      term_id
      current_share_price
    }
  }
}
```

### Price Changes

```graphql
subscription WatchPrices($batchSize: Int!) {
  share_price_changes_stream(
    cursor: { initial_value: { block_timestamp: "now()" } }
    batch_size: $batchSize
  ) {
    vault_id
    new_share_price
    block_timestamp
    vault {
      term {
        atom { label }
      }
    }
  }
}
```

## WebSocket Connection

Connect to subscriptions via WebSocket:

```typescript
import { createClient } from 'graphql-ws';

const client = createClient({
  url: 'wss://mainnet.intuition.sh/v1/graphql',
});

// Subscribe to signals
const unsubscribe = client.subscribe(
  {
    query: `
      subscription WatchSignals {
        signals_stream(
          cursor: { initial_value: { block_timestamp: "now()" } }
          batch_size: 10
        ) {
          id
          delta
          signal_type
        }
      }
    `,
  },
  {
    next: (data) => console.log('Signal:', data),
    error: (err) => console.error('Error:', err),
    complete: () => console.log('Subscription complete'),
  }
);

// Later: unsubscribe()
```

### Apollo Client Setup

```typescript
import { ApolloClient, InMemoryCache, split, HttpLink } from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { getMainDefinition } from '@apollo/client/utilities';

const httpLink = new HttpLink({
  uri: 'https://mainnet.intuition.sh/v1/graphql',
});

const wsLink = new GraphQLWsLink(
  createClient({
    url: 'wss://mainnet.intuition.sh/v1/graphql',
  })
);

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink
);

const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});
```

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

## Best Practices

1. **Store last cursor** to resume after disconnection
2. **Use batch_size** to control data flow (10-50)
3. **Filter subscriptions** with where clauses
4. **Handle reconnections** gracefully
5. **Unsubscribe when done** to free resources

## Related

- [Price Updates](./price-updates) - Monitor price changes
- [Real-Time Positions](./real-time-positions) - Track position changes
- [Signal Queries](/docs/graphql-api/queries/signals/list-signals) - Query historical signals
