---
title: Protocol Stats Queries
sidebar_label: Overview
sidebar_position: 1
description: Query protocol-wide statistics and fee transfers
keywords: [graphql, stats, statistics, protocol, fees, tvl]
---

# Protocol Stats Queries

Query protocol-wide statistics including total value locked (TVL), fee transfers, and aggregate metrics.

## Available Queries

| Query | Description |
|-------|-------------|
| [`stats`](./protocol-stats) | Protocol-wide statistics and metrics |
| [`fee_transfers`](./fee-transfers) | Protocol fee transfer events |

## Quick Start

```typescript
import { GraphQLClient } from 'graphql-request'
import { API_URL_PROD } from '@0xintuition/graphql'

const client = new GraphQLClient(API_URL_PROD)

const query = `
  query GetProtocolStats {
    stats {
      id
      total_atoms
      total_triples
      total_positions
      total_signals
      total_accounts
      total_fees
      contract_balance
    }
  }
`

const data = await client.request(query)
```

## Key Metrics

| Metric | Description |
|--------|-------------|
| `total_atoms` | Total atoms created |
| `total_triples` | Total triples created |
| `total_positions` | Total active positions |
| `total_signals` | Total deposit/redemption signals |
| `total_accounts` | Unique accounts interacted |
| `total_fees` | Protocol fees collected |
| `contract_balance` | Current contract balance |

## Related Documentation

- [Protocol Stats](./protocol-stats) - Detailed statistics
- [Fee Transfers](./fee-transfers) - Fee transfer history
