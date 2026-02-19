---
title: Vault Leaderboard
sidebar_label: Vault Leaderboard
sidebar_position: 3
description: Query vault-level leaderboard rankings by PnL performance
keywords: [graphql, leaderboard, vault, pnl, ranking]
---

import GraphQLPlaygroundCustom from '@site/src/components/GraphQLPlaygroundCustom';

# Vault Leaderboard

Rank accounts within specific vaults using `get_vault_leaderboard` and `get_vault_leaderboard_period`. Both return `pnl_leaderboard_entry` rows (same schema as the [PnL Leaderboard](./pnl-leaderboard)).

## Query Structure

```graphql
query GetVaultLeaderboard {
  get_vault_leaderboard(
    args: {
      p_term_id: "0x57d94c..."
      p_curve_id: 1
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
    current_equity_value_formatted
    total_volume_formatted
  }
}
```

## Function Arguments

| Argument | Type | Description |
|----------|------|-------------|
| `p_term_id` | `String` | Term ID to filter by |
| `p_curve_id` | `numeric` | Curve ID (bonding curve) to filter by |
| `p_limit` | `Int` | Number of results to return |
| `p_offset` | `Int` | Offset for pagination |
| `p_sort_by` | `String` | Field to sort by |
| `p_sort_order` | `String` | Sort direction: `"asc"` or `"desc"` |

## Period-Scoped {#period-scoped}

Use `get_vault_leaderboard_period` to scope results to a specific date range:

```graphql
query GetVaultLeaderboardPeriod {
  get_vault_leaderboard_period(
    args: {
      p_term_id: "0x57d94c..."
      p_curve_id: 1
      p_limit: 10
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
  }
}
```

### Period Arguments

| Argument | Type | Description |
|----------|------|-------------|
| `p_term_id` | `String` | Term ID filter |
| `p_curve_id` | `numeric` | Curve ID filter |
| `p_limit` | `Int` | Number of results |
| `p_offset` | `Int` | Pagination offset |
| `p_sort_by` | `String` | Sort field |
| `p_sort_order` | `String` | Sort direction |
| `p_start_date` | `timestamptz` | Period start date |
| `p_end_date` | `timestamptz` | Period end date |

## Response Fields

Returns `pnl_leaderboard_entry` rows -- see the [full field reference](./pnl-leaderboard#response-fields-pnl_leaderboard_entry) on the PnL Leaderboard page.

## Interactive Example

export const vaultLeaderboardQueries = [
  {
    id: 'vault-top',
    title: 'Top Traders in a Vault',
    query: `query GetVaultLeaderboard {
  get_vault_leaderboard(
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
    current_equity_value_formatted
  }
}`,
    variables: {}
  }
];

<GraphQLPlaygroundCustom queries={vaultLeaderboardQueries} />

## Related

- [PnL Leaderboard](./pnl-leaderboard) - Protocol-wide leaderboard
- [Account Rank](./account-rank) - Single account rank lookup
- [Vault Details](/docs/graphql-api/queries/vaults/vault-details) - Vault information
