---
id: triples
title: Triples
sidebar_label: Triples
sidebar_position: 2
description: Understanding how to structure Triples in Intuition
---

# Triples

Triples are the fundamental way to create relationships between atoms in Intuition. They follow a subject-predicate-object structure that enables rich, interconnected knowledge graphs.

## What are Triples?

A triple consists of three atoms connected in a specific relationship:
- **Subject**: The entity being described
- **Predicate**: The relationship or property
- **Object**: The value or target of the relationship

## Basic Triple Structure

```json
{
  "id": "did:ethr:mainnet:0x...",
  "subject": "did:ethr:mainnet:0x...", // Subject atom
  "predicate": "did:ethr:mainnet:0x...", // Predicate atom
  "object": "did:ethr:mainnet:0x...", // Object atom
  "metadata": {
    "created": "2024-01-15T10:30:00Z",
    "creator": "did:ethr:mainnet:0x...",
    "confidence": 0.95
  }
}
```

## Triple Categories

### 1. Property Triples
Describe attributes or characteristics of entities.

**Example**: "Ethereum is decentralized"
- Subject: Ethereum atom
- Predicate: "is" atom
- Object: "decentralized" atom

```json
{
  "subject": "did:ethr:mainnet:0x...", // Ethereum
  "predicate": "did:ethr:mainnet:0x...", // is
  "object": "did:ethr:mainnet:0x...", // decentralized
  "type": "property"
}
```

### 2. Relationship Triples
Connect entities through specific relationships.

**Example**: "Vitalik Buterin created Ethereum"
- Subject: Vitalik Buterin atom
- Predicate: "created" atom
- Object: Ethereum atom

```json
{
  "subject": "did:ethr:mainnet:0x...", // Vitalik Buterin
  "predicate": "did:ethr:mainnet:0x...", // created
  "object": "did:ethr:mainnet:0x...", // Ethereum
  "type": "relationship"
}
```

### 3. Classification Triples
Establish hierarchical or categorical relationships.

**Example**: "Machine Learning is a subset of AI"
- Subject: Machine Learning atom
- Predicate: "is a subset of" atom
- Object: AI atom

```json
{
  "subject": "did:ethr:mainnet:0x...", // Machine Learning
  "predicate": "did:ethr:mainnet:0x...", // is a subset of
  "object": "did:ethr:mainnet:0x...", // AI
  "type": "classification"
}
```

## Creating Triples

### Using the SDK (copy‑paste ready)

```ts
import { createAtomFromString, createTripleStatement } from '@0xintuition/sdk'
import { createPublicClient, createWalletClient, http } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { sepolia } from 'viem/chains'
import { getEthMultiVaultAddressFromChainId } from '@0xintuition/sdk'

// 1) Configure viem clients (example uses Sepolia)
const account = privateKeyToAccount(process.env.PRIVATE_KEY as `0x${string}`)
const walletClient = createWalletClient({ account, chain: sepolia, transport: http() })
const publicClient = createPublicClient({ chain: sepolia, transport: http() })

// 2) MultiVault address for current chain
const multivaultAddress = getEthMultiVaultAddressFromChainId(sepolia.id)

// 3) Create three atoms
const a = await createAtomFromString({ walletClient, publicClient, address: multivaultAddress }, 'Ethereum')
const b = await createAtomFromString({ walletClient, publicClient, address: multivaultAddress }, 'is')
const c = await createAtomFromString({ walletClient, publicClient, address: multivaultAddress }, 'decentralized')

// 4) Create the triple (uses vaultIds from the created atoms)
const triple = await createTripleStatement(
  { walletClient, publicClient, address: multivaultAddress },
  { args: [a.state.vaultId, b.state.vaultId, c.state.vaultId] },
)

console.log('Created triple vaultId:', triple.state[0].vaultId)
```

### Validation Rules

- **Required Fields**: `subject`, `predicate`, `object`, `metadata.creator`
- **Unique Relationships**: Each subject-predicate-object combination should be unique
- **Valid Atoms**: All three components must be valid, existing atoms
- **Confidence Score**: Must be between 0 and 1

