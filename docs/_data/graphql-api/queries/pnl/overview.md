---
title: PnL Queries Overview
sidebar_label: Overview
sidebar_position: 1
description: Profit and Loss (PnL) queries for tracking account and position performance
keywords: [graphql, pnl, profit, loss, performance, tracking, charts]
---

# Profit & Loss (PnL) Queries

The Intuition GraphQL API provides Profit and Loss (PnL) queries to track portfolio performance, analyze realized gains, and visualize value changes over time. These queries are powered by the chart-api service and exposed through Hasura as GraphQL actions.

## Available PnL Operations

| Operation | Description |
|-----------|-------------|
| [`getAccountPnlCurrent`](./account-pnl-current) | Current account PnL snapshot with equity value, net invested, and unrealized gains |
| [`getAccountPnlChart`](./account-pnl-chart) | Account PnL time-series data with configurable intervals |
| [`getAccountPnlRealized`](./account-pnl-realized) | Realized PnL data for an account over a time range |
| [`getPositionPnlChart`](./position-pnl-chart) | Position-level PnL time-series for a specific vault |

## PnL Methodology

All PnL calculations use the following formulas:

| Metric | Formula |
|--------|---------|
| `equity_value` | `shares_total * share_price / 1e18` |
| `net_invested` | `total_assets_in - total_assets_out` |
| `total_pnl` | `equity_value + total_assets_out - total_assets_in` |
| `pnl_pct` | `(total_pnl / net_invested) * 100` when `net_invested > 0`, otherwise `0` |
| `unrealized_pnl` | `equity_value - net_invested` |

## Input Pattern

All PnL queries use a single `input` object argument rather than separate parameters:

```graphql
query GetAccountPnlCurrent($input: GetAccountPnlCurrentInput!) {
  getAccountPnlCurrent(input: $input) {
    equity_value
    net_invested
    total_pnl
    pnl_pct
  }
}
```

```json
{
  "input": {
    "account_id": "0xd8da6bf26964af9d7eed9e03e53415d37aa96045"
  }
}
```

## Use Cases

### Portfolio Dashboard

Build portfolio views showing:
- Current equity value and net invested amount
- Total and unrealized PnL with percentage
- Historical performance charts with configurable intervals

### Position Analysis

Track individual position performance:
- Position-level PnL trends over time
- Compare performance across different vaults (by `term_id` and `curve_id`)

### Performance Reporting

Generate performance reports with:
- Time-series PnL data at hourly, daily, weekly, or monthly intervals
- Realized PnL over configurable time ranges

## Related Documentation

- [Account PnL Current](./account-pnl-current) - Current PnL snapshot
- [Account PnL Chart](./account-pnl-chart) - Historical PnL data
- [Account PnL Realized](./account-pnl-realized) - Realized PnL data
- [Position PnL Chart](./position-pnl-chart) - Position-level tracking
