---
title: Subject Predicates
sidebar_label: Subject Predicates
sidebar_position: 6
description: Query subject-predicate relationship aggregates
keywords: [graphql, triple, subject, predicate, relationships, knowledge graph]
---

import GraphQLPlaygroundCustom from '@site/src/components/GraphQLPlaygroundCustom';

# Subject Predicates

Query aggregated subject-predicate pairs across the knowledge graph. Each record represents a unique (subject, predicate) combination with aggregate stats across all triples sharing that pair.

## Query Structure

```graphql
query GetSubjectPredicates($subjectId: String!, $limit: Int!) {
  subject_predicates(
    where: { subject_id: { _eq: $subjectId } }
    order_by: { triple_count: desc }
    limit: $limit
  ) {
    subject_id
    predicate_id
    triple_count
    total_position_count
    total_market_cap
    subject {
      label
      image
    }
    predicate {
      label
    }
    triples(limit: 5) {
      term_id
      object {
        label
      }
    }
  }
}
```

## Response Fields

| Field | Type | Nullable | Description |
|-------|------|----------|-------------|
| `subject_id` | `String` | No | Subject atom ID |
| `predicate_id` | `String` | No | Predicate atom ID |
| `triple_count` | `Int` | No | Number of triples with this subject-predicate pair |
| `total_position_count` | `Int` | No | Total positions across all triples |
| `total_market_cap` | `numeric` | No | Combined market cap of all triples |

### Relationships

| Field | Type | Description |
|-------|------|-------------|
| `subject` | `atoms` | Subject atom entity |
| `predicate` | `atoms` | Predicate atom entity |
| `triples` | `[triples]` | All triples with this subject-predicate pair |
| `triples_aggregate` | `triples_aggregate` | Aggregate over triples |

## Primary Key Lookup

```graphql
query GetSubjectPredicate($subjectId: String!, $predicateId: String!) {
  subject_predicates_by_pk(
    subject_id: $subjectId
    predicate_id: $predicateId
  ) {
    triple_count
    total_position_count
    total_market_cap
    triples {
      term_id
      object { label }
    }
  }
}
```

## Interactive Example

export const subjectPredicateQueries = [
  {
    id: 'subject-predicates',
    title: 'Subject Predicates',
    query: `query GetSubjectPredicates($subjectId: String!, $limit: Int!) {
  subject_predicates(
    where: { subject_id: { _eq: $subjectId } }
    order_by: { triple_count: desc }
    limit: $limit
  ) {
    predicate_id
    triple_count
    total_position_count
    total_market_cap
    predicate { label }
    triples(limit: 3) {
      object { label }
    }
  }
}`,
    variables: {
      subjectId: '0x57d94c116a33bb460428eced262b7ae2ec6f865e7aceef6357cec3d034e8ea21',
      limit: 10
    }
  }
];

<GraphQLPlaygroundCustom queries={subjectPredicateQueries} />

## Use Cases

### Knowledge Graph Exploration

Find all predicates used with a subject and their objects:

```typescript
async function exploreEntity(subjectId: string) {
  const query = `
    query ExploreEntity($subjectId: String!) {
      subject_predicates(
        where: { subject_id: { _eq: $subjectId } }
        order_by: { total_market_cap: desc }
      ) {
        predicate { label }
        triple_count
        total_market_cap
        triples(order_by: { term: { total_market_cap: desc } }, limit: 5) {
          object { label image }
        }
      }
    }
  `

  return client.request(query, { subjectId })
}
```

## Related

- [Filter by Predicate/Object](./filter-by-predicate-object) - Filter triples by predicate and object
- [Filter by Subject](./filter-by-subject) - Filter triples by subject
- [Nested Queries](./nested-queries) - Complex triple relationship traversal
