---
title: '@0xintuition/schema-org guide'
slug: /build/packages/schema-org
sidebar_position: 6
---

Look up the pinned schema.org vocabulary and inherited properties for forms and tooling.

Candidate source version: **0.1.0-alpha.0**. [Release compatibility](../compatibility.md) explains publication and deployment prerequisites.

## Install

```sh
npm install @0xintuition/schema-org@0.1.0-alpha.0
```

Use ESM imports.

## Main surface

| Export or operation      | Purpose                                     |
| ------------------------ | ------------------------------------------- |
| `getType(name)`          | Type record or undefined                    |
| `getPropertiesFor(name)` | Resolved property list including originType |
| `schemaOrgBook`          | Named Book export from the Book subpath     |

## First use

```ts
import { getPropertiesFor } from '@0xintuition/schema-org';
console.log(getPropertiesFor('Book').find((p) => p.name === 'name'));
```

## Integration decisions

The snapshot is schema.org V30.0. The vocabulary supplies schema metadata, while classifications decides which fields an Intuition creation flow recommends.

## Source and full contract

[Source and package guide](https://github.com/0xIntuition/packages/tree/1dc7103d2a05f23bc565a81df4b001336ce9ba53/packages/schema-org) · [npm package](https://www.npmjs.com/package/@0xintuition/schema-org). The [machine-readable manifest](/intuition-release.json) lists all declared public subpaths and peer dependencies. Npm links name the intended package; this page does not assert that the candidate has been published.
