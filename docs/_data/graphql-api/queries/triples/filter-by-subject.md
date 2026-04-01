---
title: Filter Triples by Subject
sidebar_label: By Subject
sidebar_position: 2
description: Find all triples with a specific atom as subject
keywords: [graphql, triple, subject, filter, relationships]
---

import GraphQLPlaygroundCustom from '@site/src/components/GraphQLPlaygroundCustom';

# Filter Triples by Subject

Query all triples where a specific atom is the subject.

## Query Structure

```graphql
query GetTriplesBySubject($subjectId: String!, $limit: Int!) {
  triples(
    where: { subject_id: { _eq: $subjectId } }
    order_by: { created_at: desc }
    limit: $limit
  ) {
    term_id
    predicate { label }
    object { label image }
  }
}
```

## Interactive Example

export const subjectQueries = [
  {
    id: 'by-subject',
    title: 'Triples by Subject',
    query: `query GetTriplesBySubject($subjectId: String!, $limit: Int!) {
  triples(
    where: { subject_id: { _eq: $subjectId } }
    order_by: { created_at: desc }
    limit: $limit
  ) {
    term_id
    predicate { term_id label }
    object { term_id label image }
    created_at
  }
}`,
    variables: {
      subjectId: '0x906527aae4af914b1ac01ff9adfdda5dafde3b5e21f84045e0660b0a15c07769',
      limit: 20
    }
  }
];

<GraphQLPlaygroundCustom queries={subjectQueries} />

## Best Practices

1. **Use indexed subject_id field** for performance
2. **Order by created_at** for chronological results
3. **Include limit** to prevent over-fetching
4. **Filter by predicate** to narrow relationship types
