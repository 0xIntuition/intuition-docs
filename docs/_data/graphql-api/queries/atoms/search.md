---
title: Atom Search
sidebar_label: Search
sidebar_position: 5
description: Full-text and pattern matching search for atoms
keywords: [graphql, atom, search, full-text, ilike]
---

import GraphQLPlaygroundCustom from '@site/src/components/GraphQLPlaygroundCustom';

# Atom Search

Search atoms using pattern matching and full-text query patterns.

## Query Structure

### Pattern Matching Search

```graphql
query SearchAtoms($search: String!, $limit: Int!) {
  atoms(
    where: {
      _or: [
        { label: { _ilike: $search } }
        { data: { _ilike: $search } }
      ]
    }
    limit: $limit
  ) {
    term_id
    label
    image
    type
  }
}
```

## Interactive Examples

export const searchQueries = [
  {
    id: 'pattern-search',
    title: 'Pattern Matching',
    query: `query SearchAtoms($search: String!, $limit: Int!) {
  atoms(
    where: {
      _or: [
        { label: { _ilike: $search } }
        { data: { _ilike: $search } }
      ]
    }
    order_by: { created_at: desc }
    limit: $limit
  ) {
    term_id
    label
    image
    type
  }
}`,
    variables: {
      search: '%ethereum%',
      limit: 20
    }
  }
];

<GraphQLPlaygroundCustom queries={searchQueries} />

## Search Patterns

### Case-Insensitive Search

```graphql
query SearchCaseInsensitive($term: String!) {
  atoms(
    where: { label: { _ilike: $term } }
    limit: 20
  ) {
    term_id
    label
  }
}
```

### Multi-Field Search

```graphql
query MultiFieldSearch($search: String!) {
  atoms(
    where: {
      _or: [
        { label: { _ilike: $search } }
        { data: { _ilike: $search } }
      ]
    }
  ) {
    term_id
    label
  }
}
```

### Filter Search by Type

```graphql
query SearchPersons($search: String!, $type: atom_type!) {
  atoms(
    where: {
      type: { _eq: $type }
      label: { _ilike: $search }
    }
  ) {
    term_id
    label
  }
}
```

## Use Cases

### Autocomplete

```typescript
const query = `
  query Autocomplete($search: String!) {
    atoms(
      where: { label: { _ilike: $search } }
      order_by: { label: asc }
      limit: 10
    ) {
      term_id
      label
      image
    }
  }
`

// User types "eth" → search for "%eth%"
```

### Global Search

```typescript
const query = `
  query GlobalSearch($search: String!) {
    atoms(
      where: { label: { _ilike: $search } }
      limit: 20
    ) {
      term_id
      label
      type
    }
  }
`
```

## Performance Considerations

- **Use wildcards sparingly**: `%term%` is slower than `term%`
- **Limit results**: Always include limit

## Related Patterns

- [Global Search](/docs/graphql-api/examples/complex-filtering) - Search across all entities
- [Best Practices: Performance](/docs/graphql-api/best-practices/performance) - Optimize searches

## Best Practices

1. **Use `_ilike` for case-insensitive** searches
2. **Add wildcards strategically**: `%term` or `term%` or `%term%`
3. **Combine with type filters** to narrow results
4. **Limit results** to prevent over-fetching
