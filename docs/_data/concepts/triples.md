---
title: "Triples, counter-triples and nested triples"
sidebar_label: "Triples, counter-triples and nested triples"
description: "Read an ordered subject, predicate and object as a claim, distinguish its counter-triple, and cite the claim inside a second triple."
kind: concept
reader: ["app", "agent", "operator", "plugin"]
packages: ["@0xintuition/ids", "@0xintuition/primitives", "@0xintuition/protocol"]
depends_on: ["atoms"]
---

<AppliesTo />

A triple expresses a claim in three ordered parts. The **subject** is what the claim concerns, the **predicate** names the relationship, and the **object** is what stands on the other side of that relationship. Each part is a term ID. The triple gets an ID of its own, so a second claim can cite the first one.

**Builds on:** [Atoms](/docs/concepts/atoms).

**Implemented by:** [ids](/docs/reference/packages/ids), [primitives](/docs/reference/packages/primitives), [protocol](/docs/reference/packages/protocol).

## How it works

Read the triple from left to right. In the fictional credit “Night Ferry, by artist, Mira,” the recording is the subject, “by artist” is the predicate, and Mira is the object. The registry key `byArtist` selects the relationship in application code. Its display name is `by artist`. The predicate atom's payload is a serialized definition with that name and a description. Its atom ID occupies the middle slot. [Predicate definition](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/predicates/src/generated/specs/byArtist.ts) · [Predicate atom data and ID](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/predicates/src/standalone/byArtist.ts)

A positive triple identifies that ordered claim. Its counter-triple gives participants a separate term for opposition to **the same claim**. MultiVault stores the same three components on both sides. Swapping the recording and the artist instead asserts that Mira is a work by Night Ferry. That is a different claim with its own positive and counter sides.

## Example

Suppose the liner notes support the credit. Attach the notes to the precise credit they document.

| Term | Subject | Predicate | Object |
| --- | --- | --- | --- |
| Credit | Night Ferry recording atom | by artist | Mira artist atom |
| Source for the credit | **Credit triple ID** | has source | Liner notes atom |

The second row is a nested triple. Follow its subject ID to inspect the precise claim the notes support. The predicate in each row stands for a predicate atom ID. “Credit” is just a local name for the first row's result.

To create the second row on-chain, its three terms must already exist on that MultiVault when the row is processed. The creation check accepts an existing atom or registered triple in each slot, including a registered counter-triple. The contract also checks for a duplicate triple. Computing an inner triple's ID locally supplies a reference, while creating it makes the reference usable on that deployment. [Term existence and triple creation](https://github.com/0xIntuition/intuition-contracts-v2/blob/82cfcdb832c100fd2e53ee3f474289ae14cc6020/src/libraries/MultiVaultLib.sol) · [Source predicate](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/predicates/src/generated/specs/hasSource.ts)

## Common mistakes

- **Substituting a label for its ID.** Hashing the bare text “by artist” omits the registry definition.
- **Reversing a claim to dispute it.** Use the counter ID derived from the original triple.
- **Attaching evidence to the wrong subject.** A source attached to the recording describes the recording. A source attached to the credit can support that particular attribution.

## Next

- [Deterministic IDs](/docs/concepts/deterministic-ids) derives the ID of each side. [Vaults](/docs/concepts/vaults) explains where their positions live.
- [Predicates](/docs/concepts/predicates) covers the registry. [sameAs](/docs/concepts/same-as) uses a predicate to link two representations of an entity.
