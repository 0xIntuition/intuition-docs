---
title: '@0xintuition/atom-parser guide'
slug: /build/packages/atom-parser
sidebar_position: 10
---

Detect and normalize raw strings, JSON objects/arrays, URLs, IPFS, addresses, names, and ISBNs.

Candidate source version: **0.1.0-alpha.0**. [Release compatibility](../compatibility.md) explains publication and deployment prerequisites.

## Install

```sh
npm install @0xintuition/atom-parser@0.1.0-alpha.0
```

Use ESM imports.

## Main surface

| Export or operation          | Purpose                                       |
| ---------------------------- | --------------------------------------------- |
| `parseAtom(input, options?)` | Promise of ParseResult, discriminated by kind |
| `detectLocal`                | Local input detection                         |
| `inspectRemote`              | Bounded remote content inspection             |
| `ParseError`                 | Structured input/configuration errors         |

## First use

```ts
import { parseAtom } from '@0xintuition/atom-parser';
console.log(await parseAtom('https://example.com', { remoteFetch: false }));
```

## Integration decisions

URL/IPFS inspection is on by default; set remoteFetch: false for local-only detection. Network restrictions do not prevent DNS rebinding; service operators own egress controls. Use Node 22+ for this runtime.

## Source and full contract

[Source and package guide](https://github.com/0xIntuition/packages/tree/1dc7103d2a05f23bc565a81df4b001336ce9ba53/packages/atom-parser) · [npm package](https://www.npmjs.com/package/@0xintuition/atom-parser). The [machine-readable manifest](/intuition-release.json) lists all declared public subpaths and peer dependencies. Npm links name the intended package; this page does not assert that the candidate has been published.
