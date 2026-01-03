---
sidebar_position: 1
---

# Overview

Learn how to set up and run your own Intuition node to participate in the network using the official Rust implementation.

## What is an Intuition Node?

The `intuition-rs` workspace is a comprehensive Rust workspace for blockchain data indexing and processing, featuring a modular architecture with multiple specialized services. This implementation provides high performance, memory safety, and reliability for running Intuition nodes and backend services.

:::warning Node Requirements
Running an Intuition node requires Docker, Rust toolchain, and proper environment configuration. This guide provides comprehensive setup instructions for local development and production deployments.
:::

### Supported Contract Versions
- Multivault v2.0

## Why Run a Node?

Running your own Intuition node provides several key benefits:

- **Full Data Access**: Direct access to all blockchain data without relying on third-party services
- **Network Participation**: Actively contribute to the decentralization and resilience of the Intuition network
- **Custom Indexing**: Tailor data indexing and processing to your specific needs
- **Performance Control**: Optimize performance and resource allocation based on your requirements
- **Enhanced Privacy**: Process and query data without exposing your queries to external services
- **Development Freedom**: Ideal for building and testing applications in a controlled environment

## Architecture

This workspace contains the following core services:

<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>

<div className="uniform-card">
<h3 className="uniform-card-title">Core Services</h3>
<p className="uniform-card-content">
<strong>CLI:</strong> Terminal UI client for interacting with the Intuition system<br/>
<strong>Consumer:</strong> Event processing pipeline using Redis Streams (RAW, DECODED, and RESOLVER consumers)<br/>
<strong>Models:</strong> Domain models and data structures for the Intuition system
</p>
<div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '1rem' }}>
<span style={{ backgroundColor: 'var(--ifm-color-emphasis-100)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.875rem', color: 'var(--ifm-color-emphasis-700)' }}>CLI</span>
<span style={{ backgroundColor: 'var(--ifm-color-emphasis-100)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.875rem', color: 'var(--ifm-color-emphasis-700)' }}>Consumer</span>
<span style={{ backgroundColor: 'var(--ifm-color-emphasis-100)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.875rem', color: 'var(--ifm-color-emphasis-700)' }}>Models</span>
</div>
</div>

<div className="uniform-card">
<h3 className="uniform-card-title">Infrastructure Services</h3>
<p className="uniform-card-content">
<strong>Hasura:</strong> GraphQL API with database migrations and configuration<br/>
<strong>Image Guard:</strong> Image processing and validation service<br/>
<strong>RPC Proxy:</strong> RPC call proxy with caching for eth_call methods
</p>
<div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '1rem' }}>
<span style={{ backgroundColor: 'var(--ifm-color-emphasis-100)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.875rem', color: 'var(--ifm-color-emphasis-700)' }}>GraphQL</span>
<span style={{ backgroundColor: 'var(--ifm-color-emphasis-100)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.875rem', color: 'var(--ifm-color-emphasis-700)' }}>Proxy</span>
</div>
</div>

<div className="uniform-card">
<h3 className="uniform-card-title">Supporting Services</h3>
<p className="uniform-card-content">
<strong>Histocrawler:</strong> Historical data crawler<br/>
<strong>Shared Utils:</strong> Common utilities and shared code<br/>
<strong>Migration Scripts:</strong> Database migration utilities
</p>
<div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '1rem' }}>
<span style={{ backgroundColor: 'var(--ifm-color-emphasis-100)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.875rem', color: 'var(--ifm-color-emphasis-700)' }}>Crawler</span>
<span style={{ backgroundColor: 'var(--ifm-color-emphasis-100)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.875rem', color: 'var(--ifm-color-emphasis-700)' }}>Utils</span>
</div>
</div>

</div>

### Event Processing Pipeline

The system processes blockchain events through multiple stages:

1. **RAW** - Raw event ingestion from blockchain
2. **DECODED** - Event decoding and parsing
3. **RESOLVER** - Data resolution and enrichment
4. **IPFS-UPLOAD** - Upload images to IPFS and track them in the local DB

