---
id: overview
title: Overview
sidebar_label: Overview
sidebar_position: 1
description: Learn about Intuition's core concepts, architecture, and economic model
---

# Overview

<div style={{ backgroundColor: 'var(--ifm-color-emphasis-50)', padding: '2rem', borderRadius: '12px', marginBottom: '2rem' }}>
<p style={{ fontSize: '1.1rem', lineHeight: '1.7', margin: 0, color: 'var(--ifm-color-emphasis-700)' }}>
Intuition is building the world's first token-curated knowledge graph — a decentralized "trust layer" for the internet where information itself becomes an on-chain asset that users can own, stake on, and curate collectively.
</p>
</div>

## The Problem

In the digital age, we face critical challenges in how information is discovered, validated, and shared. Trust has become a centralized commodity controlled by platforms, leaving users without ownership or control over their data and reputation.

## The Vision

Intuition creates a more truthful and transparent web where trust is a shared, verifiable resource. We're building a future where:

<div style={{ display: 'flex', flexDirection: 'row', gap: '1.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>

<div style={{ border: '1px solid var(--ifm-color-emphasis-300)', borderRadius: '8px', padding: '1.5rem', backgroundColor: 'var(--ifm-background-color)', flex: '1', minWidth: '300px' }}>
<h4 style={{ marginTop: 0, marginBottom: '0.75rem', color: 'var(--ifm-color-primary)' }}>Cross-Platform Knowledge</h4>
<p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--ifm-color-emphasis-700)' }}>
People and organizations can prove and discover knowledge across apps and ecosystems
</p>
</div>

<div style={{ border: '1px solid var(--ifm-color-emphasis-300)', borderRadius: '8px', padding: '1.5rem', backgroundColor: 'var(--ifm-background-color)', flex: '1', minWidth: '300px' }}>
<h4 style={{ marginTop: 0, marginBottom: '0.75rem', color: 'var(--ifm-color-primary)' }}>Verifiable Claims</h4>
<p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--ifm-color-emphasis-700)' }}>
Social and factual claims are verifiable and incentive-aligned
</p>
</div>

<div style={{ border: '1px solid var(--ifm-color-emphasis-300)', borderRadius: '8px', padding: '1.5rem', backgroundColor: 'var(--ifm-background-color)', flex: '1', minWidth: '300px' }}>
<h4 style={{ marginTop: 0, marginBottom: '0.75rem', color: 'var(--ifm-color-primary)' }}>Developer Empowerment</h4>
<p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--ifm-color-emphasis-700)' }}>
Developers have the tools to build collaborative, data-rich applications
</p>
</div>

</div>

## What is Intuition?

