---
sidebar_position: 5
sidebar_label: Intuition Kits
title: Intuition Kits
---

# Intuition Kits

Jump-start your development with our official Intuition kits and resources. These pre-configured templates and official tools provide everything you need to build Intuition-powered applications.

## Official Kits

### Core Development Tools

| Resource | Description | Primary Use |
|----------|-------------|-------------|
| **[intuition-ts](https://github.com/0xIntuition/intuition-ts)** | TypeScript SDK and tools | Main SDK for application development |
| **[intuition-contracts-v2](https://github.com/0xIntuition/intuition-contracts-v2)** | Smart contracts and protocol implementation | Core protocol and contract development |
| **[intuition-rs](https://github.com/0xIntuition/intuition-rs)** | Rust implementation | High-performance applications and services |

### Integration Tools

| Resource | Description | Primary Use |
|----------|-------------|-------------|
| **[intuition-mcp-server](https://github.com/0xIntuition/intuition-mcp-server)** | MCP server implementation | AI integration and model context protocol |

### Documentation & Ecosystem

| Resource | Description |
|----------|-------------|
| **[intuition-docs](https://github.com/0xIntuition/intuition-docs)** | Documentation and guides |

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

### Smart Contracts (intuition-contracts-v2)
The protocol implementation includes all necessary smart contracts:

```bash
# Clone the contracts repository
git clone https://github.com/0xIntuition/intuition-contracts-v2.git
cd intuition-contracts-v2

# Install dependencies
npm install

# Compile contracts
npm run compile
```


## Community Kits

### Coming Soon

Community-built kits and templates will be available here soon. We're working on creating a platform for the Intuition community to share their starter kits, templates, and specialized solutions.

Stay tuned for:
- Community-contributed starter kits
- Industry-specific templates
- Specialized use case solutions
- Community showcase and reviews

## Development Workflow

1. **Choose your starting point**: SDK, contracts, or ecosystem tools
2. **Set up your environment**: Configure wallet connections and network settings
3. **Build your application**: Use the SDK to create atoms, triples, and relationships
4. **Test and deploy**: Use the provided testing frameworks and deployment scripts

## Next Steps

- Learn about [Smart Contracts](/docs/protocol/getting-started/overview) for advanced features
- Check out the [GraphQL API](/docs/graphql-api/overview) for data integration
- Explore the [SDK Guide](/docs/intuition-sdk/quick-start) for application development

Start building with the official Intuition resources and join the community!