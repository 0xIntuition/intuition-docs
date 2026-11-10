---
title: Versions and compatibility
sidebar_label: Versions and compatibility
slug: /build/compatibility
---

**Intuition V2** names the developer experience covered by these guides. Each npm package has its own version: for example, the documented SDK is `4.0.0-alpha.0` and protocol is `3.0.0-alpha.0`. Those npm major numbers do not rename the product generation.

These guides use the 21 alpha packages published on October 28, 2026. Alpha interfaces can change between releases. Pin the versions shown in the examples and commit your lockfile.

## Install the documented versions

Follow [installation and setup](./guides/installation.md) for the dependency set your workflow needs. An untagged install may select an earlier API. On November 2, 2026, npm's `latest` tag selected SDK `3.0.1`, protocol `2.0.3`, and CLI `0.0.0`; the versions in this guide used the `alpha` tag.

```sh
npm install @0xintuition/sdk@4.0.0-alpha.0 @0xintuition/protocol@3.0.0-alpha.0 viem@^2
```

The [package catalog](./packages/index.md) links to every documented npm version. The [release manifest](/intuition-release.json) records exact versions, public exports, peer dependencies, and artifact integrity for reproducible installs.

## Runtime and dependencies

Use named ESM imports; these releases do not provide CommonJS `require` entrypoints. Node 22+ supports the complete guide set, including remote parsing. SDK and processing composition packages declare Node 20+ support.

| Integration                           | Requirements                                                                                          |
| ------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| Identity, modeling, SDK, and protocol | viem 2 where declared; install the peers in each package's setup instructions                         |
| React hooks                           | React 18+, wagmi 2+, TanStack Query 5+, viem 2, protocol `3.0.0-alpha.0`, deployments `0.1.0-alpha.1` |
| Parser remote inspection              | Node-compatible DNS and pinned HTTP transport, Fetch, and Web Streams                                 |
| Classification and enrichment         | Plugins compatible with your runtime, provider settings, and cache policy                             |
| SDK API reads                         | A hosted GraphQL endpoint for the selected network                                                    |
| Core REST                             | A running Core node, its API version, and credentials for the configured access mode                  |

The React examples use the wagmi 2 API. Use your application's matching React and renderer versions. For web applications, select browser-compatible entrypoints and plugins, and keep provider secrets on a backend.

The manifest lists each package's declared `peers` and `engines`. TypeScript example checks use `strict: true` and `skipLibCheck: true`.

## Match contract operations to a deployment

The deployments package includes artifacts from `contracts-v2@1.1.0-alpha.1` and `contracts-v2-periphery@1.1.0-alpha.0`. Check that your target chain's contract implementation supports an operation before enabling it. URI creation, payable multicall, dynamic-fee, and on-behalf-of operations require compatible deployments.

The published catalog does not provide a TrustSwapAndBridgeRouter address; that address lookup throws. FeeProxy and other bridge helpers are separate capabilities. Use the [deployments reference](./packages/deployments.md) and [contract artifact details](https://github.com/0xIntuition/packages/blob/dde4fdf5774447b84cd0b820593fb0db7366e58d/docs/contract-artifacts.md) to select the correct ABI and address.

## Match the API to your backend

The SDK API client uses hosted GraphQL. Core offers a separate REST contract for a self-hosted graph. Installing an npm package does not change the API running on either service.

[Core REST examples](./guides/core-rest.md) describe the [linked Core source version](https://github.com/0xIntuition/intuition-core/tree/eebba114666ba2373690f2beb7dce565aa16f0b7). Check your node's schema and configuration before using them. The Query API uses local port 3000 by default; the separate atom processing service uses port 4010.

## Upgrade an existing application

Follow the [upgrade guide](./migration.md) to replace imports, check identity fixtures, and update peer dependencies. The [earlier SDK examples](/docs/intuition-sdk/quick-start) remain available for applications using `@0xintuition/sdk@3.0.1`.
