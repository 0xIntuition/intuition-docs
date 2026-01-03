---
title: Pagination Best Practices
sidebar_label: Pagination
sidebar_position: 2
description: Efficient pagination with limit and offset
keywords: [graphql, pagination, limit, offset, best practice]
---

# Pagination Best Practices

Always use limit and offset for efficient pagination with consistent ordering.

## Best Practice

```graphql
query GetAtomsPage($limit: Int!, $offset: Int!) {
  total: atoms_aggregate {
    aggregate {
      count
    }
  }
  atoms(
    limit: $limit
    offset: $offset
    order_by: { created_at: desc }
  ) {
    term_id
    label
  }
}
```

## Key Points

1. **Always include order_by** for consistent results
2. **Fetch total count** using aggregates
3. **Use reasonable limits** (10-100 items per page)
4. **Calculate offset** as `(page - 1) * limit`
