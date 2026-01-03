---
title: Atom Functions
sidebar_label: Atoms
sidebar_position: 1
description: API reference for MultiVault atom management functions
keywords: [atoms, create atoms, atom cost, preview, encode]
---

# Atom Functions

Functions for creating and querying atoms in the MultiVault contract.

## multiVaultCreateAtoms

Create one or more atoms with optional initial deposits.

### Parameters

| Parameter | Type | Description | Required |
|-----------|------|-------------|----------|
| config | `WriteConfig` | Contract address, publicClient, walletClient | Yes |
| args | `[bytes[], bigint[]]` | Array of atom URIs (hex) and deposit amounts | Yes |
| value | `bigint` | Total ETH to send (sum of deposits) | Yes |

### Returns

```typescript
Promise<Hash> // Transaction hash
```

### Basic Example

```typescript
import {
  multiVaultCreateAtoms,
  multiVaultGetAtomCost,
  getMultiVaultAddressFromChainId,
} from '@0xintuition/protocol'
import { toHex } from 'viem'

const address = getMultiVaultAddressFromChainId(chainId)
const atomCost = await multiVaultGetAtomCost({ address, publicClient })

const txHash = await multiVaultCreateAtoms(
  { address, walletClient, publicClient },
  {
    args: [[toHex('Hello, Intuition!')], [atomCost]],
    value: atomCost,
  }
)
```

### Advanced Example

```typescript
import { parseEther } from 'viem'
import { eventParseAtomCreated } from '@0xintuition/protocol'

try {
  const atomCost = await multiVaultGetAtomCost({ address, publicClient })

  // Create multiple atoms with deposits
  const atomUris = [
    toHex('ethereum:0x1234...'),
    toHex('TypeScript'),
    toHex('Web3'),
  ]
  const deposits = [
    atomCost + parseEther('0.1'),
    atomCost + parseEther('0.05'),
    atomCost,
  ]
  const totalValue = deposits.reduce((a, b) => a + b, 0n)

  const txHash = await multiVaultCreateAtoms(
    { address, walletClient, publicClient },
    {
      args: [atomUris, deposits],
      value: totalValue,
    }
  )

  // Parse events to get atom IDs
  const events = await eventParseAtomCreated(publicClient, txHash)
  events.forEach((event, i) => {
    console.log(`Atom ${i}: ${event.args.termId}`)
  })
} catch (error) {
  console.error('Failed to create atoms:', error)
}
```

### Related Functions

