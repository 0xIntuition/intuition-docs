---
title: PnL Leaderboard
sidebar_label: PnL Leaderboard
sidebar_position: 2
description: Query the PnL leaderboard to rank accounts by trading performance
keywords: [graphql, leaderboard, pnl, ranking, traders, performance]
---

import GraphQLPlaygroundCustom from '@site/src/components/GraphQLPlaygroundCustom';

# PnL Leaderboard

Rank accounts by PnL performance using `get_pnl_leaderboard` and `get_pnl_leaderboard_period`. Both return `pnl_leaderboard_entry` rows.

## Query Structure

```graphql
query GetPnlLeaderboard {
  get_pnl_leaderboard(
    args: {
      p_limit: 10
      p_offset: 0
      p_sort_by: "total_pnl"
      p_sort_order: "desc"
    }
  ) {
    account_id
    account_label
    account_image
    rank
    pnl_pct
    win_rate
    total_pnl_formatted
    total_pnl_raw
    unrealized_pnl_formatted
    realized_pnl_formatted
    current_equity_value_formatted
    total_volume_formatted
    active_position_count
    total_position_count
    winning_positions
    losing_positions
    best_trade_pnl_formatted
    worst_trade_pnl_formatted
    first_position_at
    last_activity_at
  }
}
```

## Function Arguments

| Argument | Type | Description |
|----------|------|-------------|
| `p_limit` | `Int` | Number of results to return |
| `p_offset` | `Int` | Offset for pagination |
| `p_sort_by` | `String` | Field to sort by (e.g. `"total_pnl"`, `"pnl_pct"`, `"win_rate"`) |
| `p_sort_order` | `String` | Sort direction: `"asc"` or `"desc"` |
| `p_term_id` | `String` | Filter to a specific term |
| `p_time_filter` | `String` | Time filter preset |
| `p_start_time` | `timestamptz` | Start of time range |
| `p_end_time` | `timestamptz` | End of time range |
| `p_min_positions` | `Int` | Minimum position count filter |
| `p_min_volume` | `numeric` | Minimum volume filter |
| `p_exclude_protocol_accounts` | `Boolean` | Exclude protocol-owned accounts |

## Response Fields (`pnl_leaderboard_entry`)

### Identity

| Field | Type | Description |
|-------|------|-------------|
| `account_id` | `String` | Account address |
| `account_label` | `String` | Display name |
| `account_image` | `String` | Profile image URL |
| `rank` | `bigint` | Leaderboard rank |

### PnL Metrics

| Field | Type | Description |
|-------|------|-------------|
| `pnl_pct` | `numeric` | PnL percentage |
| `win_rate` | `numeric` | Win rate across positions |
| `total_pnl_formatted` | `numeric` | Total PnL (formatted) |
| `total_pnl_raw` | `numeric` | Total PnL (raw wei) |
| `unrealized_pnl_formatted` | `numeric` | Unrealized PnL (formatted) |
| `unrealized_pnl_raw` | `numeric` | Unrealized PnL (raw) |
| `realized_pnl_formatted` | `numeric` | Realized PnL (formatted) |
| `realized_pnl_raw` | `numeric` | Realized PnL (raw) |
| `pnl_change_formatted` | `numeric` | PnL change (formatted) |
| `pnl_change_raw` | `numeric` | PnL change (raw) |

### Portfolio

| Field | Type | Description |
|-------|------|-------------|
| `current_equity_value_formatted` | `numeric` | Current equity value (formatted) |
| `current_equity_value_raw` | `numeric` | Current equity value (raw) |
| `total_deposits_formatted` | `numeric` | Total deposits (formatted) |
| `total_deposits_raw` | `numeric` | Total deposits (raw) |
| `total_redemptions_formatted` | `numeric` | Total redemptions (formatted) |
| `total_redemptions_raw` | `numeric` | Total redemptions (raw) |
| `total_volume_formatted` | `numeric` | Total volume (formatted) |
| `total_volume_raw` | `numeric` | Total volume (raw) |
| `redeemable_assets_formatted` | `numeric` | Redeemable assets (formatted) |
| `redeemable_assets_raw` | `numeric` | Redeemable assets (raw) |

### Trades

| Field | Type | Description |
|-------|------|-------------|
| `best_trade_pnl_formatted` | `numeric` | Best trade PnL (formatted) |
| `best_trade_pnl_raw` | `numeric` | Best trade PnL (raw) |
| `worst_trade_pnl_formatted` | `numeric` | Worst trade PnL (formatted) |
| `worst_trade_pnl_raw` | `numeric` | Worst trade PnL (raw) |
| `active_position_count` | `bigint` | Currently active positions |
| `total_position_count` | `bigint` | Total positions (all time) |
| `winning_positions` | `bigint` | Positions with positive PnL |
| `losing_positions` | `bigint` | Positions with negative PnL |
| `first_position_at` | `timestamptz` | First position timestamp |
| `last_activity_at` | `timestamptz` | Most recent activity |

## Period-Scoped {#period-scoped}

Use `get_pnl_leaderboard_period` to scope results to a specific date range:

```graphql
query GetPnlLeaderboardPeriod {
  get_pnl_leaderboard_period(
    args: {
      p_limit: 10
      p_offset: 0
      p_sort_by: "total_pnl"
      p_sort_order: "desc"
      p_start_date: "2024-01-01T00:00:00Z"
      p_end_date: "2024-01-31T23:59:59Z"
    }
  ) {
    account_id
    account_label
    rank
    total_pnl_formatted
    pnl_pct
    win_rate
  }
}
```

### Period Arguments

| Argument | Type | Description |
|----------|------|-------------|
| `p_limit` | `Int` | Number of results |
| `p_offset` | `Int` | Pagination offset |
| `p_sort_by` | `String` | Sort field |
| `p_sort_order` | `String` | Sort direction |
| `p_start_date` | `timestamptz` | Period start date |
| `p_end_date` | `timestamptz` | Period end date |
| `p_term_id` | `String` | Filter to specific term |
| `p_min_positions` | `Int` | Minimum position count |
| `p_min_volume` | `numeric` | Minimum volume |
| `p_exclude_protocol_accounts` | `Boolean` | Exclude protocol accounts |

## Interactive Example

export const leaderboardQueries = [
  {
    id: 'top-traders',
    title: 'Top 10 Traders by PnL',
    query: `query GetPnlLeaderboard {
  get_pnl_leaderboard(
    args: {
      p_limit: 10
      p_sort_by: "total_pnl"
      p_sort_order: "desc"
    }
  ) {
    account_id
    account_label
    rank
    total_pnl_formatted
    pnl_pct
    win_rate
    active_position_count
  }
}`,
    variables: {}
  }
];

<GraphQLPlaygroundCustom queries={leaderboardQueries} />

## Related

- [Vault Leaderboard](./vault-leaderboard) - Vault-level rankings
- [Account Rank](./account-rank) - Single account rank lookup
- [Leaderboard Stats](./leaderboard-stats) - Aggregate statistics
