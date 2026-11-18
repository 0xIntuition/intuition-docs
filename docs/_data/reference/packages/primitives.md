---
title: "@0xintuition/primitives"
sidebar_label: "Primitives"
description: "Build validated atom and triple blueprints, select IID representations, and compute their exact bytes and IDs offline."
kind: reference
reader: ["app", "agent"]
packages: ["@0xintuition/primitives"]
---

<AppliesTo />

## What it's for

Primitives turns classification values into validated atom or triple blueprints. The anchor builder returns the selected representation, exact data bytes, deterministic atom ID, and separate companion URI context.

## When to use it

Use `buildIidAnchor` for identifier-first atoms, descriptive `buildAtom` helpers when descriptive JSON-LD is intentional, and triple builders for explicit relationships. These helpers do not upload URI content, create on-chain terms, call enrichment providers, or submit wallet transactions. Always narrow `BuildResult.success` before reading `value`; failures contain `errors`.

## Install

```sh
npm install @0xintuition/primitives@0.1.0 viem@2.31.4
```

Use ESM imports. See [installation and peer setup](/docs/build/install).

## Entry points

| Subpath       | Purpose                                                                               |
| ------------- | ------------------------------------------------------------------------------------- |
| `.`           | Complete public builder API, with classification and ID helpers re-exported.          |
| `./atom`      | Descriptive JSON-LD atom builders.                                                    |
| `./types`     | TypeScript input, result, blueprint, profile, and URI-limit types; use `import type`. |
| `./anchor`    | IID-first anchor building, candidate validation, and URI policy limits.               |
| `./triple`    | Triple construction by key or name, and counter-triples.                              |
| `./discover`  | Classification discovery and recommended fields.                                      |
| `./validate`  | Atom-data recognition and validation.                                                 |
| `./predicate` | Custom predicate builders and predicate discovery.                                    |

## Depends on and works with

Runtime dependencies: [`@0xintuition/classifications`](/docs/reference/packages/classifications), [`@0xintuition/ids`](/docs/reference/packages/ids), [`@0xintuition/iid`](/docs/reference/packages/iid), [`@0xintuition/iid-registry`](/docs/reference/packages/iid-registry), [`@0xintuition/predicates`](/docs/reference/packages/predicates).

Published peers: `viem ^2.0.0`.

## Example

{/* example:start examples/v2/atom-creation-form/src/package-examples.ts#anchor-and-context */}

```ts
import { buildIidAnchor } from '@0xintuition/primitives/anchor';

// Standalone ISRC conformance input; no association with the music catalog fixture.
const values = { isrc: 'US-RC1-76-07839' };
const bare = buildIidAnchor('music-recording', values);
const withContext = buildIidAnchor('music-recording', values, {
  contextUris: ['https://example.com/recording-evidence'],
});
if (!bare.success) throw new Error(bare.errors.join('; '));
if (!withContext.success) throw new Error(withContext.errors.join('; '));

console.log({
  iid: bare.value.iid,
  profile: bare.value.profile,
  data: bare.value.data,
  dataHex: bare.value.dataHex,
  id: bare.value.id,
  sameIdWithContext: bare.value.id === withContext.value.id,
  contextUris: withContext.value.contextUris,
});
```

{/* example:end */}

The golden ISRC fixture stands alone; it is not assigned to the music catalog example. At P0, `data` is the bare IID string, `dataHex` is its UTF-8 encoding, and `id` hashes those bytes. `contextUris` is an ordered companion list outside the payload: adding it leaves `data`, `dataHex`, and `id` unchanged. By contrast, editing JSON-LD `@context` inside an envelope changes the hashed payload. No URI is fetched or uploaded.

{/* example:start examples/v2/atom-creation-form/src/package-examples.ts#profile-floor */}

```ts
const person = buildIidAnchor('person', {
  givenName: 'Example',
  familyName: 'Person',
});
if (!person.success) throw new Error(person.errors.join('; '));
const forcedBare = buildIidAnchor(
  'person',
  { givenName: 'Example', familyName: 'Person' },
  { profile: 'p0' },
);
console.log({
  derivedProfile: person.value.profile,
  class: person.value.class,
  forcedBareAccepted: forcedBare.success,
});
```

{/* example:end */}

A Class C name recipe needs its evidence in a P1 envelope; forcing P0 fails. A name match is not proof of a unique real-world person. When no identity rung fires, a valid fallback envelope can have `iid`, `scheme`, and `class` set to `null`; do not assume every successful build has an IID.

In this pinned implementation, explicit P1 and P2 requests with a derived IID serialize the same identity envelope bytes. The `profile` label alone does not promise the canonical specification's full descriptive P2 payload. `candidateIid`, when supplied, takes precedence over derivation and determines the profile by eligibility; that path does not consult the requested `profile`. Inspect the returned bytes before storing them.

URI limits are checked locally. Supply `uriLimits` from the intended protocol configuration when preparing writes; the default offline policy is not a live-chain query. A `providerPlan` is only a list of capabilities.

## Related concepts

- [Atoms](/docs/concepts/atoms)
- [Triples, counter-triples and nested triples](/docs/concepts/triples)
- [Deterministic IDs](/docs/concepts/deterministic-ids)
- [Representation profiles](/docs/concepts/representation-profiles)
- [sameAs and identity linking](/docs/concepts/same-as)

See also [Build creation forms](/docs/build/creation-profiles), [offline quickstart](/docs/get-started/quickstart).

## Source

[Package README at the pinned release](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/primitives/README.md).

[Canonical representation profiles and companion metadata](https://github.com/0xIntuition/intuition-identifier/blob/3e593247c0e7cb168b37368937167ed146d3868a/spec/07-representation-profiles.md) · [Anchor implementation](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/primitives/src/anchor.ts) · [BuildResult and anchor types](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/primitives/src/types.ts).
