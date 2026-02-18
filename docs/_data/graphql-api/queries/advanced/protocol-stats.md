---
title: Protocol Statistics
sidebar_label: Protocol Stats
sidebar_position: 9
description: Query protocol-wide statistics and metrics
keywords: [graphql, stats, statistics, protocol, metrics, analytics]
---

# Protocol Statistics

Query protocol-wide statistics and metrics. The `stats` table provides aggregated data about protocol activity.

## Query Structure

```graphql
query GetProtocolStats {
  stats {
    id
    atom_count
    triple_count
    account_count
    position_count
    signal_count
    total_deposits
    total_redemptions
    contract_balance
    updated_at
  }
}
```

## Single Stat Entry

```graphql
query GetStat($id: String!) {
  stat(id: $id) {
    atom_count
    triple_count
    account_count
    position_count
    signal_count
    contract_balance
  }
}
```

## Stats with Time Series

Combine current stats with historical data:

```graphql
query GetStatsWithHistory($days: Int!) {
  current: stats(limit: 1) {
    atom_count
    triple_count
    account_count
    position_count
    contract_balance
  }
  signal_stats_daily(
    limit: $days
    order_by: { bucket: desc }
  ) {
    bucket
    total_signals
    deposit_count
    redemption_count
  }
}
```

## Stats Aggregation

```graphql
query GetStatsAggregate {
  stats_aggregate {
    aggregate {
      sum {
        atom_count
        triple_count
        position_count
      }
      avg {
        contract_balance
      }
    }
  }
}
```

## Chainlink Prices

Query on-chain price data from Chainlink oracles:

```graphql
query GetChainlinkPrices($limit: Int!) {
  chainlink_prices(
    order_by: { block_timestamp: desc }
    limit: $limit
  ) {
    id
    price
    block_number
    block_timestamp
    transaction_hash
  }
}
```

## Use Cases

### Protocol Dashboard

```typescript
async function getProtocolDashboard() {
  const query = `
    query GetProtocolDashboard {
      stats(limit: 1) {
        atom_count
        triple_count
        account_count
        position_count
        signal_count
        contract_balance
      }
      recent_atoms: atoms_aggregate(
        where: {
          created_at: { _gte: "${new Date(Date.now() - 86400000).toISOString()}" }
        }
      ) {
        aggregate { count }
      }
      recent_signals: signals_aggregate(
        where: {
          block_timestamp: { _gte: "${new Date(Date.now() - 86400000).toISOString()}" }
        }
      ) {
        aggregate { count }
      }
    }
  `
  return client.request(query)
}
```

### Growth Metrics

```graphql
query GetGrowthMetrics {
  today_atoms: atoms_aggregate(
    where: {
      created_at: { _gte: "2024-01-15T00:00:00Z" }
    }
  ) {
    aggregate { count }
  }
  today_accounts: accounts_aggregate(
    where: {
      created_at: { _gte: "2024-01-15T00:00:00Z" }
    }
  ) {
    aggregate { count }
  }
  today_signals: signals_aggregate(
    where: {
      block_timestamp: { _gte: "2024-01-15T00:00:00Z" }
    }
  ) {
    aggregate { count }
  }
}
```

## Time-Series Statistics

For historical analytics, use the time-series tables:

- `signal_stats_daily` / `signal_stats_hourly` - Signal activity
- `share_price_change_stats_daily` - Price changes
- `term_total_state_change_stats_daily` - Term state changes

See [Time-Series Analysis](/docs/graphql-api/queries/advanced/time-series) for details.

## Best Practices

1. **Cache stats** with appropriate TTL (1-5 minutes)
2. **Use time-series tables** for historical data
3. **Combine aggregates** for comprehensive views
4. **Filter by date range** for period comparisons

## Related Queries

- [Time-Series](/docs/graphql-api/queries/advanced/time-series) - Historical statistics
- [Events](/docs/graphql-api/queries/advanced/events) - Raw event data
- [Fee Transfers](/docs/graphql-api/queries/advanced/fee-transfers) - Protocol revenue
