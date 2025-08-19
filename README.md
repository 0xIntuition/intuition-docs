# Intuition Documentation

Welcome to the official documentation for **Intuition** — the world's first open, semantic, and decentralized knowledge graph. This repository contains comprehensive guides, API references, and developer resources for building with the trust protocol that's revolutionizing how we create, verify, and share knowledge online.

## 🌐 What is Intuition?

Intuition is building a **universal trust and identity layer** for the decentralized web. At its core, Intuition creates an open, semantic knowledge graph that enables trustful interactions at scale by:

- **Decoupling data from applications** — Creating a universal data layer accessible across platforms
- **Enabling verifiable claims** — Making both objective facts and subjective opinions verifiable and incentive-aligned
- **Providing semantic structure** — Building rich, queryable relationships between any entities or concepts
- **Incentivizing quality data** — Using cryptoeconomic mechanisms to reward valuable contributions

### The Vision

We believe in a future where trust online is **programmable, portable, and permissionless**. Intuition leverages game-theoretic cryptoeconomics to solve the limitations of today's information systems — from verification and provenance challenges to bias, accountability issues, and misaligned incentives.

## 📚 What This Documentation Covers

This documentation serves as your complete guide to understanding and building with Intuition:

### For Newcomers
- **[Introduction](/docs/guides/introduction)** — Learn about Intuition's vision and the problems it solves
- **[Key Terms](/docs/guides/resources/key-terms)** — Master essential terminology and concepts
- **[Why Intuition?](/docs/guides/introduction/why-intuition)** — Understand the challenges we're addressing

### For Developers
- **[Developer Tools](/docs/guides/developer-tools)** — Comprehensive developer resources and tooling
- **[Quickstart Guides](/docs/guides/quickstart)** — Get building quickly with official and community kits
- **[SDK Documentation](/docs/guides/developer-tools/sdks)** — Protocol and GraphQL SDK references
- **[Smart Contracts](/docs/guides/developer-tools/contracts)** — Contract architecture and interaction patterns
- **[GraphQL API](/docs/guides/developer-tools/graphql-api)** — Query the knowledge graph with powerful APIs

### For Users & Builders
- **[Intuition Hub](/docs/guides/hub)** — Essential tools for interacting with the ecosystem
- **[Use Cases](/docs/guides/use-cases)** — Real-world applications and possibilities
- **[Running a Node](/docs/guides/run-node)** — Set up and operate your own Intuition node

### Core Concepts
- **[Primitives](/docs/guides/introduction/the-primitives)** — Atoms, Triples, and Signals explained
- **[Economics](/docs/guides/introduction/the-economics)** — Bonding curves, fees, rewards, and tokenomics
- **[Architecture](/docs/guides/developer-tools/deep-dive)** — Technical deep-dive into system design

## 🔧 Built With

- **[Docusaurus](https://docusaurus.io/)** — Modern static site generator
- **React & TypeScript** — Interactive components and type safety
- **Tailwind CSS** — Utility-first styling
- **GraphQL** — API documentation and examples

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18.0
- npm or yarn package manager

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/0xintuition/intuition-docs.git
   cd intuition-docs
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```
   
   The site will be available at `http://localhost:3000`

### Building for Production

```bash
npm run build
npm run serve
```

## 📁 Documentation Structure

```
docs/
├── guides/
│   ├── introduction/          # Core concepts and vision
│   ├── quickstart/            # Getting started guides
│   ├── developer-tools/       # Developer resources and APIs
│   ├── hub/                   # Intuition Hub and tools
│   ├── use-cases/             # Real-world applications
│   ├── run-node/              # Node operation guides
│   └── resources/             # Additional resources and support
├── partials/                  # Reusable content components
└── src/                       # Custom React components and styling
```

## 🛠 Available Scripts

- `npm run dev` — Start development server with hot reload
- `npm run build` — Build optimized production site
- `npm run serve` — Preview production build locally
- `npm run lint` — Run ESLint for code quality
- `npm run format` — Format code with Prettier
- `npm run typecheck` — Run TypeScript type checking
- `npm run spell-check` — Check documentation spelling

## 🤝 Contributing

We welcome contributions to improve our documentation! Whether you're fixing typos, adding examples, or suggesting new content, your input helps make Intuition more accessible to everyone.

Please see our [Contributing Guidelines](CONTRIBUTING.md) for:
- How to submit pull requests
- Documentation standards and style guide
- Content review process
- Community guidelines

## 🏗 Core Primitives

Intuition's knowledge graph is built on three fundamental primitives:

- **Atoms** — Universal identifiers for any entity (people, concepts, products, etc.)
- **Triples** — Semantic relationships expressing statements like "Person A knows Person B"
- **Signals** — Community attestations that add weight and credibility to statements

These primitives work together to create a structured, queryable, and economically incentivized knowledge graph that spans the entire web.

## 🌍 Ecosystem

The Intuition ecosystem includes:

- **[Portal](https://portal.intuition.systems)** — Main interface for creating identities and making claims
- **[Testnet Hub](https://intuition-testnet.hub.caldera.xyz/)** — Development environment and tools
- **[Explorer](https://testnet.explorer.intuition.systems/)** — Blockchain explorer for the Intuition testnet
- **[Bridge](https://testnet.bridge.intuition.systems/)** — Cross-chain asset transfers
- **Browser Extension** — Access the knowledge graph across the web

## 📖 Additional Resources

- **[Official Website](https://intuition.systems)** — Learn about the project and team
- **[Documentation Site](https://docs.intuition.systems)** — Live version of this documentation
- **[GitHub Organization](https://github.com/0xintuition)** — All open-source code and repositories
- **[Community & Support](/docs/guides/resources/community-and-support)** — Get help and connect with the community

## 📄 License

This documentation is licensed under the terms specified in the [LICENSE](LICENSE) file.

---

**Ready to start building?** Check out our [Quickstart Guide](/docs/guides/quickstart) or explore the [Developer Tools](/docs/guides/developer-tools) to begin creating with the trust protocol.