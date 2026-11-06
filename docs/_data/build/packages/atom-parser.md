---
title: '@0xintuition/atom-parser guide'
slug: /build/packages/atom-parser
sidebar_position: 10
---

Detect and normalize IIDs, raw strings, JSON objects/arrays, URLs, IPFS, addresses, names, and ISBNs.

Published alpha version: **0.1.0-alpha.0**. [Release compatibility](../compatibility.md) records npm publication, peer dependencies, and deployment boundaries.

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

## Parse an identifier

```ts
import { parseIidCandidate } from '@0xintuition/atom-parser/iid';

const candidate = parseIidCandidate('int:isrc:US-RC1-76-07839');
if (candidate?.valid) {
  console.log(candidate.canonicalIid, candidate.anchorEligible);
} else {
  console.log(candidate?.reason ?? 'Input is not an IID');
}
```

`parseIidCandidate` returns `undefined` for non-IID input. Invalid IID-shaped input has `valid: false`, a reason, and `canonicalIid: null`. `parseAtom` exposes this as the `iid` variant of `ParseResult`; narrow on `kind` before reading kind-specific fields.

Structured JSON from inline input or remote documents can produce a `structuredDocument` candidate with schema types and URL hints. This is parsed evidence, not a persisted classification.

## Limits and errors

Defaults bound input to 16,384 UTF-8 bytes, redirects to 3, response bytes to 1 MiB, and inspected bytes to 256 KiB. The per-request timeout is 5 seconds (8 seconds for IPFS). `connectTimeoutMs` is retained but does not enforce a separate connection deadline. IPFS inspection needs an explicit gateway.

Remote outcomes include `success`, `skipped`, `denied`, `timeout`, `error`, `oversized`, and `redirect_limit_exceeded`; inspect `remote` and `warnings` rather than assuming a URL was fetched. Invalid top-level input throws `ParseError` with codes such as `EMPTY_INPUT` and `INPUT_TOO_LARGE`.

## Integration decisions

URL/IPFS inspection is on by default; set `remoteFetch: false` for local detection. The published Node transport resolves DNS, rejects restricted destinations by default, and pins the vetted address while preserving the hostname for TLS. It repeats policy checks for redirects. If you inject a custom fetcher through `inspectRemote`, it must honor the pinned request contract; application egress policy remains your responsibility. Use Node 22+ for the complete parser workflow.

## Source and full contract

[Source and package guide](https://github.com/0xIntuition/packages/tree/dde4fdf5774447b84cd0b820593fb0db7366e58d/packages/atom-parser) · [npm package](https://www.npmjs.com/package/@0xintuition/atom-parser/v/0.1.0-alpha.0). The [machine-readable manifest](/intuition-release.json) lists all declared public subpaths and peer dependencies. Exact npm versions, tarball integrity, and observed dist-tags are recorded in the manifest.
