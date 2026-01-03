---
title: Trust Bonding Examples
sidebar_label: Trust Bonding
sidebar_position: 3
description: Complete examples for Trust Bonding and rewards
keywords: [examples, trust bonding, rewards, epochs, apy]
---

# Trust Bonding Examples

Complete workflows for tracking rewards and utilization in the Trust Bonding system.

## Example 1: Check Rewards

```typescript
import {
  trustBondingCurrentEpoch,
  trustBondingGetUserApy,
  trustBondingGetUserCurrentClaimableRewards,
  trustBondingGetUserInfo,
  getContractAddressFromChainId,
} from '@0xintuition/protocol'
import { formatEther } from 'viem'

const bondingAddress = getContractAddressFromChainId('TrustBonding', chainId)

// 1. Get current epoch
const currentEpoch = await trustBondingCurrentEpoch({
  address: bondingAddress,
  publicClient,
})
console.log('Current epoch:', currentEpoch)

// 2. Get user APY
const userApy = await trustBondingGetUserApy(
  { address: bondingAddress, publicClient },
  { args: [account.address] }
)
console.log('User APY:', Number(userApy) / 100, '%')

// 3. Check claimable rewards
const claimable = await trustBondingGetUserCurrentClaimableRewards(
  { address: bondingAddress, publicClient },
  { args: [account.address] }
)
console.log('Claimable rewards:', formatEther(claimable))

// 4. Get detailed user info
const userInfo = await trustBondingGetUserInfo(
  { address: bondingAddress, publicClient },
  { args: [account.address] }
)
console.log('User bonding info:', userInfo)
```

## Example 2: Track Historical Rewards

```typescript
import {
  trustBondingGetUserRewardsForEpoch,
  trustBondingPreviousEpoch,
} from '@0xintuition/protocol'

const trackRewards = async (numEpochs: number) => {
  const currentEpoch = await trustBondingCurrentEpoch({
    address: bondingAddress,
    publicClient,
  })

  const rewards = []
  for (let i = 0; i < numEpochs; i++) {
    const epoch = currentEpoch - BigInt(i)
    const reward = await trustBondingGetUserRewardsForEpoch(
      { address: bondingAddress, publicClient },
      { args: [account.address, epoch] }
    )

    rewards.push({
      epoch: epoch.toString(),
      reward: formatEther(reward),
    })
  }

  return rewards
}

const history = await trackRewards(10)
console.log('Reward history:', history)
```

## Example 3: Monitor Utilization

```typescript
import {
  multiVaultGetUserUtilizationForEpoch,
  multiVaultGetTotalUtilizationForEpoch,
} from '@0xintuition/protocol'

const monitorUtilization = async () => {
  const currentEpoch = await multiVaultCurrentEpoch({ address, publicClient })

  // Get user utilization
  const userUtil = await multiVaultGetUserUtilizationForEpoch(
    { address, publicClient },
    { args: [account.address, currentEpoch] }
  )

  // Get total utilization
  const totalUtil = await multiVaultGetTotalUtilizationForEpoch(
    { address, publicClient },
    { args: [currentEpoch] }
  )

  // Calculate share
  const share = (Number(userUtil) / Number(totalUtil) * 100).toFixed(4)

  console.log('User utilization:', userUtil)
  console.log('Total utilization:', totalUtil)
  console.log('User share:', share + '%')
}

await monitorUtilization()
```

## See Also

- [Trust Bonding Rewards](/docs/guides/developer-tools/protocol/api-reference/trust-bonding/rewards)
- [Epoch Management](/docs/guides/developer-tools/protocol/api-reference/trust-bonding/epochs)
- [Core Concepts: Epochs](/docs/guides/developer-tools/protocol/core-concepts/epochs)
