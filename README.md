# Intuition Documentation

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Documentation](https://img.shields.io/badge/docs-docs.intuition.systems-brightgreen)](https://docs.intuition.systems)
[![Node Version](https://img.shields.io/badge/node-%3E%3D22.18.0-brightgreen)](https://nodejs.org)

Welcome to the official documentation repository for **Intuition** — the world's first open, semantic, and decentralized knowledge graph. This repository contains comprehensive guides, API references, and developer resources for building with the trust protocol that's revolutionizing how we create, verify, and share knowledge online.

**Live Documentation**: [docs.intuition.systems](https://docs.intuition.systems)

## Table of Contents

- [About Intuition](#about-intuition)
- [Quick Start](#quick-start)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Development](#development)
  - [Building](#building)
- [Documentation Structure](#documentation-structure)
- [Available Scripts](#available-scripts)
- [What's in This Documentation](#whats-in-this-documentation)
- [For AI Agents](#for-ai-agents)
- [Technology Stack](#technology-stack)
- [Ecosystem Links](#ecosystem-links)
- [Contributing](#contributing)
- [License](#license)

## About Intuition

Intuition is building a **universal trust and identity layer** for the decentralized web. At its core, Intuition creates an open, semantic knowledge graph that enables trustful interactions at scale through:

- **Decoupling data from applications** — Creating a universal data layer accessible across platforms
- **Enabling verifiable claims** — Making both objective facts and subjective opinions verifiable and incentive-aligned
- **Providing semantic structure** — Building rich, queryable relationships between any entities or concepts
- **Incentivizing quality data** — Using cryptoeconomic mechanisms to reward valuable contributions

We believe in a future where trust online is **programmable, portable, and permissionless**.

### Core Primitives

Intuition's knowledge graph is built on three fundamental primitives:

- **Atoms** — Universal identifiers for any entity (people, concepts, products, etc.)
- **Triples** — Semantic relationships expressing statements like "Subject → Predicate → Object"
- **Signals** — Community attestations that add weight and credibility to statements

These primitives work together to create a structured, queryable, and economically incentivized knowledge graph.

## Quick Start

### Prerequisites

- **Node.js** >= 22.18.0 (< 25.0.0)
- **npm** or **yarn** package manager
- **Git** for version control

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/0xIntuition/intuition-docs.git
   cd intuition-docs
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

   This will also automatically run `patch-package` to apply any necessary patches.

### Development

**Start the development server** with hot reload:

```bash
npm run dev
```

The documentation site will be available at `http://localhost:3000`

> **Note**: The `dev` script runs `docusaurus start --no-open` to start the server without automatically opening a browser.

### Building

**Build the production-optimized site**:

```bash
npm run build
```

**Preview the production build locally**:

```bash
npm run serve
```

The built site will be in the `build/` directory.

## Documentation Structure

This repository uses [Docusaurus](https://docusaurus.io/) with native docs versioning. V2 is the default at `/docs` and covers the new generation of Intuition packages and Intuition Core. V1 at `/docs/v1` preserves the documentation for the `intuition-ts` packages and `intuition-rs` services.

```
intuition-docs/
├── docs/
│   └── _data/                      # Current V2 content
│       ├── index.md                # /docs
│       ├── get-started/            # Orientation, quickstart and migration
│       ├── agents/                 # Agent guidance and CLI
│       ├── concepts/               # Protocol, identity and processing
│       ├── build/                  # Integration guides
│       ├── examples/               # Six worked examples
│       ├── reference/              # Packages, SDK, APIs, contracts and catalogs
│       ├── core/                   # Operate and extend a Core node
│       └── community/              # Support, releases and contributions
├── _data_versioned_docs/
│   └── version-v1/                 # Preserved V1 content at /docs/v1
├── _data_versioned_sidebars/
│   └── version-v1-sidebars.json     # Frozen V1 sidebar
├── _data_versions.json             # Native Docusaurus version inventory
├── src/                            # Custom React components and styling
│   ├── components/                 # Reusable UI components
│   ├── css/                        # Custom CSS and Tailwind styles
│   └── pages/                      # Custom pages
├── static/                         # Static assets (images, files, etc.)
│   ├── img/                        # Images and icons
│   ├── llms{,-medium,-full}.txt     # V2 agent documentation bundles
│   └── docs/v1/                    # V1 agent documentation bundles
├── docs-versions.config.js         # Shared version paths, labels, and metadata
├── docusaurus.config.js            # Docusaurus configuration
├── sidebars.js                     # Authored V2 sidebar
└── package.json                    # Dependencies and scripts
```

**How it works**:

- `docs/_data/` contains only V2 pages. File paths determine routes, with `index.md` serving as a section landing page.
- `_data_versioned_docs/version-v1/` contains the preserved V1 snapshot, served under `/docs/v1` with its frozen sidebar.
- `docs-versions.config.js` is the shared source for version names, labels, content directories, route bases, agent-bundle locations, search tags, and the V1 snapshot commit. The site configuration and scripts read it.
- `sidebars.js` lists the 134 V2 pages in the order recorded in `scripts/v2-launch-routes.txt`. Check the complete inventory and page templates with `node scripts/validate-v2-structure.js --launch --templates`.

## Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| **Development** | | |
| `npm run dev` | `docusaurus start --no-open` | Start dev server without opening browser |
| `npm start` | `docusaurus start` | Start dev server and open browser |
| **Building** | | |
| `npm run build` | `docusaurus build` | Build production site |
| `npm run serve` | `docusaurus serve` | Serve production build locally |
| `npm run clear` | `docusaurus clear` | Clear Docusaurus cache |
| **Code Quality** | | |
| `npm run lint` | `eslint . --ext .js,.ts,.jsx,.tsx` | Run ESLint |
| `npm run lint:fix` | `npm run lint -- --fix` | Fix ESLint errors automatically |
| `npm run format` | `prettier -w src docs` | Format code with Prettier |
| `npm run format:docs` | `prettier -w docs` | Format only documentation files |
| `npm run typecheck` | `tsc` | Run TypeScript type checking |
| **Other** | | |
| `npm run deploy` | `docusaurus deploy` | Deploy to hosting |
| `npm run swizzle` | `docusaurus swizzle` | Eject Docusaurus components |

**Additional Commands**:
```bash
# Check spelling in documentation
npx cspell docs/**/*.mdx

# Write translation files
npm run write-translations

# Write heading IDs
npm run write-heading-ids
```

## What's in This Documentation

| If you want to… | Start here |
| --- | --- |
| Understand Intuition | [How the pieces fit](/docs/get-started/how-it-fits), [concept map](/docs/concepts) and [glossary](/docs/reference/glossary) |
| Build an integration | [Offline quickstart](/docs/get-started/quickstart), [task guides](/docs/build) and [worked examples](/docs/examples) |
| Work with an agent | [AI agents](/docs/agents) |
| Check a signature, deployment or network | [Reference](/docs/reference), [SDK functions](/docs/reference/sdk), [contracts](/docs/reference/contracts) and [networks](/docs/reference/networks) |
| Run your own indexed read service | [Intuition Core](/docs/core), [local devnet](/docs/core/local-devnet) and [Core Query API](/docs/reference/core-query-api) |
| Maintain a V1 integration | [V1 documentation](/docs/v1), [V1 GraphQL API](/docs/v1/graphql-api/overview) and [migration guide](/docs/get-started/migrate-from-v1) |
| Get help or propose a change | [Community](/docs/community) and [contributor guide](/docs/community/contributing) |

## For AI Agents

Each version has an index, a condensed bundle, and a full-text bundle. The root URLs contain V2. Use the `/docs/v1` URLs for V1.

| Format | V2 | V1 |
| --- | --- | --- |
| Index | [/llms.txt](https://docs.intuition.systems/llms.txt) | [/docs/v1/llms.txt](https://docs.intuition.systems/docs/v1/llms.txt) |
| Condensed | [/llms-medium.txt](https://docs.intuition.systems/llms-medium.txt) | [/docs/v1/llms-medium.txt](https://docs.intuition.systems/docs/v1/llms-medium.txt) |
| Full text | [/llms-full.txt](https://docs.intuition.systems/llms-full.txt) | [/docs/v1/llms-full.txt](https://docs.intuition.systems/docs/v1/llms-full.txt) |

Each index links directly to Markdown for individual pages. Append `.md` to the canonical HTML route after removing any trailing slash. The home pages export to `/docs.md` and `/docs/v1.md`. On older URLs, follow the client redirect or its canonical link before appending the extension. Each content page also advertises the absolute export URL in its HTML head with `rel="alternate"` and `type="text/markdown"`. The two generated V1 category indexes provide HTML only.

The export starts with YAML front matter containing `title`, `description`, `url`, `markdown_url`, `version`, and `llms_index`. V2 pages also identify their `kind`, intended `reader`, and `packages` with exact versions. A V2 concept links its prerequisites through the `depends_on` list of Markdown URLs.

## Technology Stack

This documentation site is built with:

- **[Docusaurus 3.9](https://docusaurus.io/)** — Modern static site generator with MDX support
- **React 18** — UI components and interactivity
- **TypeScript** — Type safety and better developer experience
- **Tailwind CSS** — Utility-first styling
- **Mermaid** — Diagram generation in markdown
- **Algolia** — Powered search functionality
- **GraphQL Sandbox** — Interactive API exploration

## Ecosystem Links

### Official Services

- **[Intuition Website](https://intuition.systems)** — Learn about the project and team
- **[Documentation](https://docs.intuition.systems)** — This documentation site (live)
- **[Protocol Explorer](https://portal.intuition.systems)** — Explore the knowledge graph
- **[Network Hub](https://testnet.hub.intuition.systems/)** — Testnet development environment and tools
- **[Forum](https://atlas.discourse.group)** — Community discussions and support

### Development Tools

- **[GitHub Organization](https://github.com/0xIntuition)** — All open-source repositories
- **[Chrome Extension](https://github.com/0xIntuition/intuition-chrome-extension)** — Browser integration for the knowledge graph

## Contributing

We welcome contributions to improve our documentation! Whether you're fixing typos, adding examples, improving clarity, or creating new guides, your input helps make Intuition more accessible to everyone.

**Ways to contribute**:
- 🐛 Report issues or broken links
- 📝 Improve existing documentation
- ✨ Add new guides and tutorials
- 🌍 Help with translations
- 💡 Suggest new content

Please see our [Contributing Guidelines](/docs/community/contributing) for:
- How to submit pull requests
- Documentation style guide and standards
- Content review process
- Community guidelines

**Quick contribution workflow**:
1. Fork this repository
2. Create a feature branch: `git checkout -b docs/your-improvement`
3. Make your changes and test locally with `npm run dev`
4. Run linting and formatting: `npm run lint:fix && npm run format`
5. Commit your changes with a descriptive message
6. Push and create a pull request

## License

This documentation is licensed under the terms specified in the [LICENSE](LICENSE) file.

Copyright © Intuition Systems Inc. since 2023. All rights reserved.

---

**Ready to start building?** 
- 🚀 [Quick Start Guide](/docs/get-started/quickstart)
- 📚 [SDK Documentation](/docs/reference/sdk)
- 🔧 [Developer Tools](/docs/build)
- 💬 [Join our Community](/docs/community)
