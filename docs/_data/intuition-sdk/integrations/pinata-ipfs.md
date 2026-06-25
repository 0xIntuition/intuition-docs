---
title: IPFS Pinning
sidebar_label: IPFS Pinning
sidebar_position: 1
description: Pin metadata to IPFS using the Intuition pinning service or direct Pinata uploads
keywords: [sdk, ipfs, pinata, upload, pin, thing, metadata]
---

# IPFS Pinning

The SDK supports two IPFS paths:

| Path                      | Use for                                                         | Credential                          |
| ------------------------- | --------------------------------------------------------------- | ----------------------------------- |
| Intuition pinning service | `pinThing`, `createAtomFromThing`, `batchCreateAtomsFromThings` | Intuition pin API key (`pinApiKey`) |
| Direct Pinata upload      | `uploadJsonToPinata`, `createAtomFromIpfsUpload`                | Pinata API JWT (`pinataApiJWT`)     |

`pinThing` does not require a Pinata account, but it does require an Intuition pin API key. Keep API keys in a trusted server runtime and do not expose them in public browser environment variables.

## Intuition Pin API Key

Configure the SDK once before calling `pinThing` or any SDK helper that auto-pins Thing metadata:

```typescript
import { configureSdk } from '@0xintuition/sdk';

configureSdk({
  pinApiKey: process.env.INTUITION_PIN_API_KEY,
});
```

You can also pass the key per call:

```typescript
const uri = await pinThing(thing, {
  pinApiKey: process.env.INTUITION_PIN_API_KEY,
});
```

## pinThing

Pin a Thing object to IPFS via the Intuition pinning service.

SDK helpers accept the Thing fields directly (`name`, `description`, `image`, `url`). Raw GraphQL mutation requests use the GraphQL `thing` input wrapper.

### Function Signature

```typescript
function pinThing(
  variables: PinThingMutationVariables,
  options?: PinThingOptions,
): Promise<string>;
```

### Basic Example

```typescript
import { configureSdk, pinThing } from '@0xintuition/sdk';

configureSdk({
  pinApiKey: process.env.INTUITION_PIN_API_KEY,
});

const uri = await pinThing({
  url: 'https://example.com',
  name: 'Example Project',
  description: 'A great project',
  image: 'https://example.com/logo.png',
});

console.log('Pinned to IPFS:', uri); // ipfs://bafkreib...
```

### Pin Thing and Create Atom

Use `createAtomFromThing` when you want the SDK to pin the Thing metadata and create the atom in one flow:

```typescript
import { configureSdk, createAtomFromThing } from '@0xintuition/sdk';
import { parseEther } from 'viem';

configureSdk({
  pinApiKey: process.env.INTUITION_PIN_API_KEY,
});

const atom = await createAtomFromThing(
  { walletClient, publicClient, address },
  {
    url: 'https://myproject.com',
    name: 'My Project',
    description: 'A blockchain project',
    image: 'https://myproject.com/logo.png',
  },
  { depositAmount: parseEther('0.05') },
);

console.log('Atom created:', atom.state.termId);
console.log('IPFS URI:', atom.uri);
```

## Direct Pinata Uploads

Use direct Pinata uploads when you want to bring your own Pinata account. These paths do not use the Intuition pin API key.

### uploadJsonToPinata

Upload JSON directly to Pinata.

#### Function Signature

```typescript
function uploadJsonToPinata(
  pinataApiJWT: string,
  data: object,
): Promise<PinataUploadResult>;
```

#### Basic Example

```typescript
import { uploadJsonToPinata } from '@0xintuition/sdk';

const result = await uploadJsonToPinata(process.env.PINATA_API_JWT!, {
  name: 'My Data',
  description: 'Some metadata',
  properties: {
    key: 'value',
  },
});

console.log('IPFS Hash:', result.IpfsHash);
console.log('Size:', result.PinSize, 'bytes');
console.log('URI:', `ipfs://${result.IpfsHash}`);
```

### Return Type

```typescript
type PinataUploadResult = {
  IpfsHash: string;
  PinSize: number;
  Timestamp: string;
};
```

## Getting a Pinata API Key

Direct Pinata upload paths require a Pinata API JWT:

1. Sign up at [pinata.cloud](https://pinata.cloud)
2. Go to API Keys
3. Create a new API key
4. Copy the JWT token
5. Store it securely in environment variables

```bash title=".env"
PINATA_API_JWT=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Batch Pin Multiple Items

```typescript
import { configureSdk, pinThing } from '@0xintuition/sdk';

configureSdk({
  pinApiKey: process.env.INTUITION_PIN_API_KEY,
});

async function batchPin(things: any[]) {
  return Promise.all(things.map((thing) => pinThing(thing)));
}

const projects = [
  {
    name: 'Project A',
    description: 'Project A metadata',
    image: 'https://a.com/logo.png',
    url: 'https://a.com',
  },
  {
    name: 'Project B',
    description: 'Project B metadata',
    image: 'https://b.com/logo.png',
    url: 'https://b.com',
  },
];

const ipfsUris = await batchPin(projects);
console.log('Pinned', ipfsUris.length, 'items to IPFS');
```

## Error Handling

```typescript
import { pinThing } from '@0xintuition/sdk';

async function safePinThing(thing: any) {
  try {
    const uri = await pinThing(thing);
    return { success: true, uri };
  } catch (error) {
    console.error('Failed to pin:', error);
    return { success: false, error: error.message };
  }
}
```

Common causes include a missing `pinApiKey`, an invalid API key, missing metadata fields, or image URLs that cannot be fetched by the pinning service.

## Related Functions

- [**createAtomFromThing**](../atoms-guide.md#creating-from-thing) - Create atom with auto-pinning
- [**createAtomFromIpfsUri**](../atoms-guide.md#createatomfromipfsuri) - Create from IPFS URI
- [**createAtomFromIpfsUpload**](../atoms-guide.md#createatomfromipfsupload) - Upload directly to Pinata and create

## See Also

- [Example: Thing IPFS Pinning](../examples/thing-ipfs-pinning.md)
- [Pinata Documentation](https://docs.pinata.cloud/)
- [IPFS Documentation](https://docs.ipfs.tech/)
