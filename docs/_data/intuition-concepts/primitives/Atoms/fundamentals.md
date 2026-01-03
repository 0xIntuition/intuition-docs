---
title: Atom Fundamentals
sidebar_label: Fundamentals
sidebar_position: 1
description: Understanding Atoms - the fundamental units of data in the Intuition knowledge graph
keywords: [atoms, identifiers, DID, decentralized identifiers, knowledge graph, semantic web, data primitives]
---

import BrowserOnly from '@docusaurus/BrowserOnly';
import ExcalidrawViewer from '@site/src/components/ExcalidrawViewer';

# Atom Fundamentals

Atoms are the foundational building blocks of Intuition's knowledge graph – the words in our global dictionary. Think of Intuition as a vast, collaborative dictionary where anyone can create a new word, and each word has its own globally persistent, unique digital identifier that can be used to reference it across the entire internet.

## What are Atoms?

A system facilitating the arrival at social consensus around globally persistent canonical identifiers for all things demands that these identifiers possess a few key attributes.

<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginTop: '2rem', marginBottom: '2rem' }}>

<div style={{ border: '1px solid var(--ifm-color-emphasis-300)', borderRadius: '8px', padding: '1.5rem', backgroundColor: 'var(--ifm-background-color)' }}>
<h3 style={{ marginTop: 0, marginBottom: '1rem' }}>Decentralized Identifiers</h3>
<p style={{ marginBottom: '1rem', color: 'var(--ifm-color-emphasis-700)' }}>
These identifiers should be decentralized identifiers, providing unique, secure, and verifiable identification without any reliance on a central authority.
</p>
<div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
<span style={{ backgroundColor: 'var(--ifm-color-emphasis-100)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.875rem' }}>Unique</span>
<span style={{ backgroundColor: 'var(--ifm-color-emphasis-100)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.875rem' }}>Secure</span>
<span style={{ backgroundColor: 'var(--ifm-color-emphasis-100)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.875rem' }}>Verifiable</span>
</div>
</div>

<div style={{ border: '1px solid var(--ifm-color-emphasis-300)', borderRadius: '8px', padding: '1.5rem', backgroundColor: 'var(--ifm-background-color)' }}>
<h3 style={{ marginTop: 0, marginBottom: '1rem' }}>Associated Data</h3>
<p style={{ marginBottom: '1rem', color: 'var(--ifm-color-emphasis-700)' }}>
These identifiers should have a sufficient amount of associated data to ensure precise referencing of specific entities, concepts, or pieces of information.
</p>
<div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
<span style={{ backgroundColor: 'var(--ifm-color-emphasis-100)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.875rem' }}>Contextual</span>
<span style={{ backgroundColor: 'var(--ifm-color-emphasis-100)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.875rem' }}>Precise</span>
<span style={{ backgroundColor: 'var(--ifm-color-emphasis-100)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.875rem' }}>Referenced</span>
</div>
</div>

<div style={{ border: '1px solid var(--ifm-color-emphasis-300)', borderRadius: '8px', padding: '1.5rem', backgroundColor: 'var(--ifm-background-color)' }}>
<h3 style={{ marginTop: 0, marginBottom: '1rem' }}>Agent-Centric State</h3>
<p style={{ marginBottom: '1rem', color: 'var(--ifm-color-emphasis-700)' }}>
These identifiers must have some agent-centric state that is capable of tracking the usage of the identifier across contexts.
</p>
<div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
<span style={{ backgroundColor: 'var(--ifm-color-emphasis-100)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.875rem' }}>Trackable</span>
<span style={{ backgroundColor: 'var(--ifm-color-emphasis-100)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.875rem' }}>Usage</span>
<span style={{ backgroundColor: 'var(--ifm-color-emphasis-100)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.875rem' }}>Contexts</span>
</div>
</div>

</div>

## The Atom Solution

To solve for these requirements, the concepts of Atoms emerge as the foundation of the Intuition framework, representing the most fundamental units of data. These units can range from a single word to a complex concept, serving as discrete, manageable, and referenceable pieces of information that facilitate seamless data integration and manipulation across the web.

