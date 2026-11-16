---
title: Atom with Vault
sidebar_label: Atom with Vault
sidebar_position: 1
description: Fetch atom details with vault statistics
keywords: [graphql, example, atom, vault, market cap]
---

import GraphQLPlaygroundCustom from '@site/src/components/GraphQLPlaygroundCustom';

# Example: Atom with Vault

Fetch atom metadata along with vault statistics.

## Use Case

Display atom information with market data on a detail page.

## Query

export const atomVaultQueries = [
  {
    id: 'atom-with-vault',
    title: 'Atom with Vault Info',
    query: `query GetAtomWithVault($atomId: String!, $curveId: numeric!) {
  atom(term_id: $atomId) {
    term_id
    label
    image
    type
    created_at
    creator {
      id
      label
    }
    term {
      vaults(where: { curve_id: { _eq: $curveId } }) {
        curve_id
        total_shares
        total_assets
        current_share_price
        market_cap
        position_count
      }
    }
  }
}`,
    variables: {
      atomId: '0x906527aae4af914b1ac01ff9adfdda5dafde3b5e21f84045e0660b0a15c07769',
      curveId: '1'
    }
  }
];

<GraphQLPlaygroundCustom queries={atomVaultQueries} />

## Implementation

```typescript
import { GraphQLClient } from 'graphql-request'
import { API_URL_PROD } from '@0xintuition/graphql'

const client = new GraphQLClient(API_URL_PROD)

const query = `
  query GetAtomWithVault($atomId: String!, $curveId: numeric!) {
    atom(term_id: $atomId) {
      term_id
      label
      image
      term {
        vaults(where: { curve_id: { _eq: $curveId } }) {
          total_shares
          market_cap
          position_count
        }
      }
    }
  }
`

const data = await client.request(query, {
  atomId: '0x...',
  curveId: '1'
})
```
