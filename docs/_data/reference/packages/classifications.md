---
title: "@0xintuition/classifications"
sidebar_label: "Classifications"
description: "Use entity specifications, Creation Profiles, identity ladders, and validated descriptive atom data."
kind: reference
reader: ["app", "agent"]
packages: ["@0xintuition/classifications"]
---

<AppliesTo />

## What it's for

Canonical classification specifications define entity types, recommended fields, identity ladders, and relationship metadata. Creation Profiles package the field labels, schema provenance, predicate IDs, and allowed object targets needed to model a creation form.

## When to use it

Use `/creation/<slug>` for a known creation flow; use root registry helpers for dynamic discovery and validation. A classification slug (`music-recording`), schema type (`MusicRecording`), and display label are different values. Use [primitives](/docs/reference/packages/primitives) for identifier-first atom bytes and IDs; filling a field or selecting a relationship never submits a transaction or creates an edge.

## Install

```sh
npm install @0xintuition/classifications@0.1.0 viem@2.31.4
```

Use ESM imports. See [installation and peer setup](/docs/build/install).

## Entry points

| Subpath        | Purpose                                                                                                             |
| -------------- | ------------------------------------------------------------------------------------------------------------------- |
| `.`            | Classification discovery, field validation, atom-data builders, identity derivation, and metadata predicate matrix. |
| `./*`          | Generated classification specs by slug, such as `/music-recording`.                                                 |
| `./creation`   | Generated Creation Profile registry.                                                                                |
| `./creation/*` | One generated Creation Profile by slug, such as `/creation/music-recording`.                                        |

## Depends on and works with

Runtime dependencies: [`@0xintuition/iid`](/docs/reference/packages/iid).

Published peers: `viem ^2.0.0`.

## Example

{/* example:start examples/v2/atom-creation-form/src/package-examples.ts#creation-profile */}

```ts
import {
  buildAtomData,
  validateClassificationValues,
} from '@0xintuition/classifications';
import { musicRecordingCreationProfile } from '@0xintuition/classifications/creation/music-recording';

const recordingValues = {
  name: 'Example recording',
  byArtist: 'Example artist',
};
const issues = validateClassificationValues('music-recording', recordingValues);
if (issues.length > 0) {
  throw new Error(issues.map((issue) => issue.message).join('; '));
}
const recordingData = buildAtomData('music-recording', recordingValues);
const artistRelationship = musicRecordingCreationProfile.relationships.find(
  (relationship) => relationship.predicate.key === 'byArtist',
);
console.log({
  data: recordingData,
  fields: musicRecordingCreationProfile.fields.map((field) => field.key),
  artistTargets: artistRelationship?.expectedObjects,
});
```

{/* example:end */}

These are synthetic descriptive values. `recordingData` contains a `byArtist` string; a graph assertion still needs a separate subject → predicate → object triple. `artistRelationship.expectedObjects` suggests `music-group` or `person` targets; it does not resolve an artist or create that target.

`validateClassificationValues` returns field issues for known classifications; an unknown slug throws. `buildAtomData` throws on invalid values. `getClassificationByReference` resolves trimmed, case-insensitive references through ordered lookup tiers; an ambiguous tier falls through and an unresolved reference returns `undefined`. A matching label is not evidence that two real-world entities are identical.

## Related concepts

See the [concept map](/docs/concepts), [Build creation forms](/docs/build/creation-profiles), and [music catalog](/docs/examples/music-catalog).

## Source

[Package README at the pinned release](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/classifications/README.md).

[Creation Profile types](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/classifications/src/creation-profile.ts) · [Recording profile](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/classifications/src/generated/creation/music-recording.ts) · [Validation and serialization](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/classifications/src/atom-data.ts).
