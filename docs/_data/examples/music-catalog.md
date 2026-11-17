---
title: Build a music catalog
sidebar_label: Build a music catalog
description: Model synthetic recordings, performers, and albums with explicit identities, predicates, and directed claims.
kind: tutorial
reader: ["app"]
packages: ["@0xintuition/primitives", "@0xintuition/classifications", "@0xintuition/iid", "@0xintuition/iid-registry", "@0xintuition/predicates"]
---

<AppliesTo />

**Time:** 15 minutes · **Steps:** 4

## What you'll build

Build three local entity anchors and two directed claims: a recording **byArtist** a performing identity, and a recording **inAlbum** an album release-group. Inspect their exact bytes, IIDs, profiles, and atom IDs before storing anything.

“One More Time”, “Daft Punk”, “Discovery”, and the accompanying identifiers are **synthetic test fixtures** adapted from package tests, not verified real-world records. The separate golden ISRC quickstart does not identify this synthetic recording. A recording is not its composition or remix, a performing identity is not necessarily a legal person, and a release-group is not one specific release edition.

## Before you start

Use Node 22.18 or newer. No wallet, RPC, API key, or running Core node is needed for the offline catalog. See [installation](/docs/build/install) for ESM and peer setup.

## Steps

### 1. Set up the project

```sh
mkdir music-catalog
cd music-catalog
npm init -y
npm pkg set type=module
npm install --save-exact @0xintuition/primitives@0.1.0 @0xintuition/ids@0.1.0 @0xintuition/iid@0.1.0 @0xintuition/iid-registry@0.1.0 viem@2.31.4
```

### 2. Choose representations and construct explicit edges

Save the complete example as `catalog.ts`:

{/* example:start examples/v2/music-catalog/src/catalog.ts#catalog */}
```ts
import assert from 'node:assert/strict';
import { calculateAtomId } from '@0xintuition/ids';
import { inspectIntuitionId } from '@0xintuition/iid';
import { classificationForIid } from '@0xintuition/iid-registry';
import { buildIidAnchor } from '@0xintuition/primitives/anchor';
import { getPredicateInfo } from '@0xintuition/primitives/predicate';
import { buildTriple } from '@0xintuition/primitives/triple';
import type { BuildResult } from '@0xintuition/primitives';

function unwrap<T>(result: BuildResult<T>): T {
  if (!result.success) throw new Error(result.errors.join('; '));
  return result.value;
}

// Synthetic test identifiers, not verified MusicBrainz records.
const recordingValues = {
  name: 'One More Time',
  sameAs: [
    'https://musicbrainz.org/recording/b1a9c0e9-d987-4042-ae91-78d6a3267d69',
  ],
};
const recording = unwrap(buildIidAnchor('music-recording', recordingValues));
const artist = unwrap(buildIidAnchor('music-group', { name: 'Daft Punk' }));
const album = unwrap(
  buildIidAnchor('music-album', {
    name: 'Discovery',
    sameAs: [
      'https://musicbrainz.org/release-group/41b3f6ea-f7b6-3a6c-9a0a-3f8d6e2a1b55',
    ],
  }),
);
const byArtist = getPredicateInfo('byArtist');
const inAlbum = getPredicateInfo('inAlbum');
assert.ok(byArtist && inAlbum);

const claims = [
  unwrap(buildTriple(recording.id, byArtist.key, artist.id)),
  unwrap(buildTriple(recording.id, inAlbum.key, album.id)),
];
assert.equal(claims[0].predicateId, byArtist.id);
assert.equal(calculateAtomId(byArtist.atomData), byArtist.id);
assert.notEqual(
  unwrap(buildTriple(artist.id, byArtist.key, recording.id)).id,
  claims[0].id,
);

// Companion context travels alongside the atom; it is not atom data.
const withContext = unwrap(
  buildIidAnchor('music-recording', recordingValues, {
    contextUris: ['https://example.org/catalog/recording.json'],
  }),
);
assert.equal(withContext.id, recording.id);
assert.equal(withContext.data, recording.data);
const changedJson = artist.data.replace(
  'https://schema.org/',
  'https://schema.org',
);
assert.notEqual(calculateAtomId(changedJson), artist.id);

const repeated = unwrap(buildIidAnchor('music-recording', recordingValues));
assert.equal(repeated.id, recording.id);
const nameOnly = unwrap(
  buildIidAnchor('music-recording', { name: 'One More Time' }),
);
assert.notEqual(nameOnly.id, recording.id);
assert.equal(nameOnly.profile, 'p1');
assert.equal(inspectIntuitionId(recording.iid!).valid, true);
assert.equal(classificationForIid(recording.iid!)?.slug, 'music-recording');
assert.equal(classificationForIid('int:wd:Q42'), undefined);

const catalog = {
  synthetic: true,
  entities: [recording, artist, album].map(({ data, iid, profile, id }) => ({
    data,
    iid,
    profile,
    id,
  })),
  predicates: [byArtist, inAlbum].map(({ key, atomData, id }) => ({
    key,
    atomData,
    id,
  })),
  claims: claims.map((triple) => ({
    triple,
    source: 'local synthetic fixture',
  })),
};
console.log(JSON.stringify(catalog, null, 2));
console.log('3 entities, 2 predicate atoms, 2 directed claims');
console.log(
  `Profiles: ${catalog.entities.map((entity) => entity.profile).join(', ')}`,
);
console.log(
  'Context unchanged; reversed edge differs; bare Wikidata type unknown',
);
```
{/* example:end */}

