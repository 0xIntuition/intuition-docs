---
title: Write an enrichment plugin
sidebar_label: Write an enrichment plugin
description: Implement and test a provider with a fixture, then connect it to the enrichment preset in a Core fork.
kind: how-to
reader: ["plugin"]
packages: ["@0xintuition/atom-enrichment"]
---

<AppliesTo />

Turn a classified album URL into a title with a traceable source, test the plugin offline, and add it to the enrichment preset in your Core fork.

## Before you start

Use Node.js 22.21.0 and a checkout of the documentation repository containing the example. From its root, install the example dependencies with `npm ci --ignore-scripts --prefix examples/v2`. The fixture supplies a local read function for one synthetic catalog page. You can finish the offline steps before setting up a node. [Complete plugin and fixture source](https://github.com/0xIntuition/intuition-docs/blob/feeb3f12520ad96a61aff43d1c1d9420d799a8a6/examples/v2/music-catalog/src/enrichment-plugin.ts)

An enrichment request already has a classified atom. Here the input includes a `MusicAlbum` JSON-LD object, classification source and timestamp, and the album URL in `input.hints.url`. The expected output is an `opengraph` artifact containing the title **Night Train**, the catalog provider, the page URL and a fetch timestamp. [Classified input and artifact schemas](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/atom-enrichment/src/types.ts)

## Steps

### 1. Match the source and validate its response

Give the plugin a unique ID, version, runtime and at least one artifact type. Let `supports` match the catalog page without fetching it. In `enrich`, check the target again, pass the cancellation signal to the read function and validate the unknown response. Copy the validated title into the output. This keeps other response fields, such as private catalog notes, out of the artifact.

{/* example:start examples/v2/music-catalog/src/enrichment-plugin.ts#catalog-page-plugin */}
```ts
import {
  defineEnrichmentPlugin,
  type EnrichmentPlugin,
} from '@0xintuition/atom-enrichment';
import { opengraphDataSchema } from '@0xintuition/atom-enrichment/provider-data';

type ReadPage = (url: string, signal: AbortSignal) => Promise<unknown>;
const albumPage = 'https://catalog.example/albums/night-train';

export function createCatalogPlugin(readPage: ReadPage): EnrichmentPlugin {
  return defineEnrichmentPlugin({
    id: 'catalog-page',
    version: '1.0.0',
    runtime: 'server',
    artifactTypes: ['opengraph'],
    priority: 40,
    TTL: 3_600,
    supports: (request) => request.input.hints?.url === albumPage,
    async enrich(request, ctx) {
      const url = request.input.hints?.url;
      if (url !== albumPage) return [];
      const payload = await readPage(url, ctx.signal);
      const parsed = opengraphDataSchema.safeParse(payload);
      if (!parsed.success || !parsed.data.title?.trim()) {
        throw new Error('Catalog page has no valid title.');
      }
      return [
        {
          artifact_type: 'opengraph',
          data: { title: parsed.data.title.trim() },
          meta: {
            pluginId: 'catalog-page',
            provider: 'music-catalog',
            sourceUrl: url,
            fetchedAt: ctx.now(),
          },
        },
      ];
    },
  });
}
```
{/* example:end */}

The engine already knows the `opengraph` data schema. To introduce an artifact type, register its schema with the engine's classification registry as well as declaring it on the plugin. Lower priority numbers run earlier. A positive `TTL` gives the cache lifetime in seconds when the engine has a cache. [Plugin contract](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/atom-enrichment/src/plugins.ts) · [Engine validation and caching](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/atom-enrichment/src/engine.ts)

The URL in the artifact records the page the caller supplied. For a direct URL or an external-ID lookup, preserve the provider, input and resulting source URL and omit `identityStrength`. For a title search, set `meta.identityStrength` to `title` and return descriptive fields. A title hit can supply artwork or a description without establishing that two recordings are the same. The strict metadata schema accepts only the optional `title` marker. [Artifact metadata](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/atom-enrichment/src/types.ts) · [Field extraction](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/atom-enrichment/src/extraction/extract.ts)

### 2. Test the plugin on its own

Pass the plugin to `createEnrichmentEngine({ plugins: [plugin] })`. The fixture supplies a clock and a read function that returns a title plus an extra private field. It checks the complete resulting artifact, then runs separate cases for an unrelated URL, malformed data, an upstream outage and an interrupted read.

```sh
node examples/v2/music-catalog/src/enrichment-plugin.ts
```

For an optional credential, decide explicitly whether a missing key makes the provider inapplicable or permits a smaller result. Return an empty array for an expected lookup with no record. Report unexpected upstream failures through the engine so other providers can finish. Keep raw payloads and credentials out of diagnostic text. The built-in npm provider shows how to inject a transport, parse a provider response and retain the primary metadata when an optional secondary lookup fails. [npm provider implementation](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/atom-enrichment/src/plugins/providers/npm/index.ts)

### 3. Add the plugin to a preset

The standalone runtime accepts `pluginOverrides.enrichment` keyed by preset name. An array or factory replaces the entire selected preset. Start with its configured built-ins, then add the catalog plugin. In this example, the default preset keeps the providers configured from the host's environment.

{/* example:start examples/v2/music-catalog/src/enrichment-plugin.ts#catalog-preset */}
```ts
import {
  createAtomServicesProcessingRuntime,
  createEnrichmentPresetFactories,
  type AtomServicesProcessingRuntimeOptions,
} from '@0xintuition/atom-runtime';

export function createCatalogRuntime(
  options: AtomServicesProcessingRuntimeOptions,
  plugin: EnrichmentPlugin,
) {
  const presets = createEnrichmentPresetFactories(options.env);
  return createAtomServicesProcessingRuntime({
    ...options,
    pluginOverrides: {
      ...options.pluginOverrides,
      enrichment: {
        ...options.pluginOverrides?.enrichment,
        default: () => [...presets.default(), plugin],
      },
    },
  });
}
```
{/* example:end */}

The helper checks the full plugin list and runs a request filtered to `catalog-page` so the fixture exercises only that source. Configure the override during construction. The shared runtime locks the registry on its first `resolvePlugins` or `enrich` call. [Runtime override and registry implementation](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/atom-runtime/src/runtime.ts)

### 4. Wire the preset into your Core fork

Start from the pinned source checkout described in [Query a Core node](/docs/build/query-core). In your fork, put the plugin and composition functions in a module accessible to `services/atom-services/src/service/runtime.ts`. For an initial deployment check, use the same fixed catalog reader. A production reader should return the provider payload and honor the supplied signal.

In `createCoreProcessingRuntime`, replace the call to `createAtomServicesProcessingRuntime(options)` with `createCatalogRuntime(options, createCatalogPlugin(readPage))`, using your reader. Preserve the wrapper's existing warning handling. Core's `ProcessingRuntimeOptions` exposes cache, preset and environment settings. The fork supplies the plugin by changing this constructor call. Adding a file or passing a plugin ID in an HTTP request alone cannot install a provider. The HTTP service and enrichment worker both reach this shared wrapper. [Core runtime wrapper](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/services/atom-services/src/service/runtime.ts) · [HTTP service construction](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/services/atom-services/src/service/dependencies.ts) · [Enrichment worker construction](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/services/workers/src/kg/atom-enrichment/index.ts)

Rebuild the consuming services from your fork. From the Core repository root, run:

```sh
docker compose -f docker-compose.yml up -d --build atom-services workers-enrichment
```

## Check the result

The offline fixture exits successfully after printing six observations:

```text
match: success, Night Train
unrelated: not_applicable, no extra read
invalid payload: failed, no artifact
upstream: failed, retryable HTTP 503
cancellation: transport observed abort, no artifact
preset: built-ins retained, catalog-page produced the requested artifact
```

To check the rebuilt service with the fixed reader, keep the service's configured default preset set to `default` for this example. Send this JSON to `POST /v1/enrich` on your atom service (local default port 4010). Set `Content-Type: application/json` and include the service bearer token if configured.

```json
{
  "input": {
    "atomType": "thing",
    "jsonLd": { "@type": "MusicAlbum" },
    "source": { "classificationEngine": "catalog-fixture", "classifiedAt": "2026-01-01T00:00:00Z" },
    "hints": { "url": "https://catalog.example/albums/night-train" }
  },
  "enrichment": { "preset": "default", "plugins": ["catalog-page"] }
}
```

Look for `status: "success"`, `artifacts[0].data.title` equal to `Night Train`, and `artifacts[0].meta.pluginId` equal to `catalog-page`. The service clock supplies its own timestamp. The fixture tests package composition locally. This request tests the rebuilt HTTP service. For indexed worker results, inspect the atom's artifacts on your own node. [Atom services API](/docs/reference/atom-services-api) · [Query Core](/docs/build/query-core)

## Troubleshooting

- **No artifact for the catalog URL.** Check the running service's preset list at `GET /ready`, then check the request's preset, plugin filter and exact `input.hints.url`. A registered plugin whose predicate returns false appears in `skipped` with `not_applicable`.
- **HTTP 400 on enrich.** Supply a classified object in `input`. Use `POST /v1/process` with `rawInput` when the service should classify first.
- **The worker omits an artifact the HTTP service returned.** The worker also applies processing scope, allowed artifact types and, for eligible identifiers, its provider plan. Verify those settings and the worker image built from your fork. [Worker execution and completion](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/services/workers/src/kg/atom-enrichment/index.ts)

## Related

- [Enrichment providers](/docs/core/enrichment-providers)
- [Write a classification plugin](/docs/core/classification-plugin)
- [Classify and enrich input](/docs/build/classify-enrich)
