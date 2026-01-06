# Intuition Documentation Update Implementation Plan

## Overview

Migrate comprehensive documentation from package READMEs into the Docusaurus site, consolidate duplicate primitives sections, and establish scalable structure for 80+ protocol functions, 35+ SDK functions, and 20+ GraphQL patterns.

**Scope**: Phase 1 (Structure & Organization) + Phase 2 (Full Content Migration)
**Approach**: Hand-crafted documentation optimized for Docusaurus
**Timeline**: 5 weeks (128 new files, ~11,000 lines to migrate)

---

## Implementation Order

### Week 1: Foundation & Structure

#### 1.1 Consolidate Core Concepts (Merge Primitives)

**Goal**: Merge duplicate primitives sections into single authoritative reference

**Files to Create**:
- `docs/guides/concepts/primitives/overview.md` - Consolidated primitives overview
- `docs/guides/concepts/primitives/atoms/fundamentals.md` - Atom fundamentals
- `docs/guides/concepts/primitives/atoms/structuring.md` - Atom design patterns
- `docs/guides/concepts/primitives/atoms/best-practices.md` - Atom usage guidelines
- `docs/guides/concepts/primitives/triples/fundamentals.md` - Triple fundamentals
- `docs/guides/concepts/primitives/triples/structuring.md` - Triple composition
- `docs/guides/concepts/primitives/triples/nested-triples.md` - Advanced nested structures
- `docs/guides/concepts/primitives/signals/fundamentals.md` - Signal mechanics
- `docs/guides/concepts/primitives/signals/capturing.md` - Staking & deposits
- `docs/guides/concepts/primitives/signals/rewards.md` - Fee & reward calculations
- `docs/guides/concepts/economics/bonding-curves.md` - Curve mechanics
- `docs/guides/concepts/economics/fees-rewards.md` - Fee structure
- `docs/guides/concepts/trust-mechanisms/overview.md` - Trust attestation
- `docs/guides/concepts/architecture/system-design.md` - Architecture

**Source Content**:
- Merge from: `docs/guides/introduction/the-primitives/` (2,749 lines)
- Merge from: `docs/guides/primitives/` (1,986 lines)
- Total: 4,735 lines to consolidate

**Action Items**:
- Compare both versions side-by-side, keep best explanations
- Preserve all code examples, diagrams, BondingCurveDemo components
- Update all internal links throughout docs to point to new location
- Add redirect metadata in frontmatter for old paths

#### 1.2 Create Directory Structure

**Protocol Package** - `docs/guides/developer-tools/protocol/`:
```
protocol/
├── getting-started/
├── core-concepts/
├── api-reference/
│   ├── multivault/
│   ├── trust-bonding/
│   └── wrapped-trust/
├── events/
└── examples/
```

**SDK Package** - `docs/guides/developer-tools/sdk/`:
```
sdk/
├── getting-started/
├── atoms/
├── triples/
├── vaults/
├── search/
├── integrations/
└── examples/
```

**GraphQL API** - `docs/guides/developer-tools/graphql-api/`:
```
graphql-api/
├── getting-started/
├── queries/
│   ├── atoms/
│   ├── triples/
│   ├── vaults/
│   └── advanced/
├── mutations/
├── subscriptions/
├── best-practices/
└── examples/
```

#### 1.3 Update Navigation (sidebars.js)

**Critical File**: `/Users/simonas/dev/0xIntuition/intuition-docs/sidebars.js`

**Add New Sections**:
1. **Core Concepts** section (consolidating primitives)
2. **Protocol Package** section with 6 subcategories
3. Expand **SDK** section with 7 subcategories
4. Expand **GraphQL API** section with 6 subcategories

**Navigation Structure**:
- Core Concepts → Primitives (Atoms, Triples, Signals) + Economics + Trust + Architecture
- Protocol Package → Getting Started, Core Concepts, MultiVault API, Trust Bonding API, Wrapped Trust API, Events, Examples
- SDK → Getting Started, Atoms, Triples, Vaults, Search, Integrations, Examples
- GraphQL API → Getting Started, Query Patterns (Atoms, Triples, Vaults, Advanced), Mutations, Subscriptions, Best Practices, Examples

---

### Week 2: Protocol Package (31 files, 80+ functions)

