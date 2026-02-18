---
title: Signals from Following
sidebar_label: Signals from Following
sidebar_position: 3
description: Query signals from accounts you follow
keywords: [graphql, signals, following, social, feed]
---

import GraphQLPlaygroundCustom from '@site/src/components/GraphQLPlaygroundCustom';

# Signals from Following Query

Query signals from accounts that a specific account follows. Useful for building social activity feeds.

## Query Structure

```graphql
query GetSignalsFromFollowing(
  $accountId: String!
  $limit: Int
  $offset: Int
) {
  signals_from_following(
    args: { follower_id: $accountId }
    order_by: { block_timestamp: desc }
    limit: $limit
    offset: $offset
  ) {
    id
    account_id
    term_id
    delta
    signal_type
    block_timestamp
    account {
      id
      label
      image
    }
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
```

## Variables

```json
{
  "accountId": "0xd8da6bf26964af9d7eed9e03e53415d37aa96045",
  "limit": 20,
  "offset": 0
}
```

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `follower_id` | String | Yes | Account whose following list to use |
| `limit` | Int | No | Maximum results |
| `offset` | Int | No | Pagination offset |

## Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | String | Signal identifier |
| `account_id` | String | Account that made the signal |
| `term_id` | String | Term being signaled on |
| `delta` | String | Amount (in wei) |
| `signal_type` | String | `deposit` or `redemption` |
| `block_timestamp` | String | When the signal occurred |
| `account` | Object | Account details with label and image |
| `term` | Object | Term details (atom or triple) |

## Interactive Example

export const followingSignalsQueries = [
  {
    id: 'signals-from-following',
    title: 'Signals from Following',
    query: `query GetSignalsFromFollowing(
  $accountId: String!
  $limit: Int
) {
  signals_from_following(
    args: { follower_id: $accountId }
    order_by: { block_timestamp: desc }
    limit: $limit
  ) {
    id
    delta
    signal_type
    block_timestamp
    account {
      id
      label
    }
    term {
      atom { label }
    }
  }
}`,
    variables: {
      accountId: '0xd8da6bf26964af9d7eed9e03e53415d37aa96045',
      limit: 10
    }
  }
];

<GraphQLPlaygroundCustom queries={followingSignalsQueries} />

## Use Cases

### Social Activity Feed

```typescript
import { useQuery, gql } from '@apollo/client';
import { useAccount } from 'wagmi';

const GET_FOLLOWING_SIGNALS = gql`
  query GetSignalsFromFollowing($accountId: String!, $limit: Int!) {
    signals_from_following(
      args: { follower_id: $accountId }
      order_by: { block_timestamp: desc }
      limit: $limit
    ) {
      id
      account {
        id
        label
        image
      }
      delta
      signal_type
      block_timestamp
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
`;

function SocialFeed() {
  const { address } = useAccount();
  const { data, loading } = useQuery(GET_FOLLOWING_SIGNALS, {
    variables: { accountId: address, limit: 50 },
    skip: !address
  });

  if (!address) return <p>Connect wallet to see your feed</p>;
  if (loading) return <p>Loading...</p>;

  return (
    <div className="space-y-4">
      <h2>Activity from people you follow</h2>
      {data?.signals_from_following.map(signal => (
        <div key={signal.id} className="p-4 border rounded">
          <div className="flex items-center gap-2">
            <img src={signal.account.image} className="w-8 h-8 rounded-full" />
            <span className="font-medium">{signal.account.label}</span>
          </div>
          <p>
            {signal.signal_type === 'deposit' ? 'Deposited' : 'Redeemed'}{' '}
            {formatEther(signal.delta)} ETH on{' '}
            {signal.term.atom?.label || 'a triple'}
          </p>
          <time className="text-sm text-gray-500">
            {formatRelativeTime(signal.block_timestamp)}
          </time>
        </div>
      ))}
    </div>
  );
}
```

### Notification System

```typescript
import { useSubscription, gql } from '@apollo/client';

const FOLLOWING_SIGNALS_SUBSCRIPTION = gql`
  subscription OnFollowingSignal($accountId: String!) {
    signals_from_following_stream(
      args: { follower_id: $accountId }
      batch_size: 10
      cursor: { initial_value: { block_timestamp: "now()" } }
    ) {
      id
      account { label }
      signal_type
      delta
      term {
        atom { label }
      }
    }
  }
`;

function Notifications({ accountId }) {
  const { data } = useSubscription(FOLLOWING_SIGNALS_SUBSCRIPTION, {
    variables: { accountId }
  });

  useEffect(() => {
    if (data?.signals_from_following_stream) {
      // Show notification for new signals
      showNotification(data.signals_from_following_stream);
    }
  }, [data]);

  return null;
}
```

## Best Practices

1. **Use pagination** - Following feeds can be large
2. **Poll or subscribe** - Keep the feed fresh with real-time updates
3. **Show context** - Include account and term details
4. **Handle empty states** - User may not follow anyone yet

## Related

- [List Signals](./list-signals) - All signals without social filter
- [Signals Aggregate](./signals-aggregate) - Aggregate statistics
- [Following](../accounts/following) - Query following relationships
