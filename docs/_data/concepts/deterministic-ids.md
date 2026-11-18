---
title: "Deterministic IDs"
sidebar_label: "Deterministic IDs"
description: "Derive atom, predicate, triple and counter-triple IDs offline from the exact bytes and term order used by MultiVault."
kind: concept
reader: ["app", "agent"]
packages: ["@0xintuition/ids", "@0xintuition/primitives"]
depends_on: ["atoms", "triples"]
---

<AppliesTo />

An ID is deterministic when anyone following the same rule with the same inputs gets the same result. Two catalogs can derive the ID of a recording independently and agree on which claim to reference before either opens a connection to a chain.

**Builds on:** [Atoms](/docs/concepts/atoms), [Triples, counter-triples and nested triples](/docs/concepts/triples).

**Implemented by:** [ids](/docs/reference/packages/ids), [primitives](/docs/reference/packages/primitives).

## How it works

The protocol uses Keccak-256, a hash that returns 32 bytes. It gives atoms, triples and counter-triples distinct salts. A salt here is a fixed public value, the Keccak-256 hash of the UTF-8 text `ATOM_SALT`, `TRIPLE_SALT` or `COUNTER_SALT`. “Followed by” below means concatenating the raw bytes in that order. [Salt definitions](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/ids/src/hash.ts) · [Solidity derivation](https://github.com/0xIntuition/intuition-contracts-v2/blob/82cfcdb832c100fd2e53ee3f474289ae14cc6020/src/protocol/MultiVaultCore.sol)

| ID | What to hash |
| --- | --- |
| Atom | The atom salt followed by the 32-byte hash of the payload bytes. |
| Inline registry predicate | First serialize a JSON-LD `DefinedTerm` in the order `@context`, `@type`, `name`, `description`. Apply the atom rule to that document. |
| Triple | The triple salt followed by the 32-byte subject, predicate and object IDs, in order. |
| Counter-triple | The counter salt followed by the positive triple ID. |

For a registry predicate, use the package’s exported ID or its exact atom data. For instance, the key `byArtist` looks up a record whose name is “by artist.” Changing its description changes the serialized bytes even if the displayed name stays the same. [Predicate serialization](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/ids/src/predicate-id.ts)

## Example

This offline example uses plain text for three invented atoms, including a deliberately local relationship. Compare the results of a trailing space, a swapped pair and a counter-triple.

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

All four comparisons print `true`. The text and its UTF-8 encoding describe the same bytes. The space adds a byte. Reversal changes the order of the hash inputs. The counter rule hashes the original triple ID with its own salt.

## Common mistakes

- **Hashing printed hex characters by accident.** Match the meaning of your input. An original text field containing `0xdeadbeef` needs explicit UTF-8 encoding. Raw bytes represented in hex can go directly to the ID helper.
- **Using a wallet address or transaction hash to look up a term.** The caller, chain and transaction do not enter these ID formulas. Creation and balances still belong to a particular deployment.
- **Treating a calculated ID as proof of identity.** It lets you reproduce a reference to bytes. Establishing which real-world entity those bytes describe requires the identifier and its evidence.

## Next

[Intuition Identifiers](/docs/concepts/iid) addresses the real-world naming problem. [Protocol writes](/docs/concepts/protocol-writes) explains how a known ID becomes part of an on-chain operation.
