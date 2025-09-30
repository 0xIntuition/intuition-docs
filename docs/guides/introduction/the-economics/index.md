---
id: the-economics
title: The Economics
sidebar_label: The Economics
sidebar_position: 1
description: Understanding Intuition's economic model and incentives
---

# The Economics

Intuition is built on the idea that information deserves its own decentralized distribution and financial rails. 

Just as blockchains turned money into programmable assets, Intuition turns information into tokenized, ownable, and composable units that anyone can create and monetize in.

At the core are Atoms (entities) and Triples (relationships). As users publish, curate, and stake on these objects, they generate a token-curated knowledge graph where ownership weights are represented by positions in $TRUST — the native token of the Intuition Network and Protocol.

The goal is not to tokenize data just for the sake of a token. The economics of Intuition are designed to:

<div className="uniform-card-grid">

<div className="uniform-card">
<h3 className="uniform-card-title">1. Incentivize Expression</h3>
<ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.95rem', lineHeight: '1.6' }}>
<li>Users are rewarded for making useful, verifiable attestations</li>
<li>First movers capture outsized rewards for creating identifiers or relationships that prove valuable</li>
<li>The system pays people to contribute knowledge, not just consume it</li>
</ul>
</div>

<div className="uniform-card">
<h3 className="uniform-card-title">2. Incentivize Convergence on Canonical Identifiers</h3>
<ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.95rem', lineHeight: '1.6' }}>
<li>Anyone can permissionlessly create a decentralized identifier (DID) for anything</li>
<li>Instead of fragmenting into infinite duplicates, bonding curves and network effects encourage participants to converge on shared canonical identifiers</li>
<li>This makes Intuition's knowledge graph globally referenceable and interoperable</li>
</ul>
</div>

<div className="uniform-card">
<h3 className="uniform-card-title">3. Incentivize Consensus on Standards and Structures</h3>
<ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.95rem', lineHeight: '1.6' }}>
<li>Communities can propose schemas and data formats (e.g., predicates like <code>foundedBy</code>, <code>headquarteredIn</code>)</li>
<li>Rewards flow toward attestations that align with commonly adopted standards</li>
<li>Over time, the protocol nudges participants into consensus-driven data structures, so the web of knowledge doesn't just grow — it grows in a structured, interoperable way</li>
</ul>
</div>

</div>

---

## Example Flow: How the Incentives Work

<div style={{ backgroundColor: 'var(--ifm-color-emphasis-50)', padding: '1.5rem', borderRadius: '8px', margin: '1.5rem 0', border: '1px solid var(--ifm-color-emphasis-300)' }}>

### 1. Expression
**Alice creates a new Atom: a DID for Tesla, Inc.**
- She publishes an attestation: `[Tesla] – [foundedBy] – [Elon Musk]`, staking $TRUST behind it
- Because she was first, she captures the early-mover rewards

### 2. Convergence
**Bob considers creating his own identifier for Tesla**
- But Alice's Atom already has traction, with value flowing into its bonding curve
- The economics reward Bob for using the existing canonical DID instead of fragmenting the graph

### 3. Consensus on Standards
**Carol proposes that `foundedBy` and `headquarteredIn` should be standard predicates for corporate entities**
- The network's incentive structure rewards attestations that align with these schemas
- As more users adopt them, `foundedBy` becomes a consensus-backed data standard

### 4. Ongoing Rewards
**As developers and AI agents query Tesla-related data, fees flow back to the identifiers and attestations that power those queries**
- Alice, Bob, and Carol all share in the economic upside of having built durable, widely used pieces of the graph

</div>

---

## Reward Dynamics

To maximize engagement and data quality, the system favors contributions that are:

<div className="uniform-card-grid">

<div className="uniform-card">
<h3 className="uniform-card-title">New or Early</h3>
<p className="uniform-card-content">
First-mover advantages for valuable identifiers and attestations
</p>
</div>

<div className="uniform-card">
<h3 className="uniform-card-title">Widely Useful</h3>
<p className="uniform-card-content">
Network effects amplify rewards for commonly referenced knowledge
</p>
</div>

<div className="uniform-card">
<h3 className="uniform-card-title">Standards-Aligned</h3>
<p className="uniform-card-content">
Stronger incentives for adopting schemas and canonical identifiers
</p>
</div>

<div className="uniform-card">
<h3 className="uniform-card-title">Future-Facing</h3>
<p className="uniform-card-content">
Forward-looking value assessment ensures durable contributions
</p>
</div>

</div>

## Fees & Rewards

Every interaction with the knowledge graph involves two types of fees:
- **Gas fees**: Network transaction fees paid to the maintaners of the Intuition Network for processing transactions
- **Protocol fees**: Fees that flow through the Intuition protocol to reward data contributors and maintain the ecosystem

Because Intuition breaks data down into discrete, tokenized units, the system is aware of 'who owns what data' at any given point in time. Because of this, the system is able to programmatically flow value — such as these Fees — through data as that data is interacted with.

