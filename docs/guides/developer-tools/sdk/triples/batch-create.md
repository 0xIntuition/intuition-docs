---
title: Batch Create Triples
sidebar_label: Batch Create
sidebar_position: 2
description: Create multiple triple statements efficiently in a single transaction
keywords: [sdk, triple, batch, bulk, multiple, efficient]
---

# Batch Create Triple Statements

Create multiple triples in a single transaction for improved efficiency and reduced gas costs.

## Function Signature

```typescript
function batchCreateTripleStatements(
  config: WriteConfig,
  subjects: Hex[],
  predicates: Hex[],
  objects: Hex[],
  deposits: bigint[]
): Promise<TripleCreationResult>
```

## Parameters

| Parameter | Type | Description | Required |
|-----------|------|-------------|----------|
| `config` | `WriteConfig` | Client configuration | Yes |
| `subjects` | `Hex[]` | Array of subject atom IDs | Yes |
| `predicates` | `Hex[]` | Array of predicate atom IDs | Yes |
| `objects` | `Hex[]` | Array of object atom IDs | Yes |
| `deposits` | `bigint[]` | Array of deposit amounts | Yes |

All arrays must be the same length.

## Basic Example

```typescript
import {
  batchCreateTripleStatements,
  createAtomFromString,
} from '@0xintuition/sdk'
import { parseEther } from 'viem'

// Create atoms
const alice = await createAtomFromString(config, 'Alice')
const bob = await createAtomFromString(config, 'Bob')
const charlie = await createAtomFromString(config, 'Charlie')
const follows = await createAtomFromString(config, 'follows')

// Batch create: Alice follows Bob, Bob follows Charlie
const result = await batchCreateTripleStatements(
  config,
  [alice.state.termId, bob.state.termId],      // subjects
  [follows.state.termId, follows.state.termId], // predicates
  [bob.state.termId, charlie.state.termId],     // objects
  [parseEther('0.1'), parseEther('0.1')]        // deposits
)

console.log('Created', result.state.length, 'triples')
console.log('Triple IDs:', result.state.map(s => s.args.tripleId))
```

## Advanced Example

Build a complete knowledge graph:

```typescript
import { batchCreateTripleStatements } from '@0xintuition/sdk'
import { parseEther } from 'viem'

async function buildKnowledgeGraph() {
  // Create base atoms
  const ts = await createAtomFromString(config, 'TypeScript')
  const js = await createAtomFromString(config, 'JavaScript')
  const web3 = await createAtomFromString(config, 'Web3')

  const isA = await createAtomFromString(config, 'isA')
  const usedFor = await createAtomFromString(config, 'usedFor')

  const language = await createAtomFromString(config, 'Programming Language')
  const development = await createAtomFromString(config, 'Development')

  // Batch create relationships
  const result = await batchCreateTripleStatements(
    config,
    [ts.state.termId, js.state.termId, ts.state.termId],
    [isA.state.termId, isA.state.termId, usedFor.state.termId],
    [language.state.termId, language.state.termId, web3.state.termId],
    [parseEther('0.1'), parseEther('0.1'), parseEther('0.1')]
  )

  console.log('Knowledge graph created:', result.state.length, 'relationships')
  return result
}
```

## Gas Savings

Batch triple creation saves significant gas:

| Triples | Individual Txs | Batch Tx | Savings |
|---------|---------------|----------|---------|
| 2 | ~400k gas | ~250k gas | 37% |
| 5 | ~1M gas | ~500k gas | 50% |
| 10 | ~2M gas | ~850k gas | 57% |

## Related Functions

- [**createTripleStatement**](./create-triple.md) - Create single triple
- [**getTripleDetails**](./querying.md) - Query triple information

## See Also

- [Example: Batch Operations](../examples/create-triple-statement.md)
- [Protocol: Batch Triples](../../protocol/api-reference/multivault/triples.md)
