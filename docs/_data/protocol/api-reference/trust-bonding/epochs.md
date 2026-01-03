---
title: Epoch Management
sidebar_label: Epochs
sidebar_position: 1
description: API reference for Trust Bonding epoch management functions
keywords: [epochs, trust bonding, timestamp, epoch length]
---

# Epoch Management

Functions for managing and querying epoch information in the Trust Bonding contract.

## trustBondingCurrentEpoch

Get the current epoch number.

### Returns

```typescript
Promise<bigint> // Current epoch number
```

### Example

```typescript
import { trustBondingCurrentEpoch, getContractAddressFromChainId } from '@0xintuition/protocol'

const bondingAddress = getContractAddressFromChainId('TrustBonding', chainId)
const epoch = await trustBondingCurrentEpoch({ address: bondingAddress, publicClient })
console.log('Current epoch:', epoch)
```

---

## trustBondingPreviousEpoch

Get the previous epoch number.

### Returns

```typescript
Promise<bigint>
```

### Example

```typescript
import { trustBondingPreviousEpoch } from '@0xintuition/protocol'

const prevEpoch = await trustBondingPreviousEpoch({ address: bondingAddress, publicClient })
console.log('Previous epoch:', prevEpoch)
```

---

## trustBondingEpochAtTimestamp

Get the epoch number for a specific timestamp.

### Parameters

| Parameter | Type | Description | Required |
|-----------|------|-------------|----------|
| config | `ReadConfig` | Contract address and publicClient | Yes |
| args | `[bigint]` | Unix timestamp | Yes |

### Returns

```typescript
Promise<bigint> // Epoch number at timestamp
```

### Example

```typescript
import { trustBondingEpochAtTimestamp } from '@0xintuition/protocol'

const timestamp = BigInt(Math.floor(Date.now() / 1000))
const epoch = await trustBondingEpochAtTimestamp(
  { address: bondingAddress, publicClient },
  { args: [timestamp] }
)
console.log('Epoch at timestamp:', epoch)
```

---

## trustBondingEpochTimestampEnd

Get the end timestamp for an epoch.

### Parameters

| Parameter | Type | Description | Required |
|-----------|------|-------------|----------|
| config | `ReadConfig` | Contract address and publicClient | Yes |
| args | `[bigint]` | Epoch number | Yes |

### Returns

```typescript
Promise<bigint> // Epoch end timestamp
```

### Example

```typescript
import { trustBondingEpochTimestampEnd } from '@0xintuition/protocol'

const endTime = await trustBondingEpochTimestampEnd(
  { address: bondingAddress, publicClient },
  { args: [epochNumber] }
)

const endDate = new Date(Number(endTime) * 1000)
console.log('Epoch ends:', endDate.toISOString())
```

---

## trustBondingEpochLength

Get the length of an epoch in seconds.

### Returns

```typescript
Promise<bigint> // Epoch duration in seconds
```

### Example

```typescript
import { trustBondingEpochLength } from '@0xintuition/protocol'

const length = await trustBondingEpochLength({ address: bondingAddress, publicClient })
console.log('Epoch length:', length, 'seconds')
console.log('In days:', Number(length) / 86400)
```

---

## trustBondingEpochsPerYear

Get the number of epochs per year.

### Returns

```typescript
Promise<bigint>
```

### Example

```typescript
import { trustBondingEpochsPerYear } from '@0xintuition/protocol'

const epochsPerYear = await trustBondingEpochsPerYear({ address: bondingAddress, publicClient })
console.log('Epochs per year:', epochsPerYear)
```

---

## See Also

- [Core Concepts: Epochs](/docs/docs/protocol/core-concepts/epochs)
- [Trust Bonding Rewards](/docs/docs/protocol/api-reference/trust-bonding/rewards)
