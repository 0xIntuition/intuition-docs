---
title: Subscriptions Overview
sidebar_label: Overview
sidebar_position: 1
description: Real-time subscriptions with cursor-based streaming
keywords: [graphql, subscription, real-time, websocket, stream]
---

# Subscriptions Overview

The GraphQL API supports real-time subscriptions for live data updates using cursor-based streaming.

## Basic Subscription Pattern

```graphql
subscription WatchAtoms(
  $cursor: [atoms_stream_cursor_input]!
  $batchSize: Int!
) {
  atoms_stream(
    cursor: $cursor
    batch_size: $batchSize
  ) {
    term_id
    label
    created_at
  }
}
```

## Variables

```json
{
  "cursor": [{
    "initial_value": { "created_at": "2024-01-01T00:00:00Z" },
    "ordering": "ASC"
  }],
  "batchSize": 10
}
```

## Cursor Configuration

- **initial_value**: Starting point for the stream
- **ordering**: Sort direction (ASC or DESC)
- **batch_size**: Number of items per batch

## When to Use Subscriptions

**Use subscriptions when:**
- Building real-time dashboards
- Monitoring live protocol activity
- Creating notification systems
- Data changes frequently

**Use polling when:**
- Data updates infrequently
- Real-time updates aren't critical
- Minimizing server connections

## Best Practices

1. **Store last cursor** to resume after disconnection
2. **Use batch_size** to control data flow (10-50)
3. **Filter subscriptions** with where clauses
4. **Handle reconnections** gracefully
