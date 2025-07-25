---
sidebar_position: 3
---

# SDKs

Comprehensive guide to Intuition's Software Development Kits (SDKs) for different platforms and languages. Learn how to integrate Intuition into your applications using our official SDKs.

## Available SDKs

### Intuition SDK

The Intuition SDK simplifies development with the Intuition backend systems.

**Version**: Latest  
**Downloads/week**: Active

#### Installation

```bash
npm install @0xintuition/sdk
```

```bash
pnpm install @0xintuition/sdk
```

```bash
bun install @0xintuition/sdk
```

## Usage

The Intuition SDK simplifies reads and writes to the Intuition backend systems, allowing developers to create and manage Atoms and Triples with ease.

The SDK requires `viem@2.x.x` to execute reads and writes.

### Setup

```typescript
import {
  createPublicClient,
  createTestClient,
  createWalletClient,
  http,
  privateKeyToAccount,
  type Chain,
} from 'viem'
import { base } from 'viem/chains'

export const publicClient = createPublicClient({
  chain: base,
  transport: http(),
})

const account = privateKeyToAccount(
  '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
)
export const walletClient = createWalletClient({
  chain: base,
  transport: http(),
  account: account,
})
```

## Core Operations

### Reads

```typescript
import { getAtom, getTriple } from '@0xintuition/sdk'

const atomData = await getAtom('124862')
const tripleData = await getTriple('54670')
```

### Triples

```typescript
import { createAtomFromString, createTripleStatement } from '@0xintuition/sdk'

// Example of creating a triple statement with three atoms
const atom1 = await createAtomFromString(
  { walletClient, publicClient, address: multivaultAddress },
  'atom1',
)
const atom2 = await createAtomFromString(
  { walletClient, publicClient, address: multivaultAddress },
  'atom2',
)
const atom3 = await createAtomFromString(
  { walletClient, publicClient, address: multivaultAddress },
  'atom3',
)

const triple = await createTripleStatement(
  { walletClient, publicClient, address: multivaultAddress },
  {
    args: [atom1.state.vaultId, atom2.state.vaultId, atom3.state.vaultId],
  },
)
```

## Atoms

### Create Atom from String

```typescript
import { createAtomFromString, getEthMultiVaultAddress } from '@0xintuition/sdk'

const ethMultiVaultAddress = getEthMultiVaultAddress(walletClient.chain.id)
const data = await createAtomFromString(
  { walletClient, publicClient, address: ethMultiVaultAddress },
  'is great',
)
```

### Create Atom from IPFS URI

```typescript
import {
  createAtomFromIpfsUri,
  getEthMultiVaultAddress,
} from '@0xintuition/sdk'

const ethMultiVaultAddress = getEthMultiVaultAddress(walletClient.chain.id)
const data = await createAtomFromIpfsUri(
  { walletClient, publicClient, address: ethMultiVaultAddress },
  'ipfs://bafkreib7534cszxn2c6qwoviv43sqh244yfrxomjbealjdwntd6a7atq6u',
)
```

### Create Atom from IPFS Upload

```typescript
import {
  createAtomFromIpfsUpload,
  getEthMultiVaultAddress,
} from '@0xintuition/sdk'

const ethMultiVaultAddress = getEthMultiVaultAddress(walletClient.chain.id)
const data = await createAtomFromIpfsUpload(
  {
    walletClient,
    publicClient,
    address: ethMultiVaultAddress,
    pinataApiKey: 'your-pinata-api-key',
  },
  {
    url: 'https://www.intuition.systems/',
    name: 'Intuition',
    description: 'A decentralized trust protocol',
    image: 'https://example.com/image.png',
    tags: ['decentralized', 'trust', 'protocol'],
    twitter: 'https://twitter.com/intuition_systems',
    github: 'github.com/intuition-systems',
  },
)
```

### Create a Thing

```typescript
import { createThing, getEthMultiVaultAddress } from '@0xintuition/sdk'

const ethMultiVaultAddress = getEthMultiVaultAddress(walletClient.chain.id)
const data = await createThing(
  { walletClient, publicClient, address: ethMultiVaultAddress },
  {
    url: 'https://www.intuition.systems/',
    name: 'Intuition',
    description: 'A decentralized trust protocol',
    image: 'https://example.com/image.png',
  },
)
```

### Create an Ethereum Account

```typescript
import {
  createEthereumAccount,
  getEthMultiVaultAddress,
} from '@0xintuition/sdk'

const ethMultiVaultAddress = getEthMultiVaultAddress(walletClient.chain.id)
const data = await createEthereumAccount(
  { walletClient, publicClient, address: ethMultiVaultAddress },
  {
    address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
    chainId: 1, // Mainnet
  },
)
```

## Response Format

After successfully creating a new Atom, the SDK will return a data object containing the URI, transaction hash, and other relevant state.

```typescript
const data: {
    uri: string
    transactionHash: `0x${string}`;
    state: {
        sender: `0x${string}`;
        receiver: `0x${string}`;
        receiverTotalSharesInVault: bigint;
        senderAssetsAfterTotalFees: bigint;
        sharesForReceiver: bigint;
        entryFee: bigint;
        vaultId: bigint;
        isTriple: boolean;
        isAtomWallet: boolean;
    };
}
```

## Examples

### React Component Example

```typescript
import * as React from 'react'
import { createThing, getEthMultiVaultAddress } from '@0xintuition/sdk'
import { useChainId, usePublicClient, useWalletClient } from 'wagmi'

type IntuitionButton = React.HTMLAttributes<HTMLElement>

const IntuitionButton = ({ children, className }: IntuitionButton) => {
  const chainId = useChainId()
  const publicClient = usePublicClient()
  const { data: walletClient } = useWalletClient()

  const handleClick = async () => {
    const ethMultiVaultAddress = getEthMultiVaultAddress(chainId)
    const data = await createThing(
      { walletClient, publicClient, address: ethMultiVaultAddress },
      {
        url: 'https://www.intuition.systems/',
        name: 'Intuition',
        description: 'A decentralized trust protocol.',
        image: 'https://example.com/image.png',
      },
    )
  }

  return <button onClick={handleClick}>Create Thing</button>
}

export { IntuitionButton }
```

## Development

### Building

Run `pnpm build` to build the library.

### Running Unit Tests

Run `pnpm test` to execute the unit tests.

### Contributing

Contributions are welcome! Please see the main repository for more information on how to contribute.

---

The SDKs provide the foundation for building applications on Intuition across different platforms and languages. 