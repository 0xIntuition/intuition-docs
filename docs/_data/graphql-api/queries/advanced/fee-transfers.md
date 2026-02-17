---
title: Fee Transfers
sidebar_label: Fee Transfers
sidebar_position: 7
description: Query protocol fee transfer events
keywords: [graphql, fees, transfers, protocol, revenue]
---

# Fee Transfers

Query protocol fee transfers. Fee transfers occur when protocol fees are collected from deposits and redemptions.

## Query Structure

```graphql
query GetFeeTransfers(
  $limit: Int!
  $offset: Int
  $where: fee_transfers_bool_exp
  $orderBy: [fee_transfers_order_by!]
) {
  fee_transfers_aggregate(where: $where) {
    aggregate {
      count
      sum {
        amount
      }
    }
  }
  fee_transfers(
    limit: $limit
    offset: $offset
    where: $where
    order_by: $orderBy
  ) {
    id
    amount
    sender_id
    receiver_id
    block_number
    block_timestamp
    transaction_hash
    sender {
      id
      label
    }
    receiver {
      id
      label
    }
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

## Fee Statistics

```graphql
query GetFeeStats {
  fee_transfers_aggregate {
    aggregate {
      count
      sum {
        amount
      }
      avg {
        amount
      }
    }
  }
}
```

## Fees by Receiver

```graphql
query GetFeesByReceiver($receiverId: String!, $limit: Int!) {
  fee_transfers(
    where: { receiver_id: { _eq: $receiverId } }
    order_by: { block_timestamp: desc }
    limit: $limit
  ) {
    id
    amount
    sender_id
    block_timestamp
    transaction_hash
  }
  fee_transfers_aggregate(
    where: { receiver_id: { _eq: $receiverId } }
  ) {
    aggregate {
      count
      sum {
        amount
      }
    }
  }
}
```

## Fees in Time Range

```graphql
query GetFeesInRange(
  $startTime: timestamptz!
  $endTime: timestamptz!
) {
  fee_transfers(
    where: {
      _and: [
        { block_timestamp: { _gte: $startTime } }
        { block_timestamp: { _lte: $endTime } }
      ]
    }
    order_by: { block_timestamp: asc }
  ) {
    id
    amount
    block_timestamp
    sender_id
    receiver_id
  }
  fee_transfers_aggregate(
    where: {
      _and: [
        { block_timestamp: { _gte: $startTime } }
        { block_timestamp: { _lte: $endTime } }
      ]
    }
  ) {
    aggregate {
      count
      sum {
        amount
      }
    }
  }
}
```

## Use Cases

### Protocol Revenue Dashboard

```typescript
async function getProtocolRevenue() {
  const query = `
    query GetProtocolRevenue {
      total: fee_transfers_aggregate {
        aggregate {
          count
          sum { amount }
        }
      }
      last24h: fee_transfers_aggregate(
        where: {
          block_timestamp: { _gte: "${new Date(Date.now() - 86400000).toISOString()}" }
        }
      ) {
        aggregate {
          count
          sum { amount }
        }
      }
      last7d: fee_transfers_aggregate(
        where: {
          block_timestamp: { _gte: "${new Date(Date.now() - 604800000).toISOString()}" }
        }
      ) {
        aggregate {
          count
          sum { amount }
        }
      }
    }
  `
  return client.request(query)
}
```

## Best Practices

1. **Use aggregates** for statistics and totals
2. **Filter by time range** for period analysis
3. **Group by receiver** for distribution analysis
4. **Combine with events** for complete transaction context

## Related Queries

- [Events](/docs/graphql-api/queries/advanced/events) - Raw blockchain events
- [Deposits & Redemptions](/docs/graphql-api/queries/vaults/deposits-redemptions) - Source of fees
- [Protocol Statistics](/docs/graphql-api/queries/advanced/protocol-stats) - Overall stats
