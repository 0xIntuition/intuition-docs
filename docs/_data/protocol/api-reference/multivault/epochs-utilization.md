---
title: Epochs & Utilization
sidebar_label: Epochs & Utilization
sidebar_position: 7
description: API reference for epoch and utilization tracking functions
keywords: [epochs, utilization, tracking, rewards]
---

# Epochs & Utilization

Functions for querying epoch information and utilization metrics.

## multiVaultCurrentEpoch

Get the current epoch number.

### Returns

```typescript
Promise<bigint> // Current epoch number
```

### Example

```typescript
import { multiVaultCurrentEpoch } from '@0xintuition/protocol'

const epoch = await multiVaultCurrentEpoch({ address, publicClient })
console.log('Current epoch:', epoch)
```

---

## multiVaultGetTotalUtilizationForEpoch

Get total protocol utilization for an epoch.

### Parameters

| Parameter | Type | Description | Required |
|-----------|------|-------------|----------|
| config | `ReadConfig` | Contract address and publicClient | Yes |
| args | `[bigint]` | Epoch number | Yes |

### Returns

```typescript
Promise<bigint> // Total utilization
```

### Example

```typescript
import { multiVaultGetTotalUtilizationForEpoch } from '@0xintuition/protocol'

const totalUtil = await multiVaultGetTotalUtilizationForEpoch(
  { address, publicClient },
  { args: [epochNumber] }
)

console.log('Total utilization:', totalUtil)
```

---

## multiVaultGetUserUtilizationForEpoch

Get user's total utilization for an epoch.

### Parameters

| Parameter | Type | Description | Required |
|-----------|------|-------------|----------|
| config | `ReadConfig` | Contract address and publicClient | Yes |
| args | `[Address, bigint]` | User address, epoch number | Yes |

### Returns

```typescript
Promise<bigint> // User's total utilization
```

### Example

```typescript
import { multiVaultGetUserUtilizationForEpoch } from '@0xintuition/protocol'

const userUtil = await multiVaultGetUserUtilizationForEpoch(
  { address, publicClient },
  { args: [userAddress, epochNumber] }
)

console.log('User utilization:', userUtil)
```

---

## multiVaultGetUserUtilizationInEpoch

Get user's utilization in a specific vault for an epoch.

### Parameters

| Parameter | Type | Description | Required |
|-----------|------|-------------|----------|
| config | `ReadConfig` | Contract address and publicClient | Yes |
| args | `[Address, bytes32, bigint]` | User address, vaultId, epoch number | Yes |

### Returns

```typescript
Promise<bigint> // User's vault-specific utilization
```

### Example

```typescript
import { multiVaultGetUserUtilizationInEpoch } from '@0xintuition/protocol'

const vaultUtil = await multiVaultGetUserUtilizationInEpoch(
  { address, publicClient },
  { args: [userAddress, vaultId, epochNumber] }
)

console.log('Vault utilization:', vaultUtil)
```

---

## multiVaultGetUserLastActiveEpoch

Get user's last active epoch.

### Parameters

| Parameter | Type | Description | Required |
|-----------|------|-------------|----------|
| config | `ReadConfig` | Contract address and publicClient | Yes |
| args | `[Address]` | User address | Yes |

### Returns

```typescript
Promise<bigint> // Last active epoch number
```

### Example

```typescript
import { multiVaultGetUserLastActiveEpoch } from '@0xintuition/protocol'

const lastEpoch = await multiVaultGetUserLastActiveEpoch(
  { address, publicClient },
  { args: [userAddress] }
)

console.log('Last active epoch:', lastEpoch)
```

---

## See Also

- [Core Concepts: Epochs](/docs/docs/protocol/core-concepts/epochs)
- [Trust Bonding](/docs/docs/protocol/api-reference/trust-bonding/epochs)
