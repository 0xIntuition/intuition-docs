---
title: Position PnL Chart
sidebar_label: Position PnL Chart
sidebar_position: 4
description: Track PnL for a specific position over time
keywords: [graphql, pnl, position, chart, history, tracking]
---

import GraphQLPlaygroundCustom from '@site/src/components/GraphQLPlaygroundCustom';

# Position PnL Chart

Track the profit and loss of a specific position over time. Useful for analyzing individual position performance.

## Query Structure

```graphql
query GetPositionPnlChart(
  $accountId: String!
  $vaultId: String!
  $startDate: String
  $endDate: String
  $interval: String
) {
  getPositionPnlChart(
    account_id: $accountId
    vault_id: $vaultId
    start_date: $startDate
    end_date: $endDate
    interval: $interval
  ) {
    account_id
    vault_id
    term_id
    data_points {
      timestamp
      shares
      value
      cost_basis
      unrealized_pnl
      unrealized_pnl_percentage
      share_price
    }
  }
}
```

## Variables

```json
{
  "accountId": "0xd8da6bf26964af9d7eed9e03e53415d37aa96045",
  "vaultId": "0x1234567890abcdef1234567890abcdef12345678",
  "startDate": "2024-01-01T00:00:00Z",
  "endDate": "2024-12-31T23:59:59Z",
  "interval": "day"
}
```

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `account_id` | String | Yes | The account address |
| `vault_id` | String | Yes | The vault/position identifier |
| `start_date` | String | No | Start of date range (ISO 8601) |
| `end_date` | String | No | End of date range (ISO 8601) |
| `interval` | String | No | Data point interval: `hour`, `day`, `week`, `month` |

## Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `account_id` | String | The account address |
| `vault_id` | String | The vault identifier |
| `term_id` | String | The associated term (atom/triple) |
| `data_points` | Array | Array of position snapshots |
| `data_points[].timestamp` | String | Timestamp of snapshot |
| `data_points[].shares` | String | Number of shares held |
| `data_points[].value` | String | Current value of position |
| `data_points[].cost_basis` | String | Cost basis of position |
| `data_points[].unrealized_pnl` | String | Unrealized PnL |
| `data_points[].unrealized_pnl_percentage` | Float | PnL percentage |
| `data_points[].share_price` | String | Share price at this point |

## Interactive Example

export const positionPnlQueries = [
  {
    id: 'position-pnl-chart',
    title: 'Position PnL Chart',
    query: `query GetPositionPnlChart(
  $accountId: String!
  $vaultId: String!
  $interval: String
) {
  getPositionPnlChart(
    account_id: $accountId
    vault_id: $vaultId
    interval: $interval
  ) {
    account_id
    vault_id
    term_id
    data_points {
      timestamp
      shares
      value
      unrealized_pnl
      unrealized_pnl_percentage
      share_price
    }
  }
}`,
    variables: {
      accountId: '0xd8da6bf26964af9d7eed9e03e53415d37aa96045',
      vaultId: '0x1234567890abcdef1234567890abcdef12345678',
      interval: 'day'
    }
  }
];

<GraphQLPlaygroundCustom queries={positionPnlQueries} />

## Use Cases

### Position Performance Analysis

Visualize how a specific position has performed:

```typescript
import { useQuery, gql } from '@apollo/client';
import { AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

const POSITION_PNL_CHART = gql`
  query GetPositionPnlChart(
    $accountId: String!
    $vaultId: String!
    $interval: String
  ) {
    getPositionPnlChart(
      account_id: $accountId
      vault_id: $vaultId
      interval: $interval
    ) {
      data_points {
        timestamp
        value
        unrealized_pnl
        unrealized_pnl_percentage
      }
    }
  }
`;

function PositionChart({ accountId, vaultId }) {
  const { data, loading } = useQuery(POSITION_PNL_CHART, {
    variables: { accountId, vaultId, interval: 'day' }
  });

  if (loading) return <div>Loading...</div>;

  const chartData = data?.getPositionPnlChart?.data_points?.map(point => ({
    date: new Date(point.timestamp).toLocaleDateString(),
    value: parseFloat(point.value) / 1e18,
    pnl: parseFloat(point.unrealized_pnl_percentage)
  }));

  return (
    <AreaChart width={600} height={300} data={chartData}>
      <XAxis dataKey="date" />
      <YAxis />
      <Tooltip />
      <Area
        type="monotone"
        dataKey="value"
        stroke="#8884d8"
        fill="#8884d8"
        fillOpacity={0.3}
      />
    </AreaChart>
  );
}
```

### Compare Position Entry vs Current

```typescript
function PositionSummary({ data }) {
  const points = data?.getPositionPnlChart?.data_points || [];
  const first = points[0];
  const last = points[points.length - 1];

  return (
    <div>
      <p>Entry Value: {formatEther(first?.value)} ETH</p>
      <p>Current Value: {formatEther(last?.value)} ETH</p>
      <p>Total Return: {last?.unrealized_pnl_percentage.toFixed(2)}%</p>
    </div>
  );
}
```

## Best Practices

1. **Track multiple positions** - Compare different positions by running parallel queries
2. **Correlate with events** - Overlay deposit/redemption events on the chart
3. **Monitor share price changes** - The `share_price` field shows the underlying vault performance
4. **Calculate ROI** - Use entry point vs current to calculate return on investment

## Related

- [Account PnL Current](./account-pnl-current) - Overall account PnL
- [Account PnL Chart](./account-pnl-chart) - Account-wide PnL over time
- [Account PnL Realized](./account-pnl-realized) - Closed position gains
- [User Positions](/docs/graphql-api/queries/vaults/user-positions) - Query user positions
