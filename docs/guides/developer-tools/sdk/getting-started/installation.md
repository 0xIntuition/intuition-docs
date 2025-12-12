---
title: Installation
sidebar_label: Installation
sidebar_position: 1
description: Install the Intuition SDK and required dependencies for building on the Intuition protocol
keywords: [sdk, installation, npm, pnpm, bun, viem, dependencies]
---

# Installation

The Intuition SDK is a comprehensive TypeScript library for building applications on the Intuition protocol. This guide covers installation and dependency requirements.

## Prerequisites

- **Node.js**: Version 18.x or higher
- **Package Manager**: npm, pnpm, yarn, or bun
- **TypeScript** (recommended): Version 5.x or higher

## Install the SDK

Choose your preferred package manager:

```bash title="npm"
npm install @0xintuition/sdk viem
```

```bash title="pnpm"
pnpm install @0xintuition/sdk viem
```

```bash title="yarn"
yarn add @0xintuition/sdk viem
```

```bash title="bun"
bun install @0xintuition/sdk viem
```

## Required Peer Dependencies

The SDK requires **viem** as a peer dependency for blockchain interactions:

| Package | Version | Purpose |
|---------|---------|---------|
| `viem` | `^2.0.0` | Ethereum client library for contract interactions |

Viem is a lightweight, type-safe Ethereum library that powers all blockchain operations in the SDK.

## Optional Dependencies

### Pinata API Token

For IPFS operations (uploading and pinning content), you'll need a Pinata API JWT token:

- **Required for**: `createAtomFromIpfsUpload` function
- **Get a token**: Sign up at [pinata.cloud](https://pinata.cloud) and create an API key
- **Setup**: Pass the token in the config when calling IPFS upload functions

```typescript
import { createAtomFromIpfsUpload } from '@0xintuition/sdk'

const atom = await createAtomFromIpfsUpload(
  {
    walletClient,
    publicClient,
    address,
    pinataApiJWT: 'your-pinata-jwt-token', // Required for IPFS uploads
  },
  {
    name: 'My Project',
    description: 'A blockchain project',
  }
)
```

## Verify Installation

Create a simple test file to verify the installation:

```typescript title="test-install.ts"
import {
  intuitionTestnet,
  getMultiVaultAddressFromChainId,
} from '@0xintuition/sdk'

console.log('Network:', intuitionTestnet.name)
console.log('Chain ID:', intuitionTestnet.id)
console.log('MultiVault Address:', getMultiVaultAddressFromChainId(intuitionTestnet.id))
```

Run the test file:

```bash
npx tsx test-install.ts
```

If you see the network information printed, the SDK is installed correctly.

## TypeScript Configuration

For optimal TypeScript support, ensure your `tsconfig.json` includes:

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

## Next Steps

Now that you have the SDK installed, proceed to:

- [**Setup**](./setup.md) - Configure clients and connect to networks
- [**Quick Start**](./quick-start.md) - Create your first atom and triple

## Package Information

- **NPM Package**: [@0xintuition/sdk](https://www.npmjs.com/package/@0xintuition/sdk)
- **Repository**: [github.com/0xIntuition/intuition-ts](https://github.com/0xIntuition/intuition-ts)
- **Documentation**: [docs.intuition.systems](https://docs.intuition.systems)

## Troubleshooting

### Module Resolution Errors

If you encounter module resolution errors, ensure:

1. `viem` is installed at version `^2.0.0` or higher
2. Your `tsconfig.json` has proper module resolution settings
3. Your package manager's lock file is up to date

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Type Errors

If you see TypeScript errors:

1. Ensure TypeScript version is 5.x or higher
2. Update `@types/node` to the latest version
3. Run `npx tsc --noEmit` to check for type errors

## Related Resources

- [Viem Documentation](https://viem.sh)
- [Protocol Package](../../protocol/getting-started/overview.md) - Low-level contract interactions
- [GraphQL API](../../graphql-api/getting-started/introduction.md) - Query protocol data

## See Also

- [Protocol Package](/docs/guides/developer-tools/protocol/getting-started/overview) - For low-level control and batch operations
- [GraphQL API](/docs/guides/developer-tools/graphql-api/overview) - Query atoms, triples, and vaults after creation
- [Core Concepts: Primitives](/docs/guides/core-concepts/primitives/overview) - Understanding atoms, triples, and signals
