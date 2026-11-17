---
title: "Classifications and Creation Profiles"
sidebar_label: "Classifications and Creation Profiles"
description: "Use a classification to model a recording and its Creation Profile to choose fields, validation and suggested relationships."
kind: concept
reader: ["app", "agent"]
packages: ["@0xintuition/classifications"]
depends_on: ["atoms", "iid", "identity-ladder"]
---

<AppliesTo />

A classification describes a kind of entity in Intuition. It gives that kind a stable slug, a type and a set of fields, and can declare an identity ladder. A Creation Profile brings together the fields an app should show and the relationships it can suggest when someone enters an entity of that kind.

**Builds on:** [Atoms](/docs/concepts/atoms), [The Intuition Identifier](/docs/concepts/iid), [The identity ladder](/docs/concepts/identity-ladder).

**Implemented by:** [classifications](/docs/reference/packages/classifications).

## How it works

Start with what a row represents. A track can be modeled as a `music-recording`, whose schema.org type is `MusicRecording`. Its identity ladder looks for an ISRC, then a MusicBrainz recording reference, then a name. The form can collect more facts than the ladder needs. [Music recording classification](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/classifications/src/generated/specs/music-recording.ts)

The generated Creation Profile carries a label, type and required flag for each field. Its relationship suggestions identify a predicate and the expected object types. For example, `byArtist` accepts a `music-group` or a `person`. Typing an artist name records text. Making a graph claim takes a recording ID, a predicate ID and an artist ID. [Music recording Creation Profile](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/classifications/src/generated/creation/music-recording.ts)

## Example

For a recording called “Night train”, the profile exposes five fields in this order.

| Field key | What the form collects | Required |
| --- | --- | --- |
| `name` | The track title, such as “Night train” | Yes |
| `byArtist` | An artist credit | No |
| `inAlbum` | An album title | No |
| `isrc` | A recording code when known | No |
| `sameAs` | A list of URLs identifying this recording | No |

With just the title, the name field satisfies the form’s required-field rule. The identity ladder can still yield a weak name-derived IID. If an artist is known only by a shared display name, keep the credit as text until you can identify the intended object. [Creation Profile field and target tests](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/classifications/src/creation-profile.test.ts)

## Common mistakes

- Treating every available schema.org property as a required form field. Use the profile’s field list and its required flags.
- Inferring an edge from a suggested relationship or from a `sameAs` URL in form state. Those values can guide a later claim.
- Confusing a Creation Profile, which describes input, with a representation profile, which describes stored bytes.

## Next

- Look up field meanings in [schema.org vocabulary](/docs/concepts/schema-org) and relationship terms in [Predicates](/docs/concepts/predicates).
- Use [The IID registry](/docs/concepts/iid-registry) to classify an identifier, or [Atom classification](/docs/concepts/atom-classification) to classify parsed input.
- Follow [Protocol writes](/docs/concepts/protocol-writes) when a reviewed result is ready to submit.
