---
title: Account PnL Realized
sidebar_label: Account PnL Realized
sidebar_position: 4
description: Query realized Profit and Loss data for an account
keywords: [graphql, pnl, profit, loss, realized, gains]
---

import GraphQLPlaygroundCustom from '@site/src/components/GraphQLPlaygroundCustom';

# Account PnL Realized

Get realized Profit and Loss (PnL) data for an account over a specified time range.

## Query Structure

```graphql
query GetAccountPnlRealized($input: GetAccountPnlRealizedInput!) {
  getAccountPnlRealized(input: $input) {
    account_id
    count
    data
  }
}
```

## Variables

The query takes a single `input` object:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `account_id` | `String` | Yes | Account address to query |
| `start_time` | `String` | Yes | Start of the time range (ISO 8601 timestamp) |
| `end_time` | `String` | Yes | End of the time range (ISO 8601 timestamp) |

```json
{
  "input": {
    "account_id": "0xd8da6bf26964af9d7eed9e03e53415d37aa96045",
    "start_time": "2024-01-01T00:00:00Z",
    "end_time": "2024-01-31T23:59:59Z"
  }
}
```

## Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `account_id` | `String` | The queried account address |
| `count` | `Int` | Number of data points returned |
| `data` | `JSON` | Realized PnL data for the time range |

## Expected Response

```json
{
  "data": {
    "getAccountPnlRealized": {
      "account_id": "0xd8da6bf26964af9d7eed9e03e53415d37aa96045",
      "count": 5,
      "data": [
        {
          "timestamp": "2024-01-05T12:00:00Z",
          "realized_pnl": "0.750000000000000000"
        },
        {
          "timestamp": "2024-01-15T08:30:00Z",
          "realized_pnl": "1.250000000000000000"
        }
      ]
    }
  }
}
```

## Interactive Example

export const pnlRealizedQueries = [
  {
    id: 'realized-pnl',
    title: 'Realized PnL Data',
    query: `query GetAccountPnlRealized($input: GetAccountPnlRealizedInput!) {
  getAccountPnlRealized(input: $input) {
    account_id
    count
    data
  }
}`,
    variables: {
      input: {
        account_id: '0xd8da6bf26964af9d7eed9e03e53415d37aa96045',
        start_time: '2024-01-01T00:00:00Z',
        end_time: '2024-01-31T23:59:59Z'
      }
    }
  }
];

<GraphQLPlaygroundCustom queries={pnlRealizedQueries} />

## Use Cases

### Realized Gains Report

Generate a report of realized gains over a period:

```typescript
import { GraphQLClient } from 'graphql-request'
import { API_URL_PROD } from '@0xintuition/graphql'

const client = new GraphQLClient(API_URL_PROD)

async function getRealizedPnl(accountId: string, days: number = 30) {
  const endTime = new Date()
  const startTime = new Date()
  startTime.setDate(startTime.getDate() - days)

  const query = `
    query GetAccountPnlRealized($input: GetAccountPnlRealizedInput!) {
      getAccountPnlRealized(input: $input) {
        account_id
        count
        data
      }
    }
  `

  const data = await client.request(query, {
    input: {
      account_id: accountId,
      start_time: startTime.toISOString(),
      end_time: endTime.toISOString()
    }
  })

  return data.getAccountPnlRealized
}
```

## Best Practices

1. **Use appropriate time ranges** - Narrow ranges return faster and produce more focused results
2. **Combine with current PnL** - Use alongside `getAccountPnlCurrent` for a complete picture of realized + unrealized gains

## Related

- [Account PnL Current](./account-pnl-current) - Current PnL including unrealized
- [Account PnL Chart](./account-pnl-chart) - Historical PnL trends
- [User Positions](/docs/graphql-api/queries/vaults/user-positions) - Active positions
