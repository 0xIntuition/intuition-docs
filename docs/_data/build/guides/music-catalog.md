---
title: Build a music catalog
sidebar_label: Build a music catalog
slug: /build/guides/music-catalog
---

Build a small catalog that recognizes repeated imports of a recording, connects it to an artist, and keeps its display metadata editable. This example combines classification specifications, atom builders, and shared predicates. It runs entirely offline.

You will produce three atom records—the recording, artist, and predicate—and one triple connecting them. The objects in this tutorial are application data; a later step can persist or publish them.

## 1. Set up the project

Use Node 22+ in a new directory:

```sh
npm init -y
npm pkg set type=module
npm install @0xintuition/primitives@0.1.0-alpha.1 @0xintuition/classifications@0.1.0-alpha.1 viem@^2
```

`primitives` supplies atom and triple builders. `classifications` supplies the entity specifications. `viem` is a required peer dependency.

## 2. Model the catalog

The recording uses an ISRC, a strong identifier. The fictional artist uses a name-derived identity to demonstrate the fallback path. For real imports, prefer a supported strong identifier such as an ISNI or MusicBrainz identifier when you have one; two artists can share the same name.

Save this complete example as `catalog.mjs`:

```js
import assert from 'node:assert/strict';
import { getClassification } from '@0xintuition/classifications';
import { buildIidAnchor } from '@0xintuition/primitives/anchor';
import { getPredicateInfo } from '@0xintuition/primitives/predicate';
import { buildTriple } from '@0xintuition/primitives/triple';

function unwrap(result) {
  if (!result.success) throw new Error(result.errors.join('; '));
  return result.value;
}

const recordingSpec = getClassification('music-recording');
assert.ok(recordingSpec);

const recording = unwrap(
  buildIidAnchor('music-recording', { isrc: 'US-RC1-76-07839' }),
);
const artist = unwrap(
  buildIidAnchor('music-group', { name: 'Example Ensemble' }),
);
const predicate = getPredicateInfo('byArtist');
assert.ok(predicate);

const relationship = unwrap(
  buildTriple(recording.id, predicate.key, artist.id),
);
assert.equal(relationship.predicateId, predicate.id);

// A repeated import uses another spelling of the same ISRC.
const repeatedImport = unwrap(
  buildIidAnchor('music-recording', { isrc: 'USRC17607839' }),
);
const entities = new Map(
  [recording, artist, repeatedImport].map((atom) => [atom.id, atom]),
);
assert.equal(entities.size, 2);
assert.equal(repeatedImport.id, recording.id);

// Display values and attribution belong to the application record.
const presentation = new Map([
  [
    recording.id,
    { label: 'Example recording', type: recordingSpec.schema.type },
  ],
  [artist.id, { label: 'Example Ensemble', type: 'MusicGroup' }],
]);
const catalog = {
  atoms: [
    ...[...entities.values()].map(({ id, data }) => ({ id, data })),
    { id: predicate.id, data: predicate.atomData },
  ],
  claims: [
    {
      triple: relationship,
      source: 'local tutorial fixture',
    },
  ],
  presentation: Object.fromEntries(presentation),
};

// Refreshing a label leaves the atom bytes and relationship unchanged.
const originalId = recording.id;
const originalData = recording.data;
catalog.presentation[recording.id].label = 'Updated display title';
assert.equal(recording.id, originalId);
assert.equal(recording.data, originalData);
assert.equal(relationship.subjectId, recording.id);
assert.equal(relationship.objectId, artist.id);
assert.equal(catalog.atoms.length, 3);
assert.equal(catalog.claims.length, 1);

console.log(JSON.stringify(catalog, null, 2));
console.log('3 atoms, 1 relationship, 2 unique entities');
```

The artist relationship is fictional test data. Replace it with an attributed claim from your own source before using the catalog as real data.

## 3. Run and inspect the result

```sh
node catalog.mjs
```

The script prints the catalog and ends with:

```text
3 atoms, 1 relationship, 2 unique entities
```

Inspect the JSON to see how the layers fit:

- `atoms` contains the exact data to store or publish. The predicate is included because it is an atom too.
- `claims[0].triple` links the recording ID, the canonical `byArtist` predicate ID, and the artist ID. Its ID is deterministic from those three values.
- `claims[0].source` records where this example relationship came from. In an application, retain the source, author, and evidence appropriate to your claim.
- `presentation` is keyed by atom ID. Updating it changes what users see without changing the atom's identity.

The `Map` deduplicates identical IDs. It does not decide whether different identifiers refer to the same artist; that requires an [identity-resolution policy](../identity-resolution.md).

## 4. Add the next feature

**Create a form.** Use the recording's [Creation Profile](./creation-profiles.md) to render fields and suggest relationships. Keep temporary form values separate from accepted identity fields.

**Fetch artwork and other metadata.** [Process and enrich](./processing.md) the input, then map accepted fields into your presentation records. Preserve field provenance and handle partial provider results.

**Save or publish the graph.** For your own backend, follow [Core REST](./core-rest.md). For on-chain terms, use [SDK actions](./onchain.md). Create any missing subject, predicate, and object atoms before creating the triple. Retain their exact bytes and IDs across both destinations.

**Read shared records.** After publication and indexing, [query the hosted graph](./sdk-reads.md) by term ID. Local generation alone does not make these records available through that API.
