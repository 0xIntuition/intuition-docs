---
title: Create Atom from Thing
sidebar_label: Create from Thing
sidebar_position: 2
description: Create rich, structured entities using JSON-LD Thing objects with automatic IPFS pinning
keywords: [sdk, atom, thing, json-ld, schema.org, ipfs, metadata]
---

# Create Atom from Thing

Create an atom from a rich, structured entity (Thing object) with automatic IPFS pinning. Thing objects follow JSON-LD schema.org conventions for representing structured data.

## Function Signature

```typescript
function createAtomFromThing(
  config: WriteConfig,
  thing: PinThingMutationVariables['thing'],
  deposit?: bigint
): Promise<AtomCreationResult>
```

## Parameters

| Parameter | Type | Description | Required |
|-----------|------|-------------|----------|
| `config` | `WriteConfig` | Client configuration | Yes |
| `thing` | `Thing` | JSON-LD Thing object with metadata | Yes |
| `deposit` | `bigint` | Optional initial deposit amount | No |

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

## Returns

```typescript
type AtomCreationResult = {
  uri: string                    // IPFS URI (ipfs://bafkrei...)
  transactionHash: `0x${string}` // Transaction hash
  state: {
    creator: Address
    termId: Hex                  // Atom ID
    atomData: Hex
    atomWallet: Address
  }
}
```

## Basic Example

Create an atom representing a project:

```typescript
import {
  createAtomFromThing,
  getMultiVaultAddressFromChainId,
  intuitionTestnet,
} from '@0xintuition/sdk'
import { createPublicClient, createWalletClient, http, parseEther } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'

// Setup
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

## Advanced Example

Create a comprehensive project atom with all metadata:

```typescript
import { createAtomFromThing } from '@0xintuition/sdk'
import { parseEther } from 'viem'

async function createProjectAtom() {
  try {
    const project = await createAtomFromThing(
      { walletClient, publicClient, address },
      {
        url: 'https://github.com/myorg/myproject',
        name: 'My Amazing DeFi Protocol',
        description: 'A groundbreaking decentralized finance protocol built on Intuition',
        image: 'https://myproject.com/logo.png',
        tags: [
          'defi',
          'protocol',
          'typescript',
          'smart-contracts',
          'intuition'
        ],
        twitter: 'https://twitter.com/myproject',
        github: 'github.com/myorg/myproject',
      },
      parseEther('1') // 1 TRUST initial deposit
    )

    console.log('✓ Project atom created')
    console.log('  Atom ID:', atom.state.termId)
    console.log('  IPFS URI:', atom.uri)
    console.log('  Transaction:', atom.transactionHash)

    // The Thing object is now pinned to IPFS and referenced on-chain
    return atom

  } catch (error) {
    console.error('Error creating project atom:', error)
    throw error
  }
}
```

## Common Use Cases

### Creating Organization Atoms

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

### Creating Person Atoms

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

### Creating Repository Atoms

```typescript
const repository = await createAtomFromThing(
  { walletClient, publicClient, address },
  {
    name: 'awesome-blockchain',
    description: 'Curated list of blockchain resources',
    url: 'https://github.com/user/awesome-blockchain',
    github: 'github.com/user/awesome-blockchain',
    tags: ['awesome-list', 'blockchain', 'resources'],
  }
)
```

## How It Works

1. **Pin to IPFS**: The Thing object is automatically pinned to IPFS via the Intuition API
2. **Generate URI**: An IPFS URI is generated (e.g., `ipfs://bafkrei...`)
3. **Create Atom**: The atom is created with the IPFS URI as its data
4. **Return**: Returns the atom details with the IPFS URI

### IPFS Pinning

The function uses the Intuition API to pin content:

- Content is pinned permanently to IPFS
- No Pinata API key required (uses Intuition's infrastructure)
- Returns a content-addressed IPFS URI

## Related Functions

- [**createAtomFromString**](./create-from-string.md) - Create simple text atoms
- [**createAtomFromIpfsUri**](./create-from-ipfs.md) - Create from existing IPFS content
- [**batchCreateAtomsFromThings**](./batch-creation.md#batchcreateatomsfromthings) - Create multiple Thing atoms
- [**pinThing**](../integrations/pinata-ipfs.md#pinthing) - Pin Thing without creating atom

## Best Practices

### 1. Include All Relevant Metadata

```typescript
// Good - comprehensive metadata
await createAtomFromThing(config, {
  url: 'https://example.com',
  name: 'Full Name',
  description: 'Detailed description',
  image: 'https://example.com/image.png',
  tags: ['tag1', 'tag2'],
  twitter: 'https://twitter.com/account',
  github: 'github.com/repo',
})

// Avoid - minimal metadata
await createAtomFromThing(config, {
  name: 'Name',
})
```

### 2. Use Descriptive Names

```typescript
// Good
name: 'Intuition Protocol SDK'

// Avoid
name: 'SDK'
```

### 3. Provide High-Quality Images

```typescript
// Use permanent, high-quality image URLs
image: 'https://cdn.example.com/high-res-logo.png'

// Avoid temporary or low-quality images
image: 'https://temp.com/image.jpg'
```

### 4. Use Consistent Tag Conventions

```typescript
tags: [
  'blockchain',     // lowercase
  'defi',
  'typescript',
  'smart-contracts' // kebab-case for multi-word
]
```

## Next Steps

- [**Create from IPFS**](./create-from-ipfs.md) - Use existing IPFS content
- [**Batch Creation**](./batch-creation.md) - Create multiple Thing atoms
- [**IPFS Integration**](../integrations/pinata-ipfs.md) - Advanced IPFS operations

## See Also

- [GraphQL: Pin Thing Mutation](../../graphql-api/mutations/pin-thing.md) - Pin Thing objects
- [JSON-LD Specification](https://json-ld.org/) - JSON-LD format details
- [Schema.org Thing](https://schema.org/Thing) - Thing schema reference
