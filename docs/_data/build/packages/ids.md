---
title: '@0xintuition/ids'
sidebar_label: 'IDs'
slug: /build/packages/ids
sidebar_position: 5
---

Calculate deterministic atom, predicate, triple, counter-triple, and authentication-related IDs.

Version **0.1.0-alpha.1** · [npm](https://www.npmjs.com/package/@0xintuition/ids/v/0.1.0-alpha.1) · [Compatibility](../compatibility.md)

## Install

```sh
npm install @0xintuition/ids@0.1.0-alpha.1 viem@^2
```

Use ESM imports. Required peers: `viem ^2.0.0`.

## API overview

| Export or operation                             | Purpose                                                  |
| ----------------------------------------------- | -------------------------------------------------------- |
| `calculateAtomId(data)`                         | Protocol atom ID from the exact string representation    |
| `calculateTripleId(subject, predicate, object)` | Deterministic triple ID                                  |
| `I_SUBJECT_ID`                                  | ID of the literal first-person subject I                 |
| `calculateAuthUserAtomId(input)`                | ID for the versioned normalized auth-user representation |

## Example

```ts
import { calculateAtomId, I_SUBJECT_ID } from '@0xintuition/ids';
console.log(calculateAtomId('I') === I_SUBJECT_ID);
```

## Usage notes

These helpers do not register a term. Do not confuse an IID, a protocol ID, and an encoded payload. The auth-user hash is a deterministic public identifier, not encryption of a secret.

## Further reading

[Source and package guide](https://github.com/0xIntuition/packages/tree/dde4fdf5774447b84cd0b820593fb0db7366e58d/packages/ids) · [npm package](https://www.npmjs.com/package/@0xintuition/ids/v/0.1.0-alpha.1).
