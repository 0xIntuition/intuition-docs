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

**Builds on:** IIDs and atoms.

**Implemented by:** [iid](/docs/reference/packages/iid), [primitives](/docs/reference/packages/primitives).

## How it works

The canonical rules are [IID spec §7.2](https://github.com/0xIntuition/intuition-identifier/blob/3e593247c0e7cb168b37368937167ed146d3868a/spec/07-representation-profiles.md#72-the-profiles), [IID spec §7.3](https://github.com/0xIntuition/intuition-identifier/blob/3e593247c0e7cb168b37368937167ed146d3868a/spec/07-representation-profiles.md#73-scheme-typing), and [IID spec §7.5](https://github.com/0xIntuition/intuition-identifier/blob/3e593247c0e7cb168b37368937167ed146d3868a/spec/07-representation-profiles.md#75-requirements).

| Profile | Identity payload | When to use it |
| --- | --- | --- |
| P0 — anchor | Exact canonical IID text | Class A or B identifiers whose scheme is unambiguously typed |
| P1 — identity context | Type, IID, identity-recipe fields, and corroborating evidence | Required minimum for Class C or polymorphic identifiers |
| P2 — enriched | P1 plus descriptive data | Opt in when that description must be part of the atom |

Both P0 eligibility conditions must hold. A `gen1` identifier carries an entity type, but its Class C derivation still requires recipe evidence at P1. A plain name can be ambiguous; deterministic derivation cannot establish that two people with the same name are one person.

The pinned builder selects P0 when eligible and otherwise P1. An explicit ineligible P0 request returns errors. On its derived-IID path, explicit P1 and P2 currently serialize the same identified envelope: requesting P2 alone does not add a full descriptive payload. Its `candidateIid` path selects by eligibility and ignores the profile option. See the [builder source](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/primitives/src/anchor.ts) before relying on those options.

:::info Canonical specification and packaged copy
These rules follow `intuition-identifier` at the linked immutable revision. The pinned `@0xintuition/iid-spec` copy differs: it lacks §7.8, adds typed `wd` and weak `acct` forms, and includes additional schemes. The canonical specification governs this explanation; package behavior is documented separately in [iid-spec](/docs/reference/packages/iid-spec).
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

## Common mistakes

- Passing an IID where a protocol call expects a bytes32 term ID.
- Rebuilding an existing atom with a different profile and expecting its ID to stay unchanged.
- Treating companion `contextUris` as the JSON-LD `@context` inside atom data.
- Treating P2 selection as a provider fetch, or a valid IID as proof of a description.
- Requiring companion metadata to validate identity; missing context means unknown, not invalid.

## Next

[Protocol writes](/docs/concepts/protocol-writes) uses the selected bytes in a transaction plan. Keep them unchanged through review and submission.
