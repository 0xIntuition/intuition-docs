---
title: Setup
sidebar_label: Setup
sidebar_position: 2
description: Configure Viem clients and connect to Intuition networks for SDK operations
keywords: [sdk, setup, configuration, viem, client, wallet, network, testnet, mainnet]
---

# Setup

This guide covers client configuration and network setup for the Intuition SDK.

## Client Configuration

The SDK uses [Viem](https://viem.sh) clients for blockchain interactions. You'll need two types of clients:

- **Public Client** - For read-only operations (querying data)
- **Wallet Client** - For write operations (transactions)

### Basic Setup

```typescript
import {
  intuitionTestnet,
  getMultiVaultAddressFromChainId,
} from '@0xintuition/sdk'
import { createPublicClient, createWalletClient, http } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'

// 1. Create an account from private key
const account = privateKeyToAccount('0xYOUR_PRIVATE_KEY')

// 2. Create a public client (for reading data)
const publicClient = createPublicClient({
  chain: intuitionTestnet,
  transport: http(),
})

// 3. Create a wallet client (for transactions)
const walletClient = createWalletClient({
  chain: intuitionTestnet,
  transport: http(),
  account,
})

// 4. Get the MultiVault contract address
const address = getMultiVaultAddressFromChainId(intuitionTestnet.id)
```

### Configuration Object

Most SDK functions accept a configuration object with these clients:

```typescript
import type { WriteConfig } from '@0xintuition/sdk'

const config: WriteConfig = {
  address,        // MultiVault contract address
  publicClient,   // For reading blockchain data
  walletClient,   // For sending transactions
}
```

## Network Configuration

The SDK supports Intuition Mainnet and Testnet networks.

### Intuition Testnet (Development)

```typescript
import { intuitionTestnet } from '@0xintuition/sdk'
import { createPublicClient, http } from 'viem'

const publicClient = createPublicClient({
  chain: intuitionTestnet,
  transport: http(),
})

// Network Details:
// - Chain ID: 13579
// - Name: Intuition Testnet
// - Currency: tTRUST
// - RPC: https://testnet.rpc.intuition.systems/http
// - Explorer: https://testnet.explorer.intuition.systems
```

### Intuition Mainnet (Production)

```typescript
import { intuitionMainnet } from '@0xintuition/sdk'
import { createPublicClient, http } from 'viem'

const publicClient = createPublicClient({
  chain: intuitionMainnet,
  transport: http(),
})

// Network Details:
// - Chain ID: 1155
// - Name: Intuition
// - Currency: TRUST
// - RPC: https://rpc.intuition.systems/http
// - Explorer: https://explorer.intuition.systems
```

## Contract Addresses

The SDK provides utilities to get contract addresses for different networks:

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

// Access all deployments
console.log(intuitionDeployments)
```

## Account Configuration

### Using Private Key

```typescript
import { privateKeyToAccount } from 'viem/accounts'

const account = privateKeyToAccount('0xYOUR_PRIVATE_KEY')
```

### Using Mnemonic

```typescript
import { mnemonicToAccount } from 'viem/accounts'

const account = mnemonicToAccount(
  'your twelve word mnemonic phrase goes here today'
)
```

### Using Browser Wallet (MetaMask, etc.)

When using browser wallets, use the `custom` transport:

```typescript
import { createWalletClient, custom } from 'viem'

const walletClient = createWalletClient({
  chain: intuitionTestnet,
  transport: custom(window.ethereum),
})
```

## Environment Variables

For security, store sensitive data in environment variables:

```bash title=".env"
PRIVATE_KEY=0xYOUR_PRIVATE_KEY
PINATA_API_JWT=your-pinata-jwt-token
```

```typescript title="config.ts"
import { privateKeyToAccount } from 'viem/accounts'

// Load from environment variables
const account = privateKeyToAccount(process.env.PRIVATE_KEY as `0x${string}`)
const pinataApiJWT = process.env.PINATA_API_JWT
```

## Advanced Configuration

### Custom RPC Endpoint

Use a custom RPC endpoint for better performance or redundancy:

```typescript
import { http } from 'viem'

const publicClient = createPublicClient({
  chain: intuitionTestnet,
  transport: http('https://your-custom-rpc-endpoint.com'),
})
```

### Fallback Transports

Configure fallback RPC endpoints for reliability:

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

### Batch Requests

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

## Full Configuration Example

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

// Account setup
const account = privateKeyToAccount(process.env.PRIVATE_KEY as `0x${string}`)

// Public client with fallback
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

## Next Steps

Now that you have your clients configured, proceed to:

- [**Quick Start**](./quick-start.md) - Create your first atom and triple
- [**Atom Management**](../atoms/create-from-string.md) - Learn about creating atoms
- [**React Integration**](../integrations/react.md) - Use the SDK with React hooks

## See Also

- [Protocol Configuration](../../protocol/getting-started/configuration.md) - Low-level client setup
- [Viem Documentation](https://viem.sh/docs/clients/intro) - Client configuration details
- [Networks & Deployments](../../protocol/getting-started/configuration.md#network-configuration) - Complete network information
