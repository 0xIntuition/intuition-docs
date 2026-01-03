---
title: "Example: Thing IPFS Pinning"
sidebar_label: Thing IPFS Pinning
sidebar_position: 7
description: Create rich entities with JSON-LD and automatic IPFS pinning
keywords: [sdk, example, thing, ipfs, metadata, json-ld]
---

# Example: Thing IPFS Pinning

This example demonstrates creating a rich entity (Thing) with automatic IPFS pinning.

## Complete Code

```typescript
import {
  intuitionTestnet,
  getMultiVaultAddressFromChainId,
  createAtomFromThing,
  pinThing,
  getAtomDetails,
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

  // Define rich entity
  const project = {
    url: 'https://github.com/myorg/awesome-project',
    name: 'Awesome DeFi Protocol',
    description: 'A groundbreaking decentralized finance protocol built on Intuition',
    image: 'https://myproject.com/logo.png',
    tags: [
      'defi',
      'protocol',
      'typescript',
      'smart-contracts',
      'intuition'
    ],
    twitter: 'https://twitter.com/awesomedefi',
    github: 'github.com/myorg/awesome-project',
  }

  console.log('=== Project Metadata ===')
  console.log(JSON.stringify(project, null, 2))

  // 1. Pin to IPFS (without creating atom)
  console.log('\n=== Pinning to IPFS ===')
  const ipfsUri = await pinThing({ thing: project })

  if (!ipfsUri) {
    throw new Error('Failed to pin to IPFS')
  }

  console.log('✓ Pinned to IPFS:', ipfsUri)

  // 2. Create atom with Thing (auto-pins and creates atom)
  console.log('\n=== Creating Atom ===')
  const atom = await createAtomFromThing(
    { walletClient, publicClient, address },
    project,
    parseEther('0.1')
  )

  console.log('✓ Atom created!')
  console.log('  Atom ID:', atom.state.termId)
  console.log('  IPFS URI:', atom.uri)
  console.log('  Transaction:', atom.transactionHash)

  // 3. Wait for indexing
  console.log('\nWaiting for indexing...')
  await wait(atom.transactionHash)

  // 4. Query details
  const details = await getAtomDetails(atom.state.termId)

  console.log('\n=== Atom Details ===')
  console.log('Label:', details.label)
  console.log('Creator:', details.creator)
  console.log('Vault ID:', details.vault.id)
  console.log('Total Shares:', details.vault.totalShares)

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

- [createAtomFromThing](../atoms/create-from-thing.md)
- [pinThing](../integrations/pinata-ipfs.md)
- [IPFS Integration](../integrations/pinata-ipfs.md)
