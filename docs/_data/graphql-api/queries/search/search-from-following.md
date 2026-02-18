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
  $account_id: String!
  $search: String!
  $limit: Int
) {
  search_term_from_following(
    args: {
      account_id: $account_id
      search: $search
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
| `account_id` | `String` | Yes | Account whose following list to use |
| `search` | `String` | Yes | Search query text |
| `limit` | `Int` | No | Maximum results |

```json
{
  "account_id": "0xd8da6bf26964af9d7eed9e03e53415d37aa96045",
  "search": "defi",
  "limit": 10
}
```

## Use Cases

### Network-Aware Search

Search prioritizing content from your network:

```typescript
async function searchInNetwork(
  accountId: string,
  query: string
) {
  const gqlQuery = `
    query SearchFromFollowing(
      $account_id: String!
      $search: String!
    ) {
      network: search_term_from_following(
        args: { account_id: $account_id, search: $search }
        limit: 10
      ) {
        term_id
        label
        image
        creator { label }
      }
      global: search_term(
        args: { search: $search }
        limit: 10
      ) {
        term_id
        label
        image
      }
    }
  `

  const data = await client.request(gqlQuery, {
    account_id: accountId,
    search: query
  })

  return {
    fromNetwork: data.network,
    global: data.global
  }
}
```

### React Social Search

```tsx
function SocialSearch({ accountId }: { accountId: string }) {
  const [query, setQuery] = useState('')

  const { data, loading } = useQuery(SEARCH_FROM_FOLLOWING, {
    variables: { account_id: accountId, search: query },
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
