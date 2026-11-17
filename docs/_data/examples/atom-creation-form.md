---
title: "Schema-backed atom creation form"
sidebar_label: "Schema-backed atom creation form"
description: "Generate a recording form from a Creation Profile, validate the fields, and see how a recording code changes the bytes used for its atom ID."
kind: tutorial
reader: ["app"]
packages: ["@0xintuition/classifications", "@0xintuition/primitives", "@0xintuition/ids"]
---

<AppliesTo />

**Time:** 15 minutes · **Steps:** 3

## What you'll build

Build a recording form with a title, artist, album, recording code, and reference URLs. Enter the synthetic title **Paper Moon Demo** and ISRC `US-RC1-26-00001` to preview the exact atom data. Then change the title and remove the recording code to see which edits change the atom ID.

## Before you start

Use Node.js 22.21.0. From the documentation repository root at the revision in **Full source**, install the example workspace once. npm needs registry access for installation. The runner uses only local data.

```sh
cd examples/v2
npm ci --ignore-scripts
```

The React component is optional for the offline run. To integrate it, use a React 19 client application with a TSX build step. See [Install the packages](/docs/build/install) and [representation profiles](/docs/concepts/representation-profiles).

## Steps

### 1. Generate the controls from the recording profile

In `form-model.ts`, the profile defines the field keys, labels, types, placeholders, and required flags. Track Name is required. Artist, Album, ISRC, and Canonical References are optional.

{/* example:start examples/v2/atom-creation-form/src/form-model.ts#recording-fields */}

```ts
import {
  validateClassificationValues,
  type ClassificationValidationIssue,
  type ClassificationValueMap,
} from '@0xintuition/classifications';
import { musicRecordingCreationProfile } from '@0xintuition/classifications/creation/music-recording';
import { calculateAtomId } from '@0xintuition/ids';
import { buildIidAnchor } from '@0xintuition/primitives/anchor';

export const { fields, classification } = musicRecordingCreationProfile;
type FieldKey = (typeof fields)[number]['key'];
export type RecordingDraft = Partial<Record<FieldKey, string>>;
export const maxFieldLength = 512;
```

{/* example:end */}

Inside the field loop in `creation-form.tsx`, each label points to a unique control. References use a multiline input. Editing any field clears the previous preview so an old ID cannot appear beside a new draft.

{/* example:start examples/v2/atom-creation-form/src/creation-form.tsx#field-control */}

```tsx
        const id = prefix + field.key;
        const error = issues.find((issue) => issue.field === field.key);
        const props = {
          id,
          value: draft[field.key] ?? '',
          required: field.required,
          placeholder: field.placeholder,
          maxLength: maxFieldLength,
          'aria-invalid': Boolean(error),
          'aria-describedby': error ? id + '-error' : undefined,
          style: {
            width: '100%',
            boxSizing: 'border-box' as const,
            font: 'inherit',
          },
          onChange: (
            event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
          ) => {
            setDraft({ ...draft, [field.key]: event.currentTarget.value });
            setResult(undefined);
          },
        };
        const control = (
          <div key={field.key} style={{ marginBlockEnd: '1rem' }}>
            <label htmlFor={id}>
              {field.label} ({field.required ? 'required' : 'optional'})
              {field.fieldType === 'string[]' && ' — one web URL per line'}
            </label>
            {field.fieldType === 'string[]' ? (
              <textarea {...props} />
            ) : (
              <input type="text" {...props} />
            )}
            {error && <div id={id + '-error'}>{error.message}</div>}
          </div>
        );
```

{/* example:end */}

### 2. Validate the draft and check the resulting bytes

The form caps each control at 512 characters and accepts up to four HTTP or HTTPS references. These limits belong to this example. Trim empty entries and split the reference list before calling the classification validator. For this form, a supplied ISRC must produce an ISRC anchor.

{/* example:start examples/v2/atom-creation-form/src/form-model.ts#preview */}

```ts
export function previewRecording(draft: RecordingDraft) {
  const values: ClassificationValueMap = {};
  const limits: ClassificationValidationIssue[] = [];
  for (const field of fields) {
    const raw = draft[field.key] ?? '';
    if (raw.length > maxFieldLength) {
      limits.push({
        field: field.key,
        message: 'Use 512 characters or fewer.',
      });
      continue;
    }
    if (!raw.trim()) continue;
    if (field.fieldType === 'string[]') {
      const lines = raw
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean);
      if (lines.length > 4 || !lines.every(isWebUrl)) {
        limits.push({
          field: field.key,
          message: 'Enter up to four web URLs, one per line.',
        });
      }
      values[field.key] = lines;
    } else {
      values[field.key] = raw.trim();
    }
  }
  const issues = [
    ...limits,
    ...validateClassificationValues(classification.slug, values),
  ];
  if (issues.length) return { ok: false as const, issues };

  const result = buildIidAnchor(classification.slug, values);
  if (!result.success) return failure(result.errors.join(' '));
  const anchor = result.value;
  if (values.isrc && !anchor.iid?.startsWith('int:isrc:')) {
    return failure('Check the recording code or leave it empty.', 'isrc');
  }
  if (calculateAtomId(anchor.dataHex) !== anchor.id) {
    return failure('The anchor ID does not match its bytes.');
  }
  return { ok: true as const, anchor };
}
```

{/* example:end */}

The P0 preview hashes the bytes of the bare recording IID. Removing the ISRC selects a different representation for the title-only draft. A missing required title returns a field issue before the builder runs, so there is no preview ID.

### 3. Mount the form in a client application

Copy `creation-form.tsx` and `form-model.ts` together into your React app. Use the React, React DOM, and Intuition dependency versions from the example workspace. In the client entrypoint, import the named `mountCreationForm` export from `./creation-form.tsx` and call it with an empty DOM element after that element exists. Keep its returned cleanup function for when the host removes the form.

{/* example:start examples/v2/atom-creation-form/src/creation-form.tsx#mount */}

```tsx
export function mountCreationForm(container: HTMLElement) {
  const root = createRoot(container);
  root.render(<CreationForm />);
  return () => root.unmount();
}
```

{/* example:end */}

Select **Preview recording** with an empty title to see the inline error. Enter the title and recording code above and preview again to see the identifier, profile, data, and atom ID. The Node runner below exercises the same model directly. The component itself uses the host’s TSX compiler.

## Run it

From `examples/v2`, run the TypeScript entrypoint.

```sh
node atom-creation-form/src/run-form.ts
```

```text
p0 int:isrc:USRC12600001 0xfdbf117d9e9df5675c5b4f75747598424fc9beb2d2a50e20408f4cd4dfb3d4ed
Title edit keeps ID: true
Without ISRC: p1 0x3d892ed7c6b2aafc2dcd3400f013d0de97e4d773b4ba15ad402dd9b67205a211
Missing required field "name".
```

## Full source

[Recording form, preview model, and offline runner](https://github.com/0xIntuition/intuition-docs/tree/3f47445235983fa93bf22d1d06f0584c6bac84fa/examples/v2/atom-creation-form). The pinned package example shows how to map [Creation Profile fields](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/examples/hackathon-quickstart/src/generated-ui-model.ts) into [React controls](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/examples/hackathon-quickstart/src/GeneratedUiPage.tsx). The [classification validator](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/classifications/src/atom-data.ts), [anchor builder](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/primitives/src/anchor.ts), and [atom ID calculation](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/ids/src/atom-id.ts) define the preview behavior.

## Next steps

Use [Creation Profiles](/docs/build/creation-profiles) to choose the fields for another type. To model an artist as a separate atom and connect it to the recording, build the [predicate picker](/docs/examples/predicate-picker).
