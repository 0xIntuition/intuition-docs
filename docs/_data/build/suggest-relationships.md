---
title: Suggest relationships and pick predicates
sidebar_label: Suggest relationships and pick predicates
description: Use a recording’s Creation Profile to choose a predicate, check a target classification, and prepare an ordered relationship for review.
kind: how-to
reader: ["app"]
packages: ["@0xintuition/predicates", "@0xintuition/classifications"]
---

<AppliesTo />

Build a relationship picker that proposes a recording’s artist using the Creation Profile and the predicate registry.

## Before you start

Start with a recording atom ID and a candidate target atom whose classification your application has checked. The example derives both IDs from synthetic payloads. Read [classifications](/docs/concepts/classifications) and [predicates](/docs/concepts/predicates).

For your own project, follow [Install the packages](/docs/build/install). To run the [offline example](https://github.com/0xIntuition/intuition-docs/blob/c3b1eaa91a822bb59b20cb6de2bc9b874a00b7b0/examples/v2/predicate-picker/src/suggest-relationships.ts), install its locked dependencies from the documentation repository root with Node.js 22.21.0.

```sh
npm ci --prefix examples/v2 --ignore-scripts
```

## Steps

### 1. Read the recording’s recommendations

Look up the selected key in `musicRecordingCreationProfile.relationships`. Each entry describes the subject classification, predicate and expected objects. For `byArtist`, the recording is the subject. An artist goes in the object slot. A picker can display the predicate label and suggest targets classified as a music group or a person.

### 2. Check the target and resolve the predicate

This picker handles classification hints. It omits a recommendation when the key is absent or the candidate’s classification falls outside those hints. After checking the target, resolve the profile’s predicate ID through the registry and keep the registered spelling, ID and status together.

{/* example:start examples/v2/predicate-picker/src/suggest-relationships.ts#suggest-edge */}
```ts
import { musicRecordingCreationProfile } from '@0xintuition/classifications/creation/music-recording';
import { getPredicateById, getPredicateId } from '@0xintuition/predicates';
import type { Hex } from 'viem';

export function suggestRelationship(
  recordingId: Hex,
  key: string,
  target: { id: Hex; classification: string },
) {
  const relation = musicRecordingCreationProfile.relationships.find(
    (entry) => entry.predicate.key === key,
  );
  if (!relation) return { reason: 'No profile recommendation' };
  const allowed = relation.expectedObjects.some(
    (hint) =>
      hint.kind === 'classification' && hint.slug === target.classification,
  );
  if (!allowed)
    return { reason: 'Target falls outside the recommended classifications' };
  const predicate = getPredicateById(relation.predicate.id);
  if (!predicate || predicate.key !== key)
    return { reason: 'Unknown predicate' };
  return {
    subjectId: recordingId,
    predicateId: getPredicateId(predicate.key),
    objectId: target.id,
    label: predicate.name,
    status: predicate.status,
  };
}
```
{/* example:end */}

### 3. Present the proposed relationship

Display the recording, “by artist,” and the selected group for review. The registry’s `proposed` status describes the predicate vocabulary. The application still needs to verify that this particular group performed this recording and that the terms exist before it submits a claim.

## Check the result

```sh
node examples/v2/predicate-picker/src/suggest-relationships.ts
```

For the group, the helper prints the recording ID as subject, the group ID as object, the label `by artist`, and status `proposed`. The predicate ID is `0x13d5d4ad6ae3a4e1b5043141b6ce4633c2df4646eaefc9e45eba899c45ce235b`. The album yields “Target falls outside the recommended classifications.” An empty key yields “No profile recommendation.”

## Related

[Build creation forms](/docs/build/creation-profiles), [recording relationship definitions](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/classifications/src/metadata-predicate-matrix.ts), and [predicate registry lookups](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/predicates/src/predicates.ts).
