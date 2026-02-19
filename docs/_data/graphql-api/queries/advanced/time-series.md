---
title: Time-Series Analysis
sidebar_label: Time-Series
sidebar_position: 2
description: Query pre-computed time-series aggregations for share prices, signals, and market state
keywords: [graphql, time-series, daily, hourly, weekly, monthly, stats, timescaledb]
---

import GraphQLPlaygroundCustom from '@site/src/components/GraphQLPlaygroundCustom';

# Time-Series Analysis

The API provides pre-computed time-series tables (TimescaleDB continuous aggregates) for efficient analytics. These are available at four granularities: hourly, daily, weekly, and monthly.

## Share Price Change Stats

Track share price movements over time for any term/curve combination.

```graphql
query GetDailyPriceStats($termId: String!, $curveId: numeric!, $limit: Int!) {
  share_price_change_stats_daily(
    where: {
      term_id: { _eq: $termId }
      curve_id: { _eq: $curveId }
    }
    order_by: { bucket: desc }
    limit: $limit
  ) {
    bucket
    term_id
    curve_id
    first_share_price
    last_share_price
    difference
    change_count
  }
}
```

### Fields

| Field | Type | Description |
|-------|------|-------------|
| `bucket` | `timestamptz` | Time bucket start |
| `term_id` | `String` | Term ID |
| `curve_id` | `numeric` | Bonding curve ID |
| `first_share_price` | `numeric` | Opening price for the period |
| `last_share_price` | `numeric` | Closing price for the period |
| `difference` | `numeric` | Price change (last - first) |
| `change_count` | `numeric` | Number of price changes in the period |

### Relationships

| Field | Type | Description |
|-------|------|-------------|
| `term` | `terms` | Associated term entity |

### Available Tables

- `share_price_change_stats_hourly`
- `share_price_change_stats_daily`
- `share_price_change_stats_weekly`
- `share_price_change_stats_monthly`

All four share the same field structure.

## Signal Stats

Track signal volume (deposits and redemptions) over time.

```graphql
query GetDailySignalStats($termId: String!, $curveId: numeric!, $limit: Int!) {
  signal_stats_daily(
    where: {
      term_id: { _eq: $termId }
      curve_id: { _eq: $curveId }
    }
    order_by: { bucket: desc }
    limit: $limit
  ) {
    bucket
    term_id
    curve_id
    count
    volume
  }
}
```

### Fields

| Field | Type | Description |
|-------|------|-------------|
| `bucket` | `timestamptz` | Time bucket start |
| `term_id` | `String` | Term ID |
| `curve_id` | `numeric` | Bonding curve ID |
| `count` | `numeric` | Number of signals in the period |
| `volume` | `numeric` | Total signal volume (assets) |

### Relationships

| Field | Type | Description |
|-------|------|-------------|
| `term` | `terms` | Associated term entity |

### Available Tables

- `signal_stats_hourly`
- `signal_stats_daily`
- `signal_stats_weekly`
- `signal_stats_monthly`

## Term Total State Change Stats

Track total market cap changes for a term over time. Unlike share price and signal stats, these tables do not have a `curve_id` — they aggregate across all curves for a term.

```graphql
query GetDailyStateStats($termId: String!, $limit: Int!) {
  term_total_state_change_stats_daily(
    where: { term_id: { _eq: $termId } }
    order_by: { bucket: desc }
    limit: $limit
  ) {
    bucket
    term_id
    first_total_market_cap
    last_total_market_cap
    difference
  }
}
```

### Fields

| Field | Type | Description |
|-------|------|-------------|
| `bucket` | `timestamptz` | Time bucket start |
| `term_id` | `String` | Term ID |
| `first_total_market_cap` | `numeric` | Opening total market cap |
| `last_total_market_cap` | `numeric` | Closing total market cap |
| `difference` | `numeric` | Market cap change (last - first) |

### Available Tables

- `term_total_state_change_stats_hourly`
- `term_total_state_change_stats_daily`
- `term_total_state_change_stats_weekly`
- `term_total_state_change_stats_monthly`

### Raw State Changes

The base table `term_total_state_changes` stores every individual state change:

```graphql
query GetStateChanges($termId: String!, $limit: Int!) {
  term_total_state_changes(
    where: { term_id: { _eq: $termId } }
    order_by: { created_at: desc }
    limit: $limit
  ) {
    term_id
    total_assets
    total_market_cap
    created_at
  }
}
```

| Field | Type | Nullable | Description |
|-------|------|----------|-------------|
| `term_id` | `String` | No | Term ID |
| `total_assets` | `numeric` | No | Total assets at this point |
| `total_market_cap` | `numeric` | No | Total market cap at this point |
| `created_at` | `timestamptz` | No | Timestamp of the state change |

## Interactive Example

export const timeSeriesQueries = [
  {
    id: 'daily-price-stats',
    title: 'Daily Share Price Stats',
    query: `query GetDailyPriceStats($termId: String!, $curveId: numeric!, $limit: Int!) {
  share_price_change_stats_daily(
    where: {
      term_id: { _eq: $termId }
      curve_id: { _eq: $curveId }
    }
    order_by: { bucket: desc }
    limit: $limit
  ) {
    bucket
    first_share_price
    last_share_price
    difference
    change_count
  }
}`,
    variables: {
      termId: '0x57d94c116a33bb460428eced262b7ae2ec6f865e7aceef6357cec3d034e8ea21',
      curveId: '1',
      limit: 30
    }
  },
  {
    id: 'daily-signal-stats',
    title: 'Daily Signal Stats',
    query: `query GetDailySignalStats($termId: String!, $curveId: numeric!, $limit: Int!) {
  signal_stats_daily(
    where: {
      term_id: { _eq: $termId }
      curve_id: { _eq: $curveId }
    }
    order_by: { bucket: desc }
    limit: $limit
  ) {
    bucket
    count
    volume
  }
}`,
    variables: {
      termId: '0x57d94c116a33bb460428eced262b7ae2ec6f865e7aceef6357cec3d034e8ea21',
      curveId: '1',
      limit: 30
    }
  }
];

<GraphQLPlaygroundCustom queries={timeSeriesQueries} />

## Choosing Granularity

| Granularity | Use Case |
|-------------|----------|
| **Hourly** | Intraday charts, recent activity monitoring |
| **Daily** | Standard charts, daily reports |
| **Weekly** | Trend analysis, weekly summaries |
| **Monthly** | Long-term trends, monthly reports |

## Best Practices

1. **Use pre-computed tables** instead of aggregating raw events client-side
2. **Choose appropriate granularity** for your time range — hourly for < 7 days, daily for < 90 days, weekly/monthly for longer
3. **Order by `bucket`** for chronological data
4. **Filter by `term_id`** (and `curve_id` where applicable) to scope results
5. **Use `limit`** to bound the time window

## Related

- [Share Price Changes](/docs/graphql-api/queries/vaults/share-price-changes) - Raw share price change events
- [Position Changes](/docs/graphql-api/queries/vaults/position-changes) - Daily/hourly position change aggregates
- [Aggregations](/docs/graphql-api/queries/advanced/aggregations) - Custom aggregations on any table
