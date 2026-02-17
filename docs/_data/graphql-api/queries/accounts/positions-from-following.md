---
title: Positions from Following
sidebar_label: Positions from Following
sidebar_position: 2
description: Query positions held by accounts you follow
keywords: [graphql, positions, following, social, portfolio]
---

# Positions from Following

Query positions held by accounts that a user follows. Useful for discovering trending atoms and building social portfolio features.

## Query Structure

```graphql
query GetPositionsFromFollowing(
  $accountId: String!
  $limit: Int!
  $offset: Int
) {
  positions_from_following(
    args: { address: $accountId }
    limit: $limit
    offset: $offset
    order_by: { shares: desc }
  ) {
    id
    shares
    account {
      id
      label
      image
    }
    vault {
      term_id
      current_share_price
      term {
        atom {
          term_id
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
  }
}
```

## Variables

```json
{
  "accountId": "0xd8da6bf26964af9d7eed9e03e53415d37aa96045",
  "limit": 50,
  "offset": 0
}
```

## With Aggregation

```graphql
query GetPositionsFromFollowingWithStats(
  $accountId: String!
  $limit: Int!
) {
  total: positions_from_following_aggregate(
    args: { address: $accountId }
  ) {
    aggregate {
      count
      sum {
        shares
      }
    }
  }
  positions_from_following(
    args: { address: $accountId }
    limit: $limit
    order_by: { shares: desc }
  ) {
    id
    shares
    account { label image }
    vault {
      term {
        atom { label image }
      }
    }
  }
}
```

## Filter by Atom Type

```graphql
query GetFollowingPositionsByType(
  $accountId: String!
  $atomType: atom_type!
  $limit: Int!
) {
  positions_from_following(
    args: { address: $accountId }
    where: {
      vault: {
        term: {
          atom: { type: { _eq: $atomType } }
        }
      }
    }
    limit: $limit
    order_by: { shares: desc }
  ) {
    id
    shares
    account { label }
    vault {
      term {
        atom { label type }
      }
    }
  }
}
```

## Use Cases

### Discover Trending Among Followed

Find atoms that multiple followed accounts have positions in:

```typescript
async function getTrendingAmongFollowing(accountId: string) {
  const query = `
    query GetTrendingAmongFollowing($accountId: String!) {
      positions_from_following(
        args: { address: $accountId }
        order_by: { shares: desc }
        limit: 100
      ) {
        shares
        vault {
          term {
            atom { term_id label image }
          }
        }
        account { id }
      }
    }
  `

  const data = await client.request(query, { accountId })

  // Group by atom and count unique accounts
  const atomCounts = data.positions_from_following.reduce((acc, pos) => {
    const atomId = pos.vault.term?.atom?.term_id
    if (atomId) {
      if (!acc[atomId]) {
        acc[atomId] = {
          atom: pos.vault.term.atom,
          accounts: new Set(),
          totalShares: 0
        }
      }
      acc[atomId].accounts.add(pos.account.id)
      acc[atomId].totalShares += Number(pos.shares)
    }
    return acc
  }, {})

  return Object.values(atomCounts)
    .sort((a, b) => b.accounts.size - a.accounts.size)
}
```

## Best Practices

1. **Use pagination** for large following lists
2. **Order by shares** to show largest positions first
3. **Group by atom** to find popular picks among followed
4. **Combine with account details** for attribution

## Related Queries

- [Following Relationships](/docs/graphql-api/queries/accounts/following) - Manage following
- [Signals from Following](/docs/graphql-api/queries/signals/signals-from-following) - Activity feed
- [User Positions](/docs/graphql-api/queries/vaults/user-positions) - Individual positions
