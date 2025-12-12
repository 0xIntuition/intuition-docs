---
title: Top Vaults
sidebar_label: Top Vaults
sidebar_position: 5
description: Query top vaults by market cap and activity
keywords: [graphql, vault, ranking, market cap, tvl]
---

import GraphQLPlaygroundCustom from '@site/src/components/GraphQLPlaygroundCustom';

# Top Vaults

Query top vaults ranked by market cap, position count, or other metrics.

## Query Structure

```graphql
query GetTopVaults($curveId: numeric!, $limit: Int!) {
  vaults(
    where: { curve_id: { _eq: $curveId } }
    order_by: { market_cap: desc }
    limit: $limit
  ) {
    term_id
    market_cap
    total_shares
    current_share_price
    position_count
    term {
      atom { label image }
      triple {
        subject { label }
        predicate { label }
        object { label }
      }
    }
  }
}
```

## Interactive Example

export const topVaultsQueries = [
  {
    id: 'top-by-market-cap',
    title: 'Top by Market Cap',
    query: `query GetTopVaults($curveId: numeric!, $limit: Int!) {
  vaults(
    where: { curve_id: { _eq: $curveId } }
    order_by: { market_cap: desc }
    limit: $limit
  ) {
    term_id
    market_cap
    position_count
    term {
      atom { label image }
    }
  }
}`,
    variables: {
      curveId: '1',
      limit: 20
    }
  }
];

<GraphQLPlaygroundCustom queries={topVaultsQueries} />

## Best Practices

1. **Order by market_cap** for TVL ranking
2. **Filter by curve_id** for specific bonding curve
3. **Include term data** for display
4. **Use limit** to show top N vaults