The recording and release-group use typed MusicBrainz fixtures and select `p0`, whose data is the bare IID. The artist uses a name-derived `p1` envelope. Its name is ambiguous; deterministic serialization does not establish unique real-world identity. The script's repeated recording import has the same bytes and ID, while the name-only recording uses a different representation and ID.

A predicate key such as `byArtist` selects a registry entry. That entry supplies canonical serialized atom data and its deterministic ID; it is not merely a label to hash. Both predicate atoms belong in the graph. `buildTriple` uses subject, predicate, and object in order. Reversing those roles produces a different claim, as the assertion demonstrates.

### 3. Inspect identity and context boundaries

The printed `entities` array contains exact `data`, `iid`, `profile`, and atom `id` values. The IID describes the selected identifier; the atom ID is derived from the serialized representation's bytes. `predicates` exposes each key, serialized data, and ID. `claims` retains the local fixture attribution.

The code proves that companion `contextUris` leave the data and atom ID unchanged. In contrast, changing JSON-LD `@context` inside the artist's serialized atom changes its bytes and ID. Do not confuse those two kinds of context. Name or label edits in a separate application presentation record need not rewrite existing atom data.

### 4. Plan the next boundary explicitly

Use [creation profiles](/docs/build/creation-profiles) to inspect fields and allowed relationship targets. A collected `byArtist` string is not the edge; this example creates the edge explicitly.

Follow [classify and enrich](/docs/build/classify-enrich) for separate parse, classify, provider-plan, fixture-execution, and provenance steps. A name-only input can remain a generic `Thing`; a valid IID can have no mapped type or available provider. Neither classification nor an enrichment artifact proves a real-world match.

To read shared records, [query your Core node](/docs/build/query-core). Choose whether to insert these exact records off-chain or create missing terms on-chain and wait for indexing. Local construction does not persist atoms. Preserve subject, predicate, and object data and verify that the required terms exist before writing triples.

## Run it

```sh
node catalog.ts
```

The script prints the complete catalog JSON and then these measured summary lines:

```text
3 entities, 2 predicate atoms, 2 directed claims
Profiles: p0, p1, p0
Context unchanged; reversed edge differs; bare Wikidata type unknown
```

Assertions check deduplication, profile selection, predicate identity, triple direction, context invariance, and an unmapped classification. These are local checks, not provider or chain verification.

## Full source

[Music catalog source project](https://github.com/0xIntuition/intuition-docs/tree/feature/docs-v2-overhaul/examples/v2/music-catalog), including processing and plugin helpers. The catalog fixture is grounded in [pinned anchor tests](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/primitives/src/__tests__/anchor-parity.test.ts) and the [package lifecycle example](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/examples/hackathon-quickstart/src/package-lifecycle.ts).

## Next steps

Explore [representation profiles](/docs/concepts/representation-profiles), [predicate helpers](/docs/reference/packages/predicates), [action envelopes](/docs/build/action-plans), and [Core reads](/docs/build/query-core).
