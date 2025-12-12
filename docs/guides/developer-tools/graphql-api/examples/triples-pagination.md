---
title: Triples Pagination
sidebar_label: Triples Pagination
sidebar_position: 2
description: Paginate through triples with total count
keywords: [graphql, example, triple, pagination, offset]
---

import GraphQLPlaygroundCustom from '@site/src/components/GraphQLPlaygroundCustom';

# Example: Triples Pagination

Paginate through triples with total count for UI.

## Query

export const triplesPaginationQueries = [
  {
    id: 'triples-page',
    title: 'Paginated Triples',
    query: `query GetTriplesPage($limit: Int!, $offset: Int!) {
  total: triples_aggregate {
    aggregate {
      count
    }
  }
  triples(
    limit: $limit
    offset: $offset
    order_by: { created_at: desc }
  ) {
    term_id
    created_at
    subject { label image }
    predicate { label }
    object { label image }
  }
}`,
    variables: {
      limit: 20,
      offset: 0
    }
  }
];

<GraphQLPlaygroundCustom queries={triplesPaginationQueries} />