In the spirit of the Semantic Web and linked data, an Atom can correspond to virtually anything:

- **People**: User identities, profiles, public figures
- **Organizations**: Companies, DAOs, institutions, projects
- **Addresses**: Cryptocurrency wallets, smart contracts, validators
- **Documents**: Files, articles, research papers, certificates
- **Temporal markers**: Dates, timestamps, time periods
- **Categories**: Tags, classifications, taxonomies
- **Concepts**: Ideas, words, phrases, abstract notions

<div style={{ backgroundColor: 'var(--ifm-color-emphasis-50)', padding: '1.5rem', borderRadius: '8px', marginTop: '2rem', marginBottom: '2rem' }}>
<h3 style={{ marginTop: 0, marginBottom: '1rem' }}>Key Benefits of Atoms</h3>
<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
<div style={{ border: '1px solid var(--ifm-color-emphasis-300)', borderRadius: '6px', padding: '1rem', backgroundColor: 'var(--ifm-background-color)' }}>
<h4 style={{ marginTop: 0, marginBottom: '0.5rem' }}>Universal Reference</h4>
<p style={{ margin: 0, fontSize: '0.9rem' }}>
Start to reference data universally across the web.
</p>
</div>
<div style={{ border: '1px solid var(--ifm-color-emphasis-300)', borderRadius: '6px', padding: '1rem', backgroundColor: 'var(--ifm-background-color)' }}>
<h4 style={{ marginTop: 0, marginBottom: '0.5rem' }}>User Equity</h4>
<p style={{ margin: 0, fontSize: '0.9rem' }}>
Grant users equity in data as they signal its relevancy through usage.
</p>
</div>
<div style={{ border: '1px solid var(--ifm-color-emphasis-300)', borderRadius: '6px', padding: '1rem', backgroundColor: 'var(--ifm-background-color)' }}>
<h4 style={{ marginTop: 0, marginBottom: '0.5rem' }}>Active Participation</h4>
<p style={{ margin: 0, fontSize: '0.9rem' }}>
Reward users for signaling the relevancy of data, encouraging active participation.
</p>
</div>
</div>
</div>

Each Atom is made universally referenceable through a decentralized identifier. This approach ensures that every Atom is uniquely identifiable and can be consistently referenced across the web, maintaining data integrity and meaning regardless of the system or context.

## Technical Architecture

### Core Structure

Under the hood, creating a new Atom mints a tokenized record using the ERC-1155 multi-token standard that includes:

1. **Unique Atom ID**: A permanent, immutable identifier deterministically derived from the atomData
2. **Atom Data**: Can contain any arbitrary data (URIs, text, JSON, references to external resources)
3. **Associated Smart Contract Wallet**: Enabling the Atom itself to own assets and interact with contracts

Each Atom's unique ID is deterministically generated based on its `atomData` field – meaning the same data will always produce the same Atom ID. This ensures that duplicate Atoms cannot be created for identical data, and anyone can independently verify an Atom's ID by hashing its data.

Every Atom carries `atomData` which can contain any arbitrary information relevant to that entity. For example:
- An Atom for "Solar Energy" might contain a link to a Wikipedia page about solar power
- An Atom for a user's identity might contain a DID document reference or profile JSON
- An Atom for a document might contain an IPFS content hash
- An Atom for a concept might contain a simple text string or structured JSON data

The uniqueness of each Atom is enforced by hashing its underlying data, preventing duplicate Atoms for the same piece of data. This approach allows Atoms to segment data into discrete, manageable units that can be easily combined and reused across diverse contexts and applications.

### Decentralized Identifiers (DIDs)

