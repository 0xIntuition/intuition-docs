---
title: Contribution Guidelines
sidebar_label: 🤝 Contribution Guidelines
sidebar_position: 15
description: Guidelines for contributing to Intuition projects across all repositories including intuition-ts, intuition-rs, intuition-mcp-server, and intuition-contracts-v2
keywords: [contributing, contribution, development, open source, github, pull request, code of conduct]
---


# Contribution Guidelines

Thanks for your interest in contributing to 0xIntuition! We're excited to have you join our community of builders working on the trust protocol for the internet.

Please take a moment to review this document before submitting your first pull request. We also strongly recommend that you check for open issues and pull requests to see if someone else is working on something similar.

If you need any help, feel free to reach out to [@0xintuition](https://twitter.com/0xintuition).

## General Guidelines

These guidelines apply across all Intuition repositories. Each repository may have additional specific requirements, so be sure to check the repository-specific sections below.

### Code of Conduct

By participating in this project, you agree to abide by our community standards. We expect all contributors to be respectful, inclusive, and constructive in their interactions.

### Getting Started

1. **Fork the repository** you want to contribute to
2. **Clone your fork** locally
3. **Create a new branch** for your feature or fix: `git checkout -b feature/my-new-feature`
4. **Make your changes** following the repository's coding standards
5. **Test your changes** thoroughly
6. **Commit your changes** with a descriptive message
7. **Push to your fork** and **submit a pull request**

### Commit Message Guidelines

We largely follow conventional commit format across all repositories:
- `feat: Description` - for new features
- `fix: Description` - for bug fixes
- `docs: Description` - for documentation updates
- `refactor: Description` - for code refactoring
- `test: Description` - for adding or updating tests

### Pull Request Process

Our PR process is consistent across repositories:
- Provide a clear description of what your PR does
- Reference any related issues
- Ensure all tests pass
- Be responsive to feedback during code review
- Keep PRs focused and atomic when possible

### Versioning

We follow [Semantic Versioning](https://semver.org/) (SemVer) across all our repositories:
- **MAJOR** version for incompatible API changes
- **MINOR** version for backwards-compatible functionality additions
- **PATCH** version for backwards-compatible bug fixes

## Repository-Specific Guidelines

While we maintain consistent practices across all repositories, each has specific setup requirements and workflows. **Always check the individual repository's README and CONTRIBUTING.md (if present) for detailed, repo-specific instructions.**

### intuition-ts

**Description**: TypeScript monorepo containing our SDK, UI components, API interactions, and core applications.

**What's included**:
- SDK packages for protocol and API interactions
- 1ui component library with Storybook
- Core applications and utilities

**Contributing**: This repository has comprehensive contribution guidelines. Please read the [CONTRIBUTING.md](https://github.com/0xIntuition/intuition-ts/blob/main/CONTRIBUTING.md) file for detailed instructions on:
- Monorepo structure and workspace commands
- Development setup with pnpm and Nx
- Testing requirements and changesets workflow
- Component development guidelines

### intuition-rs

**Description**: Rust workspace containing the backend infrastructure, indexing services, and data processing pipeline.

**What's included**:
- CLI tools and TUI client
- Event consumers (raw, decoded, resolver)
- Indexing services (envio-indexer, substreams-sink)
- Database models and RPC proxy
- Docker and Kubernetes deployment configurations

**Contributing**:
- Install [Rust](https://rustup.rs/) and [cargo-make](https://github.com/sagiegurari/cargo-make)
- Follow the setup instructions in the [README](https://github.com/0xIntuition/intuition-rs/blob/main/README.md)
- Run tests with `cargo nextest run`
- Use `cargo make` commands for common development tasks
- Note: This repository follows Rust-specific conventions for code style and testing

### intuition-mcp-server

**Description**: Model Context Protocol server for interacting with the Intuition knowledge graph, enabling powerful AI integrations.

**What's included**:
- HTTP stream server with MCP protocol support
- Tools for extracting triples and searching entities
- Account and relationship management APIs
- Client SDK and examples

**Contributing**:
- Requires Node.js 14+ and pnpm
- Follow setup instructions in the [README](https://github.com/0xIntuition/intuition-mcp-server/blob/main/README.md)
- Test locally with `pnpm run start:http`
- See the Contributing section in the README for MCP-specific development guidelines

### intuition-contracts-v2

**Description**: Smart contracts for Intuition V2 protocol built with Foundry, handling core protocol logic and token economics.

**What's included**:
- Core protocol smart contracts
- Deployment and migration scripts
- Comprehensive test suite
- Gas optimization and security features

**Contributing**:
- Install [Foundry](https://book.getfoundry.sh/getting-started/installation)
- Install [Bun](https://bun.sh/) for Node.js package management
- Follow setup instructions in the [README](https://github.com/0xIntuition/intuition-contracts-v2/blob/main/README.md)
- Run tests with `forge test`
- Use `forge fmt` for code formatting and `bun run lint` for linting
- Follow Solidity best practices and security guidelines for smart contract development

## Getting Help

- **GitHub Issues**: Use the Issues tab in the relevant repository for bug reports and feature requests
- **Twitter**: Follow [@0xintuition](https://twitter.com/0xintuition) for updates
- **Documentation**: Visit our [docs site](https://docs.intuition.systems) for comprehensive guides

## What to Contribute

We welcome contributions of all kinds:

- **Bug fixes** - Help us identify and resolve issues
- **Feature development** - Build new capabilities for the protocol
- **Documentation** - Improve guides, examples, and API documentation
- **Testing** - Add test coverage and improve quality assurance
- **Examples** - Create tutorials and sample applications
- **Performance** - Optimize existing code and infrastructure

Thank you for contributing to the future of decentralized trust! 🚀
