---
sidebar_position: 3
---

# Official Kits

Jump-start your development with our official Intuition starter kits and resources. These pre-configured templates and official tools provide everything you need to build Intuition-powered applications.

## Quick Navigation

| Resource | Type | Purpose | Link |
|----------|------|---------|------|
| **Speed Run Intuition** | Showcase | Learn SDK & build reference apps | [View Details](#speed-run-kit) |
| **TypeScript SDK** | Core Library | Main SDK for Intuition development | [GitHub](https://github.com/0xIntuition/intuition-ts) |
| **Smart Contracts** | Protocol | Core protocol implementation | [GitHub](https://github.com/0xIntuition/intuition-contracts) |
| **Browser Extension** | Tool | Browser integration | [GitHub](https://github.com/0xIntuition/intuition-chrome-extension) |
| **MetaMask Snap** | Tool | Wallet integration | [GitHub](https://github.com/0xIntuition/intuition-snap) |
| **Farcaster Frame** | Tool | Social media integration | [GitHub](https://github.com/0xIntuition/intuition-frame) |

## Available Kits

### Speed Run Kit
A comprehensive SDK showcase demonstrating all major Intuition functions with a modern, user-friendly interface.

```bash
# Clone the showcase project
git clone https://github.com/robbiekruszynski/intuition_speedrun.git
cd intuition_speedrun

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
# Add your WalletConnect Project ID and Pinata API Token

# Start development server
pnpm dev
```

**Features:**
- Complete SDK functionality demonstration
- Atom and triple creation examples
- Batch operations and vault lookup
- IPFS integration with Pinata
- Multi-network support (Ethereum, Base, Arbitrum)
- Real-world use case examples

**Perfect for:** Learning the SDK, understanding Intuition concepts, and building reference implementations.

## Official Developer Resources

Based on the [official tech documentation](https://tech.docs.intuition.systems/), here are the actual available resources:

### Core Development Tools

| Resource | Description | Primary Use |
|----------|-------------|-------------|
| **[intuition-ts](https://github.com/0xIntuition/intuition-ts)** | TypeScript SDK and tools | Main SDK for application development |
| **[intuition-contracts](https://github.com/0xIntuition/intuition-contracts)** | Smart contracts and protocol implementation | Core protocol and contract development |
| **[intuition-rs](https://github.com/0xIntuition/intuition-rs)** | Rust implementation | High-performance applications and services |

### Integration Tools

| Resource | Description | Primary Use |
|----------|-------------|-------------|
| **[intuition-chrome-extension](https://github.com/0xIntuition/intuition-chrome-extension)** | Browser extension | Web browser integration |
| **[intuition-snap](https://github.com/0xIntuition/intuition-snap)** | MetaMask snap | Wallet integration |
| **[intuition-frame](https://github.com/0xIntuition/intuition-frame)** | Farcaster frame integration | Social media integration |

### Documentation & Ecosystem

| Resource | Description | Link |
|----------|-------------|------|
| **Whitepaper** | Comprehensive technical documentation | [View](https://tech.docs.intuition.systems/) |
| **Litepaper** | Simplified overview | [View](https://tech.docs.intuition.systems/) |
| **Explorer** | Browse and explore the Intuition network | [View](https://tech.docs.intuition.systems/) |
| **Data Populator** | Tools for populating data | [View](https://tech.docs.intuition.systems/) |
| **Genesis NFT** | Community tokens | [View](https://tech.docs.intuition.systems/) |

## Getting Started with Official Resources

### TypeScript SDK (intuition-ts)
The official TypeScript SDK provides the core functionality for interacting with the Intuition protocol:

```bash
# Install the SDK
npm install @0xintuition/sdk

# Basic usage
import { createAtomFromString } from '@0xintuition/sdk'

const config = {
  walletClient,
  publicClient,
  ethMultiVaultAddress
}

const result = await createAtomFromString(config, 'Hello World')
```

### Smart Contracts (intuition-contracts)
The protocol implementation includes all necessary smart contracts:

```bash
# Clone the contracts repository
git clone https://github.com/0xIntuition/intuition-contracts.git
cd intuition-contracts

# Install dependencies
npm install

# Compile contracts
npm run compile
```

### Browser Extension
Integrate Intuition directly into web browsers:

```bash
# Clone the extension
git clone https://github.com/0xIntuition/intuition-chrome-extension.git
cd intuition-chrome-extension

# Install dependencies
npm install

# Build for development
npm run build:dev
```

## Development Workflow

1. **Choose your starting point**: SDK, contracts, or ecosystem tools
2. **Set up your environment**: Configure wallet connections and network settings
3. **Build your application**: Use the SDK to create atoms, triples, and relationships
4. **Test and deploy**: Use the provided testing frameworks and deployment scripts

## Next Steps

- Explore [Community-Built Kits](/guides/quickstart/community-built-kits) for additional templates
- Learn about [Smart Contracts](/guides/developer-tools/contracts) for advanced features
- Check out the [GraphQL API](/graphql) for data integration
- Visit the [official tech documentation](https://tech.docs.intuition.systems/) for comprehensive guides

Start building with the official Intuition resources and join the community! 