---
title: Pinata IPFS Integration
sidebar_label: Pinata IPFS
sidebar_position: 1
description: Upload and pin content to IPFS using Pinata integration
keywords: [sdk, ipfs, pinata, upload, pin, thing, metadata]
---

# Pinata IPFS Integration

Upload and pin content to IPFS using Pinata or the Intuition API.

## pinThing

Pin a Thing object to IPFS via the Intuition API (no Pinata key required).

### Function Signature

```typescript
function pinThing(
  variables: PinThingMutationVariables
): Promise<string | null>
```

### Basic Example

```typescript
import { pinThing } from '@0xintuition/sdk'

const uri = await pinThing({
  thing: {
    url: 'https://example.com',
    name: 'Example Project',
    description: 'A great project',
    image: 'https://example.com/logo.png',
    tags: ['blockchain', 'defi'],
  }
})

if (uri) {
  console.log('Pinned to IPFS:', uri) // ipfs://bafkreib...
}
```

## uploadJsonToPinata

Upload JSON directly to Pinata (requires Pinata API JWT).

### Function Signature

```typescript
function uploadJsonToPinata(
  pinataApiJWT: string,
  data: object
): Promise<PinataUploadResult>
```

### Basic Example

```typescript
import { uploadJsonToPinata } from '@0xintuition/sdk'

const result = await uploadJsonToPinata(
  'your-pinata-jwt-token',
  {
    name: 'My Data',
    description: 'Some metadata',
    properties: {
      key: 'value'
    }
  }
)

console.log('IPFS Hash:', result.IpfsHash)
console.log('Size:', result.PinSize, 'bytes')
console.log('URI:', `ipfs://${result.IpfsHash}`)
```

### Return Type

```typescript
type PinataUploadResult = {
  IpfsHash: string
  PinSize: number
  Timestamp: string
}
```

## Getting a Pinata API Key

1. Sign up at [pinata.cloud](https://pinata.cloud)
2. Go to API Keys section
3. Create a new API key
4. Copy the JWT token
5. Store securely in environment variables

```bash title=".env"
PINATA_API_JWT=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Common Use Cases

### Pin Thing and Create Atom

```typescript
import { pinThing, createAtomFromIpfsUri } from '@0xintuition/sdk'
import { parseEther } from 'viem'

const thing = {
  url: 'https://myproject.com',
  name: 'My Project',
  description: 'A blockchain project',
  tags: ['defi', 'web3'],
}

// Pin to IPFS
const uri = await pinThing({ thing })

if (uri) {
  // Create atom with IPFS URI
  const atom = await createAtomFromIpfsUri(
    config,
    uri,
    parseEther('0.05')
  )

  console.log('Atom created:', atom.state.termId)
}
```

### Upload Custom Metadata

```typescript
import { uploadJsonToPinata } from '@0xintuition/sdk'

const metadata = {
  title: 'NFT #1',
  description: 'Unique digital asset',
  image: 'https://example.com/nft1.png',
  attributes: [
    { trait_type: 'Rarity', value: 'Legendary' },
    { trait_type: 'Power', value: 100 },
  ]
}

const result = await uploadJsonToPinata(
  process.env.PINATA_API_JWT,
  metadata
)

console.log('Metadata URI:', `ipfs://${result.IpfsHash}`)
```

### Batch Pin Multiple Items

```typescript
import { pinThing } from '@0xintuition/sdk'

async function batchPin(things: any[]) {
  const uris = await Promise.all(
    things.map(thing => pinThing({ thing }))
  )

  return uris.filter(uri => uri !== null)
}

// Usage
const projects = [
  { name: 'Project A', url: 'https://a.com' },
  { name: 'Project B', url: 'https://b.com' },
]

const ipfsUris = await batchPin(projects)
console.log('Pinned', ipfsUris.length, 'items to IPFS')
```

## Error Handling

```typescript
import { pinThing } from '@0xintuition/sdk'

async function safePinThing(thing: any) {
  try {
    const uri = await pinThing({ thing })

    if (!uri) {
      throw new Error('Pinning returned null')
    }

    return { success: true, uri }

  } catch (error) {
    console.error('Failed to pin:', error)
    return { success: false, error: error.message }
  }
}

// Usage
const result = await safePinThing({ name: 'Test', url: 'https://test.com' })

if (result.success) {
  console.log('Pinned:', result.uri)
} else {
  console.error('Error:', result.error)
}
```

## Related Functions

- [**createAtomFromThing**](../atoms/create-from-thing.md) - Create atom with auto-pinning
- [**createAtomFromIpfsUri**](../atoms/create-from-ipfs.md) - Create from IPFS URI
- [**createAtomFromIpfsUpload**](../atoms/create-from-ipfs.md#createatomfromipfsupload) - Upload and create

## See Also

- [Example: Thing IPFS Pinning](../examples/thing-ipfs-pinning.md)
- [Pinata Documentation](https://docs.pinata.cloud/)
- [IPFS Documentation](https://docs.ipfs.tech/)
