---
title: Vault Queries
sidebar_label: Queries
sidebar_position: 3
description: Query vault information including share balances and vault details
keywords: [sdk, vault, query, shares, balance, details]
---

# Vault Queries

Query vault information including share balances, vault details, and asset conversions.

## multiVaultGetShares

Get a user's share balance in a vault.

### Function Signature

```typescript
function multiVaultGetShares(
  config: ReadConfig,
  args: { args: [account: Address, termId: Hex] }
): Promise<bigint>
```

### Basic Example

```typescript
import { multiVaultGetShares } from '@0xintuition/sdk'

const shares = await multiVaultGetShares(
  { address, publicClient },
  { args: [walletClient.account.address, vaultId] }
)

console.log('Your shares:', shares.toString())
```

## multiVaultGetVault

Get comprehensive vault details.

### Function Signature

```typescript
function multiVaultGetVault(
  config: ReadConfig,
  args: { args: [termId: Hex] }
): Promise<VaultDetails>
```

### Basic Example

```typescript
import { multiVaultGetVault } from '@0xintuition/sdk'

const vault = await multiVaultGetVault(
  { address, publicClient },
  { args: [vaultId] }
)

console.log('Total assets:', vault.totalAssets)
console.log('Total shares:', vault.totalShares)
```

## multiVaultCurrentSharePrice

Get the current share price for a vault.

### Function Signature

```typescript
function multiVaultCurrentSharePrice(
  config: ReadConfig,
  args: { args: [termId: Hex, curveId: bigint] }
): Promise<bigint>
```

### Basic Example

```typescript
import { multiVaultCurrentSharePrice } from '@0xintuition/sdk'
import { formatEther } from 'viem'

const price = await multiVaultCurrentSharePrice(
  { address, publicClient },
  { args: [vaultId, 1n] }
)

console.log('Share price:', formatEther(price), 'TRUST')
```

## Related Functions

- [**deposit**](./deposits.md) - Deposit into vaults
- [**redeem**](./redemptions.md) - Redeem shares
- [**multiVaultPreviewDeposit**](./previews.md) - Preview operations

## See Also

- [Protocol: Vault Queries](../../protocol/api-reference/multivault/vault-queries.md)
- [GraphQL: Vault Details](../../graphql-api/queries/vaults/vault-details.md)
