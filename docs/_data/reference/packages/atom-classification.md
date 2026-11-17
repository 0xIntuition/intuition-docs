---
title: '@0xintuition/atom-classification'
sidebar_label: 'Atom classification'
description: 'Run an explicit plugin set and inspect canonical classifications, publishable fields, and resolver failures.'
kind: reference
reader: ["app", "plugin"]
packages: ["@0xintuition/atom-classification"]
---

<AppliesTo />

## What it's for

A plugin engine that classifies input and resolves canonical envelopes in client-only, progressive, or server-only modes. It executes classification logic; the classifications package owns the canonical entity specifications.

## When to use it

Use it to turn an input into typed identity data before enrichment or a creation decision. Select plugins explicitly: creating an engine neither installs every provider nor persists output. Use server-compatible plugins for credentialed providers; a provider factory's existence does not guarantee a network response.

## Install

```sh
npm install @0xintuition/atom-classification@0.1.0
```

Use ESM on Node 20+ or Bun for server execution. A client engine needs client-compatible plugins; provider requests require a suitable transport.

## Entry points

<details>
<summary>All public modules</summary>

| Subpath | Purpose |
| --- | --- |
| `.` | Engines, plugin factories, canonical result contracts, and type registry |
| `./ai` | Optional server AI fallback adapter |
| `./cache` | Resolver cache contracts and adapters |
| `./client` | Client engine factory |
| `./engine` | Shared classification engine |
| `./plugin-factories` | Built-in plugin factories |
| `./plugins` | Plugin manifests, types, and validation |
| `./plugins/amazon` | Amazon plugin and adapters |
| `./plugins/default-url` | Generic URL fallback |
| `./plugins/etherscan` | Etherscan plugin |
| `./plugins/ethereum` | Ethereum input plugin |
| `./plugins/github` | GitHub plugin and adapters |
| `./plugins/imdb` | IMDb plugin and adapters |
| `./plugins/instagram` | Instagram plugin and adapters |
| `./plugins/isbn` | ISBN plugin |
| `./plugins/lexical` | Opt-in lexical classification |
| `./plugins/plain-text` | Generic Thing fallback for text |
| `./plugins/spotify` | Spotify plugin and adapters |
| `./plugins/tiktok` | TikTok plugin |
| `./plugins/tmdb` | TMDB plugin |
| `./plugins/type-profiles` | Runtime type profiles |
| `./plugins/wikipedia` | Wikipedia plugin |
| `./plugins/x` | X plugin and adapters |
| `./plugins/youtube` | YouTube plugin and adapters |
| `./presets` | Explicit default plugin selection |
| `./server` | Server engine factory |
| `./type-registry` | JSON-LD type registration and validation |
| `./types` | Request, result, policy, and provenance schemas |
| `./testing` | Plugin testing helpers |
| `./plugins/coingecko` | CoinGecko plugin |
| `./plugins/coinmarketcap` | CoinMarketCap plugin |
| `./plugins/etsy` | Etsy plugin |
| `./plugins/goodreads` | Goodreads plugin and adapters |
| `./plugins/int` | Intuition Identifier plugin |
| `./plugins/letterboxd` | Letterboxd plugin and adapters |
| `./plugins/openlibrary` | Open Library plugin |
| `./plugins/places` | Places plugin and adapters |
| `./plugins/shopify` | Shopify plugin |
| `./plugins/steam` | Steam plugin |
| `./plugins/wikidata` | Wikidata plugin |
| `./artifact-types` | Shared artifact types |
| `./plugin-api` | Public plugin authoring API |
| `./outcome` | Promise outcome wrapper for classification |
| `./identifier-rung-projection` | Project admissible identifier rungs |
| `./url-hygiene` | URL normalization policy |
| `./ssrf` | Destination and transport policy helpers |
| `./ssrf-guard` | SSRF guard integration |
| `./provider-metrics-contract` | Provider observation contract |
| `./adapters/upstash` | Explicit HTTP cache adapter |

