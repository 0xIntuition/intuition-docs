---
title: Fee Transfers
sidebar_label: Fee Transfers
sidebar_position: 2
description: Query protocol fee transfer events
keywords: [graphql, fees, transfers, protocol, revenue]
---

import GraphQLPlaygroundCustom from '@site/src/components/GraphQLPlaygroundCustom';

# Fee Transfers Query

Query protocol fee transfer events. Track fees collected and distributed by the protocol.

## Query Structure

```graphql
query GetFeeTransfers(
  $where: fee_transfers_bool_exp
  $orderBy: [fee_transfers_order_by!]
  $limit: Int
  $offset: Int
) {
  fee_transfers(
    where: $where
    order_by: $orderBy
    limit: $limit
    offset: $offset
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
  "orderBy": [{ "block_timestamp": "desc" }],
  "limit": 50,
  "offset": 0
}
```

## Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | String | Transfer identifier |
| `amount` | String | Fee amount in wei |
| `sender_id` | String | Fee payer address |
| `receiver_id` | String | Fee recipient address |
| `block_number` | Int | Block number |
| `block_timestamp` | String | Transfer timestamp |
| `transaction_hash` | String | Transaction hash |

## Interactive Example

export const feeQueries = [
  {
    id: 'fee-transfers',
    title: 'Fee Transfers',
    query: `query GetFeeTransfers($limit: Int!) {
  fee_transfers(
    order_by: { block_timestamp: desc }
    limit: $limit
  ) {
    id
    amount
    block_timestamp
    sender { label }
    receiver { label }
    transaction_hash
  }
}`,
    variables: {
      limit: 20
    }
  }
];

<GraphQLPlaygroundCustom queries={feeQueries} />

## Use Cases

### Protocol Revenue Dashboard

```typescript
import { useQuery, gql } from '@apollo/client';
import { formatEther } from 'viem';

const GET_FEE_STATS = gql`
  query GetFeeStats {
    fee_transfers_aggregate {
      aggregate {
        count
        sum {
          amount
        }
      }
    }
    recent: fee_transfers(
      order_by: { block_timestamp: desc }
      limit: 10
    ) {
      id
      amount
      block_timestamp
      sender { label }
    }
  }
`;

function RevenueDashboard() {
  const { data } = useQuery(GET_FEE_STATS);

  const totalFees = data?.fee_transfers_aggregate?.aggregate?.sum?.amount || '0';
  const feeCount = data?.fee_transfers_aggregate?.aggregate?.count || 0;

  return (
    <div>
      <div>
        <h3>Total Protocol Fees</h3>
        <p>{formatEther(totalFees)} ETH</p>
        <p>{feeCount} transactions</p>
      </div>

      <h3>Recent Fee Transfers</h3>
      {data?.recent?.map(fee => (
        <div key={fee.id}>
          <span>{formatEther(fee.amount)} ETH</span>
          <span>from {fee.sender?.label}</span>
          <time>{new Date(fee.block_timestamp).toLocaleDateString()}</time>
        </div>
      ))}
    </div>
  );
}
```

### Daily Fee Volume

```graphql
query GetDailyFees($date: timestamp!) {
  fee_transfers_aggregate(
    where: {
      block_timestamp: {
        _gte: $date,
        _lt: "2024-01-02T00:00:00Z"
      }
    }
  ) {
    aggregate {
      count
      sum { amount }
    }
  }
}
```

### Fees by Receiver

```graphql
query GetFeesByReceiver($receiverId: String!) {
  fee_transfers(
    where: { receiver_id: { _eq: $receiverId } }
    order_by: { block_timestamp: desc }
  ) {
    amount
    block_timestamp
    sender { label }
  }
  fee_transfers_aggregate(
    where: { receiver_id: { _eq: $receiverId } }
  ) {
    aggregate {
      sum { amount }
    }
  }
}
```

## Best Practices

1. **Use aggregates** - Get totals with `fee_transfers_aggregate`
2. **Track over time** - Monitor fee trends by date
3. **Link transactions** - Include explorer links for transparency
4. **Convert wei** - Display human-readable ETH amounts

## Related

- [List Events](./list-events) - All blockchain events
- [Protocol Stats](/docs/graphql-api/queries/stats/protocol-stats) - Protocol metrics
