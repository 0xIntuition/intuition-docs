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

## Complete Entity Reference

The Intuition GraphQL API exposes 142 root query fields. Every table/view supports standard Hasura operations: list queries with `where`/`order_by`/`limit`/`offset`, `_aggregate` queries, and `_stream` subscriptions.

### Core Entities

| Entity | Primary Key | Description | Docs |
|--------|-------------|-------------|------|
| `atoms` | `term_id` | Fundamental units of knowledge | [Queries](/docs/graphql-api/queries/atoms/single-atom) |
| `triples` | `term_id` | Subject-predicate-object relationships | [Queries](/docs/graphql-api/queries/triples/single-triple) |
| `accounts` | `id` | User accounts and wallets | [Queries](/docs/graphql-api/queries/accounts/overview) |
| `terms` | `id` | Shared term data for atoms and triples (holds `total_assets`, `total_market_cap`, `type`) | |
| `vaults` | `term_id`, `curve_id` | Bonding curve vaults for staking | [Queries](/docs/graphql-api/queries/vaults/vault-details) |
| `positions` | `id` | User stakes in vaults | [Queries](/docs/graphql-api/queries/vaults/user-positions) |

### Atom Value Types

| Entity | Primary Key | Description |
|--------|-------------|-------------|
| `atom_values` | `id` | Union of all atom value types |
| `persons` | `id` | Person atom values |
| `things` | `id` | Thing atom values |
| `organizations` | `id` | Organization atom values |
| `text_objects` | `id` | Text atom values |
| `json_objects` | `id` | JSON atom values |
| `byte_object` | `id` | Byte/binary atom values |

### Activity Entities

| Entity | Primary Key | Description | Docs |
|--------|-------------|-------------|------|
| `signals` | — | Enriched deposit/redemption events | [Queries](/docs/graphql-api/queries/signals/overview) |
| `events` | `id` | Raw blockchain events | [Queries](/docs/graphql-api/queries/events/overview) |
| `deposits` | `id` | Deposit transactions | [Queries](/docs/graphql-api/queries/vaults/deposits-redemptions) |
| `redemptions` | `id` | Redemption transactions | [Queries](/docs/graphql-api/queries/vaults/deposits-redemptions) |

### Position Tracking Views

| Entity | Primary Key | Description | Docs |
|--------|-------------|-------------|------|
| `positions_with_value` | — | Positions enriched with PnL, redeemable value | [Queries](/docs/graphql-api/queries/vaults/positions-with-value) |
| `position_changes` | `id` | Individual position change events | [Queries](/docs/graphql-api/queries/vaults/position-changes) |
| `position_change_daily` | — | Daily aggregated position changes | [Queries](/docs/graphql-api/queries/vaults/position-changes) |
| `position_change_hourly` | — | Hourly aggregated position changes | [Queries](/docs/graphql-api/queries/vaults/position-changes) |

### Graph Structure Views

| Entity | Primary Key | Description | Docs |
|--------|-------------|-------------|------|
| `subject_predicates` | `subject_id`, `predicate_id` | Subject-predicate pair aggregates | [Queries](/docs/graphql-api/queries/triples/subject-predicates) |
| `predicate_objects` | `predicate_id`, `object_id` | Predicate-object pair aggregates | [Queries](/docs/graphql-api/queries/advanced/predicate-objects) |
| `triple_term` | `term_id` | Triple-term aggregate stats | [Queries](/docs/graphql-api/queries/triples/triple-terms) |
| `triple_vault` | `term_id`, `curve_id` | Triple vault-level data | [Queries](/docs/graphql-api/queries/triples/triple-vaults) |

### Statistics & Fees

| Entity | Primary Key | Description | Docs |
|--------|-------------|-------------|------|
| `stats` | `id` | Protocol-wide statistics | [Queries](/docs/graphql-api/queries/stats/protocol-stats) |
| `statHours` | `id` | Hourly protocol stats snapshots | |
| `fee_transfers` | `id` | Protocol fee transfer events | [Queries](/docs/graphql-api/queries/stats/fee-transfers) |
| `protocol_fee_accruals` | `id` | Fee accruals by epoch | [Queries](/docs/graphql-api/queries/stats/fee-accruals) |

### PnL & Leaderboard

| Entity | Primary Key | Description | Docs |
|--------|-------------|-------------|------|
| `pnl_leaderboard_entry` | — | Leaderboard rows (34 fields) | [Queries](/docs/graphql-api/queries/leaderboard/pnl-leaderboard) |
| `pnl_leaderboard_stats` | — | Aggregate leaderboard stats | [Queries](/docs/graphql-api/queries/leaderboard/leaderboard-stats) |
| `account_pnl_rank` | — | Individual account rank/percentile | [Queries](/docs/graphql-api/queries/leaderboard/account-rank) |

### Time-Series (Continuous Aggregates)

Pre-computed at hourly, daily, weekly, and monthly granularities.

| Base Entity | Intervals | Description | Docs |
|-------------|-----------|-------------|------|
| `share_price_change_stats_*` | hourly, daily, weekly, monthly | Share price OHLC-style stats | [Queries](/docs/graphql-api/queries/advanced/time-series) |
| `signal_stats_*` | hourly, daily, weekly, monthly | Signal count and volume | [Queries](/docs/graphql-api/queries/advanced/time-series) |
| `term_total_state_change_stats_*` | hourly, daily, weekly, monthly | Term market cap changes | [Queries](/docs/graphql-api/queries/advanced/time-series) |
| `term_total_state_changes` | — | Raw state change events | [Queries](/docs/graphql-api/queries/advanced/time-series) |

### Price & Share Data

| Entity | Primary Key | Description | Docs |
|--------|-------------|-------------|------|
| `share_price_changes` | — | Vault share price history | [Queries](/docs/graphql-api/queries/vaults/share-price-changes) |
| `chainlink_prices` | `id` | Chainlink oracle price data | |

### Social

| Entity | Primary Key | Description | Docs |
|--------|-------------|-------------|------|
| `books` | `id` | Book entities | |
| `cached_images` | `url` | Cached image data with moderation scores | |

### Cross-Chain

| Entity | Primary Key | Description |
|--------|-------------|-------------|
| `caip10` | `id` | CAIP-10 cross-chain identifier mapping |

### Database Functions (SQL Functions Exposed as Queries)

These functions take an `args` parameter with function-specific inputs and return standard Hasura-filterable results.

| Function | Args | Returns | Description | Docs |
|----------|------|---------|-------------|------|
| `search_term` | `search: String` | `atoms[]` | Full-text search for atoms | [Queries](/docs/graphql-api/queries/search/search-term) |
| `search_term_from_following` | `address: String`, `search: String` | `atoms[]` | Search within followed accounts | [Queries](/docs/graphql-api/queries/search/search-from-following) |
| `search_term_tsvector` | `search: String` | `atoms[]` | Full-text search (tsvector variant) | |
| `search_positions_on_subject` | `addresses: _text`, `search_fields: jsonb` | `positions[]` | Find positions on a subject | [Queries](/docs/graphql-api/queries/search/search-positions) |
| `following` | `address: String` | `accounts[]` | Accounts followed by address | [Queries](/docs/graphql-api/queries/accounts/following) |
| `signals_from_following` | `address: String` | `signals[]` | Signals from followed accounts | [Queries](/docs/graphql-api/queries/signals/signals-from-following) |
| `positions_from_following` | `address: String` | `positions[]` | Positions from followed accounts | [Queries](/docs/graphql-api/queries/accounts/positions-from-following) |
| `get_pnl_leaderboard` | `p_limit`, `p_offset`, `p_sort_by`, ... | `pnl_leaderboard_entry[]` | PnL leaderboard | [Queries](/docs/graphql-api/queries/leaderboard/pnl-leaderboard) |
| `get_pnl_leaderboard_period` | `p_start_date`, `p_end_date`, ... | `pnl_leaderboard_entry[]` | Period-scoped leaderboard | [Queries](/docs/graphql-api/queries/leaderboard/pnl-leaderboard) |
| `get_pnl_leaderboard_stats` | `p_term_id`, `p_time_filter` | `pnl_leaderboard_stats[]` | Leaderboard aggregate stats | [Queries](/docs/graphql-api/queries/leaderboard/leaderboard-stats) |
| `get_vault_leaderboard` | `p_term_id`, `p_curve_id`, ... | `pnl_leaderboard_entry[]` | Vault leaderboard | [Queries](/docs/graphql-api/queries/leaderboard/vault-leaderboard) |
| `get_vault_leaderboard_period` | `p_start_date`, `p_end_date`, ... | `pnl_leaderboard_entry[]` | Period-scoped vault leaderboard | [Queries](/docs/graphql-api/queries/leaderboard/vault-leaderboard) |
| `get_account_pnl_rank` | `p_account_id`, `p_sort_by`, ... | `account_pnl_rank[]` | Account rank + percentile | [Queries](/docs/graphql-api/queries/leaderboard/account-rank) |

