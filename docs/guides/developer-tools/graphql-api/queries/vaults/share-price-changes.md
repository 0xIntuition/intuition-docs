---
title: Share Price Changes
sidebar_label: Price Changes
sidebar_position: 4
description: Track share price changes over time
keywords: [graphql, price, share, changes, history]
---

import GraphQLPlaygroundCustom from '@site/src/components/GraphQLPlaygroundCustom';

# Share Price Changes

Track how share prices change over time.

## Query Structure

```graphql
query GetPriceHistory($termId: String!, $curveId: numeric!, $limit: Int!) {
  share_price_changes(
    where: {
      term_id: { _eq: $termId }
      curve_id: { _eq: $curveId }
    }
    order_by: { created_at: desc }
    limit: $limit
  ) {
    old_price
    new_price
    price_change
    created_at
  }
}
```

## Best Practices

1. **Use time-series tables** for aggregated data
2. **Filter by term and curve** for specific vault
3. **Calculate percentage change** from old and new price
4. **Use daily/hourly stats** for charts
