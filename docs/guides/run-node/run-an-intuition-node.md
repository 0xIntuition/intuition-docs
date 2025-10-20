---
sidebar_position: 1
---

# Run a Node

Learn how to set up and run your own Intuition node to participate in the network using the official Rust implementation.

## Overview

The `intuition-rs` workspace is a comprehensive Rust workspace for blockchain data indexing and processing, featuring a modular architecture with multiple specialized services. This implementation provides high performance, memory safety, and reliability for running Intuition nodes and backend services.

:::warning Node Requirements
Running an Intuition node requires Docker, Rust toolchain, and proper environment configuration. This guide provides comprehensive setup instructions for local development and production deployments.
:::

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

## Running the System

**Note**: All scripts are located in the `scripts/` directory and should be run from the project root.

### Option 1: Using Published Docker Images (Recommended)

```bash
# Start with local Ethereum node
cargo make start-local
```

### Option 2: Building from Source

```bash
# Build all Docker images from source
cargo make build-docker-images

# Start the system
cargo make start-local
```

### Option 3: Running with Integration Tests

```bash
# Start with tests enabled
cargo make start-local test
```

## Testing

### Run All Tests
```bash
cargo nextest run
```

### Run Integration Tests
```bash
cd integration-tests
export VITE_INTUITION_CONTRACT_ADDRESS=0x....
pnpm test src/follow.test.ts
```

### Run Specific Test Suites
```bash
# Test account operations
pnpm test src/create-person.test.ts

# Test vault operations
pnpm test src/vaults.test.ts

# Test AI agents
pnpm test src/ai-agents.test.ts
```

## Development

### CLI Tool
```bash
# Run the CLI to verify latest data
./scripts/cli.sh
```

### Code Quality
```bash
# Format code
cargo make fmt

# Run linter
cargo make clippy

# Run all checks
cargo make check
```

### Database Operations
```bash
# Start services and run migrations
cargo make start-docker-and-migrate

# Manual migration (if needed)
cp .env.sample .env
source .env
```

## Local Development Setup

### Using Local Ethereum Node

Add to your `.env` file:
```bash
INTUITION_CONTRACT_ADDRESS=0xB92EA1B47E4ABD0a520E9138BB59dBd1bC6C475B
START_BLOCK=0
```

Create local test data:
```bash
cd integration-tests
npm install
npm run create-predicates
```

### Manual Service Management

```bash
# Start all services
docker-compose -f docker/docker-compose-apps.yml up -d

# Stop all services
./scripts/stop.sh

# View logs
docker-compose -f docker/docker-compose-apps.yml logs -f
```

## Project Structure

```
intuition-rs/
├── apps/                 # Custom Rust applications
│   ├── cli/             # Terminal UI client
│   ├── consumer/        # Event processing pipeline (Redis Streams)
│   ├── histocrawler/    # Historical data crawler
│   ├── image-guard/     # Image processing service
│   ├── models/          # Domain models & data structures
│   ├── rpc-proxy/       # RPC proxy with caching
│   └── shared-utils/    # Common utilities
├── infrastructure/      # Infrastructure components
│   ├── hasura/         # GraphQL API & migrations
│   ├── blockscout/     # Blockchain explorer
│   ├── drizzle/        # Database schema management
│   ├── geth/           # Local Ethereum node config
│   ├── indexer-and-cache-migrations/  # Database migrations
│   ├── migration-scripts/  # Migration utilities
│   └── prometheus/     # Monitoring configuration
├── docker/             # Docker configuration
│   ├── docker-compose-apps.yml   # Application services
│   ├── docker-compose-shared.yml # Shared infrastructure
│   └── Dockerfile      # Multi-stage build
├── scripts/            # Shell scripts
│   ├── start.sh        # System startup
│   ├── stop.sh         # System shutdown
│   ├── cli.sh          # CLI runner
│   ├── init-dbs.sh     # Database initialization
├── integration-tests/  # End-to-end tests
└── README.md          # This file
```

## Event Processing Pipeline

The system processes blockchain events through multiple stages:

1. **RAW** - Raw event ingestion from blockchain
2. **DECODED** - Event decoding and parsing
3. **RESOLVER** - Data resolution and enrichment
4. **IPFS-UPLOAD** - Upload images to IPFS and track them in the local DB

### Supported Contract Versions
- Multivault v2.0

## Monitoring and Observability

### Logging

The system includes comprehensive logging capabilities:

**Features:**
- **Structured JSON Logging**: All services output machine-readable logs
- **Container Logs**: Direct access to service logs via Docker
- **Log Filtering**: Easy filtering by log level and service

