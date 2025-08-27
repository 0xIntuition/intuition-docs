---
sidebar_position: 1
---

# Run a Node

Learn how to set up and run your own Intuition node to participate in the network using the official Rust implementation.

## Overview

The `intuition-rs` workspace contains the Rust implementation of Intuition's off-chain backend systems. This implementation provides high performance, memory safety, and reliability for running Intuition nodes and backend services.

<div style={{ backgroundColor: 'var(--ifm-color-emphasis-50)', padding: '1.5rem', borderRadius: '8px', margin: '1.5rem 0', border: '1px solid var(--ifm-color-emphasis-300)' }}>
<p style={{ margin: '0 0 0.5rem 0', fontWeight: '600', color: 'var(--ifm-color-emphasis-900)', fontSize: '1.1rem' }}>Node Requirements</p>
<p style={{ margin: 0, fontSize: '1rem', color: 'var(--ifm-color-emphasis-800)', lineHeight: '1.6' }}>
Running an Intuition node requires Docker, Rust toolchain, and proper environment configuration. This guide provides comprehensive setup instructions for local development and production deployments.
</p>
</div>

## Workspace Components

The intuition-rs workspace contains the following crates:

<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>

<div className="uniform-card">
<h3 className="uniform-card-title">Core Services</h3>
<p className="uniform-card-content">
<strong>CLI:</strong> TUI client for node interaction<br/>
<strong>Consumer:</strong> RAW, DECODED and RESOLVER consumers<br/>
<strong>Consumer API:</strong> API to re-fetch Atoms
</p>
<div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '1rem' }}>
<span style={{ backgroundColor: 'var(--ifm-color-emphasis-100)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.875rem', color: 'var(--ifm-color-emphasis-700)' }}>CLI</span>
<span style={{ backgroundColor: 'var(--ifm-color-emphasis-100)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.875rem', color: 'var(--ifm-color-emphasis-700)' }}>Consumer</span>
</div>
</div>

<div className="uniform-card">
<h3 className="uniform-card-title">Indexing & Data</h3>
<p className="uniform-card-content">
<strong>Envio Indexer:</strong> Index base-sepolia contract events<br/>
<strong>Hasura:</strong> Migrations and configuration<br/>
<strong>Models:</strong> Domain models for intuition data
</p>
<div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '1rem' }}>
<span style={{ backgroundColor: 'var(--ifm-color-emphasis-100)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.875rem', color: 'var(--ifm-color-emphasis-700)' }}>Indexing</span>
<span style={{ backgroundColor: 'var(--ifm-color-emphasis-100)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.875rem', color: 'var(--ifm-color-emphasis-700)' }}>Models</span>
</div>
</div>

<div className="uniform-card">
<h3 className="uniform-card-title">Infrastructure</h3>
<p className="uniform-card-content">
<strong>Histoflux:</strong> Stream events to SQS queue<br/>
<strong>Image Guard:</strong> Image validation service<br/>
<strong>RPC Proxy:</strong> Cache RPC calls and responses
</p>
<div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '1rem' }}>
<span style={{ backgroundColor: 'var(--ifm-color-emphasis-100)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.875rem', color: 'var(--ifm-color-emphasis-700)' }}>Streaming</span>
<span style={{ backgroundColor: 'var(--ifm-color-emphasis-100)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.875rem', color: 'var(--ifm-color-emphasis-700)' }}>Proxy</span>
</div>
</div>

<div className="uniform-card">
<h3 className="uniform-card-title">Event Processing</h3>
<p className="uniform-card-content">
<strong>Substreams Sink:</strong> Consume Substreams events for real-time processing and indexing across multiple blockchain networks.
</p>
<div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '1rem' }}>
<span style={{ backgroundColor: 'var(--ifm-color-emphasis-100)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.875rem', color: 'var(--ifm-color-emphasis-700)' }}>Events</span>
<span style={{ backgroundColor: 'var(--ifm-color-emphasis-100)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.875rem', color: 'var(--ifm-color-emphasis-700)' }}>Real-time</span>
</div>
</div>

</div>

## Prerequisites

### Required Tools

<div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
<div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
<div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: 'var(--ifm-color-success)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
<svg width="12" height="12" viewBox="0 0 24 24" fill="white"><path d="M9,20.42L2.79,14.21L5.62,11.38L9,14.77L18.88,4.88L21.71,7.71L9,20.42Z"/></svg>
</div>
<span><strong>cargo make:</strong> Install with <code>cargo install --force cargo-make</code></span>
</div>
<div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
<div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: 'var(--ifm-color-success)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
<svg width="12" height="12" viewBox="0 0 24 24" fill="white"><path d="M9,20.42L2.79,14.21L5.62,11.38L9,14.77L18.88,4.88L21.71,7.71L9,20.42Z"/></svg>
</div>
<span><strong>hasura-cli:</strong> Required for Hasura operations</span>
</div>
<div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
<div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: 'var(--ifm-color-success)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
<svg width="12" height="12" viewBox="0 0 24 24" fill="white"><path d="M9,20.42L2.79,14.21L5.62,11.38L9,14.77L18.88,4.88L21.71,7.71L9,20.42Z"/></svg>
</div>
<span><strong>Docker:</strong> For containerized deployment</span>
</div>
<div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
<div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: 'var(--ifm-color-success)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
<svg width="12" height="12" viewBox="0 0 24 24" fill="white"><path d="M9,20.42L2.79,14.21L5.62,11.38L9,14.77L18.88,4.88L21.71,7.71L9,20.42Z"/></svg>
</div>
<span><strong>Rust toolchain:</strong> For building from source</span>
</div>
</div>

