---
title: Fee Transfers
sidebar_label: Fee Transfers
sidebar_position: 3
description: Query protocol fee transfer events
keywords: [graphql, fees, transfers, protocol, revenue]
---

import GraphQLPlaygroundCustom from '@site/src/components/GraphQLPlaygroundCustom';

# Fee Transfers

Query protocol fee transfers - the fees collected by the protocol on each transaction.

## Query Structure

```graphql
query GetFeeTransfers(
  $where: fee_transfers_bool_exp
  $order_by: [fee_transfers_order_by!]
  $limit: Int
  $offset: Int
) {
  fee_transfers(
    where: $where
    order_by: $order_by
    limit: $limit
    offset: $offset
  ) {
    id
    amount
    sender_id
    sender {
      label
    }
    receiver_id
    receiver {
      label
    }
    block_number
    block_timestamp
    transaction_hash
  }
  fee_transfers_aggregate(where: $where) {
    aggregate {
      count
      sum {
        amount
      }
    }
  }
}
```

## Variables

```json
{
  "order_by": [{ "block_timestamp": "desc" }],
  "limit": 20
}
```

## Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | `String` | Transfer identifier |
| `amount` | `String` | Fee amount in wei |
| `sender_id` | `String` | Account that paid the fee |
| `sender` | `Account` | Sender account details |
| `receiver_id` | `String` | Protocol fee receiver address |
| `receiver` | `Account` | Receiver details |
| `block_number` | `Int` | Block number |
| `block_timestamp` | `DateTime` | Transfer timestamp |
| `transaction_hash` | `String` | Transaction hash |

## Expected Response

```json
{
  "data": {
    "fee_transfers": [
      {
        "id": "0x123...-1",
        "amount": "100000000000000",
        "sender_id": "0xabc...",
        "sender": {
          "label": "alice.eth"
        },
        "receiver_id": "0xprotocol...",
        "receiver": {
          "label": "Intuition Protocol"
        },
        "block_number": 12345678,
        "block_timestamp": "2024-01-15T10:30:00Z",
        "transaction_hash": "0xdef..."
      }
    ],
    "fee_transfers_aggregate": {
      "aggregate": {
        "count": 5000,
        "sum": {
          "amount": "1500000000000000000"
        }
      }
    }
  }
}
```

## Interactive Example

export const feeQueries = [
  {
    id: 'recent-fees',
    title: 'Recent Fee Transfers',
    query: `query GetRecentFees($limit: Int!) {
  fee_transfers(
    order_by: { block_timestamp: desc }
    limit: $limit
  ) {
    id
    amount
    sender {
      label
    }
    block_timestamp
  }
  fee_transfers_aggregate {
    aggregate {
      count
      sum {
        amount
      }
    }
  }
}`,
    variables: { limit: 10 }
  },
  {
    id: 'large-fees',
    title: 'Largest Fee Transfers',
    query: `query GetLargeFees($limit: Int!) {
  fee_transfers(
    order_by: { amount: desc }
    limit: $limit
  ) {
    id
    amount
    sender {
      label
    }
    block_timestamp
    transaction_hash
  }
}`,
    variables: { limit: 10 }
  }
];

<GraphQLPlaygroundCustom queries={feeQueries} />

## Use Cases

### Fee Revenue Dashboard

Track protocol fee revenue:

```typescript
async function getFeeRevenue(days: number = 30) {
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)

  const query = `
    query GetFeeRevenue($start: timestamptz!) {
      fee_transfers_aggregate(where: {
        block_timestamp: { _gte: $start }
      }) {
        aggregate {
          count
          sum {
            amount
          }
        }
      }
      all_time: fee_transfers_aggregate {
        aggregate {
          sum {
            amount
          }
        }
      }
    }
  `

  const data = await client.request(query, {
    start: startDate.toISOString()
  })

  return {
    periodFees: data.fee_transfers_aggregate.aggregate.sum.amount,
    periodCount: data.fee_transfers_aggregate.aggregate.count,
    allTimeFees: data.all_time.aggregate.sum.amount
  }
}
```

### Top Fee Payers

Find accounts that have paid the most fees:

```typescript
async function getTopFeePayers(limit: number = 10) {
  const query = `
    query GetTopFeePayers($limit: Int!) {
      fee_transfers(
        order_by: { amount: desc }
        limit: $limit
      ) {
        amount
        sender {
          id
          label
          image
        }
        block_timestamp
      }
    }
  `

  return client.request(query, { limit })
}
```

## Filtering Options

### By Date Range

```graphql
fee_transfers(where: {
  block_timestamp: {
    _gte: "2024-01-01T00:00:00Z",
    _lte: "2024-01-31T23:59:59Z"
  }
})
```

### By Amount

```graphql
# Large fees (> 0.01 ETH)
fee_transfers(where: {
  amount: { _gt: "10000000000000000" }
})
```

### By Sender

```graphql
fee_transfers(where: {
  sender_id: { _eq: "0x..." }
})
```

## Best Practices

1. **Aggregate for totals** - Use `_aggregate` for sums instead of summing client-side
2. **Format amounts** - Display in ETH, not wei
3. **Cache results** - Fee data is historical and immutable
4. **Link to explorer** - Transaction hashes can link to block explorer

## Related

- [Protocol Stats](./protocol-stats) - Overall protocol statistics
- [Events](/docs/graphql-api/queries/events/overview) - Raw fee transfer events
