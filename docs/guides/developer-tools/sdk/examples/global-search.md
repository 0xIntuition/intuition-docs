---
title: "Example: Global Search"
sidebar_label: Global Search
sidebar_position: 5
description: Search across atoms, accounts, triples, and collections
keywords: [sdk, example, search, global, query]
---

# Example: Global Search

This example demonstrates using global search to find entities across the Intuition protocol.

## Complete Code

```typescript
import { globalSearch, getAtomDetails } from '@0xintuition/sdk'

async function main() {
  const searchQuery = 'ethereum'

  console.log(`Searching for: "${searchQuery}"\n`)

  // Perform global search
  const results = await globalSearch(searchQuery, {
    atomsLimit: 10,
    accountsLimit: 5,
    triplesLimit: 5,
    collectionsLimit: 3,
  })

  if (!results) {
    console.log('Search returned no results')
    return
  }

  // Display atoms
  console.log('=== Atoms ===')
  console.log(`Found ${results.atoms.length} atoms:\n`)
  results.atoms.forEach((atom, i) => {
    console.log(`${i + 1}. ${atom.label}`)
    console.log(`   ID: ${atom.id}`)
  })

  // Display accounts
  console.log('\n=== Accounts ===')
  console.log(`Found ${results.accounts.length} accounts:\n`)
  results.accounts.forEach((account, i) => {
    console.log(`${i + 1}. ${account.label}`)
    console.log(`   ID: ${account.id}`)
  })

  // Display triples
  console.log('\n=== Triples ===')
  console.log(`Found ${results.triples.length} triples:\n`)
  results.triples.forEach((triple, i) => {
    console.log(`${i + 1}. ${triple.subject.label} ${triple.predicate.label} ${triple.object.label}`)
    console.log(`   ID: ${triple.id}`)
  })

  // Get details for first atom
  if (results.atoms.length > 0) {
    console.log('\n=== First Atom Details ===')
    const details = await getAtomDetails(results.atoms[0].id)

    console.log('Label:', details.label)
    console.log('Creator:', details.creator)
    console.log('Total Shares:', details.vault.totalShares)
    console.log('Positions:', details.vault.positionCount)
  }

  console.log('\nSuccess!')
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Error:', error)
    process.exit(1)
  })
```

## See Also

- [globalSearch](../search/global-search.md)
- [getAtomDetails](../atoms/querying.md)
