---
title: Price History
sidebar_label: Price History
sidebar_position: 7
description: Analyze price trends over time
keywords: [graphql, example, price, history, time-series, chart]
---

import GraphQLPlaygroundCustom from '@site/src/components/GraphQLPlaygroundCustom';

# Example: Price History

Analyze share price trends using time-series data.

## Query

export const priceHistoryQueries = [
  {
    id: 'price-trends',
    title: 'Daily Price Trends',
    query: `query GetPriceTrends($termId: String!, $curveId: numeric!, $days: Int!) {
  share_price_change_stats_daily(
    where: {
      term_id: { _eq: $termId }
      curve_id: { _eq: $curveId }
    }
    order_by: { bucket: desc }
    limit: $days
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
      days: 30
    }
  }
];

<GraphQLPlaygroundCustom queries={priceHistoryQueries} />
