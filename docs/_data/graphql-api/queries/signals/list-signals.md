---
title: List Signals
sidebar_label: List Signals
sidebar_position: 2
description: Query signals (deposits/redemptions) with filtering and pagination
keywords: [graphql, signals, deposits, redemptions, list, filter]
---

import GraphQLPlaygroundCustom from '@site/src/components/GraphQLPlaygroundCustom';

# List Signals

Query deposit and redemption signals with rich filtering, sorting, and pagination capabilities.

## Query Structure

```graphql
query GetSignals(
  $where: signals_bool_exp
  $order_by: [signals_order_by!]
  $limit: Int
  $offset: Int
) {
  signals(
    where: $where
    order_by: $order_by
    limit: $limit
    offset: $offset
  ) {
    id
    signal_type
    delta
    shares_delta
    account_id
    account {
      id
      label
      image
    }
    atom_id
    atom {
      term_id
      label
      image
      type
    }
    triple_id
    triple {
      id
      subject { label }
      predicate { label }
      object { label }
    }
    block_number
    block_timestamp
    transaction_hash
  }
}
```

## Variables

| Variable | Type | Description |
|----------|------|-------------|
| `where` | `signals_bool_exp` | Filter conditions |
| `order_by` | `[signals_order_by!]` | Sort order |
| `limit` | `Int` | Maximum results (default: 20) |
| `offset` | `Int` | Pagination offset |

```json
{
  "where": {
    "signal_type": { "_eq": "Deposit" }
  },
  "order_by": [{ "block_timestamp": "desc" }],
  "limit": 20,
  "offset": 0
}
```

## Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | `String` | Unique signal identifier |
| `signal_type` | `String` | `Deposit` or `Redemption` |
| `delta` | `String` | Amount in wei |
| `shares_delta` | `String` | Shares minted or burned |
| `account_id` | `String` | Account address |
| `account` | `Account` | Account details with label/image |
| `atom_id` | `String` | Related atom ID (if atom signal) |
| `atom` | `Atom` | Atom details |
| `triple_id` | `String` | Related triple ID (if triple signal) |
| `triple` | `Triple` | Triple details |
| `block_number` | `Int` | Block number |
| `block_timestamp` | `DateTime` | Event timestamp |
| `transaction_hash` | `String` | Transaction hash |

## Expected Response

```json
{
  "data": {
    "signals": [
      {
        "id": "0x123...-1",
        "signal_type": "Deposit",
        "delta": "1000000000000000000",
        "shares_delta": "1000000000000000000",
        "account_id": "0xd8da6bf26964af9d7eed9e03e53415d37aa96045",
        "account": {
          "id": "0xd8da6bf26964af9d7eed9e03e53415d37aa96045",
          "label": "vitalik.eth",
          "image": "ipfs://Qm..."
        },
        "atom_id": "0x57d94c116a33bb...",
        "atom": {
          "term_id": "0x57d94c116a33bb...",
          "label": "Ethereum",
          "image": "ipfs://Qm...",
          "type": "Thing"
        },
        "triple_id": null,
        "triple": null,
        "block_number": 12345678,
        "block_timestamp": "2024-01-15T10:30:00Z",
        "transaction_hash": "0xabc..."
      }
    ]
  }
}
```

## Interactive Example

export const signalQueries = [
  {
    id: 'recent-signals',
    title: 'Recent Signals',
    query: `query GetSignals($limit: Int!) {
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
}`,
    variables: { limit: 10 }
  },
  {
    id: 'account-signals',
    title: 'Signals by Account',
    query: `query GetAccountSignals($account_id: String!, $limit: Int!) {
  signals(
    where: { account_id: { _eq: $account_id } }
    order_by: { block_timestamp: desc }
    limit: $limit
  ) {
    id
    signal_type
    delta
    atom {
      label
    }
    triple {
      subject { label }
      predicate { label }
      object { label }
    }
    block_timestamp
  }
}`,
    variables: {
      account_id: '0xd8da6bf26964af9d7eed9e03e53415d37aa96045',
      limit: 20
    }
  },
  {
    id: 'deposits-only',
    title: 'Deposits Only',
    query: `query GetDeposits($limit: Int!) {
  signals(
    where: { signal_type: { _eq: "Deposit" } }
    order_by: { delta: desc }
    limit: $limit
  ) {
    id
    delta
    account {
      label
    }
    atom {
      label
    }
    block_timestamp
  }
}`,
    variables: { limit: 10 }
  }
];

