---
title: Search Atoms
sidebar_label: Search Atoms
sidebar_position: 1
description: Search and filter atoms using various methods
keywords: [sdk, search, atoms, find, filter, query]
---

# Search Atoms

Search for atoms using the global search function and other query methods.

## Using Global Search

The `globalSearch` function searches across atoms, accounts, triples, and collections.

### Basic Example

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

## Using findAtomIds

Find atom IDs for known atom data.

### Basic Example

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

## Related Functions

- [**globalSearch**](./global-search.md) - Search across all entities
- [**semanticSearch**](./advanced-queries.md) - Semantic search
- [**getAtomDetails**](../atoms/querying.md) - Get atom details

## See Also

- [GraphQL: Atom Search](../../graphql-api/queries/atoms/search.md)
- [Example: Global Search](../examples/global-search.md)
