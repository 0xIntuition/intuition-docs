---
title: "@0xintuition/iid"
sidebar_label: "IID"
description: "Parse, canonicalize, validate, and derive identifier strings without network calls."
kind: reference
reader: ["app", "agent"]
packages: ["@0xintuition/iid"]
---

<AppliesTo />

## What it's for

IID implements identifier grammar, scheme canonicalization, normalization, recipe hashing, and declarative identity ladders. An IID names an entity; it is not the protocol atom ID of every representation of that entity.

## When to use it

Use `inspectIntuitionId` for a typed validity result and `SCHEMES` for explicit canonicalization. Use [ids](/docs/reference/packages/ids) to hash atom bytes, [primitives](/docs/reference/packages/primitives) to select a representation, and [iid-registry](/docs/reference/packages/iid-registry) for meaning and provider plans. Parsing or passing validation does not prove a record exists at an external registry.

## Install

```sh
npm install @0xintuition/iid@0.1.0 viem@2.31.4
```

Use ESM imports. See [installation and peer setup](/docs/build/install).

## Entry points

| Subpath | Purpose                                                                                                             |
| ------- | ------------------------------------------------------------------------------------------------------------------- |
| `.`     | Parsing, validation, inspection, scheme canonicalizers, NORM-1, gen1 derivation, and the declarative ladder engine. |

## Depends on and works with

Runtime dependencies: none.

Published peers: `viem ^2.0.0`.

## Example

{/* example:start examples/v2/identity-linking/src/package-examples.ts#inspect-iid */}

```ts
import { inspectIntuitionId, SCHEMES } from '@0xintuition/iid';

const canonicalIsrc = SCHEMES.isrc.canonicalize('US-RC1-76-07839');
if (canonicalIsrc === undefined) throw new Error('Invalid ISRC');
const identifier = `int:isrc:${canonicalIsrc}`;
const inspection = inspectIntuitionId(identifier);
if (!inspection.valid) throw new Error(inspection.reason);
console.log({ iid: identifier, anchorEligible: inspection.anchorEligible });
```

{/* example:end */}

This separate ISRC conformance example produces `int:isrc:USRC17607839`; it is not an identifier for the synthetic catalog recording. Canonicalization can return `undefined`. Inspection distinguishes a non-canonical spelling from an unknown or invalid scheme; a non-canonical result can offer a `canonical` value, but it is not a valid new anchor.

Validity and bare P0 eligibility are separate. Class C recipe-derived identifiers need P1 evidence. Bare polymorphic identifiers also require a typed envelope. The package implements additional identifier forms beyond the pinned canonical source; see the [specification differences](/docs/reference/packages/iid-spec).

## Related concepts

Read [Representation profiles](/docs/concepts/representation-profiles) and the [offline quickstart](/docs/get-started/quickstart).

## Source

[Package README at the pinned release](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/iid/README.md).

[Canonical grammar](https://github.com/0xIntuition/intuition-identifier/blob/3e593247c0e7cb168b37368937167ed146d3868a/spec/02-grammar.md) · [Canonical normalization](https://github.com/0xIntuition/intuition-identifier/blob/3e593247c0e7cb168b37368937167ed146d3868a/spec/04-normalization.md) · [Canonical representation profiles](https://github.com/0xIntuition/intuition-identifier/blob/3e593247c0e7cb168b37368937167ed146d3868a/spec/07-representation-profiles.md) · [Inspection implementation](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/iid/src/parse.ts).
