---
title: "@0xintuition/iid-spec"
sidebar_label: "IID specification"
description: "Read the packaged IID specification and conformance data alongside the canonical identifier specification."
kind: reference
reader: ["app", "agent"]
packages: ["@0xintuition/iid-spec"]
---

<AppliesTo />

## What it's for

This package distributes IID specification documents and machine-readable conformance fixtures. It has no JavaScript runtime API; the canonical authority for these docs is the separate Intuition Identifier specification.

## When to use it

Use the documents and fixtures to implement or compare identifier producers. Use [iid](/docs/reference/packages/iid) for application parsing and derivation, and [iid-registry](/docs/reference/packages/iid-registry) for classification and provider planning. The packaged copy differs from the canonical source, so a package fixture alone does not establish canonical-spec conformance.

## Install

```sh
npm install @0xintuition/iid-spec@0.1.0
```

The JSON artifacts can be read from Node; there is no root runtime export.

## Entry points

| Subpath                | Purpose                                                                                                                     |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `./conformance/*.json` | Machine-readable fixture documents, including canonicalization, parsing, validation, normalization, and derivation vectors. |

## Depends on and works with

Runtime dependencies: none.

Published peers: none.

## Example

This Node example loads a published data artifact through its exported path; it does not invent a runtime import from the package root.

{/* example:start examples/v2/identity-linking/src/package-examples.ts#conformance-data */}

```ts
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const vectorsPath = require.resolve(
  '@0xintuition/iid-spec/conformance/canonicalization.json',
);
const packagedVectors: unknown = JSON.parse(readFileSync(vectorsPath, 'utf8'));
console.log({ loadedConformanceDocument: typeof packagedVectors === 'object' });
```

{/* example:end */}

For an independent implementation, compare against the canonical [registry](https://github.com/0xIntuition/intuition-identifier/blob/3e593247c0e7cb168b37368937167ed146d3868a/registry.json) and [test vectors](https://github.com/0xIntuition/intuition-identifier/blob/3e593247c0e7cb168b37368937167ed146d3868a/test-vectors.json) as well as the packaged corpus. Loading the file is not a conformance test.

:::info Canonical and packaged specifications differ

The canonical specification is version 0.1.0. Its §7.8 distinguishes identity data from companion metadata. The package copy omits §7.8, accepts typed `wd` values and adds the `apple-podcasts`, `letterboxd` and `podcast-index` schemes. Both sources define weak `acct` handles. The package makes that form ineligible for P0 and sets P1 as its minimum profile. The identifier bytes stay the same. Chapters 00, 01, 04, 05 and 09 also differ. [Canonical representation profiles](https://github.com/0xIntuition/intuition-identifier/blob/3e593247c0e7cb168b37368937167ed146d3868a/spec/07-representation-profiles.md#78-the-atom-creation-model-data-and-companion-metadata) · [Canonical account scheme](https://github.com/0xIntuition/intuition-identifier/blob/3e593247c0e7cb168b37368937167ed146d3868a/schemes/acct.md) · [Packaged amendments](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/iid-spec/spec/09-registry-governance.md#97-pre-publication-amendments)

:::

## Related concepts

- [The Intuition Identifier (IID)](/docs/concepts/iid)
- [Schemes and canonical form](/docs/concepts/iid-schemes)

## Source

[Package README at the pinned release](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/iid-spec/README.md).

[Canonical specification](https://github.com/0xIntuition/intuition-identifier/blob/3e593247c0e7cb168b37368937167ed146d3868a/spec/00-overview.md) · [Canonical registry governance](https://github.com/0xIntuition/intuition-identifier/blob/3e593247c0e7cb168b37368937167ed146d3868a/spec/09-registry-governance.md) · [Packaged representation profiles](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/iid-spec/spec/07-representation-profiles.md).
