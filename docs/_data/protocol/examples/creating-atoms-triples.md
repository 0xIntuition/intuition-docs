---
title: Creating Atoms & Triples
sidebar_label: Creating Atoms & Triples
sidebar_position: 1
description: Complete examples for creating atoms and triples
keywords: [examples, atoms, triples, creation, workflow]
---

# Creating Atoms & Triples

Complete workflows for creating atoms and triples with the Protocol package.

## Example 1: Create a Simple Atom

```typescript
import {
  intuitionTestnet,
  getMultiVaultAddressFromChainId,
  multiVaultCreateAtoms,
  multiVaultGetAtomCost,
  multiVaultGetAtom,
  eventParseAtomCreated,
} from '@0xintuition/protocol'
import { createPublicClient, createWalletClient, http, toHex } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'

// 1. Setup clients
const account = privateKeyToAccount('0x...')
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

// 2. Get atom creation cost
const atomCost = await multiVaultGetAtomCost({ address, publicClient })
console.log('Atom cost:', formatEther(atomCost))

// 3. Create atom
const atomUri = toHex('TypeScript Programming Language')
const txHash = await multiVaultCreateAtoms(
  { address, walletClient, publicClient },
  {
    args: [[atomUri], [atomCost]],
    value: atomCost,
  }
)

console.log('Transaction:', txHash)

// 4. Parse events to get atom ID
const events = await eventParseAtomCreated(publicClient, txHash)
const atomId = events[0].args.termId
console.log('Created atom ID:', atomId)

// 5. Query atom details
const atom = await multiVaultGetAtom(
  { address, publicClient },
  { args: [atomId] }
)
console.log('Atom URI:', hexToString(atom[1]))
```

## Example 2: Create Atom with Initial Deposit

```typescript
import { parseEther, formatEther } from 'viem'

// Get atom cost
const atomCost = await multiVaultGetAtomCost({ address, publicClient })

// Add initial deposit to support the atom
const initialDeposit = parseEther('0.1')
const totalAssets = atomCost + initialDeposit

console.log('Atom cost:', formatEther(atomCost))
console.log('Initial deposit:', formatEther(initialDeposit))
console.log('Total:', formatEther(totalAssets))

// Create atom with deposit
const atomUri = toHex('ethereum:0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb')
const txHash = await multiVaultCreateAtoms(
  { address, walletClient, publicClient },
  {
    args: [[atomUri], [totalAssets]],
    value: totalAssets,
  }
)

// Parse both atom and deposit events
const atomEvents = await eventParseAtomCreated(publicClient, txHash)
const depositEvents = await eventParseDeposited(publicClient, txHash)

console.log('Atom ID:', atomEvents[0].args.termId)
console.log('Shares received:', formatEther(depositEvents[0].args.shares))
```

## Example 3: Create Multiple Atoms

```typescript
// Create multiple atoms in one transaction
const atoms = [
  'TypeScript',
  'React',
  'Viem',
  'Intuition',
]

const atomUris = atoms.map(name => toHex(name))
const atomCost = await multiVaultGetAtomCost({ address, publicClient })
const costs = Array(atoms.length).fill(atomCost)
const totalCost = atomCost * BigInt(atoms.length)

const txHash = await multiVaultCreateAtoms(
  { address, walletClient, publicClient },
  {
    args: [atomUris, costs],
    value: totalCost,
  }
)

// Get all created atom IDs
const events = await eventParseAtomCreated(publicClient, txHash)
const atomIds = events.map(e => e.args.termId)

console.log('Created atom IDs:', atomIds)

// Store mapping for later use
const atomMap = atoms.reduce((map, name, i) => {
  map[name] = atomIds[i]
  return map
}, {})

console.log('Atom mapping:', atomMap)
```

## Example 4: Create a Triple (Statement)

