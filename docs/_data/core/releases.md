---
title: "Releases"
sidebar_label: "Releases"
description: "Identify the Core source revision these guides cover and assess documented changes and limitations."
kind: reference
reader: ["operator"]
packages: []
---

## Identify your Core source

These guides cover the November 17, 2026 Core commit that moved the repository to the stable Intuition package versions. Fork or clone Core, select that commit and build its services from source. From your checkout, `git rev-parse HEAD` prints the full commit to compare with the one below. The checked-in bootstrap script installs the frozen dependency graph and starts the local stack. When reusing existing containers or images, follow the node guide’s explicit source-build steps. [Core README](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/README.md) · [Bootstrap script](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/scripts/bootstrap.sh) · [Run a node](/docs/core/run-a-node)

Core source: [`a402f880600f92969dc8fb013ca0f69fc9a02420`](https://github.com/0xIntuition/intuition-core/tree/a402f880600f92969dc8fb013ca0f69fc9a02420).

## Read the release history

| Source record | What it establishes |
| --- | --- |
| July 24, 2026 release candidate (rc.2) | The changelog records container verification and indexing smoke tests for that earlier release candidate. Its measurements and image identities apply to the July build. [Historical changelog](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/CHANGELOG.md) |
| Unreleased section | This section records the October switch from local tarballs to published prerelease libraries, alongside later behavioral changes. To identify the versions selected on November 17, read the pinned lockfile. [Core lockfile](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/bun.lock) · [Workspace and npm dependency guide](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/packages/README.md) |
| Solidity artifacts | The packages repository pins `@0xintuition/contracts-v2@1.1.0-alpha.1` and `@0xintuition/contracts-v2-periphery@1.1.0-alpha.0` for contract sources and compiled artifacts. Core’s service source has its own commit identity. [Contract artifact provenance](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/docs/contract-artifacts.md) |

## Compare a later checkout

1. Check ancestry in your fork with `git merge-base --is-ancestor a402f880600f92969dc8fb013ca0f69fc9a02420 HEAD`. Exit 0 means your checkout includes the documented commit. Use `git diff --stat a402f880600f92969dc8fb013ca0f69fc9a02420 HEAD` to see which files changed.
2. Compare all npm resolutions in the new `bun.lock` against the package release you intend to use, including missing and duplicate versions. Inspect changes to migrations, service manifests and container build instructions. The lockfile fixes package inputs, while image builds also depend on their base images and system packages. Two builds from the same source can therefore produce different container bytes. [How Core uses the packages](/docs/core/packages) · [API Dockerfile](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/docker/Dockerfile.api)
3. Compare the selected revision’s `docs/openapi.yaml` with the document used by your clients. Refresh the saved API contract from that revision and check each method, path and response your client uses. Compare service configuration and Compose defaults at the same time. [Documented Query API contract](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/docs/openapi.yaml) · [Compose settings](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/docker-compose.yml)
4. Check which capabilities your deployment uses. At the documented commit, chain indexing is optional, worker IID reads and resolution default to off, and the API’s semantic read fields require a separate opt-in. The conformance suite compares Node and Bun fixture outputs using installed packages. Live provider behavior and indexing a particular MultiVault deployment require checks against that environment. [Configuration guide](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/docs/configuration.md) · [Conformance coverage](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/docs/conformance.md)

## Related

- [Release notes](/docs/community/release-notes) points to release records across Intuition.
- [Query a Core node](/docs/build/query-core) shows how to read the indexed graph from your own node.
