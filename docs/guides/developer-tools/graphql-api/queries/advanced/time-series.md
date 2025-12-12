---
title: Time-Series Analysis
sidebar_label: Time-Series
sidebar_position: 2
description: Query pre-computed time-series aggregations
keywords: [graphql, time-series, daily, hourly, monthly, stats]
---

import GraphQLPlaygroundCustom from '@site/src/components/GraphQLPlaygroundCustom';

# Time-Series Analysis

Use pre-computed time-series tables for efficient analytics.

## Query Structure

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
    first_share_price
    last_share_price
    difference
    change_count
  }
}
```

## Available Tables

- **share_price_change_stats_hourly**: Hourly price aggregations
- **share_price_change_stats_daily**: Daily price aggregations
- **share_price_change_stats_weekly**: Weekly price aggregations
- **share_price_change_stats_monthly**: Monthly price aggregations
- **signal_stats_daily**: Daily signal aggregations
- **signal_stats_hourly**: Hourly signal aggregations
- **signal_stats_monthly**: Monthly signal aggregations

## Best Practices

1. **Use pre-computed tables** for charts and analytics
2. **Choose appropriate granularity** (hourly/daily/weekly/monthly)
3. **Order by bucket** for time-based queries
4. **Limit results** to relevant time period
