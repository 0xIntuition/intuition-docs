---
title: Use Fragments
sidebar_label: Fragments
sidebar_position: 4
description: Reuse field selections with GraphQL fragments
keywords: [graphql, fragment, reuse, DRY]
---

# Use Fragments

Reuse field selections across queries with GraphQL fragments.

## Anti-Pattern

```graphql
# BAD: Duplicating field selections
query GetTriple($id: String!) {
  triple(term_id: $id) {
    subject {
      term_id
      label
      creator { id label }
    }
    predicate {
      term_id
      label
      creator { id label }
    }
    object {
      term_id
      label
      creator { id label }
    }
  }
}
```

## Best Practice

```graphql
# GOOD: Using fragments
fragment AtomBasics on atoms {
  term_id
  label
  creator {
    id
    label
  }
}

query GetTriple($id: String!) {
  triple(term_id: $id) {
    subject { ...AtomBasics }
    predicate { ...AtomBasics }
    object { ...AtomBasics }
  }
}
```

## Benefits

1. **DRY code**: Define once, use everywhere
2. **Easier maintenance**: Update in one place
3. **Consistent data**: Same fields across queries
4. **Better readability**: Named, semantic units