## Prerequisites

### Required Tools

<div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
<div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
<div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: 'var(--ifm-color-success)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
<svg width="12" height="12" viewBox="0 0 24 24" fill="white"><path d="M9,20.42L2.79,14.21L5.62,11.38L9,14.77L18.88,4.88L21.71,7.71L9,20.42Z"/></svg>
</div>
<span><strong>Rust toolchain:</strong> Install with <code>curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh</code></span>
</div>
<div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
<div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: 'var(--ifm-color-success)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
<svg width="12" height="12" viewBox="0 0 24 24" fill="white"><path d="M9,20.42L2.79,14.21L5.62,11.38L9,14.77L18.88,4.88L21.71,7.71L9,20.42Z"/></svg>
</div>
<span><strong>cargo-make:</strong> Install with <code>cargo install --force cargo-make</code></span>
</div>
<div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
<div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: 'var(--ifm-color-success)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
<svg width="12" height="12" viewBox="0 0 24 24" fill="white"><path d="M9,20.42L2.79,14.21L5.62,11.38L9,14.77L18.88,4.88L21.71,7.71L9,20.42Z"/></svg>
</div>
<span><strong>Hasura CLI:</strong> Install with <code>curl -L https://github.com/hasura/graphql-engine/raw/stable/cli/get.sh | bash</code></span>
</div>
<div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
<div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: 'var(--ifm-color-success)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
<svg width="12" height="12" viewBox="0 0 24 24" fill="white"><path d="M9,20.42L2.79,14.21L5.62,11.38L9,14.77L18.88,4.88L21.71,7.71L9,20.42Z"/></svg>
</div>
<span><strong>Node.js:</strong> For integration tests (install pnpm dependencies)</span>
</div>
</div>

### Environment Configuration

You'll need to set up environment variables for various services. Create a `.env` file based on the `.env.sample` template with the following required variables:

| Variable | Description | Source |
|----------|-------------|---------|
| `OPENAI_API_KEY` | OpenAI API key for AI features | [OpenAI Platform](https://platform.openai.com/api-keys) |
| `PINATA_GATEWAY_TOKEN` | Pinata gateway token for IPFS | [Pinata Dashboard](https://app.pinata.cloud/developers/gateway-settings) |
| `PINATA_API_JWT` | Pinata API JWT for IPFS uploads | [Pinata Dashboard](https://app.pinata.cloud/developers/api-keys) |
| `BASE_MAINNET_RPC_URL` | Base mainnet RPC endpoint | [Alchemy Dashboard](https://dashboard.alchemy.com/apps) |
| `BASE_SEPOLIA_RPC_URL` | Base sepolia testnet RPC endpoint | [Alchemy Dashboard](https://dashboard.alchemy.com/apps) |
| `ETHEREUM_MAINNET_RPC_URL` | Ethereum mainnet RPC endpoint | [Alchemy Dashboard](https://dashboard.alchemy.com/apps) |
| `LINEA_MAINNET_RPC_URL` | Linea mainnet RPC endpoint | [Alchemy Dashboard](https://dashboard.alchemy.com/apps) |
| `LINEA_SEPOLIA_RPC_URL` | Linea sepolia testnet RPC endpoint | [Alchemy Dashboard](https://dashboard.alchemy.com/apps) |
| `TRUST_TESTNET_RPC_URL` | Trust testnet RPC endpoint (local geth) | Local development |
| `TRUST_MAINNET_RPC_URL` | Trust mainnet RPC endpoint (local geth) | Local development |
| `INDEXER_SCHEMA` | Database schema for indexer (set to "local") | Local development |
| `INTUITION_CONTRACT_ADDRESS` | Intuition contract address | Contract deployment |

## Next Steps

Once you understand the architecture and have the prerequisites ready:

1. Learn about [why we chose Rust](rust-backend.md) for the backend implementation
2. Explore [Local Development Setup](local-setup.md) for development workflows
3. Check [Kubernetes Deployment](kubernetes.md) for production deployments
