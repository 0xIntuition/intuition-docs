---
title: Request Only Needed Fields
sidebar_label: Field Selection
sidebar_position: 1
description: Avoid over-fetching by requesting only required fields
keywords: [graphql, best practice, over-fetching, field selection, performance]
---

# Request Only Needed Fields

Avoid over-fetching by requesting only the fields you actually need.

## Anti-Pattern

```graphql
# BAD: Fetching all fields when you only need a few
query GetAtoms {
  atoms(limit: 10) {
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
    creator_id
    creator {
      id
      label
      image
      atom_id
      type
    }
    # ... many more fields you don't need
  }
}
```

## Best Practice

```graphql
# GOOD: Request only what you need
query GetAtoms {
  atoms(limit: 10) {
    term_id
    label
    image
  }
}
```

## Benefits

1. **Faster queries**: Less data to fetch and serialize
2. **Reduced bandwidth**: Smaller response payloads
3. **Lower memory usage**: Less data to process client-side
4. **Better caching**: Smaller cache footprints

## Tips

- Start minimal and add fields as needed
- Remove unused fields from queries
- Use fragments for commonly requested field sets
- Profile queries to identify over-fetching
