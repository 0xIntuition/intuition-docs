---
title: Build creation forms
sidebar_label: Build creation forms
description: Read typed creation fields, validate values, and preview an atom without confusing fields with graph relationships.
kind: how-to
reader: ["app"]
packages: ["@0xintuition/classifications", "@0xintuition/primitives"]
---

<AppliesTo />

Use a Creation Profile to collect typed fields, validate values, and preview the identity your application will create.

## Before you start

Follow [installation](/docs/build/install), then install the two direct dependencies and their peer:

```sh
npm install --save-exact @0xintuition/classifications@0.1.0 @0xintuition/primitives@0.1.0 viem@2.31.4
```

A field value describes an atom. A relationship connects a subject atom, a predicate atom, and an object atom. Collecting `byArtist: 'Daft Punk'` in form state does not create a `byArtist` triple.

## Steps

### 1. Read the profile

Import the profile for the entity level you intend to represent. A music recording is distinct from a composition, performer, or album. Each field supplies a key, label, field type, required flag, and optional schema provenance; relationship entries supply a predicate and typed `expectedObjects`.

### 2. Validate before building

The helper below bounds field counts, array lengths, and string lengths before package validation. Your HTTP host must also bound raw request bytes before JSON decoding. Preserve errors by field and let the caller correct input. Runtime validation still matters even when TypeScript accepts the object.

{/* example:start examples/v2/atom-creation-form/src/creation-profiles.ts#creation-profile */}
```ts
import {
  validateClassificationValues,
  type ClassificationValueMap,
} from '@0xintuition/classifications';
import { musicRecordingCreationProfile } from '@0xintuition/classifications/creation/music-recording';
import { buildIidAnchor } from '@0xintuition/primitives/anchor';

export const formModel = {
  fields: musicRecordingCreationProfile.fields,
  relationships: musicRecordingCreationProfile.relationships,
};

export function previewRecording(values: ClassificationValueMap) {
  // The host must limit request bytes before decoding external JSON.
  const entries = Object.entries(values);
  if (entries.length > 32) throw new Error('Too many fields');
  for (const [, value] of entries) {
    if (Array.isArray(value) && value.length > 16)
      throw new Error('Too many values');
    const items = Array.isArray(value) ? value : [value];
    if (items.some((item) => typeof item === 'string' && item.length > 2_048)) {
      throw new Error('Field value is too long');
    }
  }
  const issues = validateClassificationValues('music-recording', values);
  if (issues.length) return { ok: false as const, issues };
  const anchor = buildIidAnchor('music-recording', values);
  if (!anchor.success) throw new Error(anchor.errors.join('; '));
  return { ok: true as const, anchor: anchor.value };
}

const preview = previewRecording({
  name: 'One More Time',
  byArtist: 'Daft Punk',
});
console.log({
  fields: formModel.fields,
  relationships: formModel.relationships,
  preview,
});
```
{/* example:end */}

`field.schema` explains the vocabulary property, origin type, and range; it can be `null`. It is provenance, not an automatically executed JSON Schema validator. Render controls from `fieldType` and `required`; use the classification validator for the accepted value contract. `availableFieldCount` describes the available vocabulary field count, not a requirement to display every field.

### 3. Review identity and relationship choices separately

Preview `data`, `dataHex`, `iid`, `profile`, and `id` from the accepted anchor. The builder selects a representation using the classification's identity ladder. Name-only input may use a generated identity and cannot establish that two same-named performers are the same entity.

Offer targets from each relationship's `expectedObjects`, then construct a triple using the chosen target atom ID and canonical predicate data. Keep display labels and temporary form values separate from accepted identity bytes. The [music catalog](/docs/examples/music-catalog) constructs both `byArtist` and `inAlbum` edges explicitly.

## Check the result

Valid synthetic input returns `ok: true` with a preview; omitting required `name` returns field issues. No atom or relationship has been persisted. Companion `contextUris` do not change the atom ID, while changing JSON-LD `@context` inside serialized atom data changes its bytes and ID.

## Related

[Representation profiles](/docs/concepts/representation-profiles), [classifications](/docs/reference/packages/classifications), and [primitives](/docs/reference/packages/primitives). Source: [Creation Profile types](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/classifications/src/creation-profile.ts), [generated form model](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/examples/hackathon-quickstart/src/generated-ui-model.ts), and [validation](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/classifications/src/atom-data.ts).
