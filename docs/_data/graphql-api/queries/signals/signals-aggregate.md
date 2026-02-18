---
title: Signals Aggregate
sidebar_label: Signals Aggregate
sidebar_position: 2
description: Get aggregate statistics for signals
keywords: [graphql, signals, aggregate, statistics, count, sum]
---

import GraphQLPlaygroundCustom from '@site/src/components/GraphQLPlaygroundCustom';

# Signals Aggregate Query

Get aggregate statistics for signals, including counts, sums, and averages.

## Query Structure

```graphql
query GetSignalsAggregate($where: signals_bool_exp) {
  signals_aggregate(where: $where) {
    aggregate {
      count
      sum {
        delta
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
    nodes {
      id
      account_id
      delta
      signal_type
    }
  }
}
```

## Variables

```json
{
  "where": {
    "signal_type": { "_eq": "deposit" },
    "block_timestamp": { "_gte": "2024-01-01T00:00:00Z" }
  }
}
```

## Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `aggregate.count` | Int | Total number of signals |
| `aggregate.sum.delta` | String | Sum of all deltas |
| `aggregate.avg.delta` | String | Average delta |
| `aggregate.max.delta` | String | Maximum delta |
| `aggregate.max.block_timestamp` | String | Most recent timestamp |
| `aggregate.min.delta` | String | Minimum delta |
| `aggregate.min.block_timestamp` | String | Earliest timestamp |
| `nodes` | Array | Optional: include matching signals |

## Interactive Example

export const aggregateQueries = [
  {
    id: 'signals-aggregate',
    title: 'Signals Aggregate',
    query: `query GetSignalsAggregate {
  signals_aggregate {
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
  }
];

<GraphQLPlaygroundCustom queries={aggregateQueries} />

## Use Cases

### Protocol Dashboard Stats

```typescript
import { useQuery, gql } from '@apollo/client';
import { formatEther } from 'viem';

const GET_SIGNAL_STATS = gql`
  query GetSignalStats {
    deposits: signals_aggregate(where: { signal_type: { _eq: "deposit" } }) {
      aggregate {
        count
        sum { delta }
      }
    }
    redemptions: signals_aggregate(where: { signal_type: { _eq: "redemption" } }) {
      aggregate {
        count
        sum { delta }
      }
    }
  }
`;

function ProtocolStats() {
  const { data } = useQuery(GET_SIGNAL_STATS);

  const depositCount = data?.deposits.aggregate.count || 0;
  const depositVolume = data?.deposits.aggregate.sum.delta || '0';
  const redemptionCount = data?.redemptions.aggregate.count || 0;
  const redemptionVolume = data?.redemptions.aggregate.sum.delta || '0';

  return (
    <div>
      <div>
        <h3>Deposits</h3>
        <p>Count: {depositCount}</p>
        <p>Volume: {formatEther(depositVolume)} ETH</p>
      </div>
      <div>
        <h3>Redemptions</h3>
        <p>Count: {redemptionCount}</p>
        <p>Volume: {formatEther(redemptionVolume)} ETH</p>
      </div>
    </div>
  );
}
```

### Time-Based Analysis

```graphql
query GetDailySignalVolume($date: timestamp!) {
  signals_aggregate(
    where: {
      block_timestamp: {
        _gte: $date,
        _lt: "2024-01-02T00:00:00Z"
      }
    }
  ) {
    aggregate {
      count
      sum { delta }
    }
  }
}
```

### Per-Term Statistics

```graphql
query GetTermSignalStats($termId: String!) {
  signals_aggregate(where: { term_id: { _eq: $termId } }) {
    aggregate {
      count
      sum { delta }
      avg { delta }
    }
  }
}
```

## Best Practices

1. **Use filters** - Aggregate over specific time periods or types
2. **Combine with count** - Get both totals and counts for averages
3. **Separate by type** - Query deposits and redemptions separately
4. **Cache results** - Aggregate data changes slowly; cache appropriately

## Related

- [List Signals](./list-signals) - Query individual signals
- [Signals from Following](./signals-from-following) - Social-filtered signals
- [Signal Stats](./signal-stats) - Pre-computed time-bucketed stats
