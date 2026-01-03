---
title: Filter by Predicate-Object
sidebar_label: By Predicate-Object
sidebar_position: 3
description: Query predicate-object aggregations and collections
keywords: [graphql, triple, predicate, object, aggregation, denormalized]
---

import GraphQLPlaygroundCustom from '@site/src/components/GraphQLPlaygroundCustom';

# Filter by Predicate-Object

Use the denormalized `predicate_objects` table to efficiently query pre-aggregated collections.

## Query Structure

```graphql
query GetPredicateObjects($predicateId: String!, $limit: Int!) {
  predicate_objects(
    where: { predicate_id: { _eq: $predicateId } }
    order_by: { triple_count: desc }
    limit: $limit
  ) {
    predicate_id
    object_id
    triple_count
    total_market_cap
    total_position_count
    object {
      term_id
      label
      image
    }
  }
}
```

## Interactive Example

export const predicateObjectQueries = [
  {
    id: 'popular-collections',
    title: 'Popular Collections',
    query: `query GetPopularCollections($predicateId: String!, $limit: Int!) {
  predicate_objects(
    where: { predicate_id: { _eq: $predicateId } }
    order_by: { triple_count: desc }
    limit: $limit
  ) {
    object { term_id label image }
    triple_count
    total_market_cap
  }
}`,
    variables: {
      predicateId: '0x...',
      limit: 20
    }
  }
];

<GraphQLPlaygroundCustom queries={predicateObjectQueries} />

## Best Practices

1. **Use for aggregations** instead of manually counting triples
2. **Order by triple_count** for popular collections
3. **Filter by predicate** to find specific relationship types
4. **More efficient** than aggregating raw triples
