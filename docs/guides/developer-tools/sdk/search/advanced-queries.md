---
title: Advanced Search Queries
sidebar_label: Advanced Queries
sidebar_position: 4
description: Use semantic search and batch queries for advanced search operations
keywords: [sdk, search, semantic, batch, findAtomIds, findTripleIds, advanced]
---

# Advanced Search Queries

Advanced search capabilities including semantic search and batch entity lookups.

## semanticSearch

Search using vector embeddings for semantically similar content.

### Function Signature

```typescript
function semanticSearch(
  query: string,
  options?: { limit?: number }
): Promise<SemanticSearchResults | null>
```

### Basic Example

```typescript
import { semanticSearch } from '@0xintuition/sdk'

const results = await semanticSearch('decentralized knowledge graph', {
  limit: 10,
})

if (results) {
  console.log('Semantically similar atoms:', results.length)
  results.forEach(result => {
    console.log(`- ${result.label} (similarity: ${result.score})`)
  })
}
```

## findAtomIds

Find atom IDs for a batch of atom data strings.

### Function Signature

```typescript
function findAtomIds(
  atomDataArray: string[]
): Promise<Array<{ data: string, term_id?: string }>>
```

### Basic Example

```typescript
import { findAtomIds } from '@0xintuition/sdk'

const data = ['TypeScript', 'JavaScript', 'Python', 'Rust', 'Go']

const atoms = await findAtomIds(data)

atoms.forEach(atom => {
  if (atom.term_id) {
    console.log(`✓ ${atom.data}: ${atom.term_id}`)
  } else {
    console.log(`✗ ${atom.data}: not found`)
  }
})
```

### Advanced Example

Check existence before creating:

```typescript
import { findAtomIds, createAtomFromString } from '@0xintuition/sdk'
import { parseEther } from 'viem'

async function createMissingAtoms(atomData: string[]) {
  // Find existing atoms
  const atoms = await findAtomIds(atomData)

  // Filter missing atoms
  const missing = atoms.filter(a => !a.term_id)

  if (missing.length === 0) {
    console.log('All atoms already exist')
    return atoms
  }

  console.log(`Creating ${missing.length} missing atoms...`)

  // Create missing atoms
  for (const atom of missing) {
    const created = await createAtomFromString(
      config,
      atom.data,
      parseEther('0.01')
    )
    atom.term_id = created.state.termId
    console.log(`✓ Created: ${atom.data}`)
  }

  return atoms
}

// Usage
const atomData = ['developer', 'blockchain', 'web3']
const atoms = await createMissingAtoms(atomData)
```

## findTripleIds

Find triple IDs for specific atom combinations.

### Function Signature

```typescript
function findTripleIds(
  walletAddress: Address,
  tripleCombinations: Array<[Hex, Hex, Hex]>
): Promise<Array<TripleWithIds>>
```

### Basic Example

```typescript
import { findTripleIds } from '@0xintuition/sdk'

const combinations = [
  ['0xsubject1', '0xpredicate1', '0xobject1'],
  ['0xsubject2', '0xpredicate2', '0xobject2'],
]

const triples = await findTripleIds(
  walletClient.account.address,
  combinations
)

triples.forEach(triple => {
  if (triple.term_id) {
    console.log('Found triple:', triple.term_id)
    console.log('  Positions:', triple.positions?.length || 0)
  } else {
    console.log('Triple does not exist')
  }
})
```

### Advanced Example

Check and create triples:

```typescript
import {
  findTripleIds,
  createTripleStatement,
  calculateTripleId,
} from '@0xintuition/sdk'
import { parseEther } from 'viem'

async function ensureTriples(
  combinations: Array<[Hex, Hex, Hex]>
) {
  // Check which triples exist
  const found = await findTripleIds(
    walletClient.account.address,
    combinations
  )

  // Create missing triples
  for (let i = 0; i < combinations.length; i++) {
    const [subject, predicate, object] = combinations[i]

    if (!found[i]?.term_id) {
      console.log(`Creating triple: ${subject.slice(0, 10)}...`)

      await createTripleStatement(config, {
        args: [
          [subject],
          [predicate],
          [object],
          [parseEther('0.1')],
        ],
        value: parseEther('0.1'),
      })

      console.log('✓ Created')
    } else {
      console.log('✓ Already exists:', found[i].term_id)
    }
  }
}
```

## Batch Processing

Process large datasets efficiently:

```typescript
import { findAtomIds } from '@0xintuition/sdk'

async function processInBatches<T>(
  items: T[],
  batchSize: number,
  processor: (batch: T[]) => Promise<void>
) {
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize)
    await processor(batch)
  }
}

// Usage
const allData = ['atom1', 'atom2', /* ... hundreds more */]

await processInBatches(allData, 100, async (batch) => {
  const atoms = await findAtomIds(batch)
  console.log(`Processed ${atoms.length} atoms`)
})
```

## Related Functions

- [**globalSearch**](./global-search.md) - Search across all types
- [**createAtomFromString**](../atoms/create-from-string.md) - Create atoms
- [**createTripleStatement**](../triples/create-triple.md) - Create triples

## See Also

- [Example: Find Existing Entities](../examples/find-existing-entities.md)
- [Example: Bulk Sync](../examples/bulk-sync-cost-estimation.md)
- [GraphQL: Search Functions](../../graphql-api/queries/advanced/database-functions.md)
