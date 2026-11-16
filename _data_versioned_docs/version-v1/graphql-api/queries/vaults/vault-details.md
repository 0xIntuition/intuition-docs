---
title: Vault Details
sidebar_label: Vault Details
sidebar_position: 1
description: Query vault statistics and information
keywords: [graphql, vault, shares, market cap, price]
---

import GraphQLPlaygroundCustom from '@site/src/components/GraphQLPlaygroundCustom';

# Vault Details

Fetch comprehensive vault statistics including shares, assets, price, and positions.

## Query Structure

```graphql
query GetVault($termId: String!, $curveId: numeric!) {
  vault(term_id: $termId, curve_id: $curveId) {
    term_id
    curve_id
    total_shares
    total_assets
    current_share_price
    market_cap
    position_count
  }
}
```

## Interactive Example

export const vaultQueries = [
  {
    id: 'vault-stats',
    title: 'Vault Statistics',
    query: `query GetVaultStats($termId: String!, $curveId: numeric!) {
  vault(term_id: $termId, curve_id: $curveId) {
    term_id
    curve_id
    total_shares
    total_assets
    current_share_price
    market_cap
    position_count
    positions_aggregate {
      aggregate {
        count
        sum { shares }
        avg { shares }
      }
    }
  }
}`,
    variables: {
      termId: '0x906527aae4af914b1ac01ff9adfdda5dafde3b5e21f84045e0660b0a15c07769',
      curveId: '1'
    }
  }
];

<GraphQLPlaygroundCustom queries={vaultQueries} />

## Best Practices

1. **Use composite key** (term_id, curve_id) for lookup
2. **Include aggregates** for statistics
3. **Cache market data** as it updates frequently
