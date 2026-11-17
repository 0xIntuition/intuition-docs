---
title: "Enrichment"
sidebar_label: "Enrichment"
description: "Turn a classified atom and identifier hints into provider artifacts, then extract supported fields while retaining provenance and missing values."
kind: concept
reader: ["app", "plugin"]
packages: ["@0xintuition/atom-enrichment"]
depends_on: ["atom-classification", "iid-registry"]
---

<AppliesTo />

Enrichment adds evidence to a classified atom. A provider adapter can return an artifact, such as a catalog record with a title and artist credit. A separate extraction step selects fields for the classification and records their sources. An application can refresh these descriptions while retaining the IID and exact atom bytes it already uses.

**Builds on:** [Atom classification](/docs/concepts/atom-classification), [The IID registry](/docs/concepts/iid-registry).

**Implemented by:** [@0xintuition/atom-enrichment](/docs/reference/packages/atom-enrichment).

## How it works

1. **Plan.** Use the IID registry to find candidate providers for the identifier. A plan describes capabilities. No provider has run at this point.
2. **Execute.** Give the enrichment engine a classified input, identifier hints, and the plugins you selected. A matching adapter can return an artifact with provider metadata. Inspect the artifacts, errors, and skipped providers together. For example, Core documents keyless MusicBrainz access and separate credentials for Spotify. [Enrichment engine](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/atom-enrichment/README.md), [Core provider configuration](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/docs/enrichment-providers.md).
3. **Extract.** Apply the field extractor for the classification. Keep accepted values with their field provenance, dropped fields with their reasons, and the list of missing required fields. Some extraction paths can make additional requests. The catalog fixture supplies a fetcher that rejects remote requests. [Field extraction](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/atom-enrichment/src/extraction/extract.ts), [field result types](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/atom-enrichment/src/extraction/types.ts).

## Example

The [recording fixture](/docs/build/classify-enrich) runs a local adapter with the synthetic recording's MusicBrainz ID. The adapter returns one artifact containing the name `One More Time` and an artist credit. Its metadata identifies the provider as `local-synthetic-fixture` and supplies the fetch time and source URL.

The recording extractor returns an empty `values` object and lists `name` in `missingRequired`. Although the name is present in the artifact, the pinned extractor does not map this artifact into recording fields. A catalog can keep the artifact available for review and leave the required name unfilled. If the identifier hint is removed, the same adapter is skipped. [MusicBrainz artifact format](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/atom-enrichment/docs/musicbrainz/index.md).

## Common mistakes

- Showing a provider listed in a plan as the source of a fact. Attribute a value to the artifact or extraction result that actually supplied it.
- Dropping successful artifacts because another provider failed. Save the available evidence and its errors so the caller can decide whether to retry.
- Rebuilding an existing atom's bytes after a display title changes. Store refreshed evidence separately when the atom should keep its ID.

## Next

[Atom runtime and pipelines](/docs/concepts/atom-runtime) explains how a host shares engines, limits concurrent work, and releases resources.
