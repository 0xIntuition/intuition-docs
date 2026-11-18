---
title: Install and pin the packages
sidebar_label: Install and pin the packages
description: Install the packages for your task with exact versions, ESM, TypeScript, and compatible peers.
kind: how-to
reader: ["app", "agent"]
packages: ["@0xintuition/atom-classification", "@0xintuition/atom-enrichment", "@0xintuition/atom-parser", "@0xintuition/atom-runtime", "@0xintuition/classifications", "@0xintuition/cli", "@0xintuition/curves", "@0xintuition/deployments", "@0xintuition/ids", "@0xintuition/iid", "@0xintuition/iid-ladder", "@0xintuition/iid-registry", "@0xintuition/iid-spec", "@0xintuition/periphery", "@0xintuition/pipeline-runtime", "@0xintuition/predicates", "@0xintuition/primitives", "@0xintuition/protocol", "@0xintuition/react", "@0xintuition/schema-org", "@0xintuition/sdk"]
---

<AppliesTo />

Install the smallest package set that supports your task and keep its exact versions in your lockfile.

## Before you start

Use Node 22.18 or newer for these examples, which run TypeScript directly; Node 22.21.0 and TypeScript 5.9.3 match these examples. The processing libraries declare Node 20 or newer. Use ESM (`"type": "module"`) and a TypeScript configuration with `module` and `moduleResolution` set to `NodeNext` and `strict` enabled.

V2 names the documentation generation, not a package major version. Use the [package chooser](/docs/get-started/choose-packages) to match a task to its dependencies, or browse all 21 packages in the [package index](/docs/reference/packages). The [compatibility reference](/docs/reference/compatibility) records peers and contract artifact boundaries.

## Steps

### 1. Create an ESM project

```sh
mkdir intuition-example
cd intuition-example
npm init -y
npm pkg set type=module
```

### 2. Install for your task

Choose the relevant command; you do not need every package.

**Build atom identities and triples:**

```sh
npm install --save-exact @0xintuition/primitives@0.1.0 viem@2.31.4
```

**Read creation fields and relationship suggestions:**

```sh
npm install --save-exact @0xintuition/classifications@0.1.0 @0xintuition/predicates@0.1.0 viem@2.31.4
```

**Parse, classify, and enrich in a controlled host:**

```sh
npm install --save-exact @0xintuition/atom-parser@0.1.0 @0xintuition/atom-classification@0.1.0 @0xintuition/atom-enrichment@0.1.0 @0xintuition/iid-registry@0.1.0 viem@2.31.4
```

**Prepare contract operations and action envelopes:**

```sh
npm install --save-exact @0xintuition/sdk@4.0.0 @0xintuition/protocol@4.0.0 @0xintuition/deployments@0.1.0 viem@2.31.4
```

**Use React integration:**

```sh
npm install --save-exact @0xintuition/react@0.1.0 @0xintuition/protocol@4.0.0 @0xintuition/deployments@0.1.0 react@19.1.0 react-dom@19.1.0 wagmi@2.15.4 @tanstack/react-query@5.90.2 viem@2.31.4
```

Install packages that your code imports directly, even if another dependency currently installs them transitively. Keep React and its renderer on matching versions. Use each package's published entry points; internal `src` paths are not public imports.

### 3. Record the resolved dependency graph

Commit `package.json` and `package-lock.json`; use `npm ci` on subsequent installs. For a TypeScript project:

```sh
npm install --save-dev --save-exact typescript@5.9.3 @types/node@22.20.5
```

For React TypeScript code, also install matching type packages:

```sh
npm install --save-dev --save-exact @types/react@19.1.10 @types/react-dom@19.1.11
```

<!-- release-pins: hazard -->
At the November 17, 2026 registry check, `@0xintuition/sdk@alpha` still resolves to `4.0.0-alpha.0` and `@0xintuition/protocol@alpha` to `3.0.0-alpha.0`. The range `@0xintuition/protocol@3` selects `3.0.0`, not the pinned stable release. Avoid copying those older install selectors. `latest` currently matches the stable pins, but exact pins keep future installs reproducible.
<!-- /release-pins -->

## Check the result

Run `npm ls --depth=0` to inspect direct versions, then compile your project with `npx tsc --noEmit`. Resolve peer errors before running examples. Installing packages does not start a backend: follow [Query a Core node](/docs/build/query-core) to read indexed V2 data from your own source-built Core node.

## Troubleshooting

| Symptom | Check |
| --- | --- |
| Import not exported | Use an entry point listed on that package's reference page. |
| CommonJS import error | Set ESM and use a compatible Node runtime. |
| Missing peer | Install the package's declared peers in your application. |
| Provider returns nothing | Inspect runtime support, provider configuration, and result diagnostics; installation alone does not enable a provider. |

## Related

[Build a music catalog](/docs/examples/music-catalog), [creation profiles](/docs/build/creation-profiles), and [action envelopes](/docs/build/action-plans) use these pins. Source: [release policy](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/docs/release.md).
