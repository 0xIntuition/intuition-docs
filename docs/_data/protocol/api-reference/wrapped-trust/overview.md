---
title: Wrapped Trust
sidebar_label: Overview
sidebar_position: 1
description: API reference for Wrapped Trust token functions
keywords: [wrapped trust, deposit, withdraw, token, wrapping]
---

# Wrapped Trust

Functions for wrapping and unwrapping native TRUST tokens.

## wrappedTrustDeposit

Deposit native TRUST to receive wrapped TRUST.

### Parameters

| Parameter | Type | Description | Required |
|-----------|------|-------------|----------|
| config | `WriteConfig` | Contract address, publicClient, walletClient | Yes |
| value | `bigint` | Amount of TRUST to wrap | Yes |

### Returns

```typescript
Promise<Hash> // Transaction hash
```

### Example

```typescript
import { wrappedTrustDeposit, getContractAddressFromChainId } from '@0xintuition/protocol'
import { parseEther } from 'viem'

const wrappedTrustAddress = getContractAddressFromChainId('WrappedTrust', chainId)

const txHash = await wrappedTrustDeposit(
  { address: wrappedTrustAddress, walletClient, publicClient },
  { args: [], value: parseEther('10') }
)

console.log('Wrapped 10 TRUST:', txHash)
```

---

## wrappedTrustWithdraw

Withdraw wrapped TRUST to receive native TRUST.

### Parameters

| Parameter | Type | Description | Required |
|-----------|------|-------------|----------|
| config | `WriteConfig` | Contract address, publicClient, walletClient | Yes |
| args | `[bigint]` | Amount of wrapped TRUST to unwrap | Yes |

### Returns

```typescript
Promise<Hash> // Transaction hash
```

### Example

```typescript
import { wrappedTrustWithdraw } from '@0xintuition/protocol'

const txHash = await wrappedTrustWithdraw(
  { address: wrappedTrustAddress, walletClient, publicClient },
  { args: [parseEther('5')] }
)

console.log('Unwrapped 5 TRUST:', txHash)
```

---

## Standard ERC20 Functions

Wrapped TRUST implements standard ERC20 functions:

### balanceOf

```typescript
// Using viem's readContract
import { readContract } from 'viem'
import { WrappedTrustAbi } from '@0xintuition/protocol'

const balance = await readContract(publicClient, {
  address: wrappedTrustAddress,
  abi: WrappedTrustAbi,
  functionName: 'balanceOf',
  args: [userAddress],
})

console.log('Balance:', formatEther(balance))
```

### totalSupply

```typescript
const totalSupply = await readContract(publicClient, {
  address: wrappedTrustAddress,
  abi: WrappedTrustAbi,
  functionName: 'totalSupply',
})

console.log('Total supply:', formatEther(totalSupply))
```

### allowance

```typescript
const allowance = await readContract(publicClient, {
  address: wrappedTrustAddress,
  abi: WrappedTrustAbi,
  functionName: 'allowance',
  args: [ownerAddress, spenderAddress],
})

console.log('Allowance:', formatEther(allowance))
```

### approve

```typescript
import { writeContract } from 'viem'

const txHash = await writeContract(walletClient, {
  address: wrappedTrustAddress,
  abi: WrappedTrustAbi,
  functionName: 'approve',
  args: [spenderAddress, parseEther('100')],
})

console.log('Approved:', txHash)
```

---

## Complete Example

```typescript
import {
  wrappedTrustDeposit,
  wrappedTrustWithdraw,
  getContractAddressFromChainId,
  WrappedTrustAbi,
} from '@0xintuition/protocol'
import { parseEther, formatEther, readContract } from 'viem'

const wrappedTrustAddress = getContractAddressFromChainId('WrappedTrust', chainId)

// Check native balance
const nativeBalance = await publicClient.getBalance({ address: account.address })
console.log('Native TRUST:', formatEther(nativeBalance))

// Wrap TRUST
const wrapAmount = parseEther('10')
const wrapTx = await wrappedTrustDeposit(
  { address: wrappedTrustAddress, walletClient, publicClient },
  { args: [], value: wrapAmount }
)
console.log('Wrapped:', wrapTx)

// Check wrapped balance
const wrappedBalance = await readContract(publicClient, {
  address: wrappedTrustAddress,
  abi: WrappedTrustAbi,
  functionName: 'balanceOf',
  args: [account.address],
})
console.log('Wrapped TRUST:', formatEther(wrappedBalance))

// Unwrap half
const unwrapAmount = parseEther('5')
const unwrapTx = await wrappedTrustWithdraw(
  { address: wrappedTrustAddress, walletClient, publicClient },
  { args: [unwrapAmount] }
)
console.log('Unwrapped:', unwrapTx)
```

---

## See Also

- [Configuration](/docs/guides/developer-tools/protocol/getting-started/configuration)
