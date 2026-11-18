---
title: "sameAs identity linking"
sidebar_label: "sameAs identity linking"
description: "Review archived catalog data against three candidate atoms, then inspect the exact sameAs triple produced for the approved recording."
kind: tutorial
reader: ["app"]
packages: ["@0xintuition/primitives", "@0xintuition/predicates", "@0xintuition/iid"]
---

<AppliesTo />

**Time:** 15 minutes · **Steps:** 3

## What you'll build

Review three candidates for an archived recording. One carries the same recording identifier, one is a review article, and one has only a matching title. The result is an offline plan containing a directed `sameAs` triple for the approved pair and a reason for each skipped candidate.

## Before you start

Use Node.js 22.21.0. From the documentation repository root at the revision in **Full source**, install the example workspace once. npm needs registry access for installation. The runner uses only local data.

```sh
cd examples/v2
npm ci --ignore-scripts
```

Read [sameAs and identity linking](/docs/concepts/same-as) for the meaning of the claim. See [Install the packages](/docs/build/install) for the pinned packages. All catalog evidence below is synthetic.

## Steps

### 1. Preserve the historical atom bytes

The archive contains an exact UTF-8 JSON string with a reference URL in its `sameAs` property. The newer recording anchor contains a bare IID. The fixtures call `stringToHex` on each original text string. Parsing and serializing the JSON again could change the bytes used to identify that atom. UTF-8 text such as `0x6162` encodes as `0x307836313632`. If your catalog already stores binary bytes in hex, supply them directly. The two bytes `0x6162` identify a different atom.

{/* example:start examples/v2/identity-linking/src/linking-plan.ts#archived-records */}

```ts
import { stringToHex } from 'viem';

const recordingIid = 'int:isrc:USRC12600001';
export const archive = {
  level: 'recording' as const,
  atomData: stringToHex(
    '{"name":"Paper Moon Demo","sameAs":["https://example.org/recordings/17"]}',
  ),
  recordingIid,
};

export const candidates = {
  anchor: {
    level: 'recording',
    atomData: stringToHex(recordingIid),
    recordingIid,
  },
  review: {
    level: 'article',
    atomData: stringToHex('Review of Paper Moon Demo'),
    recordingIid,
  },
  namesake: {
    level: 'recording',
    atomData: stringToHex('{"name":"Paper Moon Demo"}'),
  },
} as const;
```

{/* example:end */}

The URL inside the JSON is part of the archived payload. A graph edge requires a separate predicate atom and two term IDs. Keep the recording-level evidence beside the original data while reviewing candidates.

### 2. Record each decision and its evidence

The fixture editor compared the two catalog records and confirmed the same take and recording code. The critic’s article cites the recording but describes a different entity. The namesake has no recording identifier to distinguish it from a different take.

{/* example:start examples/v2/identity-linking/src/run-linking.ts#review-decisions */}

```ts
  const recording = {
    candidate: 'anchor' as const,
    evidence:
      'The two catalog records credit the same take and list the same recording code.',
  };
  const accepted = reviewLink({ ...recording, approved: true });
  const waiting = reviewLink({ ...recording, approved: false });
  const article = reviewLink({
    candidate: 'review',
    approved: false,
    evidence: 'The critic cites the recording in a review.',
  });
  const namesake = reviewLink({
    candidate: 'namesake',
    approved: false,
    evidence: 'Only the title matches.',
  });
```

{/* example:end */}

The second call for the same recording pair exercises the pending case. A matching identifier supplies evidence. The reviewer supplies approval. This example assigns no confidence score.

### 3. Plan the ordered claim

The review wrapper requires an evidence note and passes the archived bytes, candidate, and explicit decision to `planLink`.

{/* example:start examples/v2/identity-linking/src/linking-plan.ts#apply-review */}

```ts
type Decision = {
  candidate: keyof typeof candidates;
  approved: boolean;
  evidence: string;
};

export function reviewLink({ candidate, approved, evidence }: Decision) {
  if (!evidence.trim())
    return { candidate, reason: 'Record the evidence for review.' };
  const result = planLink(archive, candidates[candidate], approved);
  return { candidate, evidence, ...result };
}
```

{/* example:end */}

The [link planner](/docs/build/link-identities) checks the entity level, inspects both IIDs, and requires matching canonical ISRC identifiers for this fixture. After approval it derives each atom ID from the original payload, rejects identical term IDs, and builds the ordered `sameAs` triple. Both original atoms keep their IDs and bytes. This local plan makes no changes to either record and submits no transaction.

## Run it

From `examples/v2`, run the TypeScript entrypoint.

```sh
node identity-linking/src/run-linking.ts
```

```text
Subject 0x70e43f5beab9b630229717d40da0874927cd3cf2a4d9f34979e4e88abb60b4ab
sameAs 0x1908b7994ca437c84c67a4799ae710355591790a726bf5890277f3aa70828c0a
Object 0xfdbf117d9e9df5675c5b4f75747598424fc9beb2d2a50e20408f4cd4dfb3d4ed
Triple 0xc40d319e82c15a049aa3688e2a4cc0fbc51441f05311ad403beaba3382496ef1
anchor Awaiting review
review Different entity level
namesake Missing recording identifier
```

The subject is the archived JSON atom. The object is the bare recording IID atom. The middle ID belongs to the registry’s `sameAs` predicate. The fourth ID identifies the proposed edge itself.

## Full source

[Review fixtures, link planner, and runner](https://github.com/0xIntuition/intuition-docs/tree/84242e8f4399ac758c942e85b343e0512245a6cf/examples/v2/identity-linking). The [canonical equivalence discussion](https://github.com/0xIntuition/intuition-identifier/blob/3e593247c0e7cb168b37368937167ed146d3868a/spec/08-equivalence.md) describes the role of reviewed claims. Compare the package’s [identity example](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/examples/hackathon-quickstart/src/identity-linking.ts), [review interface](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/examples/hackathon-quickstart/src/IdentityLinkingPage.tsx), [IID inspection](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/iid/src/parse.ts), and [triple builder](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/primitives/src/triple.ts).

## Next steps

Use [Derive IDs](/docs/build/derive-ids) to trace a single recording from identifier to term ID, or follow the [music catalog tutorial](/docs/examples/music-catalog) to model artist and album relationships.
