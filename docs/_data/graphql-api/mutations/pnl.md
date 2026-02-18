---
title: PnL Mutations
sidebar_label: PnL (Profit & Loss)
sidebar_position: 5
description: Query profit and loss data for accounts and positions
keywords: [graphql, mutation, pnl, profit, loss, portfolio, analytics]
---

# PnL (Profit & Loss) Mutations

Query profit and loss data for accounts and individual positions. These mutations connect to the Chart API service to calculate PnL metrics.

## getAccountPnlCurrent

Get the current PnL snapshot for an account.

```graphql
mutation GetAccountPnlCurrent($input: GetAccountPnlCurrentInput!) {
  getAccountPnlCurrent(input: $input) {
    account_id
    total_value
    total_cost
    unrealized_pnl
    unrealized_pnl_percentage
    realized_pnl
    total_pnl
    total_pnl_percentage
    updated_at
  }
}
```

### Variables

```json
{
  "input": {
    "account_id": "0xd8da6bf26964af9d7eed9e03e53415d37aa96045"
  }
}
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `total_value` | String | Current total portfolio value |
| `total_cost` | String | Total cost basis |
| `unrealized_pnl` | String | Unrealized profit/loss |
| `unrealized_pnl_percentage` | String | Unrealized PnL as percentage |
| `realized_pnl` | String | Realized profit/loss |
| `total_pnl` | String | Total PnL (realized + unrealized) |
| `total_pnl_percentage` | String | Total PnL as percentage |

## getAccountPnlChart

Get PnL chart data for an account over time.

```graphql
mutation GetAccountPnlChart($input: GetAccountPnlChartInput!) {
  getAccountPnlChart(input: $input) {
    data
  }
}
```

### Variables

```json
{
  "input": {
    "account_id": "0xd8da6bf26964af9d7eed9e03e53415d37aa96045",
    "interval": "1d",
    "start_time": "2024-01-01T00:00:00Z",
    "end_time": "2024-01-31T23:59:59Z"
  }
}
```

## getAccountPnlRealized

Get realized PnL breakdown for an account.

```graphql
mutation GetAccountPnlRealized($input: GetAccountPnlRealizedInput!) {
  getAccountPnlRealized(input: $input) {
    account_id
    realized_pnl
    realized_pnl_by_term {
      term_id
      realized_pnl
      atom {
        label
        image
      }
      triple {
        subject { label }
        predicate { label }
        object { label }
      }
    }
  }
}
```

### Variables

```json
{
  "input": {
    "account_id": "0xd8da6bf26964af9d7eed9e03e53415d37aa96045",
    "start_time": "2024-01-01T00:00:00Z",
    "end_time": "2024-01-31T23:59:59Z"
  }
}
```

## getPositionPnlChart

Get PnL chart data for a specific position.

```graphql
mutation GetPositionPnlChart($input: GetPositionPnlChartInput!) {
  getPositionPnlChart(input: $input) {
    data
  }
}
```

### Variables

```json
{
  "input": {
    "account_id": "0xd8da6bf26964af9d7eed9e03e53415d37aa96045",
    "term_id": "0x57d94c116a33bb460428eced262b7ae2ec6f865e7aceef6357cec3d034e8ea21",
    "curve_id": "1",
    "interval": "1d",
    "start_time": "2024-01-01T00:00:00Z",
    "end_time": "2024-01-31T23:59:59Z"
  }
}
```

## Use Cases

### Portfolio Dashboard

```typescript
import {
  useGetAccountPnlCurrentMutation
} from '@0xintuition/graphql'

function PortfolioDashboard({ accountId }: Props) {
  const [getPnl, { data, loading }] = useGetAccountPnlCurrentMutation()

  useEffect(() => {
    getPnl({
      variables: {
        input: { account_id: accountId }
      }
    })
  }, [accountId])

  if (loading) return <div>Loading...</div>

  const pnl = data?.getAccountPnlCurrent

  return (
    <div className="portfolio-stats">
      <div className="stat">
        <label>Total Value</label>
        <value>{formatCurrency(pnl?.total_value)}</value>
      </div>
      <div className={`stat ${Number(pnl?.total_pnl) >= 0 ? 'positive' : 'negative'}`}>
        <label>Total PnL</label>
        <value>
          {formatCurrency(pnl?.total_pnl)}
          ({pnl?.total_pnl_percentage}%)
        </value>
      </div>
      <div className="stat">
        <label>Unrealized</label>
        <value>{formatCurrency(pnl?.unrealized_pnl)}</value>
      </div>
      <div className="stat">
        <label>Realized</label>
        <value>{formatCurrency(pnl?.realized_pnl)}</value>
      </div>
    </div>
  )
}
```

### PnL History Chart

```typescript
async function getPnlHistory(accountId: string, days: number) {
  const mutation = `
    mutation GetAccountPnlChart($input: GetAccountPnlChartInput!) {
      getAccountPnlChart(input: $input) {
        data
      }
    }
  `

  const result = await client.request(mutation, {
    input: {
      account_id: accountId,
      interval: '1d',
      start_time: new Date(Date.now() - days * 86400000).toISOString(),
      end_time: new Date().toISOString()
    }
  })

  // Parse chart data for visualization
  const chartData = JSON.parse(result.getAccountPnlChart.data)
  return chartData.map(point => ({
    date: point.timestamp,
    value: Number(point.total_value),
    pnl: Number(point.pnl),
    pnlPercentage: Number(point.pnl_percentage)
  }))
}
```

### Position-Level Analysis

```typescript
async function analyzePosition(
  accountId: string,
  termId: string,
  curveId: string
) {
  const mutation = `
    mutation GetPositionPnlChart($input: GetPositionPnlChartInput!) {
      getPositionPnlChart(input: $input) {
        data
      }
    }
  `

  const result = await client.request(mutation, {
    input: {
      account_id: accountId,
      term_id: termId,
      curve_id: curveId,
      interval: '1d',
      start_time: new Date(Date.now() - 30 * 86400000).toISOString(),
      end_time: new Date().toISOString()
    }
  })

  return JSON.parse(result.getPositionPnlChart.data)
}
```

## Best Practices

1. **Cache current PnL** with short TTL (1-5 minutes)
2. **Use appropriate intervals** based on date range
3. **Handle loading states** for chart mutations
4. **Format currency values** consistently

## Related Mutations

- [Chart Mutations](/docs/graphql-api/mutations/charts) - Share price charts
- [User Positions Query](/docs/graphql-api/queries/vaults/user-positions) - Position data
