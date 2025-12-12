---
title: Quick Start
sidebar_label: Quick Start
sidebar_position: 3
description: Create your first atom and triple with the Intuition SDK in minutes
keywords: [sdk, quick start, tutorial, atom, triple, create, example]
---

# Quick Start

Get started with the Intuition SDK by creating your first atom and triple in minutes.

## Overview

In this quick start guide, you'll:

1. Set up the SDK clients
2. Create an atom from a string
3. Create a triple (subject-predicate-object statement)
4. Query atom details

## Prerequisites

- [Installed the SDK](./installation.md)
- Have a wallet with testnet TRUST tokens ([get testnet tokens](https://testnet.faucet.intuition.systems))
- Your wallet private key

## Step 1: Set Up Clients

Create a new file and set up your Viem clients:

```typescript title="quickstart.ts"
import {
  intuitionTestnet,
  getMultiVaultAddressFromChainId,
  createAtomFromString,
  createTripleStatement,
  getAtomDetails,
} from '@0xintuition/sdk'
import { createPublicClient, createWalletClient, http, parseEther } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'

// Setup account and clients
const account = privateKeyToAccount('0xYOUR_PRIVATE_KEY')

const publicClient = createPublicClient({
  chain: intuitionTestnet,
  transport: http(),
})

const walletClient = createWalletClient({
  chain: intuitionTestnet,
  transport: http(),
  account,
})

const address = getMultiVaultAddressFromChainId(intuitionTestnet.id)
```

## Step 2: Create Your First Atom

Create an atom from a simple string:

```typescript
// Create an atom
const atom = await createAtomFromString(
  { walletClient, publicClient, address },
  'TypeScript',
  parseEther('0.01') // Optional: initial deposit of 0.01 TRUST
)

console.log('Created atom!')
console.log('Atom ID:', atom.state.termId)
console.log('Transaction:', atom.transactionHash)
console.log('URI:', atom.uri)
```

Expected output:

```
Created atom!
Atom ID: 0x1234567890abcdef...
Transaction: 0xabcdef1234567890...
URI: TypeScript
```

## Step 3: Query Atom Details

Fetch the atom details from the Intuition API:

```typescript
// Wait a moment for indexing
await new Promise(resolve => setTimeout(resolve, 2000))

// Query atom details
const details = await getAtomDetails(atom.state.termId)

console.log('Atom Details:')
console.log('- Label:', details.label)
console.log('- Creator:', details.creator)
console.log('- Vault Assets:', details.vault.totalShares)
```

## Step 4: Create a Triple

Create a triple (statement) connecting three atoms:

```typescript
// Create three atoms
const alice = await createAtomFromString(
  { walletClient, publicClient, address },
  'Alice'
)

const follows = await createAtomFromString(
  { walletClient, publicClient, address },
  'follows'
)

const bob = await createAtomFromString(
  { walletClient, publicClient, address },
  'Bob'
)

// Create triple: "Alice follows Bob"
const triple = await createTripleStatement(
  { walletClient, publicClient, address },
  {
    args: [
      [alice.state.termId],    // subjects
      [follows.state.termId],  // predicates
      [bob.state.termId],      // objects
      [parseEther('0.1')],     // deposit per triple
    ],
    value: parseEther('0.1'),  // total transaction value
  }
)

console.log('Created triple!')
console.log('Triple ID:', triple.state[0].args.tripleId)
console.log('Transaction:', triple.transactionHash)
```

## Complete Example

Here's the complete quick start script:

```typescript title="quickstart.ts"
import {
  intuitionTestnet,
  getMultiVaultAddressFromChainId,
  createAtomFromString,
  createTripleStatement,
  getAtomDetails,
} from '@0xintuition/sdk'
import { createPublicClient, createWalletClient, http, parseEther } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'

async function main() {
  // Setup
  const account = privateKeyToAccount(process.env.PRIVATE_KEY as `0x${string}`)

  const publicClient = createPublicClient({
    chain: intuitionTestnet,
    transport: http(),
  })

  const walletClient = createWalletClient({
    chain: intuitionTestnet,
    transport: http(),
    account,
  })

  const address = getMultiVaultAddressFromChainId(intuitionTestnet.id)

  // Create an atom
  console.log('Creating atom...')
  const atom = await createAtomFromString(
    { walletClient, publicClient, address },
    'TypeScript',
    parseEther('0.01')
  )

  console.log('✓ Atom created:', atom.state.termId)

  // Wait for indexing
  await new Promise(resolve => setTimeout(resolve, 2000))

  // Query details
  const details = await getAtomDetails(atom.state.termId)
  console.log('✓ Atom label:', details.label)

  // Create three atoms for a triple
  console.log('\nCreating atoms for triple...')
  const alice = await createAtomFromString(
    { walletClient, publicClient, address },
    'Alice'
  )
  const follows = await createAtomFromString(
    { walletClient, publicClient, address },
    'follows'
  )
  const bob = await createAtomFromString(
    { walletClient, publicClient, address },
    'Bob'
  )

  // Create triple
  console.log('Creating triple...')
  const triple = await createTripleStatement(
    { walletClient, publicClient, address },
    {
      args: [
        [alice.state.termId],
        [follows.state.termId],
        [bob.state.termId],
        [parseEther('0.1')],
      ],
      value: parseEther('0.1'),
    }
  )

  console.log('✓ Triple created:', triple.state[0].args.tripleId)
  console.log('\nSuccess! You created your first atom and triple.')
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Error:', error)
    process.exit(1)
  })
```

## Run the Example

```bash
# Set your private key
export PRIVATE_KEY=0xYOUR_PRIVATE_KEY

# Run the script
npx tsx quickstart.ts
```

## Understanding the Code

### Atoms

Atoms are the fundamental entities in Intuition. They can represent:

- Simple strings (`"TypeScript"`)
- Ethereum addresses (`"0x1234..."`)
- IPFS content (`"ipfs://bafkreib..."`)
- Rich entities (JSON-LD objects)

### Triples

Triples connect atoms in subject-predicate-object relationships:

- **Subject**: The atom being described (`Alice`)
- **Predicate**: The relationship type (`follows`)
- **Object**: The target atom (`Bob`)

### Deposits

Each atom and triple has a vault for deposits:

- Depositing increases your stake in an entity
- You receive shares based on a bonding curve
- Shares can be redeemed later for assets

## Next Steps

Now that you've created your first atom and triple, explore:

### Atom Operations
- [**Create from Thing**](../atoms/create-from-thing.md) - Create rich entities with metadata
- [**Create from Ethereum Account**](../atoms/create-from-ethereum-account.md) - Create identity atoms
- [**Batch Creation**](../atoms/batch-creation.md) - Create multiple atoms efficiently

### Triple Operations
- [**Querying Triples**](../triples/querying.md) - Fetch triple details
- [**Counter Triples**](../triples/counter-triples.md) - Work with opposing positions

### Vault Operations
- [**Deposits**](../vaults/deposits.md) - Deposit into vaults
- [**Redemptions**](../vaults/redemptions.md) - Redeem shares

### Search & Discovery
- [**Global Search**](../search/global-search.md) - Search across all entities
- [**Semantic Search**](../search/advanced-queries.md) - Find similar content

## Common Issues

### Transaction Reverts

If your transaction reverts, check:

1. You have sufficient TRUST balance
2. The atoms exist before creating a triple
3. The deposit amount is greater than 0

### Indexing Delays

The Intuition API may take a few seconds to index new entities. Add a delay before querying:

```typescript
await new Promise(resolve => setTimeout(resolve, 2000))
```

### Network Errors

Ensure you're connected to the correct network:

```typescript
console.log('Network:', intuitionTestnet.name)
console.log('Chain ID:', intuitionTestnet.id)
```

## See Also

- [Core Concepts](../../../core-concepts/primitives/overview.md) - Understand atoms and triples
- [SDK Examples](../examples/create-atom-from-string.md) - More detailed examples
- [GraphQL Queries](../../graphql-api/queries/atoms/single-atom.md) - Query protocol data
