---
title: Batch Operations
sidebar_label: Batch Operations
sidebar_position: 5
description: Complete examples for batch creation and deposit operations
keywords: [examples, batch, bulk, operations, efficiency]
---

# Batch Operations Examples

Complete workflows for performing batch operations to save gas and improve efficiency.

## Example 1: Batch Create Atoms

```typescript
import {
  multiVaultCreateAtoms,
  multiVaultGetAtomCost,
  eventParseAtomCreated,
} from '@0xintuition/protocol'
import { toHex } from 'viem'

// Create multiple atoms at once
const atomNames = [
  'TypeScript',
  'React',
  'Viem',
  'Intuition Protocol',
  'Web3',
]

const atomUris = atomNames.map(name => toHex(name))
const atomCost = await multiVaultGetAtomCost({ address, publicClient })
const costs = Array(atomNames.length).fill(atomCost)
const totalCost = atomCost * BigInt(atomNames.length)

console.log(`Creating ${atomNames.length} atoms`)
console.log('Total cost:', formatEther(totalCost))

const txHash = await multiVaultCreateAtoms(
  { address, walletClient, publicClient },
  {
    args: [atomUris, costs],
    value: totalCost,
  }
)

// Get all created atom IDs
const events = await eventParseAtomCreated(publicClient, txHash)
const atomMapping = atomNames.reduce((map, name, i) => {
  map[name] = events[i].args.termId
  return map
}, {} as Record<string, bigint>)

console.log('Created atoms:', atomMapping)
```

## Example 2: Batch Deposit to Multiple Vaults

```typescript
import { multiVaultDepositBatch, eventParseDeposited } from '@0xintuition/protocol'
import { parseEther } from 'viem'

// Deposit to multiple vaults at once
const vaults = [
  '0x1234...',
  '0x2345...',
  '0x3456...',
  '0x4567...',
]

const curves = [1, 1, 2, 2] // Mix of curves
const deposits = [
  parseEther('1'),
  parseEther('0.5'),
  parseEther('0.75'),
  parseEther('0.25'),
]

// Preview each deposit
const previews = await Promise.all(
  vaults.map((vaultId, i) =>
    multiVaultPreviewDeposit(
      { address, publicClient },
      { args: [vaultId, curves[i], deposits[i]] }
    )
  )
)

// Set minimum shares with 1% slippage
const minShares = previews.map(shares => (shares * 99n) / 100n)

const totalValue = deposits.reduce((a, b) => a + b, 0n)

console.log('Batch depositing to', vaults.length, 'vaults')
console.log('Total value:', formatEther(totalValue))

const txHash = await multiVaultDepositBatch(
  { address, walletClient, publicClient },
  {
    args: [account.address, vaults, curves, deposits, minShares],
    value: totalValue,
  }
)

// Parse all deposit events
const events = await eventParseDeposited(publicClient, txHash)
events.forEach((event, i) => {
  console.log(`Vault ${i}: ${formatEther(event.args.shares)} shares`)
})
```

## Example 3: Batch Create Triples

```typescript
import {
  multiVaultCreateTriples,
  multiVaultGetTripleCost,
  eventParseTripleCreated,
} from '@0xintuition/protocol'

// Create multiple triples representing relationships
const relationships = [
  { subject: aliceId, predicate: followsId, object: bobId },
  { subject: bobId, predicate: followsId, object: charlieId },
  { subject: charlieId, predicate: followsId, object: aliceId },
]

const subjects = relationships.map(r => r.subject)
const predicates = relationships.map(r => r.predicate)
const objects = relationships.map(r => r.object)

const tripleCost = await multiVaultGetTripleCost({ address, publicClient })
const deposits = Array(relationships.length).fill(tripleCost)
const totalCost = tripleCost * BigInt(relationships.length)

const txHash = await multiVaultCreateTriples(
  { address, walletClient, publicClient },
  {
    args: [subjects, predicates, objects, deposits],
    value: totalCost,
  }
)

const events = await eventParseTripleCreated(publicClient, txHash)
console.log('Created triple IDs:', events.map(e => e.args.tripleId))
```

## Example 4: Batch Redeem from Multiple Vaults

```typescript
import { multiVaultRedeemBatch, eventParseRedeemed } from '@0xintuition/protocol'

// Get maximum redeemable shares for each vault
const vaults = ['0x1234...', '0x2345...', '0x3456...']
const curves = [1, 1, 2]

const maxShares = await Promise.all(
  vaults.map(vaultId =>
    multiVaultMaxRedeem(
      { address, publicClient },
      { args: [account.address, vaultId] }
    )
  )
)

// Redeem 50% from each vault
const sharesToRedeem = maxShares.map(shares => shares / 2n)

// Preview redemptions
const expectedAssets = await Promise.all(
  vaults.map((vaultId, i) =>
    multiVaultPreviewRedeem(
      { address, publicClient },
      { args: [vaultId, curves[i], sharesToRedeem[i]] }
    )
  )
)

// Set minimum assets with slippage protection
const minAssets = expectedAssets.map(assets => (assets * 99n) / 100n)

const txHash = await multiVaultRedeemBatch(
  { address, walletClient, publicClient },
  {
    args: [sharesToRedeem, account.address, vaults, curves, minAssets],
  }
)

const events = await eventParseRedeemed(publicClient, txHash)
events.forEach((event, i) => {
  console.log(`Vault ${i}: ${formatEther(event.args.assets)} assets received`)
})
```

## See Also

- [Atom Functions](/docs/docs/protocol/api-reference/multivault/atoms)
- [Vault Operations](/docs/docs/protocol/api-reference/multivault/vaults)
- [Triple Functions](/docs/docs/protocol/api-reference/multivault/triples)
