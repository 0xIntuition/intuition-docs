---
title: Following Relationships
sidebar_label: Following
sidebar_position: 1
description: Query following relationships between accounts
keywords: [graphql, following, social, accounts, relationships]
---

# Following Relationships

Query the following relationships between accounts. Following is a social feature that allows users to track other accounts' activity.

## Query Structure

```graphql
query GetFollowing(
  $accountId: String!
  $limit: Int!
  $offset: Int
) {
  following(
    where: { follower_id: { _eq: $accountId } }
    limit: $limit
    offset: $offset
  ) {
    id
    follower_id
    following_id
    created_at
    follower {
      id
      label
      image
    }
    following {
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

## Get Followers

Query accounts that follow a specific user:

```graphql
query GetFollowers($accountId: String!, $limit: Int!) {
  following(
    where: { following_id: { _eq: $accountId } }
    limit: $limit
  ) {
    follower {
      id
      label
      image
    }
    created_at
  }
  following_aggregate(
    where: { following_id: { _eq: $accountId } }
  ) {
    aggregate {
      count
    }
  }
}
```

## Get Following Count

```graphql
query GetFollowingStats($accountId: String!) {
  following_count: following_aggregate(
    where: { follower_id: { _eq: $accountId } }
  ) {
    aggregate {
      count
    }
  }
  followers_count: following_aggregate(
    where: { following_id: { _eq: $accountId } }
  ) {
    aggregate {
      count
    }
  }
}
```

## Check if Following

```graphql
query CheckFollowing($followerId: String!, $followingId: String!) {
  following(
    where: {
      _and: [
        { follower_id: { _eq: $followerId } }
        { following_id: { _eq: $followingId } }
      ]
    }
  ) {
    id
  }
}
```

## Use Cases

### User Profile Display

```typescript
async function getProfileStats(accountId: string) {
  const query = `
    query GetProfileStats($accountId: String!) {
      account(id: $accountId) {
        id
        label
        image
      }
      following: following_aggregate(
        where: { follower_id: { _eq: $accountId } }
      ) {
        aggregate { count }
      }
      followers: following_aggregate(
        where: { following_id: { _eq: $accountId } }
      ) {
        aggregate { count }
      }
    }
  `
  return client.request(query, { accountId })
}
```

### Following List with Pagination

```typescript
async function getFollowingList(accountId: string, page: number) {
  const limit = 20
  const offset = page * limit

  const query = `
    query GetFollowingList($accountId: String!, $limit: Int!, $offset: Int!) {
      following(
        where: { follower_id: { _eq: $accountId } }
        limit: $limit
        offset: $offset
        order_by: { created_at: desc }
      ) {
        following {
          id
          label
          image
        }
        created_at
      }
    }
  `

  return client.request(query, { accountId, limit, offset })
}
```

## Best Practices

1. **Use pagination** for accounts with many followers/following
2. **Cache following status** for UI toggle buttons
3. **Combine with signals_from_following** for activity feeds
4. **Order by created_at** to show recent follows first

## Related Queries

- [Signals from Following](/docs/graphql-api/queries/signals/signals-from-following) - Activity from followed accounts
- [Positions from Following](/docs/graphql-api/queries/accounts/positions-from-following) - Positions from followed accounts
- [Social Graph Example](/docs/graphql-api/examples/social-graph) - Building social features
