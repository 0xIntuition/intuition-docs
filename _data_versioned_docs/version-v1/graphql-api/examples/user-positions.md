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

This example uses a live-verified account with populated positions; position counts and values change over time.

Account IDs are stored in EIP-55 checksummed form and `_eq` comparisons are case-sensitive — pass the address exactly as checksummed (as shown below), or the query silently returns empty results.

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
      accountId: '0x88D0aF73508452c1a453356b3Fac26525aEc23A2',
      limit: 20
    }
  }
];

<GraphQLPlaygroundCustom queries={userPositionQueries} />
