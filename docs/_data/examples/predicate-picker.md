---
title: "Predicate picker with relationship suggestions"
sidebar_label: "Predicate picker with relationship suggestions"
description: "Use a recording profile to filter a small catalog by relationship, resolve a predicate, and preview the ordered triple and its ID."
kind: tutorial
reader: ["app"]
packages: ["@0xintuition/predicates", "@0xintuition/classifications", "@0xintuition/ids"]
---

<AppliesTo />

**Time:** 15 minutes · **Steps:** 3

## What you'll build

Give a catalog editor two choices for **Paper Moon Demo**. Choosing **by artist** offers the group **Night Shift Trio**. Choosing **in album** offers the album **After Hours**. The preview displays the selected subject, predicate, object, and calculated triple ID.

## Before you start

Use Node.js 22.21.0. From the documentation repository root at the revision in **Full source**, install the example workspace once. npm needs registry access for installation. The runner uses only local data.

```sh
cd examples/v2
npm ci --ignore-scripts
```

For your own host, see [Install the packages](/docs/build/install). Read [predicates](/docs/concepts/predicates) and [triples](/docs/concepts/triples) for the role of the middle atom.

## Steps

### 1. Build the menu from the recording profile

The picker supports two profile relationships with classification hints. For `byArtist`, the hints are `music-group` and `person`. For `inAlbum`, the hint is `music-album`. Each entry below contains the exact synthetic text used to derive its atom ID.

{/* example:start examples/v2/predicate-picker/src/picker-model.ts#recording-menu */}

```ts
import { musicRecordingCreationProfile } from '@0xintuition/classifications/creation/music-recording';
import { calculateAtomId, calculateTripleId } from '@0xintuition/ids';
import { getPredicateById, getPredicateId } from '@0xintuition/predicates';

export const recording = {
  name: 'Paper Moon Demo',
  data: 'example:recording:paper-moon',
};
export const catalog = [
  {
    name: 'Night Shift Trio',
    classification: 'music-group',
    data: 'example:group:night-shift',
  },
  {
    name: 'After Hours',
    classification: 'music-album',
    data: 'example:album:after-hours',
  },
];
export const relationships = musicRecordingCreationProfile.relationships.filter(
  ({ predicate }) =>
    predicate.key === 'byArtist' || predicate.key === 'inAlbum',
);

export function objectHints(key: string): string[] {
  const relation = relationships.find(({ predicate }) => predicate.key === key);
  return (
    relation?.expectedObjects.flatMap((hint) =>
      hint.kind === 'classification' ? [hint.slug] : [],
    ) ?? []
  );
}
```

{/* example:end */}

### 2. Resolve the selected terms in order

Look up the profile’s predicate atom ID in the registry and check the key. Apply the classification hints to the selected object. Using the registry’s predicate ID, calculate the triple ID in subject, predicate, object order.

{/* example:start examples/v2/predicate-picker/src/picker-model.ts#preview-triple */}

```ts
export function previewTriple(key: string, objectData: string) {
  const relation = relationships.find(({ predicate }) => predicate.key === key);
  if (!relation)
    return { ok: false as const, message: 'Choose a relationship.' };
  const predicate = getPredicateById(relation.predicate.id);
  if (!predicate || predicate.key !== key) {
    return {
      ok: false as const,
      message: 'The predicate is missing from this registry.',
    };
  }
  const target = catalog.find((item) => item.data === objectData);
  if (!target)
    return { ok: false as const, message: 'Choose a catalog entry.' };
  if (!objectHints(key).includes(target.classification)) {
    return {
      ok: false as const,
      message: 'Choose an entry with a suggested classification.',
    };
  }
  const subjectId = calculateAtomId(recording.data);
  const predicateId = getPredicateId(predicate.key);
  const objectId = calculateAtomId(target.data);
  return {
    ok: true as const,
    status: predicate.status,
    subjectId,
    predicateId,
    objectId,
    tripleId: calculateTripleId(subjectId, predicateId, objectId),
  };
}
```

{/* example:end */}

The picker applies a local catalog policy. A matching classification makes a group eligible for selection. The editor still needs evidence that the group performed the recording. The registry status `proposed` describes the predicate definition. Calculating a triple ID neither registers the claim nor attests to it.

### 3. Connect both selections to the preview

In `picker.tsx`, the selected relationship determines the available catalog entries. Switching relationships clears the previous object and result. Selecting **Preview triple** with an incomplete selection displays the model’s feedback.

{/* example:start examples/v2/predicate-picker/src/picker.tsx#picker-state */}

```tsx
  const [key, setKey] = useState('');
  const [target, setTarget] = useState('');
  const [review, setReview] = useState<ReturnType<typeof previewTriple>>();
  const hints = objectHints(key);
  const candidates = catalog.filter((entry) =>
    hints.includes(entry.classification),
  );
```

{/* example:end */}

Copy `picker.tsx` and `picker-model.ts` together into a React 19 client application with a TSX compiler. Use the dependency versions in the example workspace. In the client entrypoint import `mountPredicatePicker` from `./picker.tsx`, pass it an empty DOM element after mounting that element, and call the returned cleanup when the host removes it.

{/* example:start examples/v2/predicate-picker/src/picker.tsx#mount */}

```tsx
export function mountPredicatePicker(container: HTMLElement) {
  const root = createRoot(container);
  root.render(<PredicatePicker />);
  return () => root.unmount();
}
```

{/* example:end */}

Choose **by artist**, then **Night Shift Trio**, then **Preview triple**. The Node entrypoint exercises the same calculation and also attempts an empty selection and an album in the artist slot.

## Run it

From `examples/v2`, run the TypeScript entrypoint.

```sh
node predicate-picker/src/run-picker.ts
```

```text
byArtist proposed 0x021384b11c429411aaa3ec931394524e5f3e1429b4f903d8719032f71e942445
Choose a relationship.
Choose an entry with a suggested classification.
```

The runner also checks that swapping the group and recording produces a different ID.

## Full source

[Predicate picker component, catalog model, and runner](https://github.com/0xIntuition/intuition-docs/tree/3f47445235983fa93bf22d1d06f0584c6bac84fa/examples/v2/predicate-picker). Compare the [upstream playground](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/examples/hackathon-quickstart/src/Playground.tsx), [profile relationship types](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/classifications/src/creation-profile.ts), [registry lookup](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/predicates/src/predicates.ts), and [ordered triple ID calculation](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/ids/src/triple-id.ts).

## Next steps

Adapt the [relationship suggestion guide](/docs/build/suggest-relationships) to your own catalog, or use [identity linking](/docs/examples/identity-linking) to review two representations of the same recording.
