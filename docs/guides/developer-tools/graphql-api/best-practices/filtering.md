---
title: Efficient Filtering
sidebar_label: Filtering
sidebar_position: 3
description: Use indexed fields and appropriate operators
keywords: [graphql, filter, where, index, performance]
---

# Efficient Filtering

Filter early and use indexed fields for better performance.

## Best Practice

```graphql
query GetFilteredAtoms($type: atom_type!, $since: timestamptz!) {
  atoms(
    where: {
      type: { _eq: $type }
      created_at: { _gte: $since }
    }
    limit: 100
  ) {
    term_id
    label
  }
}
```

## Indexed Fields

These fields have database indexes:
- `term_id` (primary key)
- `creator_id`
- `type`
- `created_at`

## Operator Selection

- Use `_eq` for exact matches (not `_ilike`)
- Use `_ilike` only for pattern matching
- Use `_in` for multiple values
- Combine filters with `_and` for specificity
