---
title: Reference
sidebar_label: Reference
description: Find a package, API, contract, network, or catalog entry by the question you need to answer.
kind: reference
reader: ["app","agent","operator","plugin"]
packages: []
---

Use the package and SDK references when choosing an import. For a request to a running node, start with its service API. For an on-chain interaction, check the contract and network together.

## Packages by layer

The [package index](/docs/reference/packages) shows public entry points, direct dependencies and example uses.

| Task | Packages |
| --- | --- |
| Describe types and relationships | [@0xintuition/schema-org](/docs/reference/packages/schema-org), [@0xintuition/classifications](/docs/reference/packages/classifications), [@0xintuition/predicates](/docs/reference/packages/predicates) |
| Normalize an identifier or derive an ID | [@0xintuition/iid-spec](/docs/reference/packages/iid-spec), [@0xintuition/iid](/docs/reference/packages/iid), [@0xintuition/iid-registry](/docs/reference/packages/iid-registry), [@0xintuition/iid-ladder](/docs/reference/packages/iid-ladder), [@0xintuition/ids](/docs/reference/packages/ids) |
| Build an atom or triple | [@0xintuition/primitives](/docs/reference/packages/primitives) |
| Compose processing stages | ['@0xintuition/pipeline-runtime'](/docs/reference/packages/pipeline-runtime) |
| Parse, classify and enrich atom data | ['@0xintuition/atom-parser'](/docs/reference/packages/atom-parser), ['@0xintuition/atom-classification'](/docs/reference/packages/atom-classification), ['@0xintuition/atom-enrichment'](/docs/reference/packages/atom-enrichment), ['@0xintuition/atom-runtime'](/docs/reference/packages/atom-runtime) |
| Integrate an application or command-line tool | ['@0xintuition/sdk'](/docs/reference/packages/sdk), ['@0xintuition/cli'](/docs/reference/packages/cli) |
| Read contract interfaces, select an address or calculate a quote | ['@0xintuition/protocol'](/docs/reference/packages/protocol), ['@0xintuition/deployments'](/docs/reference/packages/deployments), ['@0xintuition/periphery'](/docs/reference/packages/periphery), ['@0xintuition/curves'](/docs/reference/packages/curves) |
| Use wallet-aware hooks in React | ['@0xintuition/react'](/docs/reference/packages/react) |

## SDK functions and types

Use the [SDK function reference](/docs/reference/sdk) to check a signature, its inputs and its effects before calling it.

| Task | Declarations |
| --- | --- |
| Inspect read interfaces | [API client](/docs/reference/sdk/api), [Portfolio reads](/docs/reference/sdk/portfolio) |
| Work with vaults, curves or bonding | [MultiVault actions](/docs/reference/sdk/multivault), [Dynamic-fee curve actions](/docs/reference/sdk/dynamic-fee-curve), [TrustBonding actions](/docs/reference/sdk/trust-bonding) |
| Prepare FeeProxy calls | [FeeProxy URI creation](/docs/reference/sdk/fee-proxy), [FeeProxy plans and execution](/docs/reference/sdk/fee-proxy-builders), [FeeProxy affiliate profile](/docs/reference/sdk/fee-proxy-affiliate-profile), [FeeProxy refund preparation](/docs/reference/sdk/fee-proxy-claim-refund-if-any) |
| Build an action envelope | [MultiVault action envelopes](/docs/reference/sdk/plans-multivault), [Bridge action envelopes](/docs/reference/sdk/plans-base), [Dynamic-fee action envelopes](/docs/reference/sdk/plans-dynamic-fee-curve), [FeeProxy action envelopes](/docs/reference/sdk/plans-fee-proxy), [TrustBonding action envelopes](/docs/reference/sdk/plans-trust-bonding) |
| Validate an envelope or resolve its destination | [Create and validate action envelopes](/docs/reference/sdk/schema-create-agent-action-envelope), [Resolve action targets](/docs/reference/sdk/schema-resolve-agent-action-target), [Action envelope types](/docs/reference/sdk/schema-types) |

## Service APIs

- [Core Query API](/docs/reference/core-query-api) lists operations, authentication requirements and response shapes for the graph on your node.
- [Atom services API](/docs/reference/atom-services-api) describes how to process an input without writing it to the graph.

## Contracts and networks

Choose a contract in the [contracts overview](/docs/reference/contracts). Look up the responsibilities of [MultiVault](/docs/reference/contracts/multivault), [FeeProxy](/docs/reference/contracts/fee-proxy) and [TrustBonding](/docs/reference/contracts/trust-bonding).

Before a write, check [Configuration and URI limits](/docs/reference/contracts/configuration), [Deployments](/docs/reference/contracts/deployments) and [Audits](/docs/reference/contracts/audits). To interpret a receipt or revert, use [Events and errors](/docs/reference/contracts/events-and-errors).

Find chain IDs, RPC URLs and explorers in [Networks](/docs/reference/networks). The [testnet faucet guide](/docs/reference/networks/faucet) explains how to request test tokens.

## Catalogs, compatibility and glossary

- [IID scheme catalog](/docs/reference/iid-schemes) lists identifier schemes and examples of canonical input.
- [Predicate catalog](/docs/reference/predicates) lists relationship names and the atom IDs used as predicates.
- [Compatibility](/docs/reference/compatibility) matches packages and their required peers to the documented sources.
- [Glossary](/docs/reference/glossary) defines terms used in the protocol, packages and Core.
