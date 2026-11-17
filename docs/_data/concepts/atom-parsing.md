---
title: "Atom parsing"
sidebar_label: "Atom parsing"
description: "Recognize URLs, IIDs and free text locally. Learn which parse results require validation and when the parser makes a network request."
kind: concept
reader: ["app", "plugin"]
packages: ["@0xintuition/atom-parser"]
depends_on: ["atoms", "iid"]
---

<AppliesTo />

Atom parsing turns a raw input string into a candidate that an application can inspect. The parser keeps the original input, trims outer ASCII whitespace for detection, and returns a kind with fields specific to that kind. A catalog can use those fields to decide whether to validate an identifier, inspect a URL, or ask the user what a title refers to.

**Builds on:** [Atoms](/docs/concepts/atoms), [The Intuition Identifier (IID)](/docs/concepts/iid).

**Implemented by:** [@0xintuition/atom-parser](/docs/reference/packages/atom-parser).

## How it works

Call `parseAtom` with `remoteFetch` set to `false` for local detection. Branch on `kind` before reading kind-specific fields. For an IID candidate, inspect `valid` and `canonicalIid`. A malformed candidate still has kind `iid` and carries a reason. Parsing a valid IID returns locally. [Parser README](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/atom-parser/README.md), [local detection](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/atom-parser/src/detect.ts), [IID validation](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/atom-parser/src/iid.ts).

URL and IPFS inputs enable remote inspection by default. When a fetch is permitted and a target is available, the parser can inspect response bytes to distinguish a webpage, an image, or another content type. Set a request deadline and a byte limit for this work. For untrusted URLs, enforce destination restrictions at your network boundary as well. [Parsing and fetch policy](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/atom-parser/src/parse.ts), [remote transport policy](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/atom-parser/README.md#remote-transport-policy).

## Example

A catalog import has three cells. With remote fetching disabled, their results call for different decisions.

| Input | Local result | Catalog decision |
| --- | --- | --- |
| `https://example.com/catalog` | `kind` is `url`, with a canonical URL and no remote inspection | Keep the link as a lead. Its contents are still unknown. |
| `int:mbid:recording:b1a9c0e9-d987-4042-ae91-78d6a3267d69` | `kind` is `iid`, with a valid canonical recording IID | Pass the canonical value to the registry to learn which providers support that scheme. |
| `One More Time` | `kind` is `plain_string` | Retain the title and ask for an identifier to distinguish recordings with the same name. |

The second row uses the synthetic recording in [Classify and enrich atoms](/docs/build/classify-enrich). Normalization helps interpret a cell. When deriving an atom ID, use the exact bytes of the representation you choose to publish.

## Common mistakes

- Treating every `int:` prefix as a valid identifier. Check the validation fields before using a candidate as an anchor.
- Reporting a recognized URL as a verified recording. Local detection established its syntax. Even with remote inspection enabled, a denied request or timeout can leave the content unknown.
- Replacing the original atom bytes with trimmed input when looking up an existing atom. A change in bytes can change its ID.

## Next

[Atom classification](/docs/concepts/atom-classification) explains how plugins use evidence to assign a type.
