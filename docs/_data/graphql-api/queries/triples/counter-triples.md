---
title: Counter Triples
sidebar_label: Counter Triples
sidebar_position: 5
description: Query opposing triple positions
keywords: [graphql, triple, counter, opposing, positions]
---

import GraphQLPlaygroundCustom from '@site/src/components/GraphQLPlaygroundCustom';

# Counter Triples

Query triples along with their counter (opposing) triples to see both sides of a claim.

## Query Structure

```graphql
query GetTripleWithCounter($id: String!, $curveId: numeric!) {
  triple(term_id: $id) {
    term_id
    subject { label }
    predicate { label }
    object { label }
    term {
      vaults(where: { curve_id: { _eq: $curveId } }) {
        total_shares
        market_cap
      }
    }
    counter_term {
      vaults(where: { curve_id: { _eq: $curveId } }) {
        total_shares
        market_cap
      }
    }
  }
}
```

## Interactive Example

export const counterQueries = [
  {
    id: 'with-counter',
    title: 'Triple with Counter',
    query: `query GetTripleWithCounter($id: String!, $curveId: numeric!) {
  triple(term_id: $id) {
    term_id
    subject { label }
    predicate { label }
    object { label }
    term {
      vaults(where: { curve_id: { _eq: $curveId } }) {
        total_shares
        market_cap
        position_count
      }
    }
    counter_term_id
    counter_term {
      vaults(where: { curve_id: { _eq: $curveId } }) {
        total_shares
        market_cap
        position_count
      }
    }
  }
}`,
    variables: {
      id: '0xffb30efde2b49a7deadd920a7df684595ed4a291a582033c16b0795796965600',
      curveId: '2'
    }
  }
];

<GraphQLPlaygroundCustom queries={counterQueries} />

## Best Practices

1. **Include counter_term** for opposing positions
2. **Compare market caps** to see which side is favored
3. **Filter by curve_id** for specific vaults
4. **Show both sides** in UI for balanced view
