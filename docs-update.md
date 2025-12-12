# Intuition Documentation Update Plan

## Overview

This document outlines the plan to update the Intuition documentation (`intuition-docs/docs/`) based on the latest and most comprehensive information from:
- `intuition-ts/packages/protocol/README.md`
- `intuition-ts/packages/sdk/README.md`
- `intuition-ts/packages/graphql/README.md`

## Current State Analysis

The documentation in `intuition-docs/docs/` appears to be outdated and needs to be synchronized with the authoritative source of truth in the package READMEs.

## Update Strategy

### Phase 1: Structure & Organization

**Goal**: Align documentation structure with the package organization

1. **Create/Update Package-Specific Sections**
   - `docs/developers/protocol/` - Low-level smart contract interactions
   - `docs/developers/sdk/` - High-level SDK usage
   - `docs/developers/graphql/` - GraphQL API documentation

2. **Establish Documentation Hierarchy**
   ```
   docs/
   ├── getting-started/
   │   ├── introduction.md
   │   ├── installation.md
   │   └── quick-start.md
   ├── core-concepts/
   │   ├── atoms.md
   │   ├── triples.md
   │   ├── vaults.md
   │   ├── bonding-curves.md
   │   └── epochs-utilization.md
   ├── developers/
   │   ├── protocol/
   │   │   ├── overview.md
   │   │   ├── multivault-operations.md
   │   │   ├── trust-bonding.md
   │   │   ├── wrapped-trust.md
   │   │   ├── event-parsing.md
   │   │   └── examples.md
   │   ├── sdk/
   │   │   ├── overview.md
   │   │   ├── atom-management.md
   │   │   ├── triple-management.md
   │   │   ├── vault-operations.md
   │   │   ├── search-discovery.md
   │   │   ├── external-integrations.md
   │   │   ├── experimental-features.md
   │   │   └── examples.md
   │   └── graphql/
   │       ├── overview.md
   │       ├── schema-reference.md
   │       ├── queries.md
   │       ├── mutations.md
   │       ├── subscriptions.md
   │       ├── best-practices.md
   │       └── examples.md
   ├── guides/
   │   ├── creating-atoms.md
   │   ├── creating-triples.md
   │   ├── depositing-to-vaults.md
   │   ├── querying-data.md
   │   └── react-integration.md
   └── api-reference/
       ├── networks.md
       ├── contract-addresses.md
       └── types.md
   ```

### Phase 2: Content Migration

#### 2.1 Core Concepts Section

**Source**: All three READMEs have "Core Concepts" sections

**Actions**:
1. Extract and consolidate core concept definitions:
   - Atoms (definition, types, use cases)
   - Triples (subject-predicate-object relationships)
   - Vaults & Shares (bonding curves, deposits, redemptions)
   - Bonding Curves (LinearCurve, OffsetProgressiveCurve)
   - Epochs & Utilization (epoch-based rewards system)
   - Thing Objects (JSON-LD structured entities)

2. Create dedicated pages for each concept with:
   - Clear definition
   - Visual diagrams (where applicable)
   - Use cases
   - Related API functions
   - Examples

**Priority**: HIGH - These are fundamental to understanding the protocol

#### 2.2 Protocol Package Documentation

**Source**: `packages/protocol/README.md` (1881 lines)

**Key Sections to Migrate**:

1. **Installation & Quick Start**
   - Dependencies (viem ^2.0.0)
   - Basic setup examples
   - First transaction walkthrough

2. **Configuration**
   - Client configuration (ReadConfig, WriteConfig)
   - Network configuration (mainnet, testnet)
   - Contract addresses and deployments
   - Utility functions (getMultiVaultAddressFromChainId, etc.)

3. **MultiVault Operations** (Core Content)
   - Atom Management:
     - `multiVaultCreateAtoms`
     - `multiVaultGetAtom`
     - `multiVaultGetAtomCost`
     - `multiVaultPreviewAtomCreate`
     - Encoding functions
   - Triple Management:
     - `multiVaultCreateTriples`
     - `multiVaultGetTriple`
     - `multiVaultGetTripleCost`
     - `multiVaultIsTriple`, `multiVaultIsCounterTriple`
     - `multiVaultGetInverseTripleId`
   - Vault Operations:
     - Deposit functions (single & batch)
     - Redeem functions (single & batch)
     - Preview functions
     - Encoding functions
   - Share & Asset Conversions
   - Configuration Queries (general, atom, triple, bonding curve, wallet)
   - Fee Calculations (entry, exit, protocol, atom deposit fraction)
   - Epoch & Utilization queries

4. **TrustBonding System**
   - Epoch management functions
   - Balance queries
   - Reward calculations
   - Utilization metrics
   - User info queries

