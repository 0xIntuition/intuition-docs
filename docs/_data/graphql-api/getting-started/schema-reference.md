---
title: Schema Reference
sidebar_label: Schema Reference
sidebar_position: 3
description: GraphQL schema features including filtering, sorting, pagination, and aggregations
keywords: [graphql, schema, introspection, filtering, sorting, pagination, hasura]
---

# Schema Reference

The Intuition GraphQL API is powered by Hasura, providing a rich set of features for querying and manipulating data.

## Getting the Schema

Generate the GraphQL schema via introspection:

```bash
# Mainnet
npx get-graphql-schema https://mainnet.intuition.sh/v1/graphql > schema.graphql

# Testnet
npx get-graphql-schema https://testnet.intuition.sh/v1/graphql > schema.graphql
```

This schema file can be used with code generation tools to create type-safe clients.

## Filtering with `where` Clauses

Use boolean expressions to filter query results:

```graphql
query GetRecentPersonAtoms {
  atoms(
    where: {
      created_at: { _gte: "2024-01-01" }
      type: { _eq: Person }
    }
    limit: 10
  ) {
    term_id
    label
    created_at
  }
}
```

### Available Operators

**Equality**:
- `_eq` - Equal to
- `_neq` - Not equal to

**Comparisons**:
- `_gt` - Greater than
- `_gte` - Greater than or equal to
- `_lt` - Less than
- `_lte` - Less than or equal to

**Array Operations**:
- `_in` - Value in array
- `_nin` - Value not in array

**Pattern Matching**:
- `_like` - Pattern match (case-sensitive)
- `_ilike` - Pattern match (case-insensitive)

**Null Checks**:
- `_is_null` - Check if null

**Boolean Logic**:
- `_and` - Logical AND
- `_or` - Logical OR
- `_not` - Logical NOT

### Combining Filters

```graphql
query ComplexFilter {
  atoms(
    where: {
      _and: [
        { type: { _eq: Person } }
        {
          _or: [
            { label: { _ilike: "%ethereum%" } }
            { label: { _ilike: "%bitcoin%" } }
          ]
        }
      ]
    }
  ) {
    term_id
    label
  }
}
```

## Sorting with `order_by`

Sort results by one or more fields:

```graphql
query GetTopAtoms {
  atoms(
    order_by: [
      { term: { total_market_cap: desc } }
      { created_at: desc }
    ]
    limit: 10
  ) {
    term_id
    label
    created_at
  }
}
```

**Sort directions**:
- `asc` - Ascending order
- `desc` - Descending order
- `asc_nulls_first` - Ascending, nulls first
- `asc_nulls_last` - Ascending, nulls last
- `desc_nulls_first` - Descending, nulls first
- `desc_nulls_last` - Descending, nulls last

## Pagination

### Offset-Based Pagination

Use `limit` and `offset` for offset-based pagination:

```graphql
query GetAtomsPage($limit: Int!, $offset: Int!) {
  atoms(
    limit: $limit
    offset: $offset
    order_by: { created_at: desc }
  ) {
    term_id
    label
    created_at
  }

  atoms_aggregate {
    aggregate {
      count
    }
  }
}
```

**Variables**:
```json
{
  "limit": 20,
  "offset": 40
}
```

This fetches page 3 (items 41-60) when using 20 items per page.

**Best practices**:
- Always include `order_by` for consistent pagination
- Fetch total count using `_aggregate` for pagination UI
- Use reasonable limits (10-100 items per page)

## Aggregations

Compute statistics without fetching all nodes:

```graphql
query GetPositionStats($accountId: String!) {
  positions_aggregate(where: { account_id: { _eq: $accountId } }) {
    aggregate {
      count
      sum {
        shares
      }
      avg {
        shares
      }
      min {
        shares
      }
      max {
        shares
      }
      stddev {
        shares
      }
      variance {
        shares
      }
    }
  }
}
```

### Available Aggregate Functions

**Count Operations**:
- `count` - Total number of rows

**Numeric Aggregations**:
- `sum` - Sum of values
- `avg` - Average value
- `min` - Minimum value
- `max` - Maximum value

**Statistical Functions**:
- `stddev` - Standard deviation
- `stddev_pop` - Population standard deviation
- `stddev_samp` - Sample standard deviation
- `variance` - Variance
- `var_pop` - Population variance
- `var_samp` - Sample variance

### Combining Aggregates with Nodes

```graphql
query GetPositionsWithStats($accountId: String!, $limit: Int!) {
  stats: positions_aggregate(where: { account_id: { _eq: $accountId } }) {
    aggregate {
      count
      sum { shares }
    }
  }

  positions(
    where: { account_id: { _eq: $accountId } }
    limit: $limit
    order_by: { shares: desc }
  ) {
    id
    shares
  }
}
```

## Relationships

Navigate the knowledge graph through nested queries:

```graphql
query GetAtomWithCreator($id: String!) {
  atom(term_id: $id) {
    term_id
    label
    creator {
      id
      label
      image
    }
    term {
      vaults(where: { curve_id: { _eq: "1" } }) {
        total_shares
        current_share_price
      }
    }
  }
}
```

**Key relationships**:
- Atoms → Creator (account)
- Atoms → Term → Vaults
- Triples → Subject/Predicate/Object (atoms)
- Triples → Term → Vaults
- Vaults → Positions
- Positions → Account
- Positions → Vault

## Primary Key Lookups

Direct lookups by primary key are the most efficient:

```graphql
query GetAtom($id: String!) {
  atom(term_id: $id) {  # Direct lookup by primary key
    term_id
    label
  }
}
```

**Primary keys by entity**:
- `atom(term_id: String!)` - Single atom
- `triple(term_id: String!)` - Single triple
- `account(id: String!)` - Single account
- `vault(term_id: String!, curve_id: numeric!)` - Single vault (composite key)
- `position(id: String!)` - Single position

## Distinct Values

Get distinct values for a field:

```graphql
query GetDistinctAtomTypes {
  atoms(distinct_on: [type]) {
    type
  }
}
```

## Fragments

Reuse field selections across queries:

```graphql
fragment AtomBasics on atoms {
  term_id
  label
  image
  type
  creator {
    id
    label
  }
}

query GetTriple($id: String!) {
  triple(term_id: $id) {
    term_id
    subject {
      ...AtomBasics
    }
    predicate {
      ...AtomBasics
    }
    object {
      ...AtomBasics
    }
  }
}
```

## Variables

Always use variables for dynamic values:

```graphql
query GetAtomsByType($type: atom_type!, $limit: Int!) {
  atoms(
    where: { type: { _eq: $type } }
    limit: $limit
  ) {
    term_id
    label
  }
}
```

**Variables**:
```json
{
  "type": "Person",
  "limit": 20
}
```

## Schema Introspection

Query the schema itself:

```graphql
query IntrospectTypes {
  __schema {
    types {
      name
      kind
      description
    }
  }
}
```

```graphql
query IntrospectAtomType {
  __type(name: "atoms") {
    name
    fields {
      name
      type {
        name
        kind
      }
    }
  }
}
```

## Code Generation

Use the schema with code generation tools:

**JavaScript/TypeScript**:
- [GraphQL Code Generator](https://the-guild.dev/graphql/codegen) - Generate TypeScript types and hooks
- [Apollo CLI](https://www.apollographql.com/docs/devtools/cli/) - Generate types for Apollo Client

**Python**:
- [Ariadne Codegen](https://ariadnegraphql.org/docs/codegen) - Generate Python types
- [sgqlc](https://github.com/profusion/sgqlc) - Generate Python client code

**Go**:
- [gqlgen](https://gqlgen.com/) - Generate Go server and client code
- [genqlient](https://github.com/Khan/genqlient) - Generate Go client code

**Rust**:
- [graphql-client](https://github.com/graphql-rust/graphql-client) - Typed queries in Rust
- [cynic](https://cynic-rs.dev/) - Type-safe GraphQL client

## Next Steps

- [Query Atoms](/docs/graphql-api/queries/atoms/single-atom) - Learn atom query patterns
- [Query Triples](/docs/graphql-api/queries/triples/single-triple) - Learn triple query patterns
- [Best Practices](/docs/graphql-api/best-practices/request-only-needed) - Optimize your queries