### Custom Operations (Hasura Actions)

These are backed by external services (chart-api, IPFS gateway). They use camelCase naming and take a single typed `input` or named argument.

| Operation | Type | Description | Docs |
|-----------|------|-------------|------|
| `getAccountPnlCurrent` | Query | Current account PnL snapshot | [Queries](/docs/graphql-api/queries/pnl/account-pnl-current) |
| `getAccountPnlChart` | Query | Account PnL over time | [Queries](/docs/graphql-api/queries/pnl/account-pnl-chart) |
| `getAccountPnlRealized` | Query | Realized PnL breakdown | [Queries](/docs/graphql-api/queries/pnl/account-pnl-realized) |
| `getPositionPnlChart` | Query | Position-level PnL chart | [Queries](/docs/graphql-api/queries/pnl/position-pnl-chart) |
| `getChartJson` | Query | Chart data as JSON | [Queries](/docs/graphql-api/queries/charts/chart-json) |
| `getChartRawJson` | Query | Raw chart data as JSON | [Queries](/docs/graphql-api/queries/charts/chart-raw-json) |
| `getChartSvg` | Query | Chart rendered as SVG | [Queries](/docs/graphql-api/queries/charts/chart-svg) |
| `getChartRawSvg` | Query | Minimal raw SVG chart | [Queries](/docs/graphql-api/queries/charts/chart-raw-svg) |
| `pinThing` | Mutation | Pin Thing metadata to IPFS | [Mutations](/docs/graphql-api/mutations/pin-thing) |
| `pinPerson` | Mutation | Pin Person metadata to IPFS | [Mutations](/docs/graphql-api/mutations/pin-person) |
| `pinOrganization` | Mutation | Pin Organization metadata to IPFS | [Mutations](/docs/graphql-api/mutations/pin-organization) |
| `uploadImage` | Mutation | Upload image (base64) | [Mutations](/docs/graphql-api/mutations/images/upload-image) |
| `uploadImageFromUrl` | Mutation | Upload image from URL | [Mutations](/docs/graphql-api/mutations/images/upload-image-from-url) |
| `uploadJsonToIpfs` | Mutation | Upload JSON to IPFS | [Mutations](/docs/graphql-api/mutations/images/upload-json-to-ipfs) |

## Next Steps

- [Query Atoms](/docs/graphql-api/queries/atoms/single-atom) - Learn atom query patterns
- [Query Triples](/docs/graphql-api/queries/triples/single-triple) - Learn triple query patterns
- [Query Signals](/docs/graphql-api/queries/signals/overview) - Learn signal query patterns
- [Query Accounts](/docs/graphql-api/queries/accounts/overview) - Learn account query patterns
- [PnL Queries](/docs/graphql-api/queries/pnl/overview) - Track profit and loss
- [Leaderboard](/docs/graphql-api/queries/leaderboard/overview) - PnL and vault leaderboards
- [Charts](/docs/graphql-api/queries/charts/overview) - Chart data and SVG rendering
- [Time-Series](/docs/graphql-api/queries/advanced/time-series) - Pre-computed analytics
- [Best Practices](/docs/graphql-api/best-practices/request-only-needed) - Optimize your queries
