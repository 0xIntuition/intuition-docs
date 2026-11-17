---
title: Classify and enrich atoms
sidebar_label: Classify and enrich atoms
description: Separate parsing, classification, provider planning, execution, and field provenance with an offline fixture.
kind: how-to
reader: ["app", "plugin"]
packages: ["@0xintuition/atom-classification", "@0xintuition/atom-enrichment", "@0xintuition/iid-registry"]
---

<AppliesTo />

Interpret input, plan provider work, and preserve evidence without silently rewriting an atom's identity.

## Before you start

Use [installation](/docs/build/install) and these direct dependencies:

```sh
npm install --save-exact @0xintuition/atom-parser@0.1.0 @0xintuition/atom-classification@0.1.0 @0xintuition/atom-enrichment@0.1.0 @0xintuition/iid-registry@0.1.0 viem@2.31.4
```

The complete [processing source](https://github.com/0xIntuition/intuition-docs/blob/feature/docs-v2-overhaul/examples/v2/music-catalog/src/processing.ts) uses fixed synthetic input and an injected local provider fixture. It performs no provider request. Installing a provider, returning a plan, fetching an artifact, and accepting a field are separate decisions.

## Steps

### 1. Parse without remote inspection

`parseAtom` detects structure. With `remoteFetch: false`, URI inspection is disabled. Invalid IID-shaped input remains an IID parse result with `valid: false`; it must not silently become ordinary text. Bound external request bytes and collection sizes before package parsing, not only inside a schema validator.

### 2. Classify and plan locally

{/* example:start examples/v2/music-catalog/src/processing.ts#parse-classify-plan */}
```ts
import { parseAtom } from '@0xintuition/atom-parser';
import {
  createClientEngine,
  createPlainTextPlugin,
  createTypeProfilesPlugin,
} from '@0xintuition/atom-classification';
import {
  classificationForIid,
  identifierHintsForIid,
  providersForIid,
} from '@0xintuition/iid-registry';

const rawInput = 'int:mbid:recording:b1a9c0e9-d987-4042-ae91-78d6a3267d69';
// Apply transport byte/count limits before passing external input to parsers.
if (Buffer.byteLength(rawInput, 'utf8') > 4_096)
  throw new Error('Input too large');
const parsed = await parseAtom(rawInput, { remoteFetch: false });
if (parsed.kind !== 'iid' || !parsed.valid || !parsed.canonicalIid) {
  throw new Error('Expected a valid recording IID');
}
const iid = parsed.canonicalIid;
const classification = classificationForIid(iid);
const plan = providersForIid(iid);

const classifier = createClientEngine({
  plugins: [createTypeProfilesPlugin(), createPlainTextPlugin()],
});
const ambiguous = await classifier.classify({
  input: 'One More Time',
  mode: 'client-only',
  classificationSessionId: 'catalog-text',
});
console.log({
  classification,
  plan,
  nameOnly: ambiguous.resolved?.classifications,
});
```
{/* example:end */}

The synthetic typed recording IID maps to `music-recording`. `providersForIid` returns ordered capability names without fetching, credentials, or cache access. A valid bare `int:wd:Q42` has no inferred classification. A name such as “One More Time” is ambiguous: this explicit plain-text plugin set returns a generic `Thing`, not a verified recording match.

Classification engines return canonical envelopes in `resolved.classifications` and an identity-oriented projection in `resolved.publishable`. Runtime categories such as `song` are distinct from catalog slugs such as `music-recording`. For a production classification handoff, `toClassifiedAtomInput` from `@0xintuition/atom-enrichment/handoff` preserves accepted identity and hints, or returns `null` when the result is unusable. Inspect that outcome before enrichment.

### 3. Execute only selected capabilities

The full source defines `fixtureProvider`, a local adapter with one fixed synthetic recording response. It emits the registered `musicbrainz` artifact shape but marks its provider as `local-synthetic-fixture` and its source URL under `example.org`. It does not pretend that MusicBrainz verified the record. The registry plan is displayed separately; it does not select or run this fixture adapter automatically.

{/* example:start examples/v2/music-catalog/src/processing.ts#enrich-fixture */}
```ts
import {
  createEnrichmentEngine,
  type ClassifiedAtomInput,
} from '@0xintuition/atom-enrichment';
import { extractClassificationFields } from '@0xintuition/atom-enrichment/extraction';

// fixtureProvider is the local adapter defined in the full source.
// The registry's plan does not automatically install or execute providers.
const input: ClassifiedAtomInput = {
  atomType: 'song',
  jsonLd: { '@context': 'https://schema.org/', '@type': 'MusicRecording' },
  hints: { identifiers: identifierHintsForIid(iid) },
  source: {
    classificationEngine: 'docs-fixture',
    classifiedAt: '2026-01-01T00:00:00.000Z',
  },
};
const engine = createEnrichmentEngine({
  plugins: [fixtureProvider],
  now: () => '2026-01-01T00:00:00.000Z',
});
const enriched = await engine.enrich({
  runtime: 'server',
  input,
  concurrency: 1,
  timeoutMs: 1_000,
});
const fields = await extractClassificationFields({
  classification: 'music-recording',
  artifacts: enriched.artifacts,
  fetcher: async () => {
    throw new Error('Remote extraction disabled for this fixture');
  },
});
console.log({
  status: enriched.status,
  artifacts: enriched.artifacts,
  errors: enriched.errors,
  skipped: enriched.skipped,
  values: fields.values,
  provenance: fields.fields,
  missingRequired: fields.missingRequired,
});
```
{/* example:end */}

Use this region with the preceding region and the fixture definition in the full source. Real adapters need explicit runtime selection, configured credentials where required, bounded concurrency, cancellation, and a network policy. Custom transports must preserve the library's address validation and redirect restrictions. Do not expose provider secrets in a client bundle.

### 4. Retain provenance and partial outcomes

An artifact carries its provider, plugin, fetch time, and optional source URL. Field extraction is a separate operation that may make additional requests; the example injects a transport that rejects those requests. Preserve `fields`, `missingRequired`, and `droppedFields` alongside accepted values. Evidence from a provider is not independent verification of a claim.

This pinned extractor does not map the fixture's MusicBrainz artifact into recording fields: it returns empty values and reports missing `name`. That is a useful partial outcome, not permission to invent extracted fields. Keep the artifact and its provenance available for review. Updating display metadata does not require replacing the canonical bytes of an existing atom.

## Check the result

Run `node src/processing.ts` from the full source's `music-catalog` directory after installing `examples/v2`. The fixture emits one artifact with no engine errors, while an input with no matching identifier emits zero artifacts and a skipped-provider reason. Its final line is:

```text
Fixture enrichment: 1 artifact; unmatched input: 0 artifacts
```

## Troubleshooting

| Outcome | Response |
| --- | --- |
| Invalid parse | Correct input before retrying. |
| No classification or usable handoff | Retain diagnostics and request more precise identity evidence. |
| Empty provider plan | Keep the valid identity; no lookup capability is currently planned. |
| Partial result or missing fields | Preserve useful artifacts, errors, and provenance without promising completion. |
| Timeout, unavailable credential, or incompatible runtime | Cancel bounded work and configure or disable the affected provider. |

## Related

[Build a music catalog](/docs/examples/music-catalog), [classification plugins](/docs/core/classification-plugin), [atom enrichment](/docs/reference/packages/atom-enrichment), and [Query a Core node](/docs/build/query-core). Processing alone does not persist graph records.

Sources: [canonical classification output](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/atom-classification/docs/canonical-output-contract.md), [IID registry planning](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/iid-registry/README.md), [enrichment engine](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/atom-enrichment/src/engine.ts), and [field extraction](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/atom-enrichment/src/extraction/extract.ts).
