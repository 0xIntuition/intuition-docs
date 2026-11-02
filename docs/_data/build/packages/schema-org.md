---
title: '@0xintuition/schema-org guide'
slug: /build/packages/schema-org
sidebar_position: 6
---

Look up the pinned schema.org vocabulary and inherited properties for forms and tooling.

Published alpha version: **0.1.0-alpha.1**. [Release compatibility](../compatibility.md) records npm publication, peer dependencies, and deployment boundaries.

## Install

```sh
npm install @0xintuition/schema-org@0.1.0-alpha.1
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

[Source and package guide](https://github.com/0xIntuition/packages/tree/dde4fdf5774447b84cd0b820593fb0db7366e58d/packages/schema-org) · [npm package](https://www.npmjs.com/package/@0xintuition/schema-org/v/0.1.0-alpha.1). The [machine-readable manifest](/intuition-release.json) lists all declared public subpaths and peer dependencies. Exact npm versions, tarball integrity, and observed dist-tags are recorded in the manifest.
