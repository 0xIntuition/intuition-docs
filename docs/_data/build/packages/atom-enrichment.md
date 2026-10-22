---
title: '@0xintuition/atom-enrichment guide'
slug: /build/packages/atom-enrichment
sidebar_position: 12
---

Execute selected enrichment providers and extract fields from artifacts.

Candidate source version: **0.1.0-alpha.0**. [Release compatibility](../compatibility.md) explains publication and deployment prerequisites.

## Install

```sh
npm install @0xintuition/atom-enrichment@0.1.0-alpha.0
```

Use ESM imports.

## Main surface

| Export or operation                 | Purpose                                                |
| ----------------------------------- | ------------------------------------------------------ |
| `createEnrichmentEngine(options)`   | Engine with an explicit plugin and cache configuration |
| `createOpenGraphPlugin()`           | OpenGraph provider plugin                              |
| `createMemoryCacheAdapter(options)` | Bounded process-local cache adapter                    |
| `runPluginConformanceSuite`         | Test-only conformance helper from /testing             |

## First use

```ts
import {
  createEnrichmentEngine,
  createMemoryCacheAdapter,
} from '@0xintuition/atom-enrichment';
const engine = createEnrichmentEngine({
  plugins: [],
  cache: createMemoryCacheAdapter({ maxEntries: 100 }),
});
// Add approved provider plugins before calling engine.enrich with a classified input.
```

## Integration decisions

The caller owns credentials, transport, retries, scheduling, and persistence. Provider payload validation does not replace the canonical classification registry. Imports alone do not fetch data.

## Source and full contract

[Source and package guide](https://github.com/0xIntuition/packages/tree/1dc7103d2a05f23bc565a81df4b001336ce9ba53/packages/atom-enrichment) · [npm package](https://www.npmjs.com/package/@0xintuition/atom-enrichment). The [machine-readable manifest](/intuition-release.json) lists all declared public subpaths and peer dependencies. Npm links name the intended package; this page does not assert that the candidate has been published.
