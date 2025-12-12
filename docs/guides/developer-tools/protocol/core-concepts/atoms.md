---
title: Atoms
sidebar_label: Atoms
sidebar_position: 1
description: Understanding atoms - the fundamental building blocks of the Intuition knowledge graph
keywords: [atoms, entities, identities, term, vault, protocol]
---

# Atoms

**Atoms** are the fundamental building blocks of the Intuition knowledge graph. Each atom represents a unique entity, identity, or concept stored on-chain with a permanent identifier.

## What is an Atom?

An atom is a discrete piece of data that can represent:

- **People**: Ethereum addresses, social profiles, real-world identities
- **Organizations**: Companies, DAOs, projects
- **Concepts**: Tags, categories, ideas
- **Content**: Documents, images, URIs

Every atom is identified by:
- **Term ID**: A unique 32-byte identifier (bytes32)
- **URI**: The data or reference stored in the atom (hex-encoded)
- **Creator Atom ID**: The atom representing the creator's identity

## Atom Structure

When you query an atom, you receive:

```typescript
const atom = await multiVaultGetAtom(
  { address, publicClient },
  { args: [atomId] }
)
// Returns: [id, termData, creatorAtomId]
```

- **`id`**: The atom's unique identifier (bytes32)
- **`termData`**: The URI or data stored in the atom (bytes)
- **`creatorAtomId`**: The atom ID of the creator

## Creating Atoms

### Basic Creation

Each atom has a base creation cost (protocol fee):

```typescript
import {
  multiVaultGetAtomCost,
  multiVaultCreateAtoms,
  eventParseAtomCreated,
} from '@0xintuition/protocol'
import { toHex } from 'viem'

// 1. Get atom creation cost
const atomCost = await multiVaultGetAtomCost({ address, publicClient })

// 2. Create atom
const atomUri = toHex('ethereum:0x1234...5678')
const txHash = await multiVaultCreateAtoms(
  { address, walletClient, publicClient },
  {
    args: [[atomUri], [atomCost]],
    value: atomCost,
  }
)

// 3. Get atom ID from events
const events = await eventParseAtomCreated(publicClient, txHash)
const atomId = events[0].args.termId
```

### Creation with Initial Deposit

You can optionally deposit additional assets when creating an atom:

```typescript
import { parseEther } from 'viem'

const atomCost = await multiVaultGetAtomCost({ address, publicClient })
const initialDeposit = parseEther('0.1')
const totalAssets = atomCost + initialDeposit

const txHash = await multiVaultCreateAtoms(
  { address, walletClient, publicClient },
  {
    args: [[atomUri], [totalAssets]],
    value: totalAssets,
  }
)
```

## Atom URIs

Atom URIs are hex-encoded strings that can represent various types of data:

### Ethereum Address

```typescript
import { toHex } from 'viem'

const atomUri = toHex('ethereum:0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb')
```

### IPFS Content

```typescript
const atomUri = toHex('ipfs://QmX7fZqXjY8kF3Z...')
```

### Plain Text

```typescript
const atomUri = toHex('TypeScript')
```

### JSON-LD Entity

```typescript
const entity = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Alice',
}
const atomUri = toHex(JSON.stringify(entity))
```

## Atom Vaults

Every atom has an associated **vault** that holds deposited assets:

```typescript
// The atom ID is also the vault ID
const vaultId = atomId

// Check vault details
const vault = await multiVaultGetVault(
  { address, publicClient },
  { args: [vaultId] }
)
```

Users can deposit into an atom's vault to signal support:

```typescript
import { multiVaultDeposit } from '@0xintuition/protocol'

const depositAmount = parseEther('1')
const curveId = 1 // LinearCurve

const txHash = await multiVaultDeposit(
  { address, walletClient, publicClient },
  {
    args: [
      account.address, // receiver
      atomId,          // vault ID
      curveId,         // bonding curve
      0n,              // min shares (slippage protection)
    ],
    value: depositAmount,
  }
)
```

## Atom Types

### Identity Atoms

Atoms representing on-chain identities (Ethereum addresses):

