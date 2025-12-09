---
sidebar_position: 1
sidebar_label: Getting Started
title: Getting Started
---

# Getting Started

Get started building with Intuition in minutes. This guide provides direct code snippets to create atoms, triples, and signal on them.

:::info Version Compatibility
This guide uses the v2 contract architecture and requires the following package versions:
- [`@0xintuition/sdk@^2.0.0-alpha.2`](https://www.npmjs.com/package/@0xintuition/sdk)
- [`@0xintuition/protocol@^2.0.0-alpha.2`](https://www.npmjs.com/package/@0xintuition/protocol)
- [`@0xintuition/graphql@^2.0.0-alpha.2`](https://www.npmjs.com/package/@0xintuition/graphql)
:::

## Prerequisites

- Node.js 18+ and npm/pnpm/bun
- A Web3 wallet (MetaMask, Coinbase Wallet, etc.)
- Basic knowledge of React and TypeScript

## Network Configuration

### Option 1: Using Wagmi + RainbowKit

```bash
npm install wagmi viem @rainbow-me/rainbowkit @0xintuition/protocol
```

```typescript
import { createConfig, http } from 'wagmi'
import { defineChain } from 'viem'
import { mainnet, base } from 'viem/chains'

// Define Intuition Testnet
export const intuitionTestnet = defineChain({
  id: 13579,
  name: 'Intuition Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'tTRUST',
    symbol: 'tTRUST',
  },
  rpcUrls: {
    default: {
      http: ['https://testnet.rpc.intuition.systems/'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Intuition Explorer',
      url: 'https://testnet.explorer.intuition.systems',
    },
  },
})

export const config = createConfig({
  chains: [mainnet, base, intuitionTestnet],
  transports: {
    [mainnet.id]: http(),
    [base.id]: http(),
    [intuitionTestnet.id]: http(),
  },
})
```

### Option 2: Using Privy

```bash
npm install @privy-io/react-auth @privy-io/wagmi @0xintuition/protocol
```

```typescript
import { PrivyProvider } from '@privy-io/react-auth'
import { intuitionTestnet } from './wagmi-config'

function App() {
  return (
    <PrivyProvider
      appId="your-privy-app-id"
      config={{
        loginMethods: ['wallet'],
        appearance: {
          theme: 'dark',
          showWalletLoginFirst: true,
        },
        defaultChain: intuitionTestnet,
        supportedChains: [intuitionTestnet],
      }}
    >
      {/* Your app */}
    </PrivyProvider>
  )
}
```

## Install the Intuition SDK

```bash
npm install @0xintuition/sdk @0xintuition/protocol
```

## Creating Atoms

Atoms are the foundational building blocks of Intuition's knowledge graph – the words in our global dictionary. Think of Intuition as a vast, collaborative dictionary where anyone can create a new word, and each word has its own globally persistent, unique digital identifier that can be used to reference it across the entire internet!

[Learn more about Atoms →](/docs/guides/primitives/atoms)

### Create an Atom from a String

```typescript
import { createAtomFromString } from '@0xintuition/sdk'
import { getMultiVaultAddressFromChainId } from '@0xintuition/protocol'
import { useWalletClient, usePublicClient, useChainId } from 'wagmi'

function CreateAtom() {
  const chainId = useChainId()
  const publicClient = usePublicClient()
  const { data: walletClient } = useWalletClient()

  const handleCreate = async () => {
    const address = getMultiVaultAddressFromChainId(chainId)

    const result = await createAtomFromString(
      { walletClient, publicClient, address },
      'My First Atom'
    )

    console.log('Atom created:', result.transactionHash)
    console.log('Atom ID:', result.state.termId)
  }

  return <button onClick={handleCreate}>Create Atom</button>
}
```

### Create an Atom from a Thing (with metadata)

```typescript
import { createAtomFromThing } from '@0xintuition/sdk'

const result = await createAtomFromThing(
  { walletClient, publicClient, address },
  {
    url: 'https://example.com',
    name: 'Example Project',
    description: 'A cool Web3 project',
    image: 'https://example.com/image.png',
  }
)
```

### Create an Atom from Ethereum Account

```typescript
import { createAtomFromEthereumAccount } from '@0xintuition/sdk'

const result = await createAtomFromEthereumAccount(
  { walletClient, publicClient, address },
  {
    address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
    chainId: 1, // Mainnet
  }
)
```

## Reading Data

### Get Atom Details

Retrieve detailed information about an atom using its ID:

```typescript
import { getAtomDetails } from '@0xintuition/sdk'

const atomData = await getAtomDetails(
  '0x57d94c116a33bb460428eced262b7ae2ec6f865e7aceef6357cec3d034e8ea21'
)

console.log('Atom data:', atomData)
// Returns atom information including metadata, vault details, and more
```

### Get Triple Details

Retrieve information about a triple relationship:

```typescript
import { getTripleDetails } from '@0xintuition/sdk'

const tripleData = await getTripleDetails(
  '0x4957d3f442acc301ad71e73f26efd6af78647f57dacf2b3a686d91fa773fe0b6'
)

console.log('Triple data:', tripleData)
// Returns subject, predicate, object atoms and relationship metadata
```

### Search the Knowledge Graph

Perform a global search across atoms, triples, accounts, and collections:

```typescript
import { globalSearch } from '@0xintuition/sdk'

const results = await globalSearch('ethereum', {
  atomsLimit: 10,
  accountsLimit: 5,
  triplesLimit: 10,
  collectionsLimit: 5,
})

console.log('Search results:', results)
```

### Semantic Search

Use AI-powered semantic search to find relevant atoms:

```typescript
import { semanticSearch } from '@0xintuition/sdk'

const results = await semanticSearch(
  'decentralized identity protocols',
  { limit: 5 }
)

console.log('Semantic search results:', results)
```

### Read On-Chain Atom Data

Read atom data directly from the smart contract:

```typescript
import { getAtom } from '@0xintuition/protocol'

const atomOnChain = await getAtom(
  { publicClient, address },
  { args: [BigInt(atomId)] }
)

console.log('On-chain atom:', atomOnChain)
// Returns [walletAddress, vaultId, atomData]
```

## Creating Triples

If Atoms are the words in Intuition's global dictionary, Triples are the sentences we create from those words. A Triple connects three Atoms to assert a relationship or fact in the form **[Subject] – [Predicate] – [Object]**. You can string these sentences together to express any arbitrarily-complex concept, all while retaining a discrete, referenceable structure!

[Learn more about Triples →](/docs/guides/primitives/triples)

```typescript
import { createAtomFromString, createTripleStatement } from '@0xintuition/sdk'

// First create three atoms
const subject = await createAtomFromString(
  { walletClient, publicClient, address },
  'Alice'
)

const predicate = await createAtomFromString(
  { walletClient, publicClient, address },
  'knows'
)

const object = await createAtomFromString(
  { walletClient, publicClient, address },
  'Bob'
)

// Create the triple: "Alice knows Bob"
const triple = await createTripleStatement(
  { walletClient, publicClient, address },
  {
    args: [
      subject.state.termId,
      predicate.state.termId,
      object.state.termId
    ],
    value: 1000000000000000000n, // 1 ETH deposit in wei
  }
)

console.log('Triple created:', triple.transactionHash)
```

## Signaling (Staking on Atoms/Triples)

Signals represent the trust, confidence, or relevance that the community assigns to Atoms and Triples in the Intuition knowledge graph. Think of the knowledge graph as a weighted graph where Signal is the weight on each node (Atom) or edge (Triple), indicating how strongly people believe in or care about this information.

[Learn more about Signals →](/docs/guides/primitives/signals)

### Deposit (Signal Support)

```typescript
import { deposit } from '@0xintuition/protocol'

// Deposit on an atom or triple vault
const txHash = await deposit(
  { walletClient, publicClient, address },
  {
    args: [
      BigInt(vaultId), // The vault ID (atom or triple)
      BigInt(depositAmount), // Amount in wei
      walletClient.account.address // Receiver address
    ],
    value: BigInt(depositAmount),
  }
)

console.log('Deposited:', txHash)
```

### Redeem (Remove Signal)

```typescript
import { redeem } from '@0xintuition/protocol'

// Redeem from a vault
const txHash = await redeem(
  { walletClient, publicClient, address },
  {
    args: [
      BigInt(vaultId), // The vault ID
      BigInt(sharesToRedeem), // Amount of shares to redeem
      walletClient.account.address, // Receiver address
      walletClient.account.address, // Owner address
    ]
  }
)

console.log('Redeemed:', txHash)
```

### Preview Redeem

Preview how many assets you'll receive when redeeming shares:

```typescript
import { previewRedeem } from '@0xintuition/protocol'

// Preview redeem to see assets received
const assetsToReceive = await previewRedeem(
  { walletClient, publicClient, address },
  { args: [BigInt(vaultId), BigInt(sharesToRedeem)] }
)

console.log('Assets you will receive:', assetsToReceive)
```

## Complete Example Component

```typescript
import { useState } from 'react'
import { useWalletClient, usePublicClient, useChainId } from 'wagmi'
import { createAtomFromString, createTripleStatement } from '@0xintuition/sdk'
import { getMultiVaultAddressFromChainId, deposit } from '@0xintuition/protocol'

function IntuitionQuickstart() {
  const chainId = useChainId()
  const publicClient = usePublicClient()
  const { data: walletClient } = useWalletClient()
  const [atomId, setAtomId] = useState<string>('')

  const address = getMultiVaultAddressFromChainId(chainId)

  const createAtom = async () => {
    const result = await createAtomFromString(
      { walletClient, publicClient, address },
      'My Cool Idea'
    )
    setAtomId(result.state.termId)
    console.log('Created atom:', result.state.termId)
  }

  const signalAtom = async () => {
    if (!atomId) return

    const depositAmount = 100000000000000000n // 0.1 ETH
    await deposit(
      { walletClient, publicClient, address },
      {
        args: [BigInt(atomId), depositAmount, walletClient.account.address],
        value: depositAmount,
      }
    )
    console.log('Signaled support!')
  }

  return (
    <div>
      <h1>Intuition Quickstart</h1>
      <button onClick={createAtom}>Create Atom</button>
      {atomId && (
        <button onClick={signalAtom}>Signal Support</button>
      )}
    </div>
  )
}
```

## Advanced Concepts

### Batch Create Atoms

Create multiple atoms in a single transaction for efficiency and gas savings:

```typescript
import { batchCreateAtomsFromThings } from '@0xintuition/sdk'

// Batch create multiple atoms at once
const atomData = [
  {
    url: 'https://example.com/project1',
    name: 'Project 1',
    description: 'First amazing project',
    image: 'https://example.com/project1.png',
  },
  {
    url: 'https://example.com/project2',
    name: 'Project 2',
    description: 'Second amazing project',
    image: 'https://example.com/project2.png',
  },
  {
    url: 'https://example.com/project3',
    name: 'Project 3',
    description: 'Third amazing project',
    image: 'https://example.com/project3.png',
  },
]

const result = await batchCreateAtomsFromThings(
  { walletClient, publicClient, address },
  atomData,
  1000000000000000000n // Optional: 1 ETH deposit per atom
)

console.log('Created atoms:', result.state)
console.log('Transaction:', result.transactionHash)
```

### Batch Create Triples

Create multiple triple relationships in a single transaction:

```typescript
import { batchCreateTripleStatements } from '@0xintuition/sdk'

// Assuming you have atom IDs already created
const tripleData = [
  [subjectId1, predicateId1, objectId1], // Triple 1
  [subjectId2, predicateId2, objectId2], // Triple 2
  [subjectId3, predicateId3, objectId3], // Triple 3
]

const result = await batchCreateTripleStatements(
  { walletClient, publicClient, address },
  tripleData,
  1000000000000000000n // Optional: 1 ETH deposit
)

console.log('Created triples:', result.state)
```

### Batch Deposit

Deposit on multiple vaults (atoms or triples) in a single transaction:

```typescript
import { batchDepositStatement } from '@0xintuition/sdk'

// Deposit on multiple vaults at once
const depositData = [
  [vaultId1, vaultId2, vaultId3], // Vault IDs
  [amount1, amount2, amount3], // Amounts in wei
  [receiverAddress, receiverAddress, receiverAddress], // Receiver addresses
]

const result = await batchDepositStatement(
  { walletClient, publicClient, address },
  depositData
)

console.log('Batch deposit completed:', result.transactionHash)
```

:::tip Gas Optimization
Batch operations significantly reduce gas costs when working with multiple atoms or triples. Instead of paying gas fees for each individual transaction, you pay once for the entire batch.
:::

## Use Cases

Now that you know the basics, explore what you can build:

- **[List Curation & Ranking](/docs/guides/use-cases#list-curation--ranking-systems)** - Create curated lists and reputation systems
- **[Verification & Fraud Protection](/docs/guides/use-cases#verification-and-fraud-protection)** - Build trust and safety mechanisms
- **[Social Platforms](/docs/guides/use-cases#community-owned-social-platforms)** - Portable identities and attestations
- **[Reputation Scores](/docs/guides/use-cases#reputation-scores)** - Context-aware trust scoring
- **[Q&A Platforms](/docs/guides/use-cases#qa-platforms)** - Knowledge sharing with proof
- **[Oracles](/docs/guides/use-cases#oracles)** - Decentralized data feeds

[View all use cases →](/docs/guides/use-cases)

## Next Steps

- **[Explore the SDK](/docs/guides/developer-tools/sdks/overview)** - Deep dive into SDK capabilities
- **[Smart Contracts](/docs/guides/developer-tools/contracts/overview)** - Contract architecture and ABIs
- **[GraphQL API](/docs/guides/developer-tools/graphql-api/overview)** - Query the knowledge graph
- **[Join the Community](/docs/guides/resources/community-and-support)** - Get help and share ideas
