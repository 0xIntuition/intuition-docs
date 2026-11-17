---
title: "The identity ladder"
sidebar_label: "The identity ladder"
description: "Choose the strongest usable recording identifier, see when a name-only gen1 recipe fires, and preserve missing identity evidence."
kind: concept
reader: ["app", "agent"]
packages: ["@0xintuition/iid-ladder", "@0xintuition/iid"]
depends_on: ["iid-schemes"]
---

<AppliesTo />

An identity ladder is an entity type’s ordered list of ways to identify one of its members. Start at the strongest rung for which all required facts are valid. A registered identifier can distinguish recordings with the same title. A fallback recipe based only on that title gives the same result for both.

**Builds on:** [Schemes and canonical form](/docs/concepts/iid-schemes).

**Implemented by:** [iid-ladder](/docs/reference/packages/iid-ladder), [iid](/docs/reference/packages/iid).

## How it works

For each scheme rung, extract the input and apply that scheme’s canonicalization rules. Missing or invalid values let the next rung try. A `gen1` rung requires every field in its recipe. If no rung can fire, `deriveIntuitionId` returns `undefined`. [IID spec §5.2](https://github.com/0xIntuition/intuition-identifier/blob/3e593247c0e7cb168b37368937167ed146d3868a/spec/05-identity-ladders.md#52-selection-algorithm) · [Derivation implementation](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/iid/src/derive.ts)

A `gen1` IID carries the classification slug, a stable recipe tag and the first 16 bytes of the Keccak-256 digest. The hashed input contains the slug and normalized recipe fields. The tag identifies the recipe even if its position in the ladder changes. A P1 payload carries the evidence needed to repeat the derivation. [IID spec §6.3](https://github.com/0xIntuition/intuition-identifier/blob/3e593247c0e7cb168b37368937167ed146d3868a/spec/06-gen1.md#63-derivation) · [IID spec §6.6](https://github.com/0xIntuition/intuition-identifier/blob/3e593247c0e7cb168b37368937167ed146d3868a/spec/06-gen1.md#66-mandatory-p1-representation)

For provider imports, `projectIdentifierLadder` in the ladder package takes strong identifiers, provider identifiers and a canonical URL. It returns a selected IID or an envelope fallback with `iid: null` and a reason. Its fallback is distinct from deriving a classification’s `gen1` recipe. [Projection ladder](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/iid-ladder/README.md)

## Example

Follow the recording ladder for three possible catalog rows.

| Available evidence | First usable rung |
| --- | --- |
| A valid ISRC and a MusicBrainz recording reference | The ISRC identifies the recorded performance. |
| An invalid ISRC and a valid MusicBrainz recording reference in `sameAs` | The second rung selects the recording’s MusicBrainz ID. |
| Only the title “Night train” | The `gen1` recipe tagged `r3` uses the normalized title. Another recording called “Night train” gets the same weak IID. |

Artist credit and album title are useful catalog fields. Neither enters this name-only recipe. [Canonical music recording ladder](https://github.com/0xIntuition/intuition-identifier/blob/3e593247c0e7cb168b37368937167ed146d3868a/entity-types/music-recording.md)

## Common mistakes

- Adding a timestamp to distinguish two name-only matches. This breaks repeatability. Keep the ambiguity visible until stronger evidence arrives.
- Replacing an old atom’s bytes when you discover an ISRC. A stronger identifier can be represented separately and linked to the earlier atom.

## Next

See how [Classifications and Creation Profiles](/docs/concepts/classifications) tell a recording form which fields to collect and which identity ladder to use.
