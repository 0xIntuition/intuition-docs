---
title: "Example: Find Existing Entities"
sidebar_label: Find Existing Entities
sidebar_position: 8
description: Search for existing atoms and triples before creating new ones
keywords: [sdk, example, search, find, atoms, triples, exists]
---

# Example: Find Existing Entities

This example demonstrates how to find existing atoms and triples to avoid creating duplicates.

## Complete Code

```typescript
import {
  intuitionTestnet,
  getMultiVaultAddressFromChainId,
  findAtomIds,
  findTripleIds,
  calculateAtomId,
  calculateTripleId,
  createAtomFromString,
  createTripleStatement,
} from '@0xintuition/sdk'
import { createPublicClient, createWalletClient, http, parseEther } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import type { Hex } from 'viem'

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

  // 1. Find existing atoms
  console.log('=== Finding Atoms ===\n')

  const atomData = ['TypeScript', 'JavaScript', 'Python', 'Rust']

  const atoms = await findAtomIds(atomData)

  console.log('Results:')
  atoms.forEach(atom => {
    if (atom.term_id) {
      console.log(`✓ ${atom.data}: ${atom.term_id}`)
    } else {
      console.log(`✗ ${atom.data}: not found`)
    }
  })

  // 2. Create missing atoms
  const missingAtoms = atoms.filter(a => !a.term_id)

  if (missingAtoms.length > 0) {
    console.log(`\n=== Creating ${missingAtoms.length} Missing Atoms ===\n`)

    for (const atom of missingAtoms) {
      const created = await createAtomFromString(
        { walletClient, publicClient, address },
        atom.data,
        parseEther('0.01')
      )
      atom.term_id = created.state.termId
      console.log(`✓ Created: ${atom.data}`)
    }
  }

  // 3. Find existing triples
  console.log('\n=== Finding Triples ===\n')

  // Get atom IDs
  const tsId = atoms.find(a => a.data === 'TypeScript')?.term_id as Hex
  const jsId = atoms.find(a => a.data === 'JavaScript')?.term_id as Hex

  if (!tsId || !jsId) {
    throw new Error('Missing required atoms')
  }

  // Create predicate
  const compilesTo = await createAtomFromString(
    { walletClient, publicClient, address },
    'compilesTo'
  )

  // Check if triple exists
  const tripleCombinations: Array<[Hex, Hex, Hex]> = [
    [tsId, compilesTo.state.termId, jsId]
  ]

  const triples = await findTripleIds(
    account.address,
    tripleCombinations
  )

  const tripleExists = triples[0]?.term_id

  if (tripleExists) {
    console.log('✓ Triple already exists:', tripleExists)
  } else {
    console.log('✗ Triple not found, creating...')

    const triple = await createTripleStatement(
      { walletClient, publicClient, address },
      {
        args: [
          [tsId],
          [compilesTo.state.termId],
          [jsId],
          [parseEther('0.1')],
        ],
        value: parseEther('0.1'),
      }
    )

    console.log('✓ Triple created:', triple.state[0].args.tripleId)
  }

  // 4. Calculate IDs offline
  console.log('\n=== Offline ID Calculation ===\n')

  const calculatedAtomId = calculateAtomId('NewAtom')
  console.log('Predicted atom ID for "NewAtom":', calculatedAtomId)

  const calculatedTripleId = calculateTripleId(tsId, compilesTo.state.termId, jsId)
  console.log('Predicted triple ID:', calculatedTripleId)

  console.log('\nSuccess!')
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Error:', error)
    process.exit(1)
  })
```

## See Also

- [findAtomIds](../search/advanced-queries.md#findatomids)
- [findTripleIds](../search/advanced-queries.md#findtripleids)
- [calculateAtomId](../atoms/querying.md#calculateatomid)
- [calculateTripleId](../triples/querying.md#calculatetripleid)
