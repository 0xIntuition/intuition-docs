---
title: Compose an atom runtime
sidebar_label: Compose an atom runtime
description: Configure local plugins and memory caches, bound two kinds of concurrency, and inspect each classification outcome before disposing of the runtime.
kind: how-to
reader: ["app", "operator"]
packages: ["@0xintuition/atom-runtime", "@0xintuition/pipeline-runtime"]
---

<AppliesTo />

Process a batch of labels through one configured runtime and return an outcome for each input.

## Before you start

A classifier proposes a type for an input. Enrichment plugins collect additional evidence when their inputs and providers are available. Review [the atom runtime](/docs/concepts/atom-runtime) and [enrichment](/docs/concepts/enrichment).

For your own project, follow [Install the packages](/docs/build/install). To run the [offline example](https://github.com/0xIntuition/intuition-docs/blob/c3b1eaa91a822bb59b20cb6de2bc9b874a00b7b0/examples/v2/music-catalog/src/atom-runtime-guide.ts), install its locked dependencies from the documentation repository root with Node.js 22.21.0.

```sh
npm ci --prefix examples/v2 --ignore-scripts
```

## Steps

### 1. Choose the plugins and the cache

Supply an explicit environment and choose the memory cache. One runtime supplies its classification engine with a classification cache and its enrichment engines with a separate enrichment cache. The example replaces the classification preset with local plugins and the selected `custom` enrichment preset with an empty list. An empty environment alone would still leave the standard plugin factories available.

### 2. Set the two concurrency limits

Set `config.enrichment.concurrency` to limit concurrent provider work inside the enrichment engine. Separately, pass `concurrency: 2` to `forEachBounded` to limit the number of input labels being processed together. It returns outcomes in input order. An empty label rejects the example’s async callback and yields a failure for that item.

{/* example:start examples/v2/music-catalog/src/atom-runtime-guide.ts#local-runtime */}
```ts
import {
  createPlainTextPlugin,
  createTypeProfilesPlugin,
} from '@0xintuition/atom-classification';
import { createProcessingRuntime } from '@0xintuition/atom-runtime';
import { forEachBounded } from '@0xintuition/pipeline-runtime/concurrency';

export async function classifyBatch(labels: string[]) {
  const runtime = createProcessingRuntime({
    config: {
      env: {},
      defaultPreset: 'custom',
      cache: { provider: 'memory', memoryMaxEntries: 100 },
      enrichment: { concurrency: 1, timeoutMs: 1_000 },
    },
    overrides: {
      classification: [createTypeProfilesPlugin(), createPlainTextPlugin()],
      enrichment: { custom: [] },
    },
  });
  try {
    const classifier = runtime.classification.engine();
    const outcomes = await forEachBounded(
      labels,
      async (label, signal) => {
        signal.throwIfAborted();
        if (!label.trim()) throw new Error('Enter a label');
        const result = await classifier.classify({
          input: label,
          mode: 'client-only',
        });
        return result.resolved?.publishable[0]?.type ?? 'unmatched';
      },
      { concurrency: 2 },
    );
    return {
      cache: runtime.cacheProvider,
      sameEngine: classifier === runtime.classification.engine(),
      plugins: runtime.enrichment.engine().listPlugins().length,
      outcomes: outcomes.map((item) =>
        item.kind === 'success' ? item.value : item.kind,
      ),
    };
  } finally {
    runtime.dispose();
  }
}
```
{/* example:end */}

### 3. Set the scope of reuse

Within this batch, repeated classification engine lookups return the same engine. Enrichment engine lookups are shared for the same preset and identity configuration object. Place disposal in `finally` so the runtime releases those engine references on success and on error. Further engine lookups on a disposed runtime throw.

For a server application that needs external metadata, select a preset and supply its provider configuration explicitly. For example, the music preset wires Spotify and MusicBrainz options. Spotify uses a client ID and secret for its API. External providers require network access, may have different credential requirements, and can return no match. Keep credentials in server configuration. [Preset factories](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/atom-runtime/src/presets.ts).

## Check the result

```sh
node examples/v2/music-catalog/src/atom-runtime-guide.ts
```

The example prints `cache: 'memory'`, `sameEngine: true`, and `plugins: 0` for the selected enrichment preset. The three label outcomes are `Thing`, `failure`, and `Thing`, in that order. The empty batch returns an empty outcomes array. The local type is a classification proposal. No provider enrichment was requested.

## Related

[Classify and enrich](/docs/build/classify-enrich), [runtime configuration](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/atom-runtime/src/config.ts), [engine and cache lifetimes](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/atom-runtime/src/runtime.ts), and [bounded concurrency](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/pipeline-runtime/src/concurrency.ts).
