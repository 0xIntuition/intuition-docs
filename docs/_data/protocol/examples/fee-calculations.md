---
title: Fee Calculations
sidebar_label: Fee Calculations
sidebar_position: 6
description: Complete examples for calculating and estimating fees
keywords: [examples, fees, calculations, costs, estimation]
---

# Fee Calculations Examples

Complete workflows for calculating fees and estimating costs.

## Example 1: Calculate Deposit Fees

```typescript
import {
  multiVaultEntryFeeAmount,
  multiVaultProtocolFeeAmount,
} from '@0xintuition/protocol'
import { parseEther, formatEther } from 'viem'

const calculateDepositFees = async (vaultId: string, depositAmount: bigint) => {
  // Get entry fee
  const entryFee = await multiVaultEntryFeeAmount(
    { address, publicClient },
    { args: [vaultId, depositAmount] }
  )

  // Get protocol fee
  const protocolFee = await multiVaultProtocolFeeAmount(
    { address, publicClient },
    { args: [vaultId, depositAmount] }
  )

  // Calculate totals
  const totalFees = entryFee + protocolFee
  const netDeposit = depositAmount - totalFees
  const feePercentage = (Number(totalFees) / Number(depositAmount) * 100).toFixed(2)

  return {
    depositAmount: formatEther(depositAmount),
    entryFee: formatEther(entryFee),
    protocolFee: formatEther(protocolFee),
    totalFees: formatEther(totalFees),
    netDeposit: formatEther(netDeposit),
    feePercentage: feePercentage + '%',
  }
}

const fees = await calculateDepositFees(vaultId, parseEther('1'))
console.log('Deposit fee breakdown:', fees)
```

## Example 2: Calculate Redemption Fees

```typescript
import { multiVaultExitFeeAmount } from '@0xintuition/protocol'

const calculateRedemptionFees = async (vaultId: string, shares: bigint) => {
  // Preview redemption
  const expectedAssets = await multiVaultPreviewRedeem(
    { address, publicClient },
    { args: [vaultId, 1, shares] }
  )

  // Get exit fee
  const exitFee = await multiVaultExitFeeAmount(
    { address, publicClient },
    { args: [vaultId, expectedAssets] }
  )

  // Calculate net amount
  const netAssets = expectedAssets - exitFee
  const feePercentage = (Number(exitFee) / Number(expectedAssets) * 100).toFixed(2)

  return {
    sharesToRedeem: formatEther(shares),
    grossAssets: formatEther(expectedAssets),
    exitFee: formatEther(exitFee),
    netAssets: formatEther(netAssets),
    feePercentage: feePercentage + '%',
  }
}

const redeemFees = await calculateRedemptionFees(vaultId, parseEther('10'))
console.log('Redemption fee breakdown:', redeemFees)
```

## Example 3: Estimate Total Cost for Operations

```typescript
const estimateTotalCost = async () => {
  // Get creation costs
  const atomCost = await multiVaultGetAtomCost({ address, publicClient })
  const tripleCost = await multiVaultGetTripleCost({ address, publicClient })

  // Calculate for creating 5 atoms and 3 triples
  const numAtoms = 5
  const numTriples = 3

  const totalAtomCost = atomCost * BigInt(numAtoms)
  const totalTripleCost = tripleCost * BigInt(numTriples)
  const grandTotal = totalAtomCost + totalTripleCost

  return {
    atoms: {
      count: numAtoms,
      costPerAtom: formatEther(atomCost),
      totalCost: formatEther(totalAtomCost),
    },
    triples: {
      count: numTriples,
      costPerTriple: formatEther(tripleCost),
      totalCost: formatEther(totalTripleCost),
    },
    grandTotal: formatEther(grandTotal),
  }
}

const estimate = await estimateTotalCost()
console.log('Cost estimate:', estimate)
```

## Example 4: Calculate Triple Atom Deposit Fraction

```typescript
import { multiVaultAtomDepositFractionAmount } from '@0xintuition/protocol'

const calculateTripleAllocation = async (totalDeposit: bigint) => {
  // Get fraction allocated to atoms
  const atomFraction = await multiVaultAtomDepositFractionAmount(
    { address, publicClient },
    { args: [totalDeposit] }
  )

  // Calculate triple allocation
  const tripleAllocation = totalDeposit - atomFraction

  // Breakdown per atom (3 atoms in a triple: subject, predicate, object)
  const perAtom = atomFraction / 3n

  return {
    totalDeposit: formatEther(totalDeposit),
    atomFraction: formatEther(atomFraction),
    tripleAllocation: formatEther(tripleAllocation),
    perAtom: formatEther(perAtom),
    percentToAtoms: (Number(atomFraction) / Number(totalDeposit) * 100).toFixed(2) + '%',
    percentToTriple: (Number(tripleAllocation) / Number(totalDeposit) * 100).toFixed(2) + '%',
  }
}

const allocation = await calculateTripleAllocation(parseEther('1'))
console.log('Triple deposit allocation:', allocation)
```

## Example 5: Fee Comparison Across Vaults

```typescript
const compareVaultFees = async (vaultIds: string[], depositAmount: bigint) => {
  const comparisons = await Promise.all(
    vaultIds.map(async (vaultId) => {
      const entryFee = await multiVaultEntryFeeAmount(
        { address, publicClient },
        { args: [vaultId, depositAmount] }
      )

      const protocolFee = await multiVaultProtocolFeeAmount(
        { address, publicClient },
        { args: [vaultId, depositAmount] }
      )

      const totalFees = entryFee + protocolFee
      const feePercentage = (Number(totalFees) / Number(depositAmount) * 100).toFixed(2)

      return {
        vaultId,
        entryFee: formatEther(entryFee),
        protocolFee: formatEther(protocolFee),
        totalFees: formatEther(totalFees),
        feePercentage: feePercentage + '%',
      }
    })
  )

  return comparisons
}

const vaultComparison = await compareVaultFees(
  ['0x1234...', '0x2345...', '0x3456...'],
  parseEther('1')
)
console.log('Vault fee comparison:', vaultComparison)
```

## See Also

- [Fee Calculations API](/docs/guides/developer-tools/protocol/api-reference/multivault/fees)
- [Configuration](/docs/guides/developer-tools/protocol/api-reference/multivault/configuration)
- [Vault Operations](/docs/guides/developer-tools/protocol/api-reference/multivault/vaults)
