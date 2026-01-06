---
title: Predicate-Object Aggregations
sidebar_label: Predicate-Objects
sidebar_position: 3
description: Query denormalized predicate-object collections
keywords: [graphql, predicate, object, denormalized, aggregation]
---

import GraphQLPlaygroundCustom from '@site/src/components/GraphQLPlaygroundCustom';

# Predicate-Object Aggregations

Use the denormalized `predicate_objects` table for efficient collection queries.

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

## Best Practices

1. **Use for collection aggregations** instead of manual counting
2. **More efficient** than aggregating raw triples
3. **Pre-computed metrics** updated automatically
4. **Order by triple_count** for popular collections
