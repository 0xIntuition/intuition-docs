---
title: "The Intuition Identifier (IID)"
sidebar_label: "The Intuition Identifier (IID)"
description: "Read an Intuition Identifier and tell which value names a recording and which value identifies its exact atom bytes."
kind: concept
reader: ["app", "agent", "operator", "plugin"]
packages: ["@0xintuition/iid-spec", "@0xintuition/iid"]
depends_on: ["atoms", "deterministic-ids"]
---

<AppliesTo />

An Intuition Identifier (IID) is a string of the form `int:<scheme>:<value>` that names an entity. An atom can carry that string in its data. The protocol derives a separate 32-byte atom ID from the entire payload. You can compare IIDs to check whether two records carry the same name, and compare atom IDs to check whether they address the same atom.

**Builds on:** [Atoms](/docs/concepts/atoms), [Deterministic IDs](/docs/concepts/deterministic-ids).

**Implemented by:** [iid-spec](/docs/reference/packages/iid-spec), [iid](/docs/reference/packages/iid).

## How it works

First decide **what you are identifying**. An ISRC names a particular recorded performance. A studio take and a live take can share a composition and a title while having different ISRCs. An ISWC names the composition. Picking the entity level determines which identifiers make sense. [IID spec §5.5](https://github.com/0xIntuition/intuition-identifier/blob/3e593247c0e7cb168b37368937167ed146d3868a/spec/05-identity-ladders.md#55-abstraction-levels)

The scheme tells you how to turn a source value into its canonical spelling. Two importers following the same rule can produce identical text offline. A valid identifier tells you what the supplied value names. Checking whether a catalog attached that value to the right record requires evidence about the record. [IID spec §0.4](https://github.com/0xIntuition/intuition-identifier/blob/3e593247c0e7cb168b37368937167ed146d3868a/spec/00-overview.md#04-the-core-claim-stated-precisely)

## Example

The [offline quickstart](/docs/get-started/quickstart) builds a bare recording anchor from the standalone ISRC fixture `US-RC1-76-07839`.

| Value | Fixture result | Where to use it |
| --- | --- | --- |
| Canonical IID | `int:isrc:USRC17607839` | Compare the identifier across catalogs. |
| Atom data | The exact UTF-8 bytes of `int:isrc:USRC17607839` | Reproduce this bare anchor. |
| Atom ID | `0xd3368a8190d3afd5fb05abd01db8141c09a77c3f290bb7a0ef2ffb2b5acab8d8` | Refer to this atom in a triple. |

Encoding the same IID inside a JSON object adds bytes. That representation has its own atom ID even though a reader can extract the same IID. [IID spec §0.5](https://github.com/0xIntuition/intuition-identifier/blob/3e593247c0e7cb168b37368937167ed146d3868a/spec/00-overview.md#05-what-an-iid-is-not)

## Common mistakes

- Supplying the IID string when a triple builder expects a `bytes32` subject or object ID.
- Treating two recordings with matching titles as the same performance. Check the recording-level evidence before linking them.

## Next

- Read [Schemes and canonical form](/docs/concepts/iid-schemes) to compare source spellings and [Representation profiles](/docs/concepts/representation-profiles) to choose the stored bytes.
- See how [Classifications](/docs/concepts/classifications) select identity rules and how [Atom parsing](/docs/concepts/atom-parsing) handles raw input.
- Use [sameAs](/docs/concepts/same-as) to express a claim about two existing atoms.
