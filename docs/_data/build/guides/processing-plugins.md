---
title: 'Extend classification and provider enrichment'
slug: /build/guides/processing-plugins
sidebar_position: 5
---

Build extensions against the public package APIs so your application can share the processing engine without depending on Core internals. Keep classification rules, provider acquisition, and graph persistence separate.

## Add a local classifier and resolver

Install `@0xintuition/atom-classification@0.1.0-alpha.0`. This complete example recognizes a deliberate `idea:` prefix and emits a canonical classification envelope. It makes no network requests.

```ts
import {
  createClientEngine,
  createTypeProfilesPlugin,
  type AtomClassificationPlugin,
} from '@0xintuition/atom-classification';

const ideaPlugin: AtomClassificationPlugin = {
  manifest: {
    id: 'example-idea',
    version: '1.0.0',
    engineRange: '^0.1.0',
    runtime: 'universal',
    priority: 30,
    capabilities: ['classifier:text:idea', 'resolver:lexical:defined-term'],
    permissions: [],
    dependsOn: ['type-profiles'],
    provides: ['example:idea'],
  },
  classifiers: [
    {
      id: 'idea-classifier',
      classify(input) {
        const name = input.startsWith('idea:') ? input.slice(5).trim() : '';
        return name
          ? {
              type: 'text',
              domain: 'lexical',
              subtype: 'idea',
              confidence: 1,
              meta: { name },
            }
          : null;
      },
    },
  ],
  resolvers: [
    {
      id: 'idea-resolver',
      canResolve: (classification) =>
        classification.domain === 'lexical' &&
        classification.subtype === 'idea',
      resolve: ({ request }) => ({
        classifications: [
          {
            type: 'DefinedTerm',
            data: {
              '@context': 'https://schema.org/',
              '@type': 'DefinedTerm',
              name: request.input.slice(5).trim(),
            },
          },
        ],
      }),
    },
  ],
};
const engine = createClientEngine({
  plugins: [createTypeProfilesPlugin(), ideaPlugin],
});
const result = await engine.classify({
  input: 'idea: semantic grounding',
  mode: 'client-only',
  classificationSessionId: 'plugin-example',
});
console.log(result.resolved?.publishable);
```

The engine supplies missing provider/plugin/timestamp metadata. A classification envelope does not mint a registered IID, hash an atom, or write to Core. Use the shared identity builders for accepted identities and your persistence layer for accepted results.

Classifiers should match deterministically. Resolvers should emit canonical `classifications`; legacy `atoms` are still accepted for compatibility, and the engine checks parity when both are supplied. Register emitted types, declare dependencies and runtime capabilities, and keep network permissions explicit. AI-capable plugins require a server runtime and AI permission.

Read the pinned [authoring contract](https://github.com/0xIntuition/packages/blob/dde4fdf5774447b84cd0b820593fb0db7366e58d/packages/atom-classification/docs/plugin-authoring.md), [publishable boundary](https://github.com/0xIntuition/packages/blob/dde4fdf5774447b84cd0b820593fb0db7366e58d/packages/atom-classification/docs/publishable-boundary.md), and [type collision policy](https://github.com/0xIntuition/packages/blob/dde4fdf5774447b84cd0b820593fb0db7366e58d/packages/atom-classification/docs/type-registration-and-collision-policy.md). The [external example](https://github.com/0xIntuition/packages/tree/dde4fdf5774447b84cd0b820593fb0db7366e58d/examples/atom-classification-plugin) is private example source, not an npm package.

## Add an enrichment provider

Use `@0xintuition/atom-enrichment/plugin-api` for the public plugin contract. A provider declares its ID, version, runtime, and artifact types, implements `supports(request)`, and returns artifacts from `enrich(request, context)`. Register each artifact type's schema. Honor `context.signal` and inject provider transports through the provider factory/options rather than starting unbounded work.

Artifacts carry `artifact_type`, `data`, and `meta`, including plugin ID, provider, fetch time, and optional source URL, confidence, and cache provenance. The provider artifact registry validates payloads. The canonical `classifications` package still owns entity fields and requirements.

### Available provider families

| Family                   | Examples                                                                         | Contract details                                                                                                                                                                                                                                                                                   |
| ------------------------ | -------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Page metadata            | OpenGraph, oEmbed, microdata, favicon, screenshot                                | [Page and provider payload index](https://github.com/0xIntuition/packages/blob/dde4fdf5774447b84cd0b820593fb0db7366e58d/packages/atom-enrichment/docs/README.md)                                                                                                                                   |
| Music and media          | Spotify, Apple Music, MusicBrainz, TMDB, YouTube, Vimeo                          | [Spotify](https://github.com/0xIntuition/packages/blob/dde4fdf5774447b84cd0b820593fb0db7366e58d/packages/atom-enrichment/docs/spotify/index.md), [TMDB](https://github.com/0xIntuition/packages/blob/dde4fdf5774447b84cd0b820593fb0db7366e58d/packages/atom-enrichment/docs/tmdb/index.md)         |
| Knowledge and research   | Wikidata, Wikipedia, ISBN, arXiv, Crossref, Pubmed                               | [Wikidata](https://github.com/0xIntuition/packages/blob/dde4fdf5774447b84cd0b820593fb0db7366e58d/packages/atom-enrichment/docs/wikidata/index.md), [ISBN](https://github.com/0xIntuition/packages/blob/dde4fdf5774447b84cd0b820593fb0db7366e58d/packages/atom-enrichment/docs/isbn/index.md)       |
| Software and crypto      | GitHub, npm, ENS, Etherscan, CoinGecko, NFT metadata                             | [GitHub](https://github.com/0xIntuition/packages/blob/dde4fdf5774447b84cd0b820593fb0db7366e58d/packages/atom-enrichment/docs/github/index.md), [Etherscan](https://github.com/0xIntuition/packages/blob/dde4fdf5774447b84cd0b820593fb0db7366e58d/packages/atom-enrichment/docs/etherscan/index.md) |
| Business, places, social | Company profile, Crunchbase, product listing, geocode, places, X profile, Reddit | [Complete provider contracts](https://github.com/0xIntuition/packages/blob/dde4fdf5774447b84cd0b820593fb0db7366e58d/packages/atom-enrichment/docs/README.md)                                                                                                                                       |
| Derived metadata         | AI summary, AI entities, color palette                                           | [AI summary](https://github.com/0xIntuition/packages/blob/dde4fdf5774447b84cd0b820593fb0db7366e58d/packages/atom-enrichment/docs/ai-summary/index.md)                                                                                                                                              |

Provider names describe available adapters, not guaranteed access. Check credentials, upstream terms, supported runtime, and capability before adding a provider to an engine.

## Verify extensions with fixtures

Use `validatePluginManifest` and the classification `/testing` helpers to exercise dependency failures, runtime restrictions, deterministic output, canonical/legacy parity, and cancellation. Inject clocks and fixtures where needed so network timing does not define correctness.

For enrichment, `runPluginConformanceSuite(plugin, fixtures, registry)` from `@0xintuition/atom-enrichment/testing` validates metadata, declared artifact schemas, support decisions, and emitted artifact types. Fixtures contain a name, request, `expectedSupports`, and optional `expectedClassifications`. This helper uses `node:test` and `node:assert/strict`; keep it in Node/Bun tests, outside browser bundles. Add provider fixtures for success, missing credentials, malformed payloads, rate limits, timeouts, and partial results.

After testing, add the plugin to your explicit engine or pass it through `atom-runtime` plugin overrides at construction. Keep scheduling, retry budgets, secrets, and storage in the host application.
