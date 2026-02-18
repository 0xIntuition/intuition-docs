---
title: List Accounts
sidebar_label: List Accounts
sidebar_position: 3
description: Query multiple accounts with filtering and pagination
keywords: [graphql, accounts, list, filter, pagination]
---

import GraphQLPlaygroundCustom from '@site/src/components/GraphQLPlaygroundCustom';

# List Accounts

Query multiple accounts with filtering, sorting, and pagination.

## Query Structure

```graphql
query GetAccounts(
  $where: accounts_bool_exp
  $order_by: [accounts_order_by!]
  $limit: Int
  $offset: Int
) {
  accounts(
    where: $where
    order_by: $order_by
    limit: $limit
    offset: $offset
  ) {
    id
    label
    image
    type
    created_at
  }
  accounts_aggregate(where: $where) {
    aggregate {
      count
    }
  }
}
```

## Variables

```json
{
  "where": {
    "type": { "_eq": "AtomWallet" }
  },
  "order_by": [{ "created_at": "desc" }],
  "limit": 20,
  "offset": 0
}
```

## Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | `String` | Account address |
| `label` | `String` | Human-readable name |
| `image` | `String` | Profile image URL |
| `type` | `String` | Account type |
| `created_at` | `DateTime` | First interaction timestamp |

## Interactive Example

export const listQueries = [
  {
    id: 'recent-accounts',
    title: 'Recent Accounts',
    query: `query GetRecentAccounts($limit: Int!) {
  accounts(
    order_by: { created_at: desc }
    limit: $limit
  ) {
    id
    label
    image
    type
    created_at
  }
}`,
    variables: { limit: 10 }
  },
  {
    id: 'atom-wallets',
    title: 'Accounts with Linked Atoms',
    query: `query GetAtomWallets($limit: Int!) {
  accounts(
    where: { type: { _eq: "AtomWallet" } }
    order_by: { created_at: desc }
    limit: $limit
  ) {
    id
    label
    image
    atom {
      label
      type
    }
  }
}`,
    variables: { limit: 10 }
  },
  {
    id: 'search-accounts',
    title: 'Search by Label',
    query: `query SearchAccounts($search: String!, $limit: Int!) {
  accounts(
    where: { label: { _ilike: $search } }
    limit: $limit
  ) {
    id
    label
    image
    type
  }
}`,
    variables: {
      search: '%eth%',
      limit: 10
    }
  }
];

<GraphQLPlaygroundCustom queries={listQueries} />

## Use Cases

### Search Accounts

Search accounts by label:

```typescript
async function searchAccounts(searchTerm: string, limit: number = 20) {
  const query = `
    query SearchAccounts($search: String!, $limit: Int!) {
      accounts(
        where: { label: { _ilike: $search } }
        order_by: { label: asc }
        limit: $limit
      ) {
        id
        label
        image
        type
      }
    }
  `

  const data = await client.request(query, {
    search: `%${searchTerm}%`,
    limit
  })

  return data.accounts
}
```

### Paginated Account List

```typescript
async function getAccountsPaginated(page: number, pageSize: number = 20) {
  const query = `
    query GetAccountsPaginated($limit: Int!, $offset: Int!) {
      accounts(
        order_by: { created_at: desc }
        limit: $limit
        offset: $offset
      ) {
        id
        label
        image
        type
        created_at
      }
      accounts_aggregate {
        aggregate {
          count
        }
      }
    }
  `

  const data = await client.request(query, {
    limit: pageSize,
    offset: (page - 1) * pageSize
  })

  return {
    accounts: data.accounts,
    total: data.accounts_aggregate.aggregate.count,
    page,
    pageSize,
    totalPages: Math.ceil(data.accounts_aggregate.aggregate.count / pageSize)
  }
}
```

## Filtering Options

### By Type

```graphql
# Only AtomWallet accounts
accounts(where: { type: { _eq: "AtomWallet" } })

# Exclude protocol vaults
accounts(where: { type: { _neq: "ProtocolVault" } })
```

### By Label

```graphql
# Case-insensitive search
accounts(where: { label: { _ilike: "%vitalik%" } })

# Exact match
accounts(where: { label: { _eq: "vitalik.eth" } })
```

### By Date

```graphql
# Accounts created after date
accounts(where: {
  created_at: { _gte: "2024-01-01T00:00:00Z" }
})
```

## Best Practices

1. **Use pagination** - Always limit results for large datasets
2. **Include aggregate** - Get total count for pagination UI
3. **Use indexes** - Filter by indexed fields (type, created_at)
4. **Case-insensitive search** - Use `_ilike` for label searches

## Related

- [Single Account](./single-account) - Query individual accounts
- [Following](./following) - Social relationships
- [Aggregations](/docs/graphql-api/queries/advanced/aggregations) - Aggregate patterns
