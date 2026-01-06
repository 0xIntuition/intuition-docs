---
title: Database Functions
sidebar_label: Database Functions
sidebar_position: 4
description: Use backend functions for complex queries
keywords: [graphql, function, following, search, positions]
---

import GraphQLPlaygroundCustom from '@site/src/components/GraphQLPlaygroundCustom';

# Database Functions

Leverage backend functions for complex queries that would be inefficient client-side.

## Available Functions

### following

Get accounts a user follows:

```graphql
query GetFollowing($address: String!) {
  following(args: { address: $address }) {
    id
    label
    image
    atom {
      term_id
      label
    }
  }
}
```

### positions_from_following

Get positions from followed accounts:

```graphql
query GetPositionsFromFollowing($address: String!, $limit: Int!) {
  positions_from_following(
    args: { address: $address }
    limit: $limit
    order_by: { created_at: desc }
  ) {
    id
    shares
    account { label }
    vault { term_id }
  }
}
```

### search_term

Semantic search:

```graphql
query SemanticSearch($query: String!, $limit: Int!) {
  search_term(args: { query: $query }, limit: $limit) {
    atom {
      term_id
      label
      type
    }
  }
}
```

### search_positions_on_subject

Complex position filtering:

```graphql
query SearchPositions($addresses: _text!, $searchFields: jsonb!) {
  search_positions_on_subject(
    args: {
      addresses: $addresses
      search_fields: $searchFields
    }
  ) {
    id
    shares
    vault { term_id }
  }
}
```

## Best Practices

1. **Use backend functions** for complex filtering
2. **Faster execution** in database vs client
3. **Less data transfer** over network
4. **More maintainable** code
