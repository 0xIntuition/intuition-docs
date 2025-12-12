---
title: Epochs & Utilization
sidebar_label: Epochs
sidebar_position: 5
description: Understanding the epoch-based reward system and utilization tracking
keywords: [epochs, utilization, rewards, trust bonding, staking]
---

# Epochs & Utilization

The Intuition Protocol operates on an **epoch-based system** for tracking bonding rewards and vault utilization. Epochs are fixed time periods that determine reward distribution.

## What are Epochs?

An epoch is a fixed time period used to:
- Track vault utilization across the protocol
- Calculate and distribute bonding rewards
- Measure user activity and participation
- Determine APY and reward eligibility

## Epoch Mechanics

### Current Epoch

Get the active epoch number:

```typescript
import { multiVaultCurrentEpoch } from '@0xintuition/protocol'

const epoch = await multiVaultCurrentEpoch({ address, publicClient })
console.log('Current epoch:', epoch)
```

### Epoch Configuration

Query epoch parameters from TrustBonding contract:

```typescript
import {
  trustBondingEpochLength,
  trustBondingEpochsPerYear,
  getContractAddressFromChainId,
} from '@0xintuition/protocol'

const bondingAddress = getContractAddressFromChainId('TrustBonding', chainId)

// Get epoch duration
const epochLength = await trustBondingEpochLength({
  address: bondingAddress,
  publicClient,
})
console.log('Epoch length (seconds):', epochLength)

// Get epochs per year
const epochsPerYear = await trustBondingEpochsPerYear({
  address: bondingAddress,
  publicClient,
})
console.log('Epochs per year:', epochsPerYear)
```

### Epoch at Timestamp

Get the epoch number for a specific time:

```typescript
import { trustBondingEpochAtTimestamp } from '@0xintuition/protocol'

const timestamp = BigInt(Math.floor(Date.now() / 1000))
const epoch = await trustBondingEpochAtTimestamp(
  { address: bondingAddress, publicClient },
  { args: [timestamp] }
)
```

### Epoch End Time

Get when an epoch ends:

```typescript
import { trustBondingEpochTimestampEnd } from '@0xintuition/protocol'

const endTime = await trustBondingEpochTimestampEnd(
  { address: bondingAddress, publicClient },
  { args: [epochNumber] }
)

const endDate = new Date(Number(endTime) * 1000)
console.log('Epoch ends:', endDate)
```

## Utilization Tracking

**Utilization** measures vault activity and influences reward distribution. Higher utilization = higher rewards.

### Total Utilization

Get system-wide utilization for an epoch:

```typescript
import { multiVaultGetTotalUtilizationForEpoch } from '@0xintuition/protocol'

const totalUtil = await multiVaultGetTotalUtilizationForEpoch(
  { address, publicClient },
  { args: [epochNumber] }
)
```

### User Utilization

Get a user's total utilization across all vaults:

```typescript
import { multiVaultGetUserUtilizationForEpoch } from '@0xintuition/protocol'

const userUtil = await multiVaultGetUserUtilizationForEpoch(
  { address, publicClient },
  { args: [userAddress, epochNumber] }
)
```

### Vault-Specific Utilization

Get a user's utilization in a specific vault:

```typescript
import { multiVaultGetUserUtilizationInEpoch } from '@0xintuition/protocol'

const vaultUtil = await multiVaultGetUserUtilizationInEpoch(
  { address, publicClient },
  { args: [userAddress, vaultId, epochNumber] }
)
```

### Last Active Epoch

Get when a user was last active:

```typescript
import { multiVaultGetUserLastActiveEpoch } from '@0xintuition/protocol'

const lastEpoch = await multiVaultGetUserLastActiveEpoch(
  { address, publicClient },
  { args: [userAddress] }
)
```

## Utilization and Rewards

Utilization directly impacts reward distribution:

