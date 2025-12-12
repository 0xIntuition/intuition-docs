---
title: Triple Fundamentals
sidebar_label: Fundamentals
sidebar_position: 1
description: Understanding Triples - semantic relationships that form the knowledge graph
keywords: [triples, semantic triples, subject predicate object, relationships, knowledge graph, RDF]
---

# Triple Fundamentals

If Atoms are the words in Intuition's global dictionary, Triples are the sentences we create from those words. A Triple connects three Atoms to assert a relationship or fact in the form **[Subject] – [Predicate] – [Object]**.

## Understanding Triples

A Triple is a fundamental data structure that expresses relationships between Atoms, following the classic RDF triple format used in semantic web technologies. This makes Intuition's data inherently machine-readable and structured.

With discrete units of data established through Atoms, defining relationships between these units to form higher-order structures is essential. Intuition achieves this by employing Semantic Triples, ensuring a uniform and discrete structure that can be prescribed a decentralized identifier and have some associated agent-centric state.

## Triple Structure

Triples consist of three elements: Subject, Predicate, and Object, with each element represented as an Atom. This Subject-Predicate-Object format allows users to clearly and explicitly define relationships between Atoms.

<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginTop: '2rem', marginBottom: '2rem' }}>

<div style={{ border: '1px solid var(--ifm-color-emphasis-300)', borderRadius: '8px', padding: '1.5rem', backgroundColor: 'var(--ifm-background-color)' }}>
<h3 style={{ marginTop: 0, marginBottom: '1rem' }}>Subject</h3>
<p style={{ marginBottom: '1rem', color: 'var(--ifm-color-emphasis-700)' }}>
The entity or concept being described in the relationship.
</p>
</div>

<div style={{ border: '1px solid var(--ifm-color-emphasis-300)', borderRadius: '8px', padding: '1.5rem', backgroundColor: 'var(--ifm-background-color)' }}>
<h3 style={{ marginTop: 0, marginBottom: '1rem' }}>Predicate</h3>
<p style={{ marginBottom: '1rem', color: 'var(--ifm-color-emphasis-700)' }}>
The relationship or attribute that connects the subject to the object.
</p>
</div>

<div style={{ border: '1px solid var(--ifm-color-emphasis-300)', borderRadius: '8px', padding: '1.5rem', backgroundColor: 'var(--ifm-background-color)' }}>
<h3 style={{ marginTop: 0, marginBottom: '1rem' }}>Object</h3>
<p style={{ marginBottom: '1rem', color: 'var(--ifm-color-emphasis-700)' }}>
The value or characteristic attributed to the subject through the predicate.
</p>
</div>

</div>

Every Triple represents a claim—it asserts that a Subject has some relationship (Predicate) to an Object. For example:

```
[Alice] -- [lives In] --> [Paris]
```

This Triple asserts a fact about Alice's location, where:
- **Alice** is the subject Atom
- **livesIn** is the predicate Atom (describing the type of relationship)
- **Paris** is the object Atom

Each component of a Triple is an Atom ID under the hood. The system doesn't store free-form text "Alice" or "Paris" but rather pointers to those Atom records, which might contain rich data, alternate labels, and additional metadata.

## Example Triples

### Simple Triple Example

```
Subject: "Bob"
Predicate: "age"
Object: "34"
```

In this example, each component—Subject, Predicate, and Object is an Atom, and the Triple expresses a specific relationship between these Atoms.

### Professional Credential

```
[Dr. Smith] — [has degree] — [Harvard Medical School]
```

Expressing educational credentials as structured data.

### Smart Contract Deployment

```
[UniswapV3] — [was deployed on] — [2021-05-05]
```

Recording blockchain events as semantic relationships.

## Fractal Data Representations

Triples offer a flexible yet structured method for representing data relationships. By allowing Triples to act as Atoms within other Triples, Intuition facilitates the expression, storage, and usage of arbitrarily complex data models that can scale and evolve over time.

This flexibility is crucial for capturing intricate relationships and dynamics within data, enabling users to construct sophisticated applications and services on the Intuition framework. This approach maintains discrete, referenceable units for data at every layer of the structure, ensuring scalability and precision in data representation.

## The Graph Structure

Triples naturally form a graph of nodes and links. You can visualize:
- **Atoms as nodes** in the graph
- **Triples as directed edges** from subject to object, labeled by the predicate

This graph structure enables powerful capabilities:
- Deterministic queries like "find all objects that Alice is connected to via livesIn"
- Traversal of relationships to discover indirect connections
- Pattern matching across the knowledge graph

## Triple Ownership and Token Curated Registries

Akin to the process outlined for Atoms, the structure of Triples allows users to gain fractional ownership of Triples through interaction. Each interaction generates interaction fees, which are distributed to the owners of each respective Triple, creating an incentivized Token Curated Registry (TCR) for data structures.

The TCR encourages system participants to adopt common ways of structuring data by offering economic rewards. This approach promotes an organic, incentive-driven structuring of data, contrasting with more rigid and traditional methods such as standards committees, which often struggle to achieve effective standardization.

## Integration with Other Primitives

### With Atoms
- Triples connect Atoms into meaningful relationships
- Atoms gain context through Triple connections
- Triple predicates can themselves be Atoms for maximum flexibility

### With Signals
- Signals add weight to Triple claims through staking
- Community validates Triples through Signal attestations
- Signal strength directly affects Triple credibility and consensus

## Summary

Triples allow Intuition to form a living, searchable web of knowledge. When adding Triples, the goal is to make each claim as clear and verifiable as possible, selecting the right words (Atoms) from the global dictionary, and then letting the network of users and their Signals determine validity.

With Atoms as the words in our global dictionary and Triples as the sentences we construct from them, we can express any arbitrarily-complex concept while maintaining discrete, referenceable structure.

---

## Next Steps

- [Triple Structuring](./structuring) - Learn advanced techniques for creating effective Triples
- [Nested Triples](./nested-triples) - Understand how to build complex, layered claims
- [Signal Fundamentals](../signals/fundamentals) - Discover how the community validates Triples
