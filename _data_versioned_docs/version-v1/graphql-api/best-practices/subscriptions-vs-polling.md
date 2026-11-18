---
title: Subscriptions vs Polling
sidebar_label: Subscriptions vs Polling
sidebar_position: 9
description: When to use subscriptions vs polling
keywords: [graphql, subscription, polling, real-time, performance]
---

# Subscriptions vs Polling

Choose the right approach for your data update needs.

## Use Subscriptions When

- Building real-time dashboards
- Monitoring live protocol activity
- Data changes frequently (multiple times per minute)
- User expects immediate updates
- Creating notification systems

**Example:**
```graphql
subscription WatchMyPositions($cursor: [positions_stream_cursor_input]!) {
  positions_stream(cursor: $cursor, batch_size: 10) {
    id
    shares
    vault { current_share_price }
  }
}
```

## Use Polling When

- Data updates infrequently (e.g., daily statistics)
- Real-time updates aren't critical for UX
- Minimizing server connections is important
- Building static reports or analytics

**Example:**
```graphql
query GetStats {
  stats {
    total_accounts
    total_atoms
    total_triples
  }
}
# Poll every 30 seconds or on user action
```

## Guidelines

- **Polling interval**: 30-60 seconds for most use cases
- **Subscription batch_size**: 10-50 items
- **Handle reconnections**: Store last cursor for resumability
