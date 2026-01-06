---
title: Trending Atoms
sidebar_label: Trending Atoms
sidebar_position: 4
description: Find top atoms by market cap and activity
keywords: [graphql, example, trending, market cap, popular]
---

import GraphQLPlaygroundCustom from '@site/src/components/GraphQLPlaygroundCustom';

# Example: Trending Atoms

Find top atoms ranked by vault market cap.

## Query

export const trendingQueries = [
  {
    id: 'trending-atoms',
    title: 'Top Atoms by Market Cap',
    query: `query GetTrendingAtoms($curveId: numeric!, $limit: Int!) {
  vaults(
    where: { curve_id: { _eq: $curveId } }
    order_by: { market_cap: desc }
    limit: $limit
  ) {
    term_id
    market_cap
    position_count
    total_shares
    term {
      atom {
        term_id
        label
        image
        type
      }
    }
  }
}`,
    variables: {
      curveId: '1',
      limit: 20
    }
  }
];

<GraphQLPlaygroundCustom queries={trendingQueries} />
