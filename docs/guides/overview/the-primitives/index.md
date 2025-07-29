---
sidebar_position: 4
---

# Primitives

The Intuition System is built on a set of novel primitives, which form the foundation of the ecosystem and enable the creation of a structured, semantic web of trust. 

:::note
Intuition introduces three new primitives: 

1. **Atoms**: Intuition's atomic unit of knowledge, enabling unique, persistent, canonical identifiers for all things - not just people.
2. **Triples:** A composition of Atoms - defined as Semantic Triples which represent the relationships between Atoms
3. **Signal:** The weight of Atoms and Triples, derived from the total amount of ETH deposited in Atom and Triple Vaults
:::

## Explore Primitives

<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginTop: '2rem', marginBottom: '2rem' }}>

<div style={{ border: '1px solid var(--ifm-color-emphasis-300)', borderRadius: '8px', padding: '1.5rem', backgroundColor: 'var(--ifm-background-color)' }}>
<h3 style={{ marginTop: 0, marginBottom: '1rem' }}>Fundamentals</h3>
<p style={{ marginBottom: '1rem', color: 'var(--ifm-color-emphasis-700)' }}>
Learn the core concepts of Atoms, Triples, Signal, Fees & Rewards, and State Interpretations. Master the building blocks of the Intuition system.
</p>
<a href="/guides/overview/the-primitives/fundamentals" style={{ color: 'var(--ifm-color-primary)', textDecoration: 'none', fontWeight: '500' }}>
Explore Fundamentals →
</a>
</div>

<div style={{ border: '1px solid var(--ifm-color-emphasis-300)', borderRadius: '8px', padding: '1.5rem', backgroundColor: 'var(--ifm-background-color)' }}>
<h3 style={{ marginTop: 0, marginBottom: '1rem' }}>Structuring</h3>
<p style={{ marginBottom: '1rem', color: 'var(--ifm-color-emphasis-700)' }}>
Discover advanced techniques for structuring data with Atoms and Triples, capturing signal, and calculating rewards in the Intuition ecosystem.
</p>
<a href="/guides/overview/the-primitives/structuring" style={{ color: 'var(--ifm-color-primary)', textDecoration: 'none', fontWeight: '500' }}>
Explore Structuring →
</a>
</div>

</div>

## Core Primitives Overview

<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginTop: '2rem', marginBottom: '2rem' }}>

<div style={{ border: '1px solid var(--ifm-color-emphasis-300)', borderRadius: '8px', padding: '1.5rem', backgroundColor: 'var(--ifm-background-color)' }}>
<h3 style={{ marginTop: 0, marginBottom: '1rem' }}>Atoms</h3>
<p style={{ marginBottom: '1rem', color: 'var(--ifm-color-emphasis-700)' }}>
The most basic units of knowledge within Intuition, functioning as unique, globally persistent, decentralized identifiers for all things—people, concepts, products, and more.
</p>
<div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
<span style={{ backgroundColor: 'var(--ifm-color-emphasis-100)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.875rem' }}>Subjects</span>
<span style={{ backgroundColor: 'var(--ifm-color-emphasis-100)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.875rem' }}>Predicates</span>
<span style={{ backgroundColor: 'var(--ifm-color-emphasis-100)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.875rem' }}>Objects</span>
</div>
</div>

<div style={{ border: '1px solid var(--ifm-color-emphasis-300)', borderRadius: '8px', padding: '1.5rem', backgroundColor: 'var(--ifm-background-color)' }}>
<h3 style={{ marginTop: 0, marginBottom: '1rem' }}>Triples</h3>
<p style={{ marginBottom: '1rem', color: 'var(--ifm-color-emphasis-700)' }}>
Higher-order structures used to define relationships between Atoms. Each Triple consists of three components: a Subject, Predicate, and Object.
</p>
<div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
<span style={{ backgroundColor: 'var(--ifm-color-emphasis-100)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.875rem' }}>Relationships</span>
<span style={{ backgroundColor: 'var(--ifm-color-emphasis-100)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.875rem' }}>Semantic</span>
<span style={{ backgroundColor: 'var(--ifm-color-emphasis-100)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.875rem' }}>Machine-readable</span>
</div>
</div>

