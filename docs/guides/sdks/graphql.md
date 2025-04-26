---
sidebar_position: 3
---

# GraphQL SDK

The GraphQL SDK provides a type-safe way to interact with Intuition's GraphQL API. It includes:

- Auto-generated TypeScript types
- Query builders
- Caching and state management
- Real-time subscriptions

## Installation

```bash
npm install @intuition/graphql
```

## Quick Start

```typescript
import { createClient } from '@intuition/graphql';

const client = createClient({
  url: 'https://api.intuition.systems/graphql',
  headers: {
    'Authorization': 'Bearer your-api-key'
  }
});

// Query attestations
const { data } = await client.query({
  attestations: {
    where: {
      subject: '0x123...'
    },
    select: {
      id: true,
      claim: true,
      confidence: true,
      issuer: true
    }
  }
});
```

## Features

- **Type Safety**: Full TypeScript support with generated types
- **Real-time Updates**: Subscribe to changes via WebSocket
- **Caching**: Smart caching with automatic invalidation
- **Batching**: Automatic query batching for better performance

For the complete API reference, see our [GraphQL API documentation](/graphql). 