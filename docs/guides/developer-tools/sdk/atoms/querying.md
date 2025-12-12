---
title: Querying Atoms
sidebar_label: Querying
sidebar_position: 7
description: Query atom details and calculate atom IDs
keywords: [sdk, atom, query, details, calculate, id, search]
---

# Querying Atoms

Query atom information and calculate atom IDs for existing or potential atoms.

## getAtomDetails

Fetch comprehensive atom details from the Intuition API.

### Function Signature

```typescript
function getAtomDetails(atomId: string): Promise<AtomDetails>
```

### Parameters

| Parameter | Type | Description | Required |
|-----------|------|-------------|----------|
| `atomId` | `string` | Atom ID (hex string) | Yes |

### Returns

```typescript
type AtomDetails = {
  id: string
  label: string
  creator: Address
  vault: {
    id: string
    totalShares: string
    currentSharePrice: string
    positionCount: number
  }
  // Additional metadata fields
}
```

### Basic Example

```typescript
import { getAtomDetails } from '@0xintuition/sdk'

const atomId = '0x1234567890abcdef...'
const details = await getAtomDetails(atomId)

console.log('Atom Label:', details.label)
console.log('Creator:', details.creator)
console.log('Vault Shares:', details.vault.totalShares)
console.log('Share Price:', details.vault.currentSharePrice)
```

### Advanced Example

Query and display complete atom information:

```typescript
import { getAtomDetails } from '@0xintuition/sdk'

async function displayAtomInfo(atomId: string) {
  try {
    const atom = await getAtomDetails(atomId)

    console.log('=== Atom Details ===')
    console.log('ID:', atom.id)
    console.log('Label:', atom.label)
    console.log('Creator:', atom.creator)
    console.log('')
    console.log('=== Vault Info ===')
    console.log('Total Shares:', atom.vault.totalShares)
    console.log('Share Price:', atom.vault.currentSharePrice)
    console.log('Positions:', atom.vault.positionCount)

    return atom

  } catch (error) {
    if (error.message.includes('not found')) {
      console.log('Atom does not exist')
    } else {
      console.error('Error fetching atom:', error)
    }
    throw error
  }
}
```

## calculateAtomId

Calculate the atom ID from atom data without querying the blockchain.

### Function Signature

```typescript
function calculateAtomId(atomData: string): Hex
```

### Parameters

| Parameter | Type | Description | Required |
|-----------|------|-------------|----------|
| `atomData` | `string` | Atom data (URI, address, etc.) | Yes |

### Returns

Returns the keccak256 hash of the atom data as a hex string.

### Basic Example

```typescript
import { calculateAtomId } from '@0xintuition/sdk'

// Calculate ID for a string atom
const atomId = calculateAtomId('developer')
console.log('Atom ID:', atomId)

// Calculate ID for an Ethereum address
const addressAtomId = calculateAtomId('0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045')
console.log('Address Atom ID:', addressAtomId)

// Calculate ID for IPFS URI
const ipfsAtomId = calculateAtomId('ipfs://bafkreib...')
console.log('IPFS Atom ID:', ipfsAtomId)
```

### Use Cases

#### Check if Atom Exists Before Creating

```typescript
import { calculateAtomId, getAtomDetails, createAtomFromString } from '@0xintuition/sdk'

async function createAtomIfNotExists(data: string) {
  // Calculate ID
  const atomId = calculateAtomId(data)

  try {
    // Check if exists
    const existing = await getAtomDetails(atomId)
    console.log('Atom already exists:', atomId)
    return existing
  } catch (error) {
    // Doesn't exist, create it
    console.log('Creating new atom')
    const atom = await createAtomFromString(config, data)
    return atom
  }
}
```

#### Pre-calculate IDs for Batch Operations

```typescript
import { calculateAtomId } from '@0xintuition/sdk'

const data = ['Alice', 'Bob', 'Charlie']

// Calculate all IDs upfront
const atomIds = data.map(calculateAtomId)

console.log('Predicted Atom IDs:')
data.forEach((item, i) => {
  console.log(`  ${item}: ${atomIds[i]}`)
})

// Now create atoms and verify
for (const item of data) {
  const atom = await createAtomFromString(config, item)
  const expectedId = calculateAtomId(item)
  console.log('Match:', atom.state.termId === expectedId)
}
```

## Common Patterns

### Query Atom After Creation

```typescript
import { createAtomFromString, getAtomDetails, wait } from '@0xintuition/sdk'

const atom = await createAtomFromString(config, 'TypeScript')

// Wait for indexing
await wait(atom.transactionHash, {
  pollingInterval: 1000,
  timeout: 30000,
})

// Query details
const details = await getAtomDetails(atom.state.termId)
console.log('Atom indexed:', details.label)
```

### Batch Query Multiple Atoms

```typescript
import { getAtomDetails } from '@0xintuition/sdk'

async function getMultipleAtoms(atomIds: string[]) {
  const atoms = await Promise.all(
    atomIds.map(id => getAtomDetails(id))
  )

  atoms.forEach(atom => {
    console.log(`${atom.label}: ${atom.vault.totalShares} shares`)
  })

  return atoms
}
```

### Find Atom by Data

```typescript
import { calculateAtomId, getAtomDetails } from '@0xintuition/sdk'

async function findAtomByData(data: string) {
  const atomId = calculateAtomId(data)

  try {
    const atom = await getAtomDetails(atomId)
    console.log('Found atom:', atom.label)
    return atom
  } catch (error) {
    console.log('Atom not found for data:', data)
    return null
  }
}

// Usage
const atom = await findAtomByData('developer')
if (atom) {
  console.log('Atom exists with', atom.vault.positionCount, 'positions')
}
```

## Error Handling

```typescript
import { getAtomDetails } from '@0xintuition/sdk'

async function safeGetAtom(atomId: string) {
  try {
    const atom = await getAtomDetails(atomId)
    return { success: true, data: atom }
  } catch (error) {
    if (error.message?.includes('not found')) {
      return { success: false, error: 'Atom does not exist' }
    }
    if (error.message?.includes('network')) {
      return { success: false, error: 'Network error' }
    }
    return { success: false, error: 'Unknown error' }
  }
}
```

## Related Functions

- [**globalSearch**](../search/global-search.md) - Search for atoms by text
- [**findAtomIds**](../search/advanced-queries.md#findatomids) - Batch find atom IDs
- [**semanticSearch**](../search/advanced-queries.md#semanticsearch) - Semantic atom search

## See Also

- [GraphQL: Query Atoms](../../graphql-api/queries/atoms/single-atom.md) - Advanced querying
- [GraphQL: Search](../../graphql-api/queries/atoms/search.md) - Full-text search
- [Example: Find Existing Entities](../examples/find-existing-entities.md)
