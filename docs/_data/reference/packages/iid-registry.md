---
title: "@0xintuition/iid-registry"
sidebar_label: "IID registry"
description: "Map IIDs to classifications, ordered provider capabilities, and identifier hints offline."
kind: reference
reader: ["app", "agent"]
packages: ["@0xintuition/iid-registry"]
---

<AppliesTo />

## What it's for

The registry maps identifier schemes and values to known classifications, provider capability names, and provider hints. These are pure local lookups, not fetched provider responses.

## When to use it

Use it when a parsed identifier needs semantic meaning or an enrichment plan. A provider name does not mean its client is installed, credentials are available, or a match exists. Use [atom-enrichment](/docs/reference/packages/atom-enrichment) for provider execution; no HTTP request, cache, or credential handling happens here.

## Install

```sh
npm install @0xintuition/iid-registry@0.1.0 viem@2.31.4
```

Use ESM imports. See [installation and peer setup](/docs/build/install).

## Entry points

| Subpath | Purpose                                                                                         |
| ------- | ----------------------------------------------------------------------------------------------- |
| `.`     | Classification lookups, ordered provider plans, provider names, and typed identifier-hint maps. |

## Depends on and works with

Runtime dependencies: [`@0xintuition/classifications`](/docs/reference/packages/classifications), [`@0xintuition/iid`](/docs/reference/packages/iid).

Published peers: `viem ^2.0.0`.

## Example

{/* example:start examples/v2/identity-linking/src/package-examples.ts#provider-plan */}

```ts
import {
  classificationForIid,
  identifierHintsForIid,
  providersForIid,
} from '@0xintuition/iid-registry';

const inputIid = 'int:isrc:USRC17607839';
const classification = classificationForIid(inputIid);
const providerPlan = providersForIid(inputIid);
const hints = identifierHintsForIid(inputIid);
const unmapped = classificationForIid('int:iswc:T0345246801');
console.log({ classification, providerPlan, hints, unmapped });
```

{/* example:end */}

The ISRC maps to `music-recording`, and its plan lists `musicbrainz`, `spotify`, and `apple-music` capabilities in that order. The example performs no search and returns no recording metadata. The valid ISWC example has no mapped classification: the registry has no music-composition classification.

An empty provider plan does not make an IID invalid. Bare polymorphic values can also remain unclassified. Historical spellings that can be canonicalized may resolve through their canonical form; that does not make those spellings eligible new anchors.

## Related concepts

- [The IID registry](/docs/concepts/iid-registry)

See also [Classify and enrich atoms](/docs/build/classify-enrich).

## Source

[Package README at the pinned release](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/iid-registry/README.md).

[Canonical registry governance](https://github.com/0xIntuition/intuition-identifier/blob/3e593247c0e7cb168b37368937167ed146d3868a/spec/09-registry-governance.md) · [Canonical scheme registry](https://github.com/0xIntuition/intuition-identifier/blob/3e593247c0e7cb168b37368937167ed146d3868a/registry.json) · [Classification mapping](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/iid-registry/src/classification.ts) · [Provider plans](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/iid-registry/src/providers.ts).
