---
title: Write a classification plugin
sidebar_label: Write a classification plugin
description: Implement and fixture-test a deterministic classifier, then register it at the actual engine composition boundary.
kind: how-to
reader: ["plugin"]
packages: ["@0xintuition/atom-classification"]
---

<AppliesTo />

Recognize a deliberate input pattern and emit a canonical classification through an explicitly registered plugin.

## Before you start

Read [atom classification](/docs/concepts/atom-classification) for the data a classifier receives and returns. Use Node 22.18 or newer and install the public package:

```sh
npm install --save-exact @0xintuition/atom-classification@0.1.0 viem@2.31.4
```

A classifier decides whether it recognizes input; a resolver produces canonical candidates. This example recognizes an explicit `idea:` prefix offline. It does not infer that arbitrary prose names a unique entity, mint an IID, derive an atom ID, or persist a graph record.

## Steps

### 1. Declare the plugin and register its dependencies

A manifest declares identity, version, compatible engine range, runtime, capabilities, permissions, dependencies, provided features, and priority. Lower priorities run earlier. `type-profiles` supplies the type registry used by this resolver; the emitted `DefinedTerm` type must be registered.

{/* example:start examples/v2/music-catalog/src/classification-plugin.ts#classification-plugin */}
```ts
import {
  createClientEngine,
  createTypeProfilesPlugin,
  validatePluginManifest,
  type AtomClassificationPlugin,
} from '@0xintuition/atom-classification';

export const ideaPlugin: AtomClassificationPlugin = {
  manifest: {
    id: 'example-idea',
    version: '1.0.0',
    engineRange: '^0.1.0',
    runtime: 'universal',
    priority: 30,
    capabilities: ['classifier:text:idea', 'resolver:lexical:defined-term'],
    permissions: [],
    dependsOn: ['type-profiles'],
    provides: ['example:idea'],
  },
  classifiers: [
    {
      id: 'idea-classifier',
      classify(input) {
        const name = input.startsWith('idea:') ? input.slice(5).trim() : '';
        return name
          ? {
              type: 'text',
              domain: 'lexical',
              subtype: 'idea',
              confidence: 1,
              meta: { name },
            }
          : null;
      },
    },
  ],
  resolvers: [
    {
      id: 'idea-resolver',
      executionMode: 'deterministic',
      canResolve: (classification) =>
        classification.domain === 'lexical' &&
        classification.subtype === 'idea',
      resolve: ({ request }) => ({
        classifications: [
          {
            type: 'DefinedTerm',
            data: {
              '@context': 'https://schema.org/',
              '@type': 'DefinedTerm',
              name: request.input.slice(5).trim(),
            },
          },
        ],
      }),
    },
  ],
};
validatePluginManifest(ideaPlugin.manifest);
const engine = createClientEngine({
  plugins: [createTypeProfilesPlugin(), ideaPlugin],
});
const input = 'idea: semantic grounding';
if (Buffer.byteLength(input, 'utf8') > 4_096)
  throw new Error('Input too large');
export const result = await engine.classify({
  input,
  mode: 'client-only',
  classificationSessionId: 'docs-plugin',
});
console.log(result.resolved?.publishable);
```
{/* example:end */}

### 2. Keep matching deterministic and output canonical

Return `null` for unrelated input. Set the resolver's `executionMode: 'deterministic'` for this offline client flow: an omitted mode defaults to server enrichment and the client-only policy would skip that resolver. Prefer resolver `classifications` containing `type`, `data`, and optional metadata; the engine supplies missing plugin, provider, timestamp, and confidence metadata. `resolved.publishable` is the identity-oriented projection, while `resolved.classifications` may contain richer detail. Neither is proof of external truth.

The compatibility `atoms` projection still exists in the pinned implementation. If a resolver supplies both forms, the engine checks parity. Avoid introducing new dependencies on legacy-only fields. Declare permissions for capabilities you use; client runtimes cannot execute AI-capable plugins. Keep input byte and collection limits at the host boundary before parsing.

### 3. Test with fixed inputs

Run the complete [plugin helper](https://github.com/0xIntuition/intuition-docs/blob/d137b0adacbfb9fda3b0d07d94e695ca4e7abc03/examples/v2/music-catalog/src/classification-plugin.ts) with `node`. Verify that the recognized input produces a `DefinedTerm` with name `semantic grounding`, unrelated input makes the classifier return `null`, and empty `idea:` input is rejected by the classifier. Compare semantic output across repeated runs; default timestamp metadata is time-dependent, so it is not part of a deterministic equality assertion.

Validate the manifest, test missing dependencies, and verify runtime restrictions before registering in a service. Test canonical/legacy parity only if you intentionally emit both forms.

### 4. Register at the host's composition boundary

The snippet passes an explicit plugin set to `createClientEngine`; registration is complete for that engine only. Adding a file to a repository does not install it into other engines.

In a fork of Core, inspect [the service runtime wrapper](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/services/atom-services/src/service/runtime.ts). It calls the public package's `createAtomServicesProcessingRuntime`. That package accepts `pluginOverrides.classification`; the pinned Core wrapper's local option type does not expose that override. A fork owner must explicitly wire the chosen plugin set into the wrapper's runtime construction, preserve required built-ins, and rebuild the affected services.

The classification worker also reaches that runtime wrapper through [its engine setup](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/services/workers/src/kg/atom-classification/index.ts). Review both call paths and deploy the rebuilt service and worker processes that should use the plugin. There is no documented directory loader, environment-variable plugin installer, or automatic registration across all running processes. The source setup workflow is [Query a Core node](/docs/build/query-core).

## Check the result

The offline helper validates the manifest and prints a publishable `DefinedTerm` envelope. This proves the local engine contract; Core registration and service execution require the fork's explicit source change and tests.

## Related

[Classify and enrich atoms](/docs/build/classify-enrich) and [atom classification](/docs/reference/packages/atom-classification).

Sources: [plugin authoring contract](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/atom-classification/docs/plugin-authoring.md), [external plugin example](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/examples/atom-classification-plugin/src/index.ts), [runtime override contract](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/atom-runtime/src/consumers.ts), and [Core classification guide](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/docs/writing-a-classification-plugin.md).
