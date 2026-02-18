---
title: Protocol Stats
sidebar_label: Protocol Stats
sidebar_position: 1
description: Query protocol-wide statistics
keywords: [graphql, stats, protocol, metrics, analytics]
---

import GraphQLPlaygroundCustom from '@site/src/components/GraphQLPlaygroundCustom';

# Protocol Stats Query

Query protocol-wide statistics and metrics. Get aggregate data about atoms, triples, positions, and volume.

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
    updated_at
  }
}
```

## Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | String | Stats record identifier |
| `total_atoms` | Int | Total number of atoms created |
| `total_triples` | Int | Total number of triples created |
| `total_positions` | Int | Total number of active positions |
| `total_signals` | Int | Total number of signals (deposits + redemptions) |
| `total_accounts` | Int | Total unique accounts |
| `total_fees` | String | Total protocol fees collected (wei) |
| `contract_balance` | String | Current contract balance (wei) |
| `updated_at` | String | Last update timestamp |

## Interactive Example

export const statsQueries = [
  {
    id: 'protocol-stats',
    title: 'Protocol Stats',
    query: `query GetProtocolStats {
  stats {
    id
    total_atoms
    total_triples
    total_positions
    total_signals
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

### Protocol Dashboard

```typescript
import { useQuery, gql } from '@apollo/client';
import { formatEther } from 'viem';

const GET_PROTOCOL_STATS = gql`
  query GetProtocolStats {
    stats {
      total_atoms
      total_triples
      total_positions
      total_accounts
      total_fees
      contract_balance
      updated_at
    }
  }
`;

function ProtocolDashboard() {
  const { data, loading } = useQuery(GET_PROTOCOL_STATS, {
    pollInterval: 30000 // Refresh every 30 seconds
  });

  if (loading) return <p>Loading...</p>;

  const stats = data?.stats?.[0];

  return (
    <div className="grid grid-cols-2 gap-4">
      <StatCard
        title="Total Atoms"
        value={stats?.total_atoms?.toLocaleString()}
      />
      <StatCard
        title="Total Triples"
        value={stats?.total_triples?.toLocaleString()}
      />
      <StatCard
        title="Active Positions"
        value={stats?.total_positions?.toLocaleString()}
      />
      <StatCard
        title="Unique Accounts"
        value={stats?.total_accounts?.toLocaleString()}
      />
      <StatCard
        title="Total Fees Collected"
        value={`${formatEther(stats?.total_fees || '0')} ETH`}
      />
      <StatCard
        title="Contract Balance"
        value={`${formatEther(stats?.contract_balance || '0')} ETH`}
      />
      <div className="col-span-2 text-sm text-gray-500">
        Last updated: {new Date(stats?.updated_at).toLocaleString()}
      </div>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="p-4 bg-gray-800 rounded-lg">
      <h3 className="text-sm text-gray-400">{title}</h3>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
```

### Stats Over Time

Track how protocol metrics change over time using stats aggregate:

```graphql
query GetStatsHistory {
  stats_aggregate {
    aggregate {
      max {
        total_atoms
        total_triples
        total_accounts
      }
    }
  }
}
```

### Compare Networks

```typescript
import { useQuery } from '@apollo/client';

function NetworkComparison() {
  const { data: mainnet } = useQuery(GET_PROTOCOL_STATS, {
    context: { endpoint: 'mainnet' }
  });

  const { data: testnet } = useQuery(GET_PROTOCOL_STATS, {
    context: { endpoint: 'testnet' }
  });

  return (
    <table>
      <thead>
        <tr>
          <th>Metric</th>
          <th>Mainnet</th>
          <th>Testnet</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Atoms</td>
          <td>{mainnet?.stats?.[0]?.total_atoms}</td>
          <td>{testnet?.stats?.[0]?.total_atoms}</td>
        </tr>
        {/* ... more rows */}
      </tbody>
    </table>
  );
}
```

## Best Practices

1. **Poll periodically** - Stats update regularly; refresh every 30-60 seconds
2. **Format large numbers** - Use `toLocaleString()` for readability
3. **Show last updated** - Display when stats were last refreshed
4. **Convert wei values** - Format fees and balances as ETH

## Related

- [Signal Stats](/docs/graphql-api/queries/signals/signal-stats) - Time-bucketed signal statistics
- [Fee Transfers](/docs/graphql-api/queries/events/fee-transfers) - Detailed fee data
