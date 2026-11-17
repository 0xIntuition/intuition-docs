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

### Versioned documentation

- Read `docs-versions.config.js` for native version names, route bases, source directories and bundle locations. Docusaurus serves the current tree (`docs/_data/`) at `/docs` and the frozen snapshot (`_data_versioned_docs/version-v1/`) at `/docs/v1`.
- Edit V2 pages at their file-derived routes. `sidebars.js` explicitly orders the document IDs. Its launch inventory is `scripts/v2-launch-routes.txt`. The V1 sidebar is frozen in `_data_versioned_sidebars/version-v1-sidebars.json`. Native V1/V2 page pairs live in `src/data/version-equivalents.json`.
- Use `static/intuition-release.json` for exact package versions and source commits. Readers fork Core and build from its pinned commit. Check a source claim in the corresponding repository at that revision.
- See `docs/_data/community/contributing.md` for page templates and source updates. Runnable V2 snippets come from strict projects in `examples/v2/` via `scripts/sync-example-snippets.js`. Regenerate data blocks with `scripts/sync-generated-blocks.js`. Install example dependencies with `npm ci --ignore-scripts --prefix examples/v2`.
- Run `node scripts/validate-v2-structure.js --launch --templates` to check the complete launch tree. After a production build, `node scripts/validate-built-docs.js --phase 5` checks native routes, version navigation and Markdown exports.

### Site and text exports

- `docusaurus.config.js` configures the versioned docs plugin, search and redirects. `src/components/`, `src/theme/` and `src/pages/` hold site components and overrides. Shared styles live in `src/css/`.
- `plugins/markdown-export-plugin.cjs` uses native metadata to emit a Markdown file for each content page. The two version roots export to `/docs.md` and `/docs/v1.md`.
- Edit the current curated index in `scripts/llms-index-source.v2.md`. The frozen V1 index source is `scripts/llms-index-source.v1.md`. Run `npm run generate-llms` on committed sources to reproduce the three V2 bundles in `static/` and the three frozen V1 bundles in `static/docs/v1/`. See the README’s “For AI Agents” section for their public URLs.

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
