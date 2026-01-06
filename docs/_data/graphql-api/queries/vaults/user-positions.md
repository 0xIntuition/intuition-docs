---
title: User Positions
sidebar_label: User Positions
sidebar_position: 2
description: Query user positions in vaults
keywords: [graphql, position, user, shares, vault]
---

import GraphQLPlaygroundCustom from '@site/src/components/GraphQLPlaygroundCustom';

# User Positions

Query all positions held by a specific account.

## Query Structure

```graphql
query GetUserPositions($accountId: String!, $limit: Int!) {
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
}
```

## Interactive Example

export const positionQueries = [
  {
    id: 'user-positions',
    title: 'User Positions',
    query: `query GetUserPositions($accountId: String!, $limit: Int!) {
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
    }
  }
}`,
    variables: {
      accountId: '0xd8da6bf26964af9d7eed9e03e53415d37aa96045',
      limit: 20
    }
  }
];

<GraphQLPlaygroundCustom queries={positionQueries} />

## Best Practices

1. **Order by shares** to show largest positions first
2. **Include vault data** for context
3. **Use aggregates** for totals
4. **Filter by shares > 0** for active positions
