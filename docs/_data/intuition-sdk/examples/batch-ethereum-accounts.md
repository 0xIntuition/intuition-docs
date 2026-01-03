---
title: "Example: Batch Create Ethereum Accounts"
sidebar_label: Batch Ethereum Accounts
sidebar_position: 3
description: Create multiple identity atoms from Ethereum addresses in one transaction
keywords: [sdk, example, batch, ethereum, accounts, addresses]
---

# Example: Batch Create Ethereum Account Atoms

This example demonstrates creating multiple identity atoms from Ethereum addresses in a single transaction.

## Complete Code

```typescript
import {
  intuitionTestnet,
  getMultiVaultAddressFromChainId,
  batchCreateAtomsFromEthereumAccounts,
} from '@0xintuition/sdk'
import { createPublicClient, createWalletClient, http, parseEther, formatEther } from 'viem'
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

  // List of Ethereum addresses
  const addresses = [
    '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
    '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
    '0x1234567890123456789012345678901234567890',
    '0x9876543210987654321098765432109876543210',
    '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
  ]

  console.log(`Creating ${addresses.length} identity atoms...\n`)

  const depositPerAtom = parseEther('0.01')
  const totalCost = depositPerAtom * BigInt(addresses.length)

  console.log('Deposit per atom:', formatEther(depositPerAtom), 'tTRUST')
  console.log('Total cost:', formatEther(totalCost), 'tTRUST\n')

  // Batch create
  const result = await batchCreateAtomsFromEthereumAccounts(
    { walletClient, publicClient, address },
    addresses,
    depositPerAtom
  )

  console.log('✓ Created', result.state.length, 'atoms in one transaction!')
  console.log('  Transaction:', result.transactionHash)
  console.log('\nAtom IDs:')

  result.state.forEach((state, i) => {
    console.log(`  ${i + 1}. ${addresses[i]}`)
    console.log(`     → ${state.termId}`)
  })

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

- [batchCreateAtomsFromEthereumAccounts](../atoms/batch-creation.md)
- [Batch Creation Guide](../atoms/batch-creation.md)
