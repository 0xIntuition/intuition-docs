---
id: atoms
title: Atoms
sidebar_label: Atoms
sidebar_position: 1
description: Understanding how to structure Atoms in Intuition
---

# Atoms

Atoms are the fundamental building blocks of data in Intuition. Understanding how to properly structure atoms is crucial for building effective applications on the protocol.

## What are Atoms?

Atoms represent discrete, manageable pieces of information that can be referenced and combined across the web. Each atom is uniquely identified by a decentralized identifier (DID) and contains structured data that can be of any type or format.

## Structuring Atoms

### Basic Structure

An atom consists of three core components:

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

## Best Practices for Atom Structure

### 1. Clear and Descriptive Content

- Use precise, unambiguous language
- Include sufficient context for understanding
- Avoid overly complex or nested structures

### 2. Consistent Naming Conventions

- Use camelCase for property names
- Maintain consistent terminology across related atoms
- Follow established domain conventions

### 3. Proper Metadata

- Always include creation timestamps
- Specify the creator's DID
- Include version information for mutable atoms

### 4. Scalable Design

- Design atoms to be composable
- Consider future extensibility
- Maintain backward compatibility

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

## Creating Atoms Programmatically

### Using the SDK (copy‑paste ready)

```ts
import {
  createAtomFromString,
  getEthMultiVaultAddressFromChainId,
} from '@0xintuition/sdk'
import { createPublicClient, createWalletClient, http } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { sepolia } from 'viem/chains'

// 1) Configure viem clients (example uses Sepolia)
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

### Validation

Ensure your atoms follow these validation rules:

- **Required Fields**: `id`, `data.content`, `metadata.created`
- **Content Length**: Minimum 1 character, maximum 10,000 characters
- **Tag Count**: Maximum 20 tags per atom
- **Metadata**: Must include creator DID and timestamp

## Atom Relationships

Atoms can be related to each other through various mechanisms:

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

## Next Steps

Now that you understand how to structure atoms, explore:

- [Triples](./triples.md) - Learn how to connect atoms into meaningful relationships
- [Capturing Signal](./capturing-signal.md) - Understand how to measure atom usage and relevance
- [Calculating Rewards](./calculating-rewards.md) - Discover how atom interactions generate rewards