<div style={{ border: '1px solid var(--ifm-color-emphasis-300)', borderRadius: '8px', padding: '1.5rem', backgroundColor: 'var(--ifm-background-color)' }}>
<h3 style={{ marginTop: 0, marginBottom: '1rem' }}>Signal</h3>
<p style={{ marginBottom: '1rem', color: 'var(--ifm-color-emphasis-700)' }}>
Actions that express intent, belief, or support within the system. Signals can be explicit or implicit, contributing to trust and belief expression.
</p>
<div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
<span style={{ backgroundColor: 'var(--ifm-color-emphasis-100)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.875rem' }}>Trust</span>
<span style={{ backgroundColor: 'var(--ifm-color-emphasis-100)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.875rem' }}>Belief</span>
<span style={{ backgroundColor: 'var(--ifm-color-emphasis-100)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.875rem' }}>Support</span>
</div>
</div>

</div>

## Understanding Atoms

The digital universe is vast, where everything from tangible objects to abstract concepts can be endowed with a digital identity. Atoms confer unique recognition and definition to persons, places, ideas, or even memes, ensuring each entity's distinct presence. Within Intuition, every Atom is secured by a unique DID (Decentralized Identifier) and an Ethereum wallet address, establishing a verifiable foundation.

Atoms are categorized into three primary roles within semantic structures: **Subjects**, **Predicates**, and **Objects**. This structure facilitates the creation of **Triples** that articulate specific assertions or facts about the world.

### Example Triple Structure

<div style={{ backgroundColor: 'var(--ifm-color-emphasis-50)', padding: '1rem', borderRadius: '8px', margin: '1rem 0' }}>
<p style={{ margin: '0 0 0.5rem 0', fontWeight: '600' }}>Subject - Predicate - Object</p>
<p style={{ margin: '0', fontFamily: 'monospace', fontSize: '0.9rem' }}>
<strong>Alice</strong> <span style={{ color: 'var(--ifm-color-emphasis-600)' }}>[Subject]</span> <strong>- hasAccessTo</strong> <span style={{ color: 'var(--ifm-color-emphasis-600)' }}>[Predicate]</span> <strong>- Intuition</strong> <span style={{ color: 'var(--ifm-color-emphasis-600)' }}>[Object]</span>
</p>
</div>

* **Alice** is the **Subject**
* **hasAccessTo** is the **Predicate**
* **Intuition** is the **Object**

Further illustrating the flexibility of Atoms, **Intuition** can also act as a **Subject:**

<div style={{ backgroundColor: 'var(--ifm-color-emphasis-50)', padding: '1rem', borderRadius: '8px', margin: '1rem 0' }}>
<p style={{ margin: '0', fontFamily: 'monospace', fontSize: '0.9rem' }}>
<strong>Intuition</strong> <span style={{ color: 'var(--ifm-color-emphasis-600)' }}>[Subject]</span> <strong>- is a</strong> <span style={{ color: 'var(--ifm-color-emphasis-600)' }}>[Predicate]</span> <strong>- Ethereum-based attestation protocol</strong> <span style={{ color: 'var(--ifm-color-emphasis-600)' }}>[Object]</span>
</p>
</div>

This claim demonstrates Intuition's role and essence in a semantic, structured format.

## Composition of Knowledge

Acknowledging the potential for any entity, concept, or piece of data to hold a digital identity opens the door to collaboratively crafting an expansive knowledge graph. By arranging Atoms into Triples, we co-create a graph mapping out entities' interrelations and factual, verifiable assertions about the world.

The journey within Intuition starts with an Atom. Engaging with this concept might begin by identifying entities within your realm of knowledge that fit neatly into the categories of Subjects, Predicates, or Objects. This process is a first step toward contributing to our collective mission: building a collaborative knowledge graph demonstrating the connections and relationships among all entities.

## Components of an Atom

<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginTop: '1rem' }}>

<div style={{ border: '1px solid var(--ifm-color-emphasis-300)', borderRadius: '6px', padding: '1rem', backgroundColor: 'var(--ifm-background-color)' }}>
<h4 style={{ marginTop: 0, marginBottom: '0.5rem' }}>Atom Data</h4>
<p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--ifm-color-emphasis-700)' }}>
Describes the concept or entity represented by an Atom, typically stored off-chain using decentralized storage solutions like IPFS or Arweave, with a URI pointing to this data stored on-chain.
</p>
</div>

