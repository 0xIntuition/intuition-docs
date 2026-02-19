---
title: Account PnL Realized
sidebar_label: Account PnL Realized
sidebar_position: 4
description: Query realized Profit and Loss breakdown by position
keywords: [graphql, pnl, profit, loss, realized, gains, positions]
---

import GraphQLPlaygroundCustom from '@site/src/components/GraphQLPlaygroundCustom';

# Account PnL Realized

Get a detailed breakdown of realized Profit and Loss (PnL) for an account, showing gains and losses from closed or partially closed positions.

## Query Structure

```graphql
query GetAccountPnlRealized(
  $address: String!
  $limit: Int
  $offset: Int
) {
  getAccountPnlRealized(
    address: $address
    limit: $limit
    offset: $offset
  ) {
    total_realized_pnl
    positions {
      term_id
      atom {
        label
        image
      }
      entry_cost
      exit_value
      realized_pnl
      pnl_percentage
      closed_at
    }
    pagination {
      total
      limit
      offset
      has_more
    }
  }
}
```

## Variables

| Variable | Type | Required | Description |
|----------|------|----------|-------------|
| `address` | `String` | Yes | Account address to query |
| `limit` | `Int` | No | Number of positions to return (default: 20) |
| `offset` | `Int` | No | Offset for pagination |

```json
{
  "address": "0xd8da6bf26964af9d7eed9e03e53415d37aa96045",
  "limit": 10,
  "offset": 0
}
```

## Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `total_realized_pnl` | `String` | Total realized PnL across all positions |
| `positions` | `[RealizedPosition]` | Array of positions with realized gains/losses |
| `positions.term_id` | `String` | Term ID of the position |
| `positions.atom` | `Atom` | Associated atom details |
| `positions.entry_cost` | `String` | Total cost to enter the position |
| `positions.exit_value` | `String` | Value received on exit |
| `positions.realized_pnl` | `String` | Realized PnL (exit - entry) |
| `positions.pnl_percentage` | `Float` | PnL as percentage of entry cost |
| `positions.closed_at` | `DateTime` | When the position was closed |
| `pagination` | `Pagination` | Pagination metadata |

## Expected Response

```json
{
  "data": {
    "getAccountPnlRealized": {
      "total_realized_pnl": "2.500000000000000000",
      "positions": [
        {
          "term_id": "0x57d94c116a33bb460428eced262b7ae2ec6f865e7aceef6357cec3d034e8ea21",
          "atom": {
            "label": "Ethereum",
            "image": "ipfs://QmXnnyufdzAWL5CqZ2RnSNgPbvCc1ALT73s6epPrRnZ1Xy"
          },
          "entry_cost": "1.000000000000000000",
          "exit_value": "1.750000000000000000",
          "realized_pnl": "0.750000000000000000",
          "pnl_percentage": 75.0,
          "closed_at": "2024-01-15T10:30:00Z"
        },
        {
          "term_id": "0x89abc...",
          "atom": {
            "label": "Bitcoin",
            "image": "ipfs://Qm..."
          },
          "entry_cost": "2.000000000000000000",
          "exit_value": "3.750000000000000000",
          "realized_pnl": "1.750000000000000000",
          "pnl_percentage": 87.5,
          "closed_at": "2024-01-14T15:45:00Z"
        }
      ],
      "pagination": {
        "total": 15,
        "limit": 10,
        "offset": 0,
        "has_more": true
      }
    }
  }
}
```

## Interactive Example

export const pnlRealizedQueries = [
  {
    id: 'realized-pnl',
    title: 'Realized PnL Breakdown',
    query: `query GetAccountPnlRealized($address: String!, $limit: Int) {
  getAccountPnlRealized(address: $address, limit: $limit) {
    total_realized_pnl
    positions {
      term_id
      atom {
        label
        image
      }
      entry_cost
      exit_value
      realized_pnl
      pnl_percentage
      closed_at
    }
    pagination {
      total
      has_more
    }
  }
}`,
    variables: {
      address: '0xd8da6bf26964af9d7eed9e03e53415d37aa96045',
      limit: 10
    }
  }
];

<GraphQLPlaygroundCustom queries={pnlRealizedQueries} />

## Use Cases

### Realized Gains Report

Generate a report of all realized gains and losses:

```typescript
import { GraphQLClient } from 'graphql-request'
import { API_URL_PROD } from '@0xintuition/graphql'

const client = new GraphQLClient(API_URL_PROD)

async function getRealizedGainsReport(address: string) {
  const query = `
    query GetAccountPnlRealized($address: String!) {
      getAccountPnlRealized(address: $address, limit: 100) {
        total_realized_pnl
        positions {
          atom { label }
          entry_cost
          exit_value
          realized_pnl
          pnl_percentage
          closed_at
        }
      }
    }
  `

  const data = await client.request(query, { address })
  const result = data.getAccountPnlRealized

  // Separate gains and losses
  const gains = result.positions.filter(p => parseFloat(p.realized_pnl) > 0)
  const losses = result.positions.filter(p => parseFloat(p.realized_pnl) < 0)

  return {
    totalRealized: result.total_realized_pnl,
    gains,
    losses,
    winRate: (gains.length / result.positions.length * 100).toFixed(1)
  }
}
```

### React Realized PnL Table

```tsx
function RealizedPnlTable({ address }: { address: string }) {
  const { data, loading, fetchMore } = useQuery(GET_ACCOUNT_PNL_REALIZED, {
    variables: { address, limit: 20 }
  })

  if (loading) return <Spinner />

  const { positions, pagination, total_realized_pnl } = data.getAccountPnlRealized

  return (
    <div>
      <h3>Total Realized: {total_realized_pnl} ETH</h3>
      <table>
        <thead>
          <tr>
            <th>Position</th>
            <th>Entry Cost</th>
            <th>Exit Value</th>
            <th>Realized PnL</th>
            <th>%</th>
          </tr>
        </thead>
        <tbody>
          {positions.map(pos => (
            <tr key={pos.term_id}>
              <td>{pos.atom.label}</td>
              <td>{pos.entry_cost} ETH</td>
              <td>{pos.exit_value} ETH</td>
              <td className={parseFloat(pos.realized_pnl) >= 0 ? 'profit' : 'loss'}>
                {pos.realized_pnl} ETH
              </td>
              <td>{pos.pnl_percentage}%</td>
            </tr>
          ))}
        </tbody>
      </table>
      {pagination.has_more && (
        <button onClick={() => fetchMore({ variables: { offset: positions.length }})}>
          Load More
        </button>
      )}
    </div>
  )
}
```

## Best Practices

1. **Use pagination** - Accounts with many closed positions should paginate results
2. **Sort appropriately** - Consider sorting by realized PnL or close date
3. **Handle both gains and losses** - Display with appropriate colors/styling
4. **Calculate aggregates** - Sum up gains vs losses for overall analysis

## Related

- [Account PnL Current](./account-pnl-current) - Current PnL including unrealized
- [Account PnL Chart](./account-pnl-chart) - Historical PnL trends
- [User Positions](/docs/graphql-api/queries/vaults/user-positions) - Active positions
