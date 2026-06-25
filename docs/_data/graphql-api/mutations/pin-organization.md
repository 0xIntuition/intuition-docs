---
title: Pin Organization
sidebar_label: Pin Organization
sidebar_position: 3
description: Pin Organization metadata to IPFS
keywords: [graphql, mutation, ipfs, pin, organization, metadata]
---

# Pin Organization Mutation

Pin an Organization entity to IPFS for use in atom creation.

## Endpoint and Auth

Use the public gated pinning endpoint and send your Intuition pin API key in an `apikey` header:

```text
https://pin.intuition.systems/v1/graphql
```

Create an authenticated client before sending the mutation:

```typescript
import { GraphQLClient } from 'graphql-request';
import { PIN_API_URL } from '@0xintuition/graphql';

const client = new GraphQLClient(PIN_API_URL, {
  headers: {
    apikey: process.env.INTUITION_PIN_API_KEY!,
  },
});
```

`pinOrganization` is available as a raw GraphQL mutation. The SDK currently exposes a `pinThing` helper, but not a first-class `pinOrganization` helper.

## Mutation Structure

```graphql
mutation PinOrganization($organization: PinOrganizationInput!) {
  pinOrganization(organization: $organization) {
    uri
  }
}
```

## Variables

```json
{
  "organization": {
    "name": "Ethereum Foundation",
    "description": "Non-profit organization supporting Ethereum development",
    "email": "info@ethereum.org",
    "image": "ipfs://QmXnnyufdzAWL5CqZ2RnSNgPbvCc1ALT73s6epPrRnZ1Xy",
    "url": "https://ethereum.foundation"
  }
}
```

## Best Practices

1. **Include official name** of organization
2. **Add logo image** for branding
3. **Provide website URL** for reference
4. **Include contact email** if available
