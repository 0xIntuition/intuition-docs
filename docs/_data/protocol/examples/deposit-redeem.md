---
title: Deposit & Redeem
sidebar_label: Deposit & Redeem
sidebar_position: 2
description: Complete examples for vault deposits and redemptions
keywords: [examples, deposit, redeem, vaults, shares]
---

# Deposit & Redeem Examples

Complete workflows for depositing to and redeeming from vaults.

## Example 1: Simple Deposit

```typescript
import {
  multiVaultDeposit,
  multiVaultPreviewDeposit,
  multiVaultGetShares,
  eventParseDeposited,
} from '@0xintuition/protocol'
import { parseEther, formatEther } from 'viem'

const vaultId = '0x1234...' // Atom or triple ID
const curveId = 1 // LinearCurve
const depositAmount = parseEther('1')

// 1. Preview deposit
const expectedShares = await multiVaultPreviewDeposit(
  { address, publicClient },
  { args: [vaultId, curveId, depositAmount] }
)
console.log('Expected shares:', formatEther(expectedShares))

// 2. Execute deposit with slippage protection
const minShares = (expectedShares * 99n) / 100n // 1% slippage
const txHash = await multiVaultDeposit(
  { address, walletClient, publicClient },
  {
    args: [account.address, vaultId, curveId, minShares],
    value: depositAmount,
  }
)

// 3. Parse deposit event
const events = await eventParseDeposited(publicClient, txHash)
console.log('Actual shares received:', formatEther(events[0].args.shares))

// 4. Check total shares
const totalShares = await multiVaultGetShares(
  { address, publicClient },
  { args: [account.address, vaultId] }
)
console.log('Total shares:', formatEther(totalShares))
```

## Example 2: Batch Deposit

```typescript
import { multiVaultDepositBatch } from '@0xintuition/protocol'

const vaults = [
  '0x1234...',
  '0x2345...',
  '0x3456...',
]
const curves = [1, 1, 2] // Mix of LinearCurve and OffsetProgressiveCurve
const deposits = [
  parseEther('0.5'),
  parseEther('1'),
  parseEther('0.25'),
]
const minShares = [0n, 0n, 0n] // Accept any amount for simplicity

const totalValue = deposits.reduce((a, b) => a + b, 0n)

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

## Example 3: Redeem Shares

```typescript
import {
  multiVaultRedeem,
  multiVaultPreviewRedeem,
  multiVaultMaxRedeem,
  eventParseRedeemed,
} from '@0xintuition/protocol'

const vaultId = '0x1234...'
const curveId = 1

// 1. Check redeemable shares
const maxShares = await multiVaultMaxRedeem(
  { address, publicClient },
  { args: [account.address, vaultId] }
)
console.log('Max redeemable:', formatEther(maxShares))

// 2. Redeem half of shares
const sharesToRedeem = maxShares / 2n

// 3. Preview redemption
const expectedAssets = await multiVaultPreviewRedeem(
  { address, publicClient },
  { args: [vaultId, curveId, sharesToRedeem] }
)
console.log('Expected assets:', formatEther(expectedAssets))

// 4. Execute redemption
const minAssets = (expectedAssets * 99n) / 100n // 1% slippage
const txHash = await multiVaultRedeem(
  { address, walletClient, publicClient },
  {
    args: [account.address, vaultId, curveId, sharesToRedeem, minAssets],
  }
)

// 5. Parse redemption event
const events = await eventParseRedeemed(publicClient, txHash)
console.log('Assets received:', formatEther(events[0].args.assets))
```

## Example 4: Full Cycle - Deposit and Redeem

```typescript
// Complete deposit/redeem cycle
const performCycle = async () => {
  const vaultId = '0x1234...'
  const curveId = 1
  const depositAmount = parseEther('1')

  // Step 1: Deposit
  console.log('\n--- DEPOSITING ---')
  const depositTx = await multiVaultDeposit(
    { address, walletClient, publicClient },
    {
      args: [account.address, vaultId, curveId, 0n],
      value: depositAmount,
    }
  )

  const depositEvents = await eventParseDeposited(publicClient, depositTx)
  const sharesReceived = depositEvents[0].args.shares
  console.log('Shares received:', formatEther(sharesReceived))

  // Step 2: Wait (simulate time passing)
  console.log('\n--- WAITING ---')
  await new Promise(resolve => setTimeout(resolve, 60000)) // 1 minute

  // Step 3: Check current value
  const currentValue = await multiVaultPreviewRedeem(
    { address, publicClient },
    { args: [vaultId, curveId, sharesReceived] }
  )
  console.log('Current value:', formatEther(currentValue))

  // Step 4: Redeem
  console.log('\n--- REDEEMING ---')
  const redeemTx = await multiVaultRedeem(
    { address, walletClient, publicClient },
    {
      args: [account.address, vaultId, curveId, sharesReceived, 0n],
    }
  )

  const redeemEvents = await eventParseRedeemed(publicClient, redeemTx)
  const assetsReceived = redeemEvents[0].args.assets
  console.log('Assets received:', formatEther(assetsReceived))

  // Calculate P&L
  const profitLoss = assetsReceived - depositAmount
  console.log('\n--- RESULTS ---')
  console.log('Profit/Loss:', formatEther(profitLoss))
  console.log('Return:', ((Number(assetsReceived) / Number(depositAmount) - 1) * 100).toFixed(2) + '%')
}

await performCycle()
```

## See Also

- [Vault Operations](/docs/protocol/api-reference/multivault/vaults)
- [Share Conversions](/docs/protocol/api-reference/multivault/conversions)
- [Core Concepts: Vaults](/docs/protocol/core-concepts/vaults)
