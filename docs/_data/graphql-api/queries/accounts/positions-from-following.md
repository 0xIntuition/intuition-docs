---
title: Positions from Following
sidebar_label: Positions from Following
sidebar_position: 5
description: Query positions held by accounts you follow
keywords: [graphql, positions, following, social, portfolio]
---

import GraphQLPlaygroundCustom from '@site/src/components/GraphQLPlaygroundCustom';

# Positions from Following

Query positions (stakes) held by accounts that a user follows. This enables building social portfolio views and discovering popular investments within your network.

## Query Structure

```graphql
query GetPositionsFromFollowing(
  $account_id: String!
  $limit: Int
  $offset: Int
) {
  positions_from_following(
    args: { account_id: $account_id }
    limit: $limit
    offset: $offset
    order_by: { shares: desc }
  ) {
    id
    account_id
    account {
      label
      image
    }
    vault_id
    vault {
      atom {
        label
        image
      }
      triple {
        subject { label }
        predicate { label }
        object { label }
      }
      current_share_price
      total_shares
    }
    shares
    created_at
    updated_at
  }
}
```

## Variables

```json
{
  "account_id": "0xd8da6bf26964af9d7eed9e03e53415d37aa96045",
  "limit": 20,
  "offset": 0
}
```

## Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | `String` | Position identifier |
| `account_id` | `String` | Account holding the position |
| `account` | `Account` | Account details |
| `vault_id` | `String` | Vault ID for the position |
| `vault` | `Vault` | Vault details with atom/triple |
| `shares` | `String` | Number of shares held |
| `created_at` | `DateTime` | When position was opened |
| `updated_at` | `DateTime` | Last position update |

## Expected Response

```json
{
  "data": {
    "positions_from_following": [
      {
        "id": "0x123...",
        "account_id": "0xabc...",
        "account": {
          "label": "alice.eth",
          "image": "ipfs://Qm..."
        },
        "vault_id": "0x456...",
        "vault": {
          "atom": {
            "label": "Ethereum",
            "image": "ipfs://Qm..."
          },
          "triple": null,
          "current_share_price": "1.05",
          "total_shares": "1000000000000000000"
        },
        "shares": "500000000000000000",
        "created_at": "2024-01-15T10:30:00Z",
        "updated_at": "2024-01-15T10:30:00Z"
      }
    ]
  }
}
```

## Interactive Example

export const positionsQueries = [
  {
    id: 'following-positions',
    title: 'Positions from Following',
    query: `query GetPositionsFromFollowing($account_id: String!, $limit: Int!) {
  positions_from_following(
    args: { account_id: $account_id }
    limit: $limit
    order_by: { shares: desc }
  ) {
    account {
      label
      image
    }
    vault {
      atom {
        label
      }
    }
    shares
  }
}`,
    variables: {
      account_id: '0xd8da6bf26964af9d7eed9e03e53415d37aa96045',
      limit: 10
    }
  },
  {
    id: 'popular-in-network',
    title: 'Popular Atoms in Network',
    query: `query GetPopularInNetwork($account_id: String!) {
  positions_from_following(
    args: { account_id: $account_id }
    order_by: { shares: desc }
    limit: 20
  ) {
    vault {
      atom {
        term_id
        label
        image
      }
    }
    shares
    account {
      label
    }
  }
}`,
    variables: {
      account_id: '0xd8da6bf26964af9d7eed9e03e53415d37aa96045'
    }
  }
];

<GraphQLPlaygroundCustom queries={positionsQueries} />

## Use Cases

### Social Portfolio View

See what accounts you follow are invested in:

```typescript
async function getSocialPortfolio(accountId: string) {
  const query = `
    query GetSocialPortfolio($account_id: String!) {
      positions_from_following(
        args: { account_id: $account_id }
        order_by: { shares: desc }
        limit: 50
      ) {
        account {
          id
          label
          image
        }
        vault {
          atom {
            term_id
            label
            image
          }
          current_share_price
        }
        shares
      }
    }
  `

  const data = await client.request(query, { account_id: accountId })

  // Group by atom to find popular investments
  const byAtom = data.positions_from_following.reduce((acc, pos) => {
    const atomId = pos.vault.atom?.term_id
    if (!atomId) return acc

    if (!acc[atomId]) {
      acc[atomId] = {
        atom: pos.vault.atom,
        holders: [],
        totalShares: BigInt(0)
      }
    }

    acc[atomId].holders.push(pos.account)
    acc[atomId].totalShares += BigInt(pos.shares)

    return acc
  }, {})

  return Object.values(byAtom).sort((a, b) =>
    Number(b.totalShares - a.totalShares)
  )
}
```

### Discover Through Network

Find atoms popular among people you follow:

```typescript
async function discoverFromNetwork(accountId: string) {
  const query = `
    query DiscoverFromNetwork($account_id: String!) {
      positions_from_following(
        args: { account_id: $account_id }
        order_by: { shares: desc }
      ) {
        vault {
          id
          atom {
            term_id
            label
            image
            type
          }
        }
        account {
          label
        }
        shares
      }
    }
  `

  const data = await client.request(query, { account_id: accountId })

  // Aggregate by vault
  const vaultStats = new Map()

  for (const pos of data.positions_from_following) {
    const vaultId = pos.vault.id
    if (!vaultStats.has(vaultId)) {
      vaultStats.set(vaultId, {
        atom: pos.vault.atom,
        holders: [],
        holderCount: 0
      })
    }

    const stats = vaultStats.get(vaultId)
    stats.holders.push(pos.account.label)
    stats.holderCount++
  }

  // Sort by number of followers holding
  return Array.from(vaultStats.values())
    .sort((a, b) => b.holderCount - a.holderCount)
    .slice(0, 10)
}
```

### React Network Positions Component

```tsx
function NetworkPositions({ accountId }: { accountId: string }) {
  const { data, loading } = useQuery(GET_POSITIONS_FROM_FOLLOWING, {
    variables: { account_id: accountId, limit: 50 }
  })

  if (loading) return <Spinner />

  const positions = data?.positions_from_following || []

  // Group positions by atom
  const grouped = groupPositionsByAtom(positions)

  return (
    <div className="network-positions">
      <h2>Popular in Your Network</h2>
      {grouped.map(({ atom, holders, totalShares }) => (
        <div key={atom.term_id} className="position-group">
          <div className="atom-info">
            <img src={resolveIpfs(atom.image)} alt={atom.label} />
            <span>{atom.label}</span>
          </div>
          <div className="holders">
            {holders.slice(0, 3).map(h => (
              <img
                key={h.id}
                src={resolveIpfs(h.image)}
                alt={h.label}
                title={h.label}
              />
            ))}
            {holders.length > 3 && (
              <span>+{holders.length - 3} more</span>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
```

## Aggregating Results

To get aggregate statistics:

```graphql
query GetNetworkStats($account_id: String!) {
  positions_from_following_aggregate(
    args: { account_id: $account_id }
  ) {
    aggregate {
      count
      sum {
        shares
      }
    }
  }
}
```

## Best Practices

1. **Group by atom** - Show which atoms are popular, not individual positions
2. **Show holder count** - "5 people you follow hold this"
3. **Cache results** - Position data changes infrequently
4. **Limit results** - Large following lists can return many positions

## Related

- [Following](./following) - Who an account follows
- [Signals from Following](/docs/graphql-api/queries/signals/signals-from-following) - Activity from followed accounts
- [User Positions](/docs/graphql-api/queries/vaults/user-positions) - Individual position queries
