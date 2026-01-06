---
sidebar_position: 2
sidebar_label: Monorepo Architecture
---

## The Intuition Rust Monorepo

The `intuition-rs` repository is organized as a Rust workspace, which provides several key benefits:

### Monorepo Architecture
A monorepo (monolithic repository) consolidates all backend services and shared code in a single repository, offering:

- **Code sharing**: Common utilities and models shared across all services
- **Unified versioning**: All services stay in sync with compatible versions
- **Atomic changes**: Update multiple services in a single commit
- **Simplified dependencies**: Internal dependencies managed through workspace
- **Consistent tooling**: Shared build, test, and lint configurations

### Workspace Organization
The workspace is structured into logical layers:

#### Applications Layer (`apps/`)
Independent services that can be deployed separately:
- Each app has its own binary
- Shared dependencies managed at workspace level
- Services communicate through well-defined interfaces

#### Infrastructure Layer
Supporting services for data storage and APIs:
- Database migrations and schema management
- GraphQL API configuration
- Monitoring and observability tools

#### Shared Libraries
Common code used across multiple services:
- Domain models
- Utility functions
- Shared business logic

### Development Benefits
- **Faster builds**: Cargo caches dependencies and only rebuilds what changed
- **Type safety across services**: Shared types ensure compatibility
- **Easier refactoring**: Changes to shared code immediately show impact
- **Consistent testing**: Run all tests with a single command

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
└── README.md          # Project documentation
```

### Core Applications

<div className="uniform-card-grid">

<div className="uniform-card">
<h3 className="uniform-card-title">CLI</h3>
<div className="uniform-card-content">
Terminal UI client for interacting with the Intuition system
<ul>
<li>Interactive command-line interface</li>
<li>Real-time data verification</li>
<li>Development and debugging tool</li>
</ul>
</div>
</div>

<div className="uniform-card">
<h3 className="uniform-card-title">Consumer</h3>
<div className="uniform-card-content">
Event processing pipeline using Redis Streams
<ul>
<li><strong>RAW Consumer</strong>: Ingests raw blockchain events</li>
<li><strong>DECODED Consumer</strong>: Decodes and parses events</li>
<li><strong>RESOLVER Consumer</strong>: Resolves and enriches data</li>
<li><strong>IPFS-UPLOAD Consumer</strong>: Manages IPFS content uploads</li>
</ul>
</div>
</div>

<div className="uniform-card">
<h3 className="uniform-card-title">Histocrawler</h3>
<div className="uniform-card-content">
Historical data crawler for blockchain indexing
<ul>
<li>Fetches historical blockchain data</li>
<li>Processes past events</li>
<li>Builds complete data history</li>
</ul>
</div>
</div>

<div className="uniform-card">
<h3 className="uniform-card-title">Image Guard</h3>
<div className="uniform-card-content">
Image processing and validation service
<ul>
<li>Image validation and security scanning</li>
<li>Format conversion and optimization</li>
<li>Content moderation</li>
</ul>
</div>
</div>

<div className="uniform-card">
<h3 className="uniform-card-title">RPC Proxy</h3>
<div className="uniform-card-content">
RPC call proxy with intelligent caching
<ul>
<li>Caches eth_call method results</li>
<li>Reduces load on upstream RPC providers</li>
<li>Improves query performance</li>
</ul>
</div>
</div>

<div className="uniform-card">
<h3 className="uniform-card-title">Models</h3>
<div className="uniform-card-content">
Domain models and data structures
<ul>
<li>Shared data types</li>
<li>Business logic models</li>
<li>Database entity definitions</li>
</ul>
</div>
</div>

<div className="uniform-card">
<h3 className="uniform-card-title">Shared Utils</h3>
<div className="uniform-card-content">
Common utilities used across services
<ul>
<li>Helper functions</li>
<li>Shared configurations</li>
<li>Reusable components</li>
</ul>
</div>
</div>

</div>

### Infrastructure Components

The infrastructure layer provides essential services:

- **Hasura**: GraphQL API engine with database migrations
- **Blockscout**: Blockchain explorer for network transparency
- **Drizzle**: Type-safe database schema management
- **Geth**: Local Ethereum node for development
- **Prometheus**: Metrics collection and monitoring

### Development Tools

The repository includes comprehensive tooling:

- **Docker Compose**: Orchestrates all services for local development
- **Cargo Make**: Task automation and build scripts
- **Integration Tests**: End-to-end testing with pnpm
- **Shell Scripts**: Quick commands for common operations

## Why Rust?

The Intuition backend is built with Rust, a systems programming language that offers unique advantages for blockchain infrastructure:

<div className="uniform-card-grid">

<div className="uniform-card">
<h3 className="uniform-card-title">Performance and Efficiency</h3>
<p className="uniform-card-content">
<strong>Zero-cost abstractions</strong>: Write high-level code without runtime overhead<br/>
<strong>Memory efficiency</strong>: Minimal memory footprint compared to garbage-collected languages<br/>
<strong>Concurrent processing</strong>: Built-in support for safe concurrent operations<br/>
<strong>Native performance</strong>: Compiles to machine code for maximum speed
</p>
</div>

<div className="uniform-card">
<h3 className="uniform-card-title">Safety and Reliability</h3>
<p className="uniform-card-content">
<strong>Memory safety</strong>: Eliminates entire classes of bugs (null pointer dereferences, buffer overflows, data races)<br/>
<strong>Type safety</strong>: Strong static typing catches errors at compile time<br/>
<strong>Error handling</strong>: Explicit error handling through Result types<br/>
<strong>No runtime crashes</strong>: Memory safety guarantees prevent unexpected crashes
</p>
</div>

<div className="uniform-card">
<h3 className="uniform-card-title">Developer Experience</h3>
<p className="uniform-card-content">
<strong>Modern tooling</strong>: Cargo package manager and build system<br/>
<strong>Rich ecosystem</strong>: Growing library ecosystem for blockchain and web services<br/>
<strong>Documentation</strong>: Built-in documentation tools and testing framework<br/>
<strong>Community</strong>: Active and supportive open-source community
</p>
</div>

<div className="uniform-card">
<h3 className="uniform-card-title">Blockchain-Specific Benefits</h3>
<p className="uniform-card-content">
<strong>Predictable performance</strong>: No garbage collection pauses during critical operations<br/>
<strong>Resource optimization</strong>: Efficient resource usage for indexing large amounts of blockchain data<br/>
<strong>WebAssembly support</strong>: Can compile to WASM for cross-platform compatibility<br/>
<strong>Security</strong>: Memory safety is crucial when handling financial transactions and user data
</p>
</div>

</div>