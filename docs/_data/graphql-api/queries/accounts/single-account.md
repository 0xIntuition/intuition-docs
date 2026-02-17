---
title: Single Account Query
sidebar_label: Single Account
sidebar_position: 3
description: Fetch individual account details by address
keywords: [graphql, account, query, wallet, address]
---

# Single Account Query

Fetch detailed information about a specific account using its address.

## Query Structure

```graphql
query GetAccount($id: String!) {
  account(id: $id) {
    id
    label
    image
    type
    atom_id
    created_at
    atom {
      term_id
      label
      image
      type
    }
  }
}
```

## Variables

```json
{
  "id": "0xd8da6bf26964af9d7eed9e03e53415d37aa96045"
}
```

## Account with Positions

```graphql
query GetAccountWithPositions($id: String!, $limit: Int!) {
  account(id: $id) {
    id
    label
    image
    positions(limit: $limit, order_by: { shares: desc }) {
      id
      shares
      vault {
        term_id
        current_share_price
        term {
          atom { label image }
          triple {
            subject { label }
            predicate { label }
            object { label }
          }
        }
      }
    }
    positions_aggregate {
      aggregate {
        count
        sum {
          shares
        }
      }
    }
  }
}
```

## Account with Created Atoms

```graphql
query GetAccountCreations($id: String!, $limit: Int!) {
  account(id: $id) {
    id
    label
    atoms_created: atoms(
      where: { creator_id: { _eq: $id } }
      limit: $limit
      order_by: { created_at: desc }
    ) {
      term_id
      label
      image
      type
      created_at
    }
  }
}
```

## List Accounts

```graphql
query GetAccounts($limit: Int!, $offset: Int) {
  accounts_aggregate {
    aggregate {
      count
    }
  }
  accounts(limit: $limit, offset: $offset) {
    id
    label
    image
    type
  }
}
```

## Best Practices

1. **Use primary key lookup** for single accounts (most efficient)
2. **Include positions_aggregate** for portfolio stats
3. **Limit nested positions** to avoid over-fetching
4. **Cache frequently accessed accounts**

## Related Queries

- [User Positions](/docs/graphql-api/queries/vaults/user-positions) - Detailed position queries
- [Following](/docs/graphql-api/queries/accounts/following) - Social relationships
- [Signals](/docs/graphql-api/queries/signals/list-signals) - Account activity
