---
title: '@0xintuition/iid-spec'
sidebar_label: 'IID specification'
slug: /build/packages/iid-spec
sidebar_position: 1
---

The normative identifier specification and conformance corpus. Read it when implementing an identifier producer or comparing independent implementations.

Version **0.1.0-alpha.0** · [npm](https://www.npmjs.com/package/@0xintuition/iid-spec/v/0.1.0-alpha.0) · [Compatibility](../compatibility.md)

## Install

```sh
npm install @0xintuition/iid-spec@0.1.0-alpha.0
```

Use ESM imports.

## API overview

| Export or operation  | Purpose                                                                    |
| -------------------- | -------------------------------------------------------------------------- |
| `Specification`      | Grammar, classes, normalization, schemes, ladders, representation profiles |
| `Conformance corpus` | Known-answer vectors for independent implementations                       |

## Example

Read the [identifier explainer](https://github.com/0xIntuition/packages/tree/dde4fdf5774447b84cd0b820593fb0db7366e58d/packages/iid-spec/explainer.md), then use `iid` and `primitives` to implement a conforming application. Run the published conformance fixtures when producing identifiers independently.

## Usage notes

This is the contract and test data, not a network resolver. Prefer the iid implementation for application code.

## Further reading

[Source and package guide](https://github.com/0xIntuition/packages/tree/dde4fdf5774447b84cd0b820593fb0db7366e58d/packages/iid-spec) · [npm package](https://www.npmjs.com/package/@0xintuition/iid-spec/v/0.1.0-alpha.0).
