---
title: Search Term
sidebar_label: Search Term
sidebar_position: 2
description: Search atoms and terms by text
keywords: [graphql, search, term, atoms, text]
---

import GraphQLPlaygroundCustom from '@site/src/components/GraphQLPlaygroundCustom';

# Search Term

Search for atoms by their label or data content.

## Query Structure

```graphql
query SearchTerm(
  $query: String!
  $limit: Int
  $offset: Int
) {
  search_term(
    args: { query: $query }
    limit: $limit
    offset: $offset
  ) {
    term_id
    label
    image
    emoji
    type
    data
    created_at
    creator {
      label
      image
    }
  }
}
```

## Variables

| Variable | Type | Required | Description |
|----------|------|----------|-------------|
| `query` | `String` | Yes | Search query text |
| `limit` | `Int` | No | Maximum results (default: 20) |
| `offset` | `Int` | No | Pagination offset |

```json
{
  "query": "ethereum",
  "limit": 10,
  "offset": 0
}
```

## Response Fields

The function returns `atoms` rows, so all atom fields are available:

| Field | Type | Description |
|-------|------|-------------|
| `term_id` | `String` | Unique atom identifier |
| `label` | `String` | Human-readable label |
| `image` | `String` | Image URL (IPFS) |
| `emoji` | `String` | Associated emoji |
| `type` | `String` | Atom type (Thing, Person, Organization) |
| `data` | `String` | IPFS data URI |
| `created_at` | `DateTime` | Creation timestamp |
| `creator` | `Account` | Creator account |

## Expected Response

```json
{
  "data": {
    "search_term": [
      {
        "term_id": "0x57d94c116a33bb460428eced262b7ae2ec6f865e7aceef6357cec3d034e8ea21",
        "label": "Ethereum",
        "image": "ipfs://QmXnnyufdzAWL5CqZ2RnSNgPbvCc1ALT73s6epPrRnZ1Xy",
        "emoji": "⟠",
        "type": "Thing",
        "data": "ipfs://Qm...",
        "created_at": "2024-01-01T00:00:00Z",
        "creator": {
          "label": "vitalik.eth",
          "image": "ipfs://Qm..."
        }
      }
    ]
  }
}
```

## Interactive Example

export const searchQueries = [
  {
    id: 'basic-search',
    title: 'Basic Search',
    query: `query SearchTerm($query: String!, $limit: Int!) {
  search_term(args: { query: $query }, limit: $limit) {
    term_id
    label
    image
    type
  }
}`,
    variables: {
      query: 'ethereum',
      limit: 10
    }
  },
  {
    id: 'search-with-creator',
    title: 'Search with Creator Info',
    query: `query SearchTerm($query: String!, $limit: Int!) {
  search_term(args: { query: $query }, limit: $limit) {
    term_id
    label
    image
    type
    creator {
      id
      label
      image
    }
    created_at
  }
}`,
    variables: {
      query: 'bitcoin',
      limit: 5
    }
  }
];

<GraphQLPlaygroundCustom queries={searchQueries} />

## Use Cases

### Search Autocomplete

Implement search-as-you-type:

```typescript
import { debounce } from 'lodash'

async function searchAtoms(searchQuery: string, limit: number = 10) {
  if (searchQuery.length < 2) return []

  const gqlQuery = `
    query SearchTerm($query: String!, $limit: Int!) {
      search_term(args: { query: $query }, limit: $limit) {
        term_id
        label
        image
        type
      }
    }
  `

  const data = await client.request(gqlQuery, { query: searchQuery, limit })
  return data.search_term
}

// Debounced version for autocomplete
const debouncedSearch = debounce(searchAtoms, 300)
```

### Filter by Type

Search and filter by atom type:

```typescript
async function searchByType(
  searchQuery: string,
  type: 'Thing' | 'Person' | 'Organization'
) {
  const gqlQuery = `
    query SearchByType($query: String!, $type: String!) {
      search_term(
        args: { query: $query }
        where: { type: { _eq: $type } }
        limit: 20
      ) {
        term_id
        label
        image
        type
      }
    }
  `

  return client.request(gqlQuery, { query: searchQuery, type })
}
```

## Search Tips

1. **Minimum length**: Search works best with 2+ characters
2. **Case insensitive**: "ethereum" and "Ethereum" return same results
3. **Partial matching**: "eth" matches "Ethereum"
4. **Combine with filters**: Add `where` clause for type/creator filtering

## Best Practices

1. **Debounce input** - Wait 300ms after typing before searching
2. **Show loading state** - Indicate when search is in progress
3. **Handle empty results** - Show helpful message when no matches
4. **Limit results** - Start with 5-10 results, load more on demand

## Related

- [Search from Following](./search-from-following) - Social search
- [Search Positions](./search-positions) - Position search
- [List Atoms](/docs/graphql-api/queries/atoms/list-filter) - Filter-based atom queries
