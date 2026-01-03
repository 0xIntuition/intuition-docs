---
title: User Positions
sidebar_label: User Positions
sidebar_position: 3
description: Fetch all positions for a user with aggregates
keywords: [graphql, example, position, user, portfolio]
---

import GraphQLPlaygroundCustom from '@site/src/components/GraphQLPlaygroundCustom';

# Example: User Positions

Fetch user positions with aggregate statistics.

## Query

export const userPositionQueries = [
  {
    id: 'user-positions',
    title: 'User Portfolio',
    query: `query GetUserPositions($accountId: String!, $limit: Int!) {
  stats: positions_aggregate(where: { account_id: { _eq: $accountId } }) {
    aggregate {
      count
      sum { shares }
    }
  }
  positions(
    where: { account_id: { _eq: $accountId } }
    order_by: { shares: desc }
    limit: $limit
  ) {
    id
    shares
    vault {
      term_id
      current_share_price
      market_cap
      term {
        atom { label image }
      }
    }
  }
}`,
    variables: {
      accountId: '0xd8da6bf26964af9d7eed9e03e53415d37aa96045',
      limit: 20
    }
  }
];

<GraphQLPlaygroundCustom queries={userPositionQueries} />
