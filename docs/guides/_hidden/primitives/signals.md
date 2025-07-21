---
sidebar_position: 4
---

# Signals

Signals are the event and notification primitives in the Intuition protocol, enabling real-time updates and event-driven architectures.

## Overview

Signals provide:
- Real-time notifications
- Event broadcasting
- State change alerts
- System monitoring

## Creating Signals

```typescript
const signal = await intuition.createSignal({
  type: 'EVENT',
  source: sourceAtomId,
  data: {
    // Signal data
  }
});
```

## Signal Types

### Event Signals
- State changes
- User actions
- System events
- Transaction updates

### Notification Signals
- User alerts
- System messages
- Status updates
- Error reports

### Monitoring Signals
- Performance metrics
- Health checks
- Usage statistics
- Debug information

## Working with Signals

### Subscribing to Signals
```typescript
const subscription = await intuition.subscribeToSignals({
  type: 'EVENT',
  source: atomId
}, (signal) => {
  // Handle signal
  console.log('Received signal:', signal);
});
```

### Publishing Signals
```typescript
await intuition.publishSignal({
  type: 'NOTIFICATION',
  data: {
    message: 'New update available'
  }
});
```

### Managing Subscriptions
```typescript
// Unsubscribe from signals
await subscription.unsubscribe();

// Modify subscription
await subscription.update({
  filters: newFilters
});
```

## Best Practices

1. Use appropriate signal types
2. Implement proper error handling
3. Manage subscription lifecycle
4. Consider performance implications 