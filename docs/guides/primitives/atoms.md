---
title: Atoms
sidebar_position: 2
---

# Atoms

Atoms are the foundational building blocks of Intuition's knowledge graph – the words in our global dictionary. Think of Intuition as a vast, collaborative dictionary where anyone can create a new word, and each word has its own globally persistent, unique digital identifier that can be used to reference it across the entire internet!

## Understanding Atoms

In the spirit of the Semantic Web and linked data, an Atom can correspond to virtually anything:

- **People**: User identities, profiles, public figures
- **Organizations**: Companies, DAOs, institutions, projects
- **Addresses**: Cryptocurrency wallets, smart contracts, validators
- **Documents**: Files, articles, research papers, certificates
- **Temporal markers**: Dates, timestamps, time periods
- **Categories**: Tags, classifications, taxonomies
- **Concepts**: Ideas, words, phrases, abstract notions

Each Atom's unique ID is deterministically generated based on its `atomData` field – meaning the same data will always produce the same Atom ID. This ensures that duplicate Atoms cannot be created for identical data, and anyone can independently verify an Atom's ID by hashing its data. This design makes Atoms act as a bridge between on-chain identifiers and the rich context of off-chain data – similar to how an NFT token ID might reference metadata stored elsewhere.

## Technical Architecture

### Core Structure

Under the hood, creating a new Atom mints a tokenized record using the ERC-1155 multi-token standard that includes:

1. **Unique Atom ID**: A permanent, immutable identifier deterministically derived from the atomData
2. **Atom Data**: Can contain any arbitrary data (URIs, text, JSON, references to external resources)
3. **Associated Smart Contract Wallet**: Enabling the Atom itself to own assets and interact with contracts

Every Atom carries `atomData` which can contain any arbitrary information relevant to that entity. For example:
- An Atom for "Solar Energy" might contain a link to a Wikipedia page about solar power
- An Atom for a user's identity might contain a DID document reference or profile JSON
- An Atom for a document might contain an IPFS content hash
- An Atom for a concept might contain a simple text string or structured JSON data

### Staking Vaults and Bonding Curves

Each Atom has one or more Vaults attached to it for staking. These vaults operate on a bonding curve, meaning:

- The cost to acquire a stake (or "share") in an Atom increases as more is already staked
- Early stakers get a larger stake for their investment
- Latecomers pay a premium for popular Atoms

This mechanism incentivizes early discovery of important Atoms and creates a form of priority signaling – the community collectively "bids up" the Atoms deemed valuable or relevant by risking capital in their vaults.

## The Problem Atoms Solve

### Universal Reference Standardization

Today's web is siloed – the same entity might be referred to in dozens of different ways across different platforms. Consider how many separate user accounts or content IDs one person might have across various sites.

Intuition's Atoms provide:
- A single, canonical identifier for each real-world thing
- Universal reusability across any application or user
- Easy reconciliation and trust of data from disparate sources
- Automatic deduplication through deterministic ID generation

By converging on a universal set of Atoms, every piece of data about Alice can point to the same Atom `[Alice]`, rather than being scattered across unlinked profiles. Since Atom IDs are deterministically generated from their data, if two users try to create an Atom with identical data, they'll generate the same ID – preventing duplicates at the protocol level.

### Market-Driven Ontology Management

While deterministic IDs prevent exact duplicates, similar concepts might still be represented with slightly different data (e.g., "DeFi" vs "Decentralized Finance"). The protocol employs Token Curated Registry (TCR) logic for these cases:

1. **Competition**: Users tend to stake on the Atom that others find more useful or legitimate
2. **Signal Accumulation**: One variant accrues more Signal and usage over time
3. **Natural Selection**: The preferred Atom wins out as the standard
4. **Economic Incentives**: Early backers of the "winning" Atom are rewarded through vault fees and token emissions

This market-driven approach, combined with deterministic ID generation, ensures the knowledge base converges on canonical representations while preventing exact duplicates.

## Design Principles: Atomic Granularity

### The Power of Flat Data

A crucial best practice is keeping information modular and atomic. You are economically incentivized to create "flatter" Atoms – each representing a single, minimal concept – rather than packing composite information into one Atom.

