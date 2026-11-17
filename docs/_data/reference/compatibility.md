---
title: "Compatibility"
sidebar_label: "Compatibility"
description: "Match exact package pins, isolated example runtimes, contract artifacts, and the pinned Core source to your integration."
kind: reference
reader: ["app", "operator"]
packages: ["@0xintuition/atom-classification", "@0xintuition/atom-enrichment", "@0xintuition/atom-parser", "@0xintuition/atom-runtime", "@0xintuition/classifications", "@0xintuition/cli", "@0xintuition/curves", "@0xintuition/deployments", "@0xintuition/ids", "@0xintuition/iid", "@0xintuition/iid-ladder", "@0xintuition/iid-registry", "@0xintuition/iid-spec", "@0xintuition/periphery", "@0xintuition/pipeline-runtime", "@0xintuition/predicates", "@0xintuition/primitives", "@0xintuition/protocol", "@0xintuition/react", "@0xintuition/schema-org", "@0xintuition/sdk"]
---

<AppliesTo />

Use exact package versions and public entry points listed in the [manifest](/intuition-release.json). V2 names the package generation; it does not make npm, contract, and Core versions interchangeable.

## Package pins

{/* generated:start release-pins */}

| Package | Version |
| --- | --- |
| `@0xintuition/atom-classification` | `0.1.0` |
| `@0xintuition/atom-enrichment` | `0.1.0` |
| `@0xintuition/atom-parser` | `0.1.0` |
| `@0xintuition/atom-runtime` | `0.1.0` |
| `@0xintuition/classifications` | `0.1.0` |
| `@0xintuition/cli` | `0.1.0` |
| `@0xintuition/curves` | `0.1.0` |
| `@0xintuition/deployments` | `0.1.0` |
| `@0xintuition/ids` | `0.1.0` |
| `@0xintuition/iid` | `0.1.0` |
| `@0xintuition/iid-ladder` | `0.1.0` |
| `@0xintuition/iid-registry` | `0.1.0` |
| `@0xintuition/iid-spec` | `0.1.0` |
| `@0xintuition/periphery` | `0.1.0` |
| `@0xintuition/pipeline-runtime` | `0.1.0` |
| `@0xintuition/predicates` | `0.1.0` |
| `@0xintuition/primitives` | `0.1.0` |
| `@0xintuition/protocol` | `4.0.0` |
| `@0xintuition/react` | `0.1.0` |
| `@0xintuition/schema-org` | `0.1.0` |
| `@0xintuition/sdk` | `4.0.0` |

{/* generated:end */}

## Runtime requirements

Packages are ESM-only: use named imports and set `"type": "module"` for Node applications. The manifest lists the engines and peers declared by each published package. The documentation's checks use an isolated dependency tree under `examples/v2`; V1 examples use separate V1 dependencies.

| Surface | Requirements or exact documentation pins |
| --- | --- |
| Direct TypeScript quickstart | Node 22.18 or newer |
| Example compiler | TypeScript 5.9.3; strict application checking, library declaration checking skipped |
| Contract clients | viem 2.31.4 in the checked examples; satisfy each package's declared peers |
| React example environment | React and React DOM 19.1.0; wagmi 2.15.4; TanStack Query 5.90.2 |
| Example type packages | Node types 22.20.5; React types 19.1.10; React DOM types 19.1.11 |
| Parser remote inspection | Node-compatible DNS/HTTP transport, Fetch, and Web Streams; choose runtime-compatible entry points |
| Classification and enrichment | Explicit plugins, provider configuration, credentials where needed, and cache policy |
| Core source workflow | Git, Bun 1.3.11, Node 20 or newer, Docker Compose v2 with a running Docker daemon, and curl |

The React package declares React 18+, wagmi 2+, TanStack Query 5+, viem 2, and the manifest's protocol/deployments package lines as peers. Keep your application's React and renderer versions aligned. Provider secrets belong on a backend; local parsing does not imply that remote enrichment works without network access.

## Contract artifacts and deployments

The package artifacts come from `@0xintuition/contracts-v2@1.1.0-alpha.1` and `@0xintuition/contracts-v2-periphery@1.1.0-alpha.0`. Their versioning is separate from the stable library release. [Artifact provenance](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/docs/contract-artifacts.md) verifies bundled interfaces and bytecode; it does not deploy or upgrade a contract.

Select addresses and check the implementation on your target chain before enabling URI creation, payable multicall, dynamic-fee, or on-behalf-of operations. The published deployment catalog withholds a TrustSwapAndBridgeRouter address; its lookup throws. See [deployments](/docs/reference/packages/deployments) and [protocol](/docs/reference/packages/protocol).

Ordinary React atom-creation hooks use `createAtoms`. For companion URI registration, use the explicit URI-aware protocol operation and your own transaction flow.

## Core source and package parity

Core source: [a402f880600f92969dc8fb013ca0f69fc9a02420](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/README.md). Fork and build that revision following [Query a Core node](/docs/build/query-core). The source revision does not imply an npm installation of Core or equivalence with a released image.

At this source revision, [Core's committed lockfile](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/bun.lock) resolves 17 manifest packages, all at their documented versions. SDK, CLI, React, and periphery are absent from its resolved package graph; absence is not a version mismatch. Separately versioned contract artifacts and Core workspace packages are outside that comparison.

The default stack starts Query API and processing services; it does not start chain ingestion without the indexing profile and chain configuration. API liveness alone does not prove that events have been indexed or external providers have enriched a record.

## Related

- [Install and pin packages](/docs/build/install).
- [Versions and release status](/docs/get-started/versions).
- [Migrate from V1](/docs/get-started/migrate-from-v1).
- [Source workflow prerequisites](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/docs/run-your-own-node.md).
