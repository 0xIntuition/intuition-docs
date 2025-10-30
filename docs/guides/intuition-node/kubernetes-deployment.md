---
sidebar_position: 5
---

# How to Run Intuition in a Kubernetes Cluster

A comprehensive Kubernetes-based deployment infrastructure for blockchain indexing and data services, managed with ArgoCD and Terraform.

## Architecture Overview

This project deploys a complete blockchain indexing platform on Google Cloud Platform (GCP) using:

- **GKE Cluster**: Multi-node pool Kubernetes cluster
- **ArgoCD**: GitOps-based continuous deployment
- **Terraform**: Infrastructure as Code for GCP resources
- **Kustomize**: Kubernetes manifest management

## Core Services

### Data Layer
- **TimescaleDB**: Time-series database with PostgreSQL extensions and AI capabilities
- **Indexer Database**: Dedicated database for blockchain indexing operations

### Application Services
- **GraphQL Engine**: Hasura GraphQL API for data access
- **IPFS Node**: InterPlanetary File System for decentralized storage
- **Safe Content Service**: Content validation and processing
- **Timescale Vectorizer Worker**: Vector processing for AI/ML workloads
- **Histocrawler**: Historical data crawling and indexing service
- **Image Guard**: Image validation and security service
- **RPC Proxy**: Blockchain RPC request routing and caching

### Consumer Services
- **Decoded Consumer**: Blockchain event decoding and processing
- **IPFS Upload Consumer**: IPFS content upload and management
- **Resolver Consumer**: Data resolution and lookup services

### Management Tools
- **pgAdmin**: PostgreSQL administration interface
- **Ingress Controller**: Traffic routing and load balancing

## Infrastructure Components

### GKE Cluster Suggested Configuration
- **Region**: `us-west2`
- **Project**: `be-cluster`
- **Network**: Custom VPC with private/public subnets
- **Node Pools**:
  - `db-pool`: n2-standard-16 (dedicated for databases)
  - `app-pool`: e2-standard-2 (application services)
  - `consumer-pool`: custom-4-8192 (data processing)

### Storage
- **Persistent Volumes**: GCP Persistent Disk with resizable storage class
- **IPFS Storage**: 50Gi persistent volume for IPFS data
- **Database Storage**: 50Gi for TimescaleDB

## Project Structure

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

## Quick Start

### Prerequisites
- Google Cloud SDK
- Terraform >= 1.0
- kubectl
- ArgoCD CLI

### 1. Deploy Infrastructure
```bash
cd terraform/debug-gke
terraform init
terraform plan
terraform apply
```

### 2. Configure ArgoCD
```bash
# Get GKE credentials
gcloud container clusters get-credentials debug-cluster --region us-west2

# Install ArgoCD
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

# Apply ArgoCD configuration
kubectl apply -f argocd/
```

### 3. Deploy Applications
Applications are automatically deployed via ArgoCD GitOps. The system monitors the Git repository and applies changes automatically.

## Configuration

### Environment Variables
Key services require environment-specific configuration:

- **GraphQL Engine**: Database connection, CORS settings
- **TimescaleDB**: PostgreSQL credentials, AI extensions
- **IPFS**: Storage paths, network configuration
- **Safe Content**: Content validation rules
- **Histocrawler**: Blockchain endpoints, indexing parameters
- **Image Guard**: Image scanning policies, security rules
- **RPC Proxy**: Upstream RPC endpoints, caching configuration
- **Consumers**: Event processing queues, database connections

### Secrets Management
Secrets are managed through Kubernetes secrets and external secret providers:
- Database credentials
- API keys
- Service account tokens

## Monitoring & Observability

### Health Checks
- Liveness probes configured for all services
- Readiness probes for database services
- Custom health endpoints for GraphQL and IPFS

### Logging
- Structured logging enabled for GraphQL engine
- Query logging for debugging
- WebSocket and HTTP request logging

## Security

### Network Security
- Private GKE cluster with private nodes
- VPC-native networking
- NAT gateway for outbound internet access
- Ingress controller for external access

### Access Control
- Workload Identity for GCP service accounts
- Kubernetes RBAC
- ArgoCD project-based access control

## Development

### Local Development
```bash
# Test Kustomize configurations
cd test-kustomize
kubectl kustomize . | kubectl apply --dry-run=client

# Validate manifests
kubectl kustomize apps/graphql/ | kubectl apply --dry-run=client
```

### Adding New Services
1. Create service directory in `apps/`
2. Add Kubernetes manifests (deployment, service, etc.)
3. Create ArgoCD application definition
4. Update project permissions if needed

## CI/CD Pipeline

The deployment follows GitOps principles:
1. Code changes pushed to Git repository
2. ArgoCD detects changes automatically
3. Applications updated in Kubernetes cluster
4. Health checks validate deployment

## Scaling

### Horizontal Scaling
- Application services can scale horizontally via HPA
- Database services use StatefulSets for data persistence
- IPFS and GraphQL support multiple replicas

### Vertical Scaling
- Node pools can be resized via Terraform
- Storage volumes support online resizing
- Resource limits configured per service

## Troubleshooting

### Common Issues
1. **Database Connection**: Check TimescaleDB service and secrets
2. **IPFS Storage**: Verify PVC and storage class
3. **GraphQL Health**: Check liveness probe and database connectivity
4. **ArgoCD Sync**: Verify repository access and permissions
5. **Consumer Processing**: Check event queue connectivity and processing status
6. **Histocrawler**: Verify blockchain endpoint accessibility
7. **Image Guard**: Check image scanning service health
8. **RPC Proxy**: Validate upstream RPC endpoint connectivity

### Debug Commands
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

## Additional Resources

- [GKE Documentation](https://cloud.google.com/kubernetes-engine/docs)
- [ArgoCD User Guide](https://argo-cd.readthedocs.io/)
- [TimescaleDB Documentation](https://docs.timescale.com/)
- [Hasura GraphQL Engine](https://hasura.io/docs/)
- [Hasura Documentation](https://hasura.io/docs/)
- [Alchemy Dashboard](https://dashboard.alchemy.com/)
- [Pinata Documentation](https://docs.pinata.cloud/)
