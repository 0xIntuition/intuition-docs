---
title: List Signals
sidebar_label: List Signals
sidebar_position: 1
description: Query signals (deposits and redemptions) with filtering
keywords: [graphql, signals, deposit, redemption, query, filter]
---

import GraphQLPlaygroundCustom from '@site/src/components/GraphQLPlaygroundCustom';

# List Signals Query

Query signals in the Intuition protocol. Signals represent deposit and redemption events on atoms and triples.

## Query Structure

```graphql
query GetSignals(
  $where: signals_bool_exp
  $orderBy: [signals_order_by!]
  $limit: Int
  $offset: Int
) {
  signals(
    where: $where
    order_by: $orderBy
    limit: $limit
    offset: $offset
  ) {
    id
    account_id
    term_id
    delta
    signal_type
    block_number
    block_timestamp
    transaction_hash
    account {
      id
      label
      image
    }
    term {
      atom {
        id
        label
        image
      }
      triple {
        subject { label }
        predicate { label }
        object { label }
      }
    }
  }
}
```

## Variables

```json
{
  "where": {
    "signal_type": { "_eq": "deposit" }
  },
  "orderBy": [{ "block_timestamp": "desc" }],
  "limit": 20,
  "offset": 0
}
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `where` | signals_bool_exp | Filter conditions |
| `order_by` | [signals_order_by!] | Sort order |
| `limit` | Int | Maximum results to return |
| `offset` | Int | Number of results to skip |

## Filter Options

| Field | Type | Description |
|-------|------|-------------|
| `account_id` | String | Filter by account address |
| `term_id` | String | Filter by term (atom/triple) |
| `signal_type` | String | `deposit` or `redemption` |
| `block_timestamp` | timestamp | Filter by time |
| `delta` | numeric | Filter by amount |

## Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | String | Signal unique identifier |
| `account_id` | String | Account that made the signal |
| `term_id` | String | Term (atom/triple) being signaled on |
| `delta` | String | Amount deposited/redeemed (in wei) |
| `signal_type` | String | `deposit` or `redemption` |
| `block_number` | Int | Block number of transaction |
| `block_timestamp` | String | Timestamp of signal |
| `transaction_hash` | String | Transaction hash |

## Interactive Example

export const signalQueries = [
  {
    id: 'list-signals',
    title: 'List Recent Signals',
    query: `query GetSignals($limit: Int!) {
  signals(
    order_by: { block_timestamp: desc }
    limit: $limit
  ) {
    id
    account_id
    delta
    signal_type
    block_timestamp
    term {
      atom { label }
      triple {
        subject { label }
        predicate { label }
        object { label }
      }
    }
  }
}`,
    variables: {
      limit: 10
    }
  }
];

<GraphQLPlaygroundCustom queries={signalQueries} />

## Use Cases

### Activity Feed

```typescript
import { useQuery, gql } from '@apollo/client';

const GET_RECENT_SIGNALS = gql`
  query GetRecentSignals($limit: Int!) {
    signals(
      order_by: { block_timestamp: desc }
      limit: $limit
    ) {
      id
      account {
        id
        label
        image
      }
      delta
      signal_type
      block_timestamp
      term {
        atom { label image }
        triple {
          subject { label }
          predicate { label }
          object { label }
        }
      }
    }
  }
`;

function ActivityFeed() {
  const { data } = useQuery(GET_RECENT_SIGNALS, {
    variables: { limit: 20 },
    pollInterval: 10000 // Refresh every 10 seconds
  });

  return (
    <div>
      {data?.signals.map(signal => (
        <div key={signal.id}>
          <span>{signal.account.label}</span>
          <span>{signal.signal_type === 'deposit' ? 'deposited' : 'redeemed'}</span>
          <span>{formatEther(signal.delta)} ETH</span>
          <span>on {signal.term.atom?.label || 'a triple'}</span>
        </div>
      ))}
    </div>
  );
}
```

### Filter by Account

```graphql
query GetAccountSignals($accountId: String!) {
  signals(
    where: { account_id: { _eq: $accountId } }
    order_by: { block_timestamp: desc }
    limit: 50
  ) {
    id
    delta
    signal_type
    block_timestamp
    term {
      atom { label }
    }
  }
}
```

## Best Practices

1. **Use pagination** - Signals can be numerous; always use limit/offset
2. **Filter by time** - Use `block_timestamp` for recent activity
3. **Include relationships** - Fetch `term` and `account` for context
4. **Consider subscriptions** - Use `signals_stream` for real-time updates

## Related

- [Signals Aggregate](./signals-aggregate) - Aggregate signal statistics
- [Signals from Following](./signals-from-following) - Social-filtered signals
- [Signal Stats](./signal-stats) - Time-bucketed statistics
