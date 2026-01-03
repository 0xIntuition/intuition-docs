---
title: Nested Triple Queries
sidebar_label: Nested Queries
sidebar_position: 4
description: Query complex nested triple relationships
keywords: [graphql, triple, nested, relationships, graph]
---

import GraphQLPlaygroundCustom from '@site/src/components/GraphQLPlaygroundCustom';

# Nested Triple Queries

Query triples with nested relationships to explore the knowledge graph.

## Query Structure

```graphql
query GetNestedTriples($subjectId: String!, $depth: Int!) {
  triples(where: { subject_id: { _eq: $subjectId } }, limit: $depth) {
    term_id
    predicate { label }
    object {
      term_id
      label
      as_subject_triples(limit: 5) {
        predicate { label }
        object { label }
      }
    }
  }
}
```

## Best Practices

1. **Limit nesting depth** to 2-3 levels maximum
2. **Use limits** on nested queries
3. **Avoid circular references** in graph traversal
4. **Consider performance** with deep nesting
