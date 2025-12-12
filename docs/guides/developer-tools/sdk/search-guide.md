---
title: Search and Discovery
sidebar_label: Search
sidebar_position: 7
description: Search atoms, triples, and perform advanced queries
---

# Search and Discovery

Discover atoms, triples, accounts, and collections using powerful search capabilities including full-text search, semantic search, and batch entity lookups.

## Table of Contents

- [Global Search](#global-search)
- [Searching Atoms](#searching-atoms)
- [Searching Triples](#searching-triples)
- [Advanced Queries](#advanced-queries)

---

## Global Search

Search across all entity types (atoms, accounts, triples, collections) with a single query.

### Function Signature

```typescript
function globalSearch(
  query: string,
  options?: GlobalSearchOptions
): Promise<GlobalSearchResults | null>
```

### Parameters

| Parameter | Type | Description | Required |
|-----------|------|-------------|----------|
| `query` | `string` | Search query text | Yes |
| `options` | `GlobalSearchOptions` | Search limits per type | No |

### GlobalSearchOptions

```typescript
type GlobalSearchOptions = {
  atomsLimit?: number       // Default: 5
  accountsLimit?: number    // Default: 5
  triplesLimit?: number     // Default: 5
  collectionsLimit?: number // Default: 5
}
```

### Basic Example

```typescript
import { globalSearch } from '@0xintuition/sdk'

const results = await globalSearch('ethereum')

if (results) {
  console.log('Atoms:', results.atoms.length)
  console.log('Accounts:', results.accounts.length)
  console.log('Triples:', results.triples.length)
  console.log('Collections:', results.collections.length)
}
```

### Advanced Example

Search with custom limits:

```typescript
import { globalSearch } from '@0xintuition/sdk'

async function searchWithLimits(query: string) {
  const results = await globalSearch(query, {
    atomsLimit: 20,      // Get up to 20 atoms
    accountsLimit: 10,   // Get up to 10 accounts
    triplesLimit: 15,    // Get up to 15 triples
    collectionsLimit: 5, // Get up to 5 collections
  })

  if (!results) {
    console.log('Search failed or returned no results')
    return
  }

  // Display atoms
  console.log('\n=== Atoms ===')
  results.atoms.forEach(atom => {
    console.log(`${atom.label} (ID: ${atom.id})`)
  })

  // Display triples
  console.log('\n=== Triples ===')
  results.triples.forEach(triple => {
    console.log(
      `${triple.subject.label} ${triple.predicate.label} ${triple.object.label}`
    )
  })

  return results
}

// Usage
await searchWithLimits('blockchain')
```

### Common Use Cases

#### Search for Specific Entity Type

```typescript
// Search only for atoms
const results = await globalSearch('defi', {
  atomsLimit: 50,
  accountsLimit: 0,
  triplesLimit: 0,
  collectionsLimit: 0,
})

console.log('DeFi atoms:', results.atoms)
```

#### Build Autocomplete

```typescript
async function autocomplete(input: string) {
  if (input.length < 2) return []

  const results = await globalSearch(input, {
    atomsLimit: 10,
    accountsLimit: 5,
    triplesLimit: 0,
    collectionsLimit: 0,
  })

  if (!results) return []

  return [
    ...results.atoms.map(a => ({ type: 'atom', label: a.label, id: a.id })),
    ...results.accounts.map(a => ({ type: 'account', label: a.label, id: a.id })),
  ]
}

// Usage in React
const suggestions = await autocomplete('block')
```

#### Search and Display Details

```typescript
import { globalSearch, getAtomDetails } from '@0xintuition/sdk'

async function searchAndDisplay(query: string) {
  const results = await globalSearch(query, { atomsLimit: 5 })

  if (!results || results.atoms.length === 0) {
    console.log('No atoms found')
    return
  }

  // Get detailed information for first atom
  const firstAtom = results.atoms[0]
  const details = await getAtomDetails(firstAtom.id)

  console.log('First result:', firstAtom.label)
  console.log('Creator:', details.creator)
  console.log('Vault shares:', details.vault.totalShares)
}
```

### Return Type

```typescript
type GlobalSearchResults = {
  atoms: Array<{
    id: string
    label: string
    // Additional atom fields
  }>
  accounts: Array<{
    id: string
    label: string
    // Additional account fields
  }>
  triples: Array<{
    id: string
    subject: { id: string, label: string }
    predicate: { id: string, label: string }
    object: { id: string, label: string }
    // Additional triple fields
  }>
  collections: Array<{
    id: string
    label: string
    // Additional collection fields
  }>
}
```

### Error Handling

The function returns `null` on error:

```typescript
const results = await globalSearch('query')

if (!results) {
  console.error('Search failed')
  return
}

// Use results
console.log('Found', results.atoms.length, 'atoms')
```

---

## Searching Atoms

Search for atoms using the global search function and other query methods.

### Using Global Search

```typescript
import { globalSearch } from '@0xintuition/sdk'

const results = await globalSearch('blockchain', {
  atomsLimit: 20,
  accountsLimit: 0,    // Skip accounts
  triplesLimit: 0,     // Skip triples
  collectionsLimit: 0, // Skip collections
})

console.log('Found atoms:', results.atoms.length)
results.atoms.forEach(atom => {
  console.log(`- ${atom.label} (${atom.id})`)
})
```

### Using findAtomIds

Find atom IDs for known atom data.

#### Basic Example

```typescript
import { findAtomIds } from '@0xintuition/sdk'

const atomData = ['TypeScript', 'JavaScript', 'Python']

const atoms = await findAtomIds(atomData)

atoms.forEach(atom => {
  if (atom.term_id) {
    console.log(`${atom.data}: ${atom.term_id}`)
  } else {
    console.log(`${atom.data}: not found`)
  }
})
```

---

## Searching Triples

Search for triple statements using various methods.

### Using Global Search

```typescript
import { globalSearch } from '@0xintuition/sdk'

const results = await globalSearch('follows', {
  atomsLimit: 0,
  accountsLimit: 0,
  triplesLimit: 20,    // Focus on triples
  collectionsLimit: 0,
})

console.log('Found triples:', results.triples.length)
results.triples.forEach(triple => {
  console.log(`${triple.subject.label} ${triple.predicate.label} ${triple.object.label}`)
})
```

### Using findTripleIds

Find triple IDs for specific atom combinations.

```typescript
import { findTripleIds } from '@0xintuition/sdk'

const tripleCombinations = [
  ['0xsubject1', '0xpredicate1', '0xobject1'],
  ['0xsubject2', '0xpredicate2', '0xobject2'],
]

const triples = await findTripleIds(
  walletClient.account.address,
  tripleCombinations
)

triples.forEach(triple => {
  if (triple.term_id) {
    console.log('Found triple:', triple.term_id)
  }
})
```

---

## Advanced Queries

Advanced search capabilities including semantic search and batch entity lookups.

### semanticSearch

Search using vector embeddings for semantically similar content.

#### Function Signature

```typescript
function semanticSearch(
  query: string,
  options?: { limit?: number }
): Promise<SemanticSearchResults | null>
```

#### Basic Example

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

### findAtomIds

Find atom IDs for a batch of atom data strings.

#### Function Signature

```typescript
function findAtomIds(
  atomDataArray: string[]
): Promise<Array<{ data: string, term_id?: string }>>
```

#### Basic Example

```typescript
import { findAtomIds } from '@0xintuition/sdk'

const data = ['TypeScript', 'JavaScript', 'Python', 'Rust', 'Go']

const atoms = await findAtomIds(data)

atoms.forEach(atom => {
  if (atom.term_id) {
    console.log(`Found ${atom.data}: ${atom.term_id}`)
  } else {
    console.log(`Missing ${atom.data}: not found`)
  }
})
```

#### Advanced Example

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
    console.log(`Created: ${atom.data}`)
  }

  return atoms
}

// Usage
const atomData = ['developer', 'blockchain', 'web3']
const atoms = await createMissingAtoms(atomData)
```

### findTripleIds

Find triple IDs for specific atom combinations.

#### Function Signature

```typescript
function findTripleIds(
  walletAddress: Address,
  tripleCombinations: Array<[Hex, Hex, Hex]>
): Promise<Array<TripleWithIds>>
```

#### Basic Example

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

#### Advanced Example

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

      console.log('Created')
    } else {
      console.log('Already exists:', found[i].term_id)
    }
  }
}
```

### Batch Processing

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

---

## Complete Examples

See working examples in the SDK Examples section

## Next Steps

- [Working with Atoms](/docs/guides/developer-tools/sdk/atoms-guide) - Create and manage atoms
- [Working with Triples](/docs/guides/developer-tools/sdk/triples-guide) - Build relationships
- [SDK Integrations](/docs/guides/developer-tools/sdk/integrations/react) - Use with React
