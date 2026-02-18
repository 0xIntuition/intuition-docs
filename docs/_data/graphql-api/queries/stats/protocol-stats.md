---
title: Protocol Statistics
sidebar_label: Protocol Stats
sidebar_position: 2
description: Query protocol-wide statistics and metrics
keywords: [graphql, stats, protocol, tvl, metrics]
---

import GraphQLPlaygroundCustom from '@site/src/components/GraphQLPlaygroundCustom';

# Protocol Statistics

Query aggregate statistics for the entire Intuition protocol.

## Query Structure

```graphql
query GetProtocolStats {
  stats {
    id
    total_atoms
    total_triples
    total_positions
    total_signals
    total_accounts
    total_fees
    contract_balance
    created_at
    updated_at
  }
}
```

## Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | `String` | Stats record ID |
| `total_atoms` | `Int` | Total atoms created |
| `total_triples` | `Int` | Total triples created |
| `total_positions` | `Int` | Total active positions |
| `total_signals` | `Int` | Total signals (deposits + redemptions) |
| `total_accounts` | `Int` | Unique accounts that have interacted |
| `total_fees` | `String` | Total protocol fees in wei |
| `contract_balance` | `String` | Current contract balance in wei |
| `updated_at` | `DateTime` | Last update timestamp |

## Expected Response

```json
{
  "data": {
    "stats": [
      {
        "id": "1",
        "total_atoms": 15420,
        "total_triples": 42350,
        "total_positions": 8750,
        "total_signals": 25000,
        "total_accounts": 3200,
        "total_fees": "1500000000000000000",
        "contract_balance": "500000000000000000000",
        "updated_at": "2024-01-15T10:30:00Z"
      }
    ]
  }
}
```

## Interactive Example

export const statsQueries = [
  {
    id: 'protocol-stats',
    title: 'Protocol Statistics',
    query: `query GetProtocolStats {
  stats {
    total_atoms
    total_triples
    total_positions
    total_accounts
    total_fees
    contract_balance
    updated_at
  }
}`,
    variables: {}
  }
];

<GraphQLPlaygroundCustom queries={statsQueries} />

## Use Cases

### Dashboard Overview

Display protocol metrics on a dashboard:

```typescript
async function getProtocolOverview() {
  const query = `
    query GetProtocolOverview {
      stats {
        total_atoms
        total_triples
        total_positions
        total_accounts
        total_fees
        contract_balance
      }
    }
  `

  const data = await client.request(query)
  const stats = data.stats[0]

  return {
    atoms: stats.total_atoms,
    triples: stats.total_triples,
    positions: stats.total_positions,
    users: stats.total_accounts,
    tvl: formatEther(stats.contract_balance),
    fees: formatEther(stats.total_fees)
  }
}
```

### React Stats Component

```tsx
function ProtocolStats() {
  const { data, loading } = useQuery(GET_PROTOCOL_STATS)

  if (loading) return <Spinner />

  const stats = data?.stats?.[0]

  return (
    <div className="stats-grid">
      <StatCard
        title="Total Atoms"
        value={stats.total_atoms.toLocaleString()}
      />
      <StatCard
        title="Total Triples"
        value={stats.total_triples.toLocaleString()}
      />
      <StatCard
        title="Active Positions"
        value={stats.total_positions.toLocaleString()}
      />
      <StatCard
        title="Unique Users"
        value={stats.total_accounts.toLocaleString()}
      />
      <StatCard
        title="Total Value Locked"
        value={`${formatEther(stats.contract_balance)} ETH`}
      />
      <StatCard
        title="Protocol Fees"
        value={`${formatEther(stats.total_fees)} ETH`}
      />
    </div>
  )
}
```

## Best Practices

1. **Cache results** - Stats update periodically, not in real-time
2. **Format large numbers** - Use locale formatting for readability
3. **Convert wei** - Display ETH values instead of wei
4. **Show update time** - Indicate when stats were last refreshed

## Related

- [Fee Transfers](./fee-transfers) - Detailed fee history
- [Aggregations](/docs/graphql-api/queries/advanced/aggregations) - Custom aggregations
