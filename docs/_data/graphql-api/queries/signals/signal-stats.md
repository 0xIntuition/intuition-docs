---
title: Signal Stats
sidebar_label: Signal Stats
sidebar_position: 4
description: Query time-bucketed signal statistics
keywords: [graphql, signals, stats, daily, hourly, weekly, monthly]
---

import GraphQLPlaygroundCustom from '@site/src/components/GraphQLPlaygroundCustom';

# Signal Stats Queries

Query pre-computed signal statistics aggregated by time periods. Available in daily, hourly, weekly, and monthly buckets.

## Available Tables

| Table | Description |
|-------|-------------|
| `signal_stats_daily` | Daily aggregated statistics |
| `signal_stats_hourly` | Hourly aggregated statistics |
| `signal_stats_weekly` | Weekly aggregated statistics |
| `signal_stats_monthly` | Monthly aggregated statistics |

## Query Structure

### Daily Stats

```graphql
query GetSignalStatsDaily(
  $where: signal_stats_daily_bool_exp
  $orderBy: [signal_stats_daily_order_by!]
  $limit: Int
) {
  signal_stats_daily(
    where: $where
    order_by: $orderBy
    limit: $limit
  ) {
    date
    term_id
    deposit_count
    deposit_volume
    redemption_count
    redemption_volume
    net_volume
    unique_accounts
    term {
      atom { label }
      triple {
        subject { label }
        predicate { label }
        object { label }
      }
    }
  }
}
```

## Variables

```json
{
  "where": {
    "date": { "_gte": "2024-01-01" }
  },
  "orderBy": [{ "date": "desc" }],
  "limit": 30
}
```

## Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `date` / `hour` / `week` / `month` | String | Time bucket |
| `term_id` | String | Term identifier |
| `deposit_count` | Int | Number of deposits |
| `deposit_volume` | String | Total deposit volume (wei) |
| `redemption_count` | Int | Number of redemptions |
| `redemption_volume` | String | Total redemption volume (wei) |
| `net_volume` | String | Deposits minus redemptions |
| `unique_accounts` | Int | Distinct accounts |

## Interactive Example

export const signalStatsQueries = [
  {
    id: 'signal-stats-daily',
    title: 'Daily Signal Stats',
    query: `query GetSignalStatsDaily($limit: Int!) {
  signal_stats_daily(
    order_by: { date: desc }
    limit: $limit
  ) {
    date
    deposit_count
    deposit_volume
    redemption_count
    redemption_volume
    net_volume
    unique_accounts
  }
}`,
    variables: {
      limit: 14
    }
  }
];

<GraphQLPlaygroundCustom queries={signalStatsQueries} />

## Use Cases

### Protocol Dashboard

```typescript
import { useQuery, gql } from '@apollo/client';
import { BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

const GET_DAILY_STATS = gql`
  query GetDailyStats($limit: Int!) {
    signal_stats_daily(
      order_by: { date: desc }
      limit: $limit
    ) {
      date
      deposit_count
      deposit_volume
      redemption_count
      net_volume
    }
  }
`;

function DailyStatsChart() {
  const { data } = useQuery(GET_DAILY_STATS, {
    variables: { limit: 30 }
  });

  const chartData = data?.signal_stats_daily
    ?.map(stat => ({
      date: new Date(stat.date).toLocaleDateString(),
      deposits: stat.deposit_count,
      volume: parseFloat(stat.deposit_volume) / 1e18
    }))
    .reverse();

  return (
    <BarChart width={800} height={400} data={chartData}>
      <XAxis dataKey="date" />
      <YAxis />
      <Tooltip />
      <Bar dataKey="deposits" fill="#8884d8" name="Deposits" />
    </BarChart>
  );
}
```

### Hourly Activity Heatmap

```graphql
query GetHourlyStats {
  signal_stats_hourly(
    where: { hour: { _gte: "2024-01-01T00:00:00Z" } }
    order_by: { hour: asc }
    limit: 168  # One week of hourly data
  ) {
    hour
    deposit_count
    unique_accounts
  }
}
```

### Term-Specific Stats

```graphql
query GetTermDailyStats($termId: String!) {
  signal_stats_daily(
    where: { term_id: { _eq: $termId } }
    order_by: { date: desc }
    limit: 30
  ) {
    date
    deposit_count
    deposit_volume
    redemption_count
    redemption_volume
    net_volume
  }
}
```

### Monthly Overview

```graphql
query GetMonthlyOverview {
  signal_stats_monthly(
    order_by: { month: desc }
    limit: 12
  ) {
    month
    deposit_count
    deposit_volume
    redemption_count
    redemption_volume
    unique_accounts
  }
}
```

## Best Practices

1. **Use appropriate granularity** - Hourly for recent, daily for weeks, monthly for years
2. **Limit date ranges** - Request only needed time periods
3. **Cache aggressively** - Historical stats don't change
4. **Combine with live data** - Use stats for history, subscriptions for real-time

## Related

- [List Signals](./list-signals) - Individual signal records
- [Signals Aggregate](./signals-aggregate) - Custom aggregations
- [Protocol Stats](../stats/protocol-stats) - Protocol-wide statistics
