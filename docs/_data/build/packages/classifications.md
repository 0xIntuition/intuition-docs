---
title: '@0xintuition/classifications guide'
slug: /build/packages/classifications
sidebar_position: 7
---

Use canonical entity specifications, identity ladders, Creation Profiles, discovery metadata, and atom-data builders.

Published alpha version: **0.1.0-alpha.1**. [Release compatibility](../compatibility.md) records npm publication, peer dependencies, and deployment boundaries.

## Install

```sh
npm install @0xintuition/classifications@0.1.0-alpha.1 viem@^2
```

Use ESM imports. Required peers: `viem ^2.0.0`.

## Main surface

| Export or operation                            | Purpose                                                  |
| ---------------------------------------------- | -------------------------------------------------------- |
| `getClassification(slug)`                      | Canonical specification by slug                          |
| `getClassificationByType(type)`                | Exact schema-type lookup                                 |
| `getClassificationByReference(reference)`      | Case-insensitive reference resolver with ambiguity rules |
| `deriveClassificationIdentifier(slug, values)` | IID ladder result or undefined                           |
| `buildAtomData(slug, values)`                  | Serialized descriptive atom data                         |

## First use

```ts
import { musicRecordingCreationProfile } from '@0xintuition/classifications/creation/music-recording';
console.log(
  musicRecordingCreationProfile.fields,
  musicRecordingCreationProfile.relationships,
);
```

## Integration decisions

Canonical slug, schema type, display name, and engine category are separate values. Use Creation Profiles for fields and recommended relationships; use primitives/anchor for identifier-first atom bytes.

## Discovery and field metadata

Use `getClassificationLabel` for display names, `getClassificationByType` for exact schema types, and `getClassificationByReference` for trimmed, case-insensitive lookup. Ambiguous names return no resolution at that tier; do not equate the engine's `song` category with one canonical schema type.

`deriveClassificationIdentifier` projects the classification's declared ladder; it returns `undefined` when no rung fires and throws for an unknown slug. `buildAtomDataObject` and `buildAtomData` can include a derived identifier when explicitly requested. `buildClassificationSearchText` composes declared text fields and removes duplicate and URL/IID-like values; its base output is unbounded, while `CLASSIFICATION_SEARCH_TEXT_MAX_LENGTH` exposes a 20,000-character cap for host composition.

`DISCOVER_ACTIVITY_GROUPS` defines read/watch/listen memberships. `filterClassificationSpecsForPrimaryCatalogue` and `resolveAtomVisibilityFilters` support shared catalog visibility policy without deleting canonical specs. `NATIVE_ATOM_CLASSIFICATION_TYPES` and `nativeAtomClassificationTypeForData` identify native writer types independently of visibility.

Use generated `/creation/<slug>` profiles for known forms; use root discovery and metadata-matrix helpers for dynamic tools. The viem peer is required through the IID derivation dependency.

## Source and full contract

[Source and package guide](https://github.com/0xIntuition/packages/tree/dde4fdf5774447b84cd0b820593fb0db7366e58d/packages/classifications) · [npm package](https://www.npmjs.com/package/@0xintuition/classifications/v/0.1.0-alpha.1). The [machine-readable manifest](/intuition-release.json) lists all declared public subpaths and peer dependencies. Exact npm versions, tarball integrity, and observed dist-tags are recorded in the manifest.
