---
title: Search Positions
sidebar_label: Search Positions
sidebar_position: 4
description: Search positions on a specific subject
keywords: [graphql, search, positions, subject, stakes]
---

import GraphQLPlaygroundCustom from '@site/src/components/GraphQLPlaygroundCustom';

# Search Positions on Subject

Search for positions (stakes) related to a specific subject. This function takes an array of addresses and a JSONB search fields object to filter positions.

## Query Structure

```graphql
query SearchPositionsOnSubject(
  $addresses: _text!
  $searchFields: jsonb!
  $limit: Int
) {
  search_positions_on_subject(
    args: {
      addresses: $addresses
      search_fields: $searchFields
    }
    limit: $limit
    order_by: { shares: desc }
  ) {
    id
    account_id
    account {
      label
      image
    }
    shares
    created_at
    vault {
      term_id
      triple {
        predicate { label }
        object { label }
      }
    }
  }
}
```

## Variables

| Variable | Type | Required | Description |
|----------|------|----------|-------------|
| `addresses` | `_text` | Yes | PostgreSQL text array of account addresses to search |
| `search_fields` | `jsonb` | Yes | JSONB object specifying search criteria |
| `limit` | `Int` | No | Maximum results |

```json
{
  "addresses": "{0xd8da6bf26964af9d7eed9e03e53415d37aa96045}",
  "searchFields": {},
  "limit": 20
}
```

:::note
The `addresses` parameter uses PostgreSQL's `_text` array format: `{addr1,addr2}` (curly braces, comma-separated, no quotes within the braces).
:::

## Response Fields

The function returns position rows, so all position fields are available:

| Field | Type | Description |
|-------|------|-------------|
| `id` | `String` | Position identifier |
| `account_id` | `String` | Account holding position |
| `account` | `accounts` | Account details (relationship) |
| `shares` | `numeric` | Shares held |
| `created_at` | `timestamptz` | Position creation time |
| `vault` | `vaults` | Associated vault (relationship) |

## Use Cases

### Find Who Believes Something

See all positions from specific accounts:

```typescript
async function getPositionsForAccounts(addresses: string[]) {
  const query = `
    query GetPositions($addresses: _text!, $searchFields: jsonb!) {
      search_positions_on_subject(
        args: {
          addresses: $addresses
          search_fields: $searchFields
        }
        order_by: { shares: desc }
        limit: 50
      ) {
        account {
          id
          label
          image
        }
        vault {
          triple {
            predicate { label }
            object { label }
          }
        }
        shares
      }
    }
  `

  // Format as PostgreSQL text array
  const pgArray = `{${addresses.join(',')}}`

  const data = await client.request(query, {
    addresses: pgArray,
    searchFields: {}
  })

  return data.search_positions_on_subject
}
```

## Best Practices

1. **Order by shares** - Show most-supported positions first
2. **Group results** - Aggregate positions by claim
3. **Show supporter count** - Indicate social proof
4. **Link to profiles** - Make supporters clickable

## Related

- [Search Term](./search-term) - Search atoms by text
- [User Positions](/docs/graphql-api/queries/vaults/user-positions) - Account position queries
