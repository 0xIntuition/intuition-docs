---
title: Complex Filtering
sidebar_label: Complex Filtering
sidebar_position: 10
description: Multi-criteria search and filtering
keywords: [graphql, example, filter, search, complex, multi-criteria]
---

import GraphQLPlaygroundCustom from '@site/src/components/GraphQLPlaygroundCustom';

# Example: Complex Filtering

Implement multi-criteria search across entities.

## Query

export const complexFilterQueries = [
  {
    id: 'global-search',
    title: 'Global Search',
    query: `query GlobalSearch($searchTerm: String!, $limit: Int!) {
  accounts(
    where: {
      _or: [
        { label: { _ilike: $searchTerm } }
        { atom: { label: { _ilike: $searchTerm } } }
      ]
    }
    limit: $limit
  ) {
    id
    label
    image
  }
  atoms(
    where: { label: { _ilike: $searchTerm } }
    limit: $limit
  ) {
    term_id
    label
    image
    type
  }
  triples(
    where: {
      _or: [
        { subject: { label: { _ilike: $searchTerm } } }
        { predicate: { label: { _ilike: $searchTerm } } }
        { object: { label: { _ilike: $searchTerm } } }
      ]
    }
    limit: $limit
  ) {
    term_id
    subject { label }
    predicate { label }
    object { label }
  }
}`,
    variables: {
      searchTerm: '%ethereum%',
      limit: 10
    }
  }
];

<GraphQLPlaygroundCustom queries={complexFilterQueries} />