```typescript
import {
  multiVaultGetTripleCost,
  multiVaultCreateTriples,
  eventParseTripleCreated,
  multiVaultGetTriple,
} from '@0xintuition/protocol'

// Assume we have atoms: Alice, follows, Bob
const subjectId = '0x1234...' // Alice
const predicateId = '0x2345...' // follows
const objectId = '0x3456...' // Bob

// Get triple cost
const tripleCost = await multiVaultGetTripleCost({ address, publicClient })

// Create triple
const txHash = await multiVaultCreateTriples(
  { address, walletClient, publicClient },
  {
    args: [
      [subjectId],
      [predicateId],
      [objectId],
      [tripleCost],
    ],
    value: tripleCost,
  }
)

// Parse triple created event
const events = await eventParseTripleCreated(publicClient, txHash)
const tripleId = events[0].args.tripleId

console.log('Created triple ID:', tripleId)

// Query triple details
const triple = await multiVaultGetTriple(
  { address, publicClient },
  { args: [tripleId] }
)

console.log('Triple:', {
  id: triple[0],
  subject: triple[1],
  predicate: triple[2],
  object: triple[3],
  counterVault: triple[4],
})
```

## Example 5: Complete Workflow - Create Atoms Then Triple

```typescript
import { hexToString } from 'viem'

// Step 1: Create the constituent atoms
const atomNames = ['Alice', 'follows', 'Bob']
const atomUris = atomNames.map(name => toHex(name))
const atomCost = await multiVaultGetAtomCost({ address, publicClient })
const atomCosts = Array(3).fill(atomCost)
const totalAtomCost = atomCost * 3n

const atomTxHash = await multiVaultCreateAtoms(
  { address, walletClient, publicClient },
  {
    args: [atomUris, atomCosts],
    value: totalAtomCost,
  }
)

// Get atom IDs
const atomEvents = await eventParseAtomCreated(publicClient, atomTxHash)
const [aliceId, followsId, bobId] = atomEvents.map(e => e.args.termId)

console.log('Created atoms:', { aliceId, followsId, bobId })

// Step 2: Create the triple
const tripleCost = await multiVaultGetTripleCost({ address, publicClient })
const deposit = tripleCost + parseEther('0.05') // Add support deposit

const tripleTxHash = await multiVaultCreateTriples(
  { address, walletClient, publicClient },
  {
    args: [[aliceId], [followsId], [bobId], [deposit]],
    value: deposit,
  }
)

// Get triple ID
const tripleEvents = await eventParseTripleCreated(publicClient, tripleTxHash)
const tripleId = tripleEvents[0].args.tripleId

console.log('Created triple:', {
  id: tripleId,
  statement: 'Alice follows Bob',
})

// Step 3: Verify the triple
const triple = await multiVaultGetTriple(
  { address, publicClient },
  { args: [tripleId] }
)

const subject = await multiVaultGetAtom({ address, publicClient }, { args: [triple[1]] })
const predicate = await multiVaultGetAtom({ address, publicClient }, { args: [triple[2]] })
const object = await multiVaultGetAtom({ address, publicClient }, { args: [triple[3]] })

console.log('Verified statement:', {
  subject: hexToString(subject[1]),
  predicate: hexToString(predicate[1]),
  object: hexToString(object[1]),
})
```

## Example 6: Check Before Creating

```typescript
import { multiVaultIsTermCreated } from '@0xintuition/protocol'

// Function to create atom only if it doesn't exist
const createAtomIfNotExists = async (atomUri: string) => {
  const uriHex = toHex(atomUri)

  // Check if atom already exists
  const exists = await multiVaultIsTermCreated(
    { address, publicClient },
    { args: [uriHex] }
  )

  if (exists) {
    console.log(`Atom "${atomUri}" already exists`)
    return null
  }

  // Create the atom
  const atomCost = await multiVaultGetAtomCost({ address, publicClient })
  const txHash = await multiVaultCreateAtoms(
    { address, walletClient, publicClient },
    {
      args: [[uriHex], [atomCost]],
      value: atomCost,
    }
  )

  const events = await eventParseAtomCreated(publicClient, txHash)
  const atomId = events[0].args.termId

  console.log(`Created atom "${atomUri}" with ID:`, atomId)
  return atomId
}

// Usage
const atomId = await createAtomIfNotExists('My Unique Atom')
```

## See Also

- [Atom Functions](/docs/guides/developer-tools/protocol/api-reference/multivault/atoms)
- [Triple Functions](/docs/guides/developer-tools/protocol/api-reference/multivault/triples)
- [Atoms Fundamentals](/docs/guides/concepts/primitives/atoms/fundamentals)
- [Triples Fundamentals](/docs/guides/concepts/primitives/triples/fundamentals)
