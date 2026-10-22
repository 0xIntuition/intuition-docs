---
title: '@0xintuition/atom-classification guide'
slug: /build/packages/atom-classification
sidebar_position: 11
---

Compose a plugin-based classification engine for client, progressive, or server execution.

Candidate source version: **0.1.0-alpha.0**. [Release compatibility](../compatibility.md) explains publication and deployment prerequisites.

## Install

```sh
npm install @0xintuition/atom-classification@0.1.0-alpha.0
```

Use ESM imports.

## Main surface

| Export or operation             | Purpose                                 |
| ------------------------------- | --------------------------------------- |
| `createClientEngine(options)`   | Client-compatible classification engine |
| `createPlainTextPlugin()`       | Local text classification plugin        |
| `createTypeProfilesPlugin()`    | Runtime type-profile plugin             |
| `defaultClassificationPreset()` | Explicit default plugin selection       |

## First use

```ts
import {
  createClientEngine,
  createPlainTextPlugin,
  createTypeProfilesPlugin,
} from '@0xintuition/atom-classification';
const engine = createClientEngine({
  plugins: [createTypeProfilesPlugin(), createPlainTextPlugin()],
});
console.log(
  await engine.classify({
    input: 'An idea',
    mode: 'client-only',
    classificationSessionId: 'example',
  }),
);
```

## Integration decisions

Creating an engine does not enable all plugins or persist results. This runtime is distinct from classifications, which owns canonical entity specifications. Keep provider credentials on the server.

## Source and full contract

[Source and package guide](https://github.com/0xIntuition/packages/tree/1dc7103d2a05f23bc565a81df4b001336ce9ba53/packages/atom-classification) · [npm package](https://www.npmjs.com/package/@0xintuition/atom-classification). The [machine-readable manifest](/intuition-release.json) lists all declared public subpaths and peer dependencies. Npm links name the intended package; this page does not assert that the candidate has been published.
