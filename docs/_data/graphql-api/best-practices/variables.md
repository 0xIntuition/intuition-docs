---
title: Use Variables
sidebar_label: Variables
sidebar_position: 5
description: Always use variables for dynamic values
keywords: [graphql, variables, dynamic, parameterized]
---

# Use Variables

Always use variables for dynamic values instead of hardcoding.

## Anti-Pattern

```graphql
# BAD: Hardcoding values
query {
  atoms(where: { type: { _eq: Person } }) {
    term_id
    label
  }
}
```

## Best Practice

```graphql
# GOOD: Using variables
query GetAtomsByType($type: atom_type!) {
  atoms(where: { type: { _eq: $type } }) {
    term_id
    label
  }
}
```

**Variables:**
```json
{
  "type": "Person"
}
```

## Benefits

1. **Reusability**: Same query, different values
2. **Type safety**: GraphQL validates variable types
3. **Security**: Prevents injection attacks
4. **Caching**: Better query plan caching
