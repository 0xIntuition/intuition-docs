---
title: Nested Triples - Meta-Claims & Context
sidebar_position: 2
---

# Nested Triples: Meta-Claims & Context

One of Intuition's most powerful features is that Triples can reference other Triples, effectively nesting statements to provide context or provenance. Intuition supports using a Triple itself as a Subject or Object in another Triple.

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

Think of it as linguistic compression—instead of repeatedly expressing complex relationships, you create them once and reference them by ID. A Triple about "Alice's employment at a specific company with particular conditions" becomes a single referenceable unit. That unit can then be used in higher-order statements about employment trends, verification claims, or temporal changes.

This creates a hierarchy of meaning where complex ideas are built from simpler ones, yet each level remains independently addressable and verifiable.
