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
    total_pnl_sum_formatted
    avg_pnl_formatted
    median_pnl_formatted
    total_volume_formatted
    avg_volume_formatted
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
| `total_pnl_sum_formatted` | `numeric` | Sum of all PnL across traders (formatted) |
| `total_pnl_sum_raw` | `numeric` | Sum of all PnL across traders (raw) |
| `avg_pnl_formatted` | `numeric` | Average PnL per trader (formatted) |
| `avg_pnl_raw` | `numeric` | Average PnL per trader (raw) |
| `median_pnl_formatted` | `numeric` | Median PnL across traders (formatted) |
| `median_pnl_raw` | `numeric` | Median PnL across traders (raw) |
| `total_volume_formatted` | `numeric` | Total trading volume across all traders (formatted) |
| `total_volume_raw` | `numeric` | Total trading volume across all traders (raw) |
| `avg_volume_formatted` | `numeric` | Average volume per trader (formatted) |
| `avg_volume_raw` | `numeric` | Average volume per trader (raw) |

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
    total_pnl_sum_formatted
    avg_pnl_formatted
    median_pnl_formatted
    total_volume_formatted
    avg_volume_formatted
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
        avg_pnl_formatted
        median_pnl_formatted
        total_volume_formatted
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
