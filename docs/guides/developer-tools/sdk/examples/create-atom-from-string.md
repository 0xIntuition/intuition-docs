---
title: "Example: Create Atom from String"
sidebar_label: Create Atom from String
sidebar_position: 1
description: Complete example of creating an atom from a text string
keywords: [sdk, example, atom, create, string, tutorial]
---

# Example: Create Atom from String

This example demonstrates creating an atom from a plain text string, including setup, error handling, and querying the result.

## Complete Code

```typescript
import {
  intuitionTestnet,
  getMultiVaultAddressFromChainId,
  createAtomFromString,
  getAtomDetails,
  wait,
} from '@0xintuition/sdk'
import { createPublicClient, createWalletClient, http, parseEther, formatEther } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'

async function main() {
  // 1. Setup account and clients
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

  console.log('Connected to Intuition Testnet')
  console.log('Account:', account.address)

  // 2. Check balance
  const balance = await publicClient.getBalance({ address: account.address })
  console.log('Balance:', formatEther(balance), 'tTRUST')

  if (balance < parseEther('0.1')) {
    throw new Error('Insufficient balance. Get testnet tokens from faucet.')
  }

  // 3. Create atom
  const atomData = 'TypeScript'
  const depositAmount = parseEther('0.01')

  console.log(`\nCreating atom: "${atomData}"`)
  console.log('Deposit:', formatEther(depositAmount), 'tTRUST')

  const atom = await createAtomFromString(
    { walletClient, publicClient, address },
    atomData,
    depositAmount
  )

  console.log('\n✓ Atom created successfully!')
  console.log('  Atom ID:', atom.state.termId)
  console.log('  Creator:', atom.state.creator)
  console.log('  Vault:', atom.state.atomWallet)
  console.log('  Transaction:', atom.transactionHash)

  // 4. Wait for indexing
  console.log('\nWaiting for indexing...')
  await wait(atom.transactionHash, {
    pollingInterval: 1000,
    timeout: 30000,
  })

  // 5. Query atom details
  console.log('Fetching atom details...')
  const details = await getAtomDetails(atom.state.termId)

  console.log('\n✓ Atom Details:')
  console.log('  Label:', details.label)
  console.log('  Creator:', details.creator)
  console.log('  Total Shares:', details.vault.totalShares)
  console.log('  Share Price:', details.vault.currentSharePrice)
  console.log('  Positions:', details.vault.positionCount)

  console.log('\nSuccess!')
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
npx tsx create-atom-example.ts
```

## Expected Output

```
Connected to Intuition Testnet
Account: 0xYourAddress
Balance: 10.5 tTRUST

Creating atom: "TypeScript"
Deposit: 0.01 tTRUST

✓ Atom created successfully!
  Atom ID: 0x1234567890abcdef...
  Creator: 0xYourAddress
  Vault: 0xVaultAddress
  Transaction: 0xTransactionHash

Waiting for indexing...
Fetching atom details...

✓ Atom Details:
  Label: TypeScript
  Creator: 0xYourAddress
  Total Shares: 1000000
  Share Price: 0.01
  Positions: 1

Success!
```

## See Also

- [createAtomFromString](../atoms/create-from-string.md)
- [getAtomDetails](../atoms/querying.md)
- [Quick Start Guide](../getting-started/quick-start.md)
