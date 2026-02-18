---
title: Following
sidebar_label: Following
sidebar_position: 2
description: Query following relationships between accounts
keywords: [graphql, following, social, accounts, relationships]
---

import GraphQLPlaygroundCustom from '@site/src/components/GraphQLPlaygroundCustom';

# Following Query

Query the social graph to get accounts that a specific account follows, or accounts that follow them.

## Query Structure

### Get Accounts Being Followed

```graphql
query GetFollowing(
  $accountId: String!
  $limit: Int
  $offset: Int
) {
  following(
    args: { account_id: $accountId }
    limit: $limit
    offset: $offset
  ) {
    id
    subject_id
    object_id
    object {
      id
      label
      image
      atom_id
    }
  }
}
```

### Get Followers

```graphql
query GetFollowers(
  $accountId: String!
  $limit: Int
  $offset: Int
) {
  followers(
    args: { account_id: $accountId }
    limit: $limit
    offset: $offset
  ) {
    id
    subject_id
    object_id
    subject {
      id
      label
      image
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
| `account_id` | String | Yes | The account to query relationships for |
| `limit` | Int | No | Maximum results |
| `offset` | Int | No | Pagination offset |

## Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | String | Relationship identifier |
| `subject_id` | String | Follower account ID |
| `object_id` | String | Followed account ID |
| `subject` / `object` | Object | Account details |

## Interactive Example

export const followingQueries = [
  {
    id: 'get-following',
    title: 'Get Following',
    query: `query GetFollowing($accountId: String!, $limit: Int!) {
  following(
    args: { account_id: $accountId }
    limit: $limit
  ) {
    id
    object {
      id
      label
      image
    }
  }
}`,
    variables: {
      accountId: '0xd8da6bf26964af9d7eed9e03e53415d37aa96045',
      limit: 20
    }
  }
];

<GraphQLPlaygroundCustom queries={followingQueries} />

## Use Cases

### Following List Component

```typescript
import { useQuery, gql } from '@apollo/client';

const GET_FOLLOWING = gql`
  query GetFollowing($accountId: String!, $limit: Int!, $offset: Int!) {
    following(
      args: { account_id: $accountId }
      limit: $limit
      offset: $offset
    ) {
      id
      object {
        id
        label
        image
        atom_id
      }
    }
    following_aggregate(args: { account_id: $accountId }) {
      aggregate {
        count
      }
    }
  }
`;

function FollowingList({ accountId }) {
  const [offset, setOffset] = useState(0);
  const { data, loading } = useQuery(GET_FOLLOWING, {
    variables: { accountId, limit: 20, offset }
  });

  const following = data?.following || [];
  const total = data?.following_aggregate?.aggregate?.count || 0;

  return (
    <div>
      <h2>Following ({total})</h2>
      <div className="grid gap-4">
        {following.map(f => (
          <div key={f.id} className="flex items-center gap-3">
            <img src={f.object.image} className="w-10 h-10 rounded-full" />
            <span>{f.object.label || truncateAddress(f.object.id)}</span>
          </div>
        ))}
      </div>
      {offset + 20 < total && (
        <button onClick={() => setOffset(o => o + 20)}>Load more</button>
      )}
    </div>
  );
}
```

### Check if Following

```typescript
const IS_FOLLOWING = gql`
  query IsFollowing($followerId: String!, $followedId: String!) {
    following(
      args: { account_id: $followerId }
      where: { object_id: { _eq: $followedId } }
    ) {
      id
    }
  }
`;

async function isFollowing(followerId: string, followedId: string): Promise<boolean> {
  const { data } = await client.query({
    query: IS_FOLLOWING,
    variables: { followerId, followedId }
  });
  return data?.following?.length > 0;
}
```

### Mutual Followers

```typescript
const GET_MUTUALS = gql`
  query GetMutuals($accountId: String!) {
    following(args: { account_id: $accountId }) {
      object_id
    }
    followers(args: { account_id: $accountId }) {
      subject_id
    }
  }
`;

function getMutualFollowers(data) {
  const following = new Set(data.following.map(f => f.object_id));
  const followers = data.followers.map(f => f.subject_id);
  return followers.filter(id => following.has(id));
}
```

## Best Practices

1. **Use pagination** - Following lists can be large
2. **Cache relationships** - Social graph changes infrequently
3. **Include aggregates** - Show total counts with `following_aggregate`
4. **Handle empty states** - New accounts may not follow anyone

## Related

- [Single Account](./single-account) - Get account details
- [Positions from Following](./positions-from-following) - Positions from followed accounts
- [Signals from Following](/docs/graphql-api/queries/signals/signals-from-following) - Activity feed
