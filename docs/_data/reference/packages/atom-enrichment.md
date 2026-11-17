---
title: '@0xintuition/atom-enrichment'
sidebar_label: 'Atom enrichment'
description: 'Execute selected providers, preserve partial artifacts and provenance, and extract classification fields.'
kind: reference
reader: ["app", "plugin"]
packages: ["@0xintuition/atom-enrichment"]
---

<AppliesTo />

## What it's for

Run provider plugins against classified input and collect typed artifacts with provenance. Extraction can turn those artifacts into classification fields; neither operation changes an existing atom's identity bytes.

## When to use it

Use it when you need provider metadata, a selected provider plan, or normalized fields with missing-field diagnostics. Use the IID registry to plan providers before execution. A plan is not a completed lookup, and an artifact is not evidence that every required classification field was extracted.

## Install

```sh
npm install @0xintuition/atom-enrichment@0.1.0
```

Use typed ESM on Node 20+ or Bun. Real providers may require HTTP access, credentials, and server-compatible execution; inject those deliberately.

## Entry points

<details>
<summary>All public modules</summary>

| Subpath | Purpose |
| --- | --- |
| `.` | Engine, providers, registries, presets, handoff, and public types |
| `./types` | Inputs, artifacts, results, and request schemas |
| `./handoff` | Adapt classification results into enrichment input |
| `./provider-data` | Normalized provider payload types |
| `./plugins` | Plugin manifests, contracts, and validation |
| `./providers` | Provider factories and request helpers |
| `./presets` | Provider bundles and explicit environment mapping |
| `./engine` | Enrichment execution engine |
| `./plugin-registry` | Register and resolve plugins |
| `./cache` | Cache contracts and memory or HTTP adapters |
| `./testing` | Deterministic fixtures and plugin conformance helpers |
| `./classifications` | Provider artifact classification registry |
| `./classifications/defaults` | Built-in artifact definitions |
| `./classifications/registry` | Artifact registration and validation |
| `./classifications/schemas` | Artifact payload schemas |
| `./provider-external-data` | External provider response schemas |
| `./provider-plan` | Match desired providers against installed capabilities |
| `./slug-aliases` | Canonicalize provider slug aliases |
| `./extraction` | Extract normalized classification fields and provenance |
| `./data-resolved-schema` | Normalized resolved-data boundary |
| `./spotify-client` | Shared Spotify client |
| `./tmdb-request-observer` | Observe TMDB requests |
| `./provider-fetch` | Provider transport helpers |
| `./plugin-api` | Public plugin authoring API |
| `./outcome` | Promise outcome wrapper for enrichment |
| `./adapters/upstash` | Explicit HTTP cache adapter |
| `./ssrf` | Pinned transport and destination policy helpers |
| `./identifier-rung-projection` | Project admissible identifier rungs |
| `./url-hygiene` | URL normalization policy |

</details>

## Depends on and works with

Runtime package dependencies: [classifications](/docs/reference/packages/classifications), [iid](/docs/reference/packages/iid), [iid-ladder](/docs/reference/packages/iid-ladder), [iid-registry](/docs/reference/packages/iid-registry), [pipeline-runtime](/docs/reference/packages/pipeline-runtime), [protocol](/docs/reference/packages/protocol), and [schema-org](/docs/reference/packages/schema-org). Peer dependencies: none. `zod` is an additional ordinary dependency in the package manifest.

Canonical entity requirements belong to classifications. This package's artifact registry validates provider payloads. `toClassifiedAtomInput` returns usable input or `null`; handle that boundary before calling `enrich`. `createIdentifierProviderPlan` records scheduled, unavailable, and unsupported providers instead of silently treating a missing plugin as completed work.

## Example

These two synthetic plugins exercise the real engine without network access. One returns a valid Open Graph artifact; the other rejects. The example preserves the successful artifact alongside the failure.

{/* example:start examples/v2/music-catalog/src/package-examples/enrichment.ts#fixture-enrichment */}
```ts
import {
  createEnrichmentEngine,
  type EnrichmentPlugin,
} from '@0xintuition/atom-enrichment';

// Synthetic fixtures: no HTTP provider, credentials, or fetched page.
const fixture: EnrichmentPlugin = {
  id: 'catalog-fixture',
  version: '1.0.0',
  runtime: 'universal',
  artifactTypes: ['opengraph'],
  supports: (request) => request.input.atomType === 'thing',
  enrich: async (_request, { now }) => [
    {
      artifact_type: 'opengraph',
      data: { title: 'Synthetic catalog' },
      meta: {
        pluginId: 'catalog-fixture',
        provider: 'offline-fixture',
        fetchedAt: now(),
      },
    },
  ],
};
const unavailable: EnrichmentPlugin = {
  ...fixture,
  id: 'unavailable-fixture',
  enrich: async () => {
    throw new Error('Fixture provider unavailable');
  },
};

const engine = createEnrichmentEngine({
  plugins: [fixture, unavailable],
  now: () => '2026-01-01T00:00:00.000Z',
});
export const enriched = await engine.enrich({
  runtime: 'server',
  input: {
    atomType: 'thing',
    jsonLd: { '@context': 'https://schema.org/', '@type': 'Thing' },
    source: {
      classificationEngine: 'offline-fixture',
      classifiedAt: '2026-01-01T00:00:00.000Z',
    },
  },
});
console.log(enriched.status, enriched.artifacts.length, enriched.errors.length);
```
{/* example:end */}

The result is `partial` with one artifact and one error. Inspect `status`, `artifacts`, `errors`, `skipped`, and `timings`; do not discard useful artifacts because a provider failed. Invalid request schemas can still reject before provider execution. Runtime mismatches and unsupported inputs can produce skipped providers.

Preserve each artifact's `meta.pluginId`, `provider`, `fetchedAt`, and optional `sourceUrl`. Here the provider is explicitly an offline fixture, not a scraped page. For real providers, select a small preset and supply approved transports, credentials, timeouts, and cache policy. A keyless service can still make network calls. Spotify's URL-derived fallback, for example, is distinct from a credentialed Web API artifact.

`extractClassificationFields` reports values, provenance, missing required fields, and dropped-field reasons; it may perform additional lookups. The pinned MusicBrainz artifact does not automatically supply extracted music-recording fields. The [processing guide](/docs/build/classify-enrich) demonstrates that partial boundary with a fixed fixture. Your application owns retries, queues, persistence, and access control.

## Related concepts

- [Enrichment](/docs/concepts/enrichment)

See also [Classify and enrich atoms](/docs/build/classify-enrich).

## Source

[Package README](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/atom-enrichment/README.md), [provider payload documentation](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/atom-enrichment/docs/README.md), [plugin contract](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/atom-enrichment/src/plugins.ts), and [partial-result tests](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/atom-enrichment/__tests__/engine.integration.test.ts).
