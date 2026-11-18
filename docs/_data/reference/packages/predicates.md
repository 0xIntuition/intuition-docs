---
title: "@0xintuition/predicates"
sidebar_label: "Predicates"
description: "Select canonical relationship keys, labels, serialized atom data, and deterministic predicate IDs."
kind: reference
reader: ["app", "agent"]
packages: ["@0xintuition/predicates"]
---

<AppliesTo />

## What it's for

The predicate registry provides reusable relationship vocabulary and the atom data that gives each predicate its deterministic ID. It also supplies semantic flags, display helpers, and optional enrichment-document builders.

## When to use it

Use a known predicate subpath for one relationship, or the root registry for discovery. Use [classifications](/docs/reference/packages/classifications) for classification-specific object targets; legacy `expectedObjectType` strings are descriptive hints. Predicate metadata does not create graph edges, infer inverse edges, or upload an IPFS document.

## Install

```sh
npm install @0xintuition/predicates@0.1.0 viem@2.31.4
```

Use ESM imports. See [installation and peer setup](/docs/build/install).

## Entry points

| Subpath | Purpose                                                                                         |
| ------- | ----------------------------------------------------------------------------------------------- |
| `.`     | Registry, deterministic data and IDs, semantic metadata, display and bootstrap helpers.         |
| `./*`   | Standalone predicate modules keyed by the exact registry key, such as `/byArtist` or `/sameAs`. |

## Depends on and works with

Runtime dependencies: [`@0xintuition/ids`](/docs/reference/packages/ids).

Published peers: `viem ^2.0.0`.

## Example

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

The key `byArtist` selects a registry entry; the label `by artist` is display text. The data is a compact `DefinedTerm` JSON-LD string containing `@context`, `@type`, `name`, and `description` in that order. The predicate ID hashes that exact data: changing the description changes the ID even if the label stays the same.

The explicit triple above means **recording → by artist → artist**. Reversing subject and object changes the assertion and its ID. This computes a triple locally; it does not establish that any term exists on-chain.

## Related concepts

- [Predicates](/docs/concepts/predicates)
- [sameAs and identity linking](/docs/concepts/same-as)

See also [music catalog](/docs/examples/music-catalog).

## Source

[Package README at the pinned release](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/predicates/README.md).

[byArtist specification](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/predicates/src/generated/specs/byArtist.ts) · [Standalone export](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/predicates/src/standalone/byArtist.ts) · [Predicate serialization](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/ids/src/predicate-id.ts).
