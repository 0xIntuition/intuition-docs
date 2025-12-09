---
id: triples
title: Triples
sidebar_label: Triples
sidebar_position: 2
description: Understanding Triples in Intuition
---

# Triples

With discrete units of data established through Atoms, defining relationships between these units to form higher-order structures is essential. Intuition achieves this by employing Semantic Triples, ensuring a uniform and discrete structure that can be prescribed a decentralized identifier and have some associated agent-centric state.

<div style={{ backgroundColor: 'var(--ifm-color-emphasis-50)', padding: '1.5rem', borderRadius: '8px', marginTop: '2rem', marginBottom: '2rem' }}>
<h3 style={{ marginTop: 0, marginBottom: '1rem' }}>Key Purpose</h3>
<p style={{ margin: 0, fontSize: '0.9rem' }}>
This structure is essential for achieving consensus on arbitrarily sophisticated and expressive forms of data.
</p>
</div>

## Triple Structure

Triples consist of three elements: Subject, Predicate, and Object, with each element represented as an Atom. This Subject-Predicate-Object format allows users to clearly and explicitly define relationships between Atoms.

<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginTop: '2rem', marginBottom: '2rem' }}>

<div style={{ border: '1px solid var(--ifm-color-emphasis-300)', borderRadius: '8px', padding: '1.5rem', backgroundColor: 'var(--ifm-background-color)' }}>
<h3 style={{ marginTop: 0, marginBottom: '1rem' }}>Subject</h3>
<p style={{ marginBottom: '1rem', color: 'var(--ifm-color-emphasis-700)' }}>
The entity or concept being described in the relationship.
</p>
<div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
<span style={{ backgroundColor: 'var(--ifm-color-emphasis-100)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.875rem' }}>Entity</span>
<span style={{ backgroundColor: 'var(--ifm-color-emphasis-100)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.875rem' }}>Concept</span>
<span style={{ backgroundColor: 'var(--ifm-color-emphasis-100)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.875rem' }}>Atom</span>
</div>
</div>

<div style={{ border: '1px solid var(--ifm-color-emphasis-300)', borderRadius: '8px', padding: '1.5rem', backgroundColor: 'var(--ifm-background-color)' }}>
<h3 style={{ marginTop: 0, marginBottom: '1rem' }}>Predicate</h3>
<p style={{ marginBottom: '1rem', color: 'var(--ifm-color-emphasis-700)' }}>
The relationship or attribute that connects the subject to the object.
</p>
<div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
<span style={{ backgroundColor: 'var(--ifm-color-emphasis-100)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.875rem' }}>Relationship</span>
<span style={{ backgroundColor: 'var(--ifm-color-emphasis-100)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.875rem' }}>Attribute</span>
<span style={{ backgroundColor: 'var(--ifm-color-emphasis-100)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.875rem' }}>Atom</span>
</div>
</div>

<div style={{ border: '1px solid var(--ifm-color-emphasis-300)', borderRadius: '8px', padding: '1.5rem', backgroundColor: 'var(--ifm-background-color)' }}>
<h3 style={{ marginTop: 0, marginBottom: '1rem' }}>Object</h3>
<p style={{ marginBottom: '1rem', color: 'var(--ifm-color-emphasis-700)' }}>
The value or characteristic attributed to the subject through the predicate.
</p>
<div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
<span style={{ backgroundColor: 'var(--ifm-color-emphasis-100)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.875rem' }}>Value</span>
<span style={{ backgroundColor: 'var(--ifm-color-emphasis-100)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.875rem' }}>Characteristic</span>
<span style={{ backgroundColor: 'var(--ifm-color-emphasis-100)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.875rem' }}>Atom</span>
</div>
</div>

</div>

These connections can be visualized as a graph where each node and edge is an Atom.

## Example Triple

<div style={{ backgroundColor: 'var(--ifm-color-emphasis-50)', padding: '1.5rem', borderRadius: '8px', marginTop: '2rem', marginBottom: '2rem' }}>
<h3 style={{ marginTop: 0, marginBottom: '1rem' }}>Simple Triple Example</h3>
<div style={{ backgroundColor: 'var(--ifm-background-color)', padding: '1rem', borderRadius: '6px', border: '1px solid var(--ifm-color-emphasis-300)' }}>
<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
<div style={{ textAlign: 'center', border: '1px solid var(--ifm-color-emphasis-300)', borderRadius: '6px', padding: '1rem', backgroundColor: 'var(--ifm-background-color)' }}>
<h4 style={{ marginTop: 0, marginBottom: '0.5rem', color: 'var(--ifm-color-primary)' }}>Subject</h4>
<p style={{ margin: 0, fontFamily: 'monospace', fontSize: '0.9rem' }}>"Bob"</p>
</div>
<div style={{ textAlign: 'center', border: '1px solid var(--ifm-color-emphasis-300)', borderRadius: '6px', padding: '1rem', backgroundColor: 'var(--ifm-background-color)' }}>
<h4 style={{ marginTop: 0, marginBottom: '0.5rem', color: 'var(--ifm-color-primary)' }}>Predicate</h4>
<p style={{ margin: 0, fontFamily: 'monospace', fontSize: '0.9rem' }}>"age"</p>
</div>
<div style={{ textAlign: 'center', border: '1px solid var(--ifm-color-emphasis-300)', borderRadius: '6px', padding: '1rem', backgroundColor: 'var(--ifm-background-color)' }}>
<h4 style={{ marginTop: 0, marginBottom: '0.5rem', color: 'var(--ifm-color-primary)' }}>Object</h4>
<p style={{ margin: 0, fontFamily: 'monospace', fontSize: '0.9rem' }}>"34"</p>
</div>
</div>
<p style={{ margin: 0, textAlign: 'center', fontStyle: 'italic', color: 'var(--ifm-color-emphasis-600)' }}>
In this example, each component—Subject, Predicate, and Object is an Atom, and the Triple expresses a specific relationship between these Atoms.
</p>
</div>
</div>

