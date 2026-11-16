---
title: Fee Accruals
sidebar_label: Fee Accruals
sidebar_position: 4
description: Query protocol fee accrual records by epoch
keywords: [graphql, fees, accruals, protocol, epoch, revenue]
---

import GraphQLPlaygroundCustom from '@site/src/components/GraphQLPlaygroundCustom';

# Fee Accruals

Query protocol fee accrual records. Fee accruals track protocol fees accumulated per epoch, including the sender and transaction details.

## Query Structure

```graphql
query GetFeeAccruals($limit: Int!, $offset: Int) {
  protocol_fee_accruals(
    order_by: { created_at: desc }
    limit: $limit
    offset: $offset
  ) {
    id
    amount
    epoch
    sender_id
    sender {
      label
      image
    }
    block_number
    created_at
    transaction_hash
  }
  protocol_fee_accruals_aggregate {
    aggregate {
      count
      sum {
        amount
      }
    }
  }
}
```

## Response Fields

| Field | Type | Nullable | Description |
|-------|------|----------|-------------|
| `id` | `String` | No | Accrual record ID |
| `amount` | `numeric` | No | Fee amount accrued (wei) |
| `epoch` | `numeric` | No | Protocol epoch number |
| `sender_id` | `String` | No | Account that generated the fee |
| `block_number` | `numeric` | No | Block number |
| `created_at` | `timestamptz` | No | Accrual timestamp |
| `transaction_hash` | `String` | No | Transaction hash |

### Relationships

| Field | Type | Description |
|-------|------|-------------|
| `sender` | `accounts` | Account that generated the fee |

## Interactive Example

export const feeAccrualQueries = [
  {
    id: 'recent-accruals',
    title: 'Recent Fee Accruals',
    query: `query GetRecentAccruals($limit: Int!) {
  protocol_fee_accruals(
    order_by: { created_at: desc }
    limit: $limit
  ) {
    id
    amount
    epoch
    sender {
      label
    }
    created_at
    transaction_hash
  }
  protocol_fee_accruals_aggregate {
    aggregate {
      count
      sum { amount }
    }
  }
}`,
    variables: { limit: 10 }
  },
  {
    id: 'accruals-by-epoch',
    title: 'Accruals by Epoch',
    query: `query GetAccrualsByEpoch($epoch: numeric!, $limit: Int!) {
  protocol_fee_accruals(
    where: { epoch: { _eq: $epoch } }
    order_by: { amount: desc }
    limit: $limit
  ) {
    id
    amount
    sender {
      label
    }
    created_at
  }
  protocol_fee_accruals_aggregate(
    where: { epoch: { _eq: $epoch } }
  ) {
    aggregate {
      count
      sum { amount }
    }
  }
}`,
    variables: { epoch: '1', limit: 20 }
  }
];

<GraphQLPlaygroundCustom queries={feeAccrualQueries} />

## Filtering

### By Epoch

```graphql
protocol_fee_accruals(where: {
  epoch: { _eq: "1" }
})
```

### By Date Range

```graphql
protocol_fee_accruals(where: {
  created_at: {
    _gte: "2024-01-01T00:00:00Z",
    _lte: "2024-01-31T23:59:59Z"
  }
})
```

### By Sender

```graphql
protocol_fee_accruals(where: {
  sender_id: { _eq: "0x..." }
})
```

## Fee Accruals vs Fee Transfers

| | `protocol_fee_accruals` | `fee_transfers` |
|--|-------------------------|-----------------|
| **Tracks** | Fee accumulation per epoch | Individual fee transfer events |
| **Granularity** | Per-epoch aggregation | Per-transaction |
| **Has epoch** | Yes | No |
| **Has receiver** | No | Yes (`receiver_id`) |

## Related

- [Fee Transfers](./fee-transfers) - Individual fee transfer events
- [Protocol Stats](./protocol-stats) - Aggregate protocol metrics