<div style={{ backgroundColor: 'var(--ifm-color-emphasis-50)', padding: '1.5rem', borderRadius: '8px', marginTop: '2rem', marginBottom: '2rem' }}>
<h3 style={{ marginTop: 0, marginBottom: '1rem' }}>Example DID</h3>
<div style={{ backgroundColor: 'var(--ifm-background-color)', padding: '1rem', borderRadius: '6px', border: '1px solid var(--ifm-color-emphasis-300)' }}>
<pre style={{ margin: 0, fontSize: '0.9rem', fontFamily: 'monospace' }}>
{`// An example DID

did:ethr:mainnet:0x3b0bc51ab9de1e5b7b6e34e5b960285805c41736

// An example DID Document

{
    "id": "did:ethr:mainnet:0x3b0bc51ab9de1e5b7b6e34e5b960285805c41736",
    "verificationMethod": [
        {
            "id": "did:ethr:mainnet:0x3b0bc51ab9de1e5b7b6e34e5b960285805c41736#controller",
            "type": "EcdsaSecp256k1RecoveryMethod2020",
            "controller": "did:ethr:mainnet:0x3b0bc51ab9de1e5b7b6e34e5b960285805c41736",
            "blockchainAccountId": "eip155:1:0x3b0BC51Ab9De1e5B7B6E34E5b960285805C41736"
        }
    ],
    "authentication": [
        "did:ethr:mainnet:0x3b0bc51ab9de1e5b7b6e34e5b960285805c41736#controller"
    ],
    "assertionMethod": [
        "did:ethr:mainnet:0x3b0bc51ab9de1e5b7b6e34e5b960285805c41736#controller"
    ],
    "@context": [
        "https://www.w3.org/ns/did/v1",
        "https://w3id.org/security/suites/secp256k1recovery-2020/v2",
        "https://w3id.org/security/v3-unstable"
    ]
}`}
</pre>
</div>
</div>

## Components of an Atom

<div className="uniform-card-grid-small">

<div className="uniform-card">
<h4 className="uniform-card-title">Atom Data</h4>
<p className="uniform-card-content">
Describes the concept or entity represented by an Atom, typically stored off-chain using decentralized storage solutions like IPFS or Arweave, with a URI pointing to this data stored on-chain.
</p>
</div>

<div className="uniform-card">
<h4 className="uniform-card-title">Atom Wallet</h4>
<p className="uniform-card-content">
A smart contract wallet associated with each Atom, granting it agency over its identity. This wallet is controlled by a specialized smart contract known as the Atom Warden.
</p>
</div>

<div className="uniform-card">
<h4 className="uniform-card-title">Atom Vault</h4>
<p className="uniform-card-content">
A mechanism that allows users to deposit tokens into an Atom, signaling its relevance and support within the system. The Total Value Locked (TVL) in an Atom Vault indicates the Atom's acceptance and importance.
</p>
</div>

</div>

### Staking Vaults and Bonding Curves

Each Atom has one or more Vaults attached to it for staking. These vaults operate on a bonding curve, meaning:

- The cost to acquire a stake (or "share") in an Atom increases as more is already staked
- Early stakers get a larger stake for their investment
- Latecomers pay a premium for popular Atoms

This mechanism incentivizes early discovery of important Atoms and creates a form of priority signaling – the community collectively "bids up" the Atoms deemed valuable or relevant by risking capital in their vaults.

### Atom Creation Process

<BrowserOnly fallback={<p>Loading diagram...</p>}>
  {() => <ExcalidrawViewer src="/excalidraw/atom-creation-diagram.excalidraw.json" zoom={0.3} scrollX={-150} scrollY={650} />}
</BrowserOnly>

## Data Requirements

To ensure reliable referencing of entities, concepts, or data within an Atom, each Atom must include at least minimal corresponding data. This data can be of any type, stored anywhere, and presented in any format.