```typescript
import {
  trustBondingGetUserApy,
  trustBondingGetSystemApy,
  trustBondingGetUserRewardsForEpoch,
} from '@0xintuition/protocol'

// Get user APY (based on utilization)
const userApy = await trustBondingGetUserApy(
  { address: bondingAddress, publicClient },
  { args: [userAddress] }
)

// Get system-wide APY
const systemApy = await trustBondingGetSystemApy({
  address: bondingAddress,
  publicClient,
})

// Get rewards for specific epoch
const rewards = await trustBondingGetUserRewardsForEpoch(
  { address: bondingAddress, publicClient },
  { args: [userAddress, epochNumber] }
)
```

## Utilization Ratios

### System Utilization Ratio

Overall protocol utilization:

```typescript
import { trustBondingGetSystemUtilizationRatio } from '@0xintuition/protocol'

const systemRatio = await trustBondingGetSystemUtilizationRatio({
  address: bondingAddress,
  publicClient,
})
```

### Personal Utilization Ratio

User's relative utilization:

```typescript
import { trustBondingGetPersonalUtilizationRatio } from '@0xintuition/protocol'

const personalRatio = await trustBondingGetPersonalUtilizationRatio(
  { address: bondingAddress, publicClient },
  { args: [userAddress] }
)
```

## Epoch Lifecycle Example

```typescript
// 1. Get current epoch info
const currentEpoch = await multiVaultCurrentEpoch({ address, publicClient })
const previousEpoch = await trustBondingPreviousEpoch({
  address: bondingAddress,
  publicClient,
})

// 2. Check epoch timing
const epochEnd = await trustBondingEpochTimestampEnd(
  { address: bondingAddress, publicClient },
  { args: [currentEpoch] }
)

// 3. Get utilization for previous epoch
const totalUtil = await multiVaultGetTotalUtilizationForEpoch(
  { address, publicClient },
  { args: [previousEpoch] }
)

// 4. Check user rewards
const userRewards = await trustBondingGetUserRewardsForEpoch(
  { address: bondingAddress, publicClient },
  { args: [userAddress, previousEpoch] }
)

// 5. Get emissions for epoch
const emissions = await trustBondingEmissionsForEpoch(
  { address: bondingAddress, publicClient },
  { args: [previousEpoch] }
)
```

## Common Use Cases

### Track Reward Eligibility

```typescript
const lastActive = await multiVaultGetUserLastActiveEpoch(
  { address, publicClient },
  { args: [userAddress] }
)

const currentEpoch = await multiVaultCurrentEpoch({ address, publicClient })

if (lastActive < currentEpoch) {
  console.log('User was active in previous epochs')
}
```

### Calculate Historical Utilization

```typescript
const historicalEpochs = [100n, 101n, 102n]

for (const epoch of historicalEpochs) {
  const util = await multiVaultGetUserUtilizationForEpoch(
    { address, publicClient },
    { args: [userAddress, epoch] }
  )
  console.log(`Epoch ${epoch}: ${util} utilization`)
}
```

### Monitor Real-Time Activity

```typescript
const checkActivity = async () => {
  const epoch = await multiVaultCurrentEpoch({ address, publicClient })
  const util = await multiVaultGetUserUtilizationForEpoch(
    { address, publicClient },
    { args: [userAddress, epoch] }
  )
  return { epoch, utilization: util }
}

// Poll every minute
setInterval(async () => {
  const activity = await checkActivity()
  console.log('Current activity:', activity)
}, 60000)
```

## Related Functions

- [multiVaultCurrentEpoch](/docs/guides/developer-tools/protocol/api-reference/multivault/epochs-utilization#multivaultcurrentepoch) - Get current epoch
- [multiVaultGetTotalUtilizationForEpoch](/docs/guides/developer-tools/protocol/api-reference/multivault/epochs-utilization#multivaultgettotalutilizationforepoch) - Get total utilization
- [trustBondingGetUserApy](/docs/guides/developer-tools/protocol/api-reference/trust-bonding/rewards#trustbondinggetuserapy) - Get user APY
- [Trust Bonding Epochs](/docs/guides/developer-tools/protocol/api-reference/trust-bonding/epochs) - Epoch management functions

## Next Steps

- [Trust Bonding](/docs/guides/developer-tools/protocol/api-reference/trust-bonding/epochs) - Explore bonding system
- [Examples](/docs/guides/developer-tools/protocol/examples/trust-bonding) - See epoch tracking examples
