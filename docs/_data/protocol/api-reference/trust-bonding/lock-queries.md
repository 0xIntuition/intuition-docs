---
title: Lock Queries
sidebar_label: Lock Queries
sidebar_position: 5
description: API reference for Trust Bonding lock query functions
keywords: [locks, queries, bonding]
---

# Lock Queries

Functions for querying lock information in the Trust Bonding system (if applicable).

## Note

Lock functionality may be implemented through the broader bonding mechanism. User positions and bonded balances can be queried through:

## Query User Position

```typescript
import {
  trustBondingGetUserInfo,
  trustBondingTotalBondedBalance,
  getContractAddressFromChainId,
} from '@0xintuition/protocol'
import { formatEther } from 'viem'

const bondingAddress = getContractAddressFromChainId('TrustBonding', chainId)

// Get comprehensive user information
const userInfo = await trustBondingGetUserInfo(
  { address: bondingAddress, publicClient },
  { args: [userAddress] }
)

console.log('User bonding info:', {
  bondedBalance: formatEther(userInfo.bondedBalance),
  lastActiveEpoch: userInfo.lastActiveEpoch,
  claimedEpochs: userInfo.claimedEpochs,
})

// Get total system bonded balance
const totalBonded = await trustBondingTotalBondedBalance({
  address: bondingAddress,
  publicClient,
})

console.log('Total bonded:', formatEther(totalBonded))
```

## Query User Shares in Vaults

```typescript
import { multiVaultGetShares, getMultiVaultAddressFromChainId } from '@0xintuition/protocol'

const multiVaultAddress = getMultiVaultAddressFromChainId(chainId)

// Get user's shares in a specific vault
const shares = await multiVaultGetShares(
  { address: multiVaultAddress, publicClient },
  { args: [userAddress, vaultId] }
)

console.log('Vault shares:', formatEther(shares))
```

## Maximum Redeemable Amount

```typescript
import { multiVaultMaxRedeem } from '@0xintuition/protocol'

// Get maximum redeemable shares (similar to lock balance)
const maxShares = await multiVaultMaxRedeem(
  { address: multiVaultAddress, publicClient },
  { args: [userAddress, vaultId] }
)

console.log('Max redeemable:', formatEther(maxShares))
```

---

## See Also

- [Trust Bonding Balances](/docs/protocol/api-reference/trust-bonding/balances)
- [Vault Queries](/docs/protocol/api-reference/multivault/vault-queries)
- [Share Conversions](/docs/protocol/api-reference/multivault/conversions)
