---
title: "Versions and release status"
sidebar_label: "Versions and release status"
description: "Understand V1 and V2 generations, exact published package pins, the pinned Core source, and verified dist-tag hazards."
kind: reference
reader: ["app", "agent", "operator", "plugin"]
packages: ["@0xintuition/atom-classification", "@0xintuition/atom-enrichment", "@0xintuition/atom-parser", "@0xintuition/atom-runtime", "@0xintuition/classifications", "@0xintuition/cli", "@0xintuition/curves", "@0xintuition/deployments", "@0xintuition/ids", "@0xintuition/iid", "@0xintuition/iid-ladder", "@0xintuition/iid-registry", "@0xintuition/iid-spec", "@0xintuition/periphery", "@0xintuition/pipeline-runtime", "@0xintuition/predicates", "@0xintuition/primitives", "@0xintuition/protocol", "@0xintuition/react", "@0xintuition/schema-org", "@0xintuition/sdk"]
---

<AppliesTo />

**V2 is a generation, not a package semver.** It covers the packages in the release manifest and Intuition Core. Each npm package has its own version. **V1** covers the `intuition-ts` packages and `intuition-rs` services; those docs remain available at [V1](/docs/v1).

The documented package release is published and stable. Install the exact versions below and retain your lockfile. The [release manifest](/intuition-release.json) records package versions, entry points, peers, engines, registry integrity, and immutable source provenance.

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

## Core source

Core is a repository to fork, clone, build, and run. These docs pin [Core source revision `a402f880600f92969dc8fb013ca0f69fc9a02420`](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/README.md). That identifies source code; it does not name an npm distribution or attest to a published container image.

[Query a Core node](/docs/build/query-core) contains the source setup path. Default startup does not ingest chain events; indexing is an explicitly configured profile. Package installation, Core startup, and chain indexing are separate steps.

## Verified install hazards

<!-- release-pins: hazard -->

At the 2026-11-17 registry check, `@0xintuition/sdk@alpha` selected `4.0.0-alpha.0`, and `@0xintuition/protocol@alpha` selected `3.0.0-alpha.0`, both superseded by the documented pins. Also, `@0xintuition/protocol@3` and `^3.0.0-alpha.0` resolve to the older stable `3.0.0` release. Those selectors do not select the V2 protocol pin. Dist-tags move; prefer exact versions.

<!-- /release-pins -->

The checked `latest` tags match the documented pins. An untagged install still follows a moving tag, so it is unsuitable for preserving a V1 dependency set or reproducing this documentation later.

## Upgrading

Use [Migrate from V1](/docs/get-started/migrate-from-v1) for breaking changes and identity preservation. [Compatibility](/docs/reference/compatibility) separates package peers, example runtime pins, contract artifacts, and Core requirements.

Source: [Package release policy](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/docs/release.md).
