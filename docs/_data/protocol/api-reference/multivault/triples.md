---
title: Triple Functions
sidebar_label: Triples
sidebar_position: 2
description: API reference for MultiVault triple management functions
keywords: [triples, create triples, triple cost, counter triples, inverse]
---

# Triple Functions

Functions for creating and managing triples (statements) in the MultiVault contract.

## multiVaultCreateTriples

Create one or more triples (subject-predicate-object statements).

### Parameters

| Parameter | Type | Description | Required |
|-----------|------|-------------|----------|
| config | `WriteConfig` | Contract address, publicClient, walletClient | Yes |
| args | `[bytes32[], bytes32[], bytes32[], bigint[]]` | Subject IDs, predicate IDs, object IDs, deposit amounts | Yes |
| value | `bigint` | Total ETH to send | Yes |

### Returns

```typescript
Promise<Hash> // Transaction hash
```

### Basic Example

```typescript
import { multiVaultCreateTriples, multiVaultGetTripleCost } from '@0xintuition/protocol'

const tripleCost = await multiVaultGetTripleCost({ address, publicClient })

const txHash = await multiVaultCreateTriples(
  { address, walletClient, publicClient },
  {
    args: [
      [subjectId],
      [predicateId],
      [objectId],
      [tripleCost],
    ],
    value: tripleCost,
  }
)
```

### Advanced Example

```typescript
import { parseEther } from 'viem'
import { eventParseTripleCreated } from '@0xintuition/protocol'

const tripleCost = await multiVaultGetTripleCost({ address, publicClient })

// Create multiple triples
const subjects = [aliceId, bobId, charlieId]
const predicates = [followsId, followsId, followsId]
const objects = [bobId, charlieId, aliceId]
const deposits = subjects.map(() => tripleCost + parseEther('0.1'))
const totalValue = deposits.reduce((a, b) => a + b, 0n)

const txHash = await multiVaultCreateTriples(
  { address, walletClient, publicClient },
  {
    args: [subjects, predicates, objects, deposits],
    value: totalValue,
  }
)

const events = await eventParseTripleCreated(publicClient, txHash)
console.log('Created triple IDs:', events.map(e => e.args.tripleId))
```

### Related Functions

- [multiVaultGetTriple](#multivaultgettriple) - Query triple details
- [multiVaultGetTripleCost](#multivaultgettriplecost) - Get creation cost

---

## multiVaultGetTriple

Query triple details by ID.

### Parameters

| Parameter | Type | Description | Required |
|-----------|------|-------------|----------|
| config | `ReadConfig` | Contract address and publicClient | Yes |
| args | `[bytes32]` | Triple ID | Yes |

### Returns

```typescript
Promise<[bigint, bigint, bigint, bigint, bigint, bigint]>
// [id, subjectId, predicateId, objectId, counterVaultId, creatorAtomId]
```

### Example

```typescript
const triple = await multiVaultGetTriple({ address, publicClient }, { args: [tripleId] })

console.log('Triple ID:', triple[0])
console.log('Subject:', triple[1])
console.log('Predicate:', triple[2])
console.log('Object:', triple[3])
console.log('Counter vault:', triple[4])
console.log('Creator:', triple[5])
```

---

## multiVaultGetTripleCost

Get the base cost to create a triple.

### Returns

```typescript
Promise<bigint> // Triple creation cost in wei
```

### Example

```typescript
import { formatEther } from 'viem'

const cost = await multiVaultGetTripleCost({ address, publicClient })
console.log('Triple cost:', formatEther(cost), 'ETH')
```

---

## multiVaultIsTriple

Check if a vault ID represents a triple.

### Parameters

| Parameter | Type | Description | Required |
|-----------|------|-------------|----------|
| config | `ReadConfig` | Contract address and publicClient | Yes |
| args | `[bytes32]` | Vault ID to check | Yes |

### Returns

```typescript
Promise<boolean>
```

### Example

```typescript
const isTriple = await multiVaultIsTriple({ address, publicClient }, { args: [vaultId] })

if (isTriple) {
  console.log('This is a triple vault')
} else {
  console.log('This is an atom vault')
}
```

---

## multiVaultIsCounterTriple

Check if two triples are counter-triples (opposing positions).

### Parameters

| Parameter | Type | Description | Required |
|-----------|------|-------------|----------|
| config | `ReadConfig` | Contract address and publicClient | Yes |
| args | `[bytes32, bytes32]` | Two triple IDs to compare | Yes |

### Returns

```typescript
Promise<boolean>
```

### Example

```typescript
const isCounter = await multiVaultIsCounterTriple(
  { address, publicClient },
  { args: [tripleId1, tripleId2] }
)

if (isCounter) {
  console.log('These triples represent opposing positions')
}
```

---

## multiVaultGetInverseTripleId

Get the counter-triple ID for a given triple.

### Parameters

| Parameter | Type | Description | Required |
|-----------|------|-------------|----------|
| config | `ReadConfig` | Contract address and publicClient | Yes |
| args | `[bytes32]` | Triple ID | Yes |

### Returns

```typescript
Promise<bigint> // Counter-triple vault ID
```

### Example

```typescript
const inverseId = await multiVaultGetInverseTripleId(
  { address, publicClient },
  { args: [tripleId] }
)

// Deposit to counter-triple (stake against)
const txHash = await multiVaultDeposit(
  { address, walletClient, publicClient },
  {
    args: [account.address, inverseId, curveId, minShares],
    value: depositAmount,
  }
)
```

---

## multiVaultCreateTriplesEncode

Encode triple creation call data.

### Parameters

| Parameter | Type | Description | Required |
|-----------|------|-------------|----------|
| subjects | `bytes32[]` | Subject atom IDs | Yes |
| predicates | `bytes32[]` | Predicate atom IDs | Yes |
| objects | `bytes32[]` | Object atom IDs | Yes |
| deposits | `bigint[]` | Deposit amounts | Yes |

### Returns

```typescript
Hex // Encoded function call data
```

### Example

```typescript
const data = multiVaultCreateTriplesEncode(
  [subjectId],
  [predicateId],
  [objectId],
  [tripleCost]
)

const tx = {
  to: address,
  data,
  value: tripleCost,
}

const hash = await walletClient.sendTransaction(tx)
```

---

## See Also

- [Core Concepts: Triples](/docs/intuition-concepts/primitives/Triples/fundamentals)
- [Triple Events](/docs/protocol/events/triple-events)
- [Examples: Creating Triples](/docs/protocol/examples/creating-atoms-triples)
