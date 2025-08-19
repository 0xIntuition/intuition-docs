---
id: the-economics
title: The Economics
sidebar_label: Overview
sidebar_position: 1
description: Understanding Intuition's economic model and incentives
---

# The Economics

Intuition uses a market-based system of fees and rewards to encourage valuable contributions and establish consensus around data structures. By offering economic incentives, the platform motivates users to adopt widely accepted identifiers and data formats.

:::note
To foster engagement and promote the creation of high-quality, standardized data, rewards favor creation and contribution interactions with data that is:

- **New or early**: First-mover advantages for valuable contributions
- **Useful to the most people**: Network effects drive value
- **Aligned with commonly accepted standards**: Convergence on best practices
- **Likely to be used in the future**: Forward-looking value assessment
:::

## Fees & Rewards

Because Intuition breaks data down into discrete, tokenized units, the system is aware of 'who owns what data' at any given point in time. Because of this, the system is able to programmatically flow value through data as it is interacted with.

To reward contributors of useful data, every interaction with the knowledge graph action in Intuition comes with a small fee, similar to gas fees in blockchain systems. Users pay a fee when interacting with or creating data. These fees go towards:

<div className="uniform-card-grid">

<div className="uniform-card">
<h3 className="uniform-card-title">Purchasing Equity in the Data</h3>
<p className="uniform-card-content">
When paying fees to create data, a portion of the fee goes towards purchasing equity in the underlying data. Thus, as users contribute data to the Intuition Graph, they receive ownership over the data created.
</p>
<div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '1rem' }}>
<span style={{ backgroundColor: 'var(--ifm-color-emphasis-100)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.875rem', color: 'var(--ifm-color-emphasis-700)' }}>Ownership</span>
<span style={{ backgroundColor: 'var(--ifm-color-emphasis-100)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.875rem', color: 'var(--ifm-color-emphasis-700)' }}>Equity</span>
</div>
</div>

<div className="uniform-card">
<h3 className="uniform-card-title">Rewarding Prior Contributors</h3>
<p className="uniform-card-content">
When paying fees to create or read data, part of the fee is distributed to all existing shareholders (prior contributors). This encourages early, meaningful contributions, as users who add valuable data will continue to be rewarded over time.
</p>
<div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '1rem' }}>
<span style={{ backgroundColor: 'var(--ifm-color-emphasis-100)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.875rem', color: 'var(--ifm-color-emphasis-700)' }}>Distribution</span>
<span style={{ backgroundColor: 'var(--ifm-color-emphasis-100)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.875rem', color: 'var(--ifm-color-emphasis-700)' }}>Rewards</span>
</div>
</div>

<div className="uniform-card">
<h3 className="uniform-card-title">Protocol Fees</h3>
<p className="uniform-card-content">
A small portion of the fee goes to the Intuition protocol, for future platform improvements. Upon launch of the Intuition token, the protocol will be a community-owned DAO, governed by token holders.
</p>
<div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '1rem' }}>
<span style={{ backgroundColor: 'var(--ifm-color-emphasis-100)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.875rem', color: 'var(--ifm-color-emphasis-700)' }}>Development</span>
<span style={{ backgroundColor: 'var(--ifm-color-emphasis-100)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.875rem', color: 'var(--ifm-color-emphasis-700)' }}>DAO</span>
</div>
</div>

</div>

## Reducing Fragmentation

In many systems, user-generated tags and classifications, known as **folksonomies**, can lead to fragmented and disorganized data. Different people might use different labels for the same thing, making it hard to gather or analyze information effectively. Intuition solves this by encouraging users to converge on a common set of identifiers.

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

Learn more about [Bonding Curves](./bonding-curves) and how they power Intuition's economic model.

## Token Economics

The Intuition token (INT) serves multiple purposes within the ecosystem:

