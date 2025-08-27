---
sidebar_position: 1
---

# Run an Intuition Node

Learn how to set up and run your own Intuition node to participate in the network.

## Node Deployment Overview

The Intuition node implementation provides a robust, scalable infrastructure for participating in the Intuition network. With support for both containerized deployment and local development, operators can choose the setup that best fits their needs.

For production deployments, use the Docker-based setup with proper AWS configuration. For development and testing, the local execution mode provides flexibility and debugging capabilities.

<div style={{ backgroundColor: 'var(--ifm-color-emphasis-50)', padding: '1.5rem', borderRadius: '8px', margin: '1.5rem 0', border: '1px solid var(--ifm-color-emphasis-300)' }}>
<p style={{ margin: '0 0 0.5rem 0', fontWeight: '600', color: 'var(--ifm-color-emphasis-900)', fontSize: '1.1rem' }}>Node Requirements</p>
<p style={{ margin: 0, fontSize: '1rem', color: 'var(--ifm-color-emphasis-800)', lineHeight: '1.6' }}>
Running an Intuition node requires Docker, Rust toolchain, and proper environment configuration. This guide provides comprehensive setup instructions for local development and production deployments.
</p>
</div>

## Overview

The `intuition-rs` workspace contains the Rust implementation of Intuition's off-chain backend systems. This implementation provides high performance, memory safety, and reliability for running Intuition nodes and backend services.

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
<span><strong>Docker:</strong> For containerized services</span>
</div>
<div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
<div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: 'var(--ifm-color-success)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
<svg width="12" height="12" viewBox="0 0 24 24" fill="white"><path d="M9,20.42L2.79,14.21L5.62,11.38L9,14.77L18.88,4.88L21.71,7.71L9,20.42Z"/></svg>
</div>
<span><strong>Rust toolchain:</strong> Latest stable version</span>
</div>
</div>

### AWS Configuration

Configure AWS for SQS queues in `~/.aws/config`:

```ini
[default]
aws_access_key_id = YOUR_ACCESS_KEY_ID
aws_secret_access_key = YOUR_SECRET_ACCESS_KEY
```

### Environment Variables

<div style={{ backgroundColor: 'var(--ifm-color-emphasis-50)', padding: '1.5rem', borderRadius: '8px', margin: '1.5rem 0', border: '1px solid var(--ifm-color-emphasis-300)' }}>
<p style={{ margin: '0 0 1rem 0', fontWeight: '600', color: 'var(--ifm-color-emphasis-900)', fontSize: '1.1rem' }}>Environment Setup</p>
<p style={{ margin: '0 0 1rem 0', fontSize: '1rem', color: 'var(--ifm-color-emphasis-800)', lineHeight: '1.6' }}>
Create a <code>.env</code> file from <code>.env.sample</code> with the following required variables:
</p>

<div className="uniform-card-grid">

<div className="uniform-card">
<h4 className="uniform-card-title">Storage & CDN</h4>
<ul style={{ margin: '0.5rem 0', fontSize: '0.9rem' }}>
<li><code>PINATA_GATEWAY_TOKEN</code>: Token from Pinata</li>
<li><code>PINATA_API_JWT</code>: JWT token from Pinata</li>
</ul>
</div>

<div className="uniform-card">
<h4 className="uniform-card-title">RPC Endpoints</h4>
<ul style={{ margin: '0.5rem 0', fontSize: '0.9rem' }}>
<li><code>RPC_URL_MAINNET</code>: Alchemy RPC URL for mainnet</li>
<li><code>RPC_URL_BASE</code>: Alchemy RPC URL for Base</li>
</ul>
</div>

<div className="uniform-card">
<h4 className="uniform-card-title">External Services</h4>
<ul style={{ margin: '0.5rem 0', fontSize: '0.9rem' }}>
<li><code>HF_TOKEN</code>: Hugging Face token</li>
<li><code>SUBSTREAMS_API_TOKEN</code>: Substreams API token</li>
<li><code>HYPERSYNC_TOKEN</code>: Envio token</li>
</ul>
</div>

<div className="uniform-card">
<h4 className="uniform-card-title">AWS Credentials</h4>
<ul style={{ margin: '0.5rem 0', fontSize: '0.9rem' }}>
<li><code>AWS_ACCESS_KEY_ID</code>: AWS access key</li>
<li><code>AWS_SECRET_ACCESS_KEY</code>: AWS secret key</li>
</ul>
</div>

