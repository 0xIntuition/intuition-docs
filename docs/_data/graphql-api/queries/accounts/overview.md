---
title: Account Queries
sidebar_label: Overview
sidebar_position: 1
description: Query account data, social relationships, and positions
keywords: [graphql, accounts, following, positions, social]
---

# Account Queries

Query account information including profile data, social relationships (following), and positions from followed accounts.

## Available Queries

| Query | Description |
|-------|-------------|
| [`account`](./single-account) | Query a single account by address |
| [`accounts`](./list-accounts) | Query multiple accounts with filtering |
| [`following`](./following) | Query following relationships |
| [`positions_from_following`](./positions-from-following) | Query positions from followed accounts |

## What Are Accounts?

Accounts represent Ethereum addresses that have interacted with the Intuition protocol. Each account includes:

- **Identity**: Address, ENS name, and profile metadata
- **Labels**: Human-readable names from atoms
- **Images**: Profile pictures from atoms
- **Social Graph**: Following relationships via triples
- **Positions**: Stakes on atoms and triples

## Quick Start

```typescript
import { GraphQLClient } from 'graphql-request'
import { API_URL_PROD } from '@0xintuition/graphql'

const client = new GraphQLClient(API_URL_PROD)

// Get account details
const query = `
  query GetAccount($id: String!) {
    account(id: $id) {
      id
      label
      image
      type
      atom_id
      created_at
    }
  }
`

const data = await client.request(query, {
  id: '0xd8da6bf26964af9d7eed9e03e53415d37aa96045'
})
```

## Account Types

| Type | Description |
|------|-------------|
| `Default` | Standard account with no linked atom |
| `AtomWallet` | Account with a linked atom identity |
| `ProtocolVault` | Protocol-controlled vault account |

## Related Documentation

- [Single Account](./single-account) - Query individual accounts
- [List Accounts](./list-accounts) - Query multiple accounts
- [Following](./following) - Social relationships
- [Positions from Following](./positions-from-following) - Social position data