<div className="uniform-card" style={{ marginBottom: '1.5rem' }}>
<h3 className="uniform-card-title">Platform Governance</h3>
<p className="uniform-card-content">
Community-driven decision making through decentralized voting mechanisms, ensuring the protocol evolves according to stakeholder consensus.
</p>
<div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '1rem' }}>
<span style={{ backgroundColor: 'var(--ifm-color-emphasis-100)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.875rem', color: 'var(--ifm-color-emphasis-700)' }}>Voting</span>
<span style={{ backgroundColor: 'var(--ifm-color-emphasis-100)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.875rem', color: 'var(--ifm-color-emphasis-700)' }}>Consensus</span>
</div>
</div>

<div className="uniform-card" style={{ marginBottom: '1.5rem' }}>
<h3 className="uniform-card-title">Fee Payments</h3>
<p className="uniform-card-content">
Reduced fees for token holders, providing economic benefits and encouraging long-term participation in the ecosystem.
</p>
<div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '1rem' }}>
<span style={{ backgroundColor: 'var(--ifm-color-emphasis-100)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.875rem', color: 'var(--ifm-color-emphasis-700)' }}>Discounts</span>
<span style={{ backgroundColor: 'var(--ifm-color-emphasis-100)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.875rem', color: 'var(--ifm-color-emphasis-700)' }}>Utility</span>
</div>
</div>

<div className="uniform-card" style={{ marginBottom: '1.5rem' }}>
<h3 className="uniform-card-title">Staking & Security</h3>
<p className="uniform-card-content">
Network security through economic incentives, where token holders can stake their tokens to secure the network and earn rewards.
</p>
<div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '1rem' }}>
<span style={{ backgroundColor: 'var(--ifm-color-emphasis-100)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.875rem', color: 'var(--ifm-color-emphasis-700)' }}>Security</span>
<span style={{ backgroundColor: 'var(--ifm-color-emphasis-100)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.875rem', color: 'var(--ifm-color-emphasis-700)' }}>Staking</span>
</div>
</div>

<div className="uniform-card" style={{ marginBottom: '1.5rem' }}>
<h3 className="uniform-card-title">Developer Incentives</h3>
<p className="uniform-card-content">
Rewards for building valuable applications and contributing to the ecosystem, fostering innovation and growth.
</p>
<div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '1rem' }}>
<span style={{ backgroundColor: 'var(--ifm-color-emphasis-100)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.875rem', color: 'var(--ifm-color-emphasis-700)' }}>Innovation</span>
<span style={{ backgroundColor: 'var(--ifm-color-emphasis-100)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.875rem', color: 'var(--ifm-color-emphasis-700)' }}>Rewards</span>
</div>
</div>

## Fee Structure

Our comprehensive fee model ensures sustainable platform operation while rewarding participants:

<div className="uniform-card-grid">

<div className="uniform-card">
<h3 className="uniform-card-title">Transaction Fees</h3>
<p className="uniform-card-content">
Small fees for data creation and interaction, similar to gas fees in blockchain systems, ensuring network sustainability.
</p>
<div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '1rem' }}>
<span style={{ backgroundColor: 'var(--ifm-color-emphasis-100)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.875rem', color: 'var(--ifm-color-emphasis-700)' }}>Creation</span>
<span style={{ backgroundColor: 'var(--ifm-color-emphasis-100)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.875rem', color: 'var(--ifm-color-emphasis-700)' }}>Interaction</span>
</div>
</div>

<div className="uniform-card">
<h3 className="uniform-card-title">Development Tools</h3>
<p className="uniform-card-content">
Premium tools and APIs for developers building advanced applications, providing enhanced functionality and support.
</p>
<div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '1rem' }}>
<span style={{ backgroundColor: 'var(--ifm-color-emphasis-100)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.875rem', color: 'var(--ifm-color-emphasis-700)' }}>APIs</span>
<span style={{ backgroundColor: 'var(--ifm-color-emphasis-100)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.875rem', color: 'var(--ifm-color-emphasis-700)' }}>Premium</span>
</div>
</div>

