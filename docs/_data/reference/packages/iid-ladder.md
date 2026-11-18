---
title: "@0xintuition/iid-ladder"
sidebar_label: "IID ladder"
description: "Project supplied identifiers through strong-ID, provider-handle, and URL choices with an explicit fallback."
kind: reference
reader: ["app", "agent"]
packages: ["@0xintuition/iid-ladder"]
---

<AppliesTo />

## What it's for

The projection ladder selects a primary IID from supplied strong identifiers, provider handles, and canonical URLs. If nothing usable is available, it returns an explicit envelope fallback with a null IID.

## When to use it

Use it before atom construction when imports contain several candidate identifiers. The selection order is strong identifier → registered provider handle → canonical URL → envelope fallback. It does not search by name, prove a unique entity match, serialize atom bytes, record aliases, or fetch provider metadata.

## Install

```sh
npm install @0xintuition/iid-ladder@0.1.0
```

Use ESM imports. See [installation and peer setup](/docs/build/install).

## Entry points

| Subpath | Purpose                                                                                                                        |
| ------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `.`     | Identifier projection, category ordering, matching aliases, bound policy creation, and pinned Wikidata classification helpers. |

## Depends on and works with

Runtime dependencies: [`@0xintuition/iid`](/docs/reference/packages/iid).

Published peers: none.

## Example

{/* example:start examples/v2/identity-linking/src/package-examples.ts#project-ladder */}

```ts
import { projectIdentifierLadder } from '@0xintuition/iid-ladder';

const selection = projectIdentifierLadder({
  strongIdentifiers: { isrc: 'US-RC1-76-07839' },
  canonicalUrl: 'https://example.com/recording',
});
if (selection.iid === null) {
  console.log({ needsIdentityEvidence: true, reason: selection.reason });
} else {
  console.log({ iid: selection.iid, selectedFrom: selection.rung });
}
const noIdentifier = projectIdentifierLadder({});
console.log(noIdentifier);
```

{/* example:end */}

The supplied strong ISRC wins over the URL. Empty input returns `iid: null`; inspect `reason` and collect more evidence or use an explicit envelope. A name-only recipe belongs to the declarative IID engine and a classification ladder; identical names can describe different entities.

`strongIdentifierOrder` is an allowlist as well as an order. Category policies distinguish primary identities from aliases used only for matching. Default `providerLocalHandles: 'reject'` leaves unregistered provider namespaces as fallbacks. The optional `'mint'` policy preserves application-local historical strings; it does not make them canonical registered IIDs or P0-eligible. Package-specific identifier additions are disclosed on the [specification page](/docs/reference/packages/iid-spec).

## Related concepts

- [The identity ladder](/docs/concepts/identity-ladder)

See also [Primitives](/docs/reference/packages/primitives).

## Source

[Package README at the pinned release](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/iid-ladder/README.md).

[Canonical identity ladders](https://github.com/0xIntuition/intuition-identifier/blob/3e593247c0e7cb168b37368937167ed146d3868a/spec/05-identity-ladders.md) · [Canonical gen1 derivation](https://github.com/0xIntuition/intuition-identifier/blob/3e593247c0e7cb168b37368937167ed146d3868a/spec/06-gen1.md) · [Projection implementation](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/iid-ladder/src/ladder.ts).