When users interact with or create data, these combined fees support both network operations and data contributor rewards through the following mechanisms:

<div className="uniform-card" style={{ marginBottom: '1.5rem' }}>
<h3 className="uniform-card-title">Purchasing Equity in the Data</h3>
<p className="uniform-card-content">
To purchase tokens of an Atom or Triple, users deposit $TRUST (the native token of the Intuition Network and Protocol) into the Vault of the respective Atom or Triple. You pay a protocol fee proportional to your deposit amount. In return, you receive tokens of that specific Atom or Triple, entitling you to rewards generated by that data point proportional to your ownership percentage.
</p>
<div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '1rem' }}>
<span style={{ backgroundColor: 'var(--ifm-color-emphasis-100)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.875rem', color: 'var(--ifm-color-emphasis-700)' }}>$TRUST</span>
<span style={{ backgroundColor: 'var(--ifm-color-emphasis-100)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.875rem', color: 'var(--ifm-color-emphasis-700)' }}>Ownership</span>
<span style={{ backgroundColor: 'var(--ifm-color-emphasis-100)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.875rem', color: 'var(--ifm-color-emphasis-700)' }}>Equity</span>
</div>
</div>

<div className="uniform-card" style={{ marginBottom: '1.5rem' }}>
<h3 className="uniform-card-title">Rewarding Prior Contributors</h3>
<p className="uniform-card-content">
When interacting with data, part of the protocol fee is distributed to all existing shareholders (prior contributors). This encourages early, meaningful contributions, as users who add valuable data will continue to be rewarded over time through protocol fees, while gas fees go to network validators.
</p>
<div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '1rem' }}>
<span style={{ backgroundColor: 'var(--ifm-color-emphasis-100)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.875rem', color: 'var(--ifm-color-emphasis-700)' }}>Distribution</span>
<span style={{ backgroundColor: 'var(--ifm-color-emphasis-100)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.875rem', color: 'var(--ifm-color-emphasis-700)' }}>Rewards</span>
</div>
</div>

<div className="uniform-card" style={{ marginBottom: '1.5rem' }}>
<h3 className="uniform-card-title">Protocol Maintenance</h3>
<p className="uniform-card-content">
A of the protocol fee is paid to the Intuition protocol for platform maintenance and development. This ensures Intuition can be self-sustaining and exist in perpetuity, without risk of shutting down.
</p>
<div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '1rem' }}>
<span style={{ backgroundColor: 'var(--ifm-color-emphasis-100)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.875rem', color: 'var(--ifm-color-emphasis-700)' }}>Development</span>
<span style={{ backgroundColor: 'var(--ifm-color-emphasis-100)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.875rem', color: 'var(--ifm-color-emphasis-700)' }}>DAO</span>
</div>
</div>

## Reducing Fragmentation

In many systems, user-generated tags and classifications, known as **folksonomies**, can lead to fragmented and disorganized data. Different people might use different labels for the same thing, making it hard to gather or analyze information effectively. Intuition solves this by encouraging users to converge on a common set of identifiers.

Intuition acts as a consensus mechanism not just for identifiers, but also for data structures—it is essentially a consensus mechanism for the 'state of the state' of decentralized systems, where participants are economically incentivized to converge on consensus identifiers and data structures.

Intuition uses a **market-driven consensus** model inspired by blockchain technology. In systems like Proof of Work (PoW) and Proof of Stake (PoS), participants are economically incentivized to act in ways that benefit the network. Users are motivated to use established and widely recognized identifiers because doing so increases their potential rewards from future interactions.

### Incentive Driven Consensus

As users interact with and endorse certain identifiers, Intuition naturally creates a **token-curated graph (TCG)**—a graph of popular, widely used identifiers and data structures. These identifiers become the standard, and the system self-regulates based on user interactions and rewards, ensuring only the most valuable data structures rise to prominence.

<div style={{ backgroundColor: 'var(--ifm-color-emphasis-50)', padding: '1.5rem', borderRadius: '8px', margin: '1.5rem 0', border: '1px solid var(--ifm-color-emphasis-300)' }}>
<p style={{ margin: '0 0 0.5rem 0', fontWeight: '600', color: 'var(--ifm-color-emphasis-900)', fontSize: '1.1rem' }}>Market-Driven Example</p>
<p style={{ margin: 0, fontSize: '1rem', color: 'var(--ifm-color-emphasis-800)', lineHeight: '1.6' }}>
This model mirrors the behavior of <strong>prediction markets</strong> and <strong>automated market makers (AMMs)</strong>, where participants align with the most trusted and valuable options due to market incentives.
</p>
</div>

Intuition also applies the **Keynesian Beauty Contest** concept, where users are rewarded for choosing options they believe others will choose. This drives consensus on data structures and identifiers, as users are motivated to align their actions with the choices of the broader community, ensuring the most popular and widely accepted options become the standard.