<div style={{ border: '1px solid var(--ifm-color-emphasis-300)', borderRadius: '6px', padding: '1rem', backgroundColor: 'var(--ifm-background-color)' }}>
<h4 style={{ marginTop: 0, marginBottom: '0.5rem' }}>Atom Wallet</h4>
<p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--ifm-color-emphasis-700)' }}>
A smart contract wallet associated with each Atom, granting it agency over its identity. This wallet is controlled by a specialized smart contract known as the Atom Warden.
</p>
</div>

<div style={{ border: '1px solid var(--ifm-color-emphasis-300)', borderRadius: '6px', padding: '1rem', backgroundColor: 'var(--ifm-background-color)' }}>
<h4 style={{ marginTop: 0, marginBottom: '0.5rem' }}>Atom Vault</h4>
<p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--ifm-color-emphasis-700)' }}>
A mechanism that allows users to deposit tokens into an Atom, signaling its relevance and support within the system. The Total Value Locked (TVL) in an Atom Vault indicates the Atom's acceptance and importance.
</p>
</div>

</div>

## Triples

Triples are higher-order structures within Intuition, used to define relationships between Atoms. Each Triple consists of three components: a Subject, Predicate, and Object, all of which are Atoms. This structure enables precise, machine-readable representations of data, facilitating complex and interconnected attestations.

### Triple Structure

<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '1rem' }}>

<div style={{ border: '1px solid var(--ifm-color-emphasis-300)', borderRadius: '6px', padding: '1rem', backgroundColor: 'var(--ifm-background-color)' }}>
<h4 style={{ marginTop: 0, marginBottom: '0.5rem' }}>Subject</h4>
<p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--ifm-color-emphasis-700)' }}>
The entity or concept being described.
</p>
</div>

<div style={{ border: '1px solid var(--ifm-color-emphasis-300)', borderRadius: '6px', padding: '1rem', backgroundColor: 'var(--ifm-background-color)' }}>
<h4 style={{ marginTop: 0, marginBottom: '0.5rem' }}>Predicate</h4>
<p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--ifm-color-emphasis-700)' }}>
The relationship or attribute of the subject.
</p>
</div>

<div style={{ border: '1px solid var(--ifm-color-emphasis-300)', borderRadius: '6px', padding: '1rem', backgroundColor: 'var(--ifm-background-color)' }}>
<h4 style={{ marginTop: 0, marginBottom: '0.5rem' }}>Object</h4>
<p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--ifm-color-emphasis-700)' }}>
The value or characteristic attributed to the subject.
</p>
</div>

</div>

In this example, each component—Subject, Predicate, and Object—is an Atom, and the Triple expresses a specific relationship between these Atoms.

Triples form the relationships between Atoms, allowing for arbitrarily-linked data across the web.

:::tip
Triples can be used as Atoms in other Triples, allowing for the expression of arbitrarily complex statements in a standardized format.
:::

## Signal

Signal in Intuition refers to any action that expresses intent, belief, or support within the system. Signals can be explicit, such as voting mechanisms or signed attestations, or implicit, inferred from user behavior.

### Signal Mechanisms

Users hold positions on Atoms and Triples, signaling their stance by increasing their balance on the relevant entities. Signals contribute to the nuanced expression of trust and belief, allowing for a dynamic and tiered system of preferences within the decentralized ecosystem.

<div style={{ backgroundColor: 'var(--ifm-color-emphasis-50)', padding: '1rem', borderRadius: '8px', margin: '1rem 0' }}>
<p style={{ margin: '0 0 0.5rem 0', fontWeight: '600' }}>Important Distinction</p>
<p style={{ margin: 0, fontSize: '0.9rem' }}>
Creating an Atom or Triple is distinctly different from taking a position on them. While users have the option to both create and take a position on an Atom/Triple at the time of creation, this Initial Deposit is not required. A user who makes no Initial Deposit will only create an Atom or Triple, which does not constitute a Signal.
</p>
</div>

