---
title: Configuration
sidebar_label: Configuration
sidebar_position: 2
description: Configure clients, networks, and contract addresses for the Intuition Protocol
keywords: [configuration, setup, networks, viem, client, contract addresses]
---

# Configuration

This guide covers how to configure the Protocol package for use with Intuition networks, including client setup, network configuration, and contract address management.

## Client Configuration

The Protocol package uses two types of configurations depending on the operation:

### ReadConfig (Read-Only Operations)

For querying data without submitting transactions:

```typescript
import type { ReadConfig } from '@0xintuition/protocol'
import { createPublicClient, http } from 'viem'
import { intuitionTestnet, getMultiVaultAddressFromChainId } from '@0xintuition/protocol'

const publicClient = createPublicClient({
  chain: intuitionTestnet,
  transport: http(),
})

const readConfig: ReadConfig = {
  address: getMultiVaultAddressFromChainId(intuitionTestnet.id),
  publicClient: publicClient,
}
```

### WriteConfig (Transaction Operations)

For operations that modify blockchain state:

```typescript
import type { WriteConfig } from '@0xintuition/protocol'
import { createPublicClient, createWalletClient, http } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'

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

const writeConfig: WriteConfig = {
  address: getMultiVaultAddressFromChainId(intuitionTestnet.id),
  publicClient: publicClient,
  walletClient: walletClient,
}
```

## Network Configuration

### Intuition Testnet

The testnet is ideal for development and testing:

```typescript
import { intuitionTestnet } from '@0xintuition/protocol'

// Chain Configuration
const testnet = {
  id: 13579,
  name: 'Intuition Testnet',
  nativeCurrency: {
    name: 'Testnet TRUST',
    symbol: 'tTRUST',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://testnet.rpc.intuition.systems/http'],
      webSocket: ['wss://testnet.rpc.intuition.systems/ws'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Intuition Testnet Explorer',
      url: 'https://testnet.explorer.intuition.systems',
    },
  },
}

// Usage
const publicClient = createPublicClient({
  chain: intuitionTestnet,
  transport: http(),
})
```

### Intuition Mainnet

For production deployments:

```typescript
import { intuitionMainnet } from '@0xintuition/protocol'

// Chain Configuration
const mainnet = {
  id: 1155,
  name: 'Intuition',
  nativeCurrency: {
    name: 'TRUST',
    symbol: 'TRUST',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.intuition.systems/http'],
      webSocket: ['wss://rpc.intuition.systems/ws'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Intuition Explorer',
      url: 'https://explorer.intuition.systems',
    },
  },
}

// Usage
const publicClient = createPublicClient({
  chain: intuitionMainnet,
  transport: http(),
})
```

## Contract Addresses

### MultiVault Contract

The MultiVault is the main protocol contract for atoms, triples, and vaults:

```typescript
import { getMultiVaultAddressFromChainId, intuitionTestnet, intuitionMainnet } from '@0xintuition/protocol'

// Testnet
const testnetAddress = getMultiVaultAddressFromChainId(intuitionTestnet.id)
// Returns: '0x2Ece8D4dEdcB9918A398528f3fa4688b1d2CAB91'

// Mainnet
const mainnetAddress = getMultiVaultAddressFromChainId(intuitionMainnet.id)
// Returns: '0x6E35cF57A41fA15eA0EaE9C33e751b01A784Fe7e'
```

### Other Protocol Contracts

For accessing other contracts like TrustBonding or WrappedTrust:

```typescript
import { getContractAddressFromChainId } from '@0xintuition/protocol'

// TrustBonding contract (for epoch rewards)
const bondingAddress = getContractAddressFromChainId('TrustBonding', intuitionMainnet.id)
// Returns: '0x635bBD1367B66E7B16a21D6E5A63C812fFC00617'

// WrappedTrust contract (for token wrapping)
const wrappedTrustAddress = getContractAddressFromChainId('WrappedTrust', intuitionMainnet.id)
// Returns: '0x81cFb09cb44f7184Ad934C09F82000701A4bF672'

// Bonding curve contracts
const linearCurve = getContractAddressFromChainId('LinearCurve', intuitionMainnet.id)
const progressiveCurve = getContractAddressFromChainId('OffsetProgressiveCurve', intuitionMainnet.id)
```

#### Available Contracts

- **`'Trust'`** - Native TRUST token (only on Base: Chain ID 8453)
- **`'WrappedTrust'`** - Wrapped TRUST token
- **`'MultiVault'`** - Main protocol contract
- **`'TrustBonding'`** - Bonding and rewards contract
- **`'BondingCurveRegistry'`** - Curve registry
- **`'LinearCurve'`** - Linear bonding curve
- **`'OffsetProgressiveCurve'`** - Progressive bonding curve

### All Deployments

Access all contract addresses directly:

