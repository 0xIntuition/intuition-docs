---
title: Leaderboard Queries Overview
sidebar_label: Overview
sidebar_position: 1
description: Leaderboard queries for ranking accounts and vaults by PnL performance
keywords: [graphql, leaderboard, pnl, ranking, performance, traders]
---

# Leaderboard Queries

The Intuition GraphQL API provides leaderboard queries for ranking accounts and vaults by PnL performance. These are exposed as Hasura SQL functions that return `pnl_leaderboard_entry` rows.

## Available Leaderboard Operations

### PnL Leaderboard

| Operation | Description |
|-----------|-------------|
| [`get_pnl_leaderboard`](./pnl-leaderboard) | Full PnL leaderboard with filtering and sorting |
| [`get_pnl_leaderboard_period`](./pnl-leaderboard#period-scoped) | Period-scoped PnL leaderboard with date range |

### Vault Leaderboard

| Operation | Description |
|-----------|-------------|
| [`get_vault_leaderboard`](./vault-leaderboard) | Vault-level leaderboard filtered by term and curve |
| [`get_vault_leaderboard_period`](./vault-leaderboard#period-scoped) | Period-scoped vault leaderboard with date range |

### Account Rank & Stats

| Operation | Description |
|-----------|-------------|
| [`get_account_pnl_rank`](./account-rank) | Single account rank and percentile |
| [`get_pnl_leaderboard_stats`](./leaderboard-stats) | Aggregate protocol-level leaderboard statistics |

### Direct Table Queries

These queries access the underlying tables directly with standard Hasura filtering (`where`, `order_by`, `limit`, `offset`):

| Query | Description |
|-------|-------------|
| `pnl_leaderboard_entry` | Direct access to leaderboard entries (34 fields) |
| `pnl_leaderboard_stats` | Direct access to aggregate stats |
| `account_pnl_rank` | Direct access to account rank data |

## Common Arguments Pattern

The leaderboard SQL functions use `p_` prefixed arguments passed via an `args` object:

```graphql
query {
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
    rank
    total_pnl_formatted
    pnl_pct
    win_rate
  }
}
```

## Related Documentation

- [PnL Leaderboard](./pnl-leaderboard) - Full PnL leaderboard
- [Vault Leaderboard](./vault-leaderboard) - Vault-level leaderboard
- [Account Rank](./account-rank) - Single account rank lookup
- [Leaderboard Stats](./leaderboard-stats) - Aggregate statistics
- [PnL Queries](/docs/graphql-api/queries/pnl/overview) - Account and position PnL data
