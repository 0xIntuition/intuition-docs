---
title: "Atoms"
sidebar_label: "Atoms"
description: "Learn how an atom represents an entity, which bytes determine its ID, and how to preserve text that looks like hexadecimal data."
kind: concept
reader: ["app", "agent", "operator", "plugin"]
packages: ["@0xintuition/ids", "@0xintuition/primitives", "@0xintuition/protocol"]
depends_on: []
---

<AppliesTo />

An atom gives an app something to refer to. A catalog might need to refer to a recording, its artist, or its liner notes. For each one, the app chooses data, encodes it as bytes, and derives a 32-byte atom ID. Other apps can refer to those same bytes by ID. The real-world recording, the chosen bytes, and the resulting ID play different roles.

**Builds on:** Nothing; this is the base of the ladder.

**Implemented by:** [ids](/docs/reference/packages/ids), [primitives](/docs/reference/packages/primitives), [protocol](/docs/reference/packages/protocol).

## How it works

Suppose a catalog calls a recording “Night Ferry.” Another catalog could use the same title for a different recording, or use a different title for the same recording. Choosing a representation comes first. An app can store the title as text, encode a structured description, or use a canonical identifier for the recording. A short title alone carries no catalog or artist information.

The protocol hashes the exact payload bytes with an atom-specific salt. The ID fits in a Solidity `bytes32`. Copying the bytes preserves the ID. Adding a trailing space to plain text, or changing the field order in serialized JSON, changes what gets hashed. To recover the payload of an existing atom, read its stored data by ID on the intended deployment. [Atom ID derivation](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/ids/src/atom-id.ts) · [MultiVault atom reads](https://github.com/0xIntuition/intuition-contracts-v2/blob/82cfcdb832c100fd2e53ee3f474289ae14cc6020/src/protocol/MultiVaultCore.sol)

## Example

A historical record contains the ten characters `0xdeadbeef`. The same spelling can describe two distinct inputs.

| Meaning | Bytes passed to the hash, in hexadecimal |
| --- | --- |
| Literal text, encoded as UTF-8 | `0x30786465616462656566` (10 bytes) |
| A hexadecimal byte sequence | `0xdeadbeef` (4 bytes) |

`calculateAtomId` accepts both strings and hex. When the original field meant text, encode it explicitly. This local helper keeps the payload, its byte encoding, and its ID together. The same `dataHex` can later be reviewed as the creation payload.

{/* example:start examples/v2/first-write/src/migration.ts#preserve */}

```ts
import { calculateAtomId as atomIdFromData } from '@0xintuition/ids';
import { stringToHex as encodeData } from 'viem';

export function preserveAtom(data: string) {
  const dataHex = encodeData(data);
  return { data, dataHex, id: atomIdFromData(dataHex) };
}
```

{/* example:end */}

## Common mistakes

- **Hashing the displayed title to look up a structured atom.** Use the exact serialized payload or the ID supplied by its publisher.
- **Using an ID as the payload for a new atom.** Hashing those 32 bytes makes another identifier.
- **Assuming a locally calculated ID already exists.** Creation on the selected MultiVault checks that the payload is nonempty, fits its configured length limit, and is new. [Creation checks](https://github.com/0xIntuition/intuition-contracts-v2/blob/82cfcdb832c100fd2e53ee3f474289ae14cc6020/src/libraries/MultiVaultLib.sol)

## Next

- [Triples](/docs/concepts/triples) connect atoms. [Deterministic IDs](/docs/concepts/deterministic-ids) explains how to reproduce their IDs.
- [Vaults](/docs/concepts/vaults) hold positions in a term.
- [Intuition Identifiers](/docs/concepts/iid) name entities. [Representation profiles](/docs/concepts/representation-profiles) determine which identifying bytes reach the protocol.
- [Classifications](/docs/concepts/classifications) define shared fields for an entity type. [Atom parsing](/docs/concepts/atom-parsing) begins with an input whose format may be unknown.