#### Why Granularity Matters

Consider representing the statement: **"Tiger Research was founded in 2021"**

**❌ Monolithic Approach** (Not Recommended):
```javascript
// One Atom containing all information
const statementAtom = {
  data: "Tiger Research was founded in 2021"
}
```

Problems with this approach:
- Hard to verify which part might be incorrect if disputed
- Cannot reuse individual components
- Difficult to update or correct specific elements
- Less composable with other data

**✅ Atomic Approach** (Best Practice):
```javascript
// Three separate Atoms
const tigerResearchAtom = { data: "Tiger Research" }
const foundedInAtom = { data: "founded in" }
const year2021Atom = { data: "2021" }

// Connected via a Triple
const foundingTriple = {
  subject: tigerResearchAtom,
  predicate: foundedInAtom,
  object: year2021Atom
}
```

Benefits of this approach:
- Each piece can be independently verified and traced
- Individual components are reusable (the `[2021]` Atom can be used in countless other triples)
- Corrections can be made to specific elements without discarding everything
- Trust accrued by each Atom benefits all its usages

### Economic Incentives for Granularity

Intuition's economic model naturally guides users toward optimal granularity:

- **Reusable Atoms** accumulate more Signal as they're referenced in multiple Triples
- **High-Signal Atoms** attract more $TRUST stakes, increasing their network gravity
- **Composite Atoms** with embedded data are less likely to be reused or staked
- **Modular Design** maximizes potential for community adoption and value accrual

## Flexibility and Scope

Atoms are not limited to static concepts. They can represent:

- **Dynamic entities**: User-generated content, evolving documents
- **Abstract concepts**: Tags, categories, classifications
- **Data structures**: JSON schemas, configuration templates
- **Content chunks**: Text snippets, code fragments (via IPFS CID)

Regardless of what an Atom represents, the principles remain consistent:
1. Give it a clear, unique identity
2. Include relevant data in the atomData field
3. Keep its scope narrow for maximum verifiability and reusability

## Best Practices

### Creating Effective Atoms

1. **Leverage Deterministic IDs**: Remember that identical atomData will always produce the same Atom ID
2. **Check for Similar Atoms**: Search for canonical Atoms before creating variations
3. **Use Clear Data**: Choose descriptive, unambiguous data values
4. **Maintain Single Purpose**: Each Atom should represent one thing
5. **Consider Reusability**: Design Atoms others will want to reference

### Atom Design Patterns

Think of Atoms as **words in the Intuition dictionary**:
- They are the lego-like pieces that snap into many contexts
- Community Signal concentrates on the words that matter most
- Triples form the "sentences" that connect these dictionary words together

### Integration with Triples

Atoms gain their true power when connected via Triples:
- **Subject Atoms**: The entity being described
- **Predicate Atoms**: The relationship or property
- **Object Atoms**: The value or target of the relationship

This separation allows each component to be independently verified, updated, and trusted.

## Practical Examples

### Identity Atom
```javascript
const aliceAtom = {
  atomData: "https://alice.id/profile.json",
  id: "atom_0x123...", // Deterministically generated from atomData
  vault: "0xabc...",
  signal: 1500
}
```

### Concept Atom
```javascript
const defiAtom = {
  atomData: {
    name: "DeFi",
    definition: "Decentralized Finance",
    reference: "ipfs://QmX.../defi-definition.json"
  },
  id: "atom_0x456...", // Deterministically generated from atomData
  vault: "0xdef...",
  signal: 8500
}
```

### Relationship Atom (Predicate)
```javascript
const expertInAtom = {
  atomData: "expertIn",
  id: "atom_0x789...", // Deterministically generated from "expertIn"
  vault: "0xghi...",
  signal: 3200
}
```

## Next Steps

With Atoms as your foundation, you can:
- Learn about [Triples](./triples) to create meaningful relationships between Atoms
- Explore [Signals](./signals) to understand attestation and trust mechanics
- Review [Vaults](./vaults) for staking and economic participation
- Check the [SDK Documentation](/docs/developer-tools/sdks/overview) for implementation details