---
title: Account PnL Chart
sidebar_label: Account PnL Chart
sidebar_position: 3
description: Query historical Profit and Loss data for charting
keywords: [graphql, pnl, profit, loss, chart, history, time-series]
---

import GraphQLPlaygroundCustom from '@site/src/components/GraphQLPlaygroundCustom';

# Account PnL Chart

Get historical Profit and Loss (PnL) time-series data for an account, suitable for charting portfolio performance over configurable intervals.

## Query Structure

```graphql
query GetAccountPnlChart($input: GetAccountPnlChartInput!) {
  getAccountPnlChart(input: $input) {
    account_id
    count
    data
    interval
  }
}
```

## Variables

The query takes a single `input` object:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `account_id` | `String` | Yes | Account address to query |
| `interval` | `String` | Yes | Time interval for data points (e.g. `"1h"`, `"1d"`, `"1w"`, `"1M"`) |
| `start_time` | `String` | Yes | Start of the time range (ISO 8601 timestamp) |
| `end_time` | `String` | Yes | End of the time range (ISO 8601 timestamp) |

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

## Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `account_id` | `String` | The queried account address |
| `count` | `Int` | Number of data points returned |
| `data` | `JSON` | Array of PnL data points for the time range |
| `interval` | `String` | The interval used for aggregation |

## Expected Response

```json
{
  "data": {
    "getAccountPnlChart": {
      "account_id": "0xd8da6bf26964af9d7eed9e03e53415d37aa96045",
      "count": 31,
      "data": [
        {
          "timestamp": "2024-01-01T00:00:00Z",
          "equity_value": "10.000000000000000000",
          "net_invested": "10.000000000000000000",
          "total_pnl": "0.000000000000000000",
          "pnl_pct": 0.0
        },
        {
          "timestamp": "2024-01-02T00:00:00Z",
          "equity_value": "10.500000000000000000",
          "net_invested": "10.000000000000000000",
          "total_pnl": "0.500000000000000000",
          "pnl_pct": 5.0
        }
      ],
      "interval": "1d"
    }
  }
}
```

## Interactive Example

export const pnlChartQueries = [
  {
    id: 'daily-pnl',
    title: 'Daily PnL Chart',
    query: `query GetAccountPnlChart($input: GetAccountPnlChartInput!) {
  getAccountPnlChart(input: $input) {
    account_id
    count
    data
    interval
  }
}`,
    variables: {
      input: {
        account_id: '0xd8da6bf26964af9d7eed9e03e53415d37aa96045',
        interval: '1d',
        start_time: '2024-01-01T00:00:00Z',
        end_time: '2024-01-31T23:59:59Z'
      }
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

async function getPnlChartData(accountId: string, days: number = 30) {
  const endTime = new Date()
  const startTime = new Date()
  startTime.setDate(startTime.getDate() - days)

  const query = `
    query GetAccountPnlChart($input: GetAccountPnlChartInput!) {
      getAccountPnlChart(input: $input) {
        account_id
        count
        data
        interval
      }
    }
  `

  const data = await client.request(query, {
    input: {
      account_id: accountId,
      interval: '1d',
      start_time: startTime.toISOString(),
      end_time: endTime.toISOString()
    }
  })

  return data.getAccountPnlChart
}
```

## Best Practices

1. **Choose appropriate intervals** - Use `"1h"` for recent data, `"1d"` for weekly/monthly views, `"1w"` or `"1M"` for longer periods
2. **Limit date ranges** - Request only the data needed; smaller ranges return faster
3. **Handle empty data** - Display an appropriate message when `count` is 0

## Related

- [Account PnL Current](./account-pnl-current) - Current PnL snapshot
- [Position PnL Chart](./position-pnl-chart) - Position-level charts
- [Account PnL Realized](./account-pnl-realized) - Realized PnL data
