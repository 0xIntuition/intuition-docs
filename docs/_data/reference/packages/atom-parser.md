---
title: '@0xintuition/atom-parser'
sidebar_label: 'Atom parser'
description: 'Detect and normalize atom inputs locally, or explicitly inspect remote content under a bounded transport policy.'
kind: reference
reader: ["app", "plugin"]
packages: ["@0xintuition/atom-parser"]
---

<AppliesTo />

## What it's for

Detect and normalize IIDs, text, JSON objects and arrays, URLs, IPFS URIs, addresses, names, and ISBNs into a `ParseResult`. Parsing identifies the input's shape; it does not resolve the entity, assign a canonical classification, or create an atom on-chain.

## When to use it

Use local detection before choosing a classification plugin or asking a reader to confirm an input. Set `remoteFetch: false` for local processing. URL and IPFS inspection is enabled by default, so a parser call is not inherently offline.

## Install

```sh
npm install @0xintuition/atom-parser@0.1.0
```

Use ESM with Node 22+ or Bun for the complete parser workflow.

## Entry points

| Subpath | Purpose |
| --- | --- |
| `.` | Parser, local detection, IID candidates, remote inspection, and types |
| `./types` | Parse results, options, remote outcomes, and `ParseError` |
| `./detect` | Local input detection |
| `./remote` | Bounded remote inspection and content detection |
| `./parse` | `parseAtom` entry point |
| `./iid` | Inspect IID-shaped candidates |
| `./ssrf` | Destination checks and pinned HTTP transport contracts |
| `./testing/dns` | Inject DNS behavior for isolated tests |

## Depends on and works with

Runtime package dependency: [iid](/docs/reference/packages/iid). Peer dependencies: none. The runtime dependency graph lists Intuition packages; the package manifest additionally declares `multiformats` and `viem` as ordinary dependencies.

Pass parsed evidence into an explicitly configured [classification engine](/docs/reference/packages/atom-classification). A structured-document candidate can contain schema types and URL hints, but those hints are not a persisted classification.

## Example

This bounded fixed URL is normalized without fetching a page. Narrow on `kind` before reading variant-specific fields.

{/* example:start examples/v2/music-catalog/src/package-examples/parser.ts#local-parser */}
```ts
import { parseAtom, ParseError } from '@0xintuition/atom-parser';

export const parsed = await parseAtom('https://example.com/catalog', {
  remoteFetch: false,
  maxInputBytes: 1024,
});
if (parsed.kind === 'url') {
  console.log(parsed.canonicalUrl, parsed.remote === undefined);
}

try {
  await parseAtom('', { remoteFetch: false });
} catch (error) {
  if (!(error instanceof ParseError)) throw error;
  console.log(error.code);
}
```
{/* example:end */}

The URL has no `remote` result, and empty input throws `ParseError` with code `EMPTY_INPUT`. Other input errors include `INPUT_TOO_LARGE` and invalid gateway configuration. `parseIidCandidate` returns `undefined` for non-IID input; an invalid IID-shaped candidate has `valid: false`, a reason, and no canonical IID. Detection is not proof that an identifier belongs to a particular entity.

Default limits are 16,384 input bytes, three redirects, 1 MiB response bytes, and 256 KiB inspected bytes. The request deadline is five seconds, or eight for IPFS; `connectTimeoutMs` does not enforce a separate connection deadline. IPFS inspection requires an explicit gateway. Remote outcomes include success, skipped, denied, timeout, error, oversized, and redirect-limit exhaustion; inspect warnings and the outcome before using remote evidence.

The pinned Node transport resolves and vets destinations, pins the approved address, and repeats checks on redirects. The older transport paragraph in the README does not describe this implementation; the linked source and transport test do. A custom transport must preserve the pinned-request contract, and your host still owns egress controls.

## Related concepts

- [Atom parsing](/docs/concepts/atom-parsing)

See also [Classify and enrich atoms](/docs/build/classify-enrich).

## Source

[Package README](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/atom-parser/README.md), [public parser](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/atom-parser/src/parse.ts), and [pinned-transport test](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/atom-parser/__tests__/pinned-transport.test.ts).
