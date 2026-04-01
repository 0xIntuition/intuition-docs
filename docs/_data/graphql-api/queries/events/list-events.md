---
title: List Events
sidebar_label: List Events
sidebar_position: 2
description: Query raw blockchain events with filtering
keywords: [graphql, events, blockchain, list, filter]
---

import GraphQLPlaygroundCustom from '@site/src/components/GraphQLPlaygroundCustom';

# List Events

Query raw blockchain events with filtering, sorting, and pagination.

## Query Structure

```graphql
query GetEvents(
  $where: events_bool_exp
  $order_by: [events_order_by!]
  $limit: Int
  $offset: Int
) {
  events(
    where: $where
    order_by: $order_by
    limit: $limit
    offset: $offset
  ) {
    id
    type
    block_number
    created_at
    transaction_hash
    atom_id
    triple_id
  }
}
```

## Variables

```json
{
  "where": {
    "type": { "_eq": "AtomCreated" }
  },
  "order_by": [{ "block_number": "desc" }],
  "limit": 20
}
```

## Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | `String` | Unique event identifier |
| `type` | `event_type` | Event type (enum) |
| `block_number` | `numeric` | Block number |
| `created_at` | `timestamptz` | Event timestamp |
| `transaction_hash` | `String` | Transaction hash |
| `atom_id` | `String` | Related atom ID (if applicable) |
| `triple_id` | `String` | Related triple ID (if applicable) |

## Interactive Example

export const eventQueries = [
  {
    id: 'recent-events',
    title: 'Recent Events',
    query: `query GetEvents($limit: Int!) {
  events(
    order_by: { block_number: desc }
    limit: $limit
  ) {
    id
    type
    block_number
    created_at
    transaction_hash
  }
}`,
    variables: { limit: 10 }
  },
  {
    id: 'atom-created',
    title: 'Atom Created Events',
    query: `query GetAtomCreatedEvents($limit: Int!) {
  events(
    where: { type: { _eq: "AtomCreated" } }
    order_by: { block_number: desc }
    limit: $limit
  ) {
    id
    atom_id
    created_at
    transaction_hash
  }
}`,
    variables: { limit: 10 }
  },
  {
    id: 'deposits',
    title: 'Deposit Events',
    query: `query GetDepositEvents($limit: Int!) {
  events(
    where: { type: { _eq: "Deposited" } }
    order_by: { block_number: desc }
    limit: $limit
  ) {
    id
    atom_id
    triple_id
    created_at
    transaction_hash
  }
}`,
    variables: { limit: 10 }
  }
];

<GraphQLPlaygroundCustom queries={eventQueries} />

## Use Cases

### Analytics Dashboard

Track protocol activity over time:

```typescript
async function getEventsByDateRange(
  startDate: Date,
  endDate: Date,
  eventType?: string
) {
  const query = `
    query GetEventsByDate(
      $start: timestamptz!
      $end: timestamptz!
      $type: String
    ) {
      events(
        where: {
          created_at: { _gte: $start, _lte: $end }
          ${eventType ? 'type: { _eq: $type }' : ''}
        }
        order_by: { created_at: asc }
      ) {
        id
        type
        created_at
        transaction_hash
      }
    }
  `

  return client.request(query, {
    start: startDate.toISOString(),
    end: endDate.toISOString(),
    type: eventType
  })
}
```

### Transaction Explorer

Look up all events in a transaction:

```typescript
async function getTransactionEvents(txHash: string) {
  const query = `
    query GetTransactionEvents($tx: String!) {
      events(
        where: { transaction_hash: { _eq: $tx } }
        order_by: { id: asc }
      ) {
        id
        type
        atom_id
        triple_id
        transaction_hash
      }
    }
  `

  return client.request(query, { tx: txHash })
}
```

## Filtering Options

### By Event Type

```graphql
# Atom creations only
events(where: { type: { _eq: "AtomCreated" } })

# Multiple types
events(where: { type: { _in: ["Deposited", "Redeemed"] } })
```

### By Block Range

```graphql
events(where: {
  block_number: { _gte: 1000000, _lte: 1100000 }
})
```

## Best Practices

1. **Use specific filters** - Events table can be large
2. **Prefer signals** - For user-facing features, use enriched signals
3. **Paginate results** - Always limit event queries
4. **Cache analytics** - Event data is immutable

## Related

- [Aggregate Events](./aggregate-events) - Event statistics
- [Signals](/docs/graphql-api/queries/signals/overview) - Enriched event data
