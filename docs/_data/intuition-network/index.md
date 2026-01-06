---
id: network
title: Intuition Network
sidebar_label: Overview
sidebar_position: 1
description: Intuition Network architecture and infrastructure
---

# Intuition Network

Intuition Network is a specialized Layer 3 blockchain built on Arbitrum Orbit, optimized for knowledge graph operations and decentralized attestations.

## Architecture

Intuition leverages a multi-layer architecture designed for performance, cost-efficiency, and scalability:

- **Layer 3 on Base** - Built using Arbitrum Orbit technology
- **AnyTrust DA** - Arbitrum's data availability solution for scalability
- **Specialized for Knowledge Graphs** - Optimized for semantic triple operations
- **EVM Compatible** - Full Ethereum smart contract compatibility

### Performance Benefits

- **~10,000x cheaper** than Ethereum mainnet
- **~100x faster** transaction times
- **Block time:** ~2 seconds
- **Transaction finality:** Less than 10 seconds
- **Throughput:** 1000+ TPS

## Network Details

**For developer setup and configuration, see:** [Network Configuration](/docs/quick-start/network-details)

### Testnet

The Intuition testnet is currently active for development and testing.

- **Chain ID:** 13579
- **RPC URL:** https://testnet.rpc.intuition.systems/
- **Explorer:** https://testnet.explorer.intuition.systems
- **Currency:** tTRUST (testnet TRUST)

**Testnet Tools:**
- **Portal** - Web interface for creating atoms and triples
- **Bridge** - Token bridge from Base Sepolia
- **Explorer** - Blockchain explorer at https://testnet.explorer.intuition.systems
- **RPC Endpoints** - API access via https://testnet.rpc.intuition.systems/

### Mainnet

> Coming soon! Testnet is currently active for development.

## Running a Node

Want to run your own Intuition node for indexing and querying the knowledge graph?

**Node Setup** - Contact support for node setup information

Running a node provides:
- **Full data access** - Complete knowledge graph indexing
- **Custom queries** - Direct database access
- **GraphQL API** - Self-hosted query capabilities
- **Privacy** - No reliance on third-party infrastructure

## Infrastructure Components

### RPC Endpoints

Managed infrastructure providing API access to the network:
- **HTTP RPC:** For standard web3 calls
- **WebSocket RPC:** For real-time subscriptions
- **Rate limiting:** Fair usage policies apply

Use the RPC endpoint at https://testnet.rpc.intuition.systems/ for development.

### Indexing Layer

The Rust-based indexing subnet provides:
- **Fast queries** - Optimized database for knowledge graph traversal
- **GraphQL API** - Flexible query language for complex graph operations
- **Real-time updates** - Live data synchronization
- **Semantic search** - Full-text search across atoms and triples

Learn more: [GraphQL API](/docs/graphql-api/overview)

### Settlement Layer

Transactions settle to Base (via Base Sepolia for testnet):
- **Security inheritance** - Leverages Ethereum's security
- **Data availability** - AnyTrust committee ensures data availability
- **Fraud proofs** - Optimistic rollup security model

## Network Economics

### Gas Costs

Gas costs on Intuition are dramatically lower than Ethereum:
- **Atom creation:** ~1/10,000th the cost
- **Triple creation:** ~1/10,000th the cost
- **Vault operations:** ~1/10,000th the cost

### Native Token

**$TRUST** is the native token of Intuition Network:
- **Gas fees** - Pay for transactions
- **Staking** - Signal on atoms and triples
- **Governance** - (Coming soon)

See [Signals](/docs/intuition-concepts/primitives/Signals/fundamentals) for information about staking and token usage.

## Getting Started

### For Users

1. **[Connect to Testnet](/docs/resources/faq#how-do-i-connect-to-the-intuition-testnet)** - Setup your wallet
2. **[Get Test Tokens](https://intuition-testnet.hub.caldera.xyz/)** - Use the faucet
3. **Explore Tools** - Use Portal and Explorer to interact with the network

### For Developers

1. **[Network Configuration](/docs/quick-start/network-details)** - Configure your environment
2. **[SDK Setup](/docs/intuition-sdk/installation-and-setup)** - Install development tools
3. **[Quickstart Guide](/docs/quick-start/using-the-sdk)** - Build something!

### For Node Operators

Contact support for node setup and deployment information.

## Support & Monitoring

- **[Network Status](https://status.intuition.systems)** - Real-time status monitoring
- **[Community Support](/docs/resources/community-and-support)** - Get help
- **[FAQ](/docs/resources/faq)** - Common questions

## Next Steps

<div className="grid-3-cols">

<div style={{
  border: '1px solid var(--ifm-color-emphasis-200)',
  borderRadius: '20px',
  padding: '2.5rem',
  backgroundColor: 'var(--ifm-background-color)',
  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
  height: '100%',
  display: 'flex',
  flexDirection: 'column'
}}>
<h3 style={{
  marginTop: 0,
  marginBottom: '1rem',
  color: 'var(--ifm-color-emphasis-900)',
  fontSize: '1.3rem',
  fontWeight: '600'
}}>
Configure Development
</h3>
<p style={{
  margin: 0,
  fontSize: '1rem',
  lineHeight: '1.6',
  color: 'var(--ifm-color-emphasis-700)',
  flexGrow: 1
}}>
Set up your development environment to start building on Intuition.
</p>
<p style={{ marginTop: '1rem', marginBottom: 0 }}>
<a href="/docs/quick-start/network-details">Network Configuration →</a>
</p>
</div>

<div style={{
  border: '1px solid var(--ifm-color-emphasis-200)',
  borderRadius: '20px',
  padding: '2.5rem',
  backgroundColor: 'var(--ifm-background-color)',
  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
  height: '100%',
  display: 'flex',
  flexDirection: 'column'
}}>
<h3 style={{
  marginTop: 0,
  marginBottom: '1rem',
  color: 'var(--ifm-color-emphasis-900)',
  fontSize: '1.3rem',
  fontWeight: '600'
}}>
Run a Node
</h3>
<p style={{
  margin: 0,
  fontSize: '1rem',
  lineHeight: '1.6',
  color: 'var(--ifm-color-emphasis-700)',
  flexGrow: 1
}}>
Self-host the indexing layer for direct database access and GraphQL API.
</p>
<p style={{ marginTop: '1rem', marginBottom: 0 }}>
<a href="/docs/resources/community">Contact Support →</a>
</p>
</div>

<div style={{
  border: '1px solid var(--ifm-color-emphasis-200)',
  borderRadius: '20px',
  padding: '2.5rem',
  backgroundColor: 'var(--ifm-background-color)',
  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
  height: '100%',
  display: 'flex',
  flexDirection: 'column'
}}>
<h3 style={{
  marginTop: 0,
  marginBottom: '1rem',
  color: 'var(--ifm-color-emphasis-900)',
  fontSize: '1.3rem',
  fontWeight: '600'
}}>
Use Testnet Tools
</h3>
<p style={{
  margin: 0,
  fontSize: '1rem',
  lineHeight: '1.6',
  color: 'var(--ifm-color-emphasis-700)',
  flexGrow: 1
}}>
Access Portal, Bridge, Explorer, and other testnet services.
</p>
<p style={{ marginTop: '1rem', marginBottom: 0 }}>
<a href="https://testnet.explorer.intuition.systems">Testnet Explorer →</a>
</p>
</div>

</div>
