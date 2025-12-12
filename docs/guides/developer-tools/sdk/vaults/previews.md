---
title: Vault Previews
sidebar_label: Previews
sidebar_position: 4
description: Preview deposit and redemption operations before executing
keywords: [sdk, vault, preview, estimate, shares, assets]
---

# Vault Previews

Preview deposit and redemption operations to calculate expected outcomes before executing transactions.

## multiVaultPreviewDeposit

Preview how many shares you'll receive for a deposit.

### Function Signature

```typescript
function multiVaultPreviewDeposit(
  config: ReadConfig,
  args: { args: [termId: Hex, curveId: bigint, assets: bigint] }
): Promise<bigint>
```

### Basic Example

```typescript
import { multiVaultPreviewDeposit } from '@0xintuition/sdk'
import { parseEther, formatEther } from 'viem'

const assets = parseEther('1')
const expectedShares = await multiVaultPreviewDeposit(
  { address, publicClient },
  { args: [vaultId, 1n, assets] }
)

console.log('Depositing:', formatEther(assets), 'TRUST')
console.log('Expected shares:', expectedShares.toString())
```

## multiVaultPreviewRedeem

Preview how many assets you'll receive for redeeming shares.

### Function Signature

```typescript
function multiVaultPreviewRedeem(
  config: ReadConfig,
  args: { args: [termId: Hex, curveId: bigint, shares: bigint] }
): Promise<bigint>
```

### Basic Example

```typescript
import { multiVaultPreviewRedeem } from '@0xintuition/sdk'
import { formatEther } from 'viem'

const shares = 1000000n
const expectedAssets = await multiVaultPreviewRedeem(
  { address, publicClient },
  { args: [vaultId, 1n, shares] }
)

console.log('Redeeming:', shares.toString(), 'shares')
console.log('Expected assets:', formatEther(expectedAssets), 'TRUST')
```

## Use Cases

### Calculate Slippage Protection

```typescript
import { multiVaultPreviewDeposit, deposit } from '@0xintuition/sdk'
import { parseEther } from 'viem'

const depositAmount = parseEther('1')

// Preview
const expectedShares = await multiVaultPreviewDeposit(
  { address, publicClient },
  { args: [vaultId, 1n, depositAmount] }
)

// Set 2% slippage tolerance
const minShares = (expectedShares * 98n) / 100n

// Deposit with protection
await deposit(config, [
  walletClient.account.address,
  vaultId,
  1n,
  depositAmount,
  minShares,
])
```

### Compare Multiple Vaults

```typescript
import { multiVaultPreviewDeposit } from '@0xintuition/sdk'
import { parseEther } from 'viem'

const amount = parseEther('1')
const vaults = [vault1, vault2, vault3]

// Preview all vaults
const previews = await Promise.all(
  vaults.map(vaultId =>
    multiVaultPreviewDeposit(
      { address, publicClient },
      { args: [vaultId, 1n, amount] }
    )
  )
)

// Find best vault
const bestIndex = previews.indexOf(Math.max(...previews.map(Number)))
console.log('Best vault:', vaults[bestIndex])
```

## Related Functions

- [**deposit**](./deposits.md) - Execute deposits
- [**redeem**](./redemptions.md) - Execute redemptions
- [**multiVaultGetShares**](./queries.md) - Check balances

## See Also

- [Protocol: Preview Functions](../../protocol/api-reference/multivault/vaults.md)
- [Core Concepts: Bonding Curves](../../../../core-concepts/economics/bonding-curves.md)
