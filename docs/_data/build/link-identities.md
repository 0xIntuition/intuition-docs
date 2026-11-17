---
title: Link identities with sameAs
sidebar_label: Link identities with sameAs
description: Review the evidence for two distinct recording atoms and prepare a sameAs claim while preserving both original payloads and IDs.
kind: how-to
reader: ["app"]
packages: ["@0xintuition/primitives", "@0xintuition/predicates", "@0xintuition/iid"]
---

<AppliesTo />

Prepare a `sameAs` triple when two existing atoms refer to the same recording and a reviewer has checked the evidence.

## Before you start

Retain the exact original bytes for both atoms, their entity levels, and the source records used to identify them. Read [sameAs](/docs/concepts/same-as) and [triples](/docs/concepts/triples).

For your own project, follow [Install the packages](/docs/build/install). To run the [offline example](https://github.com/0xIntuition/intuition-docs/blob/c3b1eaa91a822bb59b20cb6de2bc9b874a00b7b0/examples/v2/identity-linking/src/link-identities.ts), install its locked dependencies from the documentation repository root with Node.js 22.21.0.

```sh
npm ci --prefix examples/v2 --ignore-scripts
```

## Steps

### 1. Compare the two source records

In the synthetic catalog, the older atom stores a JSON payload with a title and a catalog URL in its `sameAs` field. The newer atom stores the bare IID `int:isrc:USRC17607839`. The catalog editor has verified that both source entries describe the recording with that ISRC. The URL in the older payload is a reference the editor can inspect. Adding another URL would change those serialized bytes and produce a different atom ID.

### 2. Screen the candidates and record the review

Check what each candidate identifies before comparing its identifiers. A review article can quote the exact ISRC while identifying a different entity. A second recording can share a title while carrying a different ISRC. Leave candidates with missing evidence for later review. This catalog requires a matching canonical ISRC and explicit approval for this particular workflow. Other domains need evidence appropriate to their entity level.

{/* example:start examples/v2/identity-linking/src/link-identities.ts#reviewed-link */}
```ts
import { inspectIntuitionId } from '@0xintuition/iid';
import { calculateAtomId } from '@0xintuition/ids';
import { sameAsId } from '@0xintuition/predicates/sameAs';
import { buildTriple } from '@0xintuition/primitives/triple';

type CatalogRecord = {
  atomData: string;
  level: 'recording' | 'article';
  recordingIid?: string;
};

export function planLink(
  left: CatalogRecord,
  right: CatalogRecord,
  reviewerApproved: boolean,
) {
  if (left.level !== 'recording' || right.level !== 'recording')
    return { reason: 'Different entity level' };
  if (!left.recordingIid || !right.recordingIid)
    return { reason: 'Missing recording identifier' };
  const a = inspectIntuitionId(left.recordingIid);
  const b = inspectIntuitionId(right.recordingIid);
  if (
    !a.valid ||
    !b.valid ||
    a.scheme !== 'isrc' ||
    b.scheme !== 'isrc' ||
    a.iid !== b.iid
  ) {
    return { reason: 'Recording identifiers do not match' };
  }
  if (!reviewerApproved) return { reason: 'Awaiting review' };
  const subjectId = calculateAtomId(left.atomData);
  const objectId = calculateAtomId(right.atomData);
  if (subjectId === objectId) return { reason: 'Already the same atom' };
  const claim = buildTriple(subjectId, 'sameAs', objectId);
  if (!claim.success) throw new Error(claim.errors.join(', '));
  return { claim: claim.value };
}
```
{/* example:end */}

### 3. Review the edge before creating it

Hash the original payloads as supplied. For stored binary data, pass its hex bytes through unchanged. Compare the printed subject, predicate, and object IDs with the intended terms. The locally built triple is a proposal. To publish the reviewed edge, follow [Create triples](/docs/build/create-triples). Both original atom IDs continue to identify their respective payloads.

## Check the result

```sh
node examples/v2/identity-linking/src/link-identities.ts
```

The accepted fixture prints two distinct atom IDs and the claim ID `0x84c9260e71757e9c7d5e33fa8bd370a7794160910b8e59ced21cb4e27911402f`. The article produces “Different entity level,” the title alone produces “Missing recording identifier,” and the second recording produces “Recording identifiers do not match.” A matching pair without approval remains “Awaiting review.”

## Related

[Identity ladders](/docs/concepts/identity-ladder), [equivalence and candidate review](https://github.com/0xIntuition/intuition-identifier/blob/3e593247c0e7cb168b37368937167ed146d3868a/spec/08-equivalence.md), [IID inspection](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/iid/src/parse.ts), and [triple blueprints](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/primitives/src/triple.ts).
