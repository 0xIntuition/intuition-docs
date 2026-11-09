---
title: '@0xintuition/iid-ladder'
sidebar_label: 'IID ladder'
slug: /build/packages/iid-ladder
sidebar_position: 4
---

Select one canonical identifier when an import contains several possible identifiers. Use the ladder before building an atom when your application receives provider records, URLs, or user-supplied identity facts.

Version **0.1.0-alpha.0** · [npm](https://www.npmjs.com/package/@0xintuition/iid-ladder/v/0.1.0-alpha.0) · [Compatibility](../compatibility.md)

## Install

```sh
npm install @0xintuition/iid-ladder@0.1.0-alpha.0
```

Use ESM imports.

## API overview

| Export or operation                                    | Purpose                                                                 |
| ------------------------------------------------------ | ----------------------------------------------------------------------- |
| `projectIdentifierLadder(input)`                       | Strong identifier, registered handle, URL, or explicit fallback outcome |
| `schemeOrderForIdentityCategory(category)`             | Strongest-first category order or undefined                             |
| `iidForIdentityRung(token, value, primarySchemaType?)` | Canonical matching alias or undefined                                   |
| `resolveWikidataP31Identity(p31)`                      | Schema type and eligible typed Wikidata binding from supplied classes   |

## Example

```ts
import { projectIdentifierLadder } from '@0xintuition/iid-ladder';
const result = projectIdentifierLadder({
  strongIdentifiers: { isrc: 'USRC17607839' },
});
if (result.iid === null) {
  // Let the user supply more identity evidence or choose an envelope.
  console.log({ needsReview: true, reason: result.reason });
} else {
  console.log({ iid: result.iid, selectedFrom: result.rung });
}
```

This input selects `{ iid: 'int:isrc:USRC17607839', rung: 'strong' }`. Handle the null branch for imports without a usable identifier; the `reason` explains why the ladder selected an envelope fallback.

The result is an identity choice. To produce canonical bytes and an atom ID, continue with the [anchor builder](./primitives.md) and the [music catalog tutorial](../guides/music-catalog.md).

## Usage notes

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

## Further reading

[Source and package guide](https://github.com/0xIntuition/packages/tree/dde4fdf5774447b84cd0b820593fb0db7366e58d/packages/iid-ladder) · [npm package](https://www.npmjs.com/package/@0xintuition/iid-ladder/v/0.1.0-alpha.0).
