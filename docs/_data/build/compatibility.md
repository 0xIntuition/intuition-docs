---
title: 'Published versions and compatibility'
slug: /build/compatibility
sidebar_position: 10
---

These guides target the **October 28, 2026 alpha release** of all 21 public packages. npm publication, exact versions, exports, peers, and source provenance were checked on **November 2, 2026**. The [release manifest](/intuition-release.json) records each artifact's tarball URL, SHA-512 integrity, publication time, and observed dist-tags.

## Install the documented release

Use exact versions from the [package catalog](./packages/index.md). All 21 releases are on the `alpha` tag, but `latest` is not consistently the same release. In particular, untagged SDK installs still select `3.0.1`, protocol selects `2.0.3`, and CLI selects `0.0.0` at the time of verification. SDK and protocol use independent major versions.

```sh
npm install @0xintuition/sdk@4.0.0-alpha.0 @0xintuition/protocol@3.0.0-alpha.0 viem@^2
```

For reproducible applications, commit your package-manager lockfile. Use named ESM imports; these packages do not ship CommonJS `require` entrypoints. Start with Node 22+ for the complete guide set, including remote parsing. The SDK and processing composition packages declare Node 20+ support. Use browser-compatible entrypoints and plugins when integrating a web application; keep server providers and credentials on your backend.

## Source and publication evidence

| Repository                                                                                                    | Baseline                                                            | Scope                                    |
| ------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- | ---------------------------------------- |
| [packages](https://github.com/0xIntuition/packages/tree/dde4fdf5774447b84cd0b820593fb0db7366e58d)             | October 28 alpha release; npm `gitHead` matches the selected source | Public package exports and SDK reference |
| [intuition-core](https://github.com/0xIntuition/intuition-core/tree/eebba114666ba2373690f2beb7dce565aa16f0b7) | Existing Core guide baseline                                        | REST, persistence, workers, and indexing |

The package update does not repin Core or prove that a hosted service has adopted it. Core REST recipes remain tied to their linked revision. The npm version pages for [SDK](https://www.npmjs.com/package/@0xintuition/sdk/v/4.0.0-alpha.0), [protocol](https://www.npmjs.com/package/@0xintuition/protocol/v/3.0.0-alpha.0), and every package in the catalog identify the installable artifacts.

## Choose compatible dependencies

| Surface                              | Required integration                                                                                                                                                    |
| ------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Identity/modeling and SDK/protocol   | viem 2 where declared; exact internal alpha dependencies are published together                                                                                         |
| React hooks                          | `react >=18`, `wagmi >=2`, `@tanstack/react-query >=5`, viem 2, protocol `3.0.0-alpha.0`, deployments `0.1.0-alpha.1`; upstream tests exercise React 19/wagmi 2/Query 5 |
| Parser remote inspection             | Node-compatible DNS and pinned HTTP transport, Fetch/Web Streams; disable remote inspection for local detection                                                         |
| Classifier, enricher, shared runtime | Explicit provider settings, runtime-compatible plugins, credentials, and cache policy                                                                                   |
| SDK API reads                        | Hosted GraphQL schema; explicit mainnet/testnet URL                                                                                                                     |
| Core Query API                       | REST node, migrations, credentials, and indexing configuration; local default port 3000                                                                                 |
| Core atom-services                   | Stateless classification/enrichment HTTP service; local default port 4010                                                                                               |

The manifest's per-package `peers` and `engines` are the authoritative declared ranges. A package without `engines` does not thereby promise every runtime. The snippet checks use strict TypeScript with `skipLibCheck: true`, matching the upstream consumer checks.

## Contract capabilities remain deployment-specific

The deployment package includes artifacts from `contracts-v2@1.1.0-alpha.1` and `contracts-v2-periphery@1.1.0-alpha.0`. Publishing these libraries does not upgrade a contract. Verify the destination chain's implementation before using URI creation, payable multicall, dynamic-fee, or on-behalf-of operations.

The published catalog deliberately withholds the TrustSwapAndBridgeRouter address pending a compatible deployment; its lookup throws. FeeProxy and other bridge helpers are separate capabilities. Use the [deployment guide](./packages/deployments.md) and the pinned [artifact provenance](https://github.com/0xIntuition/packages/blob/dde4fdf5774447b84cd0b820593fb0db7366e58d/docs/contract-artifacts.md) when selecting addresses.

## Upgrade existing applications

The site's SDK v3 and hosted GraphQL documentation remains available for existing integrations. For SDK 4, start with [migration](./migration.md), then [installation](./guides/installation.md). Source and npm artifact checks verify the library contract; provider availability, your credentials, hosted APIs, and deployed contract behavior still depend on your environment.
