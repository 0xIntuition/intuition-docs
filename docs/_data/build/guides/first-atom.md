---
title: 'Build a deterministic atom offline'
slug: /build/guides/first-atom
sidebar_position: 1
---

This recipe produces canonical atom bytes and an ID. It makes no API, provider, RPC, or wallet calls. Use Node 22 and an ESM project; install the [candidate versions](../compatibility.md) once published, or use the matching release tarballs during qualification.

```sh
npm install @0xintuition/primitives@0.1.0-alpha.1 @0xintuition/ids@0.1.0-alpha.1 viem@^2
```

Save as `first-atom.mjs` and run `node first-atom.mjs`:

```js
import assert from 'node:assert/strict';
import { buildIidAnchor } from '@0xintuition/primitives/anchor';
import { calculateAtomId } from '@0xintuition/ids';

const result = buildIidAnchor(
  'music-recording',
  { isrc: 'US-RC1-76-07839' },
  { contextUris: ['https://example.com/recordings/1'] },
);
if (!result.success) throw new Error(result.errors.join('; '));
const atom = result.value;
assert.equal(atom.iid, 'int:isrc:USRC17607839');
assert.equal(atom.profile, 'p0');
assert.equal(atom.data, atom.iid);
assert.equal(calculateAtomId(atom.data), atom.id);

const otherContext = buildIidAnchor(
  'music-recording',
  { isrc: 'USRC17607839' },
  { contextUris: ['https://example.org/alternate-evidence'] },
);
if (!otherContext.success) throw new Error(otherContext.errors.join('; '));
assert.equal(otherContext.value.id, atom.id);
console.log({ iid: atom.iid, id: atom.id, dataHex: atom.dataHex });
```

The assertions show canonicalization and the identity/context boundary. The two context lists differ, but the P0 atom bytes and ID are identical. The output ID is a 32-byte hex value; retain it rather than substituting the IID where a protocol term ID is required.

## What to persist

Keep `data`, `dataHex`, `id`, the selected profile, and the original identity evidence together. Send the exact `data` to Core or `dataHex` to a protocol call. Display metadata can be refreshed independently. URI context is submitted explicitly by a URI-aware contract operation; the builder does not upload it.

## Failure handling

Check `success` before reading `value`. Invalid or noncanonical candidates, incompatible representation requests, missing fallback fields, and URI policy violations produce actionable errors. Do not silently replace an error with a random ID. For fallback envelopes `iid` can be `null`; the atom still has deterministic bytes and an ID.

Next: [build a relationship](./creation-profiles.md) or [persist the atom in Core](./core-rest.md).
