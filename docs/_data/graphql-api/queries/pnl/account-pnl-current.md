---
title: Account PnL Current
sidebar_label: Account PnL Current
sidebar_position: 2
description: Query current Profit and Loss snapshot for an account
keywords: [graphql, pnl, profit, loss, account, current, snapshot]
---

import GraphQLPlaygroundCustom from '@site/src/components/GraphQLPlaygroundCustom';

# Account PnL Current

Get the current Profit and Loss (PnL) snapshot for an account, including total value, cost basis, and unrealized/realized gains.

## Query Structure

```graphql
query GetAccountPnlCurrent($address: String!) {
  getAccountPnlCurrent(address: $address) {
    total_value
    total_cost
    unrealized_pnl
    realized_pnl
    total_pnl
    pnl_percentage
    last_updated
  }
}
```

## Variables

```json
{
  "address": "0xd8da6bf26964af9d7eed9e03e53415d37aa96045"
}
```

## Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `total_value` | `String` | Current total value of all positions in ETH |
| `total_cost` | `String` | Total cost basis of all positions in ETH |
| `unrealized_pnl` | `String` | Unrealized profit/loss (current value - cost basis) |
| `realized_pnl` | `String` | Realized profit/loss from closed positions |
| `total_pnl` | `String` | Total PnL (unrealized + realized) |
| `pnl_percentage` | `Float` | Total PnL as a percentage of cost basis |
| `last_updated` | `DateTime` | Timestamp of last calculation |

## Expected Response

```json
{
  "data": {
    "getAccountPnlCurrent": {
      "total_value": "15.234567890123456789",
      "total_cost": "10.000000000000000000",
      "unrealized_pnl": "4.234567890123456789",
      "realized_pnl": "1.000000000000000000",
      "total_pnl": "5.234567890123456789",
      "pnl_percentage": 52.34,
      "last_updated": "2024-01-15T10:30:00Z"
    }
  }
}
```

## Interactive Example

export const pnlCurrentQueries = [
  {
    id: 'basic-pnl',
    title: 'Basic PnL Snapshot',
    query: `query GetAccountPnlCurrent($address: String!) {
  getAccountPnlCurrent(address: $address) {
    total_value
    total_cost
    unrealized_pnl
    realized_pnl
    total_pnl
    pnl_percentage
  }
}`,
    variables: {
      address: '0xd8da6bf26964af9d7eed9e03e53415d37aa96045'
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

async function getPortfolioPnl(address: string) {
  const query = `
    query GetAccountPnlCurrent($address: String!) {
      getAccountPnlCurrent(address: $address) {
        total_value
        total_cost
        total_pnl
        pnl_percentage
      }
    }
  `

  const data = await client.request(query, { address })
  return data.getAccountPnlCurrent
}

// Usage
const pnl = await getPortfolioPnl('0x...')
console.log(`Portfolio Value: ${pnl.total_value} ETH`)
console.log(`Total PnL: ${pnl.total_pnl} ETH (${pnl.pnl_percentage}%)`)
```

### React Component

```tsx
function PortfolioPnL({ address }: { address: string }) {
  const { data, loading } = useQuery(GET_ACCOUNT_PNL_CURRENT, {
    variables: { address }
  })

  if (loading) return <Spinner />

  const pnl = data?.getAccountPnlCurrent
  const isPositive = parseFloat(pnl?.total_pnl || '0') >= 0

  return (
    <div className="pnl-widget">
      <h3>Portfolio Performance</h3>
      <div className="value">{pnl?.total_value} ETH</div>
      <div className={isPositive ? 'profit' : 'loss'}>
        {isPositive ? '+' : ''}{pnl?.total_pnl} ETH ({pnl?.pnl_percentage}%)
      </div>
    </div>
  )
}
```

## Best Practices

1. **Cache results** - PnL calculations can be expensive; cache with appropriate TTL
2. **Format values** - Use proper decimal formatting for ETH values
3. **Handle negative values** - Display losses with appropriate styling
4. **Show timestamps** - Display when PnL was last calculated

## Related

- [Account PnL Chart](./account-pnl-chart) - Historical PnL data
- [Account PnL Realized](./account-pnl-realized) - Realized gains breakdown
- [User Positions](/docs/graphql-api/queries/vaults/user-positions) - Underlying position data
