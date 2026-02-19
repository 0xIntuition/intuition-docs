---
title: Account PnL Rank
sidebar_label: Account Rank
sidebar_position: 4
description: Query a single account's leaderboard rank and percentile
keywords: [graphql, leaderboard, account, rank, percentile, pnl]
---

import GraphQLPlaygroundCustom from '@site/src/components/GraphQLPlaygroundCustom';

# Account PnL Rank

Look up a single account's leaderboard rank and percentile using `get_account_pnl_rank`. Returns `account_pnl_rank` rows.

## Query Structure

```graphql
query GetAccountPnlRank {
  get_account_pnl_rank(
    args: {
      p_account_id: "0xd8da6bf26964af9d7eed9e03e53415d37aa96045"
      p_sort_by: "total_pnl"
    }
  ) {
    account_id
    account_label
    account_image
    rank
    percentile
    total_pnl
    pnl_pct
    total_volume
    total_position_count
    win_rate
    total_accounts
  }
}
```

## Function Arguments

| Argument | Type | Description |
|----------|------|-------------|
| `p_account_id` | `String` | Account address to look up |
| `p_sort_by` | `String` | Ranking metric (e.g. `"total_pnl"`, `"pnl_pct"`, `"win_rate"`) |
| `p_term_id` | `String` | Optional term filter |
| `p_time_filter` | `String` | Optional time filter preset |

## Response Fields (`account_pnl_rank`)

| Field | Type | Description |
|-------|------|-------------|
| `account_id` | `String` | Account address |
| `account_label` | `String` | Display name |
| `account_image` | `String` | Profile image URL |
| `rank` | `bigint` | Leaderboard rank position |
| `percentile` | `numeric` | Percentile ranking (0-100) |
| `total_pnl` | `numeric` | Total profit/loss |
| `pnl_pct` | `numeric` | PnL percentage |
| `total_volume` | `numeric` | Total trading volume |
| `total_position_count` | `bigint` | Total number of positions |
| `win_rate` | `numeric` | Win rate across positions |
| `total_accounts` | `bigint` | Total accounts on the leaderboard |

## Interactive Example

export const rankQueries = [
  {
    id: 'account-rank',
    title: 'Account Rank Lookup',
    query: `query GetAccountPnlRank {
  get_account_pnl_rank(
    args: {
      p_account_id: "0xd8da6bf26964af9d7eed9e03e53415d37aa96045"
      p_sort_by: "total_pnl"
    }
  ) {
    account_id
    account_label
    rank
    percentile
    total_pnl
    pnl_pct
    win_rate
    total_accounts
  }
}`,
    variables: {}
  }
];

<GraphQLPlaygroundCustom queries={rankQueries} />

## Use Cases

### Profile Rank Badge

Display a user's rank on their profile:

```typescript
import { GraphQLClient } from 'graphql-request'
import { API_URL_PROD } from '@0xintuition/graphql'

const client = new GraphQLClient(API_URL_PROD)

async function getAccountRank(accountId: string) {
  const query = `
    query GetAccountPnlRank {
      get_account_pnl_rank(
        args: {
          p_account_id: "${accountId}"
          p_sort_by: "total_pnl"
        }
      ) {
        rank
        percentile
        total_pnl
        pnl_pct
        total_accounts
      }
    }
  `

  const data = await client.request(query)
  return data.get_account_pnl_rank[0]
}
```

## Related

- [PnL Leaderboard](./pnl-leaderboard) - Full leaderboard rankings
- [Leaderboard Stats](./leaderboard-stats) - Aggregate protocol statistics
- [Account PnL Current](/docs/graphql-api/queries/pnl/account-pnl-current) - Detailed PnL snapshot
