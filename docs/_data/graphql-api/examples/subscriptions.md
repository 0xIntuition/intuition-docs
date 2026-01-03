---
title: Real-Time Subscriptions
sidebar_label: Subscriptions
sidebar_position: 9
description: Implement real-time updates with subscriptions
keywords: [graphql, example, subscription, real-time, websocket]
---

import GraphQLPlaygroundCustom from '@site/src/components/GraphQLPlaygroundCustom';

# Example: Real-Time Subscriptions

Implement real-time position monitoring with subscriptions.

## Subscription

export const subscriptionQueries = [
  {
    id: 'position-stream',
    title: 'Live Position Updates',
    query: `subscription WatchPositions(
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
}`,
    variables: {
      cursor: [{
        initial_value: { created_at: '2024-12-01T00:00:00Z' },
        ordering: 'ASC'
      }],
      accountId: '0xd8da6bf26964af9d7eed9e03e53415d37aa96045',
      batchSize: 10
    }
  }
];

<GraphQLPlaygroundCustom queries={subscriptionQueries} />

## Implementation

```typescript
import { createClient } from 'graphql-ws'

const client = createClient({
  url: 'wss://mainnet.intuition.sh/v1/graphql'
})

client.subscribe(
  {
    query: subscription,
    variables: {
      cursor: [{ initial_value: { created_at: '2024-12-01T00:00:00Z' }, ordering: 'ASC' }],
      accountId: '0x...',
      batchSize: 10
    }
  },
  {
    next: (data) => {
      console.log('Update:', data)
      // Update UI with new position data
    },
    error: (error) => {
      console.error('Subscription error:', error)
    },
    complete: () => {
      console.log('Subscription complete')
    }
  }
)
```
