---
title: Working with Vaults
sidebar_label: Vaults
sidebar_position: 6
description: Deposit, redeem, and query vaults using the SDK
---

# Working with Vaults

**Conceptual overview:** [Signals Fundamentals](/docs/guides/core-concepts/primitives/signals/fundamentals)

Vaults enable staking on atoms and triples through bonding curve-based share pricing. This guide covers deposits, redemptions, queries, and preview operations.

## Table of Contents

- [Deposits](#deposits)
- [Redemptions](#redemptions)
- [Vault Queries](#vault-queries)
- [Preview Operations](#preview-operations)

---

## Deposits

Deposit assets into atom or triple vaults to receive shares based on bonding curve pricing.

### deposit

Deposit assets into a single vault.

#### Function Signature

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

#### Parameters

| Parameter | Type | Description | Required |
|-----------|------|-------------|----------|
| `receiver` | `Address` | Address receiving shares | Yes |
| `termId` | `Hex` | Atom or triple ID | Yes |
| `curveId` | `bigint` | Bonding curve ID (use 1n) | Yes |
| `assets` | `bigint` | Amount to deposit (wei) | Yes |
| `minShares` | `bigint` | Minimum shares to receive | Yes |

#### Basic Example

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

#### Advanced Example with Preview

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

    console.log('Deposit successful')
    console.log('Total shares:', shares.toString())

  } catch (error) {
    console.error('Deposit failed:', error)
    throw error
  }
}
```

### batchDeposit

Deposit into multiple vaults in a single transaction.

#### Function Signature

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

#### Basic Example

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

### Common Use Cases

#### Deposit into Atom Vault

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

#### Deposit into Triple Vault (FOR position)

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

#### Deposit into Counter Vault (AGAINST position)

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

### Understanding Shares

#### Share Calculation

Shares are calculated based on the bonding curve:

- Early depositors get more shares per TRUST
- Later depositors get fewer shares per TRUST
- Share price increases with total deposits

#### Checking Share Balance

```typescript
import { multiVaultGetShares } from '@0xintuition/sdk'

const shares = await multiVaultGetShares(
  { address, publicClient },
  { args: [walletClient.account.address, vaultId] }
)

console.log('Your shares:', shares.toString())
```

### Slippage Protection

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

---

## Redemptions

Redeem shares from atom or triple vaults to receive assets back.

### redeem

Redeem shares from a single vault.

#### Function Signature

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

#### Parameters

| Parameter | Type | Description | Required |
|-----------|------|-------------|----------|
| `receiver` | `Address` | Address receiving assets | Yes |
| `termId` | `Hex` | Atom or triple ID | Yes |
| `curveId` | `bigint` | Bonding curve ID (use 1n) | Yes |
| `shares` | `bigint` | Shares to redeem | Yes |
| `minAssets` | `bigint` | Minimum assets to receive | Yes |

#### Basic Example

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

#### Advanced Example with Preview

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

    console.log('Redemption successful')

  } catch (error) {
    console.error('Redemption failed:', error)
    throw error
  }
}
```

### batchRedeem

Redeem shares from multiple vaults in a single transaction.

#### Function Signature

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

#### Basic Example

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

### Common Use Cases

#### Exit a Position

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

#### Partial Redemption

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

### Understanding Exit Fees

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

### Slippage Protection

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

---

## Vault Queries

Query vault information including share balances, vault details, and asset conversions.

### multiVaultGetShares

Get a user's share balance in a vault.

#### Function Signature

```typescript
function multiVaultGetShares(
  config: ReadConfig,
  args: { args: [account: Address, termId: Hex] }
): Promise<bigint>
```

#### Basic Example

```typescript
import { multiVaultGetShares } from '@0xintuition/sdk'

const shares = await multiVaultGetShares(
  { address, publicClient },
  { args: [walletClient.account.address, vaultId] }
)

console.log('Your shares:', shares.toString())
```

### multiVaultGetVault

Get comprehensive vault details.

#### Function Signature

```typescript
function multiVaultGetVault(
  config: ReadConfig,
  args: { args: [termId: Hex] }
): Promise<VaultDetails>
```

#### Basic Example

```typescript
import { multiVaultGetVault } from '@0xintuition/sdk'

const vault = await multiVaultGetVault(
  { address, publicClient },
  { args: [vaultId] }
)

console.log('Total assets:', vault.totalAssets)
console.log('Total shares:', vault.totalShares)
```

### multiVaultCurrentSharePrice

Get the current share price for a vault.

#### Function Signature

```typescript
function multiVaultCurrentSharePrice(
  config: ReadConfig,
  args: { args: [termId: Hex, curveId: bigint] }
): Promise<bigint>
```

#### Basic Example

```typescript
import { multiVaultCurrentSharePrice } from '@0xintuition/sdk'
import { formatEther } from 'viem'

const price = await multiVaultCurrentSharePrice(
  { address, publicClient },
  { args: [vaultId, 1n] }
)

console.log('Share price:', formatEther(price), 'TRUST')
```

---

## Preview Operations

Preview deposit and redemption operations to calculate expected outcomes before executing transactions.

### multiVaultPreviewDeposit

Preview how many shares you'll receive for a deposit.

#### Function Signature

```typescript
function multiVaultPreviewDeposit(
  config: ReadConfig,
  args: { args: [termId: Hex, curveId: bigint, assets: bigint] }
): Promise<bigint>
```

#### Basic Example

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

### multiVaultPreviewRedeem

Preview how many assets you'll receive for redeeming shares.

#### Function Signature

```typescript
function multiVaultPreviewRedeem(
  config: ReadConfig,
  args: { args: [termId: Hex, curveId: bigint, shares: bigint] }
): Promise<bigint>
```

#### Basic Example

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

### Use Cases

#### Calculate Slippage Protection

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

#### Compare Multiple Vaults

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

---

## Complete Examples

See working examples:
- [Deposit into Vault](/docs/guides/developer-tools/sdk/examples/deposit-into-vault)
- [Vault Operations](/docs/guides/developer-tools/sdk/examples/vault-operations)

## Next Steps

- [Search and Discovery](/docs/guides/developer-tools/sdk/search-guide) - Find atoms and triples
- [SDK Integrations](/docs/guides/developer-tools/sdk/integrations/react) - Use with React
- [Protocol Reference](/docs/guides/developer-tools/protocol/api-reference/multivault/vaults) - Low-level vault operations
