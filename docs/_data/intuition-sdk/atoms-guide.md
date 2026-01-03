---
title: Working with Atoms
sidebar_label: Atoms
sidebar_position: 2
description: Create and query atoms using the SDK
---

# Working with Atoms

**Conceptual overview:** [Atoms Fundamentals](/docs/docs/intuition-concepts/atoms/fundamentals)

Atoms are unique identifiers for any entity—people, concepts, smart contracts, or data. This guide covers all ways to create and query atoms using the SDK.

## Table of Contents

- [Creating from Strings](#creating-from-strings)
- [Creating from Thing (JSON-LD)](#creating-from-thing)
- [Creating from Ethereum Accounts](#creating-from-ethereum-accounts)
- [Creating from Smart Contracts](#creating-from-smart-contracts)
- [Creating from IPFS](#creating-from-ipfs)
- [Batch Creation](#batch-creation)
- [Querying Atoms](#querying-atoms)

---

## Creating from Strings

The simplest way to create an atom is from a plain string.

### Function Signature

```typescript
function createAtomFromString(
  config: WriteConfig,
  data: string,
  deposit?: bigint
): Promise<AtomCreationResult>
```

### Parameters

| Parameter | Type | Description | Required |
|-----------|------|-------------|----------|
| `config` | `WriteConfig` | Client configuration with wallet, public client, and contract address | Yes |
| `data` | `string` | The text string to create an atom from | Yes |
| `deposit` | `bigint` | Optional initial deposit amount in wei | No |

### Basic Example

```typescript
import {
  createAtomFromString,
  getMultiVaultAddressFromChainId,
  intuitionTestnet,
} from '@0xintuition/sdk'
import { createPublicClient, createWalletClient, http, parseEther } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'

// Setup clients
const account = privateKeyToAccount('0x...')
const publicClient = createPublicClient({
  chain: intuitionTestnet,
  transport: http(),
})
const walletClient = createWalletClient({
  chain: intuitionTestnet,
  transport: http(),
  account,
})
const address = getMultiVaultAddressFromChainId(intuitionTestnet.id)

// Create atom
const atom = await createAtomFromString(
  { walletClient, publicClient, address },
  'developer',
  parseEther('0.01') // Optional: 0.01 TRUST initial deposit
)

console.log('Atom ID:', atom.state.termId)
console.log('Transaction:', atom.transactionHash)
```

### Common Use Cases

#### Creating Tags or Labels

```typescript
const tag = await createAtomFromString(
  { walletClient, publicClient, address },
  'blockchain'
)
```

#### Creating Simple Identifiers

```typescript
const identifier = await createAtomFromString(
  { walletClient, publicClient, address },
  'user-role-admin'
)
```

#### Creating Predicates for Triples

```typescript
// Create predicate atoms for relationships
const hasSkill = await createAtomFromString(
  { walletClient, publicClient, address },
  'hasSkill'
)

const worksOn = await createAtomFromString(
  { walletClient, publicClient, address },
  'worksOn'
)
```

### Best Practices

#### 1. Use Descriptive Strings

```typescript
// Good - clear and descriptive
await createAtomFromString(config, 'JavaScript Developer')

// Avoid - too vague
await createAtomFromString(config, 'dev')
```

#### 2. Check for Existing Atoms

Before creating an atom, check if it already exists:

```typescript
import { calculateAtomId, getAtomDetails } from '@0xintuition/sdk'

const atomId = calculateAtomId('developer')
const exists = await getAtomDetails(atomId)

if (exists) {
  console.log('Atom already exists:', atomId)
} else {
  const atom = await createAtomFromString(config, 'developer')
}
```

---

## Creating from Thing

Create atoms from structured JSON-LD objects for rich metadata.

### Function Signature

```typescript
function createAtomFromThing(
  config: WriteConfig,
  thing: PinThingMutationVariables['thing'],
  deposit?: bigint
): Promise<AtomCreationResult>
```

### Thing Object Structure

```typescript
type Thing = {
  url?: string          // Primary URL/website
  name?: string         // Display name
  description?: string  // Detailed description
  image?: string        // Image URL
  tags?: string[]       // Category tags
  twitter?: string      // Twitter/X profile
  github?: string       // GitHub repository
  // Additional schema.org Thing properties supported
}
```

### Basic Example

```typescript
import {
  createAtomFromThing,
  getMultiVaultAddressFromChainId,
  intuitionTestnet,
} from '@0xintuition/sdk'
import { parseEther } from 'viem'

// Create atom from Thing
const atom = await createAtomFromThing(
  { walletClient, publicClient, address },
  {
    url: 'https://www.example.com',
    name: 'Example Project',
    description: 'A great Web3 project',
    image: 'https://example.com/logo.png',
    tags: ['web3', 'defi', 'blockchain'],
  },
  parseEther('0.05')
)

console.log('Atom ID:', atom.state.termId)
console.log('IPFS URI:', atom.uri) // ipfs://bafkrei...
```

### Common Use Cases

#### Creating Organization Atoms

```typescript
const organization = await createAtomFromThing(
  { walletClient, publicClient, address },
  {
    name: 'Acme Corporation',
    description: 'Leading blockchain solutions provider',
    url: 'https://acme.com',
    image: 'https://acme.com/brand.png',
    twitter: 'https://twitter.com/acmecorp',
  }
)
```

#### Creating Person Atoms

```typescript
const person = await createAtomFromThing(
  { walletClient, publicClient, address },
  {
    name: 'Alice Johnson',
    description: 'Blockchain developer and researcher',
    image: 'https://example.com/alice.jpg',
    twitter: 'https://twitter.com/alicecodes',
    github: 'github.com/alice',
  }
)
```

### How It Works

1. **Pin to IPFS**: The Thing object is automatically pinned to IPFS via the Intuition API
2. **Generate URI**: An IPFS URI is generated (e.g., `ipfs://bafkrei...`)
3. **Create Atom**: The atom is created with the IPFS URI as its data
4. **Return**: Returns the atom details with the IPFS URI

---

## Creating from Ethereum Accounts

Create atoms representing Ethereum wallet addresses.

### Function Signature

```typescript
function createAtomFromEthereumAccount(
  config: WriteConfig,
  address: Address,
  deposit?: bigint
): Promise<AtomCreationResult>
```

### Basic Example

```typescript
import {
  createAtomFromEthereumAccount,
  getMultiVaultAddressFromChainId,
  intuitionTestnet,
} from '@0xintuition/sdk'
import { parseEther } from 'viem'

// Create atom from Ethereum address
const atom = await createAtomFromEthereumAccount(
  { walletClient, publicClient, address },
  '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
  parseEther('0.01')
)

console.log('Identity Atom ID:', atom.state.termId)
console.log('Address:', atom.uri)
```

### Common Use Cases

#### Creating User Identity Atoms

```typescript
// Create atom for user's wallet
const userAtom = await createAtomFromEthereumAccount(
  { walletClient, publicClient, address },
  walletClient.account.address
)
```

#### Building Social Graphs

```typescript
// Create atoms for follower relationships
const alice = await createAtomFromEthereumAccount(
  config,
  '0xAlice...'
)

const bob = await createAtomFromEthereumAccount(
  config,
  '0xBob...'
)

// Then create a "follows" triple
const follows = await createAtomFromString(config, 'follows')
const triple = await createTripleStatement(config, {
  args: [
    [alice.state.termId],
    [follows.state.termId],
    [bob.state.termId],
    [parseEther('0.1')],
  ],
  value: parseEther('0.1'),
})
```

---

## Creating from Smart Contracts

Create atoms representing smart contract addresses.

### Function Signature

```typescript
function createAtomFromSmartContract(
  config: WriteConfig,
  contractAddress: Address,
  deposit?: bigint
): Promise<AtomCreationResult>
```

### Basic Example

```typescript
import {
  createAtomFromSmartContract,
  getMultiVaultAddressFromChainId,
  intuitionTestnet,
} from '@0xintuition/sdk'
import { parseEther } from 'viem'

// Create atom for Uniswap contract
const uniswap = await createAtomFromSmartContract(
  { walletClient, publicClient, address },
  '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984', // UNI token
  parseEther('0.01')
)

console.log('Contract Atom ID:', uniswap.state.termId)
```

### Common Use Cases

#### Creating Protocol Atoms

```typescript
// Create atoms for DeFi protocols
const aave = await createAtomFromSmartContract(
  config,
  '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9' // AAVE token
)

const compound = await createAtomFromSmartContract(
  config,
  '0xc00e94Cb662C3520282E6f5717214004A7f26888' // COMP token
)
```

---

## Creating from IPFS

Create atoms from IPFS content, either by referencing existing IPFS URIs or uploading new content to Pinata.

### createAtomFromIpfsUri

Create an atom from an existing IPFS URI.

#### Function Signature

```typescript
function createAtomFromIpfsUri(
  config: WriteConfig,
  ipfsUri: string,
  deposit?: bigint
): Promise<AtomCreationResult>
```

#### Basic Example

```typescript
import {
  createAtomFromIpfsUri,
  getMultiVaultAddressFromChainId,
  intuitionTestnet,
} from '@0xintuition/sdk'
import { parseEther } from 'viem'

const atom = await createAtomFromIpfsUri(
  { walletClient, publicClient, address },
  'ipfs://bafkreib7534cszxn2c6qwoviv43sqh244yfrxomjbealjdwntd6a7atq6u',
  parseEther('0.01')
)

console.log('IPFS Atom ID:', atom.state.termId)
```

### createAtomFromIpfsUpload

Upload JSON data to Pinata and create an atom with the resulting IPFS URI.

#### Function Signature

```typescript
function createAtomFromIpfsUpload(
  config: WriteConfig & { pinataApiJWT: string },
  data: object,
  deposit?: bigint
): Promise<AtomCreationResult>
```

#### Basic Example

```typescript
import { createAtomFromIpfsUpload } from '@0xintuition/sdk'
import { parseEther } from 'viem'

const atom = await createAtomFromIpfsUpload(
  {
    walletClient,
    publicClient,
    address,
    pinataApiJWT: 'your-pinata-jwt-token',
  },
  {
    name: 'My Project',
    description: 'A blockchain project',
    url: 'https://myproject.com',
  },
  parseEther('0.05')
)

console.log('Atom ID:', atom.state.termId)
console.log('IPFS URI:', atom.uri) // ipfs://bafkrei...
```

---

## Batch Creation

Create multiple atoms in a single transaction for improved efficiency and reduced gas costs.

### Available Batch Functions

- `batchCreateAtomsFromEthereumAccounts` - Batch create account atoms
- `batchCreateAtomsFromSmartContracts` - Batch create contract atoms
- `batchCreateAtomsFromIpfsUris` - Batch create IPFS atoms
- `batchCreateAtomsFromThings` - Batch create Thing atoms

### batchCreateAtomsFromEthereumAccounts

```typescript
import {
  batchCreateAtomsFromEthereumAccounts,
  getMultiVaultAddressFromChainId,
  intuitionTestnet,
} from '@0xintuition/sdk'
import { parseEther } from 'viem'

const addresses = [
  '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
  '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
  '0x1234567890123456789012345678901234567890',
]

const result = await batchCreateAtomsFromEthereumAccounts(
  { walletClient, publicClient, address },
  addresses,
  parseEther('0.01') // 0.01 TRUST per atom
)

console.log('Created', result.state.length, 'atoms')
console.log('Atom IDs:', result.state.map(s => s.termId))
console.log('Single transaction:', result.transactionHash)
```

### Gas Savings

Batch creation saves significant gas compared to individual transactions:

| Atoms | Individual Txs | Batch Tx | Savings |
|-------|---------------|----------|---------|
| 1 | ~150k gas | ~150k gas | 0% |
| 5 | ~750k gas | ~300k gas | 60% |
| 10 | ~1.5M gas | ~450k gas | 70% |
| 50 | ~7.5M gas | ~1.5M gas | 80% |

---

## Querying Atoms

Query atom information and calculate atom IDs for existing or potential atoms.

### getAtomDetails

Fetch comprehensive atom details from the Intuition API.

#### Function Signature

```typescript
function getAtomDetails(atomId: string): Promise<AtomDetails>
```

#### Basic Example

```typescript
import { getAtomDetails } from '@0xintuition/sdk'

const atomId = '0x1234567890abcdef...'
const details = await getAtomDetails(atomId)

console.log('Atom Label:', details.label)
console.log('Creator:', details.creator)
console.log('Vault Shares:', details.vault.totalShares)
console.log('Share Price:', details.vault.currentSharePrice)
```

### calculateAtomId

Calculate the atom ID from atom data without querying the blockchain.

#### Function Signature

```typescript
function calculateAtomId(atomData: string): Hex
```

#### Basic Example

```typescript
import { calculateAtomId } from '@0xintuition/sdk'

// Calculate ID for a string atom
const atomId = calculateAtomId('developer')
console.log('Atom ID:', atomId)

// Calculate ID for an Ethereum address
const addressAtomId = calculateAtomId('0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045')
console.log('Address Atom ID:', addressAtomId)

// Calculate ID for IPFS URI
const ipfsAtomId = calculateAtomId('ipfs://bafkreib...')
console.log('IPFS Atom ID:', ipfsAtomId)
```

### Use Cases

#### Check if Atom Exists Before Creating

```typescript
import { calculateAtomId, getAtomDetails, createAtomFromString } from '@0xintuition/sdk'

async function createAtomIfNotExists(data: string) {
  // Calculate ID
  const atomId = calculateAtomId(data)

  try {
    // Check if exists
    const existing = await getAtomDetails(atomId)
    console.log('Atom already exists:', atomId)
    return existing
  } catch (error) {
    // Doesn't exist, create it
    console.log('Creating new atom')
    const atom = await createAtomFromString(config, data)
    return atom
  }
}
```

#### Batch Query Multiple Atoms

```typescript
import { getAtomDetails } from '@0xintuition/sdk'

async function getMultipleAtoms(atomIds: string[]) {
  const atoms = await Promise.all(
    atomIds.map(id => getAtomDetails(id))
  )

  atoms.forEach(atom => {
    console.log(`${atom.label}: ${atom.vault.totalShares} shares`)
  })

  return atoms
}
```

---

## Response Data Structure

After successfully creating an atom, the SDK returns a data object with transaction details and state:

```typescript
type AtomCreationResult = {
  uri: string                    // The atom's data URI (IPFS or raw data)
  transactionHash: `0x${string}` // Transaction hash on chain
  state: {
    creator: Address             // Address that created the atom
    termId: Hex                  // Unique atom identifier
    atomData: Hex                // Encoded atom data
    atomWallet: Address          // Associated vault wallet address
  }
}
```

### Example Usage

```typescript
const result = await createAtomFromString(config, 'developer')

console.log('Transaction:', result.transactionHash)
console.log('Atom ID:', result.state.termId)
console.log('Creator:', result.state.creator)
console.log('Vault Wallet:', result.state.atomWallet)
```

---

## Complete Examples

See working examples in the SDK Examples section

## Next Steps

- [Working with Triples](/docs/docs/intuition-sdk/triples-guide)
- [Working with Vaults](/docs/docs/intuition-sdk/vaults-guide)
- [SDK Integrations](/docs/docs/intuition-sdk/integrations/react)