<div className="uniform-card">
<h3 className="uniform-card-title">Cross-Chain Operations</h3>
<p className="uniform-card-content">
Multi-network functionality fees for seamless operation across different blockchain networks and ecosystems.
</p>
<div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '1rem' }}>
<span style={{ backgroundColor: 'var(--ifm-color-emphasis-100)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.875rem', color: 'var(--ifm-color-emphasis-700)' }}>Multi-chain</span>
<span style={{ backgroundColor: 'var(--ifm-color-emphasis-100)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.875rem', color: 'var(--ifm-color-emphasis-700)' }}>Bridging</span>
</div>
</div>

<div className="uniform-card">
<h3 className="uniform-card-title">Premium Features</h3>
<p className="uniform-card-content">
Advanced features for power users, including enhanced analytics, priority support, and exclusive functionality.
</p>
<div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '1rem' }}>
<span style={{ backgroundColor: 'var(--ifm-color-emphasis-100)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.875rem', color: 'var(--ifm-color-emphasis-700)' }}>Analytics</span>
<span style={{ backgroundColor: 'var(--ifm-color-emphasis-100)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.875rem', color: 'var(--ifm-color-emphasis-700)' }}>Priority</span>
</div>
</div>

</div>

## Economic Security

The platform's economic security is ensured through multiple safeguards and mechanisms:

<div className="uniform-card-grid">

<div className="uniform-card">
<h3 className="uniform-card-title">Transparent Fee Allocation</h3>
<p className="uniform-card-content">
Clear distribution of collected fees with public accountability, ensuring all participants understand how value flows through the system.
</p>
<div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '1rem' }}>
<span style={{ backgroundColor: 'var(--ifm-color-emphasis-100)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.875rem', color: 'var(--ifm-color-emphasis-700)' }}>Transparency</span>
<span style={{ backgroundColor: 'var(--ifm-color-emphasis-100)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.875rem', color: 'var(--ifm-color-emphasis-700)' }}>Distribution</span>
</div>
</div>

<div className="uniform-card">
<h3 className="uniform-card-title">Controlled Token Emission</h3>
<p className="uniform-card-content">
Predictable and sustainable token supply mechanisms that prevent inflation while ensuring adequate liquidity for ecosystem growth.
</p>
<div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '1rem' }}>
<span style={{ backgroundColor: 'var(--ifm-color-emphasis-100)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.875rem', color: 'var(--ifm-color-emphasis-700)' }}>Supply</span>
<span style={{ backgroundColor: 'var(--ifm-color-emphasis-100)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.875rem', color: 'var(--ifm-color-emphasis-700)' }}>Predictable</span>
</div>
</div>

<div className="uniform-card">
<h3 className="uniform-card-title">Anti-Manipulation Measures</h3>
<p className="uniform-card-content">
Protection against gaming the system through sophisticated algorithms and monitoring that detect and prevent malicious behavior.
</p>
<div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '1rem' }}>
<span style={{ backgroundColor: 'var(--ifm-color-emphasis-100)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.875rem', color: 'var(--ifm-color-emphasis-700)' }}>Protection</span>
<span style={{ backgroundColor: 'var(--ifm-color-emphasis-100)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.875rem', color: 'var(--ifm-color-emphasis-700)' }}>Monitoring</span>
</div>
</div>

<div className="uniform-card">
<h3 className="uniform-card-title">Regular Economic Audits</h3>
<p className="uniform-card-content">
Ongoing assessment of economic health through independent audits and community review, ensuring long-term sustainability.
</p>
<div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '1rem' }}>
<span style={{ backgroundColor: 'var(--ifm-color-emphasis-100)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.875rem', color: 'var(--ifm-color-emphasis-700)' }}>Audits</span>
<span style={{ backgroundColor: 'var(--ifm-color-emphasis-100)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.875rem', color: 'var(--ifm-color-emphasis-700)' }}>Health</span>
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