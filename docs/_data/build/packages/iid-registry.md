---
title: '@0xintuition/iid-registry guide'
slug: /build/packages/iid-registry
sidebar_position: 3
---

Resolve identifier meaning and provider capabilities without HTTP or credentials.

Candidate source version: **0.1.0-alpha.0**. [Release compatibility](../compatibility.md) explains publication and deployment prerequisites.

## Install

```sh
npm install @0xintuition/iid-registry@0.1.0-alpha.0 viem@^2
```

Use ESM imports. Required peers: `viem ^2.0.0`.

## Main surface

| Export or operation          | Purpose                                                            |
| ---------------------------- | ------------------------------------------------------------------ |
| `classificationForIid(iid)`  | Classification for a value, or undefined when unmapped/polymorphic |
| `providersForIid(iid)`       | Ordered provider capability slugs                                  |
| `identifierHintsForIid(iid)` | Typed identifier hints for downstream providers                    |

## First use

```ts
import {
  classificationForIid,
  providersForIid,
} from '@0xintuition/iid-registry';
const iid = 'int:isrc:USRC17607839';
console.log(classificationForIid(iid), providersForIid(iid));
```

## Integration decisions

An empty provider plan does not mean an invalid IID. A listed provider is a capability, not a guarantee of installed code, credentials, availability, or an HTTP result.

## Source and full contract

[Source and package guide](https://github.com/0xIntuition/packages/tree/1dc7103d2a05f23bc565a81df4b001336ce9ba53/packages/iid-registry) · [npm package](https://www.npmjs.com/package/@0xintuition/iid-registry). The [machine-readable manifest](/intuition-release.json) lists all declared public subpaths and peer dependencies. Npm links name the intended package; this page does not assert that the candidate has been published.
