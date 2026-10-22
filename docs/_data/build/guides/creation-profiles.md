---
title: 'Build creation forms and relationship suggestions'
slug: /build/guides/creation-profiles
sidebar_position: 2
---

Use `classifications` as the source of form fields and relationship recommendations. Use `primitives` to produce the anchor. Use `predicates` for canonical relationship vocabulary. This avoids each app inventing a different schema or hashing a UI label as a predicate.

```ts
import { musicRecordingCreationProfile } from '@0xintuition/classifications/creation/music-recording';
import { getClassification } from '@0xintuition/classifications';
import { buildIidAnchor } from '@0xintuition/primitives/anchor';

const spec = getClassification('music-recording');
const fields = musicRecordingCreationProfile.fields;
const relationships = musicRecordingCreationProfile.relationships;
const built = buildIidAnchor('music-recording', { isrc: 'USRC17607839' });
if (!built.success) throw new Error(built.errors.join('; '));
console.log({ schema: spec?.schema, fields, relationships, atom: built.value });
```

Render fields with their declared requirements and validation. Offer relationship targets according to the profile's typed recommendations. A human-readable legacy `expectedObjectType` hint is less precise than the classification metadata matrix; use the latter for new forms.

## Add a relationship

```ts
import { buildEthereumAccount } from '@0xintuition/primitives/atom';
import { buildTripleByName } from '@0xintuition/primitives/triple';

const alice = buildEthereumAccount({
  address: '0x0000000000000000000000000000000000000001',
});
const bob = buildEthereumAccount({
  address: '0x0000000000000000000000000000000000000002',
});
if (!alice.success || !bob.success) throw new Error('Invalid account');
const follows = buildTripleByName(alice.value.id, 'follow', bob.value.id);
if (!follows.success) throw new Error(follows.errors.join('; '));
console.log(follows.value);
```

This creates an in-memory relationship description. It does not persist the subject, predicate, object, or triple. Ensure all required terms exist in the target storage before writing the triple. For registry-backed predicates, use the package's exact canonical data and ID. Changing the predicate description can create a different atom.

## Separate form state from identity

A form may collect descriptive values, identity facts, and relationship choices. Do not serialize the entire form indiscriminately into an anchor. Once the builder selects identity bytes, keep added images, provider ratings, and labels in their appropriate metadata or relationship layer. A preview should show the proposed ID and representation before persistence.

A provider-backed picker can use `projectIdentifierLadder` to choose a canonical candidate, then pass a validated `candidateIid` to the anchor builder. Do not force every provider namespace into a strong IID: unregistered schemes and alias-only rungs have explicit fallback behavior.
