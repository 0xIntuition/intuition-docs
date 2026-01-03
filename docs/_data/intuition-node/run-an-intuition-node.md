---
title: Run an Intuition Node
sidebar_position: 1
---

## Running the System

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

### Development Testing

#### CLI Tool
```bash
# Run the CLI to verify latest data
./scripts/cli.sh
```

#### Code Quality
```bash
# Format code
cargo make fmt

# Run linter
cargo make clippy

# Run all checks
cargo make check
```

#### Database Operations
```bash
# Start services and run migrations
cargo make start-docker-and-migrate

# Manual migration (if needed)
cp .env.sample .env
source .env
```

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

## Next Steps

Once your node is running successfully:

1. **Monitor the logs** to ensure all services are healthy
2. **Test the CLI tool** to verify data ingestion
3. **Configure monitoring** for production deployments
4. **Join the network** and start contributing to the Intuition ecosystem

The node implementation is under active development, so check the repository regularly for updates and new features.