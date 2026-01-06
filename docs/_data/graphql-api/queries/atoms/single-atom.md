---
title: Single Atom Query
sidebar_label: Single Atom
sidebar_position: 1
description: Fetch individual atom details by term ID
keywords: [graphql, atom, query, single, primary key]
---

import GraphQLPlaygroundCustom from '@site/src/components/GraphQLPlaygroundCustom';

# Single Atom Query

Fetch detailed information about a specific atom using its term ID. This is the most efficient way to retrieve atom data using a primary key lookup.

## Query Structure

```graphql
query GetAtom($id: String!) {
  atom(term_id: $id) {
    term_id
    data
    label
    image
    emoji
    type
    created_at
    creator {
      id
      label
      image
    }
  }
}
```

## Variables

```json
{
  "id": "0x57d94c116a33bb460428eced262b7ae2ec6f865e7aceef6357cec3d034e8ea21"
}
```

## Expected Response

```json
{
  "data": {
    "atom": {
      "term_id": "0x57d94c116a33bb460428eced262b7ae2ec6f865e7aceef6357cec3d034e8ea21",
      "data": "ipfs://QmYx8C3kNN1sFSx5b...",
      "label": "Ethereum",
      "image": "ipfs://QmXnnyufdzAWL5CqZ2RnSNgPbvCc1ALT73s6epPrRnZ1Xy",
      "emoji": "⟠",
      "type": "Thing",
      "created_at": "2024-01-15T10:30:00Z",
      "creator": {
        "id": "0xd8da6bf26964af9d7eed9e03e53415d37aa96045",
        "label": "Alice",
        "image": "ipfs://..."
      }
    }
  }
}
```

## Interactive Example

export const singleAtomQueries = [
  {
    id: 'basic-atom',
    title: 'Basic Atom Query',
    query: `query GetAtom($id: String!) {
  atom(term_id: $id) {
    term_id
    data
    label
    image
    emoji
    type
    created_at
    creator {
      id
      label
      image
    }
  }
}`,
    variables: {
      id: '0x57d94c116a33bb460428eced262b7ae2ec6f865e7aceef6357cec3d034e8ea21'
    }
  },
  {
    id: 'atom-with-metadata',
    title: 'Atom with All Metadata',
    query: `query GetAtomWithMetadata($id: String!) {
  atom(term_id: $id) {
    term_id
    data
    label
    image
    emoji
    type
    wallet_id
    block_number
    created_at
    transaction_hash
    creator {
      id
      label
      image
      type
    }
  }
}`,
    variables: {
      id: '0x57d94c116a33bb460428eced262b7ae2ec6f865e7aceef6357cec3d034e8ea21'
    }
  }
];

<GraphQLPlaygroundCustom queries={singleAtomQueries} />

## Use Cases

### Display Atom Details

Fetch complete atom information for display in a UI:

```typescript
import { GraphQLClient } from 'graphql-request'
import { API_URL_PROD } from '@0xintuition/graphql'

const client = new GraphQLClient(API_URL_PROD)

const query = `
  query GetAtom($id: String!) {
    atom(term_id: $id) {
      term_id
      label
      image
      type
    }
  }
`

const atomId = '0x...'
const data = await client.request(query, { id: atomId })
console.log(data.atom)
```

### Verify Atom Existence

Check if an atom exists before performing operations:

```typescript
const query = `
  query CheckAtomExists($id: String!) {
    atom(term_id: $id) {
      term_id
    }
  }
`

const data = await client.request(query, { id: atomId })
if (data.atom) {
  console.log('Atom exists')
} else {
  console.log('Atom not found')
}
```

### Get Creator Information

Fetch atom with creator details for attribution:

```typescript
const query = `
  query GetAtomWithCreator($id: String!) {
    atom(term_id: $id) {
      term_id
      label
      creator {
        id
        label
        image
      }
    }
  }
`
```

## Performance Considerations

- **Primary key lookup**: Most efficient way to fetch a single atom
- **Index usage**: Term ID queries use the primary index
- **Field selection**: Only request fields you need to minimize response size

## Related Patterns

- [List Atoms with Filtering](/docs/graphql-api/queries/atoms/list-filter) - Filter atoms by type, creator, date
- [Atom with Vault Details](/docs/graphql-api/queries/atoms/with-vault) - Include vault information
- [Atom with Triples](/docs/graphql-api/queries/atoms/with-triples) - Find related triples

## Common Errors

**Atom not found**: Returns `null` if the term ID doesn't exist:
```json
{
  "data": {
    "atom": null
  }
}
```

**Invalid term ID format**: Ensure the ID is a valid hex string starting with "0x".

## Best Practices

1. **Use variables** for the term ID instead of hardcoding
2. **Request only needed fields** to minimize response size
3. **Cache results** if the same atom is queried frequently
4. **Handle null responses** when the atom doesn't exist

## See Also

- [SDK: Create Atoms](/docs/intuition-sdk/examples/create-atom-from-string) - Create atoms to query
- [Protocol: Atom Functions](/docs/protocol/api-reference/multivault/atoms) - Low-level atom creation
- [Core Concepts: Atoms](/docs/intuition-concepts/primitives/Atoms/fundamentals) - Understanding atoms
