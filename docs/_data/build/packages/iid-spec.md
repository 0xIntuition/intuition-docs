---
title: '@0xintuition/iid-spec guide'
slug: /build/packages/iid-spec
sidebar_position: 1
---

The normative identifier specification and conformance corpus. Read it when implementing an identifier producer or comparing independent implementations.

Candidate source version: **0.1.0-alpha.0**. [Release compatibility](../compatibility.md) explains publication and deployment prerequisites.

## Install

```sh
npm install @0xintuition/iid-spec@0.1.0-alpha.0
```

Use ESM imports.

## Main surface

| Export or operation  | Purpose                                                                    |
| -------------------- | -------------------------------------------------------------------------- |
| `Specification`      | Grammar, classes, normalization, schemes, ladders, representation profiles |
| `Conformance corpus` | Known-answer vectors for independent implementations                       |

## First use

Read the [identifier explainer](https://github.com/0xIntuition/packages/tree/1dc7103d2a05f23bc565a81df4b001336ce9ba53/packages/iid-spec/explainer.md), then use `iid` and `primitives` to implement a conforming application. Run the published conformance fixtures when producing identifiers independently.

## Integration decisions

This is the contract and test data, not a network resolver. Prefer the iid implementation for application code.

## Source and full contract

[Source and package guide](https://github.com/0xIntuition/packages/tree/1dc7103d2a05f23bc565a81df4b001336ce9ba53/packages/iid-spec) · [npm package](https://www.npmjs.com/package/@0xintuition/iid-spec). The [machine-readable manifest](/intuition-release.json) lists all declared public subpaths and peer dependencies. Npm links name the intended package; this page does not assert that the candidate has been published.
