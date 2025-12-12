---
title: Vault Deposits
sidebar_label: Deposits
sidebar_position: 1
description: Deposit assets into atom and triple vaults to receive shares
keywords: [sdk, vault, deposit, shares, stake, bonding curve]
---

# Vault Deposits

Deposit assets into atom or triple vaults to receive shares based on bonding curve pricing.

## deposit

Deposit assets into a single vault.

### Function Signature

```typescript
function deposit(
  config: WriteConfig,
  args: [
    receiver: Address,
    termId: Hex,
    curveId: bigint,
    assets: bigint,
    minShares: bigint
  ]
): Promise<TransactionReceipt>
```

### Parameters

| Parameter | Type | Description | Required |
|-----------|------|-------------|----------|
| `receiver` | `Address` | Address receiving shares | Yes |
| `termId` | `Hex` | Atom or triple ID | Yes |
| `curveId` | `bigint` | Bonding curve ID (use 1n) | Yes |
| `assets` | `bigint` | Amount to deposit (wei) | Yes |
| `minShares` | `bigint` | Minimum shares to receive | Yes |

### Basic Example

```typescript
import {
  deposit,
  createAtomFromString,
  getMultiVaultAddressFromChainId,
  intuitionTestnet,
} from '@0xintuition/sdk'
import { parseEther } from 'viem'

// Create atom
const atom = await createAtomFromString(config, 'DeFi')
const vaultId = atom.state.termId

// Deposit into vault
await deposit(
  { walletClient, publicClient, address },
  [
    walletClient.account.address, // receiver
    vaultId,                       // termId
    1n,                            // curveId (default curve)
    parseEther('1'),               // deposit 1 TRUST
    0n,                            // minShares (no slippage protection)
  ]
)

console.log('Deposited 1 TRUST into vault')
```

### Advanced Example with Preview

```typescript
import {
  deposit,
  multiVaultPreviewDeposit,
  multiVaultGetShares,
} from '@0xintuition/sdk'
import { parseEther, formatEther } from 'viem'

async function depositWithPreview(vaultId: Hex, amount: bigint) {
  try {
    // Preview deposit
    const expectedShares = await multiVaultPreviewDeposit(
      { address, publicClient },
      { args: [vaultId, 1n, amount] }
    )

    console.log('Depositing:', formatEther(amount), 'TRUST')
    console.log('Expected shares:', expectedShares.toString())

    // Execute deposit with slippage protection (2%)
    const minShares = (expectedShares * 98n) / 100n

    await deposit(
      { walletClient, publicClient, address },
      [
        walletClient.account.address,
        vaultId,
        1n,
        amount,
        minShares, // 2% slippage tolerance
      ]
    )

    // Check new balance
    const shares = await multiVaultGetShares(
      { address, publicClient },
      { args: [walletClient.account.address, vaultId] }
    )

    console.log('✓ Deposit successful')
    console.log('Total shares:', shares.toString())

  } catch (error) {
    console.error('Deposit failed:', error)
    throw error
  }
}
```

## batchDeposit

Deposit into multiple vaults in a single transaction.

### Function Signature

```typescript
function batchDeposit(
  config: WriteConfig,
  args: [
    receiver: Address,
    termIds: Hex[],
    curveIds: bigint[],
    assetsArray: bigint[],
    minSharesArray: bigint[]
  ]
): Promise<TransactionReceipt>
```

### Basic Example

```typescript
import { batchDeposit } from '@0xintuition/sdk'
import { parseEther } from 'viem'

// Deposit into 3 different vaults
await batchDeposit(
  { walletClient, publicClient, address },
  [
    walletClient.account.address,
    [vault1, vault2, vault3],                              // termIds
    [1n, 1n, 1n],                                          // curveIds
    [parseEther('1'), parseEther('0.5'), parseEther('2')], // amounts
    [0n, 0n, 0n],                                          // minShares
  ]
)

console.log('Deposited into 3 vaults')
```

## Common Use Cases

### Deposit into Atom Vault

```typescript
import { createAtomFromString, deposit } from '@0xintuition/sdk'
import { parseEther } from 'viem'

const atom = await createAtomFromString(config, 'TypeScript')

await deposit(config, [
  walletClient.account.address,
  atom.state.termId,
  1n,
  parseEther('0.5'),
  0n,
])
```

### Deposit into Triple Vault (FOR position)

```typescript
import { createTripleStatement, deposit } from '@0xintuition/sdk'
import { parseEther } from 'viem'

const triple = await createTripleStatement(config, tripleArgs)
const tripleId = triple.state[0].args.tripleId

// Deposit into FOR vault
await deposit(config, [
  walletClient.account.address,
  tripleId,
  1n,
  parseEther('1'),
  0n,
])
```

### Deposit into Counter Vault (AGAINST position)

```typescript
import { calculateCounterTripleId, deposit } from '@0xintuition/sdk'
import { parseEther } from 'viem'

const counterVaultId = calculateCounterTripleId(tripleId)

// Deposit into AGAINST vault
await deposit(config, [
  walletClient.account.address,
  counterVaultId,
  1n,
  parseEther('1'),
  0n,
])
```

## Understanding Shares

### Share Calculation

Shares are calculated based on the bonding curve:

- Early depositors get more shares per TRUST
- Later depositors get fewer shares per TRUST
- Share price increases with total deposits

### Checking Share Balance

```typescript
import { multiVaultGetShares } from '@0xintuition/sdk'

const shares = await multiVaultGetShares(
  { address, publicClient },
  { args: [walletClient.account.address, vaultId] }
)

console.log('Your shares:', shares.toString())
```

## Slippage Protection

Set `minShares` to protect against price movement:

```typescript
// Get expected shares
const expectedShares = await multiVaultPreviewDeposit(
  { address, publicClient },
  { args: [vaultId, 1n, depositAmount] }
)

// Set 1% slippage tolerance
const minShares = (expectedShares * 99n) / 100n

await deposit(config, [
  walletClient.account.address,
  vaultId,
  1n,
  depositAmount,
  minShares, // Transaction will revert if shares < minShares
])
```

## Related Functions

- [**redeem**](./redemptions.md) - Redeem shares for assets
- [**multiVaultPreviewDeposit**](./previews.md) - Preview deposit
- [**multiVaultGetShares**](./queries.md) - Check share balance

## See Also

- [Core Concepts: Vaults](../../../../core-concepts/primitives/signals/capturing.md)
- [Protocol: Vault Operations](../../protocol/api-reference/multivault/vaults.md)
- [Example: Deposit into Vault](../examples/deposit-into-vault.md)