## Advanced Triple Patterns

### 1. Temporal Triples
Include time-based information.

```json
{
  "subject": "did:ethr:mainnet:0x...", // Ethereum
  "predicate": "did:ethr:mainnet:0x...", // launched in
  "object": "did:ethr:mainnet:0x...", // 2015
  "temporal": {
    "validFrom": "2015-07-30T00:00:00Z",
    "validTo": null
  }
}
```

### 2. Weighted Triples
Include confidence or weight information.

```json
{
  "subject": "did:ethr:mainnet:0x...", // Bitcoin
  "predicate": "did:ethr:mainnet:0x...", // is similar to
  "object": "did:ethr:mainnet:0x...", // Gold
  "weight": 0.85,
  "evidence": ["market behavior", "store of value"]
}
```

### 3. Contextual Triples
Include specific context or conditions.

```json
{
  "subject": "did:ethr:mainnet:0x...", // Python
  "predicate": "did:ethr:mainnet:0x...", // is popular for
  "object": "did:ethr:mainnet:0x...", // Machine Learning
  "context": {
    "domain": "programming",
    "timeframe": "2020-2024",
    "geographic": "global"
  }
}
```

## Triple Composition Patterns

### 1. Chain Composition
Connect multiple triples in a chain.

```
A → B → C → D
```

**Example**: "Ethereum is a blockchain" + "Blockchain is decentralized" → "Ethereum is decentralized"

### 2. Tree Composition
Create hierarchical structures.

```
        Root
       /    \
   Child1  Child2
   /    \     |
Leaf1  Leaf2 Leaf3
```

### 3. Graph Composition
Create complex interconnected networks.

```
A ←→ B ←→ C
↓    ↓    ↓
D ←→ E ←→ F
```

## Best Practices

### 1. Consistent Predicates
- Use standardized predicate atoms
- Maintain consistent terminology
- Avoid ambiguous relationships

### 2. Meaningful Relationships
- Ensure relationships add value
- Avoid redundant or obvious triples
- Focus on non-trivial connections

### 3. Quality Control
- Verify accuracy of relationships
- Include appropriate confidence scores
- Provide evidence when possible

### 4. Scalability
- Design for extensibility
- Consider performance implications
- Plan for complex queries

## Querying Triples

### Basic Queries (GraphQL)

```ts
import { configureClient, createServerClient, API_URL_DEV, GetTriplesDocument } from '@0xintuition/graphql'

configureClient({ apiUrl: API_URL_DEV })
const client = createServerClient({})

// Find triples where object label contains "decentralized"
const data = await client.request(GetTriplesDocument, {
  limit: 10,
  where: {
    object: { label: { _ilike: '%decentralized%' } },
  },
})

console.log(data.triples.length)
```

### Complex Queries (GraphQL)

```ts
import { configureClient, createServerClient, API_URL_DEV, GetTriplesDocument } from '@0xintuition/graphql'

configureClient({ apiUrl: API_URL_DEV })
const client = createServerClient({})

// Find AI subsets
const aiSubsets = await client.request(GetTriplesDocument, {
  limit: 20,
  where: {
    predicate: { label: { _ilike: '%is a subset of%' } },
    object: { label: { _ilike: '%AI%' } },
  },
})

console.log(aiSubsets.triples.length)
```

## Triple Analytics

### Usage Metrics
- **Frequency**: How often a triple is referenced
- **Confidence**: Average confidence score
- **Consensus**: Agreement level among contributors

### Network Analysis
- **Centrality**: Importance of atoms in the network
- **Clustering**: Groups of related atoms
- **Path Analysis**: Shortest paths between atoms

## Next Steps

Now that you understand how to structure triples, explore:

- [Capturing Signal](./capturing-signal.md) - Learn how to measure triple usage and relevance
- [Calculating Rewards](./calculating-rewards.md) - Discover how triple interactions generate rewards
- [Atoms](./atoms.md) - Review atom structure fundamentals
