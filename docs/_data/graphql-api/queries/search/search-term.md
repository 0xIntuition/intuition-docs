---
title: Search Term
sidebar_label: Search Term
sidebar_position: 1
description: Semantic search for atoms and triples
keywords: [graphql, search, term, semantic, query]
---

import GraphQLPlaygroundCustom from '@site/src/components/GraphQLPlaygroundCustom';

# Search Term Query

Perform semantic search across atoms and triples. Returns results ranked by relevance.

## Query Structure

```graphql
query SearchTerm(
  $query: String!
  $limit: Int
  $offset: Int
) {
  search_term(
    args: { search_query: $query }
    limit: $limit
    offset: $offset
  ) {
    term_id
    rank
    term {
      atom {
        id
        label
        image
        type
      }
      triple {
        id
        subject { label }
        predicate { label }
        object { label }
      }
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

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `search_query` | String | Yes | Search query string |
| `limit` | Int | No | Maximum results |
| `offset` | Int | No | Pagination offset |

## Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `term_id` | String | Term identifier |
| `rank` | Float | Relevance score |
| `term` | Object | Term details (atom or triple) |

## Interactive Example

export const searchQueries = [
  {
    id: 'search-term',
    title: 'Search Terms',
    query: `query SearchTerm($query: String!, $limit: Int!) {
  search_term(
    args: { search_query: $query }
    limit: $limit
  ) {
    term_id
    rank
    term {
      atom {
        id
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
}`,
    variables: {
      query: 'ethereum',
      limit: 10
    }
  }
];

<GraphQLPlaygroundCustom queries={searchQueries} />

## Use Cases

### Search Component

```typescript
import { useLazyQuery, gql } from '@apollo/client';
import { useState, useCallback } from 'react';
import debounce from 'lodash/debounce';

const SEARCH_TERM = gql`
  query SearchTerm($query: String!, $limit: Int!) {
    search_term(
      args: { search_query: $query }
      limit: $limit
    ) {
      term_id
      rank
      term {
        atom { id label image }
        triple {
          subject { label }
          predicate { label }
          object { label }
        }
      }
    }
  }
`;

function SearchBar() {
  const [query, setQuery] = useState('');
  const [search, { data, loading }] = useLazyQuery(SEARCH_TERM);

  const debouncedSearch = useCallback(
    debounce((q: string) => {
      if (q.length >= 2) {
        search({ variables: { query: q, limit: 10 } });
      }
    }, 300),
    [search]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    debouncedSearch(e.target.value);
  };

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="Search atoms and triples..."
      />
      {loading && <p>Searching...</p>}
      {data?.search_term?.map(result => (
        <div key={result.term_id}>
          {result.term.atom ? (
            <span>{result.term.atom.label}</span>
          ) : (
            <span>
              {result.term.triple.subject.label} →
              {result.term.triple.predicate.label} →
              {result.term.triple.object.label}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
```

### Autocomplete

```typescript
const AUTOCOMPLETE = gql`
  query Autocomplete($query: String!) {
    search_term(
      args: { search_query: $query }
      limit: 5
    ) {
      term {
        atom { label }
      }
    }
  }
`;

function useSuggestions(query: string) {
  const [getSuggestions, { data }] = useLazyQuery(AUTOCOMPLETE);

  useEffect(() => {
    if (query.length >= 2) {
      getSuggestions({ variables: { query } });
    }
  }, [query, getSuggestions]);

  return data?.search_term?.map(r => r.term.atom?.label).filter(Boolean) || [];
}
```

## Best Practices

1. **Debounce queries** - Don't search on every keystroke
2. **Minimum query length** - Require 2-3 characters before searching
3. **Show relevance** - Use rank to sort/highlight results
4. **Handle empty states** - Show "no results" gracefully

## Related

- [Search Positions on Subject](./search-positions-on-subject) - Search positions
- [Atom Queries](/docs/graphql-api/queries/atoms/search) - Direct atom search
