---
title: Events Query
sidebar_label: Blockchain Events
sidebar_position: 6
description: Query raw blockchain events from the protocol
keywords: [graphql, events, blockchain, transactions, logs]
---

# Blockchain Events

Query raw blockchain events emitted by the Intuition protocol contracts. Events provide detailed transaction-level data for all protocol activities.

## Query Structure

```graphql
query GetEvents(
  $limit: Int!
  $offset: Int
  $where: events_bool_exp
  $orderBy: [events_order_by!]
) {
  events_aggregate(where: $where) {
    aggregate {
      count
    }
  }
  events(
    limit: $limit
    offset: $offset
    where: $where
    order_by: $orderBy
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
    sender_total_shares_in_vault
    receiver_total_shares_in_vault
    shares_for_receiver
    assets_for_receiver
  }
}
```

## Variables

```json
{
  "limit": 50,
  "orderBy": [{ "block_timestamp": "desc" }]
}
```

## Event Types

The `type` field indicates the kind of protocol action:

| Event Type | Description |
|------------|-------------|
| `AtomCreated` | New atom created |
| `TripleCreated` | New triple created |
| `Deposited` | Assets deposited into vault |
| `Redeemed` | Shares redeemed from vault |
| `FeesTransferred` | Protocol fees transferred |

## Filter by Event Type

```graphql
query GetAtomCreatedEvents($limit: Int!) {
  events(
    where: { type: { _eq: "AtomCreated" } }
    order_by: { block_timestamp: desc }
    limit: $limit
  ) {
    id
    atom_id
    sender_id
    block_timestamp
    transaction_hash
  }
}
```

## Filter by Transaction

```graphql
query GetEventsByTransaction($txHash: String!) {
  events(
    where: { transaction_hash: { _eq: $txHash } }
    order_by: { block_number: asc }
  ) {
    id
    type
    atom_id
    triple_id
    shares_for_receiver
    assets_for_receiver
  }
}
```

## Filter by Block Range

```graphql
query GetEventsInBlockRange(
  $startBlock: numeric!
  $endBlock: numeric!
  $limit: Int!
) {
  events(
    where: {
      _and: [
        { block_number: { _gte: $startBlock } }
        { block_number: { _lte: $endBlock } }
      ]
    }
    order_by: { block_number: asc }
    limit: $limit
  ) {
    id
    type
    block_number
    transaction_hash
  }
}
```

## Get Events for Account

```graphql
query GetAccountEvents($accountId: String!, $limit: Int!) {
  events(
    where: {
      _or: [
        { sender_id: { _eq: $accountId } }
        { receiver_id: { _eq: $accountId } }
      ]
    }
    order_by: { block_timestamp: desc }
    limit: $limit
  ) {
    id
    type
    block_timestamp
    transaction_hash
    atom_id
    triple_id
    shares_for_receiver
    assets_for_receiver
  }
}
```

## Use Cases

### Transaction History

Build a complete transaction history for an account:

```typescript
async function getTransactionHistory(accountId: string, limit: number) {
  const query = `
    query GetTransactionHistory($accountId: String!, $limit: Int!) {
      events(
        where: { sender_id: { _eq: $accountId } }
        order_by: { block_timestamp: desc }
        limit: $limit
      ) {
        id
        type
        block_timestamp
        transaction_hash
        atom_id
        triple_id
        shares_for_receiver
        assets_for_receiver
      }
    }
  `
  return client.request(query, { accountId, limit })
}
```

### Protocol Analytics

Analyze protocol activity over time:

```graphql
query GetDailyEventCounts {
  atom_creates: events_aggregate(
    where: { type: { _eq: "AtomCreated" } }
  ) {
    aggregate { count }
  }
  triple_creates: events_aggregate(
    where: { type: { _eq: "TripleCreated" } }
  ) {
    aggregate { count }
  }
  deposits: events_aggregate(
    where: { type: { _eq: "Deposited" } }
  ) {
    aggregate { count }
  }
  redemptions: events_aggregate(
    where: { type: { _eq: "Redeemed" } }
  ) {
    aggregate { count }
  }
}
```

## Best Practices

1. **Filter by event type** for specific actions
2. **Use block ranges** for historical queries
3. **Order by block_timestamp** for chronological data
4. **Combine with aggregates** for statistics

## Related Queries

- [Signals](/docs/graphql-api/queries/signals/list-signals) - High-level activity
- [Fee Transfers](/docs/graphql-api/queries/advanced/fee-transfers) - Fee-specific events
- [Deposits & Redemptions](/docs/graphql-api/queries/vaults/deposits-redemptions) - Vault transactions