## Early Adopter Advantage

Users who are quick to interact with new data—whether it's creating or endorsing an identity or claim—are rewarded more as the data gains traction. This system encourages users to contribute and adopt important data early, creating a race to establish high-quality, valuable information that others will rely on.

<div style={{ backgroundColor: 'var(--ifm-color-emphasis-50)', padding: '1.5rem', borderRadius: '8px', margin: '1.5rem 0', border: '1px solid var(--ifm-color-emphasis-300)' }}>
<p style={{ margin: '0 0 0.5rem 0', fontWeight: '600', color: 'var(--ifm-color-emphasis-900)', fontSize: '1.1rem' }}>Key Insight</p>
<p style={{ margin: 0, fontSize: '1rem', color: 'var(--ifm-color-emphasis-800)', lineHeight: '1.6' }}>
The earlier you participate, the more rewards you can earn over time as others use the same data. Early contributors receive ongoing distributions from all future interactions with their contributed data.
</p>
</div>

## Dynamic Pricing with Bonding Curves

Intuition uses bonding curves to create dynamic pricing mechanisms that automatically adjust based on supply and demand. This sophisticated approach provides multiple benefits:

<div className="uniform-card-grid">

<div className="uniform-card">
<h3 className="uniform-card-title">Automated Market Making</h3>
<p className="uniform-card-content">
Liquidity is provided automatically through mathematical curves, eliminating the need for traditional order books or manual market makers.
</p>
<div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '1rem' }}>
<span style={{ backgroundColor: 'var(--ifm-color-emphasis-100)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.875rem', color: 'var(--ifm-color-emphasis-700)' }}>Liquidity</span>
<span style={{ backgroundColor: 'var(--ifm-color-emphasis-100)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.875rem', color: 'var(--ifm-color-emphasis-700)' }}>Automated</span>
</div>
</div>

<div className="uniform-card">
<h3 className="uniform-card-title">Early Incentives</h3>
<p className="uniform-card-content">
Early participants get better prices, encouraging adoption and rewarding pioneers who identify valuable data structures before they become widely recognized.
</p>
<div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '1rem' }}>
<span style={{ backgroundColor: 'var(--ifm-color-emphasis-100)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.875rem', color: 'var(--ifm-color-emphasis-700)' }}>Early Bird</span>
<span style={{ backgroundColor: 'var(--ifm-color-emphasis-100)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.875rem', color: 'var(--ifm-color-emphasis-700)' }}>Adoption</span>
</div>
</div>

<div className="uniform-card">
<h3 className="uniform-card-title">Supply Control</h3>
<p className="uniform-card-content">
Prices increase as more tokens are minted, preventing inflation while ensuring scarcity creates value for established data structures.
</p>
<div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '1rem' }}>
<span style={{ backgroundColor: 'var(--ifm-color-emphasis-100)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.875rem', color: 'var(--ifm-color-emphasis-700)' }}>Scarcity</span>
<span style={{ backgroundColor: 'var(--ifm-color-emphasis-100)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.875rem', color: 'var(--ifm-color-emphasis-700)' }}>Control</span>
</div>
</div>

<div className="uniform-card">
<h3 className="uniform-card-title">Economic Alignment</h3>
<p className="uniform-card-content">
Pricing automatically reflects the value of underlying assets, ensuring market mechanisms accurately represent the true worth of data and relationships.
</p>
<div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '1rem' }}>
<span style={{ backgroundColor: 'var(--ifm-color-emphasis-100)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.875rem', color: 'var(--ifm-color-emphasis-700)' }}>Value</span>
<span style={{ backgroundColor: 'var(--ifm-color-emphasis-100)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.875rem', color: 'var(--ifm-color-emphasis-700)' }}>Alignment</span>
</div>
</div>

</div>

## Summary

<div style={{ backgroundColor: 'var(--ifm-color-emphasis-50)', padding: '2rem', borderRadius: '12px', margin: '2rem 0', border: '1px solid var(--ifm-color-emphasis-200)' }}>
<p style={{ margin: '0 0 1rem 0', fontWeight: '600', color: 'var(--ifm-color-emphasis-900)', fontSize: '1.2rem' }}>Economic Vision</p>
<p style={{ margin: '0 0 1rem 0', fontSize: '1rem', color: 'var(--ifm-color-emphasis-800)', lineHeight: '1.6' }}>
By integrating these economic principles, Intuition creates a dynamic, decentralized ecosystem where users are continuously rewarded for valuable contributions, and the community naturally converges on high-quality, standardized data structures.
</p>
<p style={{ margin: 0, fontSize: '1rem', color: 'var(--ifm-color-emphasis-800)', lineHeight: '1.6' }}>
This economic framework ensures sustainable growth while maintaining the platform's security and reliability, creating a virtuous cycle of value creation and distribution that benefits all participants in the Intuition ecosystem.
</p>
</div> 