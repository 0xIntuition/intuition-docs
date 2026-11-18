---
title: Choose Appropriate Operators
sidebar_label: Operators
sidebar_position: 6
description: Use the right comparison operator for the job
keywords: [graphql, operators, eq, ilike, comparison]
---

# Choose Appropriate Operators

Use the right comparison operator for better performance.

## Anti-Pattern

```graphql
# BAD: Using _ilike for exact matches
query GetAccount($address: String!) {
  accounts(where: { id: { _ilike: $address } }) {
    id
    label
  }
}
```

## Best Practice

```graphql
# GOOD: Use _eq or primary key lookup
query GetAccount($address: String!) {
  account(id: $address) {
    id
    label
  }
}
```

## Operator Guidelines

- **_eq**: Exact matches (fastest)
- **_ilike**: Case-insensitive pattern matching (slower)
- **_in**: Multiple values
- **_gt/_lt**: Comparisons
- **Primary key lookup**: Most efficient (when possible)
