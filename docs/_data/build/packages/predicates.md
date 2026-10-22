---
title: '@0xintuition/predicates guide'
slug: /build/packages/predicates
sidebar_position: 8
---

Use shared relationship vocabulary, canonical predicate data and IDs, semantic flags, and display helpers.

Candidate source version: **0.1.0-alpha.1**. [Release compatibility](../compatibility.md) explains publication and deployment prerequisites.

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

[Source and package guide](https://github.com/0xIntuition/packages/tree/1dc7103d2a05f23bc565a81df4b001336ce9ba53/packages/predicates) · [npm package](https://www.npmjs.com/package/@0xintuition/predicates). The [machine-readable manifest](/intuition-release.json) lists all declared public subpaths and peer dependencies. Npm links name the intended package; this page does not assert that the candidate has been published.
