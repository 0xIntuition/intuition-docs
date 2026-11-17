---
title: Parse user input
sidebar_label: Parse user input
description: Interpret a URL, IID, or text label locally, retain warnings, and handle invalid identifiers and input size errors.
kind: how-to
reader: ["app", "plugin"]
packages: ["@0xintuition/atom-parser"]
---

<AppliesTo />

Turn a pasted URL, IID, or text label into a local candidate that your application can inspect before classification.

## Before you start

Choose how many input bytes your host can accept and apply that limit at the transport boundary. This example also sets a 64-byte parser limit to make the oversized case easy to try. See [atom parsing](/docs/concepts/atom-parsing).

For your own project, follow [Install the packages](/docs/build/install). To run the [offline example](https://github.com/0xIntuition/intuition-docs/blob/c3b1eaa91a822bb59b20cb6de2bc9b874a00b7b0/examples/v2/music-catalog/src/parse-input.ts), install its locked dependencies from the documentation repository root with Node.js 22.21.0.

```sh
npm ci --prefix examples/v2 --ignore-scripts
```

## Steps

### 1. Make local parsing explicit

Pass `remoteFetch: false` for pasted input. The package default allows remote inspection for eligible URLs and IPFS inputs. With inspection disabled, URL detection only interprets the supplied text. The parser trims outer ASCII whitespace for detection and measures the original input in UTF-8 bytes for the size limit.

### 2. Use the result kind and preserve warnings

For a URL, take `canonicalUrl`. For an IID, check `valid` before using `canonicalIid` and keep the reason when validation fails. A `plain_string` is a label you can offer for classification or manual entry. The helper preserves the parser’s warnings for all returned candidates and handles `ParseError` codes separately.

{/* example:start examples/v2/music-catalog/src/parse-input.ts#parse-candidate */}
```ts
import { parseAtom, ParseError } from '@0xintuition/atom-parser';

export async function parseCandidate(input: string) {
  try {
    const result = await parseAtom(input, {
      remoteFetch: false,
      maxInputBytes: 64,
    });
    const { kind, warnings } = result;
    if (result.kind === 'iid') {
      return {
        kind,
        warnings,
        valid: result.valid,
        iid: result.canonicalIid,
        anchorEligible: result.anchorEligible,
        reason: result.reason,
      };
    }
    return {
      kind,
      warnings,
      value:
        result.kind === 'url' ? result.canonicalUrl : result.normalizedInput,
    };
  } catch (error) {
    if (!(error instanceof ParseError)) throw error;
    return { error: error.code };
  }
}
```
{/* example:end */}

### 3. Decide what to retain

Present a canonical identifier to the caller for review. Keep free text available for correction or [classification](/docs/build/classify-enrich). Even a syntactically valid identifier still requires evidence that it belongs to the intended entity.

## Check the result

```sh
node examples/v2/music-catalog/src/parse-input.ts
```

| Input | Expected result |
| --- | --- |
| ` https://example.org/catalog ` | `url` with canonical URL `https://example.org/catalog` |
| `INT:ISRC:US-RC1-76-07839` | `iid`, valid, with `int:isrc:USRC17607839` |
| `int:unknown:example` | `iid`, invalid, with reason `unknown_or_malformed_iid` |
| `A catalog label` | `plain_string` |
| Spaces only | `EMPTY_INPUT` |
| 65 ASCII characters | `INPUT_TOO_LARGE` |

All four returned candidates in this run have an empty warnings list, including the invalid IID. Use the IID’s `valid` field for the decision.

## Related

[Atom parser package](/docs/reference/packages/atom-parser), [detection order](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/atom-parser/src/detect.ts), [remote inspection and byte checks](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/atom-parser/src/parse.ts), and [IID result fields](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/atom-parser/src/iid.ts).
