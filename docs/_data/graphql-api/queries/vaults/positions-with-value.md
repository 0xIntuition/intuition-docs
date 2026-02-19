---
title: Positions with Value
sidebar_label: Positions with Value
sidebar_position: 6
description: Query positions enriched with computed PnL and value data
keywords: [graphql, position, value, pnl, redeemable, shares]
---

import GraphQLPlaygroundCustom from '@site/src/components/GraphQLPlaygroundCustom';

# Positions with Value

Query positions enriched with computed value fields including PnL, redeemable assets, and theoretical value. This is a view that extends the base `positions` table with real-time calculations.

## Query Structure

```graphql
query GetPositionsWithValue($accountId: String!, $limit: Int!) {
  positions_with_value(
    where: { account_id: { _eq: $accountId } }
    order_by: { redeemable_assets: desc }
    limit: $limit
  ) {
    id
    account_id
    term_id
    curve_id
    shares
    redeemable_assets
    theoretical_value
    pnl
    pnl_pct
    total_deposit_assets_after_total_fees
    total_redeem_assets_for_receiver
    created_at
    updated_at
  }
}
```

## Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | `String` | Position identifier |
| `account_id` | `String` | Account holding the position |
| `term_id` | `String` | Term ID for the vault |
| `curve_id` | `numeric` | Bonding curve ID |
| `shares` | `numeric` | Number of shares held |
| `redeemable_assets` | `numeric` | Current redeemable value in assets |
| `theoretical_value` | `numeric` | Theoretical position value |
| `pnl` | `numeric` | Profit and loss (assets) |
| `pnl_pct` | `numeric` | PnL as percentage |
| `total_deposit_assets_after_total_fees` | `numeric` | Total deposited (after fees) |
| `total_redeem_assets_for_receiver` | `numeric` | Total redeemed |
| `block_number` | `bigint` | Block number of last update |
| `log_index` | `bigint` | Log index |
| `transaction_hash` | `String` | Last transaction hash |
| `created_at` | `timestamptz` | Position creation time |
| `updated_at` | `timestamptz` | Last update time |

### Relationships

| Field | Type | Description |
|-------|------|-------------|
| `account` | `accounts` | Account that holds this position |
| `term` | `terms` | Associated term entity |
| `vault` | `vaults` | Associated vault |

## Interactive Example

export const positionsValueQueries = [
  {
    id: 'positions-with-value',
    title: 'Positions with Value',
    query: `query GetPositionsWithValue($accountId: String!, $limit: Int!) {
  positions_with_value(
    where: { account_id: { _eq: $accountId } }
    order_by: { redeemable_assets: desc }
    limit: $limit
  ) {
    id
    term_id
    curve_id
    shares
    redeemable_assets
    pnl
    pnl_pct
    account {
      label
    }
  }
}`,
    variables: {
      accountId: '0xd8da6bf26964af9d7eed9e03e53415d37aa96045',
      limit: 10
    }
  }
];

<GraphQLPlaygroundCustom queries={positionsValueQueries} />

## Use Cases

### Portfolio Dashboard

```typescript
import { GraphQLClient } from 'graphql-request'
import { API_URL_PROD } from '@0xintuition/graphql'

const client = new GraphQLClient(API_URL_PROD)

async function getPortfolio(accountId: string) {
  const query = `
    query GetPortfolio($accountId: String!) {
      positions_with_value(
        where: {
          account_id: { _eq: $accountId }
          shares: { _gt: "0" }
        }
        order_by: { redeemable_assets: desc }
      ) {
        term_id
        curve_id
        shares
        redeemable_assets
        pnl
        pnl_pct
        vault {
          current_share_price
          market_cap
        }
      }
      positions_with_value_aggregate(
        where: {
          account_id: { _eq: $accountId }
          shares: { _gt: "0" }
        }
      ) {
        aggregate {
          count
          sum {
            redeemable_assets
            pnl
          }
        }
      }
    }
  `

  return client.request(query, { accountId })
}
```

## Compared to `positions`

| Feature | `positions` | `positions_with_value` |
|---------|-------------|------------------------|
| Base fields | id, shares, account_id, term_id, curve_id | Same |
| PnL fields | No | `pnl`, `pnl_pct` |
| Value fields | No | `redeemable_assets`, `theoretical_value` |
| Deposit/redeem totals | No | `total_deposit_assets_after_total_fees`, `total_redeem_assets_for_receiver` |

## Related

- [User Positions](./user-positions) - Basic position queries
- [Position Changes](./position-changes) - Position change history
- [PnL Queries](/docs/graphql-api/queries/pnl/overview) - Account-level PnL