### Environment Configuration

You'll need to set up environment variables for various services. Create a `.env` file based on the `.env.sample` template with the following required variables:

- `PINATA_GATEWAY_TOKEN`: Get from Pinata
- `PINATA_API_JWT`: Get from Pinata  
- `RPC_URL_MAINNET`: Alchemy mainnet endpoint
- `RPC_URL_BASE`: Alchemy Base endpoint
- `AWS_ACCESS_KEY_ID`: Your AWS credentials
- `AWS_SECRET_ACCESS_KEY`: Your AWS credentials
- `HF_TOKEN`: Hugging Face token
- `SUBSTREAMS_API_TOKEN`: Substreams API token
- `HYPERSYNC_TOKEN`: Envio token

## Installation Options

### Option 1: Using Published Docker Images (Recommended)

The fastest way to get started is using the published Docker images:

```bash
# Clone the repository
git clone https://github.com/0xIntuition/intuition-rs.git
cd intuition-rs

# Start all services
./start.sh

# Verify the setup with CLI tool
./cli.sh
```

To stop all services:
```bash
./stop.sh
```

To restart and clear volumes:
```bash
./restart.sh
```

### Option 2: Building from Source

For development or custom builds:

```bash
# Clone and setup
git clone https://github.com/0xIntuition/intuition-rs.git
cd intuition-rs
cp .env.sample .env
# Edit .env with your configuration

# Start with source build
source .env
cargo make start-docker-and-migrate
```

### Option 3: Local Development Mode

For development and testing:

```bash
# Setup environment
cp .env.sample .env
source .env

# Run raw consumer (local SQS)
RUST_LOG=info cargo run --bin consumer --features local --mode raw --local

# Run decoded consumer (local SQS)  
RUST_LOG=info cargo run --bin consumer --features local --mode decoded --local

# Run raw consumer (remote SQS)
RUST_LOG=info cargo run --bin consumer --mode raw

# Run decoded consumer (remote SQS)
RUST_LOG=info cargo run --bin consumer --mode decoded
```

## Kubernetes Deployment (macOS)

For production deployments on macOS:

```bash
# Install required tools
brew install minikube
brew install k9s

# Create secrets from .env file
kubectl create secret generic secrets --from-env-file=.env

# Start cluster
minikube start

# Deploy services
kubectl apply -k kube_files/

# Restart services if needed
kubectl rollout restart deployment
```

## Database Management

### Running Migrations

If you need to re-run database migrations:

```bash
docker compose down -v
docker compose up -d --force-recreate
cargo make migrate-database
```

### Using Local Ethereum Node

Add these to your `.env` file for local development:

```bash
BASE_MAINNET_RPC_URL=http://geth:8545
BASE_SEPOLIA_RPC_URL=http://geth:8545
INTUITION_CONTRACT_ADDRESS=0x04056c43d0498b22f7a0c60d4c3584fb5fa881cc
START_BLOCK=0
```

Create local test data:
```bash
cd integration-tests
npm install
npm run create-predicates
```

## Testing

Run the test suite:

```bash
cargo nextest run
```

## Development Commands

Useful development commands:

- `cargo make start-docker-and-migrate`: Start docker compose and run migrations
- `cargo make clippy`: Run clippy for code quality
- `cargo make fmt`: Run rustfmt for code formatting

Check all available commands in `.cargo/makefiles`.

## Troubleshooting

### Common Issues

1. **Database connection errors**: Ensure PostgreSQL is running and credentials are correct
2. **RPC endpoint issues**: Verify your Alchemy endpoints are valid and have sufficient quota
3. **AWS credential errors**: Check your AWS configuration in `~/.aws/config`
4. **Docker resource limits**: Ensure Docker has sufficient memory and CPU allocation

### Getting Help

- Check the [intuition-rs repository](https://github.com/0xIntuition/intuition-rs) for latest updates
- Review the [DeepWiki documentation](https://deepwiki.com/0xIntuition/intuition-rs) for detailed technical information
- Join the Intuition community for support

## Next Steps

Once your node is running successfully:

1. **Monitor the logs** to ensure all services are healthy
2. **Test the CLI tool** to verify data ingestion
3. **Configure monitoring** for production deployments
4. **Join the network** and start contributing to the Intuition ecosystem

The node implementation is under active development, so check the repository regularly for updates and new features. 