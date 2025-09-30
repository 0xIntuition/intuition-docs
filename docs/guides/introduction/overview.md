---
id: overview
title: Overview
sidebar_label: Overview
sidebar_position: 1
description: Learn about Intuition's core concepts, architecture, and economic model
---

# Overview

## Intuition at a Glance

<div style={{ backgroundColor: 'var(--ifm-color-emphasis-50)', padding: '2rem', borderRadius: '12px', marginBottom: '2rem' }}>
<p style={{ fontSize: '1.25rem', lineHeight: '1.8', margin: '0 0 1rem 0', color: 'var(--ifm-color-emphasis-800)', fontWeight: '500' }}>
Intuition is a decentralized system that makes attestations viable as a meta for digital expression. 

A universal language for signed data.

Instead of information living as unstructured, siloed, minimally-attributable data in Web2 platforms, Intuition turns information into verifiable, tokenized, and portable objects that can flow across apps, chains, and agents.
</p>
<p style={{ fontSize: '1.1rem', lineHeight: '1.7', margin: 0, color: 'var(--ifm-color-emphasis-900)' }}>
<strong>The result is a Semantic Web of Trust, powered the world's first token-curated knowledge graph</strong> — a network where information isn't just stored, but structured, incentivized, and made usable for developers and AI systems alike — all while maintaining verifiable provenance and attribution.
</p>
</div>

---

## The Three Pillars of Intuition

<div style={{ display: 'grid', gap: '1.5rem', marginBottom: '2rem' }}>

<div style={{ borderLeft: '4px solid var(--ifm-color-primary)', padding: '1.5rem', backgroundColor: 'var(--ifm-color-emphasis-50)', borderRadius: '8px' }}>
<h3 style={{ marginTop: 0, marginBottom: '1rem', color: 'var(--ifm-color-primary)', fontSize: '1.3rem' }}>1. Intuition Network</h3>
<p style={{ fontSize: '1.05rem', color: 'var(--ifm-color-emphasis-900)', lineHeight: '1.7', marginBottom: '1rem' }}>
<strong>A custom Layer 3 blockchain</strong> settling to Base, built on Arbitrum Orbit with AnyTrust DA for scale and low-cost interactions — about 10,000 cheaper and 100x faster than most of the competition.
</p>
<ul style={{ margin: '0.75rem 0 0 0', paddingLeft: '1.5rem', fontSize: '0.95rem', color: 'var(--ifm-color-emphasis-800)', lineHeight: '1.6' }}>
<li>Every attestation, Atom, and Triple is written onchain.</li>
<li>Bonding curves give each piece of knowledge its own market, turning information into an economic primitive.</li>
<li>This is the settlement layer: where all attestations live and accrue value.</li>
</ul>
</div>

<div style={{ borderLeft: '4px solid var(--ifm-color-primary)', padding: '1.5rem', backgroundColor: 'var(--ifm-color-emphasis-50)', borderRadius: '8px' }}>
<h3 style={{ marginTop: 0, marginBottom: '1rem', color: 'var(--ifm-color-primary)', fontSize: '1.3rem' }}>2. Intuition Protocol</h3>
<p style={{ fontSize: '1.05rem', color: 'var(--ifm-color-emphasis-900)', lineHeight: '1.7', marginBottom: '1rem' }}>
<strong>The rules and logic</strong> for how knowledge is represented and monetized.
</p>
<ul style={{ margin: '0.75rem 0 0 0', paddingLeft: '1.5rem', fontSize: '0.95rem', color: 'var(--ifm-color-emphasis-800)', lineHeight: '1.6' }}>
  <li><strong>Decentralized Identifiers (DIDs):</strong> Anyone can create a new decentralized identifier — for a person, concept, object, or anything else — permissionlessly.</li>
  <li><strong>Economics Drive Convergence:</strong> While identifiers can be created freely, bonding curves and token incentives encourage communities to converge on shared canonical Atoms, so that concepts can be referenced consistently and universally across the internet.</li>
  <li><strong>Consensus on Standards:</strong> Intuition leverages cryptoeconomic consensus mechanisms for the "state of the state" of its ledger — incentivizing convergence on consensus data schemas, structures, and relationships. This ensures that as the knowledge graph grows, it becomes more interoperable, not less.</li>
</ul>
<p style={{ fontSize: '0.95rem', color: 'var(--ifm-color-emphasis-800)', lineHeight: '1.6', marginTop: '1rem' }}>
The Protocol is the <em>grammar of programmable attestations</em> — a universal language for expressing who said what, about what, at what time, and with what conviction.
</p>
</div>

<div style={{ borderLeft: '4px solid var(--ifm-color-primary)', padding: '1.5rem', backgroundColor: 'var(--ifm-color-emphasis-50)', borderRadius: '8px' }}>
<h3 style={{ marginTop: 0, marginBottom: '1rem', color: 'var(--ifm-color-primary)', fontSize: '1.3rem' }}>3. Rust Subnet</h3>
<p style={{ fontSize: '1.05rem', color: 'var(--ifm-color-emphasis-900)', lineHeight: '1.7', marginBottom: '1rem' }}>
<strong>A high-performance indexing and query layer</strong> built for developers.
</p>
<ul style={{ margin: '0.75rem 0 0 0', paddingLeft: '1.5rem', fontSize: '0.95rem', color: 'var(--ifm-color-emphasis-800)', lineHeight: '1.6' }}>
<li>Real-time APIs for reading/writing attestations.</li>
<li>GraphQL and TypeScript SDKs for quick integration.</li>
<li>Local replication options for privacy and speed.</li>
</ul>
<p style={{ fontSize: '0.95rem', color: 'var(--ifm-color-emphasis-800)', lineHeight: '1.6', marginTop: '1rem' }}>
The Subnet turns raw attestations into actionable intelligence, powering AI agents, decentralized apps, and enterprise systems.
</p>
</div>

</div>

---

## Core Primitives

<div style={{ display: 'grid', gap: '1.5rem', marginBottom: '2rem' }}>

<div style={{ border: '1px solid var(--ifm-color-emphasis-300)', borderRadius: '12px', padding: '1.5rem', backgroundColor: 'var(--ifm-background-color)' }}>
<h3 style={{ marginTop: 0, marginBottom: '1rem', color: 'var(--ifm-color-primary)' }}>⚛️ Atoms — Identifiers for Entities</h3>
<p style={{ fontSize: '0.95rem', color: 'var(--ifm-color-emphasis-900)', marginBottom: '1rem', lineHeight: '1.6' }}>
Unique, persistent identifiers for any concept or entity — person, object, idea, or anything else. Think of them as the "nodes" in the knowledge graph, or the 'words' of the Intuition dictionary.
</p>
<ul style={{ margin: 0, paddingLeft: '1.5rem', fontSize: '0.9rem', color: 'var(--ifm-color-emphasis-800)' }}>
<li>Anyone can create them permissionlessly</li>
<li>Have associated on-chain vaults with bonding curves</li>
<li>Economics drive convergence to canonical versions</li>
</ul>
</div>

<div style={{ border: '1px solid var(--ifm-color-emphasis-300)', borderRadius: '12px', padding: '1.5rem', backgroundColor: 'var(--ifm-background-color)' }}>
<h3 style={{ marginTop: 0, marginBottom: '1rem', color: 'var(--ifm-color-primary)' }}>🔗 Triples — Structured Attestations</h3>
<p style={{ fontSize: '0.95rem', color: 'var(--ifm-color-emphasis-900)', marginBottom: '1rem', lineHeight: '1.6' }}>
Claims expressed in subject-predicate-object format, creating the relationships and semantic layer of the knowledge graph. The 'sentences' of the Intuition system, with words composed together into higher-order expressions.
</p>
<ul style={{ margin: 0, paddingLeft: '1.5rem', fontSize: '0.9rem', color: 'var(--ifm-color-emphasis-800)' }}>
<li>Example: [Vitalik] – [founderOf] – [Ethereum]</li>
<li>Link three Atom IDs to make assertions</li>
<li>Support both positive and negative attestations</li>
<li>Form the "edges" connecting nodes in the graph</li>
<li>Triples can be used as Atoms in other Triples, allowing for arbitrarily-complex expression</li>
</ul>
</div>

<div style={{ border: '1px solid var(--ifm-color-emphasis-300)', borderRadius: '12px', padding: '1.5rem', backgroundColor: 'var(--ifm-background-color)' }}>
<h3 style={{ marginTop: 0, marginBottom: '1rem', color: 'var(--ifm-color-primary)' }}>📊 Signals — Economic Confidence</h3>
<p style={{ fontSize: '0.95rem', color: 'var(--ifm-color-emphasis-900)', marginBottom: '1rem', lineHeight: '1.6' }}>
Tokenized stakes that weight attestations with economic confidence, incentivizing the creation of many-to-one attestations that are better capable of accommodating subjective information.
</p>
<ul style={{ margin: 0, paddingLeft: '1.5rem', fontSize: '0.9rem', color: 'var(--ifm-color-emphasis-800)' }}>
<li>Represents "who is attesting to what"</li>
<li>Shows collective confidence levels</li>
<li>Creates economic skin in the game</li>
<li>Provides the "weights" in the graph</li>
</ul>
</div>

</div>

---

## How It Fits Together

<div style={{ backgroundColor: 'var(--ifm-color-emphasis-50)', padding: '2rem', borderRadius: '12px', marginBottom: '2rem' }}>
<ul style={{ fontSize: '1.05rem', lineHeight: '1.8', color: 'var(--ifm-color-emphasis-900)', marginBottom: '1.5rem' }}>
<li><strong>Network</strong> — the blockchain settlement layer for attestations.</li>
<li><strong>Protocol</strong> — the primitives, identifiers, and incentive systems that keep knowledge aligned.</li>
<li><strong>Subnet</strong> — the developer-facing layer that makes data usable in real time.</li>
</ul>

<p style={{ fontSize: '1.05rem', lineHeight: '1.7', marginBottom: '1.5rem', color: 'var(--ifm-color-emphasis-900)' }}>
Together, they form the rails of a programmable knowledge economy where:
</p>

<ul style={{ fontSize: '0.95rem', lineHeight: '1.7', color: 'var(--ifm-color-emphasis-800)', margin: 0 }}>
<li><strong>Identifiers are decentralized</strong> — anyone can mint them.</li>
<li><strong>Standards are incentivized</strong> — economics converge toward canonical versions.</li>
<li><strong>Interoperability compounds</strong> — consensus ensures the system speaks one language.</li>
<li><strong>Attestations carry weight</strong> — verifiable, portable, and economically backed.</li>
</ul>
</div>

---

## Why This Matters for Developers

<div style={{ backgroundColor: 'var(--ifm-color-primary)', color: 'white', padding: '2rem', borderRadius: '12px', marginBottom: '2rem' }}>
<p style={{ fontSize: '1.2rem', lineHeight: '1.7', marginBottom: '1.5rem', fontWeight: 'bold' }}>
Building on Intuition means you don't have to reinvent trust, identity, or data models from scratch.
</p>
<p style={{ fontSize: '1.05rem', lineHeight: '1.7', marginBottom: '0' }}>
Attestations and identifiers give you:
</p>
</div>

<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>

<div style={{ padding: '1.5rem', backgroundColor: 'var(--ifm-color-emphasis-50)', borderRadius: '8px', borderLeft: '4px solid var(--ifm-color-primary)' }}>
<h4 style={{ marginTop: 0, marginBottom: '0.75rem', color: 'var(--ifm-color-primary)' }}>
💾 Memory
</h4>
<p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--ifm-color-emphasis-900)', lineHeight: '1.6' }}>
Agents and apps don't start from zero; they inherit context.
</p>
</div>

<div style={{ padding: '1.5rem', backgroundColor: 'var(--ifm-color-emphasis-50)', borderRadius: '8px', borderLeft: '4px solid var(--ifm-color-primary)' }}>
<h4 style={{ marginTop: 0, marginBottom: '0.75rem', color: 'var(--ifm-color-primary)' }}>
🔐 Trust
</h4>
<p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--ifm-color-emphasis-900)', lineHeight: '1.6' }}>
Every claim is signed, staked, and auditable.
</p>
</div>

<div style={{ padding: '1.5rem', backgroundColor: 'var(--ifm-color-emphasis-50)', borderRadius: '8px', borderLeft: '4px solid var(--ifm-color-primary)' }}>
<h4 style={{ marginTop: 0, marginBottom: '0.75rem', color: 'var(--ifm-color-primary)' }}>
🎯 Alignment
</h4>
<p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--ifm-color-emphasis-900)', lineHeight: '1.6' }}>
Incentives built into the data layer itself.
</p>
</div>

<div style={{ padding: '1.5rem', backgroundColor: 'var(--ifm-color-emphasis-50)', borderRadius: '8px', borderLeft: '4px solid var(--ifm-color-primary)' }}>
<h4 style={{ marginTop: 0, marginBottom: '0.75rem', color: 'var(--ifm-color-primary)' }}>
🌐 Portability
</h4>
<p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--ifm-color-emphasis-900)', lineHeight: '1.6' }}>
Your users' context and reputation follow them across apps.
</p>
</div>

<div style={{ padding: '1.5rem', backgroundColor: 'var(--ifm-color-emphasis-50)', borderRadius: '8px', borderLeft: '4px solid var(--ifm-color-primary)' }}>
<h4 style={{ marginTop: 0, marginBottom: '0.75rem', color: 'var(--ifm-color-primary)' }}>
🔌 Interoperability
</h4>
<p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--ifm-color-emphasis-900)', lineHeight: '1.6' }}>
Shared identifiers and standards mean your app plugs into a larger ecosystem by default.
</p>
</div>

</div>

<p style={{ fontSize: '1.1rem', lineHeight: '1.7', color: 'var(--ifm-color-emphasis-900)', textAlign: 'center', fontWeight: 'bold' }}>
Intuition provides the foundation. You build the apps, agents, and experiences that bring it to life.
</p>

