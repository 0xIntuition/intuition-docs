---
title: Real-Time Positions
sidebar_label: Position Updates
sidebar_position: 2
description: Subscribe to position changes in real-time
keywords: [graphql, subscription, position, real-time, stream]
---

# Real-Time Position Updates

Subscribe to position changes for live portfolio tracking.

## Subscription Structure

```graphql
subscription WatchPositions(
  $cursor: [positions_stream_cursor_input]!
  $accountId: String
  $batchSize: Int!
) {
  positions_stream(
    cursor: $cursor
    batch_size: $batchSize
    where: {
      account_id: { _eq: $accountId }
      shares: { _gt: "0" }
    }
  ) {
    id
    shares
    vault {
      term_id
      current_share_price
    }
  }
}
```

## Best Practices

1. **Filter by account** for user-specific updates
2. **Filter shares > 0** for active positions only
3. **Update UI state** with new data
4. **Resume from last cursor** after disconnection
