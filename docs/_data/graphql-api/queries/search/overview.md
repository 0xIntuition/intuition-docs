---
title: Search Queries
sidebar_label: Overview
sidebar_position: 1
description: Search atoms, terms, and positions
keywords: [graphql, search, query, find, filter]
---

# Search Queries

Search the Intuition knowledge graph for atoms, terms, and positions using text-based queries.

## Available Queries

| Query | Description |
|-------|-------------|
| [`search_term`](./search-term) | Search atoms and terms by text |
| [`search_term_from_following`](./search-from-following) | Search within followed accounts' activity |
| [`search_positions_on_subject`](./search-positions) | Find positions related to a subject |

## Quick Start

```typescript
import { GraphQLClient } from 'graphql-request'
import { API_URL_PROD } from '@0xintuition/graphql'

const client = new GraphQLClient(API_URL_PROD)

// Search for atoms
const query = `
  query SearchTerms($search: String!, $limit: Int!) {
    search_term(
      args: { search: $search }
      limit: $limit
    ) {
      term_id
      label
      image
      type
    }
  }
`

const data = await client.request(query, {
  search: 'ethereum',
  limit: 10
})
```

## Search Features

- **Full-text search**: Search across atom labels and data
- **Case-insensitive**: Searches ignore case
- **Partial matching**: Find partial term matches
- **Social filtering**: Search within your network

## Related Documentation

- [Search Term](./search-term) - Basic search
- [Search from Following](./search-from-following) - Social search
- [Search Positions](./search-positions) - Position-based search