</div>

</div>

## Running the Local Pipeline

### Quick Start (Published Images)

Use pre-built Docker images for fastest setup:

```bash
# Start all services
./start.sh

# Verify data with CLI
./cli.sh

# Stop all services
./stop.sh

# Restart with clean volumes
./restart.sh
```

### Build from Source

Build Docker images from source code:

```bash
cp .env.sample .env
source .env
cargo make start-docker-and-migrate
```

### Re-running Migrations

Reset and re-run database migrations:

```bash
docker compose down -v
docker compose up -d --force-recreate
cargo make migrate-database
```

## Manual Execution

### Environment Setup

```bash
cp .env.sample .env
source .env
```

### Running Consumers

**Raw Consumer (Remote SQS Queue):**
```bash
RUST_LOG=info cargo run --bin consumer --mode raw
# or
cargo make raw-consumer
```

**Decoded Consumer (Remote SQS Queue):**
```bash
RUST_LOG=info cargo run --bin consumer --mode decoded
# or
cargo make decoded-consumer
```

**Raw Consumer (Local SQS Queue):**
```bash
RUST_LOG=info cargo run --bin consumer --features local --mode raw --local
# or
cargo make raw-consumer-local
```

**Decoded Consumer (Local SQS Queue):**
```bash
RUST_LOG=info cargo run --bin consumer --features local --mode decoded --local
# or
cargo make decoded-consumer-local
```

## Development Commands

### Testing

```bash
cargo nextest run
```

### Code Quality

```bash
cargo make clippy  # Run clippy
cargo make fmt     # Run rustfmt
```

## Kubernetes Deployment (macOS)

### Prerequisites

```bash
brew install minikube
brew install k9s
```

### Setup

1. **Create Secrets:**
```bash
kubectl create secret generic secrets --from-env-file=.env
```

2. **Start Minikube:**
```bash
minikube start
```

3. **Apply Kubernetes Manifests:**
```bash
kubectl apply -k kube_files/
```

### Management

**Restart Services:**
```bash
kubectl rollout restart deployment
# or
kubectl delete deployment --all
```

## Local Ethereum Node Integration

Add the following to your `.env` file:

```
BASE_MAINNET_RPC_URL=http://geth:8545
BASE_SEPOLIA_RPC_URL=http://geth:8545
INTUITION_CONTRACT_ADDRESS=0x04056c43d0498b22f7a0c60d4c3584fb5fa881cc
START_BLOCK=0
```

Create local data:

```bash
cd integration-tests
npm install
npm run create-predicates
```

## Important Notes

- All crates are under intensive development and code is subject to change
- For indexing base events, uncomment the `substreams-sink` crate and comment the `envio-indexer` crate in `docker-compose.yml`
- Use feature flags to differentiate between local and remote execution environments
- Set appropriate environment variables for queue URLs (`RAW_CONSUMER_QUEUE_URL` and `DECODED_CONSUMER_QUEUE_URL`) to switch between local and remote execution

## Available Commands

Check all available commands in `.cargo/makefiles` for the complete list of convenience commands.

## Summary

<div style={{ backgroundColor: 'var(--ifm-color-emphasis-50)', padding: '2rem', borderRadius: '12px', margin: '2rem 0', border: '1px solid var(--ifm-color-emphasis-200)' }}>
<p style={{ margin: '0 0 1rem 0', fontWeight: '600', color: 'var(--ifm-color-emphasis-900)', fontSize: '1.2rem' }}>Node Deployment Overview</p>
<p style={{ margin: '0 0 1rem 0', fontSize: '1rem', color: 'var(--ifm-color-emphasis-800)', lineHeight: '1.6' }}>
The Intuition node implementation provides a robust, scalable infrastructure for participating in the Intuition network. With support for both containerized deployment and local development, operators can choose the setup that best fits their needs.
</p>
<p style={{ margin: 0, fontSize: '1rem', color: 'var(--ifm-color-emphasis-800)', lineHeight: '1.6' }}>
For production deployments, use the Docker-based setup with proper AWS configuration. For development and testing, the local execution mode provides flexibility and debugging capabilities.
</p>
</div> 