---
title: '@0xintuition/atom-runtime'
sidebar_label: 'Atom runtime'
slug: /build/packages/atom-runtime
sidebar_position: 13
---

Compose classification and enrichment with shared configuration, presets, caches, and memoized engines. This is the public server integration layer for applications that previously maintained their own engine wiring. It uses Promises and requires Node 20+.

## Install

```sh
npm install @0xintuition/atom-runtime@0.1.0-alpha.0
```

## Create and reuse a runtime

```ts
import { createProcessingRuntime } from '@0xintuition/atom-runtime';

const runtime = createProcessingRuntime({
  env: {},
  cache: { provider: 'memory', memoryMaxEntries: 1000 },
});
try {
  const classifier = runtime.classification.engine();
  const enricher = runtime.enrichment.engine('default');
  console.log({
    reused: classifier === runtime.classification.engine(),
    enrichmentReused: enricher === runtime.enrichment.engine('default'),
    cacheProvider: runtime.cacheProvider,
    warnings: runtime.warnings,
  });
} finally {
  runtime.dispose();
}
```

Creating engines does not fetch provider data. Keep one runtime per intended configuration/lifecycle instead of recreating caches for every request. Enrichment engines are memoized by preset and identity capability. Their published plugin registries are immutable; select plugin overrides when constructing a runtime.

## Configuration and public entrypoints

| Import suffix       | Use                                                                                          |
| ------------------- | -------------------------------------------------------------------------------------------- |
| Root                | `createProcessingRuntime`, `createCacheRuntime`, configuration, presets, adapters, and types |
| `/config`           | Configuration schemas, `resolveProcessingRuntimeConfig`, and `pickProcessingEnv`             |
| `/presets`          | Classification plugins, enrichment preset factories, and default scopes                      |
| `/fingerprint`      | `computeProcessingConfigFingerprint` for configuration identity                              |
| `/consumers`        | `createAtomServicesProcessingRuntime` and `createTrpcLocalProcessingRuntime` adapters        |
| `/adapters/upstash` | Explicit HTTP cache integration                                                              |

Pass an explicit `env` map, or use `{ config, runtime, overrides }` to inject clock, logger, cache fetcher, and plugin overrides. The injected runtime fetcher configures cache HTTP access; provider transports have their own options. `default` uses the server-default enrichment bundle; other presets include `academic`, `company`, `crypto`, and `music`.

Cache providers are `none`, `memory`, or `upstash`. Inspect `warnings` and the resolved provider rather than assuming remote cache credentials were accepted. Consumer adapters have different cache fallback/default policies; choose the adapter for your host or configure the core runtime explicitly.

Fingerprints include secret presence rather than secret values. They identify configuration, not provider output or a persisted atom. Environment reads happen only when explicitly invoking a named `FromEnv` adapter; the runtime accepts the map you supply.

## Shutdown and ownership

`dispose()` prevents new engine lookups. It does not cancel in-flight requests or revoke engine references already obtained. Pass an `AbortSignal` to each request and cancel active work before disposing the runtime. Your application owns queues, retries, persistence, access control, and any Effect adapter.

Continue with the [complete processing handoff](../guides/processing.md).

## Source and release

[Package source and README](https://github.com/0xIntuition/packages/tree/dde4fdf5774447b84cd0b820593fb0db7366e58d/packages/atom-runtime) · [npm version](https://www.npmjs.com/package/@0xintuition/atom-runtime/v/0.1.0-alpha.0). The [release manifest](/intuition-release.json) records all public subpaths and integrity.
