---
title: Glossary
sidebar_label: Glossary
sidebar_position: 3
description: Key terms and definitions for Intuition
---

# Glossary

Comprehensive glossary of key terms used in Intuition documentation.

## A

### Atom

A unique decentralized identifier for any entity, concept, or piece of data. Atoms are the fundamental building blocks of the knowledge graph.

**See:** [Atoms Fundamentals](/docs/concepts/primitives/atoms/fundamentals)

**Example:** An atom representing "TypeScript" or an Ethereum address "0x742d35..."

### Attestation

A verifiable claim or statement made on-chain using triples. Attestations can be supported or opposed through signals (staking).

**See:** [Triples Fundamentals](/docs/concepts/primitives/triples/fundamentals)

**Example:** `[Alice] [endorses] [Bob]` is an attestation that Alice endorses Bob.

### AnyTrust DA

Arbitrum's data availability solution that provides a trust-minimized alternative to standard rollup data availability. Uses a committee of trusted parties.

**See:** [Network Architecture](/docs/network)

## B

### Bonding Curve

A mathematical function that determines the price of vault shares based on supply. As more people stake, the price increases proportionally.

**See:** [Bonding Curves](/docs/concepts/economics/bonding-curves)

**Formula:** `price = k * supply^n` (where k and n are constants)

### Bridge

A smart contract system that allows transferring assets between different blockchain networks. Intuition uses a bridge to connect testnet to Base Sepolia.

**See:** [Bridge Documentation](/docs/network/testnet/bridge)

## C

### Counter-Triple

A triple that opposes or contradicts another triple. Used for expressing disagreement or alternative views in the knowledge graph.

**Example:**
- Triple: `[Contract A] [is safe] [true]`
- Counter: `[Contract A] [is safe] [false]`

**See:** [Triple Operations](/docs/developer-tools/sdk/triples-guide)

### Creator Fee

A fee paid to the creator of an atom or triple when others interact with it. Incentivizes quality contributions.

**See:** [Fees & Rewards](/docs/concepts/economics/fees-and-rewards)

## D

### DID (Decentralized Identifier)

A W3C standard for decentralized, self-sovereign identities. Intuition atoms can serve as DIDs for entities.

**See:** [Architecture](/docs/concepts/architecture/system-design)

**Format:** `did:intuition:<vault-id>`

### Deposit

The act of staking assets into a vault to signal support for an atom or triple. Returns vault shares representing ownership.

**See:** [Vaults Guide](/docs/developer-tools/sdk/vaults-guide)

## E

### Epoch

A time period used for calculating rewards and fees. Epochs help coordinate economic activity and batch operations.

**See:** [Protocol Epochs](/docs/developer-tools/protocol/core-concepts/epochs)

**Duration:** Configurable by protocol (e.g., 1 day, 1 week)

### EVM (Ethereum Virtual Machine)

The runtime environment for smart contracts on Ethereum and compatible chains. Intuition is EVM-compatible.

**See:** [Network Architecture](/docs/network)

## F

### Fee Structure

The system of fees charged for creating atoms, triples, and vault operations. Fees are distributed to various stakeholders including creators, protocol, and stakers.

**See:** [Fees & Rewards](/docs/concepts/economics/fees-and-rewards)

**Fee types:**
- Entry fees (when staking)
- Exit fees (when unstaking)
- Protocol fees
- Creator fees

## G

### GraphQL

A query language for APIs that allows clients to request exactly the data they need. Intuition provides a GraphQL API for querying the knowledge graph.

**See:** [GraphQL API](/docs/developer-tools/graphql-api/getting-started/quickstart)

## I

### IPFS (InterPlanetary File System)

Decentralized storage protocol for content-addressed data. Atoms can reference IPFS content by CID (Content Identifier).

