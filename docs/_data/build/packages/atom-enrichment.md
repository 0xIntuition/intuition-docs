---
title: '@0xintuition/atom-enrichment guide'
slug: /build/packages/atom-enrichment
sidebar_position: 12
---

Execute selected enrichment providers and extract fields from artifacts.

Published alpha version: **0.1.0-alpha.0**. [Release compatibility](../compatibility.md) records npm publication, peer dependencies, and deployment boundaries.

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

## Presets, handoff, and extraction

`/presets` exports `serverDefaultPreset`, `musicPreset`, `academicPreset`, `companyPreset`, `cryptoPreset`, and `createServerDefaultPresetOptions(env)`. Select the smallest provider set that supports your workflow. Credentials and runtime support determine which providers can run.

`/handoff` exports `toClassifiedAtomInput(rawInput, classified)`, returning a usable input or `null`. `/extraction` exports `extractClassificationFields`, returning normalized values, field provenance, missing required fields, and dropped-field reasons. Extraction may perform additional provider lookups. `/data-resolved-schema` describes the normalized resolved-data boundary; it is separate from a canonical atom payload.

An enrichment run returns `status`, `artifacts`, `errors`, `skipped`, and `timings`. Each artifact carries its type, data, and source/plugin metadata. Preserve partial results and errors together. Use `/outcome` for `enrichOutcome` when your host uses the shared Promise outcome union.

Continue with the [complete processing recipe](../guides/processing.md) and [provider/plugin guide](../guides/processing-plugins.md).

## Source and full contract

[Source and package guide](https://github.com/0xIntuition/packages/tree/dde4fdf5774447b84cd0b820593fb0db7366e58d/packages/atom-enrichment) · [npm package](https://www.npmjs.com/package/@0xintuition/atom-enrichment/v/0.1.0-alpha.0). The [machine-readable manifest](/intuition-release.json) lists all declared public subpaths and peer dependencies. Exact npm versions, tarball integrity, and observed dist-tags are recorded in the manifest.
