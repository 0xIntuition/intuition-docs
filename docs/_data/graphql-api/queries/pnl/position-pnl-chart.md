---
title: Position PnL Chart
sidebar_label: Position PnL Chart
sidebar_position: 5
description: Query historical Profit and Loss data for a specific position
keywords: [graphql, pnl, profit, loss, position, chart, history]
---

import GraphQLPlaygroundCustom from '@site/src/components/GraphQLPlaygroundCustom';

# Position PnL Chart

Get historical Profit and Loss (PnL) time-series data for a specific position, identified by account, term, and curve.

## Query Structure

```graphql
query GetPositionPnlChart($input: GetPositionPnlChartInput!) {
  getPositionPnlChart(input: $input) {
    account_id
    term_id
    curve_id
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
| `account_id` | `String` | Yes | Account address owning the position |
| `term_id` | `String` | Yes | Term ID identifying the position's atom or triple |
| `curve_id` | `String` | Yes | Curve ID identifying the bonding curve |
| `interval` | `String` | Yes | Time interval for data points (e.g. `"1h"`, `"1d"`, `"1w"`, `"1M"`) |
| `start_time` | `String` | Yes | Start of the time range (ISO 8601 timestamp) |
| `end_time` | `String` | Yes | End of the time range (ISO 8601 timestamp) |

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

## Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `account_id` | `String` | The queried account address |
| `term_id` | `String` | The term ID for this position |
| `curve_id` | `String` | The curve ID for this position |
| `count` | `Int` | Number of data points returned |
| `data` | `JSON` | Array of PnL data points for the time range |
| `interval` | `String` | The interval used for aggregation |

## Expected Response

```json
{
  "data": {
    "getPositionPnlChart": {
      "account_id": "0xd8da6bf26964af9d7eed9e03e53415d37aa96045",
      "term_id": "0x57d94c116a33bb460428eced262b7ae2ec6f865e7aceef6357cec3d034e8ea21",
      "curve_id": "1",
      "count": 31,
      "data": [
        {
          "timestamp": "2024-01-01T00:00:00Z",
          "equity_value": "1.000000000000000000",
          "net_invested": "1.000000000000000000",
          "total_pnl": "0.000000000000000000",
          "pnl_pct": 0.0
        },
        {
          "timestamp": "2024-01-02T00:00:00Z",
          "equity_value": "1.200000000000000000",
          "net_invested": "1.000000000000000000",
          "total_pnl": "0.200000000000000000",
          "pnl_pct": 20.0
        }
      ],
      "interval": "1d"
    }
  }
}
```

## Interactive Example

export const positionPnlQueries = [
  {
    id: 'position-pnl',
    title: 'Position PnL History',
    query: `query GetPositionPnlChart($input: GetPositionPnlChartInput!) {
  getPositionPnlChart(input: $input) {
    account_id
    term_id
    curve_id
    count
    data
    interval
  }
}`,
    variables: {
      input: {
        account_id: '0xd8da6bf26964af9d7eed9e03e53415d37aa96045',
        term_id: '0x57d94c116a33bb460428eced262b7ae2ec6f865e7aceef6357cec3d034e8ea21',
        curve_id: '1',
        interval: '1d',
        start_time: '2024-01-01T00:00:00Z',
        end_time: '2024-01-31T23:59:59Z'
      }
    }
  }
];

<GraphQLPlaygroundCustom queries={positionPnlQueries} />

## Use Cases

### Position Detail Page

Show detailed performance for a single position:

```typescript
import { GraphQLClient } from 'graphql-request'
import { API_URL_PROD } from '@0xintuition/graphql'

const client = new GraphQLClient(API_URL_PROD)

async function getPositionPerformance(
  accountId: string,
  termId: string,
  curveId: string,
  days: number = 30
) {
  const endTime = new Date()
  const startTime = new Date()
  startTime.setDate(startTime.getDate() - days)

  const query = `
    query GetPositionPnlChart($input: GetPositionPnlChartInput!) {
      getPositionPnlChart(input: $input) {
        account_id
        term_id
        curve_id
        count
        data
        interval
      }
    }
  `

  const data = await client.request(query, {
    input: {
      account_id: accountId,
      term_id: termId,
      curve_id: curveId,
      interval: '1d',
      start_time: startTime.toISOString(),
      end_time: endTime.toISOString()
    }
  })

  return data.getPositionPnlChart
}
```

## Best Practices

1. **Include `curve_id`** - This is a required field that identifies which bonding curve the position belongs to
2. **Match intervals to timeframe** - Use `"1h"` for recent data, `"1d"` for longer periods
3. **Combine with account PnL** - Use alongside `getAccountPnlChart` for portfolio-level context

## Related

- [Account PnL Chart](./account-pnl-chart) - Portfolio-level PnL charts
- [Account PnL Realized](./account-pnl-realized) - Realized PnL data
- [Vault Details](/docs/graphql-api/queries/vaults/vault-details) - Vault information for the position
