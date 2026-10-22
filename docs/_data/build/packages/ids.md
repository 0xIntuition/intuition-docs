---
title: '@0xintuition/ids guide'
slug: /build/packages/ids
sidebar_position: 5
---

Calculate deterministic atom, predicate, triple, counter-triple, and authentication-related IDs.

Candidate source version: **0.1.0-alpha.1**. [Release compatibility](../compatibility.md) explains publication and deployment prerequisites.

## Install

```sh
npm install @0xintuition/ids@0.1.0-alpha.1 viem@^2
```

Use ESM imports. Required peers: `viem ^2.0.0`.

## Main surface

| Export or operation                             | Purpose                                                  |
| ----------------------------------------------- | -------------------------------------------------------- |
| `calculateAtomId(data)`                         | Protocol atom ID from the exact string representation    |
| `calculateTripleId(subject, predicate, object)` | Deterministic triple ID                                  |
| `I_SUBJECT_ID`                                  | ID of the literal first-person subject I                 |
| `calculateAuthUserAtomId(input)`                | ID for the versioned normalized auth-user representation |

## First use

```ts
import { calculateAtomId, I_SUBJECT_ID } from '@0xintuition/ids';
console.log(calculateAtomId('I') === I_SUBJECT_ID);
```

## Integration decisions

These helpers do not register a term. Do not confuse an IID, a protocol ID, and an encoded payload. The auth-user hash is a deterministic public identifier, not encryption of a secret.

## Source and full contract

[Source and package guide](https://github.com/0xIntuition/packages/tree/1dc7103d2a05f23bc565a81df4b001336ce9ba53/packages/ids) · [npm package](https://www.npmjs.com/package/@0xintuition/ids). The [machine-readable manifest](/intuition-release.json) lists all declared public subpaths and peer dependencies. Npm links name the intended package; this page does not assert that the candidate has been published.
