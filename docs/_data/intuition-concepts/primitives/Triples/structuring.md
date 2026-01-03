---
title: Triple Structuring  
sidebar_label: Structuring
sidebar_position: 2
description: Advanced techniques for structuring effective Triples in the knowledge graph
keywords: [triples, structuring, data modeling, semantic relationships, best practices]
---

# Triple Structuring

Understanding how to properly structure Triples is essential for building rich, queryable knowledge graphs. This guide covers techniques for creating well-designed semantic relationships.

## Basic Triple Structure

```json
{
  "id": "did:ethr:mainnet:0x...",
  "subject": "did:ethr:mainnet:0x...",
  "predicate": "did:ethr:mainnet:0x...",
  "object": "did:ethr:mainnet:0x...",
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
```json
{
  "subject": "did:ethr:mainnet:0x...", // Machine Learning
  "predicate": "did:ethr:mainnet:0x...", // is a subset of
  "object": "did:ethr:mainnet:0x...", // AI
  "type": "classification"
}
```

## Creating Triples Programmatically

### Using the SDK

```typescript
import { createAtomFromString, createTripleStatement } from '@0xintuition/sdk'
import { createPublicClient, createWalletClient, http } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { sepolia } from 'viem/chains'
import { getEthMultiVaultAddressFromChainId } from '@0xintuition/sdk'

// Configure viem clients
const account = privateKeyToAccount(process.env.PRIVATE_KEY as `0x${string}`)
const walletClient = createWalletClient({ account, chain: sepolia, transport: http() })
const publicClient = createPublicClient({ chain: sepolia, transport: http() })

// Get MultiVault address
const multivaultAddress = getEthMultiVaultAddressFromChainId(sepolia.id)

// Create a Triple
const result = await createTripleStatement(
  { walletClient, publicClient, address: multivaultAddress },
  subjectVaultId,
  predicateVaultId,
  objectVaultId
)
```

## Best Practices

### 1. Use Atomic Components
- Each component (subject, predicate, object) should be a focused Atom
- Avoid embedding complex data in individual components
- Leverage reusable Atoms for common concepts

### 2. Choose Clear Predicates
- Use widely understood relationship terms
- Be specific but not overly verbose
- Consider standardizing on common predicates

### 3. Maintain Consistency
- Follow naming conventions across related Triples
- Use consistent data types
- Align with community standards

### 4. Enable Composability
- Design Triples that can combine with others
- Consider how Triples might be queried together
- Think about nested Triple possibilities

---

## Next Steps

- [Nested Triples](./nested-triples) - Learn how to create meta-claims and context
- [Signal Fundamentals](../signals/fundamentals) - Understand how to validate Triples
