# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the documentation site for **Intuition** — a decentralized knowledge graph and trust protocol. The site is built with Docusaurus 3.9 and uses React, TypeScript, and Tailwind CSS.

## Common Commands

```bash
# Development
npm run dev          # Start dev server (localhost:3000)
npm run build        # Build production site
npm run serve        # Preview production build

# Code Quality
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run format       # Format with Prettier (src & docs)
npm run format:docs  # Format docs only
npm run typecheck    # TypeScript type checking
npm run spell-check  # Check docs spelling (cspell)

# Docusaurus Utilities
npm run clear        # Clear Docusaurus cache (useful for build issues)
```

## Architecture

### Documentation Structure

- **`docs/_data/`** - Main documentation content (MDX files), organized by topic:
  - `getting-started/`, `quick-start/` - Onboarding guides
  - `intuition-concepts/` - Core primitives (Atoms, Triples, Signals)
  - `intuition-sdk/`, `graphql-api/`, `protocol/` - Developer tools
  - `intuition-smart-contracts/`, `interaction-guide/` - Contract docs
  - `intuition-network/`, `intuition-node/` - Infrastructure
  - `tutorials/` - Step-by-step guides
- **`docs/guides/`** - Additional guide content
- **`sidebars.js`** - Uses auto-generated sidebars from directory structure

### Source Code Structure

- **`src/components/`** - React components (interactive demos, GraphQL playground, FAQ)
- **`src/pages/`** - Custom Docusaurus pages
- **`src/theme/`** - Docusaurus theme overrides (MDXComponents, SearchBar, Footer)
- **`src/css/`** - Global styles including Tailwind (`custom.css`)
- **`src/snippets/`** - Reusable HTML snippets for navbar dropdowns

### Configuration

- **`docusaurus.config.js`** - Main config including:
  - Client redirects for URL migrations
  - Algolia search integration
  - Google Tag Manager
  - Mermaid diagram support
  - Live code blocks
- **`plugins/`** - Custom webpack and Tailwind plugins for Node.js polyfills

## Key Patterns

### Styling
- Tailwind CSS integrated via custom plugin (`plugins/tailwind-plugin.cjs`)
- Dark mode via `[data-theme="dark"]` selector
- Custom fonts: Inter (body), Plus Jakarta Sans (headings), Fira Code (code)

### Content Features
- MDX with live code execution (`@docusaurus/theme-live-codeblock`)
- npm2yarn plugin for package manager syntax switching
- Mermaid diagrams enabled globally

### URL Redirects
Client redirects are configured in `docusaurus.config.js` under `@docusaurus/plugin-client-redirects`. When reorganizing docs, add redirects from old paths to new paths.

## Code Style

- **Prettier**: single quotes, 2-space tabs
- **Commit messages**: conventional format (`feat:`, `fix:`, `docs:`, `refactor:`, `lint:`)
- **Branch naming**: `feature/my-new-feature`

## Spell Check Dictionary

Add project-specific terms to `cspell.json` when spell-check fails on valid technical terms.
