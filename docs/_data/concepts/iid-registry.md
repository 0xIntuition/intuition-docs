---
title: "The IID registry"
sidebar_label: "The IID registry"
description: "Interpret an IID offline using its classification, ordered provider capabilities and identifier hints, including an unmapped result."
kind: concept
reader: ["app", "agent"]
packages: ["@0xintuition/iid-registry"]
depends_on: ["iid-schemes", "classifications"]
---

<AppliesTo />

The IID registry package interprets an identifier for an application. Given an IID, it can return a classification, an ordered list of provider capabilities and hints extracted from the value. Each answers a different question about what an application could do next.

**Builds on:** [Schemes and canonical form](/docs/concepts/iid-schemes), [Classifications](/docs/concepts/classifications).

**Implemented by:** [iid-registry](/docs/reference/packages/iid-registry).

## How it works

The canonical scheme registry defines the names admitted in an IID and freezes each scheme’s canonicalization rules. The package’s lookup tables supply an additional mapping from an IID to a classification and possible enrichment providers. Both lookups work offline. [IID spec §9.1](https://github.com/0xIntuition/intuition-identifier/blob/3e593247c0e7cb168b37368937167ed146d3868a/spec/09-registry-governance.md#91-the-registry) · [Canonical scheme registry](https://github.com/0xIntuition/intuition-identifier/blob/3e593247c0e7cb168b37368937167ed146d3868a/registry.json) · [Registry package](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/iid-registry/README.md)

`classificationForIid` can return `undefined`, including for a valid identifier without a supported classification. For a bare Wikidata QID the identifier alone gives insufficient type information. `providersForIid` lists potential capabilities in order. `identifierHintsForIid` supplies canonical values a provider could use if one is configured. Neither an available capability nor an identifier hint establishes that a record was found.

## Example

For the standalone fixture `int:isrc:USRC17607839`, the three results serve different consumers.

| Lookup | Result | What it tells you |
| --- | --- | --- |
| Classification | Slug `music-recording`, type `MusicRecording` | Which entity type to display. |
| Provider plan | `musicbrainz`, `spotify`, `apple-music` | Which capabilities an enrichment engine can consider, in order. |
| Identifier hints | An `isrc` entry with value `USRC17607839` | Which exact value to supply to an adapter. |

Now compare a composition identifier, `int:iswc:T0345246801`. It is valid, but the pinned registry has no classification mapping for its scheme. Preserve that unknown result instead of labeling it a recording. [Classification tests](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/iid-registry/src/__tests__/classification.test.ts) · [Identifier hint tests](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/iid-registry/src/__tests__/hints.test.ts)

## Common mistakes

- Treating a provider plan as a fetched artifact. An enrichment engine must select an enabled adapter and run it before reporting any external facts.
- Treating an empty provider list as a validation error. It means the package has no identifier-driven capability for that input.

## Next

Read [Enrichment](/docs/concepts/enrichment) to see how a configured provider can return fields with provenance.
