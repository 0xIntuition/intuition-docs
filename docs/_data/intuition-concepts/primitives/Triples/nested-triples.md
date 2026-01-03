---
title: Nested Triples
sidebar_label: Nested Triples
sidebar_position: 3
description: Creating meta-claims and context through nested Triple structures
keywords: [nested triples, meta-claims, context, provenance, composite statements]
---

# Nested Triples: Meta-Claims & Context

One of Intuition's most powerful features is that Triples can reference other Triples, effectively nesting statements to provide context or provenance. Intuition supports using a Triple itself as a Subject or Object in another Triple.

## Understanding Nested Triples

Think of it as linguistic compression—instead of repeatedly expressing complex relationships, you create them once and reference them by ID. A Triple about "Alice's employment at a specific company with particular conditions" becomes a single referenceable unit.

That unit can then be used in higher-order statements about employment trends, verification claims, or temporal changes. This creates a hierarchy of meaning where complex ideas are built from simpler ones, yet each level remains independently addressable and verifiable.

## Example: Disputing a Claim

Consider an initial Triple:
```
[Bob] -- [isFriendOf] --> [Alice]
```

If Alice disagrees with this claim, we can create a nested Triple:
```
[Alice] -- [disproves] --> (Bob isFriendOf Alice)
```

Here, the Object of the second Triple is not an Atom but a reference to the first Triple (identified by its Triple ID). Alice is essentially asserting that the friendship claim is false.

## Adding Evidence & Sources

You can link Triples to evidence or citations:
```
[Triple X] -- [basedOn] --> [Document Y]
```

This ability to compose Triples into higher-order statements gives the graph a fractal quality—small facts build into bigger facts, and complex relationships can be broken down into simpler ones.

## Linguistic Compression

The result is an extraordinarily efficient knowledge transmission system. Rather than sending verbose descriptions, systems can exchange compact Triple IDs that expand into rich, contextual information.

Each ID carries with it not just data, but the entire graph of relationships, evidence, and community consensus that supports it.

## Use Cases

### Temporal Context
```
[[Alice works at Company X]] -- [valid from] --> [2024-01-01]
[[Alice works at Company X]] -- [valid until] --> [2024-12-31]
```

### Provenance Tracking
```
[[Ethereum is secure]] -- [claimed by] --> [Security Firm Y]
[[Ethereum is secure]] -- [verified on] --> [2024-01-15]
```

### Meta-Information
```
[[Product X is good]] -- [confidence level] --> [0.85]
[[Product X is good]] -- [number of attestors] --> [150]
```

---

## Next Steps

- [Signal Fundamentals](../signals/fundamentals) - Learn how the community validates nested claims
- [Triple Structuring](./structuring) - Review best practices for Triple design
