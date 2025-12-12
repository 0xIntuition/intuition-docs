---
title: Share & Asset Conversions
sidebar_label: Conversions
sidebar_position: 4
description: API reference for converting between shares and assets
keywords: [shares, assets, conversions, price, balance]
---

# Share & Asset Conversions

Functions for converting between shares and assets, and querying share balances and prices.

## multiVaultConvertToShares

Convert asset amount to expected shares.

### Parameters

| Parameter | Type | Description | Required |
|-----------|------|-------------|----------|
| config | `ReadConfig` | Contract address and publicClient | Yes |
| args | `[bytes32, bigint, bigint]` | VaultId, curveId, assets | Yes |

### Returns

```typescript
Promise<bigint> // Expected shares
```

### Example

```typescript
import { multiVaultConvertToShares } from '@0xintuition/protocol'
import { parseEther, formatEther } from 'viem'

const shares = await multiVaultConvertToShares(
  { address, publicClient },
  { args: [vaultId, 1, parseEther('1')] }
)

console.log('Shares for 1 ETH:', formatEther(shares))
```

---

## multiVaultConvertToAssets

Convert shares to expected assets.

### Parameters

| Parameter | Type | Description | Required |
|-----------|------|-------------|----------|
| config | `ReadConfig` | Contract address and publicClient | Yes |
| args | `[bytes32, bigint, bigint]` | VaultId, curveId, shares | Yes |

### Returns

```typescript
Promise<bigint> // Expected assets
```

### Example

```typescript
import { multiVaultConvertToAssets } from '@0xintuition/protocol'

const assets = await multiVaultConvertToAssets(
  { address, publicClient },
  { args: [vaultId, 1, parseEther('10')] }
)

console.log('Assets for 10 shares:', formatEther(assets))
```

---

## multiVaultGetShares

Get user's share balance in a vault.

### Parameters

| Parameter | Type | Description | Required |
|-----------|------|-------------|----------|
| config | `ReadConfig` | Contract address and publicClient | Yes |
| args | `[Address, bytes32]` | User address, vaultId | Yes |

### Returns

```typescript
Promise<bigint> // User's shares
```

### Example

```typescript
import { multiVaultGetShares } from '@0xintuition/protocol'

const shares = await multiVaultGetShares(
  { address, publicClient },
  { args: [userAddress, vaultId] }
)

console.log('User shares:', formatEther(shares))
```

---

## multiVaultCurrentSharePrice

Get current share price for a vault.

### Parameters

| Parameter | Type | Description | Required |
|-----------|------|-------------|----------|
| config | `ReadConfig` | Contract address and publicClient | Yes |
| args | `[bytes32, bigint]` | VaultId, curveId | Yes |

### Returns

```typescript
Promise<bigint> // Current share price
```

### Example

```typescript
import { multiVaultCurrentSharePrice } from '@0xintuition/protocol'

const price = await multiVaultCurrentSharePrice(
  { address, publicClient },
  { args: [vaultId, 1] }
)

console.log('Share price:', formatEther(price))
```

### Advanced Example

```typescript
// Track price over time
const trackPrice = async () => {
  const prices = []
  for (let i = 0; i < 10; i++) {
    const price = await multiVaultCurrentSharePrice(
      { address, publicClient },
      { args: [vaultId, 1] }
    )
    prices.push({
      timestamp: Date.now(),
      price: formatEther(price),
    })
    await new Promise(resolve => setTimeout(resolve, 60000)) // Wait 1 minute
  }
  return prices
}
```

---

## multiVaultMaxRedeem

Get maximum redeemable shares for a user.

### Parameters

| Parameter | Type | Description | Required |
|-----------|------|-------------|----------|
| config | `ReadConfig` | Contract address and publicClient | Yes |
| args | `[Address, bytes32]` | User address, vaultId | Yes |

### Returns

```typescript
Promise<bigint> // Maximum redeemable shares
```

### Example

```typescript
import { multiVaultMaxRedeem } from '@0xintuition/protocol'

const maxShares = await multiVaultMaxRedeem(
  { address, publicClient },
  { args: [userAddress, vaultId] }
)

console.log('Max redeemable:', formatEther(maxShares))
```

### Use Case Example

```typescript
// Redeem all shares from a vault
const maxShares = await multiVaultMaxRedeem(
  { address, publicClient },
  { args: [account.address, vaultId] }
)

const expectedAssets = await multiVaultPreviewRedeem(
  { address, publicClient },
  { args: [vaultId, 1, maxShares] }
)

const txHash = await multiVaultRedeem(
  { address, walletClient, publicClient },
  {
    args: [account.address, vaultId, 1, maxShares, 0n],
  }
)
```

---

## See Also

- [Core Concepts: Vaults](/docs/guides/developer-tools/protocol/core-concepts/vaults)
- [Core Concepts: Bonding Curves](/docs/guides/concepts/economics/bonding-curves)
- [Vault Operations](/docs/guides/developer-tools/protocol/api-reference/multivault/vaults)
