---
title: List and Filter Atoms
sidebar_label: List & Filter
sidebar_position: 2
description: Filter atoms by type, creator, date, and other criteria
keywords: [graphql, atom, filter, list, where, order by]
---

import GraphQLPlaygroundCustom from '@site/src/components/GraphQLPlaygroundCustom';

# List and Filter Atoms

Query multiple atoms with filtering, sorting, and pagination to find specific entities in the knowledge graph.

## Query Structure

```graphql
query GetAtomsByType($type: atom_type!, $limit: Int!) {
  atoms(
    where: { type: { _eq: $type } }
    order_by: { created_at: desc }
    limit: $limit
  ) {
    term_id
    label
    image
    type
    created_at
  }
}
```

## Variables

```json
{
  "type": "Person",
  "limit": 20
}
```

## Interactive Examples

export const listFilterQueries = [
  {
    id: 'by-type',
    title: 'Filter by Type',
    query: `query GetAtomsByType($type: atom_type!, $limit: Int!) {
  atoms(
    where: { type: { _eq: $type } }
    order_by: { created_at: desc }
    limit: $limit
  ) {
    term_id
    label
    image
    type
    created_at
  }
}`,
    variables: {
      type: 'Person',
      limit: 20
    }
  },
  {
    id: 'by-creator',
    title: 'Filter by Creator',
    query: `query GetAtomsByCreator($creatorId: String!, $limit: Int!) {
  atoms(
    where: { creator_id: { _eq: $creatorId } }
    order_by: { created_at: desc }
    limit: $limit
  ) {
    term_id
    label
    image
    type
    created_at
    creator {
      id
      label
    }
  }
}`,
    variables: {
      creatorId: '0xd8da6bf26964af9d7eed9e03e53415d37aa96045',
      limit: 20
    }
  },
  {
    id: 'by-date-range',
    title: 'Filter by Date Range',
    query: `query GetRecentAtoms($since: timestamptz!, $limit: Int!) {
  atoms(
    where: { created_at: { _gte: $since } }
    order_by: { created_at: desc }
    limit: $limit
  ) {
    term_id
    label
    image
    created_at
  }
}`,
    variables: {
      since: '2024-01-01T00:00:00Z',
      limit: 20
    }
  },
  {
    id: 'search-label',
    title: 'Search by Label',
    query: `query SearchAtomsByLabel($search: String!, $limit: Int!) {
  atoms(
    where: { label: { _ilike: $search } }
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

<GraphQLPlaygroundCustom queries={listFilterQueries} />

## Common Filter Patterns

### Filter by Type

```graphql
query GetPersonAtoms {
  atoms(
    where: { type: { _eq: Person } }
    limit: 10
  ) {
    term_id
    label
  }
}
```

**Available types**: `Person`, `Organization`, `Thing`

### Filter by Creator

```graphql
query GetUserCreatedAtoms($creatorId: String!) {
  atoms(
    where: { creator_id: { _eq: $creatorId } }
    order_by: { created_at: desc }
  ) {
    term_id
    label
  }
}
```

### Filter by Date Range

```graphql
query GetAtomsInRange($start: timestamptz!, $end: timestamptz!) {
  atoms(
    where: {
      created_at: { _gte: $start, _lte: $end }
    }
    order_by: { created_at: desc }
  ) {
    term_id
    label
    created_at
  }
}
```

### Search by Label (Case-Insensitive)

```graphql
query SearchAtoms($search: String!) {
  atoms(
    where: { label: { _ilike: $search } }
    limit: 20
  ) {
    term_id
    label
  }
}
```

**Note**: Use `%` wildcards for partial matching: `%ethereum%`

### Multiple Filters Combined

```graphql
query GetFilteredAtoms(
  $type: atom_type!
  $since: timestamptz!
  $search: String!
) {
  atoms(
    where: {
      _and: [
        { type: { _eq: $type } }
        { created_at: { _gte: $since } }
        { label: { _ilike: $search } }
      ]
    }
    order_by: { created_at: desc }
    limit: 20
  ) {
    term_id
    label
    type
    created_at
  }
}
```

## Sorting Options

### By Creation Date

```graphql
atoms(order_by: { created_at: desc })
```

### By Label (Alphabetical)

```graphql
atoms(order_by: { label: asc })
```

### Multiple Sort Fields

```graphql
atoms(
  order_by: [
    { type: asc }
    { created_at: desc }
  ]
)
```

## Pagination

### Offset-Based Pagination

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

**Variables**:
```json
{
  "limit": 20,
  "offset": 40
}
```

## Use Cases

### Build Entity Directory

List all atoms of a specific type:

```typescript
const query = `
  query GetAllPersons($limit: Int!, $offset: Int!) {
    atoms(
      where: { type: { _eq: Person } }
      order_by: { label: asc }
      limit: $limit
      offset: $offset
    ) {
      term_id
      label
      image
    }
  }
`
```

### User Dashboard

Show atoms created by a user:

```typescript
const query = `
  query GetMyAtoms($creatorId: String!) {
    atoms(
      where: { creator_id: { _eq: $creatorId } }
      order_by: { created_at: desc }
    ) {
      term_id
      label
      created_at
    }
  }
`
```

### Recent Activity Feed

Display recently created atoms:

```typescript
const query = `
  query GetRecentAtoms($limit: Int!) {
    atoms(
      order_by: { created_at: desc }
      limit: $limit
    ) {
      term_id
      label
      created_at
      creator {
        label
      }
    }
  }
`
```

## Performance Considerations

- **Use specific filters** to reduce result set size
- **Always include limit** to prevent fetching too much data
- **Add order_by** for consistent pagination
- **Use indexed fields** (type, creator_id, created_at) for better performance

## Related Patterns

- [Single Atom](/docs/guides/developer-tools/graphql-api/queries/atoms/single-atom) - Fetch individual atom
- [Atom Search](/docs/guides/developer-tools/graphql-api/queries/atoms/search) - Full-text search
- [Best Practices: Filtering](/docs/guides/developer-tools/graphql-api/best-practices/filtering) - Efficient filtering strategies

## Best Practices

1. **Always use variables** for dynamic filter values
2. **Include limit** to prevent over-fetching
3. **Use appropriate operators**: `_eq` for exact matches, `_ilike` for searches
4. **Combine with aggregates** when you need total counts
5. **Order results** for consistent pagination
