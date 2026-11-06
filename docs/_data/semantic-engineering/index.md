---
title: Semantic Engineering
sidebar_label: Overview
sidebar_position: 1
description: How Intuition structures knowledge — from minimal onchain atoms to rich offchain context to predicate-connected relationships
keywords:
  [
    semantic engineering,
    data structures,
    classifications,
    enrichment,
    predicates,
    knowledge graph,
    atoms,
    triples,
  ]
---

# Semantic Engineering

Semantic engineering is how you design the data that goes into Intuition's knowledge graph. Every piece of knowledge follows a three-layer pattern:

1. **Identity (onchain)** — A minimal, durable atom stored on the blockchain
2. **Context (offchain)** — Rich metadata attached and refreshed independently
3. **Relationships (predicates)** — Typed connections between atoms via triples

This section covers the practical "what goes where" so you can build effectively on the protocol.

## The Three-Layer Model

```
┌─────────────────────────────────────────────────┐
│  Layer 3: Relationships (Predicates)            │
│  "How atoms connect to each other"              │
│  (I, follow, Vitalik)  (Aave, uses, Chainlink)  │
├─────────────────────────────────────────────────┤
│  Layer 2: Context (Enrichment)                  │
│  "Rich metadata, refreshed offchain"            │
│  Wikipedia summaries, CoinGecko data, images    │
├─────────────────────────────────────────────────┤
│  Layer 1: Identity (Classification)             │
│  "Minimal atom data, stored onchain"            │
│  { "@type": "Person", "name": "Vitalik" }      │
└─────────────────────────────────────────────────┘
```

### Why separate identity from context?

Atoms are permanent onchain. If you pack mutable data into an atom (images, descriptions, social links), it becomes stale and expensive to maintain. Instead:

- **Onchain atom** = just enough to identify and disambiguate the entity
- **Offchain enrichment** = everything else, refreshed as better data becomes available
- **Composed at read time** for product UX and search

This means a `Person` atom only needs `name` — the Wikipedia bio, profile photo, and social links come from enrichment providers that update independently.

## How It Connects to Primitives

If you've read the [Primitives](../intuition-concepts/primitives/index.md) section, you know about Atoms, Triples, and Signals. Semantic engineering builds on those foundations:

| Primitive | Semantic Engineering Layer |
| --------- | --------------------------------------------------- |
| Atoms | **Classifications** define what data goes in an atom |
| Triples | **Predicates** define the relationship vocabulary |
| Signals | Deposits on triples express conviction in claims |

## What's in This Section

- **[Data Structures](./data-structures.md)** — How to format atom data using Schema.org classifications and the enrichment system
- **[Predicates](./predicates.md)** — The canonical predicate catalog, usage patterns, and how to avoid common mistakes

## Full Reference

These docs distill the most important patterns for builders. For the complete specification — all 36 classification types, 37 enrichment providers, and architectural deep dives — see the [intuition-data-structures](https://github.com/0xIntuition/intuition-data-structures) repository.
