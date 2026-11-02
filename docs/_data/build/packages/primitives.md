---
title: '@0xintuition/primitives guide'
slug: /build/packages/primitives
sidebar_position: 9
---

Build atoms and triples with validated, deterministic public helpers.

Candidate source version: **0.1.0-alpha.1**. [Release compatibility](../compatibility.md) explains publication and deployment prerequisites.

## Install

```sh
npm install @0xintuition/primitives@0.1.0-alpha.1 viem@^2
```

Use ESM imports. Required peers: `viem ^2.0.0`.

## Main surface

| Export or operation                            | Purpose                                                             |
| ---------------------------------------------- | ------------------------------------------------------------------- |
| `buildIidAnchor(slug, values, options?)`       | BuildResult with exact bytes, ID, profile, nullable IID and context |
| `buildAtomAnchor`                              | Alias of buildIidAnchor                                             |
| `buildEthereumAccount(values)`                 | Validated compatibility atom builder                                |
| `buildTripleByName(subjectId, name, objectId)` | BuildResult resolving a canonical predicate                         |

## First use

```ts
import { buildIidAnchor } from '@0xintuition/primitives/anchor';
const built = buildIidAnchor('music-recording', { isrc: 'USRC17607839' });
if (!built.success) throw new Error(built.errors.join('; '));
console.log(built.value);
```

## Integration decisions

Always narrow `BuildResult.success`. Context URIs never affect the atom ID. Inspect the returned `profile`, `data`, and `id` before persistence; the requested profile alone does not describe the serialized bytes.

## Builder options and result

`buildIidAnchor` and its alias `buildAtomAnchor` are available from `@0xintuition/primitives/anchor` or the package root. Import the following public types from `@0xintuition/primitives` or `@0xintuition/primitives/types`. These are the pinned [options and result declarations](https://github.com/0xIntuition/packages/blob/1dc7103d2a05f23bc565a81df4b001336ce9ba53/packages/primitives/src/types.ts), with comments omitted:

```ts
import type { IdentityClass } from '@0xintuition/iid';
import type { Hex } from 'viem';

type AnchorProfile = 'p0' | 'p1' | 'p2';
interface UriLimits {
  readonly maxUris: number;
  readonly maxUriBytes: number;
}
interface IidAnchorOptions {
  readonly candidateIid?: string;
  readonly profile?: AnchorProfile;
  readonly contextUris?: readonly string[];
  readonly uriLimits?: UriLimits;
}
interface AtomAnchor {
  classification: string;
  profile: AnchorProfile;
  iid: string | null;
  scheme: string | null;
  class: IdentityClass | null;
  tag?: number;
  data: string;
  dataHex: Hex;
  id: Hex;
  contextUris: readonly string[];
  providerPlan: readonly string[];
  values: Readonly<Record<string, unknown>>;
}
type BuildResult<T> =
  | { success: true; value: T }
  | { success: false; errors: string[] };

declare function buildIidAnchor(
  classificationSlug: string,
  values: Record<string, unknown>,
  options?: IidAnchorOptions,
): BuildResult<AtomAnchor>;
```

`dataHex` is the UTF-8 encoding of `data`; `id` is `calculateAtomId(data)`. A fallback envelope has no IID, so `iid`, `scheme`, and `class` can be `null`. Candidate mode can also return `class: null` for an admitted scheme without a recognized identity class. `tag` is present only for a derived gen1 rung. `providerPlan` lists capabilities and does not execute providers. `values` retains the supplied evidence; it does not mean every field appears in `data`.

Context URIs are trimmed, empty entries removed, and exact duplicates removed while preserving first occurrence order. `uriLimits` defaults to the offline policy floor of 5 URIs and 700 UTF-8 bytes per URI. Pass the live protocol limits when available; the builder never reads them itself. Exceeding either limit returns errors.

## Derived and candidate paths

When `candidateIid` is absent, the builder derives identity from `values` using the classification's ladder. When `candidateIid` is supplied, it is authoritative: the builder validates it without re-deriving identity from `values`. It must already be canonical; candidate mode does not normalize provider input. Registered schemes use their canonical validator, and Wikidata candidates have additional classification and minting checks. Admitted unknown schemes follow the generic IID shape; admission alone does not make them eligible for P0.

**Candidate mode ignores `options.profile`, including explicit `p0`, `p1`, and `p2`.** It selects P0 for an anchor-eligible candidate, excluding weak account handles, and P1 for other admitted candidates. Check the returned profile and exact bytes before persisting them.

| Path                                             | Requested profile      | Returned profile and bytes                                                   |
| ------------------------------------------------ | ---------------------- | ---------------------------------------------------------------------------- |
| Derived, eligible IID                            | omitted                | `p0`; bare canonical IID                                                     |
| Derived, ineligible IID                          | omitted                | `p1`; typed identity envelope                                                |
| Derived, eligible IID                            | `p1` or `p2`           | Requested label; both serialize the same identity envelope in this candidate |
| Derived, ineligible IID or no usable IID         | `p0`                   | Structured error                                                             |
| Derived, no usable IID and valid fallback fields | omitted, `p1`, or `p2` | `p1`; deterministic classification envelope without `identifier`             |
| Candidate, eligible IID                          | any or omitted         | `p0`; bare candidate IID, regardless of requested profile                    |
| Candidate, other admitted IID                    | any or omitted         | `p1`; classification envelope with the candidate `identifier`                |

For derived IIDs, explicit P1/P2 currently use the same serializer. P2 does **not** add enriched display fields; a returned `profile: 'p2'` does not prove enrichment. Candidate P1 builds its envelope from classification values and inserts the candidate identifier, so it can differ from the derived identity envelope too. These are [pinned builder behaviors](https://github.com/0xIntuition/packages/blob/1dc7103d2a05f23bc565a81df4b001336ce9ba53/packages/primitives/src/anchor.ts), not promises about a future release.

### Offline profile example

Run as an ESM script with the candidate dependencies. This example performs no HTTP or wallet calls:

```js
import assert from 'node:assert/strict';
import { buildIidAnchor } from '@0xintuition/primitives/anchor';
import { calculateAtomId } from '@0xintuition/ids';

const values = { isrc: 'USRC17607839', name: 'Example recording' };
const p1 = buildIidAnchor('music-recording', values, { profile: 'p1' });
const p2 = buildIidAnchor('music-recording', values, { profile: 'p2' });
const candidate = buildIidAnchor('music-recording', values, {
  candidateIid: 'int:isrc:USRC17607839',
  profile: 'p2',
});
if (!p1.success) throw new Error(p1.errors.join('; '));
if (!p2.success) throw new Error(p2.errors.join('; '));
if (!candidate.success) throw new Error(candidate.errors.join('; '));

assert.equal(p1.value.profile, 'p1');
assert.equal(p2.value.profile, 'p2');
assert.equal(p1.value.data, p2.value.data);
assert.equal(p1.value.id, p2.value.id);
assert.equal(JSON.parse(p2.value.data).identifier, 'int:isrc:USRC17607839');
assert.equal(JSON.parse(p2.value.data).name, undefined);
assert.equal(candidate.value.profile, 'p0');
assert.equal(candidate.value.data, 'int:isrc:USRC17607839');
assert.equal(candidate.value.id, calculateAtomId(candidate.value.data));
assert.notEqual(candidate.value.id, p2.value.id);
console.log({
  derived: { profile: p2.value.profile, data: p2.value.data },
  candidate: { profile: candidate.value.profile, data: candidate.value.data },
});
```

## Source and full contract

[Source and package guide](https://github.com/0xIntuition/packages/tree/1dc7103d2a05f23bc565a81df4b001336ce9ba53/packages/primitives) · [npm package](https://www.npmjs.com/package/@0xintuition/primitives). The [machine-readable manifest](/intuition-release.json) lists all declared public subpaths and peer dependencies. Npm links name the intended package; this page does not assert that the candidate has been published.
