---
title: Search Queries
sidebar_label: Search
sidebar_position: 8
description: Search for terms, atoms, and positions
keywords: [graphql, search, find, terms, full-text]
---

# Search Queries

The API provides several search functions for finding terms, atoms, and positions across the knowledge graph.

## Search Terms

Search for terms (atoms and triples) by label or content:

```graphql
query SearchTerms(
  $query: String!
  $limit: Int!
  $offset: Int
) {
  search_term(
    args: { search_query: $query }
    limit: $limit
    offset: $offset
  ) {
    id
    atom {
      term_id
      label
      image
      type
    }
    triple {
      term_id
      subject { label }
      predicate { label }
      object { label }
    }
  }
}
```

## Variables

```json
{
  "query": "ethereum",
  "limit": 20,
  "offset": 0
}
```

## Search with Aggregation

```graphql
query SearchTermsWithCount(
  $query: String!
  $limit: Int!
) {
  total: search_term_aggregate(
    args: { search_query: $query }
  ) {
    aggregate {
      count
    }
  }
  search_term(
    args: { search_query: $query }
    limit: $limit
  ) {
    id
    atom {
      term_id
      label
      image
      type
    }
    triple {
      term_id
      subject { label }
      predicate { label }
      object { label }
    }
  }
}
```

## Search from Following

Search terms that accounts you follow have interacted with:

```graphql
query SearchTermsFromFollowing(
  $accountId: String!
  $query: String!
  $limit: Int!
) {
  search_term_from_following(
    args: {
      address: $accountId
      search_query: $query
    }
    limit: $limit
  ) {
    id
    atom {
      term_id
      label
      image
    }
    triple {
      subject { label }
      predicate { label }
      object { label }
    }
  }
}
```

## Search Positions on Subject

Find positions where the subject matches a search query:

```graphql
query SearchPositionsOnSubject(
  $query: String!
  $limit: Int!
) {
  search_positions_on_subject(
    args: { search_query: $query }
    limit: $limit
  ) {
    id
    shares
    account {
      id
      label
    }
    vault {
      term {
        triple {
          subject { label }
          predicate { label }
          object { label }
        }
      }
    }
  }
}
```

## Filter Atoms by Label

For simple label matching, use standard filtering:

```graphql
query FilterAtomsByLabel($pattern: String!, $limit: Int!) {
  atoms(
    where: { label: { _ilike: $pattern } }
    limit: $limit
    order_by: { created_at: desc }
  ) {
    term_id
    label
    image
    type
  }
}
```

Variables:
```json
{
  "pattern": "%ethereum%",
  "limit": 20
}
```

## Search by Type

Combine search with type filtering:

```graphql
query SearchAtomsByType(
  $query: String!
  $type: atom_type!
  $limit: Int!
) {
  search_term(
    args: { search_query: $query }
    where: {
      atom: { type: { _eq: $type } }
    }
    limit: $limit
  ) {
    id
    atom {
      term_id
      label
      image
      type
    }
  }
}
```

## Use Cases

### Autocomplete Search

```typescript
async function searchAutocomplete(query: string) {
  if (query.length < 2) return []

  const gqlQuery = `
    query SearchAutocomplete($query: String!) {
      search_term(
        args: { search_query: $query }
        limit: 10
      ) {
        atom {
          term_id
          label
          image
          type
        }
        triple {
          term_id
          subject { label }
          predicate { label }
          object { label }
        }
      }
    }
  `

  const data = await client.request(gqlQuery, { query })

  return data.search_term.map(result => ({
    id: result.atom?.term_id || result.triple?.term_id,
    label: result.atom?.label ||
      `${result.triple?.subject?.label} ${result.triple?.predicate?.label} ${result.triple?.object?.label}`,
    type: result.atom ? 'atom' : 'triple',
    image: result.atom?.image
  }))
}
```

### Filtered Search

```typescript
async function searchWithFilters(
  query: string,
  filters: { type?: string; creator?: string }
) {
  const where: any = {}

  if (filters.type) {
    where.atom = { type: { _eq: filters.type } }
  }

  const gqlQuery = `
    query FilteredSearch($query: String!, $where: search_term_bool_exp) {
      search_term(
        args: { search_query: $query }
        where: $where
        limit: 50
      ) {
        atom {
          term_id
          label
          image
          type
          creator_id
        }
      }
    }
  `

  return client.request(gqlQuery, { query, where })
}
```

## Best Practices

1. **Debounce search input** for autocomplete (300-500ms)
2. **Use limit** to control result size
3. **Combine with filters** for targeted results
4. **Cache common searches** to reduce API calls
5. **Show search result types** (atom vs triple) in UI

## Related Queries

- [List Atoms](/docs/graphql-api/queries/atoms/list-filter) - Filter atoms
- [Predicate Objects](/docs/graphql-api/queries/advanced/predicate-objects) - Browse relationships
- [Following Search](/docs/graphql-api/queries/accounts/following) - Social search
