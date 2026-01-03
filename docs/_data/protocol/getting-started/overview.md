---
title: Protocol Package Overview
sidebar_label: Overview
sidebar_position: 1
description: TypeScript SDK for interacting with the Intuition Protocol - atoms, triples, vaults, and bonding rewards
keywords: [protocol, sdk, typescript, intuition, atoms, triples, vaults]
---

# Protocol Package Overview

The `@0xintuition/protocol` package is a comprehensive TypeScript/JavaScript SDK for interacting with the Intuition onchain knowledge graph. It provides low-level access to build, query, and manage atoms (entities), triples (statements), vaults, and bonding rewards on the Intuition blockchain.

## What is the Protocol Package?

The Protocol package is built on top of [viem](https://viem.sh), providing type-safe, performant access to all Intuition smart contracts. It handles:

- **Atom Management**: Create and query entities (people, organizations, concepts)
- **Triple Management**: Create statements connecting atoms (subject-predicate-object)
- **Vault Operations**: Deposit and redeem assets, manage shares
- **Trust Bonding**: Participate in epoch-based rewards and staking
- **Event Parsing**: Extract structured data from transaction events
- **Configuration**: Query protocol parameters and fees

## Installation

Install the package along with its peer dependency `viem`:

```bash
# npm
npm install viem @0xintuition/protocol

# pnpm
pnpm install viem @0xintuition/protocol

# bun
bun install viem @0xintuition/protocol
```

**Peer Dependencies:** `viem ^2.0.0`

## Quick Start

Here's a minimal example to create an atom:

```typescript
import {
  intuitionTestnet,
  getMultiVaultAddressFromChainId,
  multiVaultCreateAtoms,
  multiVaultGetAtomCost,
  eventParseAtomCreated,
} from '@0xintuition/protocol'
import { createPublicClient, createWalletClient, http, toHex } from 'viem'

// Setup clients
const publicClient = createPublicClient({
  chain: intuitionTestnet,
  transport: http(),
})

const walletClient = createWalletClient({
  chain: intuitionTestnet,
  transport: http(),
  account, // your account (metamask, private key, etc)
})

// Get contract address
const address = getMultiVaultAddressFromChainId(intuitionTestnet.id)

// Create an atom
const atomCost = await multiVaultGetAtomCost({ address, publicClient })
const atomUri = toHex('Hello, Intuition!')

const txHash = await multiVaultCreateAtoms(
  { address, walletClient, publicClient },
  {
    args: [[atomUri], [atomCost]],
    value: atomCost,
  }
)

// Parse the created atom
const events = await eventParseAtomCreated(publicClient, txHash)
console.log('Atom ID:', events[0].args.termId)
```

## Key Features

### Type-Safe Interactions

Built on viem for full TypeScript support with auto-completion and type inference:

```typescript
import type { ReadConfig, WriteConfig } from '@0xintuition/protocol'

// Read-only operations
const readConfig: ReadConfig = {
  address: contractAddress,
  publicClient: publicClient,
}

// Write operations (transactions)
const writeConfig: WriteConfig = {
  address: contractAddress,
  publicClient: publicClient,
  walletClient: walletClient,
}
```

### Multi-Network Support

Works seamlessly across Intuition Mainnet and Testnet:

```typescript
import { intuitionMainnet, intuitionTestnet } from '@0xintuition/protocol'

// Mainnet (Chain ID: 1155)
const mainnetClient = createPublicClient({
  chain: intuitionMainnet,
  transport: http(),
})

// Testnet (Chain ID: 13579)
const testnetClient = createPublicClient({
  chain: intuitionTestnet,
  transport: http(),
})
```

### Comprehensive Event Parsing

Extract structured data from transaction receipts:

```typescript
import {
  eventParseAtomCreated,
  eventParseTripleCreated,
  eventParseDeposited,
} from '@0xintuition/protocol'

// Parse multiple event types from a single transaction
const atomEvents = await eventParseAtomCreated(publicClient, txHash)
const depositEvents = await eventParseDeposited(publicClient, txHash)

console.log('Atom ID:', atomEvents[0]?.args.termId)
console.log('Shares received:', depositEvents[0]?.args.shares)
```

### Batch Operations

Optimize gas costs with batch operations:

```typescript
import { multiVaultDepositBatch } from '@0xintuition/protocol'

const txHash = await multiVaultDepositBatch(
  { address, walletClient, publicClient },
  {
    args: [
      receiverAddress,
      [vaultId1, vaultId2, vaultId3], // Multiple vaults
      [curveId1, curveId2, curveId3], // Bonding curves
      [assets1, assets2, assets3],     // Deposit amounts
      [minShares1, minShares2, minShares3], // Slippage protection
    ],
    value: assets1 + assets2 + assets3,
  }
)
```

## Package Structure

The Protocol package is organized into several modules:

- **MultiVault Operations**: Core atom, triple, and vault functions
- **Trust Bonding**: Epoch-based rewards and staking
- **Wrapped Trust**: Native token wrapping/unwrapping
- **Event Parsing**: Transaction event extraction
- **Configuration**: Protocol parameters and deployments
- **Types**: TypeScript type definitions
- **ABIs**: Contract ABIs for all protocol contracts

## When to Use Protocol Package

The Protocol package is ideal when you need:

- **Low-level control**: Direct access to contract functions with minimal abstraction
- **Performance**: Optimized viem-based interactions
- **Batch operations**: Create multiple atoms/triples or deposit to multiple vaults in one transaction
- **Event parsing**: Extract detailed event data from transactions
- **Custom workflows**: Build your own higher-level abstractions

For simpler, more user-friendly interactions, consider using the [SDK Package](/docs/guides/developer-tools/sdk/overview) which provides higher-level abstractions including IPFS pinning, JSON-LD support, and simplified APIs.

## Next Steps

- [Configuration Guide](/docs/guides/developer-tools/protocol/getting-started/configuration) - Set up clients and networks
- [API Reference](/docs/guides/developer-tools/protocol/api-reference/multivault/atoms) - Explore all available functions
- [Examples](/docs/guides/developer-tools/protocol/examples/creating-atoms-triples) - See complete workflows

## Resources

- **Repository**: [github.com/0xIntuition/intuition-ts](https://github.com/0xIntuition/intuition-ts)
- **NPM Package**: [@0xintuition/protocol](https://www.npmjs.com/package/@0xintuition/protocol)
- **Viem Documentation**: [viem.sh](https://viem.sh)

## See Also

- [SDK Package](/docs/guides/developer-tools/sdk/overview) - Higher-level API with IPFS and JSON-LD support
- [GraphQL API](/docs/guides/developer-tools/graphql-api/overview) - Query protocol data efficiently
- [Primitives Overview](/docs/guides/concepts/primitives/overview) - Understand atoms, triples, and signals
