---
title: Pin Person
sidebar_label: Pin Person
sidebar_position: 2
description: Pin Person metadata to IPFS
keywords: [graphql, mutation, ipfs, pin, person, metadata]
---

# Pin Person Mutation

Pin a Person entity to IPFS for use in atom creation.

## Mutation Structure

```graphql
mutation PinPerson($person: PinPersonInput!) {
  pinPerson(person: $person) {
    hash
    name
    size
  }
}
```

## Variables

```json
{
  "person": {
    "name": "Vitalik Buterin",
    "description": "Co-founder of Ethereum",
    "email": "vitalik@ethereum.org",
    "identifier": "vitalik.eth",
    "image": "ipfs://QmXnnyufdzAWL5CqZ2RnSNgPbvCc1ALT73s6epPrRnZ1Xy",
    "url": "https://vitalik.ca"
  }
}
```

## Best Practices

1. **Include identifier** (ENS, username, etc.)
2. **Add image** for visual representation
3. **Provide description** for context
4. **Use person-specific fields** for rich metadata
