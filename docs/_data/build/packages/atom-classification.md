---
title: '@0xintuition/atom-classification guide'
slug: /build/packages/atom-classification
sidebar_position: 11
---

Compose a plugin-based classification engine for client, progressive, or server execution.

Published alpha version: **0.1.0-alpha.0**. [Release compatibility](../compatibility.md) records npm publication, peer dependencies, and deployment boundaries.

## Install

```sh
npm install @0xintuition/atom-classification@0.1.0-alpha.0
```

Use ESM imports.

## Main surface

| Export or operation             | Purpose                                 |
| ------------------------------- | --------------------------------------- |
| `createClientEngine(options)`   | Client-compatible classification engine |
| `createPlainTextPlugin()`       | Local text classification plugin        |
| `createTypeProfilesPlugin()`    | Runtime type-profile plugin             |
| `defaultClassificationPreset()` | Explicit default plugin selection       |

## First use

```ts
import {
  createClientEngine,
  createPlainTextPlugin,
  createTypeProfilesPlugin,
} from '@0xintuition/atom-classification';
const engine = createClientEngine({
  plugins: [createTypeProfilesPlugin(), createPlainTextPlugin()],
});
console.log(
  await engine.classify({
    input: 'An idea',
    mode: 'client-only',
    classificationSessionId: 'example',
  }),
);
```

## Integration decisions

Creating an engine does not enable all plugins or persist results. This runtime is distinct from classifications, which owns canonical entity specifications. Keep provider credentials on the server.

## Published default preset

`defaultClassificationPreset()` includes type profiles, plain text, Intuition IIDs, ISBN, Etherscan, Spotify, Amazon, GitHub, npm, Goodreads, Open Library, Letterboxd, places, X, Instagram, TikTok, YouTube, Wikipedia, Wikidata, IMDb, TMDB, Steam, CoinGecko, CoinMarketCap, Etsy, Shopify, and the optional generic URL fallback. Factory availability does not mean a provider can execute without its required runtime or credentials.

Use `createServerEngine({ plugins })` for server plugins. `createClientEngine` supports compatible local plugins. The default preset uses `Thing` for arbitrary text; lexical `DefinedTerm` classification is opt-in.

```ts
import {
  createServerEngine,
  defaultClassificationPreset,
} from '@0xintuition/atom-classification';
import { classifyOutcome } from '@0xintuition/atom-classification/outcome';

const engine = createServerEngine({ plugins: defaultClassificationPreset() });
const outcome = await classifyOutcome(engine, {
  input: 'An example idea',
  mode: 'server-only',
  classificationSessionId: 'server-example',
});
console.log(outcome.kind);
```

`engine.classify(request, { signal })` accepts cancellation. Resolver and cache work share configured deadlines. Optional asynchronous `onClassifierError` observers cannot change classification results when they fail. Use `resolved.publishable` for the publishable boundary, retain diagnostics separately, and use the [handoff helper](../guides/processing.md) instead of guessing enrichment inputs.

Public plugin factories are available through `/plugins` and the explicit `/plugins/<provider>` exports. `/plugin-api`, `/type-registry`, `/testing`, `/outcome`, `/adapters/upstash`, and the transport/observation subpaths support extension and integration. Use the manifest for the exact list; not every plugin has a dedicated subpath.

## Source and full contract

[Source and package guide](https://github.com/0xIntuition/packages/tree/dde4fdf5774447b84cd0b820593fb0db7366e58d/packages/atom-classification) · [npm package](https://www.npmjs.com/package/@0xintuition/atom-classification/v/0.1.0-alpha.0). The [machine-readable manifest](/intuition-release.json) lists all declared public subpaths and peer dependencies. Exact npm versions, tarball integrity, and observed dist-tags are recorded in the manifest.
