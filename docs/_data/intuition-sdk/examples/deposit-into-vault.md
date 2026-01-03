---
title: "Example: Deposit into Vault"
sidebar_label: Deposit into Vault
sidebar_position: 4
description: Deposit assets into an atom vault and receive shares
keywords: [sdk, example, deposit, vault, shares, stake]
---

# Example: Deposit into Vault

This example demonstrates depositing assets into a vault and tracking share balances.

## Complete Code

```typescript
import {
  intuitionTestnet,
  getMultiVaultAddressFromChainId,
  createAtomFromString,
  deposit,
  multiVaultPreviewDeposit,
  multiVaultGetShares,
  multiVaultCurrentSharePrice,
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

  // 1. Create or get atom
  console.log('Creating atom...')
  const atom = await createAtomFromString(
    { walletClient, publicClient, address },
    'DeFi',
    parseEther('0.01')
  )

  const vaultId = atom.state.termId
  console.log('✓ Atom ID:', vaultId)

  // 2. Check initial share balance
  let shares = await multiVaultGetShares(
    { address, publicClient },
    { args: [account.address, vaultId] }
  )
  console.log('\nInitial shares:', shares.toString())

  // 3. Preview deposit
  const depositAmount = parseEther('1')
  const expectedShares = await multiVaultPreviewDeposit(
    { address, publicClient },
    { args: [vaultId, 1n, depositAmount] }
  )

  console.log('\nDeposit Preview:')
  console.log('  Depositing:', formatEther(depositAmount), 'tTRUST')
  console.log('  Expected shares:', expectedShares.toString())

  // 4. Execute deposit
  console.log('\nDepositing...')
  await deposit(
    { walletClient, publicClient, address },
    [
      account.address,
      vaultId,
      1n,
      depositAmount,
      0n,
    ]
  )

  console.log('✓ Deposit successful!')

  // 5. Check new share balance
  shares = await multiVaultGetShares(
    { address, publicClient },
    { args: [account.address, vaultId] }
  )

  console.log('\nNew share balance:', shares.toString())

  // 6. Check share price
  const price = await multiVaultCurrentSharePrice(
    { address, publicClient },
    { args: [vaultId, 1n] }
  )

  console.log('Current share price:', formatEther(price), 'tTRUST')

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

- [deposit](../vaults/deposits.md)
- [Vault Queries](../vaults/queries.md)
- [Vault Previews](../vaults/previews.md)
