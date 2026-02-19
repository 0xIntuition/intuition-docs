---
title: Following Query
sidebar_label: Following
sidebar_position: 4
description: Query following relationships in the social graph
keywords: [graphql, following, social, relationships, graph]
---

import GraphQLPlaygroundCustom from '@site/src/components/GraphQLPlaygroundCustom';

# Following Query

Query the social graph to find who an account follows and who follows them.

## Query Structure

```graphql
query GetFollowing(
  $account_id: String!
  $limit: Int
  $offset: Int
) {
  following(
    where: { follower_id: { _eq: $account_id } }
    limit: $limit
    offset: $offset
  ) {
    id
    follower_id
    follower {
      label
      image
    }
    following_id
    following {
      label
      image
    }
    created_at
  }
  following_aggregate(where: { follower_id: { _eq: $account_id } }) {
    aggregate {
      count
    }
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
| `id` | `String` | Relationship identifier |
| `follower_id` | `String` | Account doing the following |
| `follower` | `Account` | Follower account details |
| `following_id` | `String` | Account being followed |
| `following` | `Account` | Followed account details |
| `created_at` | `DateTime` | When the follow was created |

## Expected Response

```json
{
  "data": {
    "following": [
      {
        "id": "0x123...",
        "follower_id": "0xd8da6bf26964af9d7eed9e03e53415d37aa96045",
        "follower": {
          "label": "vitalik.eth",
          "image": "ipfs://Qm..."
        },
        "following_id": "0xabc...",
        "following": {
          "label": "alice.eth",
          "image": "ipfs://Qm..."
        },
        "created_at": "2024-01-15T10:30:00Z"
      }
    ],
    "following_aggregate": {
      "aggregate": {
        "count": 150
      }
    }
  }
}
```

## Interactive Example

export const followingQueries = [
  {
    id: 'who-follows',
    title: 'Who Account Follows',
    query: `query GetFollowing($account_id: String!, $limit: Int!) {
  following(
    where: { follower_id: { _eq: $account_id } }
    limit: $limit
    order_by: { created_at: desc }
  ) {
    following {
      id
      label
      image
    }
    created_at
  }
  following_aggregate(where: { follower_id: { _eq: $account_id } }) {
    aggregate {
      count
    }
  }
}`,
    variables: {
      account_id: '0xd8da6bf26964af9d7eed9e03e53415d37aa96045',
      limit: 10
    }
  },
  {
    id: 'followers',
    title: 'Account Followers',
    query: `query GetFollowers($account_id: String!, $limit: Int!) {
  following(
    where: { following_id: { _eq: $account_id } }
    limit: $limit
    order_by: { created_at: desc }
  ) {
    follower {
      id
      label
      image
    }
    created_at
  }
  following_aggregate(where: { following_id: { _eq: $account_id } }) {
    aggregate {
      count
    }
  }
}`,
    variables: {
      account_id: '0xd8da6bf26964af9d7eed9e03e53415d37aa96045',
      limit: 10
    }
  },
  {
    id: 'mutual-follows',
    title: 'Check Mutual Follow',
    query: `query CheckMutualFollow($account_a: String!, $account_b: String!) {
  a_follows_b: following(where: {
    follower_id: { _eq: $account_a }
    following_id: { _eq: $account_b }
  }) {
    id
  }
  b_follows_a: following(where: {
    follower_id: { _eq: $account_b }
    following_id: { _eq: $account_a }
  }) {
    id
  }
}`,
    variables: {
      account_a: '0xd8da6bf26964af9d7eed9e03e53415d37aa96045',
      account_b: '0xabc...'
    }
  }
];

<GraphQLPlaygroundCustom queries={followingQueries} />

## Use Cases

### Following List

Get list of accounts a user follows:

```typescript
async function getFollowing(accountId: string, options: {
  limit?: number
  offset?: number
} = {}) {
  const query = `
    query GetFollowing($account_id: String!, $limit: Int!, $offset: Int!) {
      following(
        where: { follower_id: { _eq: $account_id } }
        order_by: { created_at: desc }
        limit: $limit
        offset: $offset
      ) {
        following {
          id
          label
          image
        }
        created_at
      }
      following_aggregate(where: { follower_id: { _eq: $account_id } }) {
        aggregate {
          count
        }
      }
    }
  `

  const data = await client.request(query, {
    account_id: accountId,
    limit: options.limit || 20,
    offset: options.offset || 0
  })

  return {
    accounts: data.following.map(f => f.following),
    total: data.following_aggregate.aggregate.count
  }
}
```

### Followers List

Get accounts that follow a user:

```typescript
async function getFollowers(accountId: string) {
  const query = `
    query GetFollowers($account_id: String!) {
      following(
        where: { following_id: { _eq: $account_id } }
        order_by: { created_at: desc }
      ) {
        follower {
          id
          label
          image
        }
        created_at
      }
      following_aggregate(where: { following_id: { _eq: $account_id } }) {
        aggregate {
          count
        }
      }
    }
  `

  const data = await client.request(query, { account_id: accountId })

  return {
    followers: data.following.map(f => f.follower),
    count: data.following_aggregate.aggregate.count
  }
}
```

### Check if Following

Check if one account follows another:

```typescript
async function isFollowing(
  followerId: string,
  followingId: string
): Promise<boolean> {
  const query = `
    query CheckFollowing($follower: String!, $following: String!) {
      following(where: {
        follower_id: { _eq: $follower }
        following_id: { _eq: $following }
      }) {
        id
      }
    }
  `

  const data = await client.request(query, {
    follower: followerId,
    following: followingId
  })

  return data.following.length > 0
}
```

### React Following Component

```tsx
function FollowingList({ accountId }: { accountId: string }) {
  const [tab, setTab] = useState<'following' | 'followers'>('following')

  const { data, loading } = useQuery(
    tab === 'following' ? GET_FOLLOWING : GET_FOLLOWERS,
    { variables: { account_id: accountId } }
  )

  const accounts = data?.following?.map(f =>
    tab === 'following' ? f.following : f.follower
  ) || []

  const count = data?.following_aggregate?.aggregate?.count || 0

  return (
    <div>
      <div className="tabs">
        <button
          onClick={() => setTab('following')}
          className={tab === 'following' ? 'active' : ''}
        >
          Following
        </button>
        <button
          onClick={() => setTab('followers')}
          className={tab === 'followers' ? 'active' : ''}
        >
          Followers
        </button>
      </div>

      <p>{count} {tab}</p>

      {loading ? (
        <Spinner />
      ) : (
        <ul>
          {accounts.map(account => (
            <li key={account.id}>
              <AccountCard account={account} />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
```

## How Following Works

Following relationships are created through:
1. Creating "Follow" triples (subject follows object)
2. The indexer extracts these into the `following` table

## Best Practices

1. **Paginate lists** - Following lists can be large
2. **Cache counts** - Aggregate counts are relatively stable
3. **Show mutual follows** - Indicate when users follow each other
4. **Use for feeds** - Power social features with following data

## Related

- [Signals from Following](/docs/graphql-api/queries/signals/signals-from-following) - Activity from followed accounts
- [Positions from Following](./positions-from-following) - Positions from followed accounts
- [Social Graph Example](/docs/graphql-api/examples/social-graph) - Building social features
