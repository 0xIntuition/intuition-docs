---
title: Pin Thing
sidebar_label: Pin Thing
sidebar_position: 1
description: Pin Thing metadata to IPFS
keywords: [graphql, mutation, ipfs, pin, thing, metadata]
---

import GraphQLPlaygroundCustom from '@site/src/components/GraphQLPlaygroundCustom';

# Pin Thing Mutation

Pin a "Thing" object (general entity) to IPFS for use in atom creation.

## Mutation Structure

```graphql
mutation PinThing($thing: PinThingInput!) {
  pinThing(thing: $thing) {
    hash
    name
    size
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
      "hash": "QmYx8C3kNN1sFSx5b...",
      "name": "thing.json",
      "size": 256
    }
  }
}
```

## Workflow

1. **Pin metadata** using `pinThing` mutation
2. **Get IPFS hash** from response
3. **Create atom on-chain** using the hash
4. **Query the atom** via GraphQL API

## Best Practices

1. **Upload images first** if needed using `uploadImage`
2. **Include all metadata** fields for rich display
3. **Store IPFS hash** for future reference
4. **Wait for indexing** before querying the atom