## Fractal Data Representations

Triples offer a flexible yet structured method for representing data relationships. By allowing Triples to act as Atoms within other Triples, Intuition facilitates the expression, storage, and usage of arbitrarily complex data models that can scale and evolve over time.

<div style={{ backgroundColor: 'var(--ifm-color-emphasis-50)', padding: '1.5rem', borderRadius: '8px', marginTop: '2rem', marginBottom: '2rem' }}>
<h3 style={{ marginTop: 0, marginBottom: '1rem' }}>Key Benefits</h3>
<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
<div style={{ border: '1px solid var(--ifm-color-emphasis-300)', borderRadius: '6px', padding: '1rem', backgroundColor: 'var(--ifm-background-color)' }}>
<h4 style={{ marginTop: 0, marginBottom: '0.5rem' }}>Flexibility</h4>
<p style={{ margin: 0, fontSize: '0.9rem' }}>
This flexibility is crucial for capturing intricate relationships and dynamics within data.
</p>
</div>
<div style={{ border: '1px solid var(--ifm-color-emphasis-300)', borderRadius: '6px', padding: '1rem', backgroundColor: 'var(--ifm-background-color)' }}>
<h4 style={{ marginTop: 0, marginBottom: '0.5rem' }}>Scalability</h4>
<p style={{ margin: 0, fontSize: '0.9rem' }}>
Enabling users to construct sophisticated applications and services on the Intuition framework.
</p>
</div>
<div style={{ border: '1px solid var(--ifm-color-emphasis-300)', borderRadius: '6px', padding: '1rem', backgroundColor: 'var(--ifm-background-color)' }}>
<h4 style={{ marginTop: 0, marginBottom: '0.5rem' }}>Precision</h4>
<p style={{ margin: 0, fontSize: '0.9rem' }}>
This approach maintains discrete, referenceable units for data at every layer of the structure.
</p>
</div>
</div>
</div>

This flexibility is crucial for capturing intricate relationships and dynamics within data, enabling users to construct sophisticated applications and services on the Intuition framework. This approach maintains discrete, referenceable units for data at every layer of the structure, ensuring scalability and precision in data representation.

## Triple Ownership and Token Curated Registries

Akin to the process outlined for Atoms, the structure of Triples allows users to gain fractional ownership of Triples through interaction. Each interaction generates interaction fees, which are distributed to the owners of each respective Triple, creating an incentivized Token Curated Registry (TCR) for data structures.

<div style={{ backgroundColor: 'var(--ifm-color-emphasis-50)', padding: '1.5rem', borderRadius: '8px', marginTop: '2rem', marginBottom: '2rem' }}>
<h3 style={{ marginTop: 0, marginBottom: '1rem' }}>TCR Advantages</h3>
<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
<div style={{ border: '1px solid var(--ifm-color-emphasis-300)', borderRadius: '6px', padding: '1rem', backgroundColor: 'var(--ifm-background-color)' }}>
<h4 style={{ marginTop: 0, marginBottom: '0.5rem' }}>Economic Rewards</h4>
<p style={{ margin: 0, fontSize: '0.9rem' }}>
The TCR encourages system participants to adopt common ways of structuring data by offering economic rewards.
</p>
</div>
<div style={{ border: '1px solid var(--ifm-color-emphasis-300)', borderRadius: '6px', padding: '1rem', backgroundColor: 'var(--ifm-background-color)' }}>
<h4 style={{ marginTop: 0, marginBottom: '0.5rem' }}>Organic Structuring</h4>
<p style={{ margin: 0, fontSize: '0.9rem' }}>
This approach promotes an organic, incentive-driven structuring of data.
</p>
</div>
<div style={{ border: '1px solid var(--ifm-color-emphasis-300)', borderRadius: '6px', padding: '1rem', backgroundColor: 'var(--ifm-background-color)' }}>
<h4 style={{ marginTop: 0, marginBottom: '0.5rem' }}>Effective Standardization</h4>
<p style={{ margin: 0, fontSize: '0.9rem' }}>
Contrasts with more rigid and traditional methods such as standards committees, which often struggle to achieve effective standardization.
</p>
</div>
</div>
</div>

The TCR encourages system participants to adopt common ways of structuring data by offering economic rewards. This approach promotes an organic, incentive-driven structuring of data, contrasting with more rigid and traditional methods such as standards committees, which often struggle to achieve effective standardization.

## Next Steps

Now that you understand Triples, explore:

- [Signal](/docs/guides/introduction/the-primitives/fundamentals/signal) - Learn how users interact with Triples
- [Structuring Triples](/docs/guides/introduction/the-primitives/structuring/triples) - Advanced techniques for working with Triples
- [Fees & Rewards](/docs/guides/introduction/the-primitives/fundamentals/fees-rewards) - Understand the economic model 