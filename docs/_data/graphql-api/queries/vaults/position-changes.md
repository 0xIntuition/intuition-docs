---
title: Position Changes
sidebar_label: Position Changes
sidebar_position: 7
description: Track position change history with daily and hourly aggregates
keywords: [graphql, position, changes, history, daily, hourly, time-series]
---

import GraphQLPlaygroundCustom from '@site/src/components/GraphQLPlaygroundCustom';

# Position Changes

Track individual position changes and view pre-aggregated daily/hourly summaries. Position changes record every deposit and redemption event that modifies a position.

## Individual Changes

### Query Structure

```graphql
query GetPositionChanges(
  $accountId: String!
  $termId: String!
  $limit: Int!
) {
  position_changes(
    where: {
      account_id: { _eq: $accountId }
      term_id: { _eq: $termId }
    }
    order_by: { created_at: desc }
    limit: $limit
  ) {
    id
    account_id
    term_id
    curve_id
    event_type
    assets_in
    assets_out
    shares_delta
    block_number
    created_at
    transaction_hash
  }
}
```

### Response Fields (`position_changes`)

| Field | Type | Nullable | Description |
|-------|------|----------|-------------|
| `id` | `bigint` | No | Change record ID |
| `account_id` | `String` | No | Account that made the change |
| `term_id` | `String` | No | Term ID |
| `curve_id` | `numeric` | No | Bonding curve ID |
| `event_id` | `String` | No | Associated event ID |
| `event_type` | `String` | No | Type of event (deposit/redemption) |
| `assets_in` | `numeric` | No | Assets deposited |
| `assets_out` | `numeric` | No | Assets redeemed |
| `shares_delta` | `numeric` | No | Change in shares (positive for deposits, negative for redemptions) |
| `block_number` | `numeric` | No | Block number |
| `log_index` | `bigint` | No | Log index within block |
| `created_at` | `timestamptz` | No | Event timestamp |
| `transaction_hash` | `String` | No | Transaction hash |

#### Relationships

| Field | Type | Description |
|-------|------|-------------|
| `account` | `accounts` | Account that made the change |
| `term` | `terms` | Associated term |
| `vault` | `vaults` | Associated vault |

## Daily Aggregates

Pre-computed daily summaries of position changes, bucketed by day.

```graphql
query GetDailyPositionChanges(
  $accountId: String!
  $termId: String!
  $limit: Int!
) {
  position_change_daily(
    where: {
      account_id: { _eq: $accountId }
      term_id: { _eq: $termId }
    }
    order_by: { bucket: desc }
    limit: $limit
  ) {
    bucket
    account_id
    term_id
    curve_id
    assets_in_period
    assets_out_period
    shares_delta_period
    transaction_count
  }
}
```

### Response Fields (`position_change_daily`)

| Field | Type | Description |
|-------|------|-------------|
| `bucket` | `timestamptz` | Day bucket timestamp |
| `account_id` | `String` | Account ID |
| `term_id` | `String` | Term ID |
| `curve_id` | `numeric` | Bonding curve ID |
| `assets_in_period` | `numeric` | Total assets deposited in this day |
| `assets_out_period` | `numeric` | Total assets redeemed in this day |
| `shares_delta_period` | `numeric` | Net share change for the day |
| `transaction_count` | `numeric` | Number of transactions in this day |

## Hourly Aggregates

Same structure as daily, bucketed by hour.

```graphql
query GetHourlyPositionChanges(
  $accountId: String!
  $termId: String!
  $limit: Int!
) {
  position_change_hourly(
    where: {
      account_id: { _eq: $accountId }
      term_id: { _eq: $termId }
    }
    order_by: { bucket: desc }
    limit: $limit
  ) {
    bucket
    account_id
    term_id
    curve_id
    assets_in_period
    assets_out_period
    shares_delta_period
    transaction_count
  }
}
```

The hourly view has the same fields as daily. The `transaction_count` type is `bigint` (vs `numeric` for daily).

## Interactive Example

export const positionChangeQueries = [
  {
    id: 'position-changes',
    title: 'Recent Position Changes',
    query: `query GetPositionChanges($accountId: String!, $limit: Int!) {
  position_changes(
    where: { account_id: { _eq: $accountId } }
    order_by: { created_at: desc }
    limit: $limit
  ) {
    id
    term_id
    event_type
    assets_in
    assets_out
    shares_delta
    created_at
    transaction_hash
  }
}`,
    variables: {
      accountId: '0xd8da6bf26964af9d7eed9e03e53415d37aa96045',
      limit: 20
    }
  },
  {
    id: 'daily-summary',
    title: 'Daily Position Summary',
    query: `query GetDailyChanges($accountId: String!, $limit: Int!) {
  position_change_daily(
    where: { account_id: { _eq: $accountId } }
    order_by: { bucket: desc }
    limit: $limit
  ) {
    bucket
    term_id
    assets_in_period
    assets_out_period
    shares_delta_period
    transaction_count
  }
}`,
    variables: {
      accountId: '0xd8da6bf26964af9d7eed9e03e53415d37aa96045',
      limit: 30
    }
  }
];

<GraphQLPlaygroundCustom queries={positionChangeQueries} />

## Use Cases

### Activity Timeline

```typescript
async function getPositionActivity(accountId: string, termId: string) {
  const query = `
    query GetActivity($accountId: String!, $termId: String!) {
      position_changes(
        where: {
          account_id: { _eq: $accountId }
          term_id: { _eq: $termId }
        }
        order_by: { created_at: desc }
        limit: 50
      ) {
        event_type
        assets_in
        assets_out
        shares_delta
        created_at
        transaction_hash
      }
      position_changes_aggregate(
        where: {
          account_id: { _eq: $accountId }
          term_id: { _eq: $termId }
        }
      ) {
        aggregate {
          count
          sum {
            assets_in
            assets_out
          }
        }
      }
    }
  `

  return client.request(query, { accountId, termId })
}
```

## Related

- [Positions with Value](./positions-with-value) - Enriched position data
- [User Positions](./user-positions) - Basic position queries
- [Deposits & Redemptions](./deposits-redemptions) - Transaction history
