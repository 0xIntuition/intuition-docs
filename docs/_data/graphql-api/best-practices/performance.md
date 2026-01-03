---
title: Query Performance
sidebar_label: Performance
sidebar_position: 11
description: Optimize GraphQL query performance
keywords: [graphql, performance, optimization, caching, indexing]
---

# Query Performance

Optimize your GraphQL queries for better performance.

## Performance Checklist

### 1. Use Indexed Fields for Filtering

**Indexed fields:**
- `term_id` (primary keys)
- `creator_id`
- `type`
- `created_at`
- `account_id`

```graphql
# GOOD: Filtering by indexed fields
query GetAtoms($type: atom_type!, $since: timestamptz!) {
  atoms(
    where: {
      type: { _eq: $type }
      created_at: { _gte: $since }
    }
  ) {
    term_id
    label
  }
}
```

### 2. Request Only Needed Fields

```graphql
# GOOD: Minimal field selection
query GetAtoms {
  atoms(limit: 10) {
    term_id
    label
  }
}
```

### 3. Use Aggregates Instead of Fetching All Nodes

```graphql
# GOOD: Use aggregates for counts
query CountPositions($accountId: String!) {
  positions_aggregate(where: { account_id: { _eq: $accountId } }) {
    aggregate {
      count
    }
  }
}
```

### 4. Limit Nested Queries

```graphql
# GOOD: Limit depth and breadth
query GetAtomWithTriples($id: String!) {
  atom(term_id: $id) {
    label
    as_subject_triples(limit: 10) {
      predicate { label }
      object { label }
    }
  }
}
```

### 5. Use Primary Key Lookups When Possible

```graphql
# GOOD: Direct primary key lookup
query GetAtom($id: String!) {
  atom(term_id: $id) {
    term_id
    label
  }
}
```

### 6. Paginate Large Result Sets

```graphql
# GOOD: Always use limit
query GetAtoms($limit: Int!, $offset: Int!) {
  atoms(
    limit: $limit
    offset: $offset
    order_by: { created_at: desc }
  ) {
    term_id
    label
  }
}
```

### 7. Use Pre-Computed Tables

```graphql
# GOOD: Use time-series tables
query GetDailyStats($termId: String!, $curveId: numeric!) {
  share_price_change_stats_daily(
    where: {
      term_id: { _eq: $termId }
      curve_id: { _eq: $curveId }
    }
    limit: 30
  ) {
    bucket
    difference
  }
}
```

### 8. Leverage Database Functions

```graphql
# GOOD: Use backend functions
query GetFollowing($address: String!) {
  following(args: { address: $address }) {
    id
    label
  }
}
```

## Monitoring

- Profile query execution time
- Monitor response payload sizes
- Track cache hit rates
- Watch for N+1 query patterns
