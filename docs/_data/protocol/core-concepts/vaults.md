---
title: Vaults & Shares
sidebar_label: Vaults & Shares
sidebar_position: 3
description: Understanding vault mechanics and share-based deposits in the Intuition Protocol
keywords: [vaults, shares, deposits, redemptions, bonding curve, liquidity]
---

# Vaults & Shares

Every atom and triple has an associated **vault** that holds deposited assets. Users receive **shares** representing their ownership when they deposit, with prices determined by bonding curves.

## What is a Vault?

A vault is a container for assets associated with an atom or triple:

- **Assets**: Total deposited value (in native token)
- **Shares**: Tokenized ownership stakes
- **Share Price**: Determined by bonding curve
- **Vault ID**: Same as the atom/triple ID

## Depositing to Vaults

### Basic Deposit

```typescript
import { multiVaultDeposit } from '@0xintuition/protocol'
import { parseEther } from 'viem'

const vaultId = '0x1234...' // Atom or triple ID
const curveId = 1 // LinearCurve
const depositAmount = parseEther('1')

const txHash = await multiVaultDeposit(
  { address, walletClient, publicClient },
  {
    args: [
      account.address, // receiver
      vaultId,
      curveId,
      0n, // minShares (slippage protection)
    ],
    value: depositAmount,
  }
)
```

### Preview Deposit

Check expected shares before depositing:

```typescript
import { multiVaultPreviewDeposit } from '@0xintuition/protocol'

const expectedShares = await multiVaultPreviewDeposit(
  { address, publicClient },
  { args: [vaultId, curveId, depositAmount] }
)

// Apply slippage tolerance (1%)
const minShares = (expectedShares * 99n) / 100n

const txHash = await multiVaultDeposit(
  { address, walletClient, publicClient },
  {
    args: [account.address, vaultId, curveId, minShares],
    value: depositAmount,
  }
)
```

### Batch Deposits

Deposit to multiple vaults in one transaction:

```typescript
import { multiVaultDepositBatch } from '@0xintuition/protocol'

const vaults = ['0x1234...', '0x2345...', '0x3456...']
const curves = [1, 1, 2] // Mix of curves
const deposits = [parseEther('0.5'), parseEther('1'), parseEther('0.25')]
const minShares = [0n, 0n, 0n]

const totalValue = deposits.reduce((a, b) => a + b, 0n)

const txHash = await multiVaultDepositBatch(
  { address, walletClient, publicClient },
  {
    args: [account.address, vaults, curves, deposits, minShares],
    value: totalValue,
  }
)
```

## Redeeming Shares

### Basic Redemption

```typescript
import { multiVaultRedeem } from '@0xintuition/protocol'

const shares = parseEther('10')

const txHash = await multiVaultRedeem(
  { address, walletClient, publicClient },
  {
    args: [
      account.address, // receiver
      vaultId,
      curveId,
      shares,
      0n, // minAssets (slippage protection)
    ],
  }
)
```

### Preview Redemption

Check expected assets before redeeming:

```typescript
import { multiVaultPreviewRedeem } from '@0xintuition/protocol'

const expectedAssets = await multiVaultPreviewRedeem(
  { address, publicClient },
  { args: [vaultId, curveId, shares] }
)

// Apply slippage tolerance (1%)
const minAssets = (expectedAssets * 99n) / 100n

const txHash = await multiVaultRedeem(
  { address, walletClient, publicClient },
  {
    args: [account.address, vaultId, curveId, shares, minAssets],
  }
)
```

### Batch Redemptions

```typescript
import { multiVaultRedeemBatch } from '@0xintuition/protocol'

const vaults = ['0x1234...', '0x2345...']
const curves = [1, 2]
const sharesToRedeem = [parseEther('5'), parseEther('3')]
const minAssets = [0n, 0n]

const txHash = await multiVaultRedeemBatch(
  { address, walletClient, publicClient },
  {
    args: [sharesToRedeem, account.address, vaults, curves, minAssets],
  }
)
```

## Share & Asset Conversions

### Convert Assets to Shares

