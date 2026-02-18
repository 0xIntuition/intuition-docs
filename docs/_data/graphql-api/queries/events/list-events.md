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
    block_timestamp
    transaction_hash
    atom_id
    triple_id
    sender_id
    receiver_id
    data
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
| `type` | `String` | Event type |
| `block_number` | `Int` | Block number |
| `block_timestamp` | `DateTime` | Block timestamp |
| `transaction_hash` | `String` | Transaction hash |
| `atom_id` | `String` | Related atom ID (if applicable) |
| `triple_id` | `String` | Related triple ID (if applicable) |
| `sender_id` | `String` | Sender address |
| `receiver_id` | `String` | Receiver address |
| `data` | `JSON` | Event-specific data |

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
    block_timestamp
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
    sender_id
    block_timestamp
    data
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
    sender_id
    atom_id
    triple_id
    data
    block_timestamp
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
          block_timestamp: { _gte: $start, _lte: $end }
          ${eventType ? 'type: { _eq: $type }' : ''}
        }
        order_by: { block_timestamp: asc }
      ) {
        id
        type
        block_timestamp
        data
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
        sender_id
        data
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

### By Address

```graphql
# Events from specific sender
events(where: { sender_id: { _eq: "0x..." } })
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