<GraphQLPlaygroundCustom queries={signalQueries} />

## Use Cases

### Activity Feed

Build a real-time activity feed:

```typescript
async function getActivityFeed(limit: number = 50) {
  const query = `
    query GetActivityFeed($limit: Int!) {
      signals(
        order_by: { block_timestamp: desc }
        limit: $limit
      ) {
        id
        signal_type
        delta
        account {
          id
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
  `

  const data = await client.request(query, { limit })

  return data.signals.map(signal => ({
    ...signal,
    message: formatSignalMessage(signal)
  }))
}

function formatSignalMessage(signal: Signal): string {
  const action = signal.signal_type === 'Deposit' ? 'staked on' : 'withdrew from'
  const target = signal.atom
    ? signal.atom.label
    : `${signal.triple.subject.label} ${signal.triple.predicate.label} ${signal.triple.object.label}`

  return `${signal.account.label} ${action} ${target}`
}
```

### Account History

Get complete signal history for an account:

```typescript
async function getAccountHistory(
  accountId: string,
  options: { limit?: number; offset?: number } = {}
) {
  const query = `
    query GetAccountHistory(
      $account_id: String!
      $limit: Int!
      $offset: Int!
    ) {
      signals(
        where: { account_id: { _eq: $account_id } }
        order_by: { block_timestamp: desc }
        limit: $limit
        offset: $offset
      ) {
        id
        signal_type
        delta
        shares_delta
        atom { label }
        triple {
          subject { label }
          predicate { label }
          object { label }
        }
        block_timestamp
        transaction_hash
      }
      signals_aggregate(where: { account_id: { _eq: $account_id } }) {
        aggregate {
          count
        }
      }
    }
  `

  const data = await client.request(query, {
    account_id: accountId,
    limit: options.limit || 20,
    offset: options.offset || 0
  })

  return {
    signals: data.signals,
    total: data.signals_aggregate.aggregate.count
  }
}
```

### Filter by Date Range

```typescript
async function getSignalsByDateRange(
  startDate: Date,
  endDate: Date
) {
  const query = `
    query GetSignalsByDate($start: timestamptz!, $end: timestamptz!) {
      signals(
        where: {
          block_timestamp: { _gte: $start, _lte: $end }
        }
        order_by: { block_timestamp: desc }
      ) {
        id
        signal_type
        delta
        account { label }
        block_timestamp
      }
    }
  `

  return client.request(query, {
    start: startDate.toISOString(),
    end: endDate.toISOString()
  })
}
```

## Filtering Options

### By Signal Type

```graphql
# Deposits only
signals(where: { signal_type: { _eq: "Deposit" } })

# Redemptions only
signals(where: { signal_type: { _eq: "Redemption" } })
```

### By Amount

```graphql
# Large deposits (> 1 ETH)
signals(where: {
  signal_type: { _eq: "Deposit" },
  delta: { _gt: "1000000000000000000" }
})
```

### By Atom or Triple

```graphql
# Signals for specific atom
signals(where: { atom_id: { _eq: "0x..." } })

# Signals for specific triple
signals(where: { triple_id: { _eq: "0x..." } })
```

## Best Practices

1. **Use pagination** - Always limit results for large datasets
2. **Order by timestamp** - Most recent signals are usually most relevant
3. **Include context** - Fetch account and atom labels for display
4. **Cache appropriately** - Signals are immutable once created

## Related

- [Aggregate Signals](./aggregate-signals) - Signal statistics
- [Signals from Following](./signals-from-following) - Social feed
- [Subscriptions](/docs/graphql-api/subscriptions/overview) - Real-time signals
