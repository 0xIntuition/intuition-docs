---
title: "@0xintuition/schema-org"
sidebar_label: "Schema.org"
description: "Look up pinned schema.org types, declared properties, and inherited property provenance offline."
kind: reference
reader: ["app", "agent"]
packages: ["@0xintuition/schema-org"]
---

<AppliesTo />

## What it's for

A local vocabulary snapshot supplies schema.org type and property records. It describes what a property means and where it is declared; it does not decide which fields an Intuition creation form should collect.

## When to use it

Use a direct type import when the type is known, or root lookup helpers for dynamic schema tooling. The vocabulary is pinned to schema.org V30.0 and never fetched by these lookups. Use [classifications](/docs/reference/packages/classifications) for recommended creation fields and typed relationship targets; this package does not validate submitted values or create atoms.

## Install

```sh
npm install @0xintuition/schema-org@0.1.0
```

Use ESM imports. See [installation and peer setup](/docs/build/install).

## Entry points

| Subpath | Purpose                                                                                                            |
| ------- | ------------------------------------------------------------------------------------------------------------------ |
| `.`     | Type lookup, inherited-property lookup, vocabulary registry, and provenance constants.                             |
| `./*`   | Generated type records by exact case-sensitive name, such as `/Book`; only names in the pinned vocabulary resolve. |

## Depends on and works with

Runtime dependencies: none.

Published peers: none.

## Example

{/* example:start examples/v2/atom-creation-form/src/package-examples.ts#schema-vocabulary */}

```ts
import { getPropertiesFor } from '@0xintuition/schema-org';
import { schemaOrgBook } from '@0xintuition/schema-org/Book';

const titleProperty = getPropertiesFor('Book').find(
  (property) => property.name === 'name',
);
console.log({
  type: schemaOrgBook.name,
  titleOrigin: titleProperty?.originType,
});
```

{/* example:end */}

`schemaOrgBook` selects the generated Book record directly. `getPropertiesFor` resolves inherited properties locally; `name` originates on `Thing`. Unknown types return `undefined` from `getType` and an empty list from `getPropertiesFor`.

## Related concepts

Start with the [concept map](/docs/concepts) and [Build creation forms](/docs/build/creation-profiles).

## Source

[Package README at the pinned release](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/schema-org/README.md).

[Generated Book record](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/schema-org/src/generated/types/Book.ts) · [Lookup implementation](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/schema-org/src/schema-org.ts).
