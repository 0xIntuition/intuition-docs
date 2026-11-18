---
title: "Representation profiles"
sidebar_label: "Representation profiles"
description: "Choose the bytes that carry an IID, and separate stable identity from companion metadata and display enrichment."
kind: concept
reader: ["app", "agent"]
packages: ["@0xintuition/iid", "@0xintuition/primitives"]
depends_on: ["iid", "atoms"]
---

<AppliesTo />

A representation profile describes the atom data that carries an IID. P0 stores the bare canonical identifier, P1 adds the evidence needed to interpret or re-derive it, and P2 adds descriptive fields. The IID names the entity; the atom ID identifies the exact stored bytes, so different representations of one IID can have different atom IDs.

**Builds on:** [The Intuition Identifier](/docs/concepts/iid), [Atoms](/docs/concepts/atoms).

**Implemented by:** [iid](/docs/reference/packages/iid), [primitives](/docs/reference/packages/primitives).

## How it works

The canonical rules are [IID spec §7.2](https://github.com/0xIntuition/intuition-identifier/blob/3e593247c0e7cb168b37368937167ed146d3868a/spec/07-representation-profiles.md#72-the-profiles), [IID spec §7.3](https://github.com/0xIntuition/intuition-identifier/blob/3e593247c0e7cb168b37368937167ed146d3868a/spec/07-representation-profiles.md#73-scheme-typing), and [IID spec §7.5](https://github.com/0xIntuition/intuition-identifier/blob/3e593247c0e7cb168b37368937167ed146d3868a/spec/07-representation-profiles.md#75-requirements).

| Profile | Identity payload | When to use it |
| --- | --- | --- |
| P0 — anchor | Exact canonical IID text | Class A or B identifiers whose scheme is unambiguously typed |
| P1 — identity context | Type, IID, identity-recipe fields, and corroborating evidence | Required minimum for Class C or polymorphic identifiers |
| P2 — enriched | P1 plus descriptive data | Opt in when that description must be part of the atom |

Both P0 eligibility conditions must hold. A `gen1` identifier carries an entity type, but its Class C derivation still requires recipe evidence at P1. A plain name can be ambiguous; deterministic derivation cannot establish that two people with the same name are one person.

When deriving an IID from input fields, the pinned builder defaults to P0 if eligible and P1 otherwise. Requesting P0 for ineligible input returns errors on this path. Check the result’s `success` field before reading `value`. On success, `iid`, `scheme` and `class` can still be `null` when no identifier was derived. On the derived-IID path, explicit P1 and P2 serialize the same identified envelope. When you supply `candidateIid`, the builder ignores the requested profile and selects P0 for an eligible candidate or P1 for any other accepted candidate. [Builder source](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/primitives/src/anchor.ts)

:::info Canonical specification and packaged copy

The packaged specification omits §7.8 on companion metadata. Both sources define weak `acct` handles. The package gives those handles a P1 floor, making them ineligible for bare P0 anchors while preserving their canonical bytes. It also accepts typed `wd` values and the additional `apple-podcasts`, `letterboxd` and `podcast-index` schemes. [Canonical account scheme](https://github.com/0xIntuition/intuition-identifier/blob/3e593247c0e7cb168b37368937167ed146d3868a/schemes/acct.md) · [Packaged amendments](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/iid-spec/spec/09-registry-governance.md#97-pre-publication-amendments)

:::

### Keep companion metadata outside identity

[IID spec §7.8](https://github.com/0xIntuition/intuition-identifier/blob/3e593247c0e7cb168b37368937167ed146d3868a/spec/07-representation-profiles.md#78-the-atom-creation-model-data-and-companion-metadata) separates the identity payload from companion URI entries: leads for resolution, provenance, or richer descriptions. Identity validation and comparison must work without those entries.

For `buildIidAnchor`, changing only `contextUris` preserves `data`, `dataHex`, and `id`. A JSON-LD `@context` field **inside** the atom is different: changing it changes serialized bytes and can change the atom ID. The builder normalizes companion entries, but registering them still requires a URI-aware write; it does not fetch or upload them.

The specification's identity-canonical and display-canonical roles describe an equivalence architecture. They do not establish a cluster or election API in Core. Choosing a richer display source must not rewrite original atom IDs or move existing claims and positions.

## Example

A name-derived person needs P1 evidence. This offline check confirms the default and the rejected bare-anchor request:

{/* example:start examples/v2/quickstart/src/profiles.ts#profiles */}

```ts
import assert from 'node:assert/strict';
import { buildIidAnchor } from '@0xintuition/primitives/anchor';

const fields = { givenName: 'Ada', familyName: 'Lovelace' };
const contextual = buildIidAnchor('person', fields);
if (!contextual.success) throw new Error(contextual.errors.join('; '));
assert.equal(contextual.value.profile, 'p1');
assert.equal(contextual.value.class, 'C');

const forcedAnchor = buildIidAnchor('person', fields, { profile: 'p0' });
assert.equal(forcedAnchor.success, false);
```

{/* example:end */}

This uses the package's fixture fields to demonstrate representation selection, not to verify a real person's identity. The [quickstart](/docs/get-started/quickstart) separately proves that equivalent ISRC spellings and changed companion URIs preserve P0 bytes and IDs.

For a recording identified by title alone, the builder retains the title as recipe evidence. The artist credit is a descriptive field outside that recipe. Compare the returned profile labels with the bytes actually produced.

{/* example:start examples/v2/identity-linking/src/concept-identity.ts#profile-bytes */}

```ts
import { buildIidAnchor } from '@0xintuition/primitives/anchor';

const values = { name: 'Example recording', byArtist: 'Example artist' };
const p1 = buildIidAnchor('music-recording', values, { profile: 'p1' });
const p2 = buildIidAnchor('music-recording', values, { profile: 'p2' });
if (!p1.success) throw new Error(p1.errors.join('; '));
if (!p2.success) throw new Error(p2.errors.join('; '));
console.log(p1.value.profile, p2.value.profile);
console.log(p1.value.data === p2.value.data, p1.value.id === p2.value.id);
```

{/* example:end */}

The labels are `p1` and `p2`. Both comparisons return `true`, and neither payload contains the artist credit.

## Common mistakes

- Passing an IID where a protocol call expects a bytes32 term ID.
- Rebuilding an existing atom with a different profile and expecting its ID to stay unchanged.
- Treating companion `contextUris` as the JSON-LD `@context` inside atom data.
- Treating P2 selection as a provider fetch, or a valid IID as proof of a description.
- Requiring companion metadata to validate identity; missing context means unknown, not invalid.

## Next

[Protocol writes](/docs/concepts/protocol-writes) uses the selected bytes in a transaction plan. Keep them unchanged through review and submission.