```typescript
import { intuitionDeployments } from '@0xintuition/protocol'

// Access deployment data
const allDeployments = intuitionDeployments
/*
{
  MultiVault: { 1155: '0x6E35...', 13579: '0x2Ece...' },
  TrustBonding: { 1155: '0x635b...', 13579: '0x75dD...' },
  WrappedTrust: { 1155: '0x81cF...', 13579: '0xDE80...' },
  BondingCurveRegistry: { ... },
  LinearCurve: { ... },
  OffsetProgressiveCurve: { ... },
}
*/
```

## Transport Options

### HTTP Transport

Standard HTTP connection (recommended for most use cases):

```typescript
import { http } from 'viem'

const publicClient = createPublicClient({
  chain: intuitionTestnet,
  transport: http(),
})
```

### WebSocket Transport

Real-time updates and subscriptions:

```typescript
import { webSocket } from 'viem'

const publicClient = createPublicClient({
  chain: intuitionTestnet,
  transport: webSocket('wss://testnet.rpc.intuition.systems/ws'),
})

// Subscribe to new blocks
const unwatch = publicClient.watchBlockNumber({
  onBlockNumber: (blockNumber) => {
    console.log('New block:', blockNumber)
  },
})
```

### Custom RPC

Use a custom RPC endpoint:

```typescript
const publicClient = createPublicClient({
  chain: intuitionTestnet,
  transport: http('https://your-custom-rpc-endpoint.com'),
})
```

## Wallet Configuration

### Private Key Account

For server-side or automated operations:

```typescript
import { privateKeyToAccount } from 'viem/accounts'

const account = privateKeyToAccount('0x...')

const walletClient = createWalletClient({
  account,
  chain: intuitionTestnet,
  transport: http(),
})
```

### Browser Wallet (MetaMask, etc.)

For browser-based applications:

```typescript
import { custom } from 'viem'
import { createWalletClient } from 'viem'

// Browser wallet
const walletClient = createWalletClient({
  chain: intuitionTestnet,
  transport: custom(window.ethereum),
})

// Get account from wallet
const [account] = await walletClient.getAddresses()
```

### Using Wagmi (React)

For React applications using Wagmi:

```typescript
import { usePublicClient, useWalletClient } from 'wagmi'
import { getMultiVaultAddressFromChainId, multiVaultGetAtomCost } from '@0xintuition/protocol'

function MyComponent() {
  const publicClient = usePublicClient()
  const { data: walletClient } = useWalletClient()

  const address = getMultiVaultAddressFromChainId(publicClient.chain.id)

  const fetchAtomCost = async () => {
    const cost = await multiVaultGetAtomCost({ address, publicClient })
    console.log('Atom cost:', cost)
  }

  return <button onClick={fetchAtomCost}>Get Atom Cost</button>
}
```

## Environment Variables

Store sensitive configuration in environment variables:

```bash
# .env
PRIVATE_KEY=0x...
RPC_URL=https://testnet.rpc.intuition.systems/http
CHAIN_ID=13579
```

```typescript
import { privateKeyToAccount } from 'viem/accounts'
import { createPublicClient, createWalletClient, http } from 'viem'
import { intuitionTestnet } from '@0xintuition/protocol'

const account = privateKeyToAccount(process.env.PRIVATE_KEY as `0x${string}`)

const publicClient = createPublicClient({
  chain: intuitionTestnet,
  transport: http(process.env.RPC_URL),
})

const walletClient = createWalletClient({
  account,
  chain: intuitionTestnet,
  transport: http(process.env.RPC_URL),
})
```

## Complete Configuration Example

Here's a complete configuration setup for a production application:

```typescript
import {
  createPublicClient,
  createWalletClient,
  http,
  webSocket,
} from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import {
  intuitionMainnet,
  intuitionTestnet,
  getMultiVaultAddressFromChainId,
  getContractAddressFromChainId,
} from '@0xintuition/protocol'

// Determine network from environment
const isProduction = process.env.NODE_ENV === 'production'
const chain = isProduction ? intuitionMainnet : intuitionTestnet

// Create account from private key
const account = privateKeyToAccount(process.env.PRIVATE_KEY as `0x${string}`)

// Create public client (for reads)
const publicClient = createPublicClient({
  chain,
  transport: http(),
})

// Create wallet client (for writes)
const walletClient = createWalletClient({
  account,
  chain,
  transport: http(),
})

// Get contract addresses
const multiVaultAddress = getMultiVaultAddressFromChainId(chain.id)
const trustBondingAddress = getContractAddressFromChainId('TrustBonding', chain.id)
const wrappedTrustAddress = getContractAddressFromChainId('WrappedTrust', chain.id)

// Export configuration
export const config = {
  publicClient,
  walletClient,
  account,
  addresses: {
    multiVault: multiVaultAddress,
    trustBonding: trustBondingAddress,
    wrappedTrust: wrappedTrustAddress,
  },
}
```

## Next Steps

- [Core Concepts: Atoms](/docs/guides/developer-tools/protocol/core-concepts/atoms) - Learn about atoms
- [API Reference: MultiVault](/docs/guides/developer-tools/protocol/api-reference/multivault/atoms) - Explore available functions
- [Examples](/docs/guides/developer-tools/protocol/examples/creating-atoms-triples) - See complete workflows
