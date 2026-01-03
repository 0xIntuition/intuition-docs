---
title: Installation & Setup
sidebar_label: Installation & Setup
sidebar_position: 0
description: Install the Intuition SDK and configure your development environment
keywords: [sdk, installation, npm, pnpm, bun, viem, dependencies, setup, configuration, wallet, network, testnet, mainnet]
---

# Installation & Setup

The Intuition SDK is a comprehensive TypeScript library for building applications on the Intuition protocol. This guide covers installation, configuration, and getting your development environment ready.

## Prerequisites

- **Node.js**: Version 18.x or higher
- **Package Manager**: npm, pnpm, yarn, or bun
- **TypeScript** (recommended): Version 5.x or higher

## Installation

Install the SDK using your preferred package manager:

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
<TabItem value="npm" label="npm" default>

```bash
npm install @0xintuition/sdk viem@^2.0.0
```

</TabItem>
<TabItem value="pnpm" label="pnpm">

```bash
pnpm add @0xintuition/sdk viem@^2.0.0
```

</TabItem>
<TabItem value="bun" label="bun">

```bash
bun add @0xintuition/sdk viem@^2.0.0
```

</TabItem>
</Tabs>

:::note
The SDK requires **viem@2.x** as a peer dependency. Viem is a lightweight, type-safe Ethereum library that powers all blockchain operations.
:::

## Verify Installation

Create a test file to verify everything is working:

```typescript title="test-install.ts"
import {
  intuitionTestnet,
  getMultiVaultAddressFromChainId,
} from '@0xintuition/sdk'

console.log('Network:', intuitionTestnet.name)
console.log('Chain ID:', intuitionTestnet.id)
console.log('MultiVault:', getMultiVaultAddressFromChainId(intuitionTestnet.id))
```

Run it with `npx tsx test-install.ts` or your preferred TypeScript runner.

---

## Client Configuration

