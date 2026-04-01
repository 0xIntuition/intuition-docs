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
    delta
    account_id
    account {
      id
      label
      image
    }
    atom_id
    term {
      atom {
        term_id
        label
        image
      }
    }
    triple_id
    block_number
    created_at
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
  "order_by": [{ "created_at": "desc" }],
  "limit": 20,
  "offset": 0
}
```

## Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | `String` | Unique signal identifier |
| `delta` | `numeric` | Amount in wei |
| `account_id` | `String` | Account address |
| `account` | `accounts` | Account details with label/image |
| `atom_id` | `String` | Related atom ID (if atom signal) |
| `term` | `terms` | Related term (contains nested `atom` with label/image) |
| `triple_id` | `String` | Related triple ID (if triple signal) |
| `block_number` | `numeric` | Block number |
| `created_at` | `timestamptz` | Event timestamp |
| `transaction_hash` | `String` | Transaction hash |

## Expected Response

```json
{
  "data": {
    "signals": [
      {
        "id": "0x123...-1",
        "delta": "1000000000000000000",
        "account_id": "0xd8da6bf26964af9d7eed9e03e53415d37aa96045",
        "account": {
          "id": "0xd8da6bf26964af9d7eed9e03e53415d37aa96045",
          "label": "vitalik.eth",
          "image": "ipfs://Qm..."
        },
        "atom_id": "0x57d94c116a33bb...",
        "term": {
          "atom": {
            "id": "0x57d94c116a33bb...",
            "label": "Ethereum",
            "image": "ipfs://Qm..."
          }
        },
        "triple_id": null,
        "block_number": 12345678,
        "created_at": "2024-01-15T10:30:00Z",
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
  signals(limit: $limit, order_by: { created_at: desc }) {
    id
    delta
    account {
      label
      image
    }
    term {
      atom {
        label
      }
    }
    created_at
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
    order_by: { created_at: desc }
    limit: $limit
  ) {
    id
    delta
    term {
      atom {
        label
      }
    }
    triple_id
    created_at
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
    order_by: { delta: desc }
    limit: $limit
  ) {
    id
    delta
    account {
      label
    }
    term {
      atom {
        label
      }
    }
    created_at
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
        order_by: { created_at: desc }
        limit: $limit
      ) {
        id
        delta
        account {
          id
          label
          image
        }
        term {
          atom {
            label
            image
          }
        }
        triple_id
        created_at
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
  const target = signal.term?.atom?.label ?? `Triple ${signal.triple_id}`

  return `${signal.account.label} signaled on ${target}`
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
        order_by: { created_at: desc }
        limit: $limit
        offset: $offset
      ) {
        id
        delta
        term {
          atom { label }
        }
        triple_id
        created_at
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
          created_at: { _gte: $start, _lte: $end }
        }
        order_by: { created_at: desc }
      ) {
        id
        delta
        account { label }
        created_at
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

### By Amount

```graphql
# Large signals (> 1 ETH)
signals(where: {
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