</details>

## Depends on and works with

Runtime package dependencies: [atom-enrichment](/docs/reference/packages/atom-enrichment), [atom-parser](/docs/reference/packages/atom-parser), [classifications](/docs/reference/packages/classifications), [iid](/docs/reference/packages/iid), [iid-ladder](/docs/reference/packages/iid-ladder), [iid-registry](/docs/reference/packages/iid-registry), [pipeline-runtime](/docs/reference/packages/pipeline-runtime), [predicates](/docs/reference/packages/predicates), [primitives](/docs/reference/packages/primitives), and [schema-org](/docs/reference/packages/schema-org). Peer dependencies: none. `zod` is an additional ordinary dependency in the package manifest.

Classification consumes enrichment helpers; enrichment does not depend on this engine. Your host owns credentials, persistent storage, cache selection, and request policy.

## Example

An explicit pair of local plugins produces a generic Thing for fixed text. An empty plugin set demonstrates the unmatched-text fallback; the invalid request demonstrates boundary failure without a provider call.

{/* example:start examples/v2/music-catalog/src/package-examples/classification.ts#local-classification */}
```ts
import {
  classifyOutcome,
  createClientEngine,
  createPlainTextPlugin,
  createTypeProfilesPlugin,
} from '@0xintuition/atom-classification';

const engine = createClientEngine({
  plugins: [createTypeProfilesPlugin(), createPlainTextPlugin()],
  now: () => new Date('2026-01-01T00:00:00.000Z'),
});
export const classified = await engine.classify({
  input: 'A synthetic catalog idea',
  mode: 'client-only',
  classificationSessionId: 'package-reference',
});
console.log(classified.resolved?.publishable[0]?.type);

// Unmatched text remains a candidate Thing, not a verified identity.
export const unmatched = await createClientEngine({ plugins: [] }).classify({
  input: 'Unmatched synthetic catalog label',
  mode: 'client-only',
  classificationSessionId: 'unmatched-fixture',
});
console.log(unmatched.resolved?.fallbackUsed);

export const invalidRequest = await classifyOutcome(engine, {
  input: '',
  mode: 'client-only',
  classificationSessionId: 'invalid-fixture',
});
console.log(invalidRequest.kind);
```
{/* example:end */}

Read `resolved.classifications` for canonical envelopes and `resolved.publishable` for the identity-safe projection. Identity fields are eligible by default, approved rich fields depend on source policy, and volatile fields are excluded. `resolved.atoms` is a compatibility projection. These are candidate payloads, not proof of an on-chain atom.

A completed response's `ok: true` does not promise full resolution: inspect `status` (`placeholder`, `partial`, or `complete`), optional `resolved`, and `resolverErrors`. Unmatched text falls back to a generic Thing with `resolved.fallbackUsed: true`; that candidate is not a verified entity identity. Invalid requests reject `classify`; `classifyOutcome` captures that rejection as an outcome. Cancellation and resolver deadlines are separate from a successful partial result.

External plugins implement `AtomClassificationPlugin` with a validated manifest, classifiers, and resolvers. Register emitted types, satisfy `dependsOn`, and explicitly set a local resolver's `executionMode: 'deterministic'` when it should run under client-only policy. An omitted mode defaults to server enrichment. Follow [Write a classification plugin](/docs/core/classification-plugin) for the complete contract and Core composition boundary.

## Related concepts

[Representation profiles](/docs/concepts/representation-profiles) separates entity identity from its serialized payload. [Classify and enrich atoms](/docs/build/classify-enrich) explains the handoff to enrichment.

## Source

[Package README](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/atom-classification/README.md), [canonical output contract](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/atom-classification/docs/canonical-output-contract.md), [plugin authoring](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/atom-classification/docs/plugin-authoring.md), and [engine implementation](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/atom-classification/src/engine.ts).
