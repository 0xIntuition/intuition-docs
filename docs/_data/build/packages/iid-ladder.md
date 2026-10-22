---
title: '@0xintuition/iid-ladder guide'
slug: /build/packages/iid-ladder
sidebar_position: 4
---

Choose canonical identities from application, provider, seed, and import inputs.

Candidate source version: **0.1.0-alpha.0**. [Release compatibility](../compatibility.md) explains publication and deployment prerequisites.

## Install

```sh
npm install @0xintuition/iid-ladder@0.1.0-alpha.0
```

Use ESM imports.

## Main surface

| Export or operation                                    | Purpose                                                                 |
| ------------------------------------------------------ | ----------------------------------------------------------------------- |
| `projectIdentifierLadder(input)`                       | Strong identifier, registered handle, URL, or explicit fallback outcome |
| `schemeOrderForIdentityCategory(category)`             | Strongest-first category order or undefined                             |
| `iidForIdentityRung(token, value, primarySchemaType?)` | Canonical matching alias or undefined                                   |
| `resolveWikidataP31Identity(p31)`                      | Schema type and eligible typed Wikidata binding from supplied classes   |

## First use

```ts
import { projectIdentifierLadder } from '@0xintuition/iid-ladder';
console.log(
  projectIdentifierLadder({ strongIdentifiers: { isrc: 'USRC17607839' } }),
);
```

## Integration decisions

Category policy distinguishes primary identities from matching-only aliases. The result does not record aliases or serialize atom bytes. Unknown provider namespaces are not silently promoted to registered strong identities.

## Source and full contract

[Source and package guide](https://github.com/0xIntuition/packages/tree/1dc7103d2a05f23bc565a81df4b001336ce9ba53/packages/iid-ladder) · [npm package](https://www.npmjs.com/package/@0xintuition/iid-ladder). The [machine-readable manifest](/intuition-release.json) lists all declared public subpaths and peer dependencies. Npm links name the intended package; this page does not assert that the candidate has been published.
