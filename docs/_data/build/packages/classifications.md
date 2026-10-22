---
title: '@0xintuition/classifications guide'
slug: /build/packages/classifications
sidebar_position: 7
---

Use canonical entity specifications, identity ladders, Creation Profiles, discovery metadata, and atom-data builders.

Candidate source version: **0.1.0-alpha.1**. [Release compatibility](../compatibility.md) explains publication and deployment prerequisites.

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

## Source and full contract

[Source and package guide](https://github.com/0xIntuition/packages/tree/1dc7103d2a05f23bc565a81df4b001336ce9ba53/packages/classifications) · [npm package](https://www.npmjs.com/package/@0xintuition/classifications). The [machine-readable manifest](/intuition-release.json) lists all declared public subpaths and peer dependencies. Npm links name the intended package; this page does not assert that the candidate has been published.
