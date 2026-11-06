---
title: '@0xintuition/predicates guide'
slug: /build/packages/predicates
sidebar_position: 8
---

Use shared relationship vocabulary, canonical predicate data and IDs, semantic flags, and display helpers.

Published alpha version: **0.1.0-alpha.1**. [Release compatibility](../compatibility.md) records npm publication, peer dependencies, and deployment boundaries.

## Install

```sh
npm install @0xintuition/predicates@0.1.0-alpha.1 viem@^2
```

Use ESM imports. Required peers: `viem ^2.0.0`.

## Main surface

| Export or operation                          | Purpose                                   |
| -------------------------------------------- | ----------------------------------------- |
| `PREDICATE_IDS`                              | Canonical registry IDs keyed by predicate |
| `createPredicateAtomData(name, description)` | Exact inline DefinedTerm data             |
| `getLaunchPredicateBootstrapTriples()`       | Launch vocabulary bootstrap relationships |
| `buildPredicateIpfsDocument(key, options)`   | Enrichment document data; no upload       |

## First use

```ts
import { PREDICATE_IDS } from '@0xintuition/predicates';
console.log(PREDICATE_IDS.follow);
```

## Integration decisions

Changing identity-bearing payload text changes an ID. The classification metadata matrix owns typed creation targets; legacy expectedObjectType strings are descriptive hints.

## Source and full contract

[Source and package guide](https://github.com/0xIntuition/packages/tree/dde4fdf5774447b84cd0b820593fb0db7366e58d/packages/predicates) · [npm package](https://www.npmjs.com/package/@0xintuition/predicates/v/0.1.0-alpha.1). The [machine-readable manifest](/intuition-release.json) lists all declared public subpaths and peer dependencies. Exact npm versions, tarball integrity, and observed dist-tags are recorded in the manifest.
