---
title: '@0xintuition/schema-org'
sidebar_label: 'Schema.org'
slug: /build/packages/schema-org
sidebar_position: 6
---

Look up the pinned schema.org vocabulary and inherited properties for forms and tooling.

Version **0.1.0-alpha.1** · [npm](https://www.npmjs.com/package/@0xintuition/schema-org/v/0.1.0-alpha.1) · [Compatibility](../compatibility.md)

## Install

```sh
npm install @0xintuition/schema-org@0.1.0-alpha.1
```

Use ESM imports.

## API overview

| Export or operation      | Purpose                                     |
| ------------------------ | ------------------------------------------- |
| `getType(name)`          | Type record or undefined                    |
| `getPropertiesFor(name)` | Resolved property list including originType |
| `schemaOrgBook`          | Named Book export from the Book subpath     |

## Example

```ts
import { getPropertiesFor } from '@0xintuition/schema-org';
console.log(getPropertiesFor('Book').find((p) => p.name === 'name'));
```

## Usage notes

The snapshot is schema.org V30.0. The vocabulary supplies schema metadata, while classifications decides which fields an Intuition creation flow recommends.

## Further reading

[Source and package guide](https://github.com/0xIntuition/packages/tree/dde4fdf5774447b84cd0b820593fb0db7366e58d/packages/schema-org) · [npm package](https://www.npmjs.com/package/@0xintuition/schema-org/v/0.1.0-alpha.1).
