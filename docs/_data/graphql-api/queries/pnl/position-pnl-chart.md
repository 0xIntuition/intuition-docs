---
title: Position PnL Chart
sidebar_label: Position PnL Chart
sidebar_position: 5
description: Query historical Profit and Loss data for a specific position
keywords: [graphql, pnl, profit, loss, position, chart, history]
---

import GraphQLPlaygroundCustom from '@site/src/components/GraphQLPlaygroundCustom';

# Position PnL Chart

Get historical Profit and Loss (PnL) data for a specific position over time, enabling detailed position-level performance analysis.

## Query Structure

```graphql
query GetPositionPnlChart(
  $account_address: String!
  $term_id: String!
  $interval: ChartInterval
  $start_date: DateTime
  $end_date: DateTime
) {
  getPositionPnlChart(
    account_address: $account_address
    term_id: $term_id
    interval: $interval
    start_date: $start_date
    end_date: $end_date
  ) {
    position {
      term_id
      atom {
        label
        image
      }
      shares
      current_value
      cost_basis
    }
    data {
      timestamp
      value
      cost
      unrealized_pnl
      pnl_percentage
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
| `account_address` | `String` | Yes | Account address owning the position |
| `term_id` | `String` | Yes | Term ID of the position to query |
| `interval` | `ChartInterval` | No | Time interval: `HOUR`, `DAY`, `WEEK`, `MONTH` |
| `start_date` | `DateTime` | No | Start of date range |
| `end_date` | `DateTime` | No | End of date range |

```json
{
  "account_address": "0xd8da6bf26964af9d7eed9e03e53415d37aa96045",
  "term_id": "0x57d94c116a33bb460428eced262b7ae2ec6f865e7aceef6357cec3d034e8ea21",
  "interval": "DAY",
  "start_date": "2024-01-01T00:00:00Z"
}
```

## Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `position` | `Position` | Current position details |
| `position.term_id` | `String` | Term ID of the position |
| `position.atom` | `Atom` | Associated atom details |
| `position.shares` | `String` | Current share balance |
| `position.current_value` | `String` | Current position value in ETH |
| `position.cost_basis` | `String` | Total cost basis |
| `data` | `[PositionPnlDataPoint]` | Array of PnL data points |
| `data.timestamp` | `DateTime` | Timestamp for this data point |
| `data.value` | `String` | Position value at this time |
| `data.cost` | `String` | Cost basis at this time |
| `data.unrealized_pnl` | `String` | Unrealized PnL at this time |
| `data.pnl_percentage` | `Float` | PnL as percentage of cost |

## Expected Response

```json
{
  "data": {
    "getPositionPnlChart": {
      "position": {
        "term_id": "0x57d94c116a33bb460428eced262b7ae2ec6f865e7aceef6357cec3d034e8ea21",
        "atom": {
          "label": "Ethereum",
          "image": "ipfs://QmXnnyufdzAWL5CqZ2RnSNgPbvCc1ALT73s6epPrRnZ1Xy"
        },
        "shares": "1000000000000000000",
        "current_value": "1.500000000000000000",
        "cost_basis": "1.000000000000000000"
      },
      "data": [
        {
          "timestamp": "2024-01-01T00:00:00Z",
          "value": "1.000000000000000000",
          "cost": "1.000000000000000000",
          "unrealized_pnl": "0.000000000000000000",
          "pnl_percentage": 0.0
        },
        {
          "timestamp": "2024-01-02T00:00:00Z",
          "value": "1.200000000000000000",
          "cost": "1.000000000000000000",
          "unrealized_pnl": "0.200000000000000000",
          "pnl_percentage": 20.0
        },
        {
          "timestamp": "2024-01-03T00:00:00Z",
          "value": "1.500000000000000000",
          "cost": "1.000000000000000000",
          "unrealized_pnl": "0.500000000000000000",
          "pnl_percentage": 50.0
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

export const positionPnlQueries = [
  {
    id: 'position-pnl',
    title: 'Position PnL History',
    query: `query GetPositionPnlChart(
  $account_address: String!
  $term_id: String!
  $interval: ChartInterval
) {
  getPositionPnlChart(
    account_address: $account_address
    term_id: $term_id
    interval: $interval
  ) {
    position {
      atom { label image }
      shares
      current_value
      cost_basis
    }
    data {
      timestamp
      value
      unrealized_pnl
      pnl_percentage
    }
  }
}`,
    variables: {
      account_address: '0xd8da6bf26964af9d7eed9e03e53415d37aa96045',
      term_id: '0x57d94c116a33bb460428eced262b7ae2ec6f865e7aceef6357cec3d034e8ea21',
      interval: 'DAY'
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
  accountAddress: string,
  termId: string,
  days: number = 30
) {
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)

  const query = `
    query GetPositionPnlChart(
      $account_address: String!
      $term_id: String!
      $interval: ChartInterval
      $start_date: DateTime
    ) {
      getPositionPnlChart(
        account_address: $account_address
        term_id: $term_id
        interval: $interval
        start_date: $start_date
      ) {
        position {
          atom { label image }
          shares
          current_value
          cost_basis
        }
        data {
          timestamp
          value
          unrealized_pnl
          pnl_percentage
        }
      }
    }
  `

  const data = await client.request(query, {
    account_address: accountAddress,
    term_id: termId,
    interval: 'DAY',
    start_date: startDate.toISOString()
  })

  return data.getPositionPnlChart
}
```

### React Position Chart Component

```tsx
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

function PositionPnlChart({ accountAddress, termId }: Props) {
  const { data, loading } = useQuery(GET_POSITION_PNL_CHART, {
    variables: {
      account_address: accountAddress,
      term_id: termId,
      interval: 'DAY'
    }
  })

  if (loading) return <Spinner />

  const { position, data: chartData } = data.getPositionPnlChart

  const formattedData = chartData.map(point => ({
    date: new Date(point.timestamp).toLocaleDateString(),
    value: parseFloat(point.value),
    pnl: parseFloat(point.unrealized_pnl),
    pnlPercent: point.pnl_percentage
  }))

  const currentPnl = parseFloat(position.current_value) - parseFloat(position.cost_basis)
  const isPositive = currentPnl >= 0

  return (
    <div className="position-chart">
      <div className="header">
        <img src={position.atom.image} alt={position.atom.label} />
        <h2>{position.atom.label}</h2>
        <span className={isPositive ? 'profit' : 'loss'}>
          {isPositive ? '+' : ''}{currentPnl.toFixed(4)} ETH
        </span>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={formattedData}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip
            formatter={(value, name) => [
              `${value.toFixed(4)} ETH`,
              name === 'value' ? 'Value' : 'PnL'
            ]}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#8884d8"
            fill="#8884d8"
            fillOpacity={0.3}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
```

## Best Practices

1. **Match intervals to timeframe** - Use hourly for recent data, daily for longer periods
2. **Show position context** - Always display the atom label and current state
3. **Highlight entry point** - Mark when the position was opened on the chart
4. **Handle partial closes** - Account for positions that were partially closed

## Related

- [Account PnL Chart](./account-pnl-chart) - Portfolio-level PnL charts
- [Account PnL Realized](./account-pnl-realized) - Realized gains from closed positions
- [Vault Details](/docs/graphql-api/queries/vaults/vault-details) - Vault information for the position
