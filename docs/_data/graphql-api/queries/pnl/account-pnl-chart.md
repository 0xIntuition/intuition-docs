---
title: Account PnL Chart
sidebar_label: Account PnL Chart
sidebar_position: 3
description: Query historical Profit and Loss data for charting
keywords: [graphql, pnl, profit, loss, chart, history, time-series]
---

import GraphQLPlaygroundCustom from '@site/src/components/GraphQLPlaygroundCustom';

# Account PnL Chart

Get historical Profit and Loss (PnL) data for an account over time, suitable for charting portfolio performance.

## Query Structure

```graphql
query GetAccountPnlChart(
  $address: String!
  $interval: ChartInterval
  $start_date: DateTime
  $end_date: DateTime
) {
  getAccountPnlChart(
    address: $address
    interval: $interval
    start_date: $start_date
    end_date: $end_date
  ) {
    data {
      timestamp
      total_value
      total_cost
      unrealized_pnl
      realized_pnl
      total_pnl
    }
    interval
    start_date
    end_date
  }
}
```

## Variables

| Variable | Type | Required | Description |
|----------|------|----------|-------------|
| `address` | `String` | Yes | Account address to query |
| `interval` | `ChartInterval` | No | Time interval: `HOUR`, `DAY`, `WEEK`, `MONTH` (default: `DAY`) |
| `start_date` | `DateTime` | No | Start of date range |
| `end_date` | `DateTime` | No | End of date range |

```json
{
  "address": "0xd8da6bf26964af9d7eed9e03e53415d37aa96045",
  "interval": "DAY",
  "start_date": "2024-01-01T00:00:00Z",
  "end_date": "2024-01-31T23:59:59Z"
}
```

## Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `data` | `[PnlDataPoint]` | Array of PnL data points |
| `data.timestamp` | `DateTime` | Timestamp for this data point |
| `data.total_value` | `String` | Total portfolio value at this time |
| `data.total_cost` | `String` | Total cost basis at this time |
| `data.unrealized_pnl` | `String` | Unrealized PnL at this time |
| `data.realized_pnl` | `String` | Cumulative realized PnL |
| `data.total_pnl` | `String` | Total PnL at this time |
| `interval` | `ChartInterval` | The interval used |
| `start_date` | `DateTime` | Actual start date of data |
| `end_date` | `DateTime` | Actual end date of data |

## Expected Response

```json
{
  "data": {
    "getAccountPnlChart": {
      "data": [
        {
          "timestamp": "2024-01-01T00:00:00Z",
          "total_value": "10.000000000000000000",
          "total_cost": "10.000000000000000000",
          "unrealized_pnl": "0.000000000000000000",
          "realized_pnl": "0.000000000000000000",
          "total_pnl": "0.000000000000000000"
        },
        {
          "timestamp": "2024-01-02T00:00:00Z",
          "total_value": "10.500000000000000000",
          "total_cost": "10.000000000000000000",
          "unrealized_pnl": "0.500000000000000000",
          "realized_pnl": "0.000000000000000000",
          "total_pnl": "0.500000000000000000"
        },
        {
          "timestamp": "2024-01-03T00:00:00Z",
          "total_value": "11.200000000000000000",
          "total_cost": "10.000000000000000000",
          "unrealized_pnl": "1.200000000000000000",
          "realized_pnl": "0.000000000000000000",
          "total_pnl": "1.200000000000000000"
        }
      ],
      "interval": "DAY",
      "start_date": "2024-01-01T00:00:00Z",
      "end_date": "2024-01-03T00:00:00Z"
    }
  }
}
```

## Interactive Example

export const pnlChartQueries = [
  {
    id: 'daily-pnl',
    title: 'Daily PnL Chart',
    query: `query GetAccountPnlChart($address: String!, $interval: ChartInterval) {
  getAccountPnlChart(address: $address, interval: $interval) {
    data {
      timestamp
      total_value
      total_pnl
    }
    interval
  }
}`,
    variables: {
      address: '0xd8da6bf26964af9d7eed9e03e53415d37aa96045',
      interval: 'DAY'
    }
  },
  {
    id: 'weekly-pnl',
    title: 'Weekly PnL Chart',
    query: `query GetAccountPnlChart($address: String!, $interval: ChartInterval, $start_date: DateTime) {
  getAccountPnlChart(address: $address, interval: $interval, start_date: $start_date) {
    data {
      timestamp
      total_value
      total_cost
      unrealized_pnl
      realized_pnl
      total_pnl
    }
    interval
    start_date
    end_date
  }
}`,
    variables: {
      address: '0xd8da6bf26964af9d7eed9e03e53415d37aa96045',
      interval: 'WEEK',
      start_date: '2024-01-01T00:00:00Z'
    }
  }
];

<GraphQLPlaygroundCustom queries={pnlChartQueries} />

## Use Cases

### Portfolio Performance Chart

Build a line chart showing portfolio value over time:

```typescript
import { GraphQLClient } from 'graphql-request'
import { API_URL_PROD } from '@0xintuition/graphql'

const client = new GraphQLClient(API_URL_PROD)

async function getPnlChartData(address: string, days: number = 30) {
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)

  const query = `
    query GetAccountPnlChart(
      $address: String!
      $interval: ChartInterval
      $start_date: DateTime
    ) {
      getAccountPnlChart(
        address: $address
        interval: $interval
        start_date: $start_date
      ) {
        data {
          timestamp
          total_value
          total_pnl
        }
      }
    }
  `

  const data = await client.request(query, {
    address,
    interval: 'DAY',
    start_date: startDate.toISOString()
  })

  return data.getAccountPnlChart.data
}
```

### React Chart Component

```tsx
import { LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts'

function PnlChart({ address }: { address: string }) {
  const { data, loading } = useQuery(GET_ACCOUNT_PNL_CHART, {
    variables: {
      address,
      interval: 'DAY',
      start_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
    }
  })

  if (loading) return <Spinner />

  const chartData = data?.getAccountPnlChart.data.map(point => ({
    date: new Date(point.timestamp).toLocaleDateString(),
    value: parseFloat(point.total_value),
    pnl: parseFloat(point.total_pnl)
  }))

  return (
    <LineChart width={600} height={300} data={chartData}>
      <XAxis dataKey="date" />
      <YAxis />
      <Tooltip />
      <Line type="monotone" dataKey="value" stroke="#8884d8" name="Value" />
      <Line type="monotone" dataKey="pnl" stroke="#82ca9d" name="PnL" />
    </LineChart>
  )
}
```

## Chart Intervals

| Interval | Description | Best For |
|----------|-------------|----------|
| `HOUR` | Hourly data points | Intraday analysis |
| `DAY` | Daily data points | Weekly/monthly views |
| `WEEK` | Weekly data points | Quarterly analysis |
| `MONTH` | Monthly data points | Yearly performance |

## Best Practices

1. **Choose appropriate intervals** - Use hourly for recent data, daily/weekly for longer periods
2. **Limit date ranges** - Request only the data needed for your chart
3. **Handle empty data** - Display appropriate message when no data available
4. **Cache chart data** - PnL chart data changes infrequently; cache appropriately

## Related

- [Account PnL Current](./account-pnl-current) - Current PnL snapshot
- [Position PnL Chart](./position-pnl-chart) - Position-level charts
- [Time Series Queries](/docs/graphql-api/queries/advanced/time-series) - General time-series patterns
