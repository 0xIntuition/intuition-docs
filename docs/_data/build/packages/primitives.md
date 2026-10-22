---
title: '@0xintuition/primitives guide'
slug: /build/packages/primitives
sidebar_position: 9
---

Build atoms and triples with validated, deterministic public helpers.

Candidate source version: **0.1.0-alpha.1**. [Release compatibility](../compatibility.md) explains publication and deployment prerequisites.

## Install

```sh
npm install @0xintuition/primitives@0.1.0-alpha.1 viem@^2
```

Use ESM imports. Required peers: `viem ^2.0.0`.

## Main surface

| Export or operation                            | Purpose                                                             |
| ---------------------------------------------- | ------------------------------------------------------------------- |
| `buildIidAnchor(slug, values, options?)`       | BuildResult with exact bytes, ID, profile, nullable IID and context |
| `buildAtomAnchor`                              | Alias of buildIidAnchor                                             |
| `buildEthereumAccount(values)`                 | Validated compatibility atom builder                                |
| `buildTripleByName(subjectId, name, objectId)` | BuildResult resolving a canonical predicate                         |

## First use

```ts
import { buildIidAnchor } from '@0xintuition/primitives/anchor';
const built = buildIidAnchor('music-recording', { isrc: 'USRC17607839' });
if (!built.success) throw new Error(built.errors.join('; '));
console.log(built.value);
```

## Integration decisions

Always narrow BuildResult.success. Context URIs never affect the atom ID. The candidateIid option is a distinct validation path; read its contract before using imported provider identifiers.

## Source and full contract

[Source and package guide](https://github.com/0xIntuition/packages/tree/1dc7103d2a05f23bc565a81df4b001336ce9ba53/packages/primitives) · [npm package](https://www.npmjs.com/package/@0xintuition/primitives). The [machine-readable manifest](/intuition-release.json) lists all declared public subpaths and peer dependencies. Npm links name the intended package; this page does not assert that the candidate has been published.
