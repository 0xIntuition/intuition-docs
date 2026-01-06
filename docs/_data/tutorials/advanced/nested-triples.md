---
title: Working with Nested Triples
sidebar_label: Nested Triples
sidebar_position: 1
description: Use triples as atoms for complex expressions
---

# Working with Nested Triples

> Coming soon! This tutorial will show how to create complex, multi-layered claims.

Nested triples allow you to make statements about statements, creating powerful recursive knowledge structures.

## What You'll Learn

This tutorial will cover:
- Creating triples as atoms
- Building complex conditional logic
- Implementing recursive relationships
- Querying nested structures
- Real-world use cases (meta-claims, conditional predictions, hierarchical data)

## In the Meantime

See these resources to learn about nested triples:

- [Triples Fundamentals](/docs/intuition-concepts/primitives/Triples/fundamentals)
- [Nested Triples Concept](/docs/intuition-concepts/primitives/Triples/nested-triples)
- [SDK Documentation](/docs/intuition-sdk/installation-and-setup)

## Simple Example

```typescript
// Create a base triple
const baseTriple = await multivault.createTriple({
  subjectId: aliceAtomId,
  predicateId: knowsPredicateId,
  objectId: bobAtomId
})

// Create an atom from this triple
const tripleAtomId = await multivault.createAtom({
  atomUri: {
    type: 'triple',
    value: baseTriple.tripleId
  }
})

// Now make a claim about the claim
// "Charlie verified that Alice knows Bob"
const metaTriple = await multivault.createTriple({
  subjectId: charlieAtomId,
  predicateId: verifiedPredicateId,
  objectId: tripleAtomId
})
```

## Get Notified

Want to be notified when this tutorial is ready? Join our [Discord](https://discord.gg/RgBenkX4mx) or follow us on [Twitter](https://twitter.com/0xIntuition).
