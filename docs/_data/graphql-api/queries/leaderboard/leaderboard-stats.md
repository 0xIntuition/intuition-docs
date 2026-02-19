---
title: Leaderboard Stats
sidebar_label: Leaderboard Stats
sidebar_position: 5
description: Query aggregate leaderboard statistics for the protocol
keywords: [graphql, leaderboard, stats, aggregate, protocol, traders]
---

import GraphQLPlaygroundCustom from '@site/src/components/GraphQLPlaygroundCustom';

# Leaderboard Stats

Get aggregate protocol-level statistics using `get_pnl_leaderboard_stats`. Returns `pnl_leaderboard_stats` rows with metrics like total traders, average PnL, and profitability rates.

## Query Structure

```graphql
query GetPnlLeaderboardStats {
  get_pnl_leaderboard_stats(
    args: {
      p_term_id: null
      p_time_filter: null
    }
  ) {
    total_traders
    profitable_traders
    unprofitable_traders
    profitable_pct
    total_pnl_sum
    avg_pnl
    median_pnl
    total_volume
    avg_volume
  }
}
```

## Function Arguments

| Argument | Type | Description |
|----------|------|-------------|
| `p_term_id` | `String` | Optional term filter (null for protocol-wide) |
| `p_time_filter` | `String` | Optional time filter preset |

## Response Fields (`pnl_leaderboard_stats`)

| Field | Type | Description |
|-------|------|-------------|
| `total_traders` | `bigint` | Total number of traders |
| `profitable_traders` | `bigint` | Number of traders with positive PnL |
| `unprofitable_traders` | `bigint` | Number of traders with negative PnL |
| `profitable_pct` | `numeric` | Percentage of profitable traders |
| `total_pnl_sum` | `numeric` | Sum of all PnL across traders |
| `avg_pnl` | `numeric` | Average PnL per trader |
| `median_pnl` | `numeric` | Median PnL across traders |
| `total_volume` | `numeric` | Total trading volume across all traders |
| `avg_volume` | `numeric` | Average volume per trader |

## Interactive Example

export const statsQueries = [
  {
    id: 'protocol-stats',
    title: 'Protocol Leaderboard Stats',
    query: `query GetPnlLeaderboardStats {
  get_pnl_leaderboard_stats(args: {}) {
    total_traders
    profitable_traders
    unprofitable_traders
    profitable_pct
    total_pnl_sum
    avg_pnl
    median_pnl
    total_volume
    avg_volume
  }
}`,
    variables: {}
  }
];

<GraphQLPlaygroundCustom queries={statsQueries} />

## Use Cases

### Protocol Health Dashboard

Display aggregate protocol trading metrics:

```typescript
import { GraphQLClient } from 'graphql-request'
import { API_URL_PROD } from '@0xintuition/graphql'

const client = new GraphQLClient(API_URL_PROD)

async function getProtocolStats() {
  const query = `
    query GetPnlLeaderboardStats {
      get_pnl_leaderboard_stats(args: {}) {
        total_traders
        profitable_pct
        avg_pnl
        median_pnl
        total_volume
      }
    }
  `

  const data = await client.request(query)
  return data.get_pnl_leaderboard_stats[0]
}
```

## Related

- [PnL Leaderboard](./pnl-leaderboard) - Individual trader rankings
- [Account Rank](./account-rank) - Single account rank lookup
- [Protocol Stats](/docs/graphql-api/queries/stats/protocol-stats) - Other protocol-level statistics
