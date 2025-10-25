---
title: Overview
sidebar_position: 1
---

# Triples

If Atoms are the words in Intuition's global dictionary, Triples are the sentences we create from those words. A Triple connects three Atoms to assert a relationship or fact in the form **[Subject] – [Predicate] – [Object]**. You can string these sentences together to express any arbitrarily-complex concept, all while retaining a discrete, referenceable structure!

## Understanding Triples

A Triple is a fundamental data structure that expresses relationships between Atoms, following the classic RDF triple format used in semantic web technologies. This makes Intuition's data inherently machine-readable and structured.

Every Triple represents a claim—it asserts that a Subject has some relationship (Predicate) to an Object. For example:

```
[Alice] -- [livesIn] --> [Paris]
```

This Triple asserts a fact about Alice's location, where:
- **Alice** is the subject Atom
- **livesIn** is the predicate Atom (describing the type of relationship)
- **Paris** is the object Atom

Each component of a Triple is an Atom ID under the hood. The system doesn't store free-form text "Alice" or "Paris" but rather pointers to those Atom records, which might contain rich data, alternate labels, and additional metadata.

## The Graph Structure

Triples naturally form a graph of nodes and links. You can visualize:
- **Atoms as nodes** in the graph
- **Triples as directed edges** from subject to object, labeled by the predicate

This graph structure enables powerful capabilities:
- Deterministic queries like "find all objects that Alice is connected to via livesIn"
- Traversal of relationships to discover indirect connections
- Pattern matching across the knowledge graph

## Why Triples Matter

### Semantic Clarity
By expressing data in Triple format, Intuition ensures relationships are explicit and standardized. Instead of loose text statements like "Alice lives in Paris" (which computers struggle to parse), we have typed links that machines understand: `Alice —livesIn→ Paris`.

### Reconciliation & Interoperability
The clarity of Triples means different data sources referencing the same predicate can be merged or compared easily. This semantic structure makes data immediately useful to other systems—knowledge graphs and AI systems can ingest these subject-predicate-object triples without guessing their meaning.

### Extensibility
Triples are infinitely extensible. New information can be attached in graph form without altering the original nodes. If we later learn "Alice lives in Paris since 2015", we can introduce new Atoms and predicates to capture this additional context through supplementary Triples.

### Composability
The data model is open-ended—you can always extend the graph by adding another Triple rather than modifying existing ones. This is analogous to how one can keep adding facts to Wikipedia.

## Summary

Triples allow Intuition to form a living, searchable web of knowledge. When adding Triples, the goal is to make each claim as clear and verifiable as possible, selecting the right words (Atoms) from the global dictionary, and then letting the network of users and their Signals determine validity.

With Atoms as the words in our global dictionary and Triples as the sentences we construct from them, we can express any arbitrarily-complex concept while maintaining discrete, referenceable structure. Here's where it becomes powerful: each Triple receives its own unique ID, effectively becoming a new "word" in the system that encapsulates an entire concept. This ID can then be referenced by other Triples, allowing you to build increasingly sophisticated expressions.

Think of it as linguistic compression—instead of repeatedly expressing complex relationships, you create them once and reference them by ID. A Triple about "Alice's employment at a specific company with particular conditions" becomes a single referenceable unit. That unit can then be used in higher-order statements about employment trends, verification claims, or temporal changes. This creates a hierarchy of meaning where complex ideas are built from simpler ones, yet each level remains independently addressable and verifiable.

The result is an extraordinarily efficient knowledge transmission system. Rather than sending verbose descriptions, systems can exchange compact Triple IDs that expand into rich, contextual information. Each ID carries with it not just data, but the entire graph of relationships, evidence, and community consensus that supports it. The addition of Signals completes the picture by measuring which sentences (facts) are trusted by the community.
## Explore More

Dive deeper into Triples with these detailed guides:

- **[Nested Triples: Meta-Claims & Context](./nested-triples)**: Learn how Triples can reference other Triples for context and provenance
- **[Positive and Negative Claims](./positive-negative-claims)**: Understand the two-sided staking mechanism and consensus evaluation
- **[Best Practices for Structuring Triples](./best-practices)**: Guidelines for creating effective, reusable Triples
- **[Core Benefits](./core-benefits)**: Discover the semantic clarity, flexibility, and conflict resolution capabilities
- **[Practical Implementation](./practical-implementation)**: Code examples for creating Triples, nested claims, and evidence chains
- **[Use Cases](./use-cases)**: Explore real-world applications in knowledge graphs, identity, supply chain, and DeFi
- **[Querying Triples](./querying-triples)**: Learn how to query and traverse the knowledge graph
- **[Integration with Other Primitives](./integration)**: See how Triples work with Atoms and Signals
