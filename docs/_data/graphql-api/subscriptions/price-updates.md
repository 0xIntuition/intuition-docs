---
title: Price Updates
sidebar_label: Price Updates
sidebar_position: 3
description: Subscribe to share price changes in real-time
keywords: [graphql, subscription, price, share, real-time, stream]
---

# Price Update Subscriptions

Subscribe to real-time share price changes.

## Subscription Structure

```graphql
subscription WatchPriceChanges(
  $cursor: [share_price_changes_stream_cursor_input]!
  $termId: String!
  $batchSize: Int!
) {
  share_price_changes_stream(
    cursor: $cursor
    batch_size: $batchSize
    where: { term_id: { _eq: $termId } }
  ) {
    term_id
    curve_id
    old_price
    new_price
    price_change
    created_at
  }
}
```

## Best Practices

1. **Filter by term_id** for specific vault
2. **Use batch_size** to control update frequency
3. **Calculate percentage change** from old/new prices
4. **Update charts** with new data points