<div style={{ backgroundColor: 'var(--ifm-color-emphasis-50)', padding: '1.5rem', borderRadius: '8px', marginTop: '2rem', marginBottom: '2rem' }}>
<h3 style={{ marginTop: 0, marginBottom: '1rem' }}>Recommended Data Practices</h3>
<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
<div style={{ border: '1px solid var(--ifm-color-emphasis-300)', borderRadius: '6px', padding: '1rem', backgroundColor: 'var(--ifm-background-color)' }}>
<h4 style={{ marginTop: 0, marginBottom: '0.5rem' }}>Verifiable Data Registry</h4>
<p style={{ margin: 0, fontSize: '0.9rem' }}>
Use a Verifiable Data Registry to strengthen data usability through guarantees around immutability, availability, liveness, and persistence.
</p>
</div>
<div style={{ border: '1px solid var(--ifm-color-emphasis-300)', borderRadius: '6px', padding: '1rem', backgroundColor: 'var(--ifm-background-color)' }}>
<h4 style={{ marginTop: 0, marginBottom: '0.5rem' }}>Supported Structures</h4>
<p style={{ margin: 0, fontSize: '0.9rem' }}>
Adhere to supported data structures and schemas for better interoperability and reliability.
</p>
</div>
<div style={{ border: '1px solid var(--ifm-color-emphasis-300)', borderRadius: '6px', padding: '1rem', backgroundColor: 'var(--ifm-background-color)' }}>
<h4 style={{ marginTop: 0, marginBottom: '0.5rem' }}>Timestamp Inclusion</h4>
<p style={{ margin: 0, fontSize: '0.9rem' }}>
For mutable data, include a timestamp to ensure future references understand exactly what the data represented at the moment of attestation.
</p>
</div>
</div>
</div>

## Atom Ownership and Token Curated Registries

Given the permissionless nature of the system, multiple Atoms may be representative of the same concept. To foster consensus on high-quality Atoms and establish canonical identifiers for all things, Intuition employs the concept of a Token Curated Registry (TCR).

<div style={{ backgroundColor: 'var(--ifm-color-emphasis-50)', padding: '1.5rem', borderRadius: '8px', marginTop: '2rem', marginBottom: '2rem' }}>
<h3 style={{ marginTop: 0, marginBottom: '1rem' }}>TCR Benefits</h3>
<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
<div>
<h4 style={{ marginTop: 0, marginBottom: '0.5rem' }}>Fractional Ownership</h4>
<p style={{ margin: 0, fontSize: '0.9rem' }}>
Users gain fractional ownership over the Atoms they interact with and receive a portion of the interaction fees each respective Atom generates.
</p>
</div>
<div>
<h4 style={{ marginTop: 0, marginBottom: '0.5rem' }}>Incentivized Engagement</h4>
<p style={{ margin: 0, fontSize: '0.9rem' }}>
This model incentivizes engagement with popular Atoms, encouraging active participation in the ecosystem.
</p>
</div>
<div>
<h4 style={{ marginTop: 0, marginBottom: '0.5rem' }}>Quality Ranking</h4>
<p style={{ margin: 0, fontSize: '0.9rem' }}>
A TCR emerges, ranking Atoms based on their relevance using metrics such as an Atom's Total Value Locked (TVL).
</p>
</div>
</div>
</div>

As users increasingly interact with these Atoms, a TCR emerges, ranking Atoms based on their relevance using metrics such as an Atom's Total Value Locked (TVL). This mechanism facilitates ecosystem convergence on and easy discoverability of the most valuable and widely accepted Atoms/identifiers representing each concept.

## Atoms as Building Blocks

Atoms are categorized into three primary roles within semantic structures:

### Subjects
The entity or concept being described in a relationship.

### Predicates
The relationship or attribute that connects subjects to objects.

### Objects
The value or characteristic attributed to the subject through the predicate.

This structure facilitates the creation of **Triples** that articulate specific assertions or facts about the world, which we'll explore in the next section.

---

## Next Steps

Now that you understand Atom fundamentals, explore:

- [Atom Structuring](./structuring) - Learn advanced techniques for structuring Atoms effectively
- [Atom Best Practices](./best-practices) - Discover patterns and guidelines for creating high-quality Atoms
- [Triple Fundamentals](../triples/fundamentals) - Learn how Atoms combine to form relationships
- [Signal Fundamentals](../signals/fundamentals) - Understand how users interact with Atoms through signaling
