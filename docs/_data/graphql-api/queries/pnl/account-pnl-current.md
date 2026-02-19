---
title: Account PnL Current
sidebar_label: Account PnL Current
sidebar_position: 2
description: Query current Profit and Loss snapshot for an account
keywords: [graphql, pnl, profit, loss, account, current, snapshot]
---

import GraphQLPlaygroundCustom from '@site/src/components/GraphQLPlaygroundCustom';

# Account PnL Current

Get the current Profit and Loss (PnL) snapshot for an account, including equity value, net invested amount, and unrealized gains.

## Query Structure

```graphql
query GetAccountPnlCurrent($input: GetAccountPnlCurrentInput!) {
  getAccountPnlCurrent(input: $input) {
    account_id
    equity_value
    net_invested
    total_pnl
    unrealized_pnl
    pnl_pct
    total_assets_in
    total_assets_out
    timestamp
  }
}
```

## Variables

The query takes a single `input` object:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `account_id` | `String` | Yes | Account address to query |

```json
{
  "input": {
    "account_id": "0xd8da6bf26964af9d7eed9e03e53415d37aa96045"
  }
}
```

## Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `account_id` | `String` | The queried account address |
| `equity_value` | `String` | Current total equity value (`shares_total * share_price / 1e18`) |
| `net_invested` | `String` | Net amount invested (`total_assets_in - total_assets_out`) |
| `total_pnl` | `String` | Total profit/loss (`equity_value + total_assets_out - total_assets_in`) |
| `unrealized_pnl` | `String` | Unrealized profit/loss (`equity_value - net_invested`) |
| `pnl_pct` | `String` | PnL as a percentage of net invested |
| `total_assets_in` | `String` | Total assets deposited |
| `total_assets_out` | `String` | Total assets redeemed |
| `timestamp` | `DateTime` | Timestamp of the snapshot |

## Expected Response

```json
{
  "data": {
    "getAccountPnlCurrent": {
      "account_id": "0xd8da6bf26964af9d7eed9e03e53415d37aa96045",
      "equity_value": "15.234567890123456789",
      "net_invested": "10.000000000000000000",
      "total_pnl": "5.234567890123456789",
      "unrealized_pnl": "5.234567890123456789",
      "pnl_pct": "52.34",
      "total_assets_in": "12.000000000000000000",
      "total_assets_out": "2.000000000000000000",
      "timestamp": "2024-01-15T10:30:00Z"
    }
  }
}
```

## Interactive Example

export const pnlCurrentQueries = [
  {
    id: 'basic-pnl',
    title: 'Basic PnL Snapshot',
    query: `query GetAccountPnlCurrent($input: GetAccountPnlCurrentInput!) {
  getAccountPnlCurrent(input: $input) {
    account_id
    equity_value
    net_invested
    total_pnl
    unrealized_pnl
    pnl_pct
    total_assets_in
    total_assets_out
    timestamp
  }
}`,
    variables: {
      input: {
        account_id: '0xd8da6bf26964af9d7eed9e03e53415d37aa96045'
      }
    }
  }
];

<GraphQLPlaygroundCustom queries={pnlCurrentQueries} />

## Use Cases

### Portfolio Dashboard Widget

Display current portfolio performance:

```typescript
import { GraphQLClient } from 'graphql-request'
import { API_URL_PROD } from '@0xintuition/graphql'

const client = new GraphQLClient(API_URL_PROD)

async function getPortfolioPnl(accountId: string) {
  const query = `
    query GetAccountPnlCurrent($input: GetAccountPnlCurrentInput!) {
      getAccountPnlCurrent(input: $input) {
        equity_value
        net_invested
        total_pnl
        unrealized_pnl
        pnl_pct
      }
    }
  `

  const data = await client.request(query, {
    input: { account_id: accountId }
  })
  return data.getAccountPnlCurrent
}

// Usage
const pnl = await getPortfolioPnl('0x...')
console.log(`Equity Value: ${pnl.equity_value}`)
console.log(`Total PnL: ${pnl.total_pnl} (${pnl.pnl_pct}%)`)
```

## Related

- [Account PnL Chart](./account-pnl-chart) - Historical PnL data
- [Account PnL Realized](./account-pnl-realized) - Realized PnL data
- [User Positions](/docs/graphql-api/queries/vaults/user-positions) - Underlying position data