**Benefits:**
- **Debugging**: Quickly find and analyze issues across services
- **Performance Monitoring**: Track service performance and bottlenecks
- **Audit Trail**: Complete visibility into system operations

**Getting Started:**
1. Start the system: `cargo make start-local`
2. View logs: `docker logs <service_name>`
3. Filter logs: `docker logs <service_name> | grep '"level":"INFO"'`

**JSON Logging:**
All consumer services output structured JSON logs with the following fields:
- `timestamp`: ISO 8601 timestamp
- `level`: Log level (INFO, WARN, ERROR, DEBUG)
- `fields.message`: Log message content
- `target`: Module path
- `filename`: Source file name
- `line_number`: Line number in source file
- `threadId`: Thread identifier

**Viewing Logs:**
```bash
# View container logs directly
docker logs decoded_consumer | grep '"level":"INFO"'
docker logs resolver_consumer | grep '"level":"ERROR"'
docker logs ipfs_upload_consumer | grep '"level":"WARN"'
```

## Troubleshooting

### Common Issues

1. **Database connection errors**: Ensure PostgreSQL is running and credentials are correct
2. **RPC endpoint issues**: Verify your Alchemy endpoints are valid and have sufficient quota
3. **Docker resource limits**: Ensure Docker has sufficient memory and CPU allocation

### Getting Help

