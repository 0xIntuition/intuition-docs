---
title: '@0xintuition/iid-ladder guide'
slug: /build/packages/iid-ladder
sidebar_position: 4
---

Choose canonical identities from application, provider, seed, and import inputs.

Published alpha version: **0.1.0-alpha.0**. [Release compatibility](../compatibility.md) records npm publication, peer dependencies, and deployment boundaries.

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

## Preserve historical provider-local handles

The default policy is `providerLocalHandles: 'reject'`. Known unregistered namespaces such as Spotify and Goodreads retain the `unregistered-provider` fallback. Applications migrating historical byte-exact identities can opt in:

```ts
import { createLadder } from '@0xintuition/iid-ladder';
const ladder = createLadder({ providerLocalHandles: 'mint' });
// Use ladder.projectIdentifierLadder(input) and ladder.iidForIdentityRung(...)
// only under your application's explicit historical-identity policy.
```

Minting only changes the known unregistered-provider fallback. Strong identity precedence, invalid-handle rejection, alias-only behavior, and unknown-prefix handling stay intact. A minted result is labeled `rung: 'handle'` for compatibility and carries no separate origin flag. It is not automatically a registered Class D IID, spec-valid identifier, or eligible P0 anchor. Already-prefixed unregistered `int:` input is not newly admitted. Preserve the policy alongside stored results.

## Source and full contract

[Source and package guide](https://github.com/0xIntuition/packages/tree/dde4fdf5774447b84cd0b820593fb0db7366e58d/packages/iid-ladder) · [npm package](https://www.npmjs.com/package/@0xintuition/iid-ladder/v/0.1.0-alpha.0). The [machine-readable manifest](/intuition-release.json) lists all declared public subpaths and peer dependencies. Exact npm versions, tarball integrity, and observed dist-tags are recorded in the manifest.
