---
title: "@0xintuition/ids"
sidebar_label: "IDs"
description: "Hash exact atom bytes and ordered triple components into protocol IDs without creating on-chain terms."
kind: reference
reader: ["app", "agent"]
packages: ["@0xintuition/ids"]
---

<AppliesTo />

## What it's for

IDs computes deterministic protocol atom, predicate, triple, and counter-triple IDs. The result identifies exact bytes or ordered components; it does not determine whether two descriptions refer to the same real-world entity.

## When to use it

Use it when bytes or component IDs are already known. Use [iid](/docs/reference/packages/iid) for entity identifier grammar and [primitives](/docs/reference/packages/primitives) for validated construction. Calculating an ID neither registers an atom nor submits a transaction.

## Install

```sh
npm install @0xintuition/ids@0.1.0 viem@2.31.4
```

Use ESM imports. See [installation and peer setup](/docs/build/install).

## Entry points

| Subpath | Purpose                                                                                                              |
| ------- | -------------------------------------------------------------------------------------------------------------------- |
| `.`     | Atom, predicate, triple, counter-triple, OAuth and auth-user hashes; salts, hash validation, and formatting helpers. |

## Depends on and works with

Runtime dependencies: none.

Published peers: `viem ^2.0.0`.

## Example

{/* example:start examples/v2/predicate-picker/src/ids.ts#ordered-ids */}

```ts
import {
  calculateAtomId,
  calculateCounterTripleId,
  calculateTripleId,
} from '@0xintuition/ids';
import { toHex } from 'viem';

// Synthetic bytes, with no claim about a real recording or artist.
const data = 'example:recording';
const recordingId = calculateAtomId(data);
const artistId = calculateAtomId('example:artist');
const predicateId = calculateAtomId('example:relationship');
const tripleId = calculateTripleId(recordingId, predicateId, artistId);
const reverseId = calculateTripleId(artistId, predicateId, recordingId);
const counterId = calculateCounterTripleId(tripleId);
console.log({
  sameBytes: recordingId === calculateAtomId(toHex(data)),
  changedBytes: recordingId !== calculateAtomId(`${data} `),
  reverseDiffers: reverseId !== tripleId,
  counterDiffersFromReverse: counterId.toString() !== reverseId.toString(),
});
```

{/* example:end */}

`calculateAtomId` accepts a UTF-8 string or hex-encoded bytes. A hex-looking input is treated as bytes, so encode explicitly with `toHex` when the intended data is the literal text `0x...`. A trailing space changes the payload and therefore its atom ID.

Triple hashing uses **subject, predicate, object** in that order. A reversed triple makes a different assertion; a counter-triple instead derives from the original triple ID to identify its negation. Neither operation merges identities. Authentication-related hashes are deterministic public identifiers, not encryption for secrets.

## Related concepts

See the [concept map](/docs/concepts) and [Representation profiles](/docs/concepts/representation-profiles) for the difference between entity identity and payload identity.

## Source

[Package README at the pinned release](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/ids/README.md).

[Atom hashing](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/ids/src/atom-id.ts) · [Ordered triple and counter-triple hashing](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/ids/src/triple-id.ts).
