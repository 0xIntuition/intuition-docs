---
title: Account PnL Realized
sidebar_label: Realized PnL
sidebar_position: 3
description: Get realized PnL breakdown by position
keywords: [graphql, pnl, realized, profit, loss, positions, gains]
---

import GraphQLPlaygroundCustom from '@site/src/components/GraphQLPlaygroundCustom';

# Account PnL Realized

Get a detailed breakdown of realized profit and loss for an account, showing gains and losses from closed or partially closed positions.

## Query Structure

```graphql
query GetAccountPnlRealized($accountId: String!) {
  getAccountPnlRealized(account_id: $accountId) {
    account_id
    total_realized_pnl
    positions {
      vault_id
      term_id
      realized_pnl
      realized_pnl_percentage
      entry_price
      exit_price
      shares_sold
      proceeds
      cost_basis
      closed_at
      term {
        atom {
          label
          image
        }
        triple {
          subject { label }
          predicate { label }
          object { label }
        }
      }
    }
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
| `total_realized_pnl` | String | Total realized PnL across all positions |
| `positions` | Array | Array of positions with realized gains/losses |
| `positions[].vault_id` | String | Vault identifier |
| `positions[].term_id` | String | Term (atom/triple) identifier |
| `positions[].realized_pnl` | String | Realized PnL for this position |
| `positions[].realized_pnl_percentage` | Float | Realized PnL as percentage |
| `positions[].entry_price` | String | Average entry price |
| `positions[].exit_price` | String | Average exit price |
| `positions[].shares_sold` | String | Number of shares sold |
| `positions[].proceeds` | String | Total proceeds from sales |
| `positions[].cost_basis` | String | Cost basis of shares sold |
| `positions[].closed_at` | String | Timestamp of last sale |

## Interactive Example

export const pnlRealizedQueries = [
  {
    id: 'account-pnl-realized',
    title: 'Account PnL Realized',
    query: `query GetAccountPnlRealized($accountId: String!) {
  getAccountPnlRealized(account_id: $accountId) {
    account_id
    total_realized_pnl
    positions {
      vault_id
      realized_pnl
      realized_pnl_percentage
      entry_price
      exit_price
      shares_sold
      closed_at
    }
  }
}`,
    variables: {
      accountId: '0xd8da6bf26964af9d7eed9e03e53415d37aa96045'
    }
  }
];

<GraphQLPlaygroundCustom queries={pnlRealizedQueries} />

## Use Cases

### Realized Gains Report

Display a table of realized gains and losses:

```typescript
import { useQuery, gql } from '@apollo/client';
import { formatEther } from 'viem';

const ACCOUNT_PNL_REALIZED = gql`
  query GetAccountPnlRealized($accountId: String!) {
    getAccountPnlRealized(account_id: $accountId) {
      total_realized_pnl
      positions {
        vault_id
        realized_pnl
        realized_pnl_percentage
        entry_price
        exit_price
        closed_at
        term {
          atom { label }
          triple {
            subject { label }
            predicate { label }
            object { label }
          }
        }
      }
    }
  }
`;

function RealizedGainsTable({ accountId }) {
  const { data, loading } = useQuery(ACCOUNT_PNL_REALIZED, {
    variables: { accountId }
  });

  if (loading) return <div>Loading...</div>;

  const { total_realized_pnl, positions } = data?.getAccountPnlRealized || {};

  return (
    <div>
      <h2>Total Realized: {formatEther(total_realized_pnl || '0')} ETH</h2>
      <table>
        <thead>
          <tr>
            <th>Position</th>
            <th>Entry</th>
            <th>Exit</th>
            <th>PnL</th>
            <th>%</th>
          </tr>
        </thead>
        <tbody>
          {positions?.map((pos) => (
            <tr key={pos.vault_id}>
              <td>{pos.term?.atom?.label || 'Triple'}</td>
              <td>{formatEther(pos.entry_price)}</td>
              <td>{formatEther(pos.exit_price)}</td>
              <td>{formatEther(pos.realized_pnl)}</td>
              <td>{pos.realized_pnl_percentage.toFixed(2)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

## Best Practices

1. **Sort by date** - Show most recent closures first for relevance
2. **Aggregate for tax reporting** - Useful for calculating capital gains
3. **Include context** - Show the atom/triple label for each position
4. **Format currency values** - Convert wei to human-readable ETH or USD

## Related

- [Account PnL Current](./account-pnl-current) - Current overall PnL
- [Account PnL Chart](./account-pnl-chart) - PnL history over time
- [Position PnL Chart](./position-pnl-chart) - Track individual positions
