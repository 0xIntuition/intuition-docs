---
title: Account PnL Current
sidebar_label: Current PnL
sidebar_position: 1
description: Get current PnL snapshot for an account
keywords: [graphql, pnl, profit, loss, account, portfolio]
---

import GraphQLPlaygroundCustom from '@site/src/components/GraphQLPlaygroundCustom';

# Account PnL Current

Get a current snapshot of an account's profit and loss across all positions.

## Query Structure

```graphql
query GetAccountPnlCurrent($accountId: String!) {
  getAccountPnlCurrent(account_id: $accountId) {
    account_id
    total_value
    total_cost
    unrealized_pnl
    unrealized_pnl_percentage
    realized_pnl
    total_pnl
    total_pnl_percentage
    position_count
    timestamp
  }
}
```

## Variables

```json
{
  "accountId": "0xd8da6bf26964af9d7eed9e03e53415d37aa96045"
}
```

## Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `account_id` | String | The account address |
| `total_value` | String | Current total value of all positions (in wei) |
| `total_cost` | String | Total cost basis of all positions (in wei) |
| `unrealized_pnl` | String | Unrealized profit/loss (current value - cost) |
| `unrealized_pnl_percentage` | Float | Unrealized PnL as a percentage |
| `realized_pnl` | String | Realized profit/loss from closed positions |
| `total_pnl` | String | Total PnL (unrealized + realized) |
| `total_pnl_percentage` | Float | Total PnL as a percentage |
| `position_count` | Int | Number of active positions |
| `timestamp` | String | Timestamp of the snapshot |

## Interactive Example

export const pnlCurrentQueries = [
  {
    id: 'account-pnl-current',
    title: 'Account PnL Current',
    query: `query GetAccountPnlCurrent($accountId: String!) {
  getAccountPnlCurrent(account_id: $accountId) {
    account_id
    total_value
    total_cost
    unrealized_pnl
    unrealized_pnl_percentage
    realized_pnl
    total_pnl
    total_pnl_percentage
    position_count
    timestamp
  }
}`,
    variables: {
      accountId: '0xd8da6bf26964af9d7eed9e03e53415d37aa96045'
    }
  }
];

<GraphQLPlaygroundCustom queries={pnlCurrentQueries} />

## Use Cases

### Portfolio Dashboard

Display a user's overall portfolio performance:

```typescript
import { useQuery, gql } from '@apollo/client';

const ACCOUNT_PNL_CURRENT = gql`
  query GetAccountPnlCurrent($accountId: String!) {
    getAccountPnlCurrent(account_id: $accountId) {
      total_value
      total_pnl
      total_pnl_percentage
      unrealized_pnl
      realized_pnl
    }
  }
`;

function PortfolioPnL({ accountId }) {
  const { data, loading } = useQuery(ACCOUNT_PNL_CURRENT, {
    variables: { accountId }
  });

  if (loading) return <div>Loading...</div>;

  const pnl = data?.getAccountPnlCurrent;
  const isProfit = parseFloat(pnl?.total_pnl || '0') >= 0;

  return (
    <div className={isProfit ? 'text-green-500' : 'text-red-500'}>
      <p>Total Value: {formatEther(pnl.total_value)} ETH</p>
      <p>PnL: {pnl.total_pnl_percentage.toFixed(2)}%</p>
    </div>
  );
}
```

## Best Practices

1. **Cache appropriately** - PnL data changes with market conditions; consider polling or subscriptions for real-time updates
2. **Format values** - Values are returned in wei; convert to ETH or USD for display
3. **Handle negative values** - Display losses clearly with appropriate styling
4. **Show percentages** - Percentage changes are often more meaningful than absolute values

## Related

- [Account PnL Chart](./account-pnl-chart) - PnL over time
- [Account PnL Realized](./account-pnl-realized) - Breakdown of realized gains/losses
- [Position PnL Chart](./position-pnl-chart) - Individual position tracking
