---
title: "sameAs and identity linking"
sidebar_label: "sameAs and identity linking"
description: "Create and inspect an offline sameAs claim between two recording atoms while preserving both original terms and their provenance."
kind: concept
reader: ["app"]
packages: ["@0xintuition/primitives", "@0xintuition/predicates"]
depends_on: ["iid", "triples", "predicates"]
---

<AppliesTo />

A `sameAs` triple asserts that two atoms refer to the same real-world entity. Each endpoint keeps its own atom ID, payload and history. The edge records a claim that others can evaluate. It takes evidence about the entity to decide whether to accept that claim.

**Builds on:** [The Intuition Identifier](/docs/concepts/iid), [Triples](/docs/concepts/triples), [Predicates](/docs/concepts/predicates).

**Implemented by:** [primitives](/docs/reference/packages/primitives), [predicates](/docs/reference/packages/predicates).

## How it works

First check that both atoms name the same thing at the same level. Two catalog entries for one specific recorded performance can qualify. An album containing the track, a different live performance, or an article reviewing it represents a different thing. [IID spec §8.1](https://github.com/0xIntuition/intuition-identifier/blob/3e593247c0e7cb168b37368937167ed146d3868a/spec/08-equivalence.md#81-why-identifiers-are-not-enough)

A URL in a new atom’s `sameAs` data field is part of its serialized payload. To assert equivalence after two atoms already exist, use their original IDs as the subject and object of a separate triple with the registry’s `sameAs` predicate. The intended meaning is symmetric, but the triple ID is computed from ordered endpoints. [Predicate specification](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/predicates/src/generated/specs/sameAs.ts) · [Identity-linking example](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/examples/hackathon-quickstart/src/identity-linking.ts)

An application may group representations for display under its acceptance policy. The equivalence discussion in the spec describes that grouping as a projection over accepted claims. The original terms still carry their claims and positions. [IID spec §8.4](https://github.com/0xIntuition/intuition-identifier/blob/3e593247c0e7cb168b37368937167ed146d3868a/spec/08-equivalence.md#84-merges-are-reversible)

## Example

Assume two entries in a local test catalog refer to the same recording. Their different reference URLs produce different atom IDs. Build the relationship and inspect its three ordered terms.

{/* example:start examples/v2/identity-linking/src/concept-identity.ts#link-representations */}

```ts
import assert from 'node:assert/strict';
import { buildAtomData } from '@0xintuition/classifications';
import { calculateAtomId } from '@0xintuition/ids';
import { sameAsId } from '@0xintuition/predicates/sameAs';
import { buildTriple } from '@0xintuition/primitives/triple';

// Both catalog entries describe the same recording in this local fixture.
const recording = { name: 'Example recording' };
const left = calculateAtomId(
  buildAtomData('music-recording', {
    ...recording,
    sameAs: ['https://example.org/catalog/a'],
  }),
);
const right = calculateAtomId(
  buildAtomData('music-recording', {
    ...recording,
    sameAs: ['https://example.org/catalog/b'],
  }),
);
assert.notEqual(left, right);

const claim = buildTriple(left, 'sameAs', right);
if (!claim.success) throw new Error(claim.errors.join('; '));
assert.equal(claim.value.subjectId, left);
assert.equal(claim.value.predicateId, sameAsId);
assert.equal(claim.value.objectId, right);
```

{/* example:end */}

This computes a triple blueprint in memory. Neither URL is fetched, and a successful build only checks how the claim is constructed.

## Common mistakes

- Using `sameAs` for a cover, a remix or a review just because it mentions the track. Check the recording-level evidence.
- Overwriting one atom ID with the other when accepting a claim. Record or display the link so consumers can retain provenance and revisit the decision.
- Expecting the claim to prove its own truth, merge balances or submit a transaction.

## Next

Follow the [music catalog example](/docs/examples/music-catalog) to compare recording, artist and album terms and their directed claims.