**Source**: `/Users/simonas/dev/0xIntuition/intuition-ts/packages/protocol/README.md` (1,891 lines)

#### 2.1 Getting Started & Core Concepts (7 files)

1. `getting-started/overview.md` - Installation, quick start, viem dependency
2. `getting-started/configuration.md` - Client setup, networks, contract addresses

3. `core-concepts/atoms.md` - Atom fundamentals
4. `core-concepts/triples.md` - Triple fundamentals
5. `core-concepts/vaults.md` - Vault & shares mechanics
6. `core-concepts/bonding-curves.md` - LinearCurve, OffsetProgressiveCurve
7. `core-concepts/epochs.md` - Epoch & utilization system

#### 2.2 MultiVault API Reference (8 files, 42 functions)

8. `api-reference/multivault/atoms.md` - 5 functions: multiVaultCreateAtoms, multiVaultGetAtom, multiVaultGetAtomCost, multiVaultPreviewAtomCreate, multiVaultCreateAtomsEncode
9. `api-reference/multivault/triples.md` - 7 functions: create, get, cost, isTriple, isCounterTriple, getInverseTripleId, encode
10. `api-reference/multivault/vaults.md` - 8 functions: deposit, depositBatch, redeem, redeemBatch, preview variants, encode functions
11. `api-reference/multivault/conversions.md` - 5 functions: convertToShares, convertToAssets, getShares, currentSharePrice, maxRedeem
12. `api-reference/multivault/configuration.md` - 6 functions: getGeneralConfig, getAtomConfig, getTripleConfig, getBondingCurveConfig, getWalletConfig, multiCallIntuitionConfigs
13. `api-reference/multivault/fees.md` - 4 functions: entryFeeAmount, exitFeeAmount, protocolFeeAmount, atomDepositFractionAmount
14. `api-reference/multivault/epochs-utilization.md` - 5 functions: currentEpoch, getTotalUtilizationForEpoch, getUserUtilizationForEpoch, getUserUtilizationInEpoch, getUserLastActiveEpoch
15. `api-reference/multivault/vault-queries.md` - 3 functions: getVault, getVaultType, isTermCreated

#### 2.3 Trust Bonding API Reference (5 files, 19 functions)

16. `api-reference/trust-bonding/epochs.md` - 6 functions: currentEpoch, previousEpoch, epochAtTimestamp, epochTimestampEnd, epochLength, epochsPerYear
17. `api-reference/trust-bonding/balances.md` - 4 functions: totalBondedBalance, totalBondedBalanceAtEpochEnd, userBondedBalanceAtEpochEnd, totalLocked
18. `api-reference/trust-bonding/rewards.md` - 7 functions: getUserApy, getSystemApy, getUserCurrentClaimableRewards, getUserRewardsForEpoch, getUnclaimedRewardsForEpoch, getTotalUtilizationForEpoch, calculateUserRewards
19. `api-reference/trust-bonding/staking-operations.md` - 5 functions: createLock, increaseAmount, increaseLockLength, withdraw, claimRewards (if applicable)
20. `api-reference/trust-bonding/lock-queries.md` - 4 functions: getLockDetails (if exists), balanceOf, totalSupply, lockedEnd

#### 2.4 Wrapped Trust & Events (5 files)

21. `api-reference/wrapped-trust/overview.md` - deposit, withdraw, balanceOf, totalSupply, allowance, approve

22. `events/atom-events.md` - eventParseAtomCreated, eventParseAtomDepositCreated
23. `events/triple-events.md` - eventParseTripleCreated, eventParseTripleDepositCreated
24. `events/vault-events.md` - eventParseDeposited, eventParseRedeemed, eventParseFeeTransfer
25. `events/trust-bonding-events.md` - eventParseRewardsClaimed, eventParseLockCreated, eventParseWithdraw

#### 2.5 Protocol Examples (6 files)

26. `examples/creating-atoms-triples.md` - Full atom creation workflow
27. `examples/deposit-redeem.md` - Vault interaction examples
28. `examples/trust-bonding.md` - Staking examples
29. `examples/event-parsing.md` - Multi-event extraction
30. `examples/batch-operations.md` - Batch creation patterns
31. `examples/fee-calculations.md` - Fee estimation examples

**Documentation Pattern** (for each function):
```markdown
## Function Name

Brief description (1-2 sentences).

### Parameters
| Parameter | Type | Description | Required |
|-----------|------|-------------|----------|

### Returns
```typescript
ReturnType
```

### Basic Example
```typescript
// Simple use case with imports
```

### Advanced Example
```typescript
// Complex use case with error handling
```

### Related Functions
- [linkedFunction](#) - Use when...

### Common Use Cases
- **Use Case 1**: Description
```

---

### Week 3: SDK Package (33 files, 35+ functions)

**Source**: `/Users/simonas/dev/0xIntuition/intuition-ts/packages/sdk/README.md` (1,629 lines)

#### 3.1 Getting Started (3 files)

32. `getting-started/installation.md` - npm install, peer dependencies, Pinata JWT
33. `getting-started/setup.md` - Client configuration, networks
34. `getting-started/quick-start.md` - First atom/triple creation

#### 3.2 Atom Management (7 files)

35. `atoms/create-from-string.md` - createAtomFromString
36. `atoms/create-from-thing.md` - createAtomFromThing (JSON-LD entities)
37. `atoms/create-from-ethereum-account.md` - createAtomFromEthereumAccount
38. `atoms/create-from-smart-contract.md` - createAtomFromSmartContract
39. `atoms/create-from-ipfs.md` - createAtomFromIpfsUri, createAtomFromIpfsUpload
40. `atoms/batch-creation.md` - All batch functions: batchCreateAtomsFromEthereumAccounts, batchCreateAtomsFromIpfsUris, batchCreateAtomsFromSmartContracts, batchCreateAtomsFromThings
41. `atoms/querying.md` - getAtomDetails, calculateAtomId

#### 3.3 Triple & Vault Management (8 files)

42. `triples/create-triple.md` - createTripleStatement
43. `triples/batch-create.md` - batchCreateTripleStatements
44. `triples/querying.md` - getTripleDetails, calculateTripleId
45. `triples/counter-triples.md` - calculateCounterTripleId, working with opposing positions

46. `vaults/deposits.md` - deposit, batchDeposit
47. `vaults/redemptions.md` - redeem, batchRedeem
48. `vaults/queries.md` - getVaultDetails (if exists)
49. `vaults/previews.md` - Preview functions (re-exported from protocol)

#### 3.4 Search & Integrations (7 files)

50. `search/search-atoms.md` - Finding atoms by filters (if applicable)
51. `search/search-triples.md` - Finding triples by filters (if applicable)
52. `search/global-search.md` - globalSearch function
53. `search/advanced-queries.md` - semanticSearch, findAtomIds, findTripleIds

54. `integrations/pinata-ipfs.md` - pinThing, uploadJsonToPinata
55. `integrations/react.md` - Wagmi hooks examples
56. `integrations/tanstack-query.md` - TanStack Query patterns

#### 3.5 SDK Examples (8 files)

57. `examples/create-atom-from-string.md` - Example 1
58. `examples/create-triple-statement.md` - Example 2
59. `examples/batch-ethereum-accounts.md` - Example 3
60. `examples/deposit-into-vault.md` - Example 4
61. `examples/global-search.md` - Example 5
62. `examples/bulk-sync-cost-estimation.md` - Example 6 (experimental sync)
63. `examples/thing-ipfs-pinning.md` - Example 7
64. `examples/find-existing-entities.md` - Example 8

---

### Week 4: GraphQL Package (50 files, 20+ patterns)

**Source**: `/Users/simonas/dev/0xIntuition/intuition-ts/packages/graphql/README.md` (2,860 lines)

#### 4.1 Getting Started (3 files)

65. `getting-started/introduction.md` - Endpoints, Apollo explorers, package imports
66. `getting-started/client-setup.md` - JS/TS, Python, Go, Rust client examples
67. `getting-started/schema-reference.md` - Introspection, filtering, sorting, pagination

#### 4.2 Query Patterns - Atoms & Triples (10 files)

68. `queries/atoms/single-atom.md` - Primary key lookups
69. `queries/atoms/list-filter.md` - Filtering by type, creator, date
70. `queries/atoms/with-vault.md` - Nested vault queries
71. `queries/atoms/with-triples.md` - Finding related triples
72. `queries/atoms/search.md` - Full-text search

73. `queries/triples/single-triple.md` - Fetching triple details
74. `queries/triples/filter-by-subject.md` - Subject-based filtering
75. `queries/triples/filter-by-predicate-object.md` - Predicate-object aggregations
76. `queries/triples/nested-queries.md` - Complex relationships
77. `queries/triples/counter-triples.md` - Opposing positions

#### 4.3 Query Patterns - Vaults & Advanced (10 files)

78. `queries/vaults/vault-details.md` - Vault statistics
79. `queries/vaults/user-positions.md` - Position queries
80. `queries/vaults/deposits-redemptions.md` - Transaction history
81. `queries/vaults/share-price-changes.md` - Price tracking
82. `queries/vaults/top-vaults.md` - Ranking by TVL

83. `queries/advanced/aggregations.md` - Count, sum, avg, stddev
84. `queries/advanced/time-series.md` - Daily/hourly/monthly stats
85. `queries/advanced/predicate-objects.md` - Denormalized tables
86. `queries/advanced/database-functions.md` - following(), search_term(), positions_from_following()
87. `queries/advanced/pagination.md` - Limit, offset, cursors

#### 4.4 Mutations & Subscriptions (6 files)

88. `mutations/pin-thing.md` - pinThing mutation
89. `mutations/pin-person.md` - pinPerson mutation
90. `mutations/pin-organization.md` - pinOrganization mutation

91. `subscriptions/overview.md` - WebSocket setup, cursor management
92. `subscriptions/real-time-positions.md` - Position stream subscriptions
93. `subscriptions/price-updates.md` - Share price change subscriptions

#### 4.5 Best Practices (11 files)

94. `best-practices/request-only-needed.md` - Field selection
95. `best-practices/pagination.md` - Limit and offset usage
96. `best-practices/filtering.md` - Efficient where clauses
97. `best-practices/fragments.md` - Reusable fragments
98. `best-practices/variables.md` - Dynamic queries
99. `best-practices/comparison-operators.md` - Choosing operators (_eq, _ilike, etc.)
100. `best-practices/pre-computed-stats.md` - Time-series tables
101. `best-practices/database-functions.md` - Backend functions
102. `best-practices/subscriptions-vs-polling.md` - When to use each
103. `best-practices/error-handling.md` - GraphQL error patterns
104. `best-practices/performance.md` - Query optimization

#### 4.6 GraphQL Examples (10 files)

105. `examples/atom-with-vault.md` - Basic example 1
106. `examples/triples-pagination.md` - Basic example 2
107. `examples/user-positions.md` - Basic example 3
108. `examples/trending-atoms.md` - Basic example 4 (vault statistics)
109. `examples/social-graph.md` - Advanced example 6 (following feed)
110. `examples/activity-feed.md` - Use case implementation
111. `examples/price-history.md` - Advanced example 7 (time-series)
112. `examples/multi-language.md` - Python, Go, Rust examples
113. `examples/subscriptions.md` - Advanced example 9 (real-time)
114. `examples/complex-filtering.md` - Advanced example 8 (multi-criteria search)

**GraphQL Documentation Pattern**:
```markdown
## Query Title

Brief description.

### Query Structure
```graphql
query QueryName($variable: Type!) {
  entity(where: {condition}) {
    field1
    field2
  }
}
```

### Variables
```json
{
  "variable": "value"
}
```

### Expected Response
```json
{
  "data": {...}
}
```

### Use Cases
- When you need to...

### Performance Considerations
- Index usage
- Avoiding N+1 queries

### Related Patterns
- [LinkedPattern](#)
```

Use **GraphQLPlayground component** for all query examples.

---

### Week 5: Cleanup & Polish

#### 5.1 Remove Deprecated Files

**Delete**:
- `docs/guides/introduction/the-primitives/` (entire folder)
- `docs/guides/primitives/` (entire folder - content now in core-concepts)

**Update all links** pointing to these old locations.

#### 5.2 Cross-Reference Linking

**Add "See Also" sections** to connect related content:

- **Protocol → SDK**: "For easier API, see [SDK Atom Creation](../sdk/atoms/create-from-string)"
- **SDK → Protocol**: "For low-level control, see [Protocol MultiVault](../protocol/api-reference/multivault/atoms)"
- **SDK → GraphQL**: "After creating, query with [GraphQL](../graphql-api/queries/atoms/single-atom)"
- **GraphQL → SDK**: "To create atoms, use [SDK](../sdk/atoms/create-from-string)"
- **Developer Tools → Core Concepts**: "For conceptual overview, see [Core Concepts](../../core-concepts/primitives/atoms/fundamentals)"

#### 5.3 Search Optimization

Add to all new pages:
```yaml
---
title: Page Title
sidebar_label: Nav Label
sidebar_position: 1
description: SEO-friendly description (concise, keyword-rich)
keywords: [atom, create, sdk, intuition]
---
```

#### 5.4 Testing & Validation

**Test**:
- All navigation paths work
- All internal links resolve correctly
- All code examples compile/run
- Custom components (GraphQLPlayground, BondingCurveDemo) render
- Mobile responsiveness
- Search finds relevant pages (test "create atom", "graphql query", etc.)

**Run**:
```bash
npm run dev  # Test locally
npm run build  # Verify production build succeeds
npm run spell-check  # Check spelling
npm run lint  # Check code quality
```

#### 5.5 Documentation Review

**Consistency check**:
- Terminology matches across all pages (Atom vs Identity, Triple vs Claim)
- Code examples use consistent client setup (publicClient, walletClient, address)
- All TypeScript types are accurate
- All examples use same network (testnet vs mainnet)

**Grammar/spelling**:
- Run `npm run spell-check`
- Manual review of new content

---

## Content Organization Principles

### Function Documentation Structure

Each API function page includes:
1. **Brief description** (1-2 sentences)
2. **Parameters table** (name, type, description, required)
3. **Return type** (TypeScript signature)
4. **Basic example** (simple, common use case)
5. **Advanced example** (with error handling, all options)
6. **Related functions** (cross-references)
7. **Common use cases** (bulleted list)

### Code Example Standards

**Consistency**:
- All examples show imports explicitly
- All examples use `publicClient`, `walletClient`, `address` variables
- All examples use `intuitionTestnet` network
- Advanced examples include try/catch error handling

**Syntax highlighting**:
- `typescript` for TS/JS code
- `graphql` for GraphQL queries
- `json` for responses
- `bash` for CLI commands

**Custom components**:
- **GraphQLPlayground** - Use for all GraphQL examples
- **BondingCurveDemo** - Use in economics/bonding-curves.md
- **Tabs** - Use for multi-language examples (JS/Python/Go/Rust)

### Cross-Package Integration

**Protocol vs SDK**:
- Protocol docs focus on low-level viem interactions
- SDK docs focus on high-level convenience
- Each links to other for "advanced" or "easier alternative"

**Write (SDK/Protocol) vs Read (GraphQL)**:
- SDK/Protocol show "how to write data"
- GraphQL shows "how to read data"
- Examples span both: "Create with SDK → Query with GraphQL"

---

## Critical Files

1. **sidebars.js** (`/Users/simonas/dev/0xIntuition/intuition-docs/sidebars.js`)
   - Navigation structure, must update for all new sections

2. **Protocol README** (`/Users/simonas/dev/0xIntuition/intuition-ts/packages/protocol/README.md`)
   - Source for 80+ functions, events, examples

3. **SDK README** (`/Users/simonas/dev/0xIntuition/intuition-ts/packages/sdk/README.md`)
   - Source for 35+ functions, React integration, workflows

4. **GraphQL README** (`/Users/simonas/dev/0xIntuition/intuition-ts/packages/graphql/README.md`)
   - Source for 20+ patterns, best practices, anti-patterns

5. **Current Primitives** (`/Users/simonas/dev/0xIntuition/intuition-docs/docs/guides/primitives/overview.md` + `/Users/simonas/dev/0xIntuition/intuition-docs/docs/guides/introduction/the-primitives/index.md`)
   - Need consolidation into core-concepts/primitives/

---

## Success Criteria

- ✅ 128 new documentation pages created
- ✅ All 80+ protocol functions documented with examples
- ✅ All 35+ SDK functions documented with examples
- ✅ All 20+ GraphQL patterns documented
- ✅ Duplicate primitives sections consolidated
- ✅ Zero broken links
- ✅ All code examples tested
- ✅ Navigation works end-to-end
- ✅ Search returns relevant results
- ✅ Build succeeds without errors
