---
title: Fee Calculations
sidebar_label: Fees
sidebar_position: 6
description: API reference for fee calculation functions
keywords: [fees, entry fee, exit fee, protocol fee, calculations]
---

# Fee Calculations

Functions for calculating various fees in the protocol.

## multiVaultEntryFeeAmount

Calculate entry fee for a deposit.

### Parameters

| Parameter | Type | Description | Required |
|-----------|------|-------------|----------|
| config | `ReadConfig` | Contract address and publicClient | Yes |
| args | `[bytes32, bigint]` | VaultId, assets | Yes |

### Returns

```typescript
Promise<bigint> // Entry fee amount
```

### Example

```typescript
import { multiVaultEntryFeeAmount } from '@0xintuition/protocol'
import { parseEther, formatEther } from 'viem'

const depositAmount = parseEther('1')
const entryFee = await multiVaultEntryFeeAmount(
  { address, publicClient },
  { args: [vaultId, depositAmount] }
)

console.log('Entry fee:', formatEther(entryFee))
console.log('Net deposit:', formatEther(depositAmount - entryFee))
```

---

## multiVaultExitFeeAmount

Calculate exit fee for a redemption.

### Parameters

| Parameter | Type | Description | Required |
|-----------|------|-------------|----------|
| config | `ReadConfig` | Contract address and publicClient | Yes |
| args | `[bytes32, bigint]` | VaultId, assets | Yes |

### Returns

```typescript
Promise<bigint> // Exit fee amount
```

### Example

```typescript
import { multiVaultExitFeeAmount } from '@0xintuition/protocol'

const expectedAssets = parseEther('10')
const exitFee = await multiVaultExitFeeAmount(
  { address, publicClient },
  { args: [vaultId, expectedAssets] }
)

console.log('Exit fee:', formatEther(exitFee))
console.log('Net withdrawal:', formatEther(expectedAssets - exitFee))
```

---

## multiVaultProtocolFeeAmount

Calculate protocol fee.

### Parameters

| Parameter | Type | Description | Required |
|-----------|------|-------------|----------|
| config | `ReadConfig` | Contract address and publicClient | Yes |
| args | `[bytes32, bigint]` | VaultId, assets | Yes |

### Returns

```typescript
Promise<bigint> // Protocol fee amount
```

### Example

```typescript
import { multiVaultProtocolFeeAmount } from '@0xintuition/protocol'

const protocolFee = await multiVaultProtocolFeeAmount(
  { address, publicClient },
  { args: [vaultId, depositAmount] }
)

console.log('Protocol fee:', formatEther(protocolFee))
```

---

## multiVaultAtomDepositFractionAmount

Calculate atom deposit fraction for triple creation.

### Parameters

| Parameter | Type | Description | Required |
|-----------|------|-------------|----------|
| config | `ReadConfig` | Contract address and publicClient | Yes |
| args | `[bigint]` | Total assets | Yes |

### Returns

```typescript
Promise<bigint> // Atom deposit fraction
```

### Example

```typescript
import { multiVaultAtomDepositFractionAmount } from '@0xintuition/protocol'

const totalAssets = parseEther('1')
const atomFraction = await multiVaultAtomDepositFractionAmount(
  { address, publicClient },
  { args: [totalAssets] }
)

console.log('Atom deposit fraction:', formatEther(atomFraction))
console.log('Remaining for triple:', formatEther(totalAssets - atomFraction))
```

### Use Case Example

```typescript
// Calculate total fees before depositing
const calculateTotalFees = async (vaultId: string, depositAmount: bigint) => {
  const entryFee = await multiVaultEntryFeeAmount(
    { address, publicClient },
    { args: [vaultId, depositAmount] }
  )

  const protocolFee = await multiVaultProtocolFeeAmount(
    { address, publicClient },
    { args: [vaultId, depositAmount] }
  )

  const totalFees = entryFee + protocolFee
  const netDeposit = depositAmount - totalFees

  return {
    depositAmount: formatEther(depositAmount),
    entryFee: formatEther(entryFee),
    protocolFee: formatEther(protocolFee),
    totalFees: formatEther(totalFees),
    netDeposit: formatEther(netDeposit),
    feePercentage: (Number(totalFees) / Number(depositAmount) * 100).toFixed(2) + '%',
  }
}

const fees = await calculateTotalFees(vaultId, parseEther('1'))
console.log(fees)
```

---

## See Also

- [Examples: Fee Calculations](/docs/protocol/examples/fee-calculations)
- [Configuration](/docs/protocol/api-reference/multivault/configuration)
