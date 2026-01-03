---
title: "Example: Bulk Sync with Cost Estimation"
sidebar_label: Bulk Sync Cost Estimation
sidebar_position: 6
description: Use the experimental sync function to estimate costs for bulk operations
keywords: [sdk, example, sync, bulk, cost, estimation, experimental]
---

# Example: Bulk Sync with Cost Estimation

This example demonstrates using the experimental `sync` function to estimate costs for creating a knowledge graph.

## Complete Code

```typescript
import {
  intuitionTestnet,
  getMultiVaultAddressFromChainId,
  sync,
} from '@0xintuition/sdk'
import { createPublicClient, createWalletClient, http, formatEther } from 'viem'
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

  // Define knowledge graph
  const knowledgeGraph = {
    'Ethereum': {
      'isA': 'Blockchain',
      'hasLanguage': 'Solidity',
      'supports': ['Smart Contracts', 'DeFi', 'NFTs']
    },
    'Vitalik Buterin': {
      'created': 'Ethereum',
      'worksOn': 'Blockchain'
    },
    'Solidity': {
      'isA': 'Programming Language',
      'usedFor': 'Smart Contracts'
    }
  }

  console.log('Knowledge Graph Structure:')
  console.log(JSON.stringify(knowledgeGraph, null, 2))

  // 1. Dry run to estimate costs
  console.log('\n=== Cost Estimation (Dry Run) ===\n')

  const estimation = await sync(
    {
      address,
      publicClient,
      walletClient,
      dryRun: true,
      logger: (msg) => console.log(`[DRY RUN] ${msg}`),
    },
    knowledgeGraph
  )

  console.log('\n=== Cost Summary ===')
  console.log('Atoms to create:', estimation.atomCount)
  console.log('Triples to create:', estimation.tripleCount)
  console.log('Deposits needed:', estimation.depositCount)
  console.log('')
  console.log('Atom cost:', formatEther(estimation.atomCost), 'tTRUST')
  console.log('Triple cost:', formatEther(estimation.tripleCost), 'tTRUST')
  console.log('Deposit cost:', formatEther(estimation.depositCost), 'tTRUST')
  console.log('Total cost:', formatEther(estimation.totalCost), 'tTRUST')
  console.log('')
  console.log('Your balance:', formatEther(estimation.userBalance), 'tTRUST')
  console.log('Sufficient balance:', estimation.hasSufficientBalance ? '✓ Yes' : '✗ No')

  // 2. Execute if sufficient balance
  if (estimation.hasSufficientBalance) {
    console.log('\n=== Executing Sync ===\n')

    const confirm = process.argv.includes('--execute')

    if (!confirm) {
      console.log('Run with --execute flag to execute the sync')
      return
    }

    const result = await sync(
      {
        address,
        publicClient,
        walletClient,
        batchSize: 50,
        logger: console.log,
      },
      knowledgeGraph
    )

    console.log('\n✓ Sync completed!')
    console.log('Final cost:', formatEther(result.totalCost), 'tTRUST')

  } else {
    console.log('\n✗ Insufficient balance for sync operation')
    console.log('Need:', formatEther(estimation.totalCost - estimation.userBalance), 'more tTRUST')
  }
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
# Estimate costs only
npx tsx bulk-sync-example.ts

# Execute the sync
npx tsx bulk-sync-example.ts --execute
```

## See Also

- [sync Function (Experimental)](/Users/simonas/dev/0xIntuition/intuition-ts/packages/sdk/README.md#sync)
- [Batch Creation](../atoms/batch-creation.md)
