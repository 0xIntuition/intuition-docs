---
title: '@0xintuition/iid-spec guide'
slug: /build/packages/iid-spec
sidebar_position: 1
---

The normative identifier specification and conformance corpus. Read it when implementing an identifier producer or comparing independent implementations.

Published alpha version: **0.1.0-alpha.0**. [Release compatibility](../compatibility.md) records npm publication, peer dependencies, and deployment boundaries.

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

Read the [identifier explainer](https://github.com/0xIntuition/packages/tree/dde4fdf5774447b84cd0b820593fb0db7366e58d/packages/iid-spec/explainer.md), then use `iid` and `primitives` to implement a conforming application. Run the published conformance fixtures when producing identifiers independently.

## Integration decisions

This is the contract and test data, not a network resolver. Prefer the iid implementation for application code.

## Source and full contract

[Source and package guide](https://github.com/0xIntuition/packages/tree/dde4fdf5774447b84cd0b820593fb0db7366e58d/packages/iid-spec) · [npm package](https://www.npmjs.com/package/@0xintuition/iid-spec/v/0.1.0-alpha.0). The [machine-readable manifest](/intuition-release.json) lists all declared public subpaths and peer dependencies. Exact npm versions, tarball integrity, and observed dist-tags are recorded in the manifest.
