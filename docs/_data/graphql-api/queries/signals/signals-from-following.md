---
title: Signals from Following
sidebar_label: From Following
sidebar_position: 2
description: Query signals from accounts you follow
keywords: [graphql, signal, following, social, activity feed]
---

# Signals from Following

Query signals specifically from accounts that a user follows. This is useful for building personalized activity feeds and social features.

## Query Structure

```graphql
query GetSignalsFromFollowing(
  $accountId: String!
  $limit: Int!
  $offset: Int
) {
  signals_from_following(
    args: { address: $accountId }
    limit: $limit
    offset: $offset
    order_by: { block_timestamp: desc }
  ) {
    id
    delta
    block_timestamp
    account {
      id
      label
      image
    }
    atom {
      term_id
      label
      image
    }
    triple {
      term_id
      subject { label }
      predicate { label }
      object { label }
    }
  }
}
```

## Variables

```json
{
  "accountId": "0xd8da6bf26964af9d7eed9e03e53415d37aa96045",
  "limit": 20,
  "offset": 0
}
```

## With Aggregation

```graphql
query GetSignalsFromFollowingWithCount(
  $accountId: String!
  $limit: Int!
) {
  total: signals_from_following_aggregate(
    args: { address: $accountId }
  ) {
    aggregate {
      count
    }
  }
  signals_from_following(
    args: { address: $accountId }
    limit: $limit
    order_by: { block_timestamp: desc }
  ) {
    id
    delta
    block_timestamp
    account { label image }
    atom { label }
  }
}
```

## Use Cases

### Social Activity Feed

Build a personalized feed showing what accounts you follow are doing:

```typescript
import { GraphQLClient } from 'graphql-request'
import { API_URL_PROD } from '@0xintuition/graphql'

const client = new GraphQLClient(API_URL_PROD)

async function getFollowingActivity(accountId: string) {
  const query = `
    query GetFollowingActivity($accountId: String!, $limit: Int!) {
      signals_from_following(
        args: { address: $accountId }
        limit: $limit
        order_by: { block_timestamp: desc }
      ) {
        id
        delta
        block_timestamp
        account { id label image }
        atom { term_id label image }
        triple {
          subject { label }
          predicate { label }
          object { label }
        }
      }
    }
  `

  return client.request(query, { accountId, limit: 50 })
}
```

### Notification System

Check for new activity from followed accounts:

```graphql
query GetRecentFollowingSignals(
  $accountId: String!
  $since: timestamptz!
) {
  signals_from_following(
    args: { address: $accountId }
    where: { block_timestamp: { _gt: $since } }
    order_by: { block_timestamp: desc }
  ) {
    id
    delta
    block_timestamp
    account { id label }
    atom { label }
  }
}
```

## Best Practices

1. **Set up following relationships first** using the protocol
2. **Use pagination** to handle large follower networks
3. **Cache results** for frequently accessed feeds
4. **Combine with subscriptions** for real-time updates

## Related Queries

- [Following Relationships](/docs/graphql-api/queries/accounts/following) - Manage following
- [Positions from Following](/docs/graphql-api/queries/accounts/positions-from-following) - View followed users' positions
- [Activity Feed Example](/docs/graphql-api/examples/activity-feed) - Complete feed implementation
