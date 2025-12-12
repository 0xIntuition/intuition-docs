---
title: Network Configuration
sidebar_label: Network Setup
sidebar_position: 6
description: Configure your app to connect to Intuition Network
---

# Network Configuration

Configure your application to connect to Intuition Network.

## Intuition Testnet

### Chain Details

- **Chain ID:** 13579
- **RPC URL:** https://testnet.rpc.intuition.systems/
- **Explorer:** https://testnet.explorer.intuition.systems
- **Currency:** tTRUST
- **Name:** Intuition Testnet

### Wagmi Configuration

```typescript
import { defineChain } from 'viem'
import { createConfig } from 'wagmi'

const intuitionTestnet = defineChain({
  id: 13579,
  name: 'Intuition Testnet',
  network: 'intuition-testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'TRUST',
    symbol: 'tTRUST',
  },
  rpcUrls: {
    default: {
      http: ['https://testnet.rpc.intuition.systems/'],
    },
    public: {
      http: ['https://testnet.rpc.intuition.systems/'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Explorer',
      url: 'https://testnet.explorer.intuition.systems',
    },
  },
})

export const config = createConfig({
  chains: [intuitionTestnet],
  // ... rest of your config
})
```

### Privy Configuration

```typescript
import { PrivyProvider } from '@privy-io/react-auth'

function App() {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
      config={{
        supportedChains: [
          {
            id: 13579,
            name: 'Intuition Testnet',
            network: 'intuition-testnet',
            nativeCurrency: {
              name: 'TRUST',
              symbol: 'tTRUST',
              decimals: 18,
            },
            rpcUrls: {
              default: {
                http: ['https://testnet.rpc.intuition.systems/'],
              },
            },
          },
        ],
      }}
    >
      {/* Your app */}
    </PrivyProvider>
  )
}
```

### Contract Addresses

```typescript
import { getMultiVaultAddressFromChainId } from '@0xintuition/protocol'

// Get the MultiVault contract address for testnet
const vaultAddress = getMultiVaultAddressFromChainId(13579)
```

## Mainnet Configuration

> Mainnet is coming soon! Check back for updates.

## Environment Variables

Add these to your `.env` file:

```bash
# Network Configuration
NEXT_PUBLIC_CHAIN_ID=13579
NEXT_PUBLIC_RPC_URL=https://testnet.rpc.intuition.systems/

# Contract Addresses (auto-detected by SDK)
# Or override if needed:
# NEXT_PUBLIC_MULTIVAULT_ADDRESS=0x...
```

## Troubleshooting

### RPC Connection Issues

If you're having trouble connecting:

1. Verify your RPC URL is correct
2. Check that your wallet is connected to the right network
3. Try using a different RPC endpoint (if available)

### Contract Address Issues

Make sure you're using the correct contract addresses for the testnet. The SDK auto-detects these, but you can override them if needed.

## Next Steps

- [Quick Start Guide](/docs/guides/getting-started/quickstart)
- [SDK Setup](/docs/guides/developer-tools/sdk/getting-started/setup)
- [Protocol Configuration](/docs/guides/developer-tools/protocol/getting-started/configuration)
