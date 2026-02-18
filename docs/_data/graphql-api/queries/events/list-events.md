---
title: List Events
sidebar_label: List Events
sidebar_position: 1
description: Query raw blockchain events
keywords: [graphql, events, blockchain, transactions, query]
---

import GraphQLPlaygroundCustom from '@site/src/components/GraphQLPlaygroundCustom';

# List Events Query

Query raw blockchain events from the Intuition protocol. Events represent on-chain transactions and state changes.

## Query Structure

```graphql
query GetEvents(
  $where: events_bool_exp
  $orderBy: [events_order_by!]
  $limit: Int
  $offset: Int
) {
  events(
    where: $where
    order_by: $orderBy
    limit: $limit
    offset: $offset
  ) {
    id
    event_type
    block_number
    block_timestamp
    transaction_hash
    atom_id
    triple_id
    sender_id
    receiver_id
    sender {
      id
      label
    }
    receiver {
      id
      label
    }
    atom {
      id
      label
    }
    triple {
      subject { label }
      predicate { label }
      object { label }
    }
  }
}
```

## Variables

```json
{
  "where": {
    "event_type": { "_eq": "AtomCreated" }
  },
  "orderBy": [{ "block_timestamp": "desc" }],
  "limit": 50,
  "offset": 0
}
```

## Event Types

| Event Type | Description |
|------------|-------------|
| `AtomCreated` | New atom created |
| `TripleCreated` | New triple created |
| `Deposited` | Deposit into vault |
| `Redeemed` | Redemption from vault |
| `FeesTransferred` | Protocol fees transferred |

## Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | String | Event identifier |
| `event_type` | String | Type of event |
| `block_number` | Int | Block number |
| `block_timestamp` | String | Event timestamp |
| `transaction_hash` | String | Transaction hash |
| `atom_id` | String | Related atom (if applicable) |
| `triple_id` | String | Related triple (if applicable) |
| `sender_id` | String | Sender address |
| `receiver_id` | String | Receiver address |

## Interactive Example

export const eventQueries = [
  {
    id: 'list-events',
    title: 'List Recent Events',
    query: `query GetEvents($limit: Int!) {
  events(
    order_by: { block_timestamp: desc }
    limit: $limit
  ) {
    id
    event_type
    block_timestamp
    transaction_hash
    sender {
      label
    }
    atom {
      label
    }
  }
}`,
    variables: {
      limit: 20
    }
  }
];

<GraphQLPlaygroundCustom queries={eventQueries} />

## Use Cases

### Protocol Activity Monitor

```typescript
import { useQuery, gql } from '@apollo/client';

const GET_RECENT_EVENTS = gql`
  query GetRecentEvents($limit: Int!) {
    events(
      order_by: { block_timestamp: desc }
      limit: $limit
    ) {
      id
      event_type
      block_timestamp
      transaction_hash
      sender { id label }
      atom { label }
      triple {
        subject { label }
        predicate { label }
        object { label }
      }
    }
  }
`;

function ActivityMonitor() {
  const { data } = useQuery(GET_RECENT_EVENTS, {
    variables: { limit: 50 },
    pollInterval: 5000
  });

  return (
    <div>
      <h2>Recent Protocol Activity</h2>
      {data?.events.map(event => (
        <div key={event.id}>
          <span className="font-mono">{event.event_type}</span>
          <span>{event.sender?.label}</span>
          {event.atom && <span>on {event.atom.label}</span>}
          <a href={`https://basescan.org/tx/${event.transaction_hash}`}>
            View tx
          </a>
        </div>
      ))}
    </div>
  );
}
```

### Filter by Event Type

```graphql
query GetAtomCreations {
  events(
    where: { event_type: { _eq: "AtomCreated" } }
    order_by: { block_timestamp: desc }
    limit: 100
  ) {
    id
    block_timestamp
    atom {
      id
      label
      type
    }
    sender {
      label
    }
  }
}
```

### Events for Specific Account

```graphql
query GetAccountEvents($accountId: String!) {
  events(
    where: {
      _or: [
        { sender_id: { _eq: $accountId } },
        { receiver_id: { _eq: $accountId } }
      ]
    }
    order_by: { block_timestamp: desc }
    limit: 100
  ) {
    id
    event_type
    block_timestamp
    transaction_hash
  }
}
```

## Best Practices

1. **Use filters** - Events table can be large; always filter
2. **Order by timestamp** - Most recent events first
3. **Include relationships** - Fetch sender/atom/triple for context
4. **Link to explorer** - Provide transaction hash links

## Related

- [Fee Transfers](./fee-transfers) - Protocol fee events
- [Signals](/docs/graphql-api/queries/signals/list-signals) - Higher-level deposit/redemption data
