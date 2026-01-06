---
title: Balance Queries
sidebar_label: Balances
sidebar_position: 2
description: API reference for Trust Bonding balance query functions
keywords: [balances, bonded, locked, trust bonding]
---

# Balance Queries

Functions for querying bonded balances and locked amounts.

## trustBondingTotalBondedBalance

Get the total bonded balance across all users.

### Returns

```typescript
Promise<bigint> // Total bonded balance
```

### Example

```typescript
import { trustBondingTotalBondedBalance } from '@0xintuition/protocol'
import { formatEther } from 'viem'

const totalBonded = await trustBondingTotalBondedBalance({ address: bondingAddress, publicClient })
console.log('Total bonded:', formatEther(totalBonded))
```

---

## trustBondingTotalBondedBalanceAtEpochEnd

Get total bonded balance at the end of an epoch.

### Parameters

| Parameter | Type | Description | Required |
|-----------|------|-------------|----------|
| config | `ReadConfig` | Contract address and publicClient | Yes |
| args | `[bigint]` | Epoch number | Yes |

### Returns

```typescript
Promise<bigint>
```

### Example

```typescript
import { trustBondingTotalBondedBalanceAtEpochEnd } from '@0xintuition/protocol'

const balance = await trustBondingTotalBondedBalanceAtEpochEnd(
  { address: bondingAddress, publicClient },
  { args: [epochNumber] }
)
console.log('Total bonded at epoch end:', formatEther(balance))
```

---

## trustBondingUserBondedBalanceAtEpochEnd

Get user's bonded balance at the end of an epoch.

### Parameters

| Parameter | Type | Description | Required |
|-----------|------|-------------|----------|
| config | `ReadConfig` | Contract address and publicClient | Yes |
| args | `[Address, bigint]` | User address, epoch number | Yes |

### Returns

```typescript
Promise<bigint>
```

### Example

```typescript
import { trustBondingUserBondedBalanceAtEpochEnd } from '@0xintuition/protocol'

const userBalance = await trustBondingUserBondedBalanceAtEpochEnd(
  { address: bondingAddress, publicClient },
  { args: [userAddress, epochNumber] }
)
console.log('User bonded at epoch end:', formatEther(userBalance))
```

---

## trustBondingTotalLocked

Get total locked amount.

### Returns

```typescript
Promise<bigint>
```

### Example

```typescript
import { trustBondingTotalLocked } from '@0xintuition/protocol'

const locked = await trustBondingTotalLocked({ address: bondingAddress, publicClient })
console.log('Total locked:', formatEther(locked))
```

---

## See Also

- [Trust Bonding Rewards](/docs/protocol/api-reference/trust-bonding/rewards)
- [Examples: Trust Bonding](/docs/protocol/examples/trust-bonding)
