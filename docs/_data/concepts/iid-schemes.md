---
title: "Schemes and canonical form"
sidebar_label: "Schemes and canonical form"
description: "Parse an IID, compare canonical values byte for byte, and distinguish registry-assigned, intrinsic and derived identifiers."
kind: concept
reader: ["app", "agent"]
packages: ["@0xintuition/iid-spec", "@0xintuition/iid"]
depends_on: ["iid"]
---

<AppliesTo />

A scheme owns the rules for one kind of identifier. It defines which raw values are acceptable, how to spell them canonically and what they identify. Once the scheme has produced a canonical IID, equality is a byte-for-byte comparison.

**Builds on:** [The Intuition Identifier](/docs/concepts/iid).

**Implemented by:** [iid-spec](/docs/reference/packages/iid-spec), [iid](/docs/reference/packages/iid).

## How it works

Split an IID at the first two colons. The prefix is exactly `int:`. A registered scheme name contains 1–32 lowercase ASCII letters, digits or hyphens. Its value contains 1–220 visible ASCII characters, including any further colons. The entire IID is limited to 256 bytes. Reject unknown schemes. [IID spec §2.2](https://github.com/0xIntuition/intuition-identifier/blob/3e593247c0e7cb168b37368937167ed146d3868a/spec/02-grammar.md#22-requirements) · [IID spec §2.3](https://github.com/0xIntuition/intuition-identifier/blob/3e593247c0e7cb168b37368937167ed146d3868a/spec/02-grammar.md#23-parsing)

| Class | Source of identity | Example |
| --- | --- | --- |
| A | An authority assigns the value. | An ISRC names a recording. |
| B | The entity supplies an intrinsic key. | A content digest identifies file bytes. |
| C | A `gen1` recipe uses the available facts. | A title alone can match several recordings. |

Within Class A, T1 is an open standard with offline format validation, T2 is a community registry with open data, and T3 is a proprietary registry. Ladders prefer T1 and T2 over T3. These tiers describe access and verifiability. [IID spec §3.2](https://github.com/0xIntuition/intuition-identifier/blob/3e593247c0e7cb168b37368937167ed146d3868a/spec/03-identity-classes.md#32-the-three-classes) · [IID spec §3.3](https://github.com/0xIntuition/intuition-identifier/blob/3e593247c0e7cb168b37368937167ed146d3868a/spec/03-identity-classes.md#33-openness-tiers)

Apply the scheme’s canonicalization rules. For text in a `gen1` recipe, `NORM-1` first applies Unicode NFKC, folds punctuation, applies full Unicode case folding, then trims and collapses whitespace. Accents survive. Scheme-specific values can be case-sensitive. [IID spec §4.2](https://github.com/0xIntuition/intuition-identifier/blob/3e593247c0e7cb168b37368937167ed146d3868a/spec/04-normalization.md#42-the-algorithm) · [IID spec §4.6](https://github.com/0xIntuition/intuition-identifier/blob/3e593247c0e7cb168b37368937167ed146d3868a/spec/04-normalization.md#46-requirements)

:::info Canonical specification and packaged copy

The package accepts typed `wd` values and adds the `apple-podcasts`, `letterboxd` and `podcast-index` schemes. Both sources define weak `acct` handles. Because handles can change owners, the package requires at least P1 for them. This changes P0 eligibility while preserving the canonical identifier bytes. The packaged copy also omits §7.8 and differs in chapters 00, 01, 04, 05 and 09. [Canonical account scheme](https://github.com/0xIntuition/intuition-identifier/blob/3e593247c0e7cb168b37368937167ed146d3868a/schemes/acct.md) · [Packaged amendments](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/iid-spec/spec/09-registry-governance.md#97-pre-publication-amendments)

:::

## Example

To canonicalize an ISRC, remove hyphens, spaces and dots, convert letters to uppercase, then validate the format. The canonical vectors `us-sm1-00-07459` and `US SM1 00 07459` both yield `int:isrc:USSM10007459`. The shorter `USSM1000745` fails validation. A successful format check cannot establish that the issuing authority assigned the code to a particular recording. [ISRC scheme and test vectors](https://github.com/0xIntuition/intuition-identifier/blob/3e593247c0e7cb168b37368937167ed146d3868a/schemes/isrc.md)

By comparison, the text recipe maps `"  Inception  "` to `"inception"`. These are normalization steps on inputs. Compare the final IIDs exactly as emitted. [IID spec §2.4](https://github.com/0xIntuition/intuition-identifier/blob/3e593247c0e7cb168b37368937167ed146d3868a/spec/02-grammar.md#24-comparison)

## Common mistakes

- Splitting `int:hash:sha256:…` at every colon. The value starts at `sha256:`.
- Lowercasing an entire IID or stripping accents from all names. Both can change which values compare equal.
- Inferring a `sameAs` claim from a spelling match. A real-world identity claim needs its own evidence.

## Next

Use [The identity ladder](/docs/concepts/identity-ladder) to select the strongest usable scheme. Use [The IID registry](/docs/concepts/iid-registry) to interpret the resulting value.