- Check the [intuition-rs repository](https://github.com/0xIntuition/intuition-rs) for latest updates
- Review the [DeepWiki documentation](https://deepwiki.com/0xIntuition/intuition-rs) for detailed technical information
- Join the Intuition community for support

## How to Run Intuition in a Kubernetes Cluster

A comprehensive Kubernetes-based deployment infrastructure for blockchain indexing and data services, managed with ArgoCD and Terraform.

### Architecture Overview

This project deploys a complete blockchain indexing platform on Google Cloud Platform (GCP) using:

- **GKE Cluster**: Multi-node pool Kubernetes cluster
- **ArgoCD**: GitOps-based continuous deployment
- **Terraform**: Infrastructure as Code for GCP resources
- **Kustomize**: Kubernetes manifest management

### Core Services

#### Data Layer
- **TimescaleDB**: Time-series database with PostgreSQL extensions and AI capabilities
- **Indexer Database**: Dedicated database for blockchain indexing operations

#### Application Services
- **GraphQL Engine**: Hasura GraphQL API for data access
- **IPFS Node**: InterPlanetary File System for decentralized storage
- **Safe Content Service**: Content validation and processing
- **Timescale Vectorizer Worker**: Vector processing for AI/ML workloads
- **Histocrawler**: Historical data crawling and indexing service
- **Image Guard**: Image validation and security service
- **RPC Proxy**: Blockchain RPC request routing and caching

#### Consumer Services
- **Decoded Consumer**: Blockchain event decoding and processing
- **IPFS Upload Consumer**: IPFS content upload and management
- **Resolver Consumer**: Data resolution and lookup services

#### Management Tools
- **pgAdmin**: PostgreSQL administration interface
- **Ingress Controller**: Traffic routing and load balancing

### Infrastructure Components

#### GKE Cluster Suggested Configuration
- **Region**: `us-west2`
- **Project**: `be-cluster`
- **Network**: Custom VPC with private/public subnets
- **Node Pools**:
  - `db-pool`: n2-standard-16 (dedicated for databases)
  - `app-pool`: e2-standard-2 (application services)
  - `consumer-pool`: custom-4-8192 (data processing)

#### Storage
- **Persistent Volumes**: GCP Persistent Disk with resizable storage class
- **IPFS Storage**: 50Gi persistent volume for IPFS data
- **Database Storage**: 50Gi for TimescaleDB

### Project Structure

```
gcp-deployment/
├── apps/                    # Kubernetes applications
│   ├── consumers/          # Data processing consumers
│   │   ├── decoded/        # Blockchain event decoder
│   │   ├── ipfs-upload/    # IPFS upload processor
│   │   └── resolver/       # Data resolver service
│   ├── graphql/            # Hasura GraphQL engine
│   ├── histocrawler/       # Historical data crawler
│   ├── image-guard/        # Image validation service
│   ├── indexer-db/         # Indexer database
│   ├── ipfs/               # IPFS node
│   ├── pgadmin/            # PostgreSQL admin
│   ├── rpc-proxy/          # RPC request proxy
│   ├── safe-content/       # Content validation service
│   ├── timescale_db/       # TimescaleDB instance
│   ├── timescale_db_vectorizer/  # Vector processing
│   └── ingress/            # Ingress configuration
├── argocd/                 # ArgoCD configuration
│   ├── coreapps/           # Core application definitions
│   ├── namespacedapps/     # Namespace-specific apps
│   ├── projects/           # ArgoCD project definitions
│   └── repos/              # Repository secrets
├── terraform/              # Infrastructure as Code
│   └── debug-gke/          # GKE cluster provisioning
└── test-kustomize/         # Kustomize testing
```

### Quick Start

#### Prerequisites
- Google Cloud SDK
- Terraform >= 1.0
- kubectl
- ArgoCD CLI

#### 1. Deploy Infrastructure
```bash
cd terraform/debug-gke
terraform init
terraform plan
terraform apply
```

#### 2. Configure ArgoCD
```bash
# Get GKE credentials
gcloud container clusters get-credentials debug-cluster --region us-west2

# Install ArgoCD
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

# Apply ArgoCD configuration
kubectl apply -f argocd/
```

#### 3. Deploy Applications
Applications are automatically deployed via ArgoCD GitOps. The system monitors the Git repository and applies changes automatically.

### Configuration

#### Environment Variables
Key services require environment-specific configuration:

- **GraphQL Engine**: Database connection, CORS settings
- **TimescaleDB**: PostgreSQL credentials, AI extensions
- **IPFS**: Storage paths, network configuration
- **Safe Content**: Content validation rules
- **Histocrawler**: Blockchain endpoints, indexing parameters
- **Image Guard**: Image scanning policies, security rules
- **RPC Proxy**: Upstream RPC endpoints, caching configuration
- **Consumers**: Event processing queues, database connections

#### Secrets Management
Secrets are managed through Kubernetes secrets and external secret providers:
- Database credentials
- API keys
- Service account tokens

### Monitoring & Observability

#### Health Checks
- Liveness probes configured for all services
- Readiness probes for database services
- Custom health endpoints for GraphQL and IPFS

#### Logging
- Structured logging enabled for GraphQL engine
- Query logging for debugging
- WebSocket and HTTP request logging

### Security

#### Network Security
- Private GKE cluster with private nodes
- VPC-native networking
- NAT gateway for outbound internet access
- Ingress controller for external access

#### Access Control
- Workload Identity for GCP service accounts
- Kubernetes RBAC
- ArgoCD project-based access control

### Development

#### Local Development
```bash
# Test Kustomize configurations
cd test-kustomize
kubectl kustomize . | kubectl apply --dry-run=client

# Validate manifests
kubectl kustomize apps/graphql/ | kubectl apply --dry-run=client
```

#### Adding New Services
1. Create service directory in `apps/`
2. Add Kubernetes manifests (deployment, service, etc.)
3. Create ArgoCD application definition
4. Update project permissions if needed

### CI/CD Pipeline

The deployment follows GitOps principles:
1. Code changes pushed to Git repository
2. ArgoCD detects changes automatically
3. Applications updated in Kubernetes cluster
4. Health checks validate deployment

### Scaling

#### Horizontal Scaling
- Application services can scale horizontally via HPA
- Database services use StatefulSets for data persistence
- IPFS and GraphQL support multiple replicas

#### Vertical Scaling
- Node pools can be resized via Terraform
- Storage volumes support online resizing
- Resource limits configured per service

### Troubleshooting

#### Common Issues
1. **Database Connection**: Check TimescaleDB service and secrets
2. **IPFS Storage**: Verify PVC and storage class
3. **GraphQL Health**: Check liveness probe and database connectivity
4. **ArgoCD Sync**: Verify repository access and permissions
5. **Consumer Processing**: Check event queue connectivity and processing status
6. **Histocrawler**: Verify blockchain endpoint accessibility
7. **Image Guard**: Check image scanning service health
8. **RPC Proxy**: Validate upstream RPC endpoint connectivity

#### Debug Commands
```bash
# Check pod status
kubectl get pods -A

# View logs
kubectl logs -f deployment/graphql-engine

# Check ArgoCD applications
argocd app list

# Validate Terraform state
terraform plan
```

### Additional Resources

- [GKE Documentation](https://cloud.google.com/kubernetes-engine/docs)
- [ArgoCD User Guide](https://argo-cd.readthedocs.io/)
- [TimescaleDB Documentation](https://docs.timescale.com/)
- [Hasura GraphQL Engine](https://hasura.io/docs/)
- [Hasura Documentation](https://hasura.io/docs/)
- [Alchemy Dashboard](https://dashboard.alchemy.com/)
- [Pinata Documentation](https://docs.pinata.cloud/)

### Next Steps

Once your node is running successfully:

1. **Monitor the logs** to ensure all services are healthy
2. **Test the CLI tool** to verify data ingestion
3. **Configure monitoring** for production deployments
4. **Join the network** and start contributing to the Intuition ecosystem

The node implementation is under active development, so check the repository regularly for updates and new features. 