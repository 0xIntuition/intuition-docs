---
title: Use Pre-Computed Statistics
sidebar_label: Pre-Computed Stats
sidebar_position: 7
description: Leverage time-series tables for analytics
keywords: [graphql, statistics, time-series, pre-computed, performance]
---

# Use Pre-Computed Statistics

Leverage time-series aggregation tables for efficient analytics.

## Anti-Pattern

```graphql
# BAD: Computing trends from raw events
query GetPriceHistory($termId: String!) {
  share_price_changes(
    where: { term_id: { _eq: $termId } }
    order_by: { updated_at: asc }
  ) {
    updated_at
    share_price
    total_assets
    total_shares
  }
}
# Then computing daily aggregates in application code
```

## Best Practice

```graphql
# GOOD: Using pre-computed daily statistics
query GetDailyPriceStats($termId: String!, $curveId: numeric!) {
  share_price_change_stats_daily(
    where: {
      term_id: { _eq: $termId }
      curve_id: { _eq: $curveId }
    }
    order_by: { bucket: desc }
    limit: 30
  ) {
    bucket
    first_share_price
    last_share_price
    difference
    change_count
  }
}
```

## Available Tables

- `share_price_change_stats_hourly/daily/weekly/monthly`
- `signal_stats_hourly/daily/monthly`

## Benefits

1. **Faster queries**: Pre-aggregated data
2. **Less computation**: Done server-side
3. **Smaller payloads**: Aggregated vs raw data
4. **Better UX**: Faster dashboard loading
