---
title: Use Database Functions
sidebar_label: Database Functions
sidebar_position: 8
description: Leverage backend functions for complex queries
keywords: [graphql, function, backend, performance, complex]
---

# Use Database Functions

Use backend functions for complex queries instead of client-side filtering.

## Anti-Pattern

```graphql
# BAD: Manual filtering for social queries
query GetFollowingManually($address: String!) {
  my_positions: positions(where: { account_id: { _eq: $address } }) {
    vault {
      term {
        triple {
          # Complex filtering in application code...
        }
      }
    }
  }
}
```

## Best Practice

```graphql
# GOOD: Using database functions
query GetFollowingEfficiently($address: String!) {
  following(args: { address: $address }) {
    id
    label
    atom {
      term_id
      label
    }
  }
}
```

## Available Functions

- `following`: Get accounts a user follows
- `positions_from_following`: Social feed of positions
- `search_term`: Semantic search
- `signals_from_following`: Activity from followed accounts

## Benefits

1. **Faster execution**: Runs in database
2. **Less data transfer**: Filtered server-side
3. **More maintainable**: Logic in one place
