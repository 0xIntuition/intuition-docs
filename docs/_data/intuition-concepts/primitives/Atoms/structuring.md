---
title: Atom Structuring
sidebar_label: Structuring
sidebar_position: 2
description: Advanced techniques for structuring Atoms effectively in the Intuition knowledge graph
keywords: [atoms, structuring, data design, granularity, best practices, modular design]
---

# Atom Structuring

Understanding how to properly structure Atoms is crucial for building effective applications on the Intuition protocol. This guide covers advanced techniques and patterns for creating well-designed, reusable Atoms.

## Design Principles: Atomic Granularity

:::tip The Power of Flat Data
A crucial best practice is keeping information modular and atomic. You are economically incentivized to create "flatter" Atoms – each representing a single, minimal concept – rather than packing composite information into one Atom.
:::

### Why Granularity Matters

Consider representing the statement: **"Tiger Research was founded in 2021"**

#### Monolithic Approach (Not Recommended)

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

#### Atomic Approach (Best Practice)

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

## Economic Incentives for Granularity

Intuition's economic model naturally guides users toward optimal granularity:

- **Reusable Atoms** accumulate more Signal as they're referenced in multiple Triples
- **High-Signal Atoms** attract more stakes, increasing their network gravity
- **Composite Atoms** with embedded data are less likely to be reused or staked
- **Modular Design** maximizes potential for community adoption and value accrual

## Atom Structure Components

### Basic Structure

An Atom consists of three core components:

1. **Decentralized Identifier (DID)** - Unique identifier for the atom
2. **Data Content** - The actual information being represented
3. **Metadata** - Additional context and properties

### Example Atom Structure

```json
{
  "id": "did:ethr:mainnet:0x3b0bc51ab9de1e5b7b6e34e5b960285805c41736",
  "data": {
    "type": "concept",
    "content": "Machine Learning",
    "description": "A subset of artificial intelligence that enables systems to learn and improve from experience",
    "tags": ["AI", "technology", "computing"]
  },
  "metadata": {
    "created": "2024-01-15T10:30:00Z",
    "creator": "did:ethr:mainnet:0x123...",
    "version": "1.0"
  }
}
```

## Atom Categories

### Concept Atoms
Represent abstract ideas, categories, or classifications.

```json
{
  "type": "concept",
  "content": "Blockchain Technology",
  "category": "technology"
}
```

### Entity Atoms
Represent specific people, places, or things.

```json
{
  "type": "entity",
  "content": "Ethereum",
  "category": "blockchain",
  "properties": {
    "founded": "2015",
    "creator": "Vitalik Buterin"
  }
}
```

### Attribute Atoms
Represent characteristics or properties.

```json
{
  "type": "attribute",
  "content": "Decentralized",
  "category": "property",
  "appliesTo": ["blockchain", "governance"]
}
```

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

## Creating Atoms Programmatically

### Using the SDK

```typescript
import {
  createAtomFromString,
  getEthMultiVaultAddressFromChainId,
} from '@0xintuition/sdk'
import { createPublicClient, createWalletClient, http } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { sepolia } from 'viem/chains'

// 1) Configure viem clients
const account = privateKeyToAccount(process.env.PRIVATE_KEY as `0x${string}`)
const walletClient = createWalletClient({ account, chain: sepolia, transport: http() })
const publicClient = createPublicClient({ chain: sepolia, transport: http() })

// 2) Resolve MultiVault address for the current chain
const multivaultAddress = getEthMultiVaultAddressFromChainId(sepolia.id)

// 3) Create an Atom from a simple string label
const result = await createAtomFromString(
  { walletClient, publicClient, address: multivaultAddress },
  'Machine Learning',
)

console.log('Created atom vaultId:', result.state.vaultId)
```

## Validation Guidelines

Ensure your atoms follow these validation rules:

- **Required Fields**: `id`, `data.content`, `metadata.created`
- **Content Length**: Minimum 1 character, maximum 10,000 characters
- **Tag Count**: Maximum 20 tags per atom
- **Metadata**: Must include creator DID and timestamp

## Atom Relationships

### Direct References
```json
{
  "content": "Deep Learning",
  "relatedAtoms": [
    "did:ethr:mainnet:0x...", // Machine Learning atom
    "did:ethr:mainnet:0x..."  // Neural Networks atom
  ]
}
```

### Hierarchical Structure
```json
{
  "content": "Artificial Intelligence",
  "children": [
    "did:ethr:mainnet:0x...", // Machine Learning
    "did:ethr:mainnet:0x..."  // Expert Systems
  ]
}
```

## Quality Guidelines

### Content Quality
- Ensure accuracy and verifiability
- Use clear, concise language
- Provide sufficient context
- Avoid redundant or duplicate atoms

### Technical Quality
- Follow proper DID standards
- Include comprehensive metadata
- Use consistent data formats
- Implement proper versioning

### Community Standards
- Respect intellectual property
- Avoid misleading or false information
- Contribute to the ecosystem's growth
- Engage with the community constructively

---

## Next Steps

- [Atom Best Practices](./best-practices) - Detailed guidelines for effective Atom design
- [Triple Fundamentals](../triples/fundamentals) - Learn how to connect Atoms into relationships
- [Signal Fundamentals](../signals/fundamentals) - Understand how to measure Atom usage and relevance