```typescript
const identityUri = toHex('ethereum:0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb')
```

### Thing Atoms

Atoms representing JSON-LD entities:

```typescript
const thing = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Acme Inc',
}
const thingUri = toHex(JSON.stringify(thing))
```

### Content Atoms

Atoms referencing external content:

```typescript
const ipfsUri = toHex('ipfs://QmX7fZqXjY8kF3Z...')
```

## Atom Creation Cost

The protocol charges a base fee to create atoms:

```typescript
const cost = await multiVaultGetAtomCost({ address, publicClient })
// Returns: bigint (in wei)
```

This cost can be configured by the protocol admin via atom configuration:

```typescript
import { multiVaultGetAtomConfig } from '@0xintuition/protocol'

const config = await multiVaultGetAtomConfig({ address, publicClient })
// Returns: {
//   atomUriMaxLength,
//   atomCreationProtocolFee,
//   atomCost,
//   atomWalletInitialDepositAmount
// }
```

## Checking if an Atom Exists

Before creating an atom, check if it already exists:

```typescript
import { multiVaultIsTermCreated } from '@0xintuition/protocol'

const atomUri = toHex('TypeScript')
const exists = await multiVaultIsTermCreated(
  { address, publicClient },
  { args: [atomUri] }
)

if (exists) {
  console.log('Atom already exists')
}
```

## Common Use Cases

### Creating Identity Atoms

```typescript
// Create an atom for an Ethereum address
const address = '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb'
const atomUri = toHex(`ethereum:${address}`)

const txHash = await multiVaultCreateAtoms(
  { address: multiVaultAddress, walletClient, publicClient },
  {
    args: [[atomUri], [atomCost]],
    value: atomCost,
  }
)
```

### Creating Tag Atoms

```typescript
// Create tag atoms for categorization
const tags = ['TypeScript', 'React', 'Web3']

const atomUris = tags.map(tag => toHex(tag))
const costs = Array(tags.length).fill(atomCost)
const totalCost = atomCost * BigInt(tags.length)

const txHash = await multiVaultCreateAtoms(
  { address: multiVaultAddress, walletClient, publicClient },
  {
    args: [atomUris, costs],
    value: totalCost,
  }
)
```

### Creating Content Atoms

```typescript
// Create an atom referencing IPFS content
const ipfsCid = 'QmX7fZqXjY8kF3Z...'
const atomUri = toHex(`ipfs://${ipfsCid}`)

const txHash = await multiVaultCreateAtoms(
  { address: multiVaultAddress, walletClient, publicClient },
  {
    args: [[atomUri], [atomCost]],
    value: atomCost,
  }
)
```

## Related Functions

- [multiVaultCreateAtoms](/docs/guides/developer-tools/protocol/api-reference/multivault/atoms#multivaultcreateatoms) - Create one or more atoms
- [multiVaultGetAtom](/docs/guides/developer-tools/protocol/api-reference/multivault/atoms#multivaultgetatom) - Query atom details
- [multiVaultGetAtomCost](/docs/guides/developer-tools/protocol/api-reference/multivault/atoms#multivaultgetatomcost) - Get creation cost
- [multiVaultIsTermCreated](/docs/guides/developer-tools/protocol/api-reference/multivault/vault-queries#multivaultistermcreated) - Check if atom exists

## Next Steps

- [Triples](/docs/guides/developer-tools/protocol/core-concepts/triples) - Connect atoms with statements
- [Vaults](/docs/guides/developer-tools/protocol/core-concepts/vaults) - Understand atom vaults and deposits
- [API Reference](/docs/guides/developer-tools/protocol/api-reference/multivault/atoms) - Explore atom functions

## See Also

- [SDK: Create Atoms](/docs/guides/developer-tools/sdk/atoms/create-from-string) - Higher-level atom creation API
- [Core Concepts: Atoms](/docs/guides/core-concepts/primitives/atoms/fundamentals) - Conceptual overview of atoms
- [GraphQL: Query Atoms](/docs/guides/developer-tools/graphql-api/queries/atoms/single-atom) - Query atom data after creation