**See:** [Creating from IPFS](/docs/developer-tools/sdk/atoms-guide#creating-from-ipfs)

**Example CID:** `QmXnnyufdzAWL5CqZ2RnSNgPbvCc1ALT73s6epPrRnZ1Xy`

## K

### Knowledge Graph

The interconnected network of atoms (nodes) and triples (edges) forming Intuition's decentralized data layer. Represents structured knowledge and relationships.

**See:** [What is a Knowledge Graph?](/docs/concepts/primitives/knowledge-graphs)

## L

### Layer 3 (L3)

A blockchain built on top of a Layer 2 solution. Intuition is an L3 built on Base using Arbitrum Orbit technology.

**See:** [Network Architecture](/docs/network)

## M

### MultiVault

The core smart contract that manages all atoms, triples, and vaults in Intuition. Acts as the central registry and vault factory.

**See:** [MultiVault API](/docs/developer-tools/protocol/api-reference/multivault/atoms)

**Functions:**
- Create atoms and triples
- Manage vault deposits/withdrawals
- Track fees and rewards

## N

### Nested Triple

A triple that uses another triple as one of its components (subject, predicate, or object), enabling complex, multi-layered expressions.

**See:** [Nested Triples](/docs/concepts/primitives/triples/nested-triples)

**Example:** `[Alice] [endorses] [[Bob has skill TypeScript]]`

This states "Alice endorses the claim that Bob has skill TypeScript"

### Node

A server that runs the Intuition indexing software, providing local access to the knowledge graph database and GraphQL API.

**See:** [Running a Node](/docs/network/node/overview)

## O

### Object

The third component of a triple—what is being claimed about the subject. Can be an atom ID or another triple ID.

**Example:** In `[Alice] [knows] [Bob]`, "Bob" is the object.

**See:** [Triples Fundamentals](/docs/concepts/primitives/triples/fundamentals)

## P

### Predicate

The middle component of a triple that defines the relationship between subject and object.

**Examples:** "knows", "has skill", "is member of", "endorses"

**See:** [Triples Fundamentals](/docs/concepts/primitives/triples/fundamentals)

### Protocol Fee

A fee collected by the Intuition protocol on various operations, used for protocol development and sustainability.

**See:** [Fees & Rewards](/docs/concepts/economics/fees-and-rewards)

## R

### RDF (Resource Description Framework)

A W3C standard for describing resources and their relationships. Intuition's triple format is compatible with RDF principles.

**See:** [Semantic Web Standards](/docs/concepts/architecture/semantic-web)

### Redemption

The act of withdrawing staked assets from a vault by burning vault shares. Subject to exit fees.

**See:** [Vaults Guide](/docs/developer-tools/sdk/vaults-guide)

## S

### Signal

The weight of trust or conviction expressed through staking on atoms or triples. Higher signals indicate stronger community support.

**See:** [Signals Fundamentals](/docs/concepts/primitives/signals/fundamentals)

**Measured by:** Total value staked in vault

### Semantic Triple

A structured claim in [Subject]-[Predicate]-[Object] format, following RDF/semantic web standards.

**See:** [Triples Fundamentals](/docs/concepts/primitives/triples/fundamentals)

**Standard form:** `[Subject Atom] [Predicate Atom] [Object Atom]`

### Subject

The first component of a triple—the entity being described or making a claim.

**Example:** In `[Alice] [knows] [Bob]`, "Alice" is the subject.

**See:** [Triples Fundamentals](/docs/concepts/primitives/triples/fundamentals)

## T

### Token-Curated Graph (TCG)

Intuition's economic model where token staking curates and validates knowledge. Economic incentives align with truth and quality.

**See:** [Incentive Design](/docs/concepts/economics/incentive-design)

### Triple

A structured statement connecting three atoms in Subject-Predicate-Object format. The fundamental unit of claims in Intuition.

**See:** [Triples Fundamentals](/docs/concepts/primitives/triples/fundamentals)

**Format:** `[Subject] [Predicate] [Object]`

### TRUST

The native token of Intuition Network, used for staking, governance, and paying gas fees.

**See:** [Tokenomics](/docs/concepts/economics/tokenomics)

**Symbol:** $TRUST (mainnet), $tTRUST (testnet)

## V

### Vault

An on-chain smart contract holding staked assets for a specific atom or triple. Each atom/triple has its own isolated vault.

**See:** [Vaults Guide](/docs/developer-tools/sdk/vaults-guide)

**Functions:**
- Hold staked assets
- Issue vault shares
- Distribute fees and rewards
- Track total value locked

### Vault ID

The unique identifier for a vault, derived from the corresponding atom or triple ID. Used to reference vaults in contracts and APIs.

**See:** [MultiVault API](/docs/developer-tools/protocol/api-reference/multivault/atoms)

### Vault Shares

Tokens representing ownership in a vault's assets. Issued when depositing, burned when redeeming. Value increases as fees accumulate.

**See:** [Vaults Guide](/docs/developer-tools/sdk/vaults-guide)

## W

### Wrapped Trust

A tokenized representation of staked TRUST in a vault, making staked positions transferable as ERC-20 tokens.

**See:** [Wrapped Trust API](/docs/developer-tools/protocol/api-reference/wrapped-trust/overview)

**Use cases:**
- Transfer staked positions
- Use as collateral
- Trade on DEXs

---

## Not Finding a Term?

Check these resources:
- **[FAQ](/docs/resources/faq)** - Common questions
- **[Community Support](/docs/resources/community-and-support)** - Ask the community
- **[Core Concepts](/docs/concepts/primitives/overview)** - In-depth explanations
- **[Discord](https://discord.gg/intuition)** - Real-time help
