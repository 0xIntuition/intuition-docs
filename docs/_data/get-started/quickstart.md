---
title: "Quickstart: an atom ID and IID offline"
sidebar_label: "Quickstart: an atom ID and IID offline"
description: "Derive canonical recording bytes and a deterministic atom ID locally, with no wallet, RPC, account, or API key."
kind: tutorial
reader: ["app", "agent"]
packages: ["@0xintuition/primitives", "@0xintuition/iid", "@0xintuition/iid-registry"]
---

<AppliesTo />

**Time:** 10 minutes · **Steps:** 6

## What you'll build

Turn the ISRC spelling `US-RC1-76-07839` into the canonical IID `int:isrc:USRC17607839`, a P0 representation, and a deterministic atom ID. The code also proves that equivalent ISRC spellings and different companion context URIs produce the same atom bytes and ID.

This is the packages' golden canonicalization fixture. It is separate from the synthetic recording identities in the music catalog; no recording title or artist is inferred from it.

## Before you start

Use **Node 22.18 or newer** to run TypeScript directly. Installation needs npm registry access. After installation, the example runs offline with no wallet, RPC, API key, or account. It creates no remote or on-chain record.

## Steps

### 1. Check Node

```sh
node --version
```

Confirm the version is at least `v22.18.0`.

### 2. Create an ESM project

```sh
mkdir intuition-quickstart
cd intuition-quickstart
npm init -y
npm pkg set type=module
```

### 3. Install the pinned builder

```sh
npm install @0xintuition/primitives@0.1.0
```

Keep the generated lockfile. See [installation](/docs/build/install) for other package combinations and declared peers.

### 4. Save the offline example

Create `quickstart.ts`:

{/* example:start examples/v2/quickstart/quickstart.ts#quickstart */}

```ts
import assert from 'node:assert/strict';
import { buildIidAnchor } from '@0xintuition/primitives/anchor';

const result = buildIidAnchor(
  'music-recording',
  { isrc: 'US-RC1-76-07839' },
  { contextUris: ['https://example.com/recordings/1'] },
);
if (!result.success) throw new Error(result.errors.join('; '));
const atom = result.value;
assert.equal(atom.iid, 'int:isrc:USRC17607839');
assert.equal(atom.profile, 'p0');
assert.equal(atom.data, atom.iid);

const otherContext = buildIidAnchor(
  'music-recording',
  { isrc: 'USRC17607839' },
  { contextUris: ['https://example.org/alternate-evidence'] },
);
if (!otherContext.success) throw new Error(otherContext.errors.join('; '));
assert.equal(otherContext.value.data, atom.data);
assert.equal(otherContext.value.dataHex, atom.dataHex);
assert.equal(otherContext.value.id, atom.id);

console.log(atom.iid);
console.log(atom.profile);
console.log(atom.dataHex);
console.log(atom.id);
```

{/* example:end */}

`success` distinguishes a valid result from structured errors. `data` is the exact canonical IID text for this P0 atom, `dataHex` encodes those bytes, and `id` is the bytes32 protocol atom ID. Companion `contextUris` are discovery information; this code neither fetches nor uploads them.

### 5. Run the example

```sh
node quickstart.ts
```

Compare the four lines with **Run it** below. Keep the IID, profile, exact data, hex bytes, atom ID, and original identity evidence together. Deriving an ID does not prove that an atom exists on a chain or in a Core node.

### 6. Optionally inspect the IID

```sh
npm install @0xintuition/iid@0.1.0 @0xintuition/iid-registry@0.1.0
```

Save as `inspect.ts`, then run `node inspect.ts`:

{/* example:start examples/v2/quickstart/src/inspect.ts#inspect */}

```ts
import { inspectIntuitionId } from '@0xintuition/iid';
import { classificationForIid } from '@0xintuition/iid-registry';

const iid = 'int:isrc:USRC17607839';
const inspection = inspectIntuitionId(iid);
if (!inspection.valid) throw new Error(inspection.reason);
const classification = classificationForIid(iid);
console.log(inspection.valid);
console.log(classification?.slug ?? 'No classification match');
```

{/* example:end */}

This fixture prints `true` and `music-recording`. Other inputs can be invalid or have no unambiguous classification. Inspection and classification lookup do not execute provider requests.

## Run it

```sh
node quickstart.ts
```

Expected output from the pinned packages:

```text
int:isrc:USRC17607839
p0
0x696e743a697372633a555352433137363037383339
0xd3368a8190d3afd5fb05abd01db8141c09a77c3f290bb7a0ef2ffb2b5acab8d8
```

The last line is an atom ID, not an IID string. The assertions run before any output; an assertion failure or builder error stops execution.

## Next steps

- [Representation profiles](/docs/concepts/representation-profiles) explains when an IID needs contextual atom data.
- [Build a music catalog](/docs/examples/music-catalog) adds explicit artist and album triples using synthetic fixtures.
- [Your first on-chain write](/docs/get-started/first-write) creates a separate, unique testnet atom and reads your position after a deposit.
- [Protocol writes](/docs/concepts/protocol-writes) explains the separate transaction lifecycle.

Sources: [Getting started](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/docs/getting-started.md), [golden anchor tests](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/primitives/src/__tests__/anchor.test.ts).
