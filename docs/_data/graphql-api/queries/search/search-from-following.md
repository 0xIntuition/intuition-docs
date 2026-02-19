---
title: Search from Following
sidebar_label: Search from Following
sidebar_position: 3
description: Search within followed accounts' activity
keywords: [graphql, search, following, social, network]
---

import GraphQLPlaygroundCustom from '@site/src/components/GraphQLPlaygroundCustom';

# Search from Following

Search for terms within the context of accounts you follow, prioritizing results from your social network.

## Query Structure

```graphql
query SearchTermFromFollowing(
  $address: String!
  $query: String!
  $limit: Int
) {
  search_term_from_following(
    args: {
      address: $address
      query: $query
    }
    limit: $limit
  ) {
    term_id
    label
    image
    type
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
| `address` | `String` | Yes | Account address whose following list to use |
| `query` | `String` | Yes | Search query text |
| `limit` | `Int` | No | Maximum results |

```json
{
  "address": "0xd8da6bf26964af9d7eed9e03e53415d37aa96045",
  "query": "defi",
  "limit": 10
}
```

## Use Cases

### Network-Aware Search

Search prioritizing content from your network:

```typescript
async function searchInNetwork(
  address: string,
  searchQuery: string
) {
  const gqlQuery = `
    query SearchFromFollowing(
      $address: String!
      $query: String!
    ) {
      network: search_term_from_following(
        args: { address: $address, query: $query }
        limit: 10
      ) {
        term_id
        label
        image
        creator { label }
      }
      global: search_term(
        args: { query: $query }
        limit: 10
      ) {
        term_id
        label
        image
      }
    }
  `

  const data = await client.request(gqlQuery, {
    address,
    query: searchQuery
  })

  return {
    fromNetwork: data.network,
    global: data.global
  }
}
```

### React Social Search

```tsx
function SocialSearch({ address }: { address: string }) {
  const [query, setQuery] = useState('')

  const { data, loading } = useQuery(SEARCH_FROM_FOLLOWING, {
    variables: { address, query },
    skip: query.length < 2
  })

  return (
    <div>
      <input
        placeholder="Search your network..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <div className="results">
        <h3>From Your Network</h3>
        {data?.search_term_from_following.map(atom => (
          <AtomCard key={atom.term_id} atom={atom} />
        ))}
      </div>
    </div>
  )
}
```

## Related

- [Search Term](./search-term) - Global search
- [Following](/docs/graphql-api/queries/accounts/following) - Following relationships
