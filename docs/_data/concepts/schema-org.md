---
title: "schema.org vocabulary"
sidebar_label: "schema.org vocabulary"
description: "Trace a Creation Profile field to its schema.org property, including inherited properties and the types they describe."
kind: concept
reader: ["app"]
packages: ["@0xintuition/schema-org"]
depends_on: ["classifications"]
---

<AppliesTo />

The schema.org vocabulary gives applications a shared meaning for names such as `MusicRecording`, `byArtist` and `name`. Intuition packages use a pinned copy so two applications using the same release can look up the same definitions offline. A classification chooses which of those properties its Creation Profile exposes.

**Builds on:** [Classifications](/docs/concepts/classifications).

**Implemented by:** [schema-org](/docs/reference/packages/schema-org).

## How it works

The package is generated from the vendored schema.org V30.0 vocabulary. A type record stores the properties declared directly on that type and its parent chain. `getType` reads the type record. `getPropertiesFor` resolves inherited properties and records which type each one comes from. [Vocabulary package](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/schema-org/README.md)

A property’s range lists the kinds of values the vocabulary describes. A form can present a simpler input. For instance, schema.org describes `byArtist` in terms of a person or music group, while the recording Creation Profile accepts an artist credit as text. [Generated recording type](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/schema-org/src/generated/types/MusicRecording.ts) · [Recording Creation Profile](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/classifications/src/generated/creation/music-recording.ts)

## Example

Suppose a form offers a track title and an ISRC. The two labels reach the vocabulary by different paths.

| Form field | Schema property | Where it is declared | Range |
| --- | --- | --- | --- |
| `name` | `name` | `Thing`, inherited by `MusicRecording` | `Text` |
| `isrc` | `isrcCode` | `MusicRecording` | `Text` |
| `byArtist` | `byArtist` | `MusicRecording` | `MusicGroup` or `Person` |

Reading only the recording’s direct properties would miss the inherited title field. Looking up the form key `isrc` literally would miss the schema property `isrcCode`. The profile records the mapping.

## Common mistakes

- Interpreting a missing property on the direct type record as missing from the vocabulary. Check inherited properties.
- Taking a range such as `Person` as evidence that a particular person performed a recording. That fact requires its own evidence.

## Next

Explore the [schema.org package reference](/docs/reference/packages/schema-org) for the lookup functions and generated type modules.
