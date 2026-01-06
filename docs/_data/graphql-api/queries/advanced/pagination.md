---
title: Pagination
sidebar_label: Pagination
sidebar_position: 5
description: Offset-based pagination patterns
keywords: [graphql, pagination, offset, limit, page]
---

import GraphQLPlaygroundCustom from '@site/src/components/GraphQLPlaygroundCustom';

# Pagination

Implement efficient offset-based pagination with total counts.

## Query Structure

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
    created_at
  }
}
```

## Variables

```json
{
  "limit": 20,
  "offset": 40
}
```

This fetches page 3 (items 41-60) when using 20 items per page.

## Best Practices

1. **Always include order_by** for consistent pagination
2. **Fetch total count** using aggregates
3. **Use reasonable limits** (10-100 items per page)
4. **Calculate offset** as `(page - 1) * limit`
