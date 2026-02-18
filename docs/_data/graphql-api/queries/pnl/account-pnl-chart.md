---
title: Account PnL Chart
sidebar_label: PnL Chart
sidebar_position: 2
description: Get account PnL data over time for charting
keywords: [graphql, pnl, chart, history, account, portfolio, time-series]
---

import GraphQLPlaygroundCustom from '@site/src/components/GraphQLPlaygroundCustom';

# Account PnL Chart

Retrieve historical PnL data for an account over a specified time period, useful for rendering charts and analyzing performance trends.

## Query Structure

```graphql
query GetAccountPnlChart(
  $accountId: String!
  $startDate: String
  $endDate: String
  $interval: String
) {
  getAccountPnlChart(
    account_id: $accountId
    start_date: $startDate
    end_date: $endDate
    interval: $interval
  ) {
    account_id
    data_points {
      timestamp
      total_value
      total_cost
      unrealized_pnl
      unrealized_pnl_percentage
      realized_pnl
      total_pnl
      total_pnl_percentage
    }
  }
}
```

## Variables

```json
{
  "accountId": "0xd8da6bf26964af9d7eed9e03e53415d37aa96045",
  "startDate": "2024-01-01T00:00:00Z",
  "endDate": "2024-12-31T23:59:59Z",
  "interval": "day"
}
```

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `account_id` | String | Yes | The account address |
| `start_date` | String | No | Start of date range (ISO 8601) |
| `end_date` | String | No | End of date range (ISO 8601) |
| `interval` | String | No | Data point interval: `hour`, `day`, `week`, `month` |

## Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `account_id` | String | The account address |
| `data_points` | Array | Array of PnL snapshots over time |
| `data_points[].timestamp` | String | Timestamp for the data point |
| `data_points[].total_value` | String | Total value at this point |
| `data_points[].total_cost` | String | Cost basis at this point |
| `data_points[].unrealized_pnl` | String | Unrealized PnL |
| `data_points[].total_pnl` | String | Total PnL |
| `data_points[].total_pnl_percentage` | Float | PnL percentage |

## Interactive Example

export const pnlChartQueries = [
  {
    id: 'account-pnl-chart',
    title: 'Account PnL Chart',
    query: `query GetAccountPnlChart(
  $accountId: String!
  $startDate: String
  $endDate: String
  $interval: String
) {
  getAccountPnlChart(
    account_id: $accountId
    start_date: $startDate
    end_date: $endDate
    interval: $interval
  ) {
    account_id
    data_points {
      timestamp
      total_value
      unrealized_pnl
      total_pnl
      total_pnl_percentage
    }
  }
}`,
    variables: {
      accountId: '0xd8da6bf26964af9d7eed9e03e53415d37aa96045',
      interval: 'day'
    }
  }
];

<GraphQLPlaygroundCustom queries={pnlChartQueries} />

## Use Cases

### Performance Chart

Render a PnL chart using a charting library:

```typescript
import { useQuery, gql } from '@apollo/client';
import { LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';

const ACCOUNT_PNL_CHART = gql`
  query GetAccountPnlChart(
    $accountId: String!
    $interval: String
  ) {
    getAccountPnlChart(
      account_id: $accountId
      interval: $interval
    ) {
      data_points {
        timestamp
        total_pnl
        total_pnl_percentage
      }
    }
  }
`;

function PnLChart({ accountId }) {
  const { data, loading } = useQuery(ACCOUNT_PNL_CHART, {
    variables: { accountId, interval: 'day' }
  });

  if (loading) return <div>Loading...</div>;

  const chartData = data?.getAccountPnlChart?.data_points?.map(point => ({
    date: new Date(point.timestamp).toLocaleDateString(),
    pnl: parseFloat(point.total_pnl_percentage)
  }));

  return (
    <LineChart width={600} height={300} data={chartData}>
      <XAxis dataKey="date" />
      <YAxis />
      <Tooltip />
      <Line type="monotone" dataKey="pnl" stroke="#8884d8" />
    </LineChart>
  );
}
```

## Best Practices

1. **Choose appropriate intervals** - Use `hour` for recent data, `day` or `week` for longer periods
2. **Limit date ranges** - Request only the data needed to avoid large payloads
3. **Cache chart data** - Historical data doesn't change; cache aggressively
4. **Handle sparse data** - Some intervals may have no activity

## Related

- [Account PnL Current](./account-pnl-current) - Current snapshot
- [Account PnL Realized](./account-pnl-realized) - Realized gains breakdown
- [Position PnL Chart](./position-pnl-chart) - Per-position tracking
