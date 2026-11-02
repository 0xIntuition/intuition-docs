---
title: '@0xintuition/iid guide'
slug: /build/packages/iid
sidebar_position: 2
---

Parse, inspect, canonicalize, and derive Intuition identifiers entirely offline.

Published alpha version: **0.1.0-alpha.0**. [Release compatibility](../compatibility.md) records npm publication, peer dependencies, and deployment boundaries.

## Install

```sh
npm install @0xintuition/iid@0.1.0-alpha.0 viem@^2
```

Use ESM imports. Required peers: `viem ^2.0.0`.

## Main surface

| Export or operation                 | Purpose                                                        |
| ----------------------------------- | -------------------------------------------------------------- |
| `inspectIntuitionId(iid)`           | Typed validity, canonicalization and anchor-eligibility result |
| `validateIntuitionId(iid)`          | Whether the complete identifier is canonical                   |
| `SCHEMES.isrc.canonicalize(value)`  | Canonical scheme value or undefined                            |
| `deriveIntuitionId(ladder, values)` | First successful declared identity rung                        |
| `buildGen1Iid(slug, tag, values)`   | Recipe-derived identifier                                      |

## First use

```ts
import { inspectIntuitionId } from '@0xintuition/iid';
console.log(inspectIntuitionId('int:isrc:USRC17607839'));
```

## Integration decisions

Validity and P0 eligibility differ. Bare polymorphic Wikidata values and provider-local identifiers can be valid while requiring P1. Never repair a canonicalization error by inventing a new scheme.

## Source and full contract

[Source and package guide](https://github.com/0xIntuition/packages/tree/dde4fdf5774447b84cd0b820593fb0db7366e58d/packages/iid) · [npm package](https://www.npmjs.com/package/@0xintuition/iid/v/0.1.0-alpha.0). The [machine-readable manifest](/intuition-release.json) lists all declared public subpaths and peer dependencies. Exact npm versions, tarball integrity, and observed dist-tags are recorded in the manifest.
