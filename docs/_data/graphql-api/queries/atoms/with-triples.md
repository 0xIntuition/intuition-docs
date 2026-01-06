---
title: Atom with Related Triples
sidebar_label: With Triples
sidebar_position: 4
description: Find triples where an atom appears as subject, predicate, or object
keywords: [graphql, atom, triple, relationships, subject, predicate, object]
---

import GraphQLPlaygroundCustom from '@site/src/components/GraphQLPlaygroundCustom';

# Atom with Related Triples

Discover relationships by finding all triples where an atom appears as subject, predicate, or object.

## Query Structure

```graphql
query GetAtomWithTriples($atomId: String!, $limit: Int!) {
  atom(term_id: $atomId) {
    term_id
    label
    image
    as_subject_triples(limit: $limit, order_by: { created_at: desc }) {
      term_id
      predicate { label }
      object { label image }
    }
    as_object_triples(limit: $limit, order_by: { created_at: desc }) {
      term_id
      subject { label image }
      predicate { label }
    }
  }
}
```

## Interactive Examples

export const tripleQueries = [
  {
    id: 'related-triples',
    title: 'Find Related Triples',
    query: `query GetAtomWithTriples($atomId: String!, $limit: Int!) {
  atom(term_id: $atomId) {
    term_id
    label
    image
    as_subject_triples(limit: $limit, order_by: { created_at: desc }) {
      term_id
      predicate { term_id label }
      object { term_id label image }
    }
    as_object_triples(limit: $limit, order_by: { created_at: desc }) {
      term_id
      subject { term_id label image }
      predicate { term_id label }
    }
  }
}`,
    variables: {
      atomId: '0xf12dba36ffebb8e05ae49d3f9220b1994295662ccdc573f44aff7b51f8ad8fd6',
      limit: 10
    }
  },
  {
    id: 'filtered-relationships',
    title: 'Filter by Predicate',
    query: `query GetSpecificRelationships(
  $atomId: String!
  $predicateId: String!
  $limit: Int!
) {
  atom(term_id: $atomId) {
    term_id
    label
    as_subject_triples(
      where: { predicate_id: { _eq: $predicateId } }
      limit: $limit
    ) {
      term_id
      object { label image }
    }
  }
}`,
    variables: {
      atomId: '0xf12dba36ffebb8e05ae49d3f9220b1994295662ccdc573f44aff7b51f8ad8fd6',
      predicateId: '0x...',
      limit: 10
    }
  }
];

<GraphQLPlaygroundCustom queries={tripleQueries} />

## Use Cases

### Discover Relationships

Find all relationships for an atom:

```typescript
const query = `
  query GetAtomRelationships($atomId: String!) {
    atom(term_id: $atomId) {
      term_id
      label
      as_subject_triples(limit: 20) {
        predicate { label }
        object { label }
      }
      as_object_triples(limit: 20) {
        subject { label }
        predicate { label }
      }
    }
  }
`
```

### Build Knowledge Graph

Construct a graph view of relationships:

```typescript
const query = `
  query GetKnowledgeGraph($atomId: String!, $depth: Int!) {
    atom(term_id: $atomId) {
      term_id
      label
      as_subject_triples(limit: $depth) {
        term_id
        predicate { label }
        object {
          term_id
          label
          as_subject_triples(limit: 5) {
            object { label }
          }
        }
      }
    }
  }
`
```

## Performance Considerations

- **Limit results**: Always use limit to prevent over-fetching
- **Filter by predicate**: Narrow results to specific relationship types
- **Avoid deep nesting**: Limit graph traversal depth

## Related Patterns

- [Single Triple](/docs/graphql-api/queries/triples/single-triple) - Query triple details
- [Filter Triples](/docs/graphql-api/queries/triples/filter-by-subject) - Advanced filtering

## Best Practices

1. **Use limit** on nested triple queries
2. **Filter by predicate** when looking for specific relationships
3. **Order by created_at** for chronological results
4. **Avoid excessive nesting** to prevent slow queries
