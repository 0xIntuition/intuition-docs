---
sidebar_position: 4
---

# Local Development Setup

## Local Development Setup

Set up your local environment for developing and testing Intuition node services.

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
