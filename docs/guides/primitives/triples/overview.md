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
[Alice] -- [lives In] --> [Paris]
```

This Triple asserts a fact about Alice's location, where:
- **Alice** is the subject Atom
- **livesIn** is the predicate Atom (describing the type of relationship)
- **Paris** is the object Atom

Each component of a Triple is an Atom ID under the hood. The system doesn't store free-form text "Alice" or "Paris" but rather pointers to those Atom records, which might contain rich data, alternate labels, and additional metadata.

## Integration with Other Primitives

### With Atoms

- Triples connect Atoms into meaningful relationships
- Atoms gain context through Triple connections
- Triple predicates can themselves be Atoms for maximum flexibility

### With Signals

- Signals add weight to Triple claims through staking
- Community validates Triples through Signal attestations
- Signal strength directly affects Triple credibility and consensus

## The Graph Structure

Triples naturally form a graph of nodes and links. You can visualize:
- **Atoms as nodes** in the graph
- **Triples as directed edges** from subject to object, labeled by the predicate

This graph structure enables powerful capabilities:
- Deterministic queries like "find all objects that Alice is connected to via livesIn"
- Traversal of relationships to discover indirect connections
- Pattern matching across the knowledge graph


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
