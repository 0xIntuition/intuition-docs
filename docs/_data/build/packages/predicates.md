---
title: '@0xintuition/predicates'
sidebar_label: 'Predicates'
slug: /build/packages/predicates
sidebar_position: 8
---

Use shared relationship vocabulary, canonical predicate data and IDs, semantic flags, and display helpers.

Version **0.1.0-alpha.1** · [npm](https://www.npmjs.com/package/@0xintuition/predicates/v/0.1.0-alpha.1) · [Compatibility](../compatibility.md)

## Install

```sh
npm install @0xintuition/predicates@0.1.0-alpha.1 viem@^2
```

Use ESM imports. Required peers: `viem ^2.0.0`.

## API overview

| Export or operation                          | Purpose                                   |
| -------------------------------------------- | ----------------------------------------- |
| `PREDICATE_IDS`                              | Canonical registry IDs keyed by predicate |
| `createPredicateAtomData(name, description)` | Exact inline DefinedTerm data             |
| `getLaunchPredicateBootstrapTriples()`       | Launch vocabulary bootstrap relationships |
| `buildPredicateIpfsDocument(key, options)`   | Enrichment document data; no upload       |

## Example

```ts
import { PREDICATE_IDS } from '@0xintuition/predicates';
console.log(PREDICATE_IDS.follow);
```

## Usage notes

Changing identity-bearing payload text changes an ID. The classification metadata matrix owns typed creation targets; legacy expectedObjectType strings are descriptive hints.

## Further reading

[Source and package guide](https://github.com/0xIntuition/packages/tree/dde4fdf5774447b84cd0b820593fb0db7366e58d/packages/predicates) · [npm package](https://www.npmjs.com/package/@0xintuition/predicates/v/0.1.0-alpha.1).
