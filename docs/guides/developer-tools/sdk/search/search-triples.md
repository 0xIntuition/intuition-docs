---
title: Search Triples
sidebar_label: Search Triples
sidebar_position: 2
description: Search and filter triple statements
keywords: [sdk, search, triples, statements, find, filter]
---

# Search Triples

Search for triple statements using various methods.

## Using Global Search

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

## Using findTripleIds

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

## Related Functions

- [**globalSearch**](./global-search.md) - Global search
- [**getTripleDetails**](../triples/querying.md) - Get triple details
- [**calculateTripleId**](../triples/querying.md) - Calculate triple ID

## See Also

- [GraphQL: Triple Queries](../../graphql-api/queries/triples/single-triple.md)
- [Example: Find Existing Entities](../examples/find-existing-entities.md)
