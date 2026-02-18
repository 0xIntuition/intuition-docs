---
title: Aggregate Events
sidebar_label: Aggregate
sidebar_position: 3
description: Aggregate statistics for blockchain events
keywords: [graphql, events, aggregate, statistics, count]
---

# Aggregate Events

Query aggregate statistics for blockchain events.

## Query Structure

```graphql
query GetEventsAggregate($where: events_bool_exp) {
  events_aggregate(where: $where) {
    aggregate {
      count
      max {
        block_number
        block_timestamp
      }
      min {
        block_number
        block_timestamp
      }
    }
  }
}
```

## Variables

```json
{
  "where": {
    "type": { "_eq": "AtomCreated" },
    "block_timestamp": { "_gte": "2024-01-01T00:00:00Z" }
  }
}
```

## Use Cases

### Protocol Statistics

```typescript
async function getProtocolEventStats() {
  const query = `
    query GetEventStats {
      atoms: events_aggregate(where: { type: { _eq: "AtomCreated" } }) {
        aggregate { count }
      }
      triples: events_aggregate(where: { type: { _eq: "TripleCreated" } }) {
        aggregate { count }
      }
      deposits: events_aggregate(where: { type: { _eq: "Deposited" } }) {
        aggregate { count }
      }
      redemptions: events_aggregate(where: { type: { _eq: "Redeemed" } }) {
        aggregate { count }
      }
    }
  `

  const data = await client.request(query)

  return {
    totalAtoms: data.atoms.aggregate.count,
    totalTriples: data.triples.aggregate.count,
    totalDeposits: data.deposits.aggregate.count,
    totalRedemptions: data.redemptions.aggregate.count
  }
}
```

### Daily Event Counts

```typescript
async function getDailyEventCounts(date: Date) {
  const startOfDay = new Date(date)
  startOfDay.setHours(0, 0, 0, 0)

  const endOfDay = new Date(date)
  endOfDay.setHours(23, 59, 59, 999)

  const query = `
    query GetDailyEvents($start: timestamptz!, $end: timestamptz!) {
      events_aggregate(where: {
        block_timestamp: { _gte: $start, _lte: $end }
      }) {
        aggregate {
          count
        }
      }
    }
  `

  return client.request(query, {
    start: startOfDay.toISOString(),
    end: endOfDay.toISOString()
  })
}
```

## Related

- [List Events](./list-events) - Individual events
- [Protocol Stats](/docs/graphql-api/queries/stats/protocol-stats) - Higher-level statistics
