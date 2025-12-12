---
title: Querying Triples
sidebar_label: Querying
sidebar_position: 3
description: Query triple details and calculate triple IDs
keywords: [sdk, triple, query, details, calculate, id]
---

# Querying Triples

Query triple information and calculate triple IDs.

## getTripleDetails

Fetch comprehensive triple details from the Intuition API.

### Function Signature

```typescript
function getTripleDetails(tripleId: string): Promise<TripleDetails>
```

### Parameters

| Parameter | Type | Description | Required |
|-----------|------|-------------|----------|
| `tripleId` | `string` | Triple ID (hex string) | Yes |

### Returns

```typescript
type TripleDetails = {
  id: string
  subject: { id: string, label: string }
  predicate: { id: string, label: string }
  object: { id: string, label: string }
  vault: {
    totalShares: string
    positionCount: number
  }
  counterVault: {
    totalShares: string
    positionCount: number
  }
  creator: Address
  // Additional fields
}
```

### Basic Example

```typescript
import { getTripleDetails } from '@0xintuition/sdk'

const tripleId = '0x4957d3f442acc301...'
const details = await getTripleDetails(tripleId)

console.log('Triple:', details.subject.label, details.predicate.label, details.object.label)
console.log('For Position Shares:', details.vault.totalShares)
console.log('Against Position Shares:', details.counterVault.totalShares)
```

## calculateTripleId

Calculate the triple ID from atom IDs without querying the blockchain.

### Function Signature

```typescript
function calculateTripleId(
  subjectId: Hex,
  predicateId: Hex,
  objectId: Hex
): Hex
```

### Parameters

| Parameter | Type | Description | Required |
|-----------|------|-------------|----------|
| `subjectId` | `Hex` | Subject atom ID | Yes |
| `predicateId` | `Hex` | Predicate atom ID | Yes |
| `objectId` | `Hex` | Object atom ID | Yes |

### Basic Example

```typescript
import { calculateTripleId } from '@0xintuition/sdk'

const tripleId = calculateTripleId(
  '0x1234...', // subject
  '0x5678...', // predicate
  '0x9abc...'  // object
)

console.log('Triple ID:', tripleId)
```

### Use Case: Check if Triple Exists

```typescript
import { calculateTripleId, getTripleDetails } from '@0xintuition/sdk'

async function tripleExists(
  subjectId: Hex,
  predicateId: Hex,
  objectId: Hex
): Promise<boolean> {
  const tripleId = calculateTripleId(subjectId, predicateId, objectId)

  try {
    await getTripleDetails(tripleId)
    return true
  } catch {
    return false
  }
}
```

## Related Functions

- [**createTripleStatement**](./create-triple.md) - Create triples
- [**calculateCounterTripleId**](./counter-triples.md) - Get counter-triple ID

## See Also

- [GraphQL: Query Triples](../../graphql-api/queries/triples/single-triple.md)
- [Example: Find Existing Entities](../examples/find-existing-entities.md)
