---
title: Vault Operations
sidebar_label: Vaults
sidebar_position: 3
description: API reference for vault deposit and redemption functions
keywords: [vaults, deposit, redeem, batch operations, shares]
---

# Vault Operations

Functions for depositing to and redeeming from vaults.

## multiVaultDeposit

Deposit assets into a vault to receive shares.

### Parameters

| Parameter | Type | Description | Required |
|-----------|------|-------------|----------|
| config | `WriteConfig` | Contract address, publicClient, walletClient | Yes |
| args | `[Address, bytes32, bigint, bigint]` | Receiver, vaultId, curveId, minShares | Yes |
| value | `bigint` | Deposit amount in wei | Yes |

### Example

```typescript
import { multiVaultDeposit } from '@0xintuition/protocol'
import { parseEther } from 'viem'

const txHash = await multiVaultDeposit(
  { address, walletClient, publicClient },
  {
    args: [account.address, vaultId, 1, 0n],
    value: parseEther('1'),
  }
)
```

---

## multiVaultDepositBatch

Deposit to multiple vaults in a single transaction.

### Parameters

| Parameter | Type | Description | Required |
|-----------|------|-------------|----------|
| config | `WriteConfig` | Contract address, publicClient, walletClient | Yes |
| args | `[Address, bytes32[], bigint[], bigint[], bigint[]]` | Receiver, vaultIds, curveIds, assets, minShares | Yes |
| value | `bigint` | Total deposit amount | Yes |

### Example

```typescript
const txHash = await multiVaultDepositBatch(
  { address, walletClient, publicClient },
  {
    args: [
      account.address,
      [vault1, vault2, vault3],
      [1, 1, 2],
      [parseEther('1'), parseEther('0.5'), parseEther('0.25')],
      [0n, 0n, 0n],
    ],
    value: parseEther('1.75'),
  }
)
```

---

## multiVaultRedeem

Redeem shares from a vault to receive assets.

### Parameters

| Parameter | Type | Description | Required |
|-----------|------|-------------|----------|
| config | `WriteConfig` | Contract address, publicClient, walletClient | Yes |
| args | `[Address, bytes32, bigint, bigint, bigint]` | Receiver, vaultId, curveId, shares, minAssets | Yes |

### Example

```typescript
const txHash = await multiVaultRedeem(
  { address, walletClient, publicClient },
  {
    args: [account.address, vaultId, 1, parseEther('10'), 0n],
  }
)
```

---

## multiVaultRedeemBatch

Redeem shares from multiple vaults in a single transaction.

### Parameters

| Parameter | Type | Description | Required |
|-----------|------|-------------|----------|
| config | `WriteConfig` | Contract address, publicClient, walletClient | Yes |
| args | `[bigint[], Address, bytes32[], bigint[], bigint[]]` | Shares, receiver, vaultIds, curveIds, minAssets | Yes |

### Example

```typescript
const txHash = await multiVaultRedeemBatch(
  { address, walletClient, publicClient },
  {
    args: [
      [parseEther('5'), parseEther('3')],
      account.address,
      [vault1, vault2],
      [1, 2],
      [0n, 0n],
    ],
  }
)
```

---

## multiVaultPreviewDeposit

Preview deposit results before executing.

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
const expectedShares = await multiVaultPreviewDeposit(
  { address, publicClient },
  { args: [vaultId, 1, parseEther('1')] }
)

const minShares = (expectedShares * 99n) / 100n // 1% slippage
```

---

## multiVaultPreviewRedeem

Preview redemption results before executing.

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
const expectedAssets = await multiVaultPreviewRedeem(
  { address, publicClient },
  { args: [vaultId, 1, parseEther('10')] }
)

const minAssets = (expectedAssets * 99n) / 100n // 1% slippage
```

---

## multiVaultDepositEncode

Encode deposit call data.

### Example

```typescript
import { multiVaultDepositEncode } from '@0xintuition/protocol'

const data = multiVaultDepositEncode(receiver, vaultId, curveId, minShares)
```

---

## multiVaultRedeemEncode

Encode redeem call data.

### Example

```typescript
import { multiVaultRedeemEncode } from '@0xintuition/protocol'

const data = multiVaultRedeemEncode(receiver, vaultId, curveId, shares, minAssets)
```

---

## multiVaultDepositBatchEncode

Encode batch deposit call data.

### Example

```typescript
import { multiVaultDepositBatchEncode } from '@0xintuition/protocol'

const data = multiVaultDepositBatchEncode(
  receiver,
  [vault1, vault2],
  [curve1, curve2],
  [assets1, assets2],
  [minShares1, minShares2]
)
```

---

## multiVaultRedeemBatchEncode

Encode batch redeem call data.

### Example

```typescript
import { multiVaultRedeemBatchEncode } from '@0xintuition/protocol'

const data = multiVaultRedeemBatchEncode(
  receiver,
  [vault1, vault2],
  [curve1, curve2],
  [shares1, shares2],
  [minAssets1, minAssets2]
)
```

---

## See Also

- [Core Concepts: Vaults](/docs/docs/protocol/core-concepts/vaults)
- [Examples: Deposit & Redeem](/docs/docs/protocol/examples/deposit-redeem)
