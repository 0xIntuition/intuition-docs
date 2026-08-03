---
title: "Example: Create Triple Statement"
sidebar_label: Create Triple Statement
sidebar_position: 2
description: Complete example of creating a subject-predicate-object triple
keywords: [sdk, example, triple, statement, relationship]
---

# Example: Create Triple Statement

This example demonstrates creating a complete triple (subject-predicate-object statement).

SDK reads default to the mainnet GraphQL API. This example configures the testnet API before querying the triple it creates on Intuition Testnet.

## Complete Code

```typescript
import {
  configureSdk,
  intuitionTestnet,
  getMultiVaultAddressFromChainId,
  createAtomFromString,
  createTripleStatement,
  getTripleDetails,
  wait,
} from '@0xintuition/sdk'
import { API_URL_DEV } from '@0xintuition/graphql'
import { createPublicClient, createWalletClient, http, parseEther } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'

async function main() {
  // Setup
  const account = privateKeyToAccount(process.env.PRIVATE_KEY as `0x${string}`)
  // SDK reads default to mainnet; keep reads paired with the testnet write chain.
  configureSdk({ apiUrl: API_URL_DEV })

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

  const tripleId = triple.state[0].args.termId
  console.log('✓ Triple created!')
  console.log('  Triple ID:', tripleId)
  console.log('  Transaction:', triple.transactionHash)

  // 3. Wait and query details
  console.log('\nWaiting for indexing...')
  await wait(triple.transactionHash)

  const details = await getTripleDetails(tripleId)
  if (!details) throw new Error('Created triple was not found on the testnet API')

  const forVault = details.term?.vaults[0]
  const againstVault = details.counter_term?.vaults[0]

  console.log('\n=== Triple Details ===')
  console.log('Subject:', details.subject?.label)
  console.log('Predicate:', details.predicate?.label)
  console.log('Object:', details.object?.label)
  console.log('\nFOR Position Shares:', forVault?.total_shares)
  console.log('AGAINST Position Shares:', againstVault?.total_shares)

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

- [createTripleStatement](/docs/intuition-sdk/triples-guide)
- [Create Atom Example](./create-atom-from-string.md)
