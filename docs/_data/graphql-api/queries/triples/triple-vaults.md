---
title: Triple Vaults
sidebar_label: Triple Vaults
sidebar_position: 8
description: Query vault-level data for triples including market cap and position counts
keywords: [graphql, triple, vault, market cap, shares, positions]
---

import GraphQLPlaygroundCustom from '@site/src/components/GraphQLPlaygroundCustom';

# Triple Vaults

Query the `triple_vault` view to get vault-level data for triples, including market cap, position counts, shares, and asset totals per curve.

## Query Structure

```graphql
query GetTripleVaults($termId: String!, $limit: Int!) {
  triple_vaults(
    where: { term_id: { _eq: $termId } }
    order_by: { market_cap: desc }
    limit: $limit
  ) {
    term_id
    counter_term_id
    curve_id
    total_assets
    total_shares
    market_cap
    position_count
    block_number
    log_index
    updated_at
  }
}
```

## Response Fields

| Field | Type | Nullable | Description |
|-------|------|----------|-------------|
| `term_id` | `String` | No | Term ID |
| `counter_term_id` | `String` | No | Counter-term ID |
| `curve_id` | `numeric` | No | Bonding curve ID |
| `total_assets` | `numeric` | No | Total assets in the vault |
| `total_shares` | `numeric` | No | Total shares issued |
| `market_cap` | `numeric` | No | Vault market capitalization |
| `position_count` | `bigint` | No | Number of positions in this vault |
| `block_number` | `numeric` | No | Block number of last update |
| `log_index` | `bigint` | No | Log index |
| `updated_at` | `timestamptz` | No | Last update timestamp |

### Relationships

| Field | Type | Description |
|-------|------|-------------|
| `term` | `terms` | Term entity |
| `counter_term` | `terms` | Counter-term entity |

## Single Lookup

```graphql
query GetTripleVault($termId: String!, $curveId: numeric!) {
  triple_vault(term_id: $termId, curve_id: $curveId) {
    total_assets
    total_shares
    market_cap
    position_count
  }
}
```

## Interactive Example

export const tripleVaultQueries = [
  {
    id: 'triple-vaults',
    title: 'Top Triple Vaults',
    query: `query GetTopTripleVaults($limit: Int!) {
  triple_vaults(
    order_by: { market_cap: desc }
    limit: $limit
  ) {
    term_id
    counter_term_id
    curve_id
    market_cap
    position_count
    total_assets
    total_shares
  }
}`,
    variables: { limit: 20 }
  }
];

<GraphQLPlaygroundCustom queries={tripleVaultQueries} />

## Use Cases

### Compare For/Against Vaults

```typescript
async function getTripleVaultPair(termId: string) {
  const query = `
    query GetVaultPair($termId: String!) {
      for: triple_vault(term_id: $termId, curve_id: 1) {
        total_assets
        total_shares
        market_cap
        position_count
      }
      against: triple_vault(term_id: $termId, curve_id: 2) {
        total_assets
        total_shares
        market_cap
        position_count
      }
    }
  `

  return client.request(query, { termId })
}
```

## Related

- [Triple Terms](./triple-terms) - Aggregate stats across curves
- [Counter Triples](./counter-triples) - Counter-triple relationships
- [Vault Details](/docs/graphql-api/queries/vaults/vault-details) - General vault queries
