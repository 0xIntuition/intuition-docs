---
title: Overview
sidebar_position: 1
---

import BrowserOnly from '@docusaurus/BrowserOnly';
import ExcalidrawViewer from '@site/src/components/ExcalidrawViewer';

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

### Atom Creation Process

<BrowserOnly fallback={<p>Loading diagram...</p>}>
  {() => <ExcalidrawViewer src="/excalidraw/atom-creation-diagram.excalidraw.json" zoom={0.3} scrollX={-150} scrollY={650} />}
</BrowserOnly>

## Explore More

Dive deeper into Atoms with these detailed guides:

- **[The Problem Atoms Solve](./problem-atoms-solve)**: Understand how Atoms enable universal reference standardization and market-driven ontology management
- **[Design Principles: Atomic Granularity](./design-principles)**: Learn why granularity matters and how to design effective, reusable Atoms
- **[Best Practices](./best-practices)**: Discover patterns and guidelines for creating high-quality Atoms
- **[Practical Examples](./practical-examples)**: See real-world examples of Identity, Concept, and Relationship Atoms

## Next Steps

With Atoms as your foundation, you can:
- Learn about [Triples](../triples) to create meaningful relationships between Atoms
- Explore [Signals](../signals) to understand attestation and trust mechanics
- Review [Vaults](../vaults) for staking and economic participation
- Check the [SDK Documentation](/docs/developer-tools/sdks/overview) for implementation details