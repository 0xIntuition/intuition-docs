---
title: 'Candidate versions and compatibility'
slug: /build/compatibility
sidebar_position: 10
---

This documentation targets the upcoming Intuition package train inspected on **2026-10-22**. Package publication is assumed for the intended rollout; it has **not** been verified here. Install examples use the exact source versions so they can be qualified against the matching npm artifacts or release tarballs. A missing version should stop installation with a release prerequisite, not trigger a silent downgrade.

## Source baseline

| Repository                                                                                                    | Selected revision                          | Role                                            |
| ------------------------------------------------------------------------------------------------------------- | ------------------------------------------ | ----------------------------------------------- |
| [packages](https://github.com/0xIntuition/packages/tree/1dc7103d2a05f23bc565a81df4b001336ce9ba53)             | `1dc7103d2a05f23bc565a81df4b001336ce9ba53` | Public package exports and function signatures  |
| [intuition-core](https://github.com/0xIntuition/intuition-core/tree/eebba114666ba2373690f2beb7dce565aa16f0b7) | `eebba114666ba2373690f2beb7dce565aa16f0b7` | Core REST, processing, persistence and indexing |

The [release manifest](/intuition-release.json) records all package versions, exports, and peer ranges. The [package guidebook index](./packages/index.md) presents the same source train by task.

## Runtime and API boundaries

| Surface                       | Candidate contract                                                | Qualification requirement                                      |
| ----------------------------- | ----------------------------------------------------------------- | -------------------------------------------------------------- |
| SDK and protocol              | `4.0.0`, ESM, viem 2                                              | Matching public artifacts and deployed contracts               |
| Atom parser                   | Node 22+ / Bun, Fetch and Web Streams                             | Remote inspection policy and server network controls           |
| Classification and enrichment | Typed ESM, explicit plugins and runtime                           | Credentials, transport, cache, provider fixtures               |
| React                         | React 18+ declared; React 19, wagmi 2, Query 5 exercised upstream | Match peers; upstream consumer checks use `skipLibCheck: true` |
| SDK read API                  | Hosted GraphQL schema                                             | Correct endpoint, query contract, auth if required             |
| Core Query API                | REST on local port 3000 by default                                | Node revision, migrations, auth and indexing configuration     |
| Atom-services                 | Stateless HTTP on local port 4010 by default                      | Runtime/provider availability; no persistence implied          |

## Contract capability gates

The inspected deployment package references core `contracts-v2@1.1.0-alpha.1` and periphery `contracts-v2-periphery@1.1.0-alpha.0` artifacts. An ABI can be available before every chain's deployed implementation supports it. Read current deployment evidence before enabling new functions.

The package source explicitly withholds the TrustSwapAndBridgeRouter address pending a compatible redeployment; its lookup throws. FeeProxy and bridge support are distinct. Dynamic-fee math also requires matching configuration and contract parity qualification. Do not interpret mainnet/testnet chain definitions as proof that every exported contract is available on both.

## Existing documentation

The site's SDK v3 and hosted GraphQL guides remain available for their existing consumers. New integrations for this candidate should start here and use [migration guidance](./migration.md). Core-native GraphQL, hosted-node onboarding, and broader rollout outcomes remain separate delivery work until their contracts and environments are qualified.

## Release acceptance

Before promoting these docs as the supported release, record exact npm versions and integrity, compile the copyable recipes in a clean consumer, verify the selected deployment and API contracts, and capture authorized off-chain/test-environment readback. Retain source and runtime evidence separately. The Linear documentation rollout tracks these gates; a documentation PR does not publish packages or deploy contracts.
