---
title: List Signals
sidebar_label: List Signals
sidebar_position: 1
description: Query signals (deposits and redemptions) on atoms and triples
keywords: [graphql, signal, deposit, redemption, query, activity]
---

# List Signals

Signals represent user activity on atoms and triples - specifically deposits and redemptions. Query signals to track protocol activity and user engagement.

## Query Structure

```graphql
query GetSignals(
  $limit: Int!
  $offset: Int
  $where: signals_bool_exp
  $orderBy: [signals_order_by!]
) {
  signals_aggregate(where: $where) {
    aggregate {
      count
    }
  }
  signals(
    limit: $limit
    offset: $offset
    where: $where
    order_by: $orderBy
  ) {
    id
    delta
    account_id
    term_id
    atom_id
    triple_id
    deposit_id
    redemption_id
    block_number
    block_timestamp
    transaction_hash
    account {
      id
      label
      image
    }
    atom {
      term_id
      label
      image
    }
    triple {
      term_id
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
  "limit": 20,
  "offset": 0,
  "orderBy": [{ "block_timestamp": "desc" }]
}
```

## Filter Examples

### Signals by Account

```graphql
query GetAccountSignals($accountId: String!, $limit: Int!) {
  signals(
    where: { account_id: { _eq: $accountId } }
    order_by: { block_timestamp: desc }
    limit: $limit
  ) {
    id
    delta
    block_timestamp
    atom { label }
    triple {
      subject { label }
      predicate { label }
      object { label }
    }
  }
}
```

### Signals on Specific Atom

```graphql
query GetAtomSignals($atomId: String!, $limit: Int!) {
  signals(
    where: { atom_id: { _eq: $atomId } }
    order_by: { block_timestamp: desc }
    limit: $limit
  ) {
    id
    delta
    account {
      id
      label
      image
    }
    block_timestamp
  }
}
```

### Positive Signals Only (Deposits)

```graphql
query GetDeposits($limit: Int!) {
  signals(
    where: { delta: { _gt: "0" } }
    order_by: { block_timestamp: desc }
    limit: $limit
  ) {
    id
    delta
    account { label }
    atom { label }
  }
}
```

### Negative Signals Only (Redemptions)

```graphql
query GetRedemptions($limit: Int!) {
  signals(
    where: { delta: { _lt: "0" } }
    order_by: { block_timestamp: desc }
    limit: $limit
  ) {
    id
    delta
    account { label }
    atom { label }
  }
}
```

## Signal Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | String | Unique signal identifier |
| `delta` | numeric | Change in shares (positive = deposit, negative = redemption) |
| `account_id` | String | Account that created the signal |
| `term_id` | String | Associated term ID |
| `atom_id` | String | Associated atom ID (if signal is on atom) |
| `triple_id` | String | Associated triple ID (if signal is on triple) |
| `deposit_id` | String | Related deposit transaction ID |
| `redemption_id` | String | Related redemption transaction ID |
| `block_number` | numeric | Block number of the transaction |
| `block_timestamp` | timestamptz | Timestamp of the block |
| `transaction_hash` | String | Transaction hash |

## Aggregations

Get signal statistics for an account:

```graphql
query GetAccountSignalStats($accountId: String!) {
  signals_aggregate(where: { account_id: { _eq: $accountId } }) {
    aggregate {
      count
      sum {
        delta
      }
    }
  }
}
```

## Best Practices

1. **Use pagination** for large result sets
2. **Filter by account or atom** for targeted queries
3. **Order by block_timestamp** for chronological activity
4. **Use aggregates** for statistics and counts

## Related Queries

- [Deposits & Redemptions](/docs/graphql-api/queries/vaults/deposits-redemptions) - Direct deposit/redemption queries
- [User Positions](/docs/graphql-api/queries/vaults/user-positions) - Current user positions
- [Activity Feed Example](/docs/graphql-api/examples/activity-feed) - Building activity feeds
