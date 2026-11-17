---
title: "How Core uses the packages"
sidebar_label: "How Core uses the packages"
description: "See which published libraries Core resolves and which parts of the system are implemented in its private workspaces."
kind: concept
reader: ["operator", "plugin"]
packages: ["@0xintuition/atom-runtime", "@0xintuition/atom-classification", "@0xintuition/atom-enrichment", "@0xintuition/iid"]
---

<AppliesTo />

## How it works

Core uses published libraries to interpret an atom and decide which providers can enrich it. Its services own HTTP requests, worker leases and the database writes that persist the results. To trace a behavior in a fork, start with the service that handles the input.

| Published library | Where Core uses it |
| --- | --- |
| `@0xintuition/atom-runtime` | The atom-services wrapper passes cache settings and the operator’s preset to `createAtomServicesProcessingRuntime`. The HTTP service and workers can reuse the same classification and enrichment engine composition. [Runtime wrapper](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/services/atom-services/src/service/runtime.ts) |
| `@0xintuition/atom-classification` | Atom-services imports the default enhancement policy. Its processing handler runs the configured classifier and passes the classification into the enrichment stage. [Processing handler](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/services/atom-services/src/service/processing.ts) |
| `@0xintuition/atom-enrichment` | The same handler calls `toClassifiedAtomInput` to prepare the provider input. A background enrichment worker uses Core’s shared runtime wrapper and persists results for the claimed atom. [Enrichment worker](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/services/workers/src/kg/atom-enrichment/index.ts) |
| `@0xintuition/iid` | Workers call `inspectIntuitionId` to inspect an identifier. When IID reads are enabled, they also use the published IID registry for classifications and provider hints, and the IID ladder to evaluate identity candidates. [Inspection](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/services/workers/src/core/iid-inspection.ts) · [Registry adapter](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/services/workers/src/core/iid-registry.ts) · [Ladder adapter](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/services/workers/src/core/iid-ladder.ts) |

### Find the Core-owned code

Five private workspaces live under `packages/`. The `database-kg` workspace owns graph storage and delegates atom and triple ID derivation to the public IDs library. The `database-timescale` workspace supplies market read models and query helpers. The `contracts` workspace adapts published contract artifacts for deployment and indexer integration. The `types` workspace holds indexing scope configuration and shared type exports. The `atom-rules-engine` workspace contains standalone presentation rules with no active caller in Core’s runtime. [Workspace inventory](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/packages/README.md) · [Graph ID adapter](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/packages/database-kg/src/actions/ids.ts) · [Contract artifacts](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/docs/contracts.md)

### Check what a build installs

At this Core commit, 17 of the 21 libraries in the V2 package release appear in the root Bun lockfile. Each resolves to exactly one version matching the release. Sixteen use the version shown above for atom-runtime, and the remaining one resolves to `@0xintuition/protocol@4.0.0`. The four absent libraries are `@0xintuition/cli`, `@0xintuition/periphery`, `@0xintuition/react` and `@0xintuition/sdk`. Core also resolves the separately versioned contract artifact `@0xintuition/contracts-v2@1.1.0-alpha.1`. [Core lockfile](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/bun.lock) · [Public package release plan](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/release-plan.json)

For a later checkout, compare **every** registry resolution for each release package in the lockfile’s `packages` map. Collect the full set of resolved versions per package so that a second version is visible. Count missing packages separately, and set aside local `workspace:` entries and separately published artifacts. The root and service manifests explain which workspace requested a dependency. The actual imports tell you which service calls it directly. [Root manifest](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/package.json) · [Atom-services manifest](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/services/atom-services/package.json) · [Workers manifest](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/services/workers/package.json)

The Query API, worker and atom-services image builds copy the source tree and install from the root lockfile with `bun install --frozen-lockfile --production`. A frozen install requires the manifests and recorded dependency graph to agree. [API Dockerfile](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/docker/Dockerfile.api) · [Worker Dockerfile](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/docker/Dockerfile.workers) · [Atom-services Dockerfile](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/docker/Dockerfile.atom-services)

To check package behavior in your fork, run these commands from the Core root with Bun and Node 22 or later available.

```sh
bun install --frozen-lockfile
bun run test:conformance
```

The URI suite creates an isolated consumer from the installed dependencies. Node and Bun must produce identical output for nine creation vectors covering atom data and ordered URI contexts. Core checks those results against the committed fixture, including atom IDs and encoded contract calls. The IID tests use published conformance vectors and fixture providers. A pass covers those inputs. Running services, live providers and transaction submission require separate checks. [Conformance guide](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/docs/conformance.md) · [Consumer and fixtures](https://github.com/0xIntuition/intuition-core/tree/a402f880600f92969dc8fb013ca0f69fc9a02420/tests/conformance)

## Related

- [Core architecture](/docs/core/architecture) follows one atom through storage and processing.
- [Package reference](/docs/reference/packages) lists the libraries available to applications and plugins.
