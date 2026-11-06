---
title: 'Install the packages for your application'
slug: /build/guides/installation
sidebar_position: 0
---

Start with one workflow. The packages are ESM-only, and the examples use Node 22+ with viem 2 where required. These are the published October 28 alpha versions; an untagged install can select an older API. See [compatibility](../compatibility.md) for the release snapshot.

## Model an entity offline

```sh
mkdir intuition-app
cd intuition-app
npm init -y
npm pkg set type=module
npm install @0xintuition/primitives@0.1.0-alpha.1 @0xintuition/ids@0.1.0-alpha.1 viem@^2
```

Run the JavaScript in [your first atom](./first-atom.md) with `node first-atom.mjs`. You need no wallet, RPC URL, provider key, or Core node for this step.

Add shared form and relationship data when your application needs it:

```sh
npm install @0xintuition/classifications@0.1.0-alpha.1 @0xintuition/predicates@0.1.0-alpha.1
```

Follow [Creation Profiles](./creation-profiles.md) to build the same entity shapes and relationship suggestions used by other Intuition applications.

## Process inputs on a server

```sh
npm install @0xintuition/atom-runtime@0.1.0-alpha.0 @0xintuition/atom-parser@0.1.0-alpha.0 @0xintuition/atom-classification@0.1.0-alpha.0 @0xintuition/atom-enrichment@0.1.0-alpha.0
```

Use [processing](./processing.md) for the parser-to-classifier-to-enricher handoff. `atom-runtime` composes shared engines and caches; `atom-classification` supplies plugins when you need a smaller custom engine. Install `pipeline-runtime` directly when you use its Promise concurrency or outcome helpers. Declare every package your code imports, even when another package also depends on it.

Keep provider credentials on your server. Pass configuration explicitly; a runtime import does not start workers, provision caches, or persist data.

## Query and prepare protocol actions

```sh
npm install @0xintuition/sdk@4.0.0-alpha.0 @0xintuition/protocol@3.0.0-alpha.0 @0xintuition/deployments@0.1.0-alpha.1 viem@^2
```

Use `sdk/api` for [hosted GraphQL reads](./sdk-reads.md), `sdk/actions` for [quotes and transaction preparation](./onchain.md), and the [action-envelope guide](./action-envelopes.md) for serializable plans built from supplied read context. Use [Core REST](./core-rest.md) when you operate your own graph backend.

## Add React hooks

In an existing React application, add the matching peer packages:

```sh
npm install @0xintuition/react@0.1.0-alpha.1 @0xintuition/protocol@3.0.0-alpha.0 @0xintuition/deployments@0.1.0-alpha.1 @tanstack/react-query@^5 wagmi@^2 viem@^2
```

The hook package supports React 18+; use your application's matching React/renderer versions. Follow the [React provider and hook guide](../packages/react.md). The SDK itself does not include React hooks.

## TypeScript projects

Compile Node examples with `module: "NodeNext"`, `moduleResolution: "NodeNext"`, `target: "ES2022"`, and `strict: true`. Bundler applications can use their framework's ESM-aware resolver. Upstream consumer checks set `skipLibCheck: true` because the wagmi declaration graph has upstream type errors without it.

Commit the lockfile after installing. For `ERR_PACKAGE_PATH_NOT_EXPORTED`, choose an entrypoint from the [manifest](/intuition-release.json), rather than importing `src/` or `dist/` internals. For a missing export, check the installed version and the [SDK migration map](../migration.md); SDK v3 and v4 have different root exports.
