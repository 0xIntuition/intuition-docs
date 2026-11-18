---
title: "Predicates"
sidebar_label: "Predicates"
description: "Distinguish a relationship’s registry key, label, serialized predicate data and deterministic atom ID before building a triple."
kind: concept
reader: ["app", "agent"]
packages: ["@0xintuition/predicates"]
depends_on: ["triples", "classifications"]
---

<AppliesTo />

A predicate names the relationship between a triple’s subject and object. In Intuition it is itself an atom. The predicate registry connects a stable lookup key and a human-readable label to the canonical atom data and its deterministic ID. A triple uses that ID in the middle position.

**Builds on:** [Triples](/docs/concepts/triples), [Classifications](/docs/concepts/classifications).

**Implemented by:** [predicates](/docs/reference/packages/predicates).

## How it works

For a recording credit, the registry key is `byArtist` and the label is “by artist”. The predicate’s canonical data is a serialized schema.org `DefinedTerm` containing `@context`, `@type`, `name` and `description` in a fixed order. The exported predicate ID is the atom ID of those serialized bytes. [Predicate specification](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/predicates/src/generated/specs/byArtist.ts) · [Predicate serialization](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/ids/src/predicate-id.ts) · [Published subpath source](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/predicates/src/standalone/byArtist.ts)

A UI can translate a display label and still use the registry key to select the same predicate. Serializing that translation into new atom data creates a different predicate ID.

## Example

This local fixture computes the ordered claim “recording → by artist → artist”. The output includes the key, label, exact atom data and both IDs so you can inspect what goes into the claim.

{/* example:start examples/v2/predicate-picker/src/package-examples.ts#predicate-identity */}

```ts
import { calculateAtomId, calculateTripleId } from '@0xintuition/ids';
import {
  byArtist,
  byArtistAtomData,
  byArtistId,
  byArtistSpec,
} from '@0xintuition/predicates/byArtist';

// Synthetic local fixture atoms; these strings claim no external identity.
const recordingId = calculateAtomId('example:recording');
const artistId = calculateAtomId('example:artist');
const byArtistTripleId = calculateTripleId(recordingId, byArtistId, artistId);
console.log({
  key: byArtistSpec.key,
  label: byArtist.name,
  data: byArtistAtomData,
  predicateId: byArtistId,
  tripleId: byArtistTripleId,
});
```

{/* example:end */}

For the pinned predicate, `byArtistId` is `0x13d5d4ad6ae3a4e1b5043141b6ce4633c2df4646eaefc9e45eba899c45ce235b`. Switching the two endpoint IDs changes the claim. [Recording relationship metadata](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/classifications/src/generated/creation/music-recording.ts)

## Common mistakes

- Hashing the string “by artist” or `byArtist` to construct the predicate ID. Use the exported ID or compute it from the canonical predicate data.
- Reversing subject and object because the UI starts with the artist. The recording is the subject of `byArtist`.

## Next

Use [sameAs and identity linking](/docs/concepts/same-as) to see how another registered predicate connects two representations.