<div style={{ backgroundColor: 'var(--ifm-color-emphasis-50)', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem' }}>
<p style={{ margin: 0, fontSize: '1rem', color: 'var(--ifm-color-emphasis-700)', lineHeight: '1.6' }}>
Intuition implements a universal semantic graph of knowledge that is machine-readable and capable of handling both objective facts and subjective opinions. Every piece of data — whether an identity, fact, or claim — is represented in a structured form on a unified network, where community members use economic incentives to signal which information is trustworthy and relevant.
</p>
</div>

This is achieved by assigning decentralized identifiers to everything — people, organizations, content, concepts — and organizing these identifiers into a global Knowledge Graph.

## Three Core Primitives

<div style={{ backgroundColor: 'var(--ifm-color-emphasis-50)', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem' }}>
<p style={{ margin: 0, fontSize: '1rem', color: 'var(--ifm-color-emphasis-700)', lineHeight: '1.6' }}>
Three fundamental primitives form the foundation of Intuition's knowledge graph, enabling anyone to make verifiable statements about anything and continuously curate their validity:
</p>
</div>

<div style={{ display: 'flex', flexDirection: 'row', gap: '1.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>

<div style={{ border: '2px solid var(--ifm-color-primary)', borderRadius: '12px', padding: '1.5rem', backgroundColor: 'var(--ifm-background-color)', flex: '1', minWidth: '300px' }}>
<h3 style={{ marginTop: 0, marginBottom: '0.75rem', color: 'var(--ifm-color-primary)' }}>⚛️ Atoms</h3>
<p style={{ fontSize: '0.95rem', color: 'var(--ifm-color-emphasis-700)', marginBottom: '1rem' }}>
Unique, persistent identifiers for any concept or entity — person, object, idea, or anything else. Think of them as "nodes" in the graph.
</p>
<ul style={{ margin: 0, paddingLeft: '1.5rem', fontSize: '0.9rem', color: 'var(--ifm-color-emphasis-600)' }}>
<li>Link to descriptive data via URI</li>
<li>Have associated on-chain vaults for staking</li>
<li>Act as universal canonical identifiers</li>
</ul>
</div>

<div style={{ border: '2px solid var(--ifm-color-primary)', borderRadius: '12px', padding: '1.5rem', backgroundColor: 'var(--ifm-background-color)', flex: '1', minWidth: '300px' }}>
<h3 style={{ marginTop: 0, marginBottom: '0.75rem', color: 'var(--ifm-color-primary)' }}>🔗 Triples</h3>
<p style={{ fontSize: '0.95rem', color: 'var(--ifm-color-emphasis-700)', marginBottom: '1rem' }}>
Structured claims or relationships between Atoms, expressed in subject-predicate-object format.
</p>
<ul style={{ margin: 0, paddingLeft: '1.5rem', fontSize: '0.9rem', color: 'var(--ifm-color-emphasis-600)' }}>
<li>Example: [Vitalik] – [founderOf] – [Ethereum]</li>
<li>Link three Atom IDs to make assertions</li>
<li>Create the "edges" in the knowledge graph</li>
</ul>
</div>

<div style={{ border: '2px solid var(--ifm-color-primary)', borderRadius: '12px', padding: '1.5rem', backgroundColor: 'var(--ifm-background-color)', flex: '1', minWidth: '300px' }}>
<h3 style={{ marginTop: 0, marginBottom: '0.75rem', color: 'var(--ifm-color-primary)' }}>📊 Signals</h3>
<p style={{ fontSize: '0.95rem', color: 'var(--ifm-color-emphasis-700)', marginBottom: '1rem' }}>
Measures of collective trust or importance attached to Atoms and Triples, derived from users' token stakes.
</p>
<ul style={{ margin: 0, paddingLeft: '1.5rem', fontSize: '0.9rem', color: 'var(--ifm-color-emphasis-600)' }}>
<li>Represents "who is attesting to what"</li>
<li>Shows community confidence levels</li>
<li>Provides the "weights" in the graph</li>
</ul>
</div>

</div>

## The Architecture

<div style={{ backgroundColor: 'var(--ifm-color-emphasis-50)', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem' }}>
<p style={{ margin: 0, fontSize: '1rem', color: 'var(--ifm-color-emphasis-700)', lineHeight: '1.6' }}>
Using these primitives, Intuition's smart contracts (leveraging standards like ERC-1155, ERC-4626, and ERC-4337) record Atoms, Triples, and Signals on-chain. The state of Intuition's ledger is essentially a graph consisting of:
</p>
</div>

<div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem', textAlign: 'center' }}>
<div style={{ padding: '1.5rem', backgroundColor: 'var(--ifm-color-primary)', color: 'white', borderRadius: '12px', fontSize: '1.1rem', fontWeight: 'bold' }}>
🔵 Things<br/><span style={{ fontSize: '0.9rem', fontWeight: 'normal' }}>(Atoms)</span>
</div>
<div style={{ padding: '1.5rem', backgroundColor: 'var(--ifm-color-primary)', color: 'white', borderRadius: '12px', fontSize: '1.1rem', fontWeight: 'bold' }}>
↔️ Relationships<br/><span style={{ fontSize: '0.9rem', fontWeight: 'normal' }}>(Triples)</span>
</div>
<div style={{ padding: '1.5rem', backgroundColor: 'var(--ifm-color-primary)', color: 'white', borderRadius: '12px', fontSize: '1.1rem', fontWeight: 'bold' }}>
⚖️ Weights<br/><span style={{ fontSize: '0.9rem', fontWeight: 'normal' }}>(Signals)</span>
</div>
</div>

This structured approach ensures data is **interoperable** across the web, **easily queryable**, and **resistant to manipulation**.

## The Information Market

<div style={{ backgroundColor: 'var(--ifm-color-emphasis-50)', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem' }}>
<p style={{ margin: 0, fontSize: '1rem', color: 'var(--ifm-color-emphasis-700)', lineHeight: '1.6' }}>
Intuition's "information market" model introduces game-theoretic incentives via the $TRUST token to reward users for contributing honest data and disputing false information. The result is a self-curating knowledge base — a global data layer of trust that applications, AI agents, and communities can all tap into for reliable information.
</p>
</div>

### The Trust Protocol

The protocol uses cryptoeconomic incentives to promote:

<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>

<div style={{ border: '1px solid var(--ifm-color-emphasis-300)', borderRadius: '8px', padding: '1.5rem', backgroundColor: 'var(--ifm-background-color)' }}>
<h4 style={{ marginTop: 0, marginBottom: '0.75rem', color: 'var(--ifm-color-primary)' }}>1. Useful Data Creation</h4>
<p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--ifm-color-emphasis-700)' }}>
Incentivize the creation of high-quality, valuable information that benefits the entire ecosystem.
</p>
</div>

<div style={{ border: '1px solid var(--ifm-color-emphasis-300)', borderRadius: '8px', padding: '1.5rem', backgroundColor: 'var(--ifm-background-color)' }}>
<h4 style={{ marginTop: 0, marginBottom: '0.75rem', color: 'var(--ifm-color-primary)' }}>2. Universal Identifiers</h4>
<p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--ifm-color-emphasis-700)' }}>
Convergence on universal canonical identifiers for all things across the knowledge graph.
</p>
</div>

<div style={{ border: '1px solid var(--ifm-color-emphasis-300)', borderRadius: '8px', padding: '1.5rem', backgroundColor: 'var(--ifm-background-color)' }}>
<h4 style={{ marginTop: 0, marginBottom: '0.75rem', color: 'var(--ifm-color-primary)' }}>3. Data Standards</h4>
<p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--ifm-color-emphasis-700)' }}>
Convergence on data standards, schemas, and formats for interoperability.
</p>
</div>

</div>

Intuition can be thought of as a consensus mechanism for the 'state of the state' of decentralized systems, allowing distributed consensus on the language spoken on top of the system—pursuing the realization of the Semantic Web.


## Who Should Use This Documentation

<div className="uniform-card-grid-small">

<div className="uniform-card">
<h4 className="uniform-card-title" style={{ fontSize: '1.1rem', marginBottom: '0.75rem' }}>New Users</h4>
<p className="uniform-card-content" style={{ fontSize: '0.9rem' }}>
Discover Intuition's Portal, create your first atoms and triples, and understand the knowledge graph ecosystem
</p>
</div>

<div className="uniform-card">
<h4 className="uniform-card-title" style={{ fontSize: '1.1rem', marginBottom: '0.75rem' }}>Developers</h4>
<p className="uniform-card-content" style={{ fontSize: '0.9rem' }}>
Build with our TypeScript SDK, GraphQL APIs, and smart contracts across multiple networks
</p>
</div>

<div className="uniform-card">
<h4 className="uniform-card-title" style={{ fontSize: '1.1rem', marginBottom: '0.75rem' }}>Partners</h4>
<p className="uniform-card-content" style={{ fontSize: '0.9rem' }}>
Integrate Intuition's decentralized knowledge graph into your applications and platforms
</p>
</div>

<div className="uniform-card">
<h4 className="uniform-card-title" style={{ fontSize: '1.1rem', marginBottom: '0.75rem' }}>Researchers</h4>
<p className="uniform-card-content" style={{ fontSize: '0.9rem' }}>
Access semantic data structures and explore the token-curated knowledge graph for analysis
</p>
</div>

<div className="uniform-card">
<h4 className="uniform-card-title" style={{ fontSize: '1.1rem', marginBottom: '0.75rem' }}>Content Creators</h4>
<p className="uniform-card-content" style={{ fontSize: '0.9rem' }}>
Contribute to the knowledge graph and build reputation through verifiable content creation
</p>
</div>

<div className="uniform-card">
<h4 className="uniform-card-title" style={{ fontSize: '1.1rem', marginBottom: '0.75rem' }}>Organizations</h4>
<p className="uniform-card-content" style={{ fontSize: '0.9rem' }}>
Implement trustless credential verification and reputation systems for your organization
</p>
</div>

</div>

## Quick Start Path

Choose your path to get started with Intuition's decentralized knowledge graph:

<div className="uniform-card-grid">

<a href="/docs/quickstart/speed-run-intuition" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
<div className="uniform-card clickable-card">
<h3 className="uniform-card-title">Speed Run Intuition</h3>
<p className="uniform-card-content">
Get up and running with Intuition quickly. A fast-paced guide to get you building with Intuition in minutes.
</p>
</div>
</a>

<a href="/docs/hub" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
<div className="uniform-card clickable-card">
<h3 className="uniform-card-title">Intuition Hub</h3>
<p className="uniform-card-content">
Access Intuition's L3 network tools and services. Explore the development environment with comprehensive tools.
</p>
</div>
</a>

<a href="/docs/developer-tools" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
<div className="uniform-card clickable-card">
<h3 className="uniform-card-title">Developer Tools</h3>
<p className="uniform-card-content">
Essential tools and resources for Intuition developers. Access SDKs, APIs, and development tools to build on Intuition.
</p>
</div>
</a>

</div>


### State of the Graph

<div style={{ backgroundColor: 'var(--ifm-color-emphasis-50)', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem' }}>
<p style={{ margin: 0, fontSize: '1rem', color: 'var(--ifm-color-emphasis-700)', lineHeight: '1.6' }}>
The Intuition system leverages a combination of on and off chain interactions to create, store, and manage data within the Intuition knowledge graph:
</p>
</div>

<div style={{ marginBottom: '2rem' }}>

  {/* Tab Navigation */}
  <div style={{
    display: 'flex',
    borderBottom: '1px solid var(--ifm-color-emphasis-200)',
    marginBottom: '1.5rem'
  }}>
    <button
      id="onchain-tab"
      className="state-tab active"
      style={{
        padding: '0.75rem 1.5rem',
        border: 'none',
        backgroundColor: 'transparent',
        cursor: 'pointer',
        fontSize: '1rem',
        fontWeight: '600',
        color: 'var(--ifm-color-primary)',
        borderBottom: '2px solid var(--ifm-color-primary)',
        marginRight: '2rem'
      }}
      onClick={() => {
        document.getElementById('onchain-content').style.display = 'block';
        document.getElementById('offchain-content').style.display = 'none';
        document.getElementById('onchain-tab').style.color = 'var(--ifm-color-primary)';
        document.getElementById('onchain-tab').style.borderBottom = '2px solid var(--ifm-color-primary)';
        document.getElementById('offchain-tab').style.color = 'var(--ifm-color-emphasis-600)';
        document.getElementById('offchain-tab').style.borderBottom = '2px solid transparent';
      }}
    >
      On-Chain State
    </button>
    <button
      id="offchain-tab"
      className="state-tab"
      style={{
        padding: '0.75rem 1.5rem',
        border: 'none',
        backgroundColor: 'transparent',
        cursor: 'pointer',
        fontSize: '1rem',
        fontWeight: '600',
        color: 'var(--ifm-color-emphasis-600)',
        borderBottom: '2px solid transparent'
      }}
      onClick={() => {
        document.getElementById('offchain-content').style.display = 'block';
        document.getElementById('onchain-content').style.display = 'none';
        document.getElementById('offchain-tab').style.color = 'var(--ifm-color-primary)';
        document.getElementById('offchain-tab').style.borderBottom = '2px solid var(--ifm-color-primary)';
        document.getElementById('onchain-tab').style.color = 'var(--ifm-color-emphasis-600)';
        document.getElementById('onchain-tab').style.borderBottom = '2px solid transparent';
      }}
    >
      Off-Chain State
    </button>
  </div>

  {/* On-Chain Content */}
  <div id="onchain-content" style={{ display: 'block' }}>
    <div style={{
      border: '1px solid var(--ifm-color-emphasis-200)',
      borderRadius: '12px',
      padding: '2rem',
      backgroundColor: 'var(--ifm-background-color)'
    }}>
      <h4 style={{ marginTop: 0, marginBottom: '1rem', color: 'var(--ifm-color-primary)', fontSize: '1.25rem' }}>
        On-Chain State Components
      </h4>
      <p style={{ margin: '0 0 1.5rem 0', fontSize: '1rem', color: 'var(--ifm-color-emphasis-700)', lineHeight: '1.6' }}>
        The on-chain state of Intuition is composed of the nodes, edges, and weights of the Intuition Graph:
      </p>
      <div style={{ display: 'grid', gap: '1rem' }}>
        <div style={{ padding: '1rem', backgroundColor: 'var(--ifm-color-emphasis-50)', borderRadius: '8px', border: '1px solid var(--ifm-color-emphasis-200)' }}>
          <h5 style={{ margin: '0 0 0.5rem 0', color: 'var(--ifm-color-primary)', fontSize: '1rem' }}>Atoms</h5>
          <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--ifm-color-emphasis-700)' }}>
            Point to any arbitrary URI, their associated Smart Contract Wallets, and their respective Vaults
          </p>
        </div>
        <div style={{ padding: '1rem', backgroundColor: 'var(--ifm-color-emphasis-50)', borderRadius: '8px', border: '1px solid var(--ifm-color-emphasis-200)' }}>
          <h5 style={{ margin: '0 0 0.5rem 0', color: 'var(--ifm-color-primary)', fontSize: '1rem' }}>Triples</h5>
          <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--ifm-color-emphasis-700)' }}>
            Composed of 3 Atoms with positive and negative Vaults for attestations For and Against
          </p>
        </div>
        <div style={{ padding: '1rem', backgroundColor: 'var(--ifm-color-emphasis-50)', borderRadius: '8px', border: '1px solid var(--ifm-color-emphasis-200)' }}>
          <h5 style={{ margin: '0 0 0.5rem 0', color: 'var(--ifm-color-primary)', fontSize: '1rem' }}>Signals</h5>
          <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--ifm-color-emphasis-700)' }}>
            Representative of 'who is attesting to what' through vault balances
          </p>
        </div>
        <div style={{ padding: '1rem', backgroundColor: 'var(--ifm-color-emphasis-50)', borderRadius: '8px', border: '1px solid var(--ifm-color-emphasis-200)' }}>
          <h5 style={{ margin: '0 0 0.5rem 0', color: 'var(--ifm-color-primary)', fontSize: '1rem' }}>Unified System State</h5>
          <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--ifm-color-emphasis-700)' }}>
            The nodes, edges, and weights of the knowledge graph
          </p>
        </div>
      </div>
    </div>
  </div>

  {/* Off-Chain Content */}
  <div id="offchain-content" style={{ display: 'none' }}>
    <div style={{
      border: '1px solid var(--ifm-color-emphasis-200)',
      borderRadius: '12px',
      padding: '2rem',
      backgroundColor: 'var(--ifm-background-color)'
    }}>
      <h4 style={{ marginTop: 0, marginBottom: '1rem', color: 'var(--ifm-color-primary)', fontSize: '1.25rem' }}>
        Off-Chain State Integration
      </h4>
      <div style={{ marginBottom: '1.5rem' }}>
        <p style={{ margin: '0 0 1rem 0', fontSize: '1rem', color: 'var(--ifm-color-emphasis-700)', lineHeight: '1.6' }}>
          All Atoms point to some arbitrary URI, meaning the on-chain state can represent any on-chain or off-chain data. This means Intuition can reference anything across the web—a Medium publication, a Spotify song, an IPFS CID, a Ceramic Stream, an ETH address—anything with an associated URI can be mapped on Intuition.
        </p>
      </div>

      <div style={{ backgroundColor: 'var(--ifm-color-emphasis-50)', padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--ifm-color-emphasis-200)', marginBottom: '1.5rem' }}>
        <h5 style={{ margin: '0 0 1rem 0', color: 'var(--ifm-color-primary)', fontSize: '1.1rem' }}>
          Intuition Backend
        </h5>
        <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--ifm-color-emphasis-700)', lineHeight: '1.6' }}>
          The Intuition Backend indexes both on-chain and off-chain state, unifying them into a singular, traversable knowledge graph that can be easily queried and replicated locally.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
        <div style={{ padding: '1rem', backgroundColor: 'var(--ifm-color-emphasis-50)', borderRadius: '8px', border: '1px solid var(--ifm-color-emphasis-200)' }}>
          <h6 style={{ margin: '0 0 0.5rem 0', color: 'var(--ifm-color-primary)', fontSize: '0.95rem' }}>Web Content</h6>
          <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--ifm-color-emphasis-700)' }}>
            Medium articles, websites, social media posts
          </p>
        </div>
        <div style={{ padding: '1rem', backgroundColor: 'var(--ifm-color-emphasis-50)', borderRadius: '8px', border: '1px solid var(--ifm-color-emphasis-200)' }}>
          <h6 style={{ margin: '0 0 0.5rem 0', color: 'var(--ifm-color-primary)', fontSize: '0.95rem' }}>Media Files</h6>
          <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--ifm-color-emphasis-700)' }}>
            Spotify tracks, videos, images, documents
          </p>
        </div>
        <div style={{ padding: '1rem', backgroundColor: 'var(--ifm-color-emphasis-50)', borderRadius: '8px', border: '1px solid var(--ifm-color-emphasis-200)' }}>
          <h6 style={{ margin: '0 0 0.5rem 0', color: 'var(--ifm-color-primary)', fontSize: '0.95rem' }}>Decentralized Storage</h6>
          <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--ifm-color-emphasis-700)' }}>
            IPFS CIDs, Ceramic Streams, Arweave links
          </p>
        </div>
        <div style={{ padding: '1rem', backgroundColor: 'var(--ifm-color-emphasis-50)', borderRadius: '8px', border: '1px solid var(--ifm-color-emphasis-200)' }}>
          <h6 style={{ margin: '0 0 0.5rem 0', color: 'var(--ifm-color-primary)', fontSize: '0.95rem' }}>Blockchain Addresses</h6>
          <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--ifm-color-emphasis-700)' }}>
            Ethereum addresses, smart contracts, ENS names
          </p>
        </div>
      </div>
    </div>
  </div>

</div>


## Learn More

<div style={{ backgroundColor: 'var(--ifm-color-emphasis-50)', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem' }}>
<p style={{ margin: '0 0 1rem 0', fontSize: '1rem', color: 'var(--ifm-color-emphasis-700)', lineHeight: '1.6' }}>
To understand the deeper vision and problems Intuition addresses, explore these essential pages:
</p>
</div>

<div className="uniform-card-grid">

<a href="/docs/introduction/why-intuition" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
<div className="uniform-card clickable-card">
<h3 className="uniform-card-title">Why Intuition?</h3>
<p className="uniform-card-content">
Understand the $200 trillion problem, Information Finance vision, and how Intuition rebuilds the internet's trust architecture.
</p>
</div>
</a>

<a href="/docs/introduction/the-economics" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
<div className="uniform-card clickable-card">
<h3 className="uniform-card-title">The Economics</h3>
<p className="uniform-card-content">
Explore Intuition's market-based system of fees and rewards, early adopter advantages, and how economic incentives drive consensus.
</p>
</div>
</a>

<a href="/docs/introduction/the-primitives" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
<div className="uniform-card clickable-card">
<h3 className="uniform-card-title">Primitives Deep Dive</h3>
<p className="uniform-card-content">
Technical details on how Atoms, Triples, and Signals work together to create structured, semantic data.
</p>
</div>
</a>

<a href="/docs/resources/key-terms" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
<div className="uniform-card clickable-card">
<h3 className="uniform-card-title">Key Terms</h3>
<p className="uniform-card-content">
Master the essential terminology and concepts that form the foundation of the Intuition ecosystem.
</p>
</div>
</a>

</div>