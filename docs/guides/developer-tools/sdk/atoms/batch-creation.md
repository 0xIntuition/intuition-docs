---
title: Batch Atom Creation
sidebar_label: Batch Creation
sidebar_position: 6
description: Create multiple atoms efficiently in a single transaction
keywords: [sdk, atom, batch, bulk, multiple, ethereum, ipfs, thing, contract]
---

# Batch Atom Creation

Create multiple atoms in a single transaction for improved efficiency and reduced gas costs.

## Available Batch Functions

The SDK provides batch creation functions for different atom types:

- `batchCreateAtomsFromEthereumAccounts` - Batch create account atoms
- `batchCreateAtomsFromSmartContracts` - Batch create contract atoms
- `batchCreateAtomsFromIpfsUris` - Batch create IPFS atoms
- `batchCreateAtomsFromThings` - Batch create Thing atoms

## batchCreateAtomsFromEthereumAccounts

Create multiple atoms from Ethereum addresses in one transaction.

### Function Signature

```typescript
function batchCreateAtomsFromEthereumAccounts(
  config: WriteConfig,
  addresses: Address[],
  depositPerAtom?: bigint
): Promise<BatchAtomCreationResult>
```

### Basic Example

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

## batchCreateAtomsFromSmartContracts

Create multiple atoms from smart contract addresses.

### Function Signature

```typescript
function batchCreateAtomsFromSmartContracts(
  config: WriteConfig,
  contractAddresses: Address[],
  depositPerAtom?: bigint
): Promise<BatchAtomCreationResult>
```

### Basic Example

```typescript
import { batchCreateAtomsFromSmartContracts } from '@0xintuition/sdk'
import { parseEther } from 'viem'

const contracts = [
  '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984', // Uniswap
  '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9', // Aave
  '0xc00e94Cb662C3520282E6f5717214004A7f26888', // Compound
]

const result = await batchCreateAtomsFromSmartContracts(
  { walletClient, publicClient, address },
  contracts,
  parseEther('0.01')
)

console.log('Created DeFi protocol atoms:', result.state.length)
```

## batchCreateAtomsFromIpfsUris

Create multiple atoms from IPFS URIs.

### Function Signature

```typescript
function batchCreateAtomsFromIpfsUris(
  config: WriteConfig,
  ipfsUris: string[],
  depositPerAtom?: bigint
): Promise<BatchAtomCreationResult>
```

### Basic Example

```typescript
import { batchCreateAtomsFromIpfsUris } from '@0xintuition/sdk'
import { parseEther } from 'viem'

const ipfsUris = [
  'ipfs://bafkreib1...',
  'ipfs://bafkreib2...',
  'ipfs://bafkreib3...',
]

const result = await batchCreateAtomsFromIpfsUris(
  { walletClient, publicClient, address },
  ipfsUris,
  parseEther('0.01')
)

console.log('Created IPFS atoms:', result.state.length)
```

## batchCreateAtomsFromThings

Create multiple atoms from Thing objects with IPFS pinning.

### Function Signature

```typescript
function batchCreateAtomsFromThings(
  config: WriteConfig,
  things: PinThingMutationVariables['thing'][],
  depositPerAtom?: bigint
): Promise<BatchAtomCreationResult>
```

### Basic Example

```typescript
import { batchCreateAtomsFromThings } from '@0xintuition/sdk'
import { parseEther } from 'viem'

const projects = [
  {
    name: 'Project A',
    url: 'https://a.com',
    description: 'First project',
    tags: ['defi', 'web3'],
  },
  {
    name: 'Project B',
    url: 'https://b.com',
    description: 'Second project',
    tags: ['nft', 'gaming'],
  },
]

const result = await batchCreateAtomsFromThings(
  { walletClient, publicClient, address },
  projects,
  parseEther('0.05')
)

console.log('Created project atoms:', result.state.length)
```

## Return Type

All batch functions return:

```typescript
type BatchAtomCreationResult = {
  uris: string[]                 // Array of URIs
  transactionHash: `0x${string}` // Single transaction hash
  state: Array<{
    creator: Address
    termId: Hex                  // Atom ID
    atomData: Hex
    atomWallet: Address
  }>
}
```

## Gas Savings

Batch creation saves significant gas compared to individual transactions:

| Atoms | Individual Txs | Batch Tx | Savings |
|-------|---------------|----------|---------|
| 1 | ~150k gas | ~150k gas | 0% |
| 5 | ~750k gas | ~300k gas | 60% |
| 10 | ~1.5M gas | ~450k gas | 70% |
| 50 | ~7.5M gas | ~1.5M gas | 80% |

## Advanced Example

Create a complete social graph with batch operations:

```typescript
import {
  batchCreateAtomsFromEthereumAccounts,
  createAtomFromString,
  batchCreateTripleStatements,
} from '@0xintuition/sdk'
import { parseEther } from 'viem'

async function createSocialGraph() {
  // 1. Batch create user atoms
  const users = [
    '0xAlice...',
    '0xBob...',
    '0xCharlie...',
  ]

  const userAtoms = await batchCreateAtomsFromEthereumAccounts(
    config,
    users,
    parseEther('0.01')
  )

  console.log('Created user atoms:', userAtoms.state.length)

  // 2. Create predicate atom
  const follows = await createAtomFromString(config, 'follows')

  // 3. Batch create follow relationships
  const triples = await batchCreateTripleStatements(
    config,
    [
      userAtoms.state[0].termId, // Alice
      userAtoms.state[1].termId, // Bob
    ],
    [
      follows.state.termId,
      follows.state.termId,
    ],
    [
      userAtoms.state[1].termId, // Bob
      userAtoms.state[2].termId, // Charlie
    ],
    [
      parseEther('0.1'),
      parseEther('0.1'),
    ]
  )

  console.log('Created follow relationships:', triples.state.length)
  // Alice follows Bob
  // Bob follows Charlie
}
```

## Best Practices

### 1. Batch Size Limits

Keep batch sizes reasonable:

```typescript
// Good - manageable batch size
const batch = addresses.slice(0, 50)
await batchCreateAtomsFromEthereumAccounts(config, batch)

// Avoid - too large, may hit gas limits
const hugeBatch = addresses.slice(0, 500)
```

### 2. Handle Failures Gracefully

```typescript
try {
  const result = await batchCreateAtomsFromEthereumAccounts(
    config,
    addresses,
    parseEther('0.01')
  )
  console.log('Success:', result.state.length, 'atoms created')
} catch (error) {
  console.error('Batch failed, trying smaller batches')
  // Fall back to smaller batches or individual creation
}
```

### 3. Process Results

```typescript
const result = await batchCreateAtomsFromEthereumAccounts(config, addresses)

// Map addresses to atom IDs
const addressToAtomId = new Map(
  addresses.map((addr, i) => [addr, result.state[i].termId])
)

console.log('Atom ID for Alice:', addressToAtomId.get('0xAlice...'))
```

## Related Functions

- [**createAtomFromEthereumAccount**](./create-from-ethereum-account.md) - Single account atom
- [**createAtomFromSmartContract**](./create-from-smart-contract.md) - Single contract atom
- [**batchCreateTripleStatements**](../triples/batch-create.md) - Batch triple creation

## See Also

- [Example: Batch Ethereum Accounts](../examples/batch-ethereum-accounts.md)
- [Protocol: Batch Operations](../../protocol/api-reference/multivault/atoms.md)
