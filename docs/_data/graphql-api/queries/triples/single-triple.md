---
title: Single Triple Query
sidebar_label: Single Triple
sidebar_position: 1
description: Fetch individual triple details by term ID
keywords: [graphql, triple, query, subject, predicate, object]
---

import GraphQLPlaygroundCustom from '@site/src/components/GraphQLPlaygroundCustom';

# Single Triple Query

Fetch detailed information about a specific triple using its term ID.

## Query Structure

```graphql
query GetTriple($id: String!) {
  triple(term_id: $id) {
    term_id
    created_at
    subject {
      term_id
      label
      image
    }
    predicate {
      term_id
      label
    }
    object {
      term_id
      label
      image
    }
  }
}
```

## Interactive Example

export const tripleQueries = [
  {
    id: 'basic-triple',
    title: 'Basic Triple Query',
    query: `query GetTriple($id: String!) {
  triple(term_id: $id) {
    term_id
    created_at
    subject { term_id label image }
    predicate { term_id label }
    object { term_id label image }
  }
}`,
    variables: {
      id: '0xffb30efde2b49a7deadd920a7df684595ed4a291a582033c16b0795796965600'
    }
  },
  {
    id: 'triple-with-vault',
    title: 'Triple with Vault Details',
    query: `query GetTripleWithVault($id: String!, $curveId: numeric!) {
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
    counter_term {
      vaults(where: { curve_id: { _eq: $curveId } }) {
        total_shares
        market_cap
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

<GraphQLPlaygroundCustom queries={tripleQueries} />

## Best Practices

1. **Use primary key lookup** for single triples
2. **Include vault data** when needed for market information
3. **Query counter triple** to see opposing positions
4. **Handle null responses** when triple doesn't exist
