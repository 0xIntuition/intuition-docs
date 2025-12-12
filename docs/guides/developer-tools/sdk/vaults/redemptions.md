---
title: Vault Redemptions
sidebar_label: Redemptions
sidebar_position: 2
description: Redeem shares from vaults to receive assets back
keywords: [sdk, vault, redeem, shares, withdraw, exit]
---

# Vault Redemptions

Redeem shares from atom or triple vaults to receive assets back.

## redeem

Redeem shares from a single vault.

### Function Signature

```typescript
function redeem(
  config: WriteConfig,
  args: [
    receiver: Address,
    termId: Hex,
    curveId: bigint,
    shares: bigint,
    minAssets: bigint
  ]
): Promise<TransactionReceipt>
```

### Parameters

| Parameter | Type | Description | Required |
|-----------|------|-------------|----------|
| `receiver` | `Address` | Address receiving assets | Yes |
| `termId` | `Hex` | Atom or triple ID | Yes |
| `curveId` | `bigint` | Bonding curve ID (use 1n) | Yes |
| `shares` | `bigint` | Shares to redeem | Yes |
| `minAssets` | `bigint` | Minimum assets to receive | Yes |

### Basic Example

```typescript
import {
  redeem,
  multiVaultGetShares,
  getMultiVaultAddressFromChainId,
  intuitionTestnet,
} from '@0xintuition/sdk'

// Get your share balance
const shares = await multiVaultGetShares(
  { address, publicClient },
  { args: [walletClient.account.address, vaultId] }
)

// Redeem all shares
await redeem(
  { walletClient, publicClient, address },
  [
    walletClient.account.address, // receiver
    vaultId,                       // termId
    1n,                            // curveId
    shares,                        // redeem all shares
    0n,                            // minAssets
  ]
)

console.log('Redeemed', shares.toString(), 'shares')
```

### Advanced Example with Preview

```typescript
import {
  redeem,
  multiVaultPreviewRedeem,
  multiVaultGetShares,
} from '@0xintuition/sdk'
import { formatEther } from 'viem'

async function redeemWithPreview(vaultId: Hex, sharesToRedeem: bigint) {
  try {
    // Preview redemption
    const expectedAssets = await multiVaultPreviewRedeem(
      { address, publicClient },
      { args: [vaultId, 1n, sharesToRedeem] }
    )

    console.log('Redeeming shares:', sharesToRedeem.toString())
    console.log('Expected assets:', formatEther(expectedAssets), 'TRUST')

    // Execute with slippage protection (2%)
    const minAssets = (expectedAssets * 98n) / 100n

    await redeem(
      { walletClient, publicClient, address },
      [
        walletClient.account.address,
        vaultId,
        1n,
        sharesToRedeem,
        minAssets,
      ]
    )

    console.log('✓ Redemption successful')

  } catch (error) {
    console.error('Redemption failed:', error)
    throw error
  }
}
```

## batchRedeem

Redeem shares from multiple vaults in a single transaction.

### Function Signature

```typescript
function batchRedeem(
  config: WriteConfig,
  args: [
    receiver: Address,
    termIds: Hex[],
    curveIds: bigint[],
    sharesArray: bigint[],
    minAssetsArray: bigint[]
  ]
): Promise<TransactionReceipt>
```

### Basic Example

```typescript
import { batchRedeem } from '@0xintuition/sdk'

// Redeem from 3 vaults
await batchRedeem(
  { walletClient, publicClient, address },
  [
    walletClient.account.address,
    [vault1, vault2, vault3],     // termIds
    [1n, 1n, 1n],                  // curveIds
    [shares1, shares2, shares3],   // shares to redeem
    [0n, 0n, 0n],                  // minAssets
  ]
)

console.log('Redeemed from 3 vaults')
```

## Common Use Cases

### Exit a Position

```typescript
import { multiVaultGetShares, redeem } from '@0xintuition/sdk'

// Get all shares
const shares = await multiVaultGetShares(
  { address, publicClient },
  { args: [walletClient.account.address, vaultId] }
)

// Redeem all
await redeem(config, [
  walletClient.account.address,
  vaultId,
  1n,
  shares,
  0n,
])
```

### Partial Redemption

```typescript
// Redeem 50% of shares
const totalShares = await multiVaultGetShares(
  { address, publicClient },
  { args: [walletClient.account.address, vaultId] }
)

const halfShares = totalShares / 2n

await redeem(config, [
  walletClient.account.address,
  vaultId,
  1n,
  halfShares,
  0n,
])
```

## Understanding Exit Fees

Redemptions may include exit fees:

```typescript
import { multiVaultExitFeeAmount } from '@0xintuition/sdk'

// Calculate exit fee
const exitFee = await multiVaultExitFeeAmount(
  { address, publicClient },
  { args: [vaultId, assets] }
)

console.log('Exit fee:', formatEther(exitFee), 'TRUST')
```

## Slippage Protection

Set `minAssets` to protect against price movement:

```typescript
// Preview redemption
const expectedAssets = await multiVaultPreviewRedeem(
  { address, publicClient },
  { args: [vaultId, 1n, shares] }
)

// Set 1% slippage tolerance
const minAssets = (expectedAssets * 99n) / 100n

await redeem(config, [
  walletClient.account.address,
  vaultId,
  1n,
  shares,
  minAssets, // Transaction reverts if assets < minAssets
])
```

## Related Functions

- [**deposit**](./deposits.md) - Deposit into vaults
- [**multiVaultPreviewRedeem**](./previews.md) - Preview redemption
- [**multiVaultGetShares**](./queries.md) - Check share balance

## See Also

- [Protocol: Redemptions](../../protocol/api-reference/multivault/vaults.md)
- [Core Concepts: Shares](../../../../core-concepts/primitives/signals/capturing.md)
