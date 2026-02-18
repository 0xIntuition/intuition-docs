---
title: PnL Queries Overview
sidebar_label: Overview
sidebar_position: 1
description: Profit and Loss (PnL) queries for tracking account and position performance
keywords: [graphql, pnl, profit, loss, performance, tracking, charts]
---

# Profit & Loss (PnL) Queries

The Intuition GraphQL API provides comprehensive Profit and Loss (PnL) queries to track portfolio performance, analyze realized gains, and visualize value changes over time.

## Available PnL Operations

| Operation | Description |
|-----------|-------------|
| [`getAccountPnlCurrent`](./account-pnl-current) | Current account PnL snapshot with total value, cost basis, and unrealized/realized gains |
| [`getAccountPnlChart`](./account-pnl-chart) | Account PnL data over time with configurable intervals for charting |
| [`getAccountPnlRealized`](./account-pnl-realized) | Detailed breakdown of realized PnL by individual positions |
| [`getPositionPnlChart`](./position-pnl-chart) | Position-level PnL tracking over time |

## Use Cases

### Portfolio Dashboard

Build comprehensive portfolio views showing:
- Total portfolio value and performance
- Unrealized vs realized gains
- Historical performance charts

### Position Analysis

Track individual position performance:
- Entry cost vs current value
- Position-level PnL trends
- Realized gains from exits

### Performance Reporting

Generate performance reports with:
- Time-series PnL data
- Aggregated statistics
- Exportable chart data

## Quick Start

```typescript
import { GraphQLClient } from 'graphql-request'
import { API_URL_PROD } from '@0xintuition/graphql'

const client = new GraphQLClient(API_URL_PROD)

// Get current PnL snapshot
const query = `
  query GetAccountPnlCurrent($address: String!) {
    getAccountPnlCurrent(address: $address) {
      total_value
      total_cost
      unrealized_pnl
      realized_pnl
      total_pnl
    }
  }
`

const data = await client.request(query, {
  address: '0x...'
})
```

## Related Documentation

- [Account PnL Current](./account-pnl-current) - Current PnL snapshot
- [Account PnL Chart](./account-pnl-chart) - Historical PnL data
- [Account PnL Realized](./account-pnl-realized) - Realized gains breakdown
- [Position PnL Chart](./position-pnl-chart) - Position-level tracking
