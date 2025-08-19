---
id: atoms
title: Atoms
sidebar_label: Atoms
sidebar_position: 1
description: Understanding Atoms in Intuition
---

# Atoms

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

## Decentralized Identifiers (DIDs)

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

The uniqueness of each Atom is enforced by hashing its underlying data, preventing duplicate Atoms for the same piece of data. This approach allows Atoms to segment data into discrete, manageable units that can be easily combined and reused across diverse contexts and applications.

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

## Next Steps

Now that you understand Atoms, explore:

- [Triples](/guides/introduction/the-primitives/fundamentals/triples) - Learn how Atoms combine to form relationships
- [Signal](/guides/introduction/the-primitives/fundamentals/signal) - Understand how users interact with Atoms
- [Structuring Atoms](/guides/introduction/the-primitives/structuring/atoms) - Advanced techniques for working with Atoms 