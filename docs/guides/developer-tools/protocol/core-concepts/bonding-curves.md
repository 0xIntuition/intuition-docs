---
title: Bonding Curves
sidebar_label: Bonding Curves
sidebar_position: 4
description: Understanding bonding curves and their role in determining share prices
keywords: [bonding curves, pricing, linear curve, progressive curve, shares, assets]
---

# Bonding Curves

**Bonding curves** determine the relationship between assets deposited and shares minted in vault operations. The Intuition Protocol supports two curve types: LinearCurve and OffsetProgressiveCurve.

## What are Bonding Curves?

Bonding curves are mathematical functions that:
- Calculate share price based on current vault state
- Determine how many shares are minted for a deposit
- Determine how many assets are returned when redeeming shares
- Create dynamic pricing that responds to supply and demand

## Curve Types

### LinearCurve (ID: 1)

A constant price curve where share price remains fixed regardless of deposits:

```typescript
const curveId = 1 // LinearCurve

const txHash = await multiVaultDeposit(
  { address, walletClient, publicClient },
  {
    args: [account.address, vaultId, curveId, minShares],
    value: depositAmount,
  }
)
```

**Characteristics:**
- Fixed 1:1 ratio (1 asset = 1 share)
- Predictable pricing
- No price impact from deposits/redemptions

### OffsetProgressiveCurve (ID: 2)

A progressive curve where price increases with deposits:

```typescript
const curveId = 2 // OffsetProgressiveCurve

const txHash = await multiVaultDeposit(
  { address, walletClient, publicClient },
  {
    args: [account.address, vaultId, curveId, minShares],
    value: depositAmount,
  }
)
```

**Characteristics:**
- Price increases as more assets are deposited
- Early depositors get better prices
- Creates incentives for early participation

## Checking Current Share Price

```typescript
import { multiVaultCurrentSharePrice } from '@0xintuition/protocol'

const price = await multiVaultCurrentSharePrice(
  { address, publicClient },
  { args: [vaultId, curveId] }
)

console.log('Current share price:', price)
```

## Previewing Operations

### Preview Deposit

Calculate expected shares before depositing:

```typescript
import { multiVaultPreviewDeposit } from '@0xintuition/protocol'
import { parseEther, formatEther } from 'viem'

const depositAmount = parseEther('1')

const expectedShares = await multiVaultPreviewDeposit(
  { address, publicClient },
  { args: [vaultId, curveId, depositAmount] }
)

console.log('Expected shares:', formatEther(expectedShares))
```

### Preview Redemption

Calculate expected assets before redeeming:

```typescript
import { multiVaultPreviewRedeem } from '@0xintuition/protocol'

const shares = parseEther('10')

const expectedAssets = await multiVaultPreviewRedeem(
  { address, publicClient },
  { args: [vaultId, curveId, shares] }
)

console.log('Expected assets:', formatEther(expectedAssets))
```

## Converting Between Assets and Shares

### Assets to Shares

```typescript
import { multiVaultConvertToShares } from '@0xintuition/protocol'

const shares = await multiVaultConvertToShares(
  { address, publicClient },
  { args: [vaultId, curveId, assets] }
)
```

### Shares to Assets

```typescript
import { multiVaultConvertToAssets } from '@0xintuition/protocol'

const assets = await multiVaultConvertToAssets(
  { address, publicClient },
  { args: [vaultId, curveId, shares] }
)
```

## Bonding Curve Configuration

Query bonding curve settings:

```typescript
import { multiVaultGetBondingCurveConfig } from '@0xintuition/protocol'

const config = await multiVaultGetBondingCurveConfig({ address, publicClient })
// Returns: { registry }
```

Get curve contract addresses:

```typescript
import { getContractAddressFromChainId } from '@0xintuition/protocol'

const linearCurve = getContractAddressFromChainId('LinearCurve', chainId)
const progressiveCurve = getContractAddressFromChainId('OffsetProgressiveCurve', chainId)
```

## Choosing a Curve

### Use LinearCurve (ID: 1) when:
- You want predictable, stable pricing
- Fair entry for all participants regardless of timing
- Simple mental model for users

### Use OffsetProgressiveCurve (ID: 2) when:
- You want to reward early adopters
- Creating scarcity and urgency
- Building speculative or high-growth vaults

## Price Impact Example

```typescript
import { parseEther, formatEther } from 'viem'

// LinearCurve - consistent pricing
const linear1 = await multiVaultPreviewDeposit(
  { address, publicClient },
  { args: [vaultId, 1, parseEther('1')] }
)
const linear2 = await multiVaultPreviewDeposit(
  { address, publicClient },
  { args: [vaultId, 1, parseEther('10')] }
)

console.log('Linear 1 ETH:', formatEther(linear1)) // ~1
console.log('Linear 10 ETH:', formatEther(linear2)) // ~10

// OffsetProgressiveCurve - price impact
const progressive1 = await multiVaultPreviewDeposit(
  { address, publicClient },
  { args: [vaultId, 2, parseEther('1')] }
)
const progressive2 = await multiVaultPreviewDeposit(
  { address, publicClient },
  { args: [vaultId, 2, parseEther('10')] }
)

console.log('Progressive 1 ETH:', formatEther(progressive1))
console.log('Progressive 10 ETH:', formatEther(progressive2)) // < 10 due to price curve
```

## Related Functions

- [multiVaultCurrentSharePrice](/docs/guides/developer-tools/protocol/api-reference/multivault/conversions#multivaultcurrentshareprice) - Get current price
- [multiVaultPreviewDeposit](/docs/guides/developer-tools/protocol/api-reference/multivault/vaults#multivaultpreviewdeposit) - Preview deposit
- [multiVaultPreviewRedeem](/docs/guides/developer-tools/protocol/api-reference/multivault/vaults#multivaultpreviewredeem) - Preview redemption
- [multiVaultConvertToShares](/docs/guides/developer-tools/protocol/api-reference/multivault/conversions#multivaultconverttoshares) - Convert assets to shares

## Next Steps

- [Epochs](/docs/guides/developer-tools/protocol/core-concepts/epochs) - Understand epoch-based rewards
- [Vaults](/docs/guides/developer-tools/protocol/core-concepts/vaults) - Learn about vault operations
- [Examples](/docs/guides/developer-tools/protocol/examples/deposit-redeem) - See deposit/redeem examples
