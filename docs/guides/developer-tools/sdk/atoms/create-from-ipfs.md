---
title: Create Atom from IPFS
sidebar_label: Create from IPFS
sidebar_position: 5
description: Create atoms from IPFS content URIs or upload new content to IPFS
keywords: [sdk, atom, ipfs, pinata, upload, content-addressed, uri]
---

# Create Atom from IPFS

Create atoms from IPFS content, either by referencing existing IPFS URIs or uploading new content to Pinata.

## createAtomFromIpfsUri

Create an atom from an existing IPFS URI.

### Function Signature

```typescript
function createAtomFromIpfsUri(
  config: WriteConfig,
  ipfsUri: string,
  deposit?: bigint
): Promise<AtomCreationResult>
```

### Parameters

| Parameter | Type | Description | Required |
|-----------|------|-------------|----------|
| `config` | `WriteConfig` | Client configuration | Yes |
| `ipfsUri` | `string` | IPFS URI (ipfs://...) | Yes |
| `deposit` | `bigint` | Optional initial deposit | No |

### Basic Example

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

## createAtomFromIpfsUpload

Upload JSON data to Pinata and create an atom with the resulting IPFS URI.

### Function Signature

```typescript
function createAtomFromIpfsUpload(
  config: WriteConfig & { pinataApiJWT: string },
  data: object,
  deposit?: bigint
): Promise<AtomCreationResult>
```

### Parameters

| Parameter | Type | Description | Required |
|-----------|------|-------------|----------|
| `config` | `WriteConfig & { pinataApiJWT }` | Config with Pinata JWT | Yes |
| `data` | `object` | JSON data to upload | Yes |
| `deposit` | `bigint` | Optional initial deposit | No |

### Basic Example

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

## Common Use Cases

### Reference Existing IPFS Content

```typescript
// Create atom from existing IPFS content
const contentAtom = await createAtomFromIpfsUri(
  config,
  'ipfs://QmExistingContent...'
)
```

### Upload and Create Metadata Atom

```typescript
// Upload metadata and create atom
const metadata = {
  title: 'NFT Metadata',
  description: 'Rich metadata for NFT',
  properties: {
    rarity: 'rare',
    collection: 'Genesis',
  }
}

const metadataAtom = await createAtomFromIpfsUpload(
  {
    ...config,
    pinataApiJWT: process.env.PINATA_API_JWT,
  },
  metadata
)
```

### Batch Upload to IPFS

```typescript
import { batchCreateAtomsFromIpfsUris } from '@0xintuition/sdk'

// First, upload multiple files to IPFS separately
const ipfsUris = [
  'ipfs://bafkreib1...',
  'ipfs://bafkreib2...',
  'ipfs://bafkreib3...',
]

// Then create atoms for all
const result = await batchCreateAtomsFromIpfsUris(
  config,
  ipfsUris,
  parseEther('0.01')
)
```

## IPFS URI Format

Valid IPFS URI formats:

```typescript
// CIDv0 (base58)
'ipfs://QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG'

// CIDv1 (base32)
'ipfs://bafkreib7534cszxn2c6qwoviv43sqh244yfrxomjbealjdwntd6a7atq6u'

// With path
'ipfs://QmHash.../path/to/file.json'
```

## Pinata Configuration

To use `createAtomFromIpfsUpload`, you need a Pinata API JWT token:

1. Sign up at [pinata.cloud](https://pinata.cloud)
2. Create an API key
3. Store the JWT token securely

```bash title=".env"
PINATA_API_JWT=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Related Functions

- [**createAtomFromThing**](./create-from-thing.md) - Create Thing with auto-pinning
- [**uploadJsonToPinata**](../integrations/pinata-ipfs.md#uploadjsontopinata) - Upload without creating atom
- [**pinThing**](../integrations/pinata-ipfs.md#pinthing) - Pin Thing to IPFS
- [**batchCreateAtomsFromIpfsUris**](./batch-creation.md#batchcreateatomsfromipfsuris) - Batch create

## Best Practices

### 1. Verify IPFS Content Before Creating Atom

```typescript
// Ensure IPFS content is pinned and accessible
const ipfsUri = 'ipfs://bafkrei...'

try {
  // Test IPFS gateway access
  const response = await fetch(`https://ipfs.io/ipfs/${ipfsUri.slice(7)}`)
  if (response.ok) {
    const atom = await createAtomFromIpfsUri(config, ipfsUri)
  }
} catch (error) {
  console.error('IPFS content not accessible')
}
```

### 2. Use Permanent Pinning

Ensure IPFS content is permanently pinned:

```typescript
// Use Pinata or similar service for permanent pinning
const atom = await createAtomFromIpfsUpload(
  { ...config, pinataApiJWT },
  data
  // Pinata automatically pins the content
)
```

## See Also

- [IPFS Integration Guide](../integrations/pinata-ipfs.md)
- [Example: Thing IPFS Pinning](../examples/thing-ipfs-pinning.md)
- [Pinata Documentation](https://docs.pinata.cloud/)