```typescript
import { multiVaultConvertToShares } from '@0xintuition/protocol'

const shares = await multiVaultConvertToShares(
  { address, publicClient },
  { args: [vaultId, curveId, assets] }
)
```

### Convert Shares to Assets

```typescript
import { multiVaultConvertToAssets } from '@0xintuition/protocol'

const assets = await multiVaultConvertToAssets(
  { address, publicClient },
  { args: [vaultId, curveId, shares] }
)
```

### Get Current Share Price

```typescript
import { multiVaultCurrentSharePrice } from '@0xintuition/protocol'

const price = await multiVaultCurrentSharePrice(
  { address, publicClient },
  { args: [vaultId, curveId] }
)
```

## Querying Vault State

### Get User Shares

```typescript
import { multiVaultGetShares } from '@0xintuition/protocol'

const userShares = await multiVaultGetShares(
  { address, publicClient },
  { args: [userAddress, vaultId] }
)
```

### Get Maximum Redeemable Shares

```typescript
import { multiVaultMaxRedeem } from '@0xintuition/protocol'

const maxShares = await multiVaultMaxRedeem(
  { address, publicClient },
  { args: [userAddress, vaultId] }
)
```

### Get Vault Details

```typescript
import { multiVaultGetVault } from '@0xintuition/protocol'

const vault = await multiVaultGetVault(
  { address, publicClient },
  { args: [vaultId] }
)
```

### Get Vault Type

```typescript
import { multiVaultGetVaultType } from '@0xintuition/protocol'

const vaultType = await multiVaultGetVaultType(
  { address, publicClient },
  { args: [vaultId] }
)
// Returns: 0 (atom) or 1 (triple)
```

## Fees

Deposits and redemptions incur fees:

### Entry Fee

```typescript
import { multiVaultEntryFeeAmount } from '@0xintuition/protocol'

const entryFee = await multiVaultEntryFeeAmount(
  { address, publicClient },
  { args: [vaultId, assets] }
)
```

### Exit Fee

```typescript
import { multiVaultExitFeeAmount } from '@0xintuition/protocol'

const exitFee = await multiVaultExitFeeAmount(
  { address, publicClient },
  { args: [vaultId, assets] }
)
```

### Protocol Fee

```typescript
import { multiVaultProtocolFeeAmount } from '@0xintuition/protocol'

const protocolFee = await multiVaultProtocolFeeAmount(
  { address, publicClient },
  { args: [vaultId, assets] }
)
```

## Common Use Cases

### Signal Support for an Atom

```typescript
const atomId = '0x1234...'
const depositAmount = parseEther('0.5')

const txHash = await multiVaultDeposit(
  { address, walletClient, publicClient },
  {
    args: [account.address, atomId, 1, 0n],
    value: depositAmount,
  }
)
```

### Stake For/Against a Statement

```typescript
// Stake FOR a triple
const txHashFor = await multiVaultDeposit(
  { address, walletClient, publicClient },
  {
    args: [account.address, tripleId, 1, 0n],
    value: parseEther('1'),
  }
)

// Get counter-triple and stake AGAINST
const triple = await multiVaultGetTriple(
  { address, publicClient },
  { args: [tripleId] }
)
const counterVaultId = triple[4]

const txHashAgainst = await multiVaultDeposit(
  { address, walletClient, publicClient },
  {
    args: [account.address, counterVaultId, 1, 0n],
    value: parseEther('1'),
  }
)
```

## Related Functions

- [multiVaultDeposit](/docs/protocol/api-reference/multivault/vaults#multivaultdeposit) - Deposit to vault
- [multiVaultRedeem](/docs/protocol/api-reference/multivault/vaults#multivaultredeem) - Redeem shares
- [multiVaultPreviewDeposit](/docs/protocol/api-reference/multivault/vaults#multivaultpreviewdeposit) - Preview deposit
- [multiVaultGetShares](/docs/protocol/api-reference/multivault/conversions#multivaultgetshares) - Get user shares

## Next Steps

- [Bonding Curves](/docs/intuition-concepts/economics/bonding-curves) - Understand pricing mechanics
- [Examples](/docs/protocol/examples/deposit-redeem) - See complete deposit/redeem workflows
