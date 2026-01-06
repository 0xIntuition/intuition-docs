---
title: Staking Operations
sidebar_label: Staking Operations
sidebar_position: 4
description: API reference for Trust Bonding staking operation functions
keywords: [staking, lock, bonding, operations]
---

# Staking Operations

Functions for Trust Bonding staking operations (if applicable based on contract implementation).

## Note

The Trust Bonding contract primarily tracks utilization and distributes rewards. Direct staking operations like creating locks may be handled through the MultiVault deposit mechanism.

## Related Staking Mechanism

Trust Bonding rewards are earned through:

1. **Depositing to vaults** via [multiVaultDeposit](/docs/protocol/api-reference/multivault/vaults#multivaultdeposit)
2. **Vault utilization** tracked by the protocol
3. **Epoch-based rewards** calculated from utilization

### Deposit to Earn Rewards

```typescript
import { multiVaultDeposit } from '@0xintuition/protocol'
import { parseEther } from 'viem'

// Deposit to a vault to start earning bonding rewards
const txHash = await multiVaultDeposit(
  { address: multiVaultAddress, walletClient, publicClient },
  {
    args: [account.address, vaultId, curveId, minShares],
    value: parseEther('1'),
  }
)
```

### Check Your Bonding Position

```typescript
import {
  trustBondingGetUserInfo,
  trustBondingGetUserCurrentClaimableRewards,
  getContractAddressFromChainId,
} from '@0xintuition/protocol'

const bondingAddress = getContractAddressFromChainId('TrustBonding', chainId)

// Get user info
const userInfo = await trustBondingGetUserInfo(
  { address: bondingAddress, publicClient },
  { args: [userAddress] }
)

// Get claimable rewards
const claimable = await trustBondingGetUserCurrentClaimableRewards(
  { address: bondingAddress, publicClient },
  { args: [userAddress] }
)

console.log('Bonding position:', userInfo)
console.log('Claimable rewards:', formatEther(claimable))
```

---

## See Also

- [Vault Operations](/docs/protocol/api-reference/multivault/vaults)
- [Trust Bonding Rewards](/docs/protocol/api-reference/trust-bonding/rewards)
- [Examples: Trust Bonding](/docs/protocol/examples/trust-bonding)
