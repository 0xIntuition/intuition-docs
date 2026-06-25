---
title: Pin Thing
sidebar_label: Pin Thing
sidebar_position: 1
description: Pin Thing metadata to IPFS
keywords: [graphql, mutation, ipfs, pin, thing, metadata]
---

# Pin Thing Mutation

Pin a "Thing" object (general entity) to IPFS for use in atom creation.

## Endpoint and Auth

Use the public gated pinning endpoint and send your Intuition pin API key in an `apikey` header:

```text
https://pin.intuition.systems/v1/graphql
```

Keep the key in a trusted server runtime. Do not pass it in the URL or expose it in public browser environment variables.

## Mutation Structure

```graphql
mutation PinThing($thing: PinThingInput!) {
  pinThing(thing: $thing) {
    uri
  }
}
```

## Variables

```json
{
  "thing": {
    "name": "TypeScript Programming Language",
    "description": "A strongly typed programming language that builds on JavaScript",
    "image": "ipfs://QmXnnyufdzAWL5CqZ2RnSNgPbvCc1ALT73s6epPrRnZ1Xy",
    "url": "https://www.typescriptlang.org"
  }
}
```

## Response

```json
{
  "data": {
    "pinThing": {
      "uri": "ipfs://QmYx8C3kNN1sFSx5b..."
    }
  }
}
```

## Workflow

1. **Pin metadata** using `pinThing` mutation
2. **Get IPFS URI** from response
3. **Create atom on-chain** using the URI
4. **Query the atom** via GraphQL API

## Best Practices

1. **Upload images first** if needed using `uploadImage`
2. **Include all metadata** fields for rich display
3. **Store IPFS URI** for future reference
4. **Wait for indexing** before querying the atom
