---
title: Derive IDs and IIDs
sidebar_label: Derive IDs and IIDs
description: Project a recording identifier and calculate the atom, ordered triple, and counter-triple IDs from the bytes you plan to use.
kind: how-to
reader: ["app", "agent"]
packages: ["@0xintuition/ids", "@0xintuition/iid", "@0xintuition/iid-ladder", "@0xintuition/primitives"]
---

<AppliesTo />

Turn recording metadata into a canonical Intuition Identifier (IID), then calculate the atom and claim IDs an application can compare before a write.

## Before you start

A provider’s identifier describes an entity, while an atom ID names one exact sequence of bytes. A triple ID names an ordered claim connecting three terms. See [deterministic IDs](/docs/concepts/deterministic-ids) and the [identity ladder](/docs/concepts/identity-ladder).

For your own project, follow [Install the packages](/docs/build/install). To run the [offline example](https://github.com/0xIntuition/intuition-docs/blob/c3b1eaa91a822bb59b20cb6de2bc9b874a00b7b0/examples/v2/identity-linking/src/derive-ids.ts), install its locked dependencies from the documentation repository root with Node.js 22.21.0.

```sh
npm ci --prefix examples/v2 --ignore-scripts
```

## Steps

### 1. Project the recording identifier

Supply the identifiers for a known recording and its canonical URL. In the fixture, `US-RC1-76-07839` canonicalizes to `int:isrc:USRC17607839`. The ladder selects it on the strong rung. With empty input the ladder returns `iid: null`, `fallback: 'envelope'` and `reason: 'no-identifier'`. The helper returns that reason so the caller can request more evidence.

### 2. Select the representation and hash its bytes

Inspect the selected IID, then ask the anchor builder for the serialized bytes. A valid IID can still require a typed JSON envelope. For example, the canonical account scheme admits weak handles. The released package requires at least P1 for a weak handle, so hashing the bare handle would predict the wrong ID for that envelope. [Canonical account scheme](https://github.com/0xIntuition/intuition-identifier/blob/3e593247c0e7cb168b37368937167ed146d3868a/schemes/acct.md) and [packaged profile requirement](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/iid-spec/schemes/acct.md).

{/* example:start examples/v2/identity-linking/src/derive-ids.ts#derive-recording */}
```ts
import {
  calculateAtomId,
  calculateCounterTripleId,
  calculateTripleId,
} from '@0xintuition/ids';
import { inspectIntuitionId } from '@0xintuition/iid';
import { projectIdentifierLadder } from '@0xintuition/iid-ladder';
import { buildIidAnchor } from '@0xintuition/primitives/anchor';
import { byArtistId } from '@0xintuition/predicates/byArtist';

export function deriveRecording(
  strongIdentifiers: Record<string, string>,
  canonicalUrl?: string,
) {
  const selection = projectIdentifierLadder({
    strongIdentifiers,
    canonicalUrl,
  });
  if (selection.iid === null) return { reason: selection.reason };
  const inspection = inspectIntuitionId(selection.iid);
  if (!inspection.valid) return { reason: inspection.reason };

  const anchor = buildIidAnchor(
    'music-recording',
    { name: 'Local catalog' },
    {
      candidateIid: selection.iid,
      contextUris: ['https://example.org/context'],
    },
  );
  if (!anchor.success) throw new Error(anchor.errors.join(', '));
  const { iid, dataHex, profile, contextUris } = anchor.value;
  const atomId = calculateAtomId(dataHex);
  const artistId = calculateAtomId('example:artist');
  const tripleId = calculateTripleId(atomId, byArtistId, artistId);
  return {
    iid,
    profile,
    contextUris,
    dataHex,
    atomId,
    tripleId,
    counterId: calculateCounterTripleId(tripleId),
  };
}
```
{/* example:end */}

### 3. Keep the terms in order

The example places the recording first, the registry’s `byArtist` predicate second, and the synthetic artist last. Swapping artist and recording calculates the ID for a different statement. The counter uses its own salt and the original triple ID. The `contextUris` travel alongside the anchor. Changing a companion URI preserves the hashed payload, whereas editing a character inside the payload changes its atom ID.

## Check the result

```sh
node examples/v2/identity-linking/src/derive-ids.ts
```

The recording uses P0, so its complete payload is the UTF-8 text `int:isrc:USRC17607839`. Compare the printed values to these results.

| Value | Expected |
| --- | --- |
| Payload bytes | `0x696e743a697372633a555352433137363037383339` |
| Atom ID | `0xd3368a8190d3afd5fb05abd01db8141c09a77c3f290bb7a0ef2ffb2b5acab8d8` |
| Triple ID | `0x3ff96ae3404297531e06d9c45cd6d1ae4f2dfcb93eb1647e11c3d7e34d4ddf91` |
| Counter ID | `0x9c29beb2d9ecb87a18b4e3973a6f78dbcf06d9b8e6be99cbf0725e00f89fe462` |

The empty fixture prints `no-identifier`. If two records yield different atom IDs, preserve both byte sequences and review evidence for an [identity link](/docs/build/link-identities).

## Related

[Representation profiles](/docs/concepts/representation-profiles), [ladder selection](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/iid-ladder/src/ladder.ts), [atom ID derivation](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/ids/src/atom-id.ts), and [triple and counter derivation](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/ids/src/triple-id.ts).