- [multiVaultGetAtomCost](#multivaultgetatomcost) - Get atom creation cost
- [multiVaultPreviewAtomCreate](#multivaultpreviewatomcreate) - Preview atom creation
- [eventParseAtomCreated](/docs/guides/developer-tools/protocol/events/atom-events#eventparseatomcreated) - Parse creation events

### Common Use Cases

- **Create identity atoms**: Represent Ethereum addresses on-chain
- **Create tag atoms**: Build categorization systems
- **Batch creation**: Create multiple related atoms in one transaction

---

## multiVaultGetAtom

Query atom details by ID.

### Parameters

| Parameter | Type | Description | Required |
|-----------|------|-------------|----------|
| config | `ReadConfig` | Contract address and publicClient | Yes |
| args | `[bytes32]` | Atom ID to query | Yes |

### Returns

```typescript
Promise<[bigint, bytes, bigint]> // [id, termData, creatorAtomId]
```

### Basic Example

```typescript
import { multiVaultGetAtom } from '@0xintuition/protocol'

const atom = await multiVaultGetAtom(
  { address, publicClient },
  { args: [atomId] }
)

console.log('Atom ID:', atom[0])
console.log('Atom URI:', atom[1])
console.log('Creator:', atom[2])
```

### Advanced Example

```typescript
import { hexToString } from 'viem'

try {
  const atom = await multiVaultGetAtom(
    { address, publicClient },
    { args: [atomId] }
  )

  const atomData = {
    id: atom[0],
    uri: atom[1],
    uriString: hexToString(atom[1]),
    creator: atom[2],
  }

  console.log('Atom details:', atomData)

  // Query creator atom
  const creator = await multiVaultGetAtom(
    { address, publicClient },
    { args: [atom[2]] }
  )
  console.log('Creator URI:', hexToString(creator[1]))
} catch (error) {
  console.error('Atom not found:', error)
}
```

### Related Functions

- [multiVaultCreateAtoms](#multivaultcreateatoms) - Create atoms
- [multiVaultIsTermCreated](/docs/guides/developer-tools/protocol/api-reference/multivault/vault-queries#multivaultistermcreated) - Check if atom exists

### Common Use Cases

- **Verify atom data**: Check atom URI and creator
- **Resolve references**: Get detailed information about atoms referenced in triples

---

## multiVaultGetAtomCost

Get the base cost to create an atom (protocol fee).

### Parameters

| Parameter | Type | Description | Required |
|-----------|------|-------------|----------|
| config | `ReadConfig` | Contract address and publicClient | Yes |

### Returns

```typescript
Promise<bigint> // Atom creation cost in wei
```

### Basic Example

```typescript
import { multiVaultGetAtomCost } from '@0xintuition/protocol'
import { formatEther } from 'viem'

const cost = await multiVaultGetAtomCost({ address, publicClient })
console.log('Atom cost:', formatEther(cost), 'ETH')
```

### Advanced Example

```typescript
import { parseEther, formatEther } from 'viem'

try {
  const atomCost = await multiVaultGetAtomCost({ address, publicClient })

  // Calculate total cost with initial deposit
  const initialDeposit = parseEther('0.1')
  const totalCost = atomCost + initialDeposit

  console.log('Protocol fee:', formatEther(atomCost))
  console.log('Initial deposit:', formatEther(initialDeposit))
  console.log('Total cost:', formatEther(totalCost))

  // Check user balance
  const balance = await publicClient.getBalance({ address: account.address })
  if (balance < totalCost) {
    throw new Error('Insufficient balance')
  }
} catch (error) {
  console.error('Cost calculation failed:', error)
}
```

### Related Functions

- [multiVaultCreateAtoms](#multivaultcreateatoms) - Create atoms with this cost
- [multiVaultGetAtomConfig](/docs/guides/developer-tools/protocol/api-reference/multivault/configuration#multivaultgetatomconfig) - Get detailed atom configuration

### Common Use Cases

- **Budget estimation**: Calculate total cost before creating atoms
- **Wallet preparation**: Ensure sufficient funds for atom creation

---

## multiVaultPreviewAtomCreate

Preview atom creation results before executing the transaction.

### Parameters

| Parameter | Type | Description | Required |
|-----------|------|-------------|----------|
| config | `WriteConfig` | Contract address, publicClient, walletClient | Yes |
| args | `[bytes, bigint]` | Atom URI and deposit amount | Yes |

### Returns

```typescript
Promise<[bigint, bigint, bigint]> // [shares, assetsAfterFixedFees, assetsAfterFees]
```

### Basic Example

```typescript
import { multiVaultPreviewAtomCreate } from '@0xintuition/protocol'
import { parseEther, formatEther } from 'viem'

const atomUri = toHex('example')
const deposit = parseEther('1')

const [shares, afterFixed, afterFees] = await multiVaultPreviewAtomCreate(
  { address, publicClient, walletClient },
  { args: [atomUri, deposit] }
)

console.log('Expected shares:', formatEther(shares))
console.log('After fixed fees:', formatEther(afterFixed))
console.log('After all fees:', formatEther(afterFees))
```

### Advanced Example

```typescript
try {
  const atomCost = await multiVaultGetAtomCost({ address, publicClient })
  const initialDeposit = parseEther('0.5')
  const totalDeposit = atomCost + initialDeposit

  const [shares, afterFixed, afterFees] = await multiVaultPreviewAtomCreate(
    { address, publicClient, walletClient },
    { args: [toHex('My Atom'), totalDeposit] }
  )

  const fees = totalDeposit - afterFees
  const effectivePrice = afterFees / shares

  console.log('Preview Results:')
  console.log('- Shares to receive:', formatEther(shares))
  console.log('- Total fees:', formatEther(fees))
  console.log('- Effective price per share:', formatEther(effectivePrice))

  // Check if acceptable
  const maxAcceptableFees = parseEther('0.01')
  if (fees > maxAcceptableFees) {
    console.warn('Fees too high!')
  }
} catch (error) {
  console.error('Preview failed:', error)
}
```

### Related Functions

- [multiVaultCreateAtoms](#multivaultcreateatoms) - Execute atom creation
- [multiVaultEntryFeeAmount](/docs/guides/developer-tools/protocol/api-reference/multivault/fees#multivaultentryfeeamount) - Calculate entry fees

### Common Use Cases

- **Fee estimation**: Calculate fees before creating atoms
- **Share calculation**: Determine expected shares from deposit

---

## multiVaultCreateAtomsEncode

Encode atom creation call data for building transactions manually.

### Parameters

| Parameter | Type | Description | Required |
|-----------|------|-------------|----------|
| atomUris | `bytes[]` | Array of atom URIs (hex-encoded) | Yes |
| deposits | `bigint[]` | Array of deposit amounts | Yes |

### Returns

```typescript
Hex // Encoded function call data
```

### Basic Example

```typescript
import { multiVaultCreateAtomsEncode } from '@0xintuition/protocol'

const data = multiVaultCreateAtomsEncode(
  [toHex('atom1'), toHex('atom2')],
  [parseEther('1'), parseEther('0.5')]
)

console.log('Encoded data:', data)
```

### Advanced Example

```typescript
import { encodeFunctionData } from 'viem'

try {
  const atomUris = [toHex('atom1'), toHex('atom2'), toHex('atom3')]
  const deposits = [parseEther('1'), parseEther('0.5'), parseEther('0.25')]

  // Encode using helper
  const data = multiVaultCreateAtomsEncode(atomUris, deposits)

  // Build custom transaction
  const tx = {
    to: address,
    data,
    value: deposits.reduce((a, b) => a + b, 0n),
    from: account.address,
  }

  // Estimate gas
  const gas = await publicClient.estimateGas(tx)
  console.log('Estimated gas:', gas)

  // Send transaction
  const hash = await walletClient.sendTransaction({ ...tx, gas })
  console.log('Transaction sent:', hash)
} catch (error) {
  console.error('Encoding failed:', error)
}
```

### Related Functions

- [multiVaultCreateAtoms](#multivaultcreateatoms) - Higher-level creation function
- [multiVaultDepositEncode](/docs/guides/developer-tools/protocol/api-reference/multivault/vaults#multivaultdepositencode) - Encode deposit calls

### Common Use Cases

- **Multicall batching**: Combine multiple contract calls
- **Custom transaction builders**: Build transactions with specific gas/nonce settings
- **Smart contract interactions**: Call from another contract

---

## See Also

- [Core Concepts: Atoms](/docs/guides/developer-tools/protocol/core-concepts/atoms)
- [Atom Events](/docs/guides/developer-tools/protocol/events/atom-events)
- [Examples: Creating Atoms](/docs/guides/developer-tools/protocol/examples/creating-atoms-triples)
