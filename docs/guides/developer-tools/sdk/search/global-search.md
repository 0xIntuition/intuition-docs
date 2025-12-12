---
title: Global Search
sidebar_label: Global Search
sidebar_position: 3
description: Search across atoms, accounts, triples, and collections simultaneously
keywords: [sdk, search, global, atoms, triples, accounts, collections]
---

# Global Search

Search across all entity types (atoms, accounts, triples, collections) with a single query.

## Function Signature

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

## Basic Example

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

## Advanced Example

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

## Common Use Cases

### Search for Specific Entity Type

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

### Build Autocomplete

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

### Search and Display Details

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

## Return Type

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

## Error Handling

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

## Related Functions

- [**semanticSearch**](./advanced-queries.md#semanticsearch) - Semantic search
- [**findAtomIds**](./advanced-queries.md#findatomids) - Find specific atoms
- [**findTripleIds**](./advanced-queries.md#findtripleids) - Find specific triples

## See Also

- [Example: Global Search](../examples/global-search.md)
- [GraphQL: Search Queries](../../graphql-api/queries/advanced/database-functions.md)
