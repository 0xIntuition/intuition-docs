---
title: "Example: Create Triple Statement"
sidebar_label: Create Triple Statement
sidebar_position: 2
description: Complete example of creating a subject-predicate-object triple
keywords: [sdk, example, triple, statement, relationship]
---

# Example: Create Triple Statement

This example demonstrates creating a complete triple (subject-predicate-object statement).

## Complete Code

```typescript
import {
  intuitionTestnet,
  getMultiVaultAddressFromChainId,
  createAtomFromString,
  createTripleStatement,
  getTripleDetails,
  wait,
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

  console.log('Creating triple: Alice follows Bob\n')

  // 1. Create three atoms
  console.log('Creating atoms...')

  const alice = await createAtomFromString(
    { walletClient, publicClient, address },
    'Alice'
  )
  console.log('✓ Created atom: Alice')

  const follows = await createAtomFromString(
    { walletClient, publicClient, address },
    'follows'
  )
  console.log('✓ Created atom: follows')

  const bob = await createAtomFromString(
    { walletClient, publicClient, address },
    'Bob'
  )
  console.log('✓ Created atom: Bob')

  // 2. Create triple
  console.log('\nCreating triple statement...')

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

  const tripleId = triple.state[0].args.tripleId
  console.log('✓ Triple created!')
  console.log('  Triple ID:', tripleId)
  console.log('  Transaction:', triple.transactionHash)

  // 3. Wait and query details
  console.log('\nWaiting for indexing...')
  await wait(triple.transactionHash)

  const details = await getTripleDetails(tripleId)

  console.log('\n=== Triple Details ===')
  console.log('Subject:', details.subject.label)
  console.log('Predicate:', details.predicate.label)
  console.log('Object:', details.object.label)
  console.log('\nFOR Position Shares:', details.vault.totalShares)
  console.log('AGAINST Position Shares:', details.counterVault.totalShares)

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

- [createTripleStatement](../triples/create-triple.md)
- [Create Atom Example](./create-atom-from-string.md)