5. **WrappedTrust**
   - Deposit/withdraw functions

6. **Event Parsing**
   - Core events (AtomCreated, TripleCreated, Deposited, Redeemed)
   - Configuration events
   - Fee events
   - Utilization events
   - Market events

7. **Code Examples** (6 comprehensive examples)
   - Example 1: Complete atom creation flow
   - Example 2: Creating a triple
   - Example 3: Depositing to a vault
   - Example 4: Batch operations
   - Example 5: Checking bonding rewards
   - Example 6: Event parsing

8. **TypeScript Types**
   - Configuration types
   - Protocol configuration types
   - Vault types
   - Curve types

9. **Contract ABIs**
   - List of all exported ABIs
   - Usage with Viem

10. **Networks & Deployments**
    - Intuition Mainnet (Chain ID 1155)
    - Intuition Testnet (Chain ID 13579)
    - Complete contract deployment addresses

**Priority**: HIGH - This is low-level API documentation

#### 2.3 SDK Package Documentation

**Source**: `packages/sdk/README.md` (1628 lines)

**Key Sections to Migrate**:

1. **Installation & Quick Start**
   - Dependencies (viem ^2.0.0)
   - Optional dependencies (Pinata API JWT)
   - Basic example

2. **Configuration**
   - Client setup (Viem clients)
   - Network configuration
   - Pinata configuration

3. **Atom Management** (High-Level API)
   - Single Atom Creation:
     - `createAtomFromString`
     - `createAtomFromThing`
     - `createAtomFromEthereumAccount`
     - `createAtomFromSmartContract`
     - `createAtomFromIpfsUri`
     - `createAtomFromIpfsUpload`
   - Batch Atom Creation:
     - `batchCreateAtomsFromEthereumAccounts`
     - `batchCreateAtomsFromIpfsUris`
     - `batchCreateAtomsFromSmartContracts`
     - `batchCreateAtomsFromThings`
   - Atom Queries:
     - `getAtomDetails`
     - `calculateAtomId`

4. **Triple Management**
   - `createTripleStatement`
   - `batchCreateTripleStatements`
   - `getTripleDetails`
   - `calculateTripleId`
   - `calculateCounterTripleId`

5. **Vault Operations**
   - `deposit`, `batchDeposit`
   - `redeem`, `batchRedeem`

6. **Search & Discovery**
   - `globalSearch`
   - `semanticSearch`
   - `findAtomIds`
   - `findTripleIds`

7. **External Integrations**
   - `pinThing`
   - `uploadJsonToPinata`

8. **Experimental Features**
   - `sync` (bulk synchronization with cost estimation)
   - `wait` (transaction indexing)
   - `search` (position search)

9. **Protocol Functions Re-exports**
   - Note: SDK re-exports all @0xintuition/protocol functions

10. **Common Workflows** (8 comprehensive examples)
    - Example 1: Create atom from string
    - Example 2: Create triple statement
    - Example 3: Batch create Ethereum account atoms
    - Example 4: Deposit into vault
    - Example 5: Global search
    - Example 6: Bulk sync with cost estimation
    - Example 7: Create Thing with IPFS pinning
    - Example 8: Find existing atoms and triples

11. **TypeScript Types**
    - Configuration types (WriteConfig, ReadConfig)
    - Thing type
    - Ethereum Account & Smart Contract types
    - Return types (AtomCreationResult, BatchAtomCreationResult, TripleCreationResult)
    - Search types
    - Experimental types (SyncConfig, CostEstimation, WaitOptions)

12. **React Integration**
    - Using with Wagmi
    - Using with TanStack Query
    - Example components

**Priority**: HIGH - This is the primary developer-facing API

#### 2.4 GraphQL Package Documentation

**Source**: `packages/graphql/README.md` (2860 lines)

**Key Sections to Migrate**:

1. **Introduction**
   - Public endpoints (mainnet, testnet)
   - Interactive explorers (Apollo Studio Sandbox)

2. **Core Concepts** (GraphQL-specific)
   - Atoms, Triples, Vaults, Positions
   - Accounts
   - Deposits & Redemptions
   - Events
   - Stats

3. **Getting Started**
   - JavaScript/TypeScript examples (graphql-request, Apollo Client, urql, fetch)
   - Python examples (gql, python-graphql-client)
   - Go examples (machinebox/graphql)
   - Rust examples (graphql-client)

4. **Schema Reference**
   - Getting the schema (introspection)
   - Schema features:
     - Filtering with `where` clauses
     - Sorting with `order_by`
     - Pagination
     - Aggregations
     - Relationships
     - Primary key lookups

5. **Common Query Patterns**
   - Querying atoms (single, list, with vault details)
   - Querying triples (single, filter, with positions)
   - Querying positions (user positions, aggregates)
   - Querying vaults
   - Search queries (global search, semantic search)
   - Pagination patterns
   - Database functions (following, signals, position search)
   - Time-series analysis (price trends)
   - Denormalized tables (predicate-object aggregations)
   - Statistical aggregations

6. **Mutations**
   - Pinning metadata to IPFS:
     - `pinThing`
     - `pinPerson`
     - `pinOrganization`
   - Uploading JSON to IPFS
   - Image upload (base64, URL)
   - Mutation workflow

7. **Subscriptions**
   - Basic subscription pattern
   - Cursor-based streaming
   - Common use cases (monitor triples, track prices, live signals)
   - Best practices

8. **Best Practices** (11 detailed practices)
   1. Avoid over-fetching
   2. Use aggregates efficiently
   3. Combine aggregates with nodes
   4. Use fragments for reusable structures
   5. Use variables for dynamic values
   6. Filter early and specifically
   7. Use appropriate comparison operators
   8. Paginate large result sets
   9. Leverage pre-computed statistics
   10. Use database functions for complex queries
   11. Choose subscriptions vs polling appropriately

9. **Example Queries** (5 examples)
   - Example 1: Get atom with vault info
   - Example 2: List triples with pagination
   - Example 3: Get user positions with totals
   - Example 4: Global search across types
   - Example 5: Get vault statistics

10. **Advanced Examples** (5 examples)
    - Example 6: Social graph - following feed
    - Example 7: Time-series analytics - price trends
    - Example 8: Advanced search - multi-criteria position search
    - Example 9: Real-time updates - subscription pattern
    - Example 10: Mutation flow - pinning content to IPFS

11. **Code Generation**
    - Generating schema file
    - Code generation tools (JS/TS, Python, Go, Rust)

12. **Anti-Patterns to Avoid** (7 anti-patterns)
    1. Hardcoding values in queries
    2. Over-fetching when only aggregates needed
    3. Unnecessary deep nesting
    4. Not using variables for filters
    5. Fetching same data multiple times
    6. Using `_ilike` for exact matches
    7. Not using fragments from the package

**Priority**: HIGH - Critical for querying protocol data

### Phase 3: Cross-References & Navigation

**Actions**:

1. **Add Cross-References**
   - Link between related concepts across packages
   - Example: "Creating Atoms" guide should link to:
     - `@0xintuition/sdk` atom creation functions
     - `@0xintuition/protocol` multiVault operations
     - GraphQL queries for fetching atom data

2. **Create Navigation Aids**
   - "See Also" sections in each document
   - Decision trees (e.g., "Should I use SDK or Protocol?")
   - Quick reference cards

3. **Add Search Keywords**
   - Ensure all pages have proper metadata for search

**Priority**: MEDIUM

### Phase 4: Code Examples & Tutorials

**Actions**:

1. **Extract All Examples**
   - Protocol: 6 comprehensive examples
   - SDK: 8 common workflows
   - GraphQL: 10 query examples (5 basic + 5 advanced)

2. **Create Standalone Example Pages**
   - Full working examples with setup
   - Copy-paste ready code
   - Expected output/results

3. **Create Step-by-Step Tutorials**
   - "Your First Atom" tutorial
   - "Building a Social Feed" tutorial
   - "Creating a Trading Dashboard" tutorial

**Priority**: MEDIUM

### Phase 5: API Reference

**Actions**:

1. **Generate API Documentation**
   - Extract all function signatures
   - Document parameters, return types, and errors
   - Include TypeScript types

2. **Create Searchable API Reference**
   - Organized by package
   - Searchable by function name
   - Filterable by category (atoms, triples, vaults, etc.)

**Priority**: MEDIUM

### Phase 6: Visual Assets

**Actions**:

1. **Create Diagrams**
   - Protocol architecture diagram
   - Atom/Triple relationship diagram
   - Bonding curve visualization
   - Vault mechanics flowchart
   - GraphQL schema entity relationship diagram

2. **Create Screenshots**
   - Apollo Studio Explorer examples
   - Example application screenshots

**Priority**: LOW

### Phase 7: Migration Guides

**Actions**:

1. **Create Migration Guide** (if applicable)
   - Document breaking changes from old docs
   - Provide migration paths

2. **Add Changelog**
   - Track documentation updates
   - Version documentation with package versions

**Priority**: LOW

## Content Inventory

### Content to Extract from Protocol README

- [ ] Installation instructions
- [ ] Quick start example
- [ ] Core concepts definitions
- [ ] Configuration guide (clients, networks, addresses)
- [ ] MultiVault operations (25+ functions)
- [ ] TrustBonding operations (15+ functions)
- [ ] WrappedTrust operations
- [ ] Event parsing guide (10+ event types)
- [ ] 6 code examples
- [ ] TypeScript types documentation
- [ ] Contract ABIs list
- [ ] Networks & deployments reference

### Content to Extract from SDK README

- [ ] Installation instructions
- [ ] Quick start example
- [ ] Core concepts (SDK-specific perspective)
- [ ] Configuration guide
- [ ] Atom management functions (10+ functions)
- [ ] Triple management functions
- [ ] Vault operations
- [ ] Search & discovery functions
- [ ] External integrations (IPFS/Pinata)
- [ ] Experimental features (sync, wait, search)
- [ ] 8 common workflow examples
- [ ] TypeScript types documentation
- [ ] React integration guide

### Content to Extract from GraphQL README

- [ ] Introduction & endpoints
- [ ] Core concepts (GraphQL entities)
- [ ] Getting started (multiple languages)
- [ ] Schema reference
- [ ] Common query patterns (10+ patterns)
- [ ] Mutations guide
- [ ] Subscriptions guide
- [ ] 11 best practices
- [ ] 10 query examples (5 basic + 5 advanced)
- [ ] Code generation guide
- [ ] 7 anti-patterns to avoid

## Implementation Checklist

### Preparation
- [ ] Audit current documentation structure in `intuition-docs/docs/`
- [ ] Identify which pages are outdated
- [ ] Identify which pages need to be created
- [ ] Set up documentation framework (Docusaurus configuration)

### Core Content Migration
- [ ] Migrate "Core Concepts" section
- [ ] Migrate "Installation" guides
- [ ] Migrate "Quick Start" guides
- [ ] Create Protocol package documentation
- [ ] Create SDK package documentation
- [ ] Create GraphQL package documentation

### Examples & Guides
- [ ] Extract and format all code examples
- [ ] Create tutorial guides
- [ ] Add React integration examples
- [ ] Add framework-specific examples (Next.js, Vite, etc.)

### API Reference
- [ ] Generate Protocol API reference
- [ ] Generate SDK API reference
- [ ] Generate GraphQL schema reference
- [ ] Create TypeScript types reference

### Polish & Quality
- [ ] Add cross-references between related pages
- [ ] Create navigation structure
- [ ] Add diagrams and visual aids
- [ ] Review for consistency and accuracy
- [ ] Add search metadata
- [ ] Test all code examples

### Publishing
- [ ] Review with team
- [ ] Test documentation locally
- [ ] Deploy updated documentation
- [ ] Announce documentation updates

## Maintenance Strategy

### Keep Documentation in Sync

1. **Single Source of Truth**
   - Package READMEs remain the authoritative source
   - Documentation should be derived from READMEs
   - Consider automated documentation generation

2. **Version Alignment**
   - Documentation versions should match package versions
   - Add version selector to docs site

3. **Update Process**
   - When package READMEs are updated, trigger doc review
   - Use GitHub Actions to notify when READMEs change
   - Quarterly documentation audits

4. **Contribution Guidelines**
   - Update CONTRIBUTING.md with documentation standards
   - Require README updates with code changes
   - Document review process

## Success Metrics

- [ ] All Protocol functions documented with examples
- [ ] All SDK functions documented with examples
- [ ] All GraphQL query patterns documented
- [ ] Zero broken links
- [ ] All code examples tested and working
- [ ] Documentation covers 100% of public API surface
- [ ] User feedback survey results positive (if applicable)

## Timeline Estimate

| Phase | Estimated Time | Priority |
|-------|----------------|----------|
| Phase 1: Structure & Organization | 1-2 days | HIGH |
| Phase 2.1: Core Concepts | 2-3 days | HIGH |
| Phase 2.2: Protocol Documentation | 3-4 days | HIGH |
| Phase 2.3: SDK Documentation | 3-4 days | HIGH |
| Phase 2.4: GraphQL Documentation | 3-4 days | HIGH |
| Phase 3: Cross-References | 1-2 days | MEDIUM |
| Phase 4: Examples & Tutorials | 2-3 days | MEDIUM |
| Phase 5: API Reference | 2-3 days | MEDIUM |
| Phase 6: Visual Assets | 2-3 days | LOW |
| Phase 7: Migration Guides | 1 day | LOW |

**Total Estimate**: 20-29 days (approximately 4-6 weeks)

## Notes

- This is a comprehensive update that will significantly improve developer experience
- The three package READMEs are extremely detailed and well-organized
- Priority should be given to getting the core API documentation accurate first
- Visual assets and tutorials can be added incrementally
- Consider setting up automated sync process to keep docs aligned with code

## Next Steps

1. Review this plan with the team
2. Get approval on structure and priorities
3. Set up documentation environment (if not already done)
4. Begin with Phase 1 (Structure & Organization)
5. Execute phases in order of priority
6. Iterate based on feedback
