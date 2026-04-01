---
title: Signals from Following
sidebar_label: From Following
sidebar_position: 4
description: Query signals from accounts you follow
keywords: [graphql, signals, following, social, feed]
---

import GraphQLPlaygroundCustom from '@site/src/components/GraphQLPlaygroundCustom';

# Signals from Following

Query signals (deposits and redemptions) from accounts that a specific user follows. This enables building personalized social activity feeds.

## Query Structure

```graphql
query GetSignalsFromFollowing(
  $account_id: String!
  $limit: Int
  $offset: Int
  $where: signals_from_following_bool_exp
) {
  signals_from_following(
    args: { account_id: $account_id }
    where: $where
    limit: $limit
    offset: $offset
    order_by: { created_at: desc }
  ) {
    id
    delta
    account {
      id
      label
      image
    }
    term {
      atom {
        term_id
        label
        image
      }
    }
    triple_id
    created_at
  }
}
```

## Variables

| Variable | Type | Required | Description |
|----------|------|----------|-------------|
| `account_id` | `String` | Yes | The account whose following list to use |
| `limit` | `Int` | No | Maximum results (default: 20) |
| `offset` | `Int` | No | Pagination offset |
| `where` | `signals_from_following_bool_exp` | No | Additional filters |

```json
{
  "account_id": "0x88D0aF73508452c1a453356b3Fac26525aEc23A2",
  "limit": 20,
  "offset": 0
}
```

## Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | `String` | Signal identifier |
| `delta` | `numeric` | Amount in wei |
| `account` | `accounts` | Account that made the signal |
| `term` | `terms` | Related term (contains nested `atom` with label/image) |
| `triple_id` | `String` | Related triple ID (if triple signal) |
| `created_at` | `timestamptz` | Event timestamp |

## Expected Response

```json
{
  "data": {
    "signals_from_following": [
      {
        "id": "0x123...-1",
        "delta": "1000000000000000000",
        "account": {
          "id": "0xabc...",
          "label": "alice.eth",
          "image": "ipfs://Qm..."
        },
        "term": {
          "atom": {
            "id": "0x57d94c...",
            "label": "Ethereum",
            "image": "ipfs://Qm..."
          }
        },
        "triple_id": null,
        "created_at": "2024-01-15T10:30:00Z"
      }
    ]
  }
}
```

## Interactive Example

export const followingQueries = [
  {
    id: 'following-signals',
    title: 'Signals from Following',
    query: `query GetSignalsFromFollowing($account_id: String!, $limit: Int!) {
  signals_from_following(
    args: { account_id: $account_id }
    limit: $limit
    order_by: { created_at: desc }
  ) {
    id
    delta
    account {
      label
      image
    }
    term {
      atom {
        label
      }
    }
    created_at
  }
}`,
    variables: {
      account_id: '0x88D0aF73508452c1a453356b3Fac26525aEc23A2',
      limit: 10
    }
  },
  {
    id: 'deposits-from-following',
    title: 'Deposits from Following',
    query: `query GetDepositsFromFollowing($account_id: String!, $limit: Int!) {
  signals_from_following(
    args: { account_id: $account_id }
    where: { deposit_id: { _is_null: false } }
    limit: $limit
    order_by: { delta: desc }
  ) {
    id
    delta
    account {
      label
    }
    term {
      atom {
        label
      }
    }
    created_at
  }
}`,
    variables: {
      account_id: '0x88D0aF73508452c1a453356b3Fac26525aEc23A2',
      limit: 10
    }
  }
];

<GraphQLPlaygroundCustom queries={followingQueries} />

## Use Cases

### Social Activity Feed

Build a personalized feed showing activity from followed accounts:

```typescript
async function getSocialFeed(
  accountId: string,
  options: { limit?: number; offset?: number } = {}
) {
  const query = `
    query GetSocialFeed(
      $account_id: String!
      $limit: Int!
      $offset: Int!
    ) {
      signals_from_following(
        args: { account_id: $account_id }
        limit: $limit
        offset: $offset
        order_by: { created_at: desc }
      ) {
        id
        delta
        account {
          id
          label
          image
        }
        term {
          atom {
            label
            image
          }
        }
        triple_id
        created_at
      }
    }
  `

  const data = await client.request(query, {
    account_id: accountId,
    limit: options.limit || 20,
    offset: options.offset || 0
  })

  return data.signals_from_following.map(signal => ({
    ...signal,
    formattedMessage: formatActivityMessage(signal)
  }))
}

function formatActivityMessage(signal: Signal): string {
  const target = signal.term?.atom?.label ?? `Triple ${signal.triple_id}`

  const amount = formatEther(signal.delta)

  return `${signal.account.label} signaled on ${target} (${amount} ETH)`
}
```

### React Social Feed Component

```tsx
function SocialFeed({ accountId }: { accountId: string }) {
  const [offset, setOffset] = useState(0)
  const LIMIT = 20

  const { data, loading, fetchMore } = useQuery(GET_SIGNALS_FROM_FOLLOWING, {
    variables: {
      account_id: accountId,
      limit: LIMIT,
      offset: 0
    }
  })

  if (loading && !data) return <Spinner />

  const signals = data?.signals_from_following || []

  const loadMore = () => {
    fetchMore({
      variables: { offset: signals.length }
    })
  }

  return (
    <div className="social-feed">
      <h2>Activity from People You Follow</h2>
      {signals.length === 0 ? (
        <p>No recent activity from people you follow</p>
      ) : (
        <>
          {signals.map(signal => (
            <SignalCard key={signal.id} signal={signal} />
          ))}
          <button onClick={loadMore}>Load More</button>
        </>
      )}
    </div>
  )
}

function SignalCard({ signal }: { signal: Signal }) {
  return (
    <div className="signal-card">
      <img src={signal.account.image} alt={signal.account.label} />
      <div className="content">
        <strong>{signal.account.label}</strong>
        <span>signaled on</span>
        <span className="target">
          {signal.term?.atom?.label ?? `Triple ${signal.triple_id}`}
        </span>
      </div>
      <div className="amount">
        {formatEther(signal.delta)} ETH
      </div>
      <time>{formatRelativeTime(signal.created_at)}</time>
    </div>
  )
}
```

### Filter by Deposits

Show only deposit signals from followed accounts:

```typescript
async function getDepositsFromFollowing(accountId: string) {
  const query = `
    query GetDepositsFromFollowing($account_id: String!) {
      signals_from_following(
        args: { account_id: $account_id }
        where: { deposit_id: { _is_null: false } }
        order_by: { delta: desc }
        limit: 50
      ) {
        id
        delta
        account { label }
        term {
          atom { label }
        }
        created_at
      }
    }
  `

  return client.request(query, { account_id: accountId })
}
```

## How Following Works

The `signals_from_following` query uses the social graph built from:
- "Follow" triples where the account is the subject
- Positions on "Follow" atoms involving the account

To see who an account follows, use the [Following Query](/docs/graphql-api/queries/accounts/following).

## Best Practices

1. **Implement pagination** - Social feeds can grow large
2. **Show relative timestamps** - "2 hours ago" is more readable
3. **Group by time** - Consider grouping signals by day
4. **Cache appropriately** - Feed data changes frequently

## Related

- [List Signals](./list-signals) - All signals
- [Following Query](/docs/graphql-api/queries/accounts/following) - Who an account follows
- [Subscriptions](/docs/graphql-api/subscriptions/overview) - Real-time updates
