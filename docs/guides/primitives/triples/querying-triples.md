---
title: Query Triples
sidebar_position: 8
---

# Querying Triples

## Basic Queries

```graphql
# Find all facts about Alice
query {
  triples(where: { subjectId: "alice_atom_id" }) {
    predicate
    object {
      data
    }
  }
}

# Find all friendship relationships
query {
  triples(where: { predicate: "isFriendOf" }) {
    subject { data }
    object { data }
  }
}
```

## Traversing the Graph

```graphql
# Find where Alice's friends live
query {
  triples(where: {
    subjectId: "alice_atom_id",
    predicate: "isFriendOf"
  }) {
    object {
      triples(where: { predicate: "livesIn" }) {
        object { data }
      }
    }
  }
}
```
