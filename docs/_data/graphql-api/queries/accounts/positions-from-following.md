---
title: Positions from Following
sidebar_label: Positions from Following
sidebar_position: 3
description: Query positions held by accounts you follow
keywords: [graphql, positions, following, social, accounts]
---

import GraphQLPlaygroundCustom from '@site/src/components/GraphQLPlaygroundCustom';

# Positions from Following Query

Query positions held by accounts that a specific account follows. Useful for discovering popular terms within your social circle.

## Query Structure

```graphql
query GetPositionsFromFollowing(
  $accountId: String!
  $limit: Int
  $offset: Int
) {
  positions_from_following(
    args: { follower_id: $accountId }
    order_by: { shares: desc }
    limit: $limit
    offset: $offset
  ) {
    id
    account_id
    vault_id
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

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `follower_id` | String | Yes | Account whose following to query |
| `limit` | Int | No | Maximum results |
| `offset` | Int | No | Pagination offset |

## Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | String | Position identifier |
| `account_id` | String | Account holding the position |
| `vault_id` | String | Vault identifier |
| `shares` | String | Number of shares held |
| `account` | Object | Account details |
| `vault` | Object | Vault and term details |

## Interactive Example

export const positionsFollowingQueries = [
  {
    id: 'positions-from-following',
    title: 'Positions from Following',
    query: `query GetPositionsFromFollowing(
  $accountId: String!
  $limit: Int
) {
  positions_from_following(
    args: { follower_id: $accountId }
    order_by: { shares: desc }
    limit: $limit
  ) {
    id
    shares
    account {
      id
      label
    }
    vault {
      term {
        atom { label }
      }
    }
  }
}`,
    variables: {
      accountId: '0xd8da6bf26964af9d7eed9e03e53415d37aa96045',
      limit: 20
    }
  }
];

<GraphQLPlaygroundCustom queries={positionsFollowingQueries} />

## Use Cases

### Social Discovery Feed

```typescript
import { useQuery, gql } from '@apollo/client';
import { useAccount } from 'wagmi';

const GET_SOCIAL_POSITIONS = gql`
  query GetPositionsFromFollowing($accountId: String!, $limit: Int!) {
    positions_from_following(
      args: { follower_id: $accountId }
      order_by: { shares: desc }
      limit: $limit
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
        market_cap
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
  }
`;

function SocialDiscovery() {
  const { address } = useAccount();
  const { data, loading } = useQuery(GET_SOCIAL_POSITIONS, {
    variables: { accountId: address, limit: 50 },
    skip: !address
  });

  if (!address) return <p>Connect wallet to see social positions</p>;
  if (loading) return <p>Loading...</p>;

  const positions = data?.positions_from_following || [];

  // Group by term to show most popular
  const termCounts = positions.reduce((acc, pos) => {
    const termId = pos.vault.term_id;
    if (!acc[termId]) {
      acc[termId] = { term: pos.vault.term, holders: [], totalShares: 0n };
    }
    acc[termId].holders.push(pos.account);
    acc[termId].totalShares += BigInt(pos.shares);
    return acc;
  }, {});

  return (
    <div>
      <h2>Popular with people you follow</h2>
      {Object.values(termCounts)
        .sort((a, b) => b.holders.length - a.holders.length)
        .map(({ term, holders }) => (
          <div key={term.atom?.id || term.triple?.id}>
            <h3>{term.atom?.label || 'Triple'}</h3>
            <p>{holders.length} people you follow hold this</p>
            <div className="flex">
              {holders.slice(0, 5).map(h => (
                <img key={h.id} src={h.image} className="w-6 h-6 rounded-full" />
              ))}
            </div>
          </div>
        ))}
    </div>
  );
}
```

### Aggregate Statistics

```graphql
query GetFollowingPositionStats($accountId: String!) {
  positions_from_following_aggregate(
    args: { follower_id: $accountId }
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

1. **Group by term** - Show popular terms within social circle
2. **Sort by shares** - Highlight strongest convictions
3. **Show holder avatars** - Social proof with profile images
4. **Use pagination** - Large following = many positions

## Related

- [Following](./following) - Get following relationships
- [Single Account](./single-account) - Account details
- [User Positions](/docs/graphql-api/queries/vaults/user-positions) - Direct position queries
