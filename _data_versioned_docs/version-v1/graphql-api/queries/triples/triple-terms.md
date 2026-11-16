---
title: Triple Terms
sidebar_label: Triple Terms
sidebar_position: 7
description: Query triple-term relationship data with aggregate stats
keywords: [graphql, triple, term, counter-term, market cap, positions]
---

import GraphQLPlaygroundCustom from '@site/src/components/GraphQLPlaygroundCustom';

# Triple Terms

Query the `triple_term` view to get aggregate statistics for triple-term pairs. Each record links a triple's term to its counter-term with position and market cap data.

## Query Structure

```graphql
query GetTripleTerms($termId: String!, $limit: Int!) {
  triple_terms(
    where: { term_id: { _eq: $termId } }
    order_by: { total_market_cap: desc }
    limit: $limit
  ) {
    term_id
    counter_term_id
    total_assets
    total_market_cap
    total_position_count
    updated_at
    term {
      type
    }
    counter_term {
      type
    }
  }
}
```

## Response Fields

| Field | Type | Nullable | Description |
|-------|------|----------|-------------|
| `term_id` | `String` | No | Term ID |
| `counter_term_id` | `String` | No | Counter-term ID |
| `total_assets` | `numeric` | No | Total assets across vaults |
| `total_market_cap` | `numeric` | No | Combined market cap |
| `total_position_count` | `bigint` | No | Total number of positions |
| `updated_at` | `timestamptz` | No | Last update timestamp |

### Relationships

| Field | Type | Description |
|-------|------|-------------|
| `term` | `terms` | Term entity |
| `counter_term` | `terms` | Counter-term entity |

## Single Lookup

```graphql
query GetTripleTerm($termId: String!) {
  triple_term(term_id: $termId) {
    term_id
    counter_term_id
    total_assets
    total_market_cap
    total_position_count
  }
}
```

## Interactive Example

export const tripleTermQueries = [
  {
    id: 'triple-terms',
    title: 'Triple Terms by Market Cap',
    query: `query GetTripleTerms($limit: Int!) {
  triple_terms(
    order_by: { total_market_cap: desc }
    limit: $limit
  ) {
    term_id
    counter_term_id
    total_market_cap
    total_position_count
    updated_at
  }
}`,
    variables: { limit: 20 }
  }
];

<GraphQLPlaygroundCustom queries={tripleTermQueries} />

## Related

- [Triple Vaults](./triple-vaults) - Vault-level data for triples
- [Counter Triples](./counter-triples) - Counter-triple relationships
- [Single Triple](./single-triple) - Query individual triples
