---
title: Atom with Vault Details
sidebar_label: With Vault
sidebar_position: 3
description: Query atoms with nested vault information and statistics
keywords: [graphql, atom, vault, shares, market cap, positions]
---

import GraphQLPlaygroundCustom from '@site/src/components/GraphQLPlaygroundCustom';

# Atom with Vault Details

Fetch atom data along with associated vault statistics, including total shares, current share price, market cap, and position count.

## Query Structure

```graphql
query GetAtomWithVault($atomId: String!, $curveId: numeric!) {
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
}
```

## Variables

```json
{
  "atomId": "0x57d94c116a33bb460428eced262b7ae2ec6f865e7aceef6357cec3d034e8ea21",
  "curveId": "1"
}
```

## Interactive Examples

export const vaultQueries = [
  {
    id: 'basic-vault',
    title: 'Atom with Basic Vault Info',
    query: `query GetAtomWithVault($atomId: String!, $curveId: numeric!) {
  atom(term_id: $atomId) {
    term_id
    label
    image
    term {
      vaults(where: { curve_id: { _eq: $curveId } }) {
        total_shares
        current_share_price
        market_cap
        position_count
      }
    }
  }
}`,
    variables: {
      atomId: '0x57d94c116a33bb460428eced262b7ae2ec6f865e7aceef6357cec3d034e8ea21',
      curveId: '1'
    }
  },
  {
    id: 'vault-with-positions',
    title: 'Vault with Top Positions',
    query: `query GetAtomWithTopPositions($atomId: String!, $curveId: numeric!) {
  atom(term_id: $atomId) {
    term_id
    label
    term {
      vaults(where: { curve_id: { _eq: $curveId } }) {
        total_shares
        current_share_price
        position_count
        positions(limit: 5, order_by: { shares: desc }) {
          account {
            label
            image
          }
          shares
        }
      }
    }
  }
}`,
    variables: {
      atomId: '0x57d94c116a33bb460428eced262b7ae2ec6f865e7aceef6357cec3d034e8ea21',
      curveId: '1'
    }
  }
];

<GraphQLPlaygroundCustom queries={vaultQueries} />

## Use Cases

### Display Market Data

Show atom with market statistics:

```typescript
const query = `
  query GetAtomMarketData($atomId: String!, $curveId: numeric!) {
    atom(term_id: $atomId) {
      term_id
      label
      image
      term {
        vaults(where: { curve_id: { _eq: $curveId } }) {
          total_shares
          current_share_price
          market_cap
          position_count
        }
      }
    }
  }
`
```

### Top Holders View

Fetch atom with top position holders:

```typescript
const query = `
  query GetAtomWithHolders($atomId: String!, $curveId: numeric!) {
    atom(term_id: $atomId) {
      term_id
      label
      term {
        vaults(where: { curve_id: { _eq: $curveId } }) {
          total_shares
          positions(limit: 10, order_by: { shares: desc }) {
            account {
              id
              label
              image
            }
            shares
          }
        }
      }
    }
  }
`
```

### Vault Statistics

Get comprehensive vault metrics:

```typescript
const query = `
  query GetVaultStats($atomId: String!, $curveId: numeric!) {
    atom(term_id: $atomId) {
      term_id
      label
      term {
        vaults(where: { curve_id: { _eq: $curveId } }) {
          total_shares
          total_assets
          current_share_price
          market_cap
          position_count
          positions_aggregate {
            aggregate {
              count
              sum { shares }
              avg { shares }
            }
          }
        }
      }
    }
  }
`
```

## Performance Considerations

- **Filter by curve_id**: Always specify curve ID to get specific vault
- **Limit positions**: Use limit when fetching nested positions
- **Use aggregates**: Prefer aggregates over fetching all positions for counts

## Related Patterns

- [Single Atom](/docs/guides/developer-tools/graphql-api/queries/atoms/single-atom) - Basic atom query
- [Vault Details](/docs/guides/developer-tools/graphql-api/queries/vaults/vault-details) - Detailed vault queries
- [User Positions](/docs/guides/developer-tools/graphql-api/queries/vaults/user-positions) - Query user positions

## Best Practices

1. **Always filter by curve_id** to get the correct vault
2. **Limit nested positions** to avoid over-fetching
3. **Use variables** for dynamic values
4. **Cache market data** as it updates frequently
