---
title: Reward Calculations
sidebar_label: Rewards
sidebar_position: 3
description: API reference for Trust Bonding reward calculation functions
keywords: [rewards, apy, claimable, emissions, trust bonding]
---

# Reward Calculations

Functions for calculating and querying bonding rewards.

## trustBondingGetUserApy

Get user's annual percentage yield (APY).

### Parameters

| Parameter | Type | Description | Required |
|-----------|------|-------------|----------|
| config | `ReadConfig` | Contract address and publicClient | Yes |
| args | `[Address]` | User address | Yes |

### Returns

```typescript
Promise<bigint> // User APY (basis points)
```

### Example

```typescript
import { trustBondingGetUserApy } from '@0xintuition/protocol'

const userApy = await trustBondingGetUserApy(
  { address: bondingAddress, publicClient },
  { args: [userAddress] }
)
console.log('User APY:', Number(userApy) / 100, '%')
```

---

## trustBondingGetSystemApy

Get system-wide APY.

### Returns

```typescript
Promise<bigint> // System APY (basis points)
```

### Example

```typescript
import { trustBondingGetSystemApy } from '@0xintuition/protocol'

const systemApy = await trustBondingGetSystemApy({ address: bondingAddress, publicClient })
console.log('System APY:', Number(systemApy) / 100, '%')
```

---

## trustBondingGetUserCurrentClaimableRewards

Get user's currently claimable rewards.

### Parameters

| Parameter | Type | Description | Required |
|-----------|------|-------------|----------|
| config | `ReadConfig` | Contract address and publicClient | Yes |
| args | `[Address]` | User address | Yes |

### Returns

```typescript
Promise<bigint> // Claimable rewards amount
```

### Example

```typescript
import { trustBondingGetUserCurrentClaimableRewards } from '@0xintuition/protocol'
import { formatEther } from 'viem'

const rewards = await trustBondingGetUserCurrentClaimableRewards(
  { address: bondingAddress, publicClient },
  { args: [userAddress] }
)
console.log('Claimable rewards:', formatEther(rewards))
```

---

## trustBondingGetUserRewardsForEpoch

Get user's rewards for a specific epoch.

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
import { trustBondingGetUserRewardsForEpoch } from '@0xintuition/protocol'

const epochRewards = await trustBondingGetUserRewardsForEpoch(
  { address: bondingAddress, publicClient },
  { args: [userAddress, epochNumber] }
)
console.log('Epoch rewards:', formatEther(epochRewards))
```

---

## trustBondingGetUnclaimedRewardsForEpoch

Get unclaimed system rewards for an epoch.

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
import { trustBondingGetUnclaimedRewardsForEpoch } from '@0xintuition/protocol'

const unclaimed = await trustBondingGetUnclaimedRewardsForEpoch(
  { address: bondingAddress, publicClient },
  { args: [epochNumber] }
)
console.log('Unclaimed rewards:', formatEther(unclaimed))
```

---

## trustBondingUserEligibleRewardsForEpoch

Get eligible rewards for a user in an epoch.

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
import { trustBondingUserEligibleRewardsForEpoch } from '@0xintuition/protocol'

const eligible = await trustBondingUserEligibleRewardsForEpoch(
  { address: bondingAddress, publicClient },
  { args: [userAddress, epochNumber] }
)
console.log('Eligible rewards:', formatEther(eligible))
```

---

## trustBondingHasClaimedRewardsForEpoch

Check if user has claimed rewards for an epoch.

### Parameters

| Parameter | Type | Description | Required |
|-----------|------|-------------|----------|
| config | `ReadConfig` | Contract address and publicClient | Yes |
| args | `[Address, bigint]` | User address, epoch number | Yes |

### Returns

```typescript
Promise<boolean>
```

### Example

```typescript
import { trustBondingHasClaimedRewardsForEpoch } from '@0xintuition/protocol'

const hasClaimed = await trustBondingHasClaimedRewardsForEpoch(
  { address: bondingAddress, publicClient },
  { args: [userAddress, epochNumber] }
)

if (hasClaimed) {
  console.log('Rewards already claimed for this epoch')
} else {
  console.log('Rewards available to claim')
}
```

---

## trustBondingGetSystemUtilizationRatio

Get system-wide utilization ratio.

### Returns

```typescript
Promise<bigint>
```

### Example

```typescript
import { trustBondingGetSystemUtilizationRatio } from '@0xintuition/protocol'

const ratio = await trustBondingGetSystemUtilizationRatio({ address: bondingAddress, publicClient })
console.log('System utilization ratio:', ratio)
```

---

## trustBondingGetPersonalUtilizationRatio

Get user's personal utilization ratio.

### Parameters

| Parameter | Type | Description | Required |
|-----------|------|-------------|----------|
| config | `ReadConfig` | Contract address and publicClient | Yes |
| args | `[Address]` | User address | Yes |

### Returns

```typescript
Promise<bigint>
```

### Example

```typescript
import { trustBondingGetPersonalUtilizationRatio } from '@0xintuition/protocol'

const personalRatio = await trustBondingGetPersonalUtilizationRatio(
  { address: bondingAddress, publicClient },
  { args: [userAddress] }
)
console.log('Personal utilization ratio:', personalRatio)
```

---

## trustBondingGetUserInfo

Get comprehensive user bonding information.

### Parameters

| Parameter | Type | Description | Required |
|-----------|------|-------------|----------|
| config | `ReadConfig` | Contract address and publicClient | Yes |
| args | `[Address]` | User address | Yes |

### Returns

```typescript
Promise<UserInfo> // Complete user bonding data
```

### Example

```typescript
import { trustBondingGetUserInfo } from '@0xintuition/protocol'

const userInfo = await trustBondingGetUserInfo(
  { address: bondingAddress, publicClient },
  { args: [userAddress] }
)
console.log('User bonding info:', userInfo)
```

---

## trustBondingEmissionsForEpoch

Get total emissions for an epoch.

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
import { trustBondingEmissionsForEpoch } from '@0xintuition/protocol'

const emissions = await trustBondingEmissionsForEpoch(
  { address: bondingAddress, publicClient },
  { args: [epochNumber] }
)
console.log('Epoch emissions:', formatEther(emissions))
```

---

## See Also

- [Core Concepts: Epochs](/docs/protocol/core-concepts/epochs)
- [Examples: Trust Bonding](/docs/protocol/examples/trust-bonding)
