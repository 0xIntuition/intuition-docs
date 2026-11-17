---
title: '@0xintuition/atom-runtime'
sidebar_label: 'Atom runtime'
description: 'Compose and reuse classification and enrichment engines with explicit plugins, caches, and runtime configuration.'
kind: reference
reader: ["app", "plugin"]
packages: ["@0xintuition/atom-runtime"]
---

<AppliesTo />

## What it's for

A server composition layer for classification and enrichment engines, shared caches, presets, and configuration fingerprints. It does not provide graph storage, worker scheduling, or an automatically offline pipeline.

## When to use it

Use one runtime per intended configuration and application lifecycle to reuse engines and caches. Use the individual parser, classification, or enrichment packages for a single stage. Supplying no graph database removes a persistence prerequisite; it does not prevent selected providers from making requests.

## Install

```sh
npm install @0xintuition/atom-runtime@0.1.0
```

Use ESM and Promises on Node 20 or newer.

## Entry points

| Subpath | Purpose |
| --- | --- |
| `.` | Runtime/cache factories, configuration, presets, and consumer adapters |
| `./presets` | Classification plugins, enrichment factories, and default scopes |
| `./fingerprint` | Compute configuration identity |
| `./consumers` | Atom-services and local application composition adapters |
| `./config` | Resolve configuration and select processing environment keys |
| `./adapters/upstash` | Explicit HTTP cache integration |

## Depends on and works with

Runtime package dependencies: [atom-classification](/docs/reference/packages/atom-classification), [atom-enrichment](/docs/reference/packages/atom-enrichment), [atom-parser](/docs/reference/packages/atom-parser), [iid-registry](/docs/reference/packages/iid-registry), and [pipeline-runtime](/docs/reference/packages/pipeline-runtime). Peer dependencies: none. `zod` is an additional ordinary dependency in the package manifest.

Your host supplies transport, credentials, clock, logging, and persistent storage. Cache providers are `none`, `memory`, and `upstash`; inspect `cacheProvider` and `warnings` after resolution. Consumer adapters have their own cache defaults and fallback policies.

## Example

This runtime selects only deterministic text classifiers, an empty default enrichment set, a fixed clock, and memory caching. It performs one classification and proves that repeated engine lookup returns the same instance.

{/* example:start examples/v2/music-catalog/src/package-examples/runtime.ts#shared-runtime */}
```ts
import {
  createPlainTextPlugin,
  createTypeProfilesPlugin,
} from '@0xintuition/atom-classification';
import { createProcessingRuntime } from '@0xintuition/atom-runtime';

export const runtime = createProcessingRuntime({
  config: { env: {}, cache: { provider: 'memory', memoryMaxEntries: 100 } },
  runtime: { now: () => '2026-01-01T00:00:00.000Z' },
  overrides: {
    classification: [createTypeProfilesPlugin(), createPlainTextPlugin()],
    enrichment: { default: [] },
  },
});
try {
  const engine = runtime.classification.engine();
  const result = await engine.classify({
    input: 'A synthetic catalog idea',
    mode: 'client-only',
    classificationSessionId: 'runtime-reference',
  });
  console.log(engine === runtime.classification.engine());
  console.log(result.resolved?.publishable[0]?.type);
  console.log(runtime.cacheProvider, runtime.warnings);
} finally {
  runtime.dispose();
}
```
{/* example:end */}

`runtime.fetch` in the composition options configures HTTP cache access; it is not a universal override for provider requests. Configure provider transports in their own options, or inject selected plugins as shown. Enrichment engines are memoized by preset and identity capability, and their published plugin registries are immutable. Change plugin selection when constructing the runtime.

Fingerprints include secret presence rather than secret values. They identify configuration, not the resulting entity or a persisted atom. Pass an explicit `env` map; only named `FromEnv` helpers read the process environment when called.

After `dispose()`, new engine lookups throw. Disposal does not cancel requests already in flight or revoke engine references already obtained. Supply and abort request signals before disposing when shutting down active work. The host owns retries and queues.

## Related concepts

[How the pieces fit](/docs/get-started/how-it-fits) locates this composition layer. [Classify and enrich atoms](/docs/build/classify-enrich) explains stage inputs and outputs; [Write a classification plugin](/docs/core/classification-plugin) explains the separate Core wiring required in a fork.

## Source

[Package README](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/atom-runtime/README.md), [runtime implementation](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/atom-runtime/src/runtime.ts), and [public runtime tests](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/atom-runtime/__tests__/public-runtime.test.ts).
