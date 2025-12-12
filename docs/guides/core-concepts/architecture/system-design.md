---
title: System Design
sidebar_label: System Design
sidebar_position: 1
description: Overview of Intuition's technical architecture and design principles
keywords: [architecture, system design, technical overview, smart contracts, infrastructure]
---

# System Architecture

This guide provides an overview of Intuition's technical architecture and how the various components work together.

## High-Level Architecture

Intuition is built as a multi-layer system:

### Layer 1: On-Chain Primitives
- **Smart Contracts**: Core protocol logic
- **MultiVault System**: Atom and Triple vaults
- **Bonding Curves**: Price discovery mechanisms
- **ERC-1155 Tokens**: Atom and Triple representations

### Layer 2: Off-Chain Data
- **IPFS/Arweave**: Decentralized storage for Atom data
- **DIDs**: Decentralized identifier resolution
- **Metadata**: Rich context and descriptions

### Layer 3: Indexing & Query
- **GraphQL API**: Efficient data querying
- **PostgreSQL**: Indexed on-chain data
- **Real-time Subscriptions**: Live updates
- **Aggregation Tables**: Pre-computed statistics

### Layer 4: Application Layer
- **SDK**: Developer-friendly abstractions
- **React Hooks**: Frontend integrations
- **UI Components**: Reusable interface elements

## Core Components

### MultiVault Contract

Central smart contract managing:
- Atom creation and storage
- Triple creation and validation
- Vault deposits and redemptions
- Fee distribution
- Share calculations

Key functions:
```solidity
createAtom(bytes atomData)
createTriple(uint256 subject, uint256 predicate, uint256 object)
deposit(uint256 vaultId, uint256 amount)
redeem(uint256 vaultId, uint256 shares)
```

### Trust Bonding Contract

Manages staking and rewards:
- Epoch-based rewards
- Lock mechanisms
- Utilization tracking
- APY calculations

### Atom Warden

Controls Atom wallets:
- Grants agency to Atoms
- Manages Atom-owned assets
- Executes transactions on behalf of Atoms

## Data Flow

### Creating an Atom

1. User submits atomData
2. Data hashed to generate unique ID
3. Check for existing Atom with same ID
4. If new, mint ERC-1155 token
5. Create associated vault
6. Emit AtomCreated event
7. Optional: Initial deposit to signal

### Creating a Triple

1. Verify subject, predicate, object Atoms exist
2. Generate Triple ID from component hashes
3. Create Triple vault (for)
4. Create counter-triple vault (against)
5. Emit TripleCreated event
6. Optional: Initial deposit to signal

### Staking/Signaling

1. User deposits tokens into vault
2. Bonding curve calculates shares to mint
3. Distribute fees to existing shareholders
4. Mint shares to depositor
5. Update vault TVL
6. Emit Deposited event
7. Index in GraphQL database

## Event System

### Key Events

```solidity
event AtomCreated(uint256 indexed vaultId, bytes atomData)
event TripleCreated(uint256 indexed vaultId, uint256 subject, uint256 predicate, uint256 object)
event Deposited(uint256 indexed vaultId, address indexed depositor, uint256 amount, uint256 shares)
event Redeemed(uint256 indexed vaultId, address indexed redeemer, uint256 shares, uint256 amount)
event FeeTransfer(uint256 indexed vaultId, address indexed recipient, uint256 amount)
```

### Event Processing

1. Smart contract emits event
2. Indexer catches event
3. Parse event data
4. Update PostgreSQL tables
5. Trigger GraphQL subscriptions
6. Notify connected clients

## Security Model

### Access Control
- Permissionless Atom/Triple creation
- Wallet-controlled deposits/redemptions
- Protocol-controlled fee distribution
- Governance-controlled parameters

### Economic Security
- Bonding curves prevent manipulation
- Fees deter spam and abuse
- Staking aligns incentives
- Slashing for malicious behavior (potential)

### Data Integrity
- Deterministic Atom IDs prevent duplicates
- IPFS ensures data availability
- On-chain proofs of existence
- DIDs provide verifiable credentials

## Scalability Considerations

### On-Chain Efficiency
- Batch operations where possible
- Optimized storage patterns
- Event-based indexing
- Layer 2 compatibility planned

### Off-Chain Scaling
- GraphQL for efficient queries
- Aggregation tables for statistics
- Caching strategies
- CDN for static content

### Future Optimizations
- ZK-proofs for privacy
- Optimistic rollups for throughput
- Sharding for data distribution
- Cross-chain bridges

---

## Next Steps

- [Smart Contracts](/docs/developer-tools/contracts/overview) - Detailed contract documentation
- [SDK Overview](/docs/developer-tools/sdks/overview) - Using the SDK
- [GraphQL API](/docs/developer-tools/graphql-api/overview) - Querying the system