The SDK uses [Viem](https://viem.sh) clients for blockchain interactions. You need two types:

| Client Type | Purpose | Required For |
|-------------|---------|--------------|
| **Public Client** | Read-only operations | Querying data, checking balances |
| **Wallet Client** | Write operations | Creating atoms, triples, deposits |

### Basic Setup

```typescript
import {
  intuitionTestnet,
  getMultiVaultAddressFromChainId,
} from '@0xintuition/sdk'
import { createPublicClient, createWalletClient, http } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'

// 1. Create account from private key
const account = privateKeyToAccount('0xYOUR_PRIVATE_KEY')

// 2. Create public client (for reading data)
const publicClient = createPublicClient({
  chain: intuitionTestnet,
  transport: http(),
})

// 3. Create wallet client (for transactions)
const walletClient = createWalletClient({
  chain: intuitionTestnet,
  transport: http(),
  account,
})

// 4. Get contract address
const address = getMultiVaultAddressFromChainId(intuitionTestnet.id)
```

### Configuration Object

Most SDK functions accept a configuration object:

```typescript
import type { WriteConfig } from '@0xintuition/sdk'

const config: WriteConfig = {
  address,        // MultiVault contract address
  publicClient,   // For reading blockchain data
  walletClient,   // For sending transactions
}
```

---

## Network Configuration

The SDK supports multiple networks with built-in chain definitions.

### Supported Networks

| Network | Chain ID | Type | Status |
|---------|----------|------|--------|
| Intuition Mainnet | 1155 | Production | ✅ Active |
| Intuition Testnet | 13579 | Development | ✅ Active |
| Base Mainnet | 8453 | Production | ✅ Active |
| Base Sepolia | 84532 | Development | ✅ Active |

### Testnet Configuration

```typescript
import { intuitionTestnet } from '@0xintuition/sdk'
import { createPublicClient, http } from 'viem'

const publicClient = createPublicClient({
  chain: intuitionTestnet,
  transport: http(),
})

// Network details available:
// Chain ID: 13579
// Currency: tTRUST
// RPC: https://testnet.rpc.intuition.systems/http
// Explorer: https://testnet.explorer.intuition.systems
```

### Mainnet Configuration

```typescript
import { intuitionMainnet } from '@0xintuition/sdk'
import { createPublicClient, http } from 'viem'

const publicClient = createPublicClient({
  chain: intuitionMainnet,
  transport: http(),
})

// Network details available:
// Chain ID: 1155
// Currency: TRUST
// RPC: https://rpc.intuition.systems/http
// Explorer: https://explorer.intuition.systems
```

---

## Contract Addresses

The SDK provides utilities to get contract addresses for any supported network:

```typescript
import {
  getMultiVaultAddressFromChainId,
  getContractAddressFromChainId,
  intuitionDeployments,
} from '@0xintuition/sdk'

// Get MultiVault address (most commonly used)
const multiVaultAddress = getMultiVaultAddressFromChainId(chainId)

// Get other contract addresses
const trustBonding = getContractAddressFromChainId('TrustBonding', chainId)
const wrappedTrust = getContractAddressFromChainId('WrappedTrust', chainId)
```

---

## Account Options

### Private Key

```typescript
import { privateKeyToAccount } from 'viem/accounts'

const account = privateKeyToAccount('0xYOUR_PRIVATE_KEY')
```

### Mnemonic Phrase

```typescript
import { mnemonicToAccount } from 'viem/accounts'

const account = mnemonicToAccount(
  'your twelve word mnemonic phrase goes here'
)
```

### Browser Wallet (MetaMask, etc.)

```typescript
import { createWalletClient, custom } from 'viem'
import { intuitionTestnet } from '@0xintuition/sdk'

const walletClient = createWalletClient({
  chain: intuitionTestnet,
  transport: custom(window.ethereum),
})
```

---

## Environment Variables

Store sensitive data in environment variables:

```bash title=".env"
PRIVATE_KEY=0xYOUR_PRIVATE_KEY
PINATA_API_JWT=your-pinata-jwt-token
```

```typescript title="config.ts"
import { privateKeyToAccount } from 'viem/accounts'

const account = privateKeyToAccount(process.env.PRIVATE_KEY as `0x${string}`)
const pinataApiJWT = process.env.PINATA_API_JWT
```

---

## TypeScript Configuration

For optimal TypeScript support:

```json title="tsconfig.json"
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020"],
    "moduleResolution": "bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "resolveJsonModule": true
  }
}
```

---

## Advanced Configuration

### Custom RPC Endpoint

```typescript
const publicClient = createPublicClient({
  chain: intuitionTestnet,
  transport: http('https://your-custom-rpc-endpoint.com'),
})
```

### Fallback Transports

Configure backup RPC endpoints for reliability:

```typescript
import { fallback, http } from 'viem'

const publicClient = createPublicClient({
  chain: intuitionTestnet,
  transport: fallback([
    http('https://testnet.rpc.intuition.systems/http'),
    http('https://backup-rpc.example.com'),
  ]),
})
```

### Batch Requests (Multicall)

Enable batching for multiple read operations:

```typescript
const publicClient = createPublicClient({
  chain: intuitionTestnet,
  transport: http(),
  batch: {
    multicall: true,
  },
})
```

---

## Complete Configuration Example

```typescript title="intuition-client.ts"
import {
  intuitionTestnet,
  getMultiVaultAddressFromChainId,
} from '@0xintuition/sdk'
import type { WriteConfig } from '@0xintuition/sdk'
import {
  createPublicClient,
  createWalletClient,
  http,
  fallback,
} from 'viem'
import { privateKeyToAccount } from 'viem/accounts'

// Account
const account = privateKeyToAccount(process.env.PRIVATE_KEY as `0x${string}`)

// Public client with fallback and batching
const publicClient = createPublicClient({
  chain: intuitionTestnet,
  transport: fallback([
    http('https://testnet.rpc.intuition.systems/http'),
    http('https://backup-rpc.example.com'),
  ]),
  batch: {
    multicall: true,
  },
})

// Wallet client
const walletClient = createWalletClient({
  chain: intuitionTestnet,
  transport: http('https://testnet.rpc.intuition.systems/http'),
  account,
})

// Contract address
const address = getMultiVaultAddressFromChainId(intuitionTestnet.id)

// Export configuration
export const config: WriteConfig = {
  address,
  publicClient,
  walletClient,
  pinataApiJWT: process.env.PINATA_API_JWT,
}
```

---

## Optional: Pinata for IPFS

For IPFS operations (uploading metadata), you'll need a Pinata API token:

1. Sign up at [pinata.cloud](https://pinata.cloud)
2. Create an API key and get your JWT token
3. Pass it in the config when using IPFS upload functions

```typescript
import { createAtomFromIpfsUpload } from '@0xintuition/sdk'

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
  }
)
```

---

## Local Development

For contributing or testing with a custom build:

<Tabs>
<TabItem value="npm-local" label="npm" default>

```bash
git clone https://github.com/0xIntuition/intuition-ts.git
cd intuition-ts/packages/sdk
npm install
npm run build
npm link

# In your project
npm link @0xintuition/sdk
```

</TabItem>
<TabItem value="pnpm-local" label="pnpm">

```bash
git clone https://github.com/0xIntuition/intuition-ts.git
cd intuition-ts/packages/sdk
pnpm install
pnpm build
pnpm link --global

# In your project
pnpm link --global @0xintuition/sdk
```

</TabItem>
<TabItem value="bun-local" label="bun">

```bash
git clone https://github.com/0xIntuition/intuition-ts.git
cd intuition-ts/packages/sdk
bun install
bun run build
bun link

# In your project
bun link @0xintuition/sdk
```

</TabItem>
</Tabs>

---

## Troubleshooting

### Module Resolution Errors

1. Ensure `viem` is version `^2.0.0` or higher
2. Check your `tsconfig.json` module resolution settings
3. Clear cache and reinstall:

```bash
rm -rf node_modules package-lock.json
npm install
```

### Type Errors

1. Ensure TypeScript version is 5.x or higher
2. Update `@types/node` to the latest version
3. Run `npx tsc --noEmit` to check for type errors

---

## Package Information

- **NPM**: [@0xintuition/sdk](https://www.npmjs.com/package/@0xintuition/sdk)
- **Repository**: [github.com/0xIntuition/intuition-ts](https://github.com/0xIntuition/intuition-ts)
- **Discord**: [Intuition Discord](https://discord.gg/RgBenkX4mx)

---

## Next Steps

- [**Quick Start**](./quick-start.md) - Create your first atom and triple
- [**Working with Atoms**](./atoms-guide.md) - Learn about creating atoms
- [**React Integration**](./integrations/react.md) - Use the SDK with React

## See Also

- [Viem Documentation](https://viem.sh)
- [Protocol Package](/docs/guides/developer-tools/protocol/getting-started/overview) - Low-level contract interactions
- [GraphQL API](/docs/guides/developer-tools/graphql-api/overview) - Query protocol data
