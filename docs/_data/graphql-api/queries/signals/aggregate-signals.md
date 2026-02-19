---
title: Aggregate Signals
sidebar_label: Aggregate
sidebar_position: 3
description: Aggregate statistics for signals
keywords: [graphql, signals, aggregate, statistics, count, sum]
---

import GraphQLPlaygroundCustom from '@site/src/components/GraphQLPlaygroundCustom';

# Aggregate Signals

Query aggregate statistics for signals including counts, sums, and averages.

## Query Structure

```graphql
query GetSignalsAggregate($where: signals_bool_exp) {
  signals_aggregate(where: $where) {
    aggregate {
      count
      sum {
        delta
        shares_delta
      }
      avg {
        delta
      }
      max {
        delta
        block_timestamp
      }
      min {
        delta
        block_timestamp
      }
    }
  }
}
```

## Variables

```json
{
  "where": {
    "signal_type": { "_eq": "Deposit" },
    "block_timestamp": { "_gte": "2024-01-01T00:00:00Z" }
  }
}
```

## Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `count` | `Int` | Total number of signals |
| `sum.delta` | `String` | Total amount in wei |
| `sum.shares_delta` | `String` | Total shares |
| `avg.delta` | `Float` | Average amount |
| `max.delta` | `String` | Maximum amount |
| `max.block_timestamp` | `DateTime` | Most recent signal |
| `min.delta` | `String` | Minimum amount |
| `min.block_timestamp` | `DateTime` | Oldest signal |

## Expected Response

```json
{
  "data": {
    "signals_aggregate": {
      "aggregate": {
        "count": 1500,
        "sum": {
          "delta": "150000000000000000000",
          "shares_delta": "145000000000000000000"
        },
        "avg": {
          "delta": 100000000000000000
        },
        "max": {
          "delta": "10000000000000000000",
          "block_timestamp": "2024-01-15T23:59:59Z"
        },
        "min": {
          "delta": "1000000000000000",
          "block_timestamp": "2024-01-01T00:00:01Z"
        }
      }
    }
  }
}
```

## Interactive Example

export const aggregateQueries = [
  {
    id: 'total-stats',
    title: 'Total Signal Statistics',
    query: `query GetSignalsAggregate {
  signals_aggregate {
    aggregate {
      count
      sum {
        delta
      }
    }
  }
}`,
    variables: {}
  },
  {
    id: 'deposits-stats',
    title: 'Deposit Statistics',
    query: `query GetDepositsAggregate {
  signals_aggregate(where: { signal_type: { _eq: "Deposit" } }) {
    aggregate {
      count
      sum {
        delta
      }
      avg {
        delta
      }
    }
  }
}`,
    variables: {}
  },
  {
    id: 'account-stats',
    title: 'Account Signal Statistics',
    query: `query GetAccountStats($account_id: String!) {
  deposits: signals_aggregate(where: {
    account_id: { _eq: $account_id }
    signal_type: { _eq: "Deposit" }
  }) {
    aggregate {
      count
      sum { delta }
    }
  }
  redemptions: signals_aggregate(where: {
    account_id: { _eq: $account_id }
    signal_type: { _eq: "Redemption" }
  }) {
    aggregate {
      count
      sum { delta }
    }
  }
}`,
    variables: {
      account_id: '0xd8da6bf26964af9d7eed9e03e53415d37aa96045'
    }
  }
];

<GraphQLPlaygroundCustom queries={aggregateQueries} />

## Use Cases

### Protocol Dashboard

Display overall protocol statistics:

```typescript
async function getProtocolStats() {
  const query = `
    query GetProtocolStats {
      deposits: signals_aggregate(where: { signal_type: { _eq: "Deposit" } }) {
        aggregate {
          count
          sum { delta }
        }
      }
      redemptions: signals_aggregate(where: { signal_type: { _eq: "Redemption" } }) {
        aggregate {
          count
          sum { delta }
        }
      }
      total: signals_aggregate {
        aggregate {
          count
        }
      }
    }
  `

  const data = await client.request(query)

  return {
    totalSignals: data.total.aggregate.count,
    totalDeposits: data.deposits.aggregate.count,
    totalDepositVolume: data.deposits.aggregate.sum.delta,
    totalRedemptions: data.redemptions.aggregate.count,
    totalRedemptionVolume: data.redemptions.aggregate.sum.delta
  }
}
```

### Account Statistics

Get deposit/redemption stats for an account:

```typescript
async function getAccountStats(accountId: string) {
  const query = `
    query GetAccountStats($account_id: String!) {
      deposits: signals_aggregate(where: {
        account_id: { _eq: $account_id }
        signal_type: { _eq: "Deposit" }
      }) {
        aggregate {
          count
          sum { delta }
          avg { delta }
        }
      }
      redemptions: signals_aggregate(where: {
        account_id: { _eq: $account_id }
        signal_type: { _eq: "Redemption" }
      }) {
        aggregate {
          count
          sum { delta }
        }
      }
    }
  `

  const data = await client.request(query, { account_id: accountId })

  const depositSum = BigInt(data.deposits.aggregate.sum?.delta || '0')
  const redemptionSum = BigInt(data.redemptions.aggregate.sum?.delta || '0')

  return {
    depositCount: data.deposits.aggregate.count,
    depositVolume: depositSum,
    redemptionCount: data.redemptions.aggregate.count,
    redemptionVolume: redemptionSum,
    netFlow: depositSum - redemptionSum
  }
}
```

### Time-Based Analysis

Analyze signals over time periods:

```typescript
async function getMonthlyStats(year: number, month: number) {
  const startDate = new Date(year, month - 1, 1)
  const endDate = new Date(year, month, 0, 23, 59, 59)

  const query = `
    query GetMonthlyStats($start: timestamptz!, $end: timestamptz!) {
      signals_aggregate(where: {
        block_timestamp: { _gte: $start, _lte: $end }
      }) {
        aggregate {
          count
          sum { delta }
        }
      }
      deposits: signals_aggregate(where: {
        block_timestamp: { _gte: $start, _lte: $end }
        signal_type: { _eq: "Deposit" }
      }) {
        aggregate {
          count
          sum { delta }
        }
      }
    }
  `

  return client.request(query, {
    start: startDate.toISOString(),
    end: endDate.toISOString()
  })
}
```

## Grouping with nodes

For grouped aggregates, use the `nodes` field:

```graphql
query GetSignalsByAtom {
  signals_aggregate(
    where: { atom_id: { _is_null: false } }
    distinct_on: atom_id
  ) {
    nodes {
      atom_id
      atom {
        label
      }
    }
    aggregate {
      count
    }
  }
}
```

## Best Practices

1. **Use filters** - Narrow down aggregates for performance
2. **Handle big numbers** - Use BigInt for wei values
3. **Cache results** - Aggregate queries can be expensive
4. **Combine queries** - Fetch multiple aggregates in one request

## Related

- [List Signals](./list-signals) - Individual signals
- [Signals from Following](./signals-from-following) - Social signals
- [Protocol Stats](/docs/graphql-api/queries/stats/protocol-stats) - Overall statistics
