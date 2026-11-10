---
title: 'Packages'
sidebar_label: 'Overview'
slug: /build/packages/index
---

Choose libraries by the feature you are building. Most applications start with **Primitives** for a data model, **SDK** for graph reads and transactions, or **React** for protocol hooks. Add other packages as your application needs their APIs.

Follow [installation and setup](../guides/installation.md) for copyable dependency sets. If you are new to the model, start with [Build with Intuition](../overview.md) and return here when you need a specific API.

All package names use the `@0xintuition/` npm scope. These pages document the published alpha packages for the Intuition V2 developer experience. Package version numbers are independent; [versions and compatibility](../compatibility.md) lists the supported combinations.

## Application integration

| Package             | Use it to                                                              | npm                                                                               |
| ------------------- | ---------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| [SDK](./sdk.md)     | Query graph data, quote protocol operations, and prepare transactions. | [4.0.0-alpha.0](https://www.npmjs.com/package/@0xintuition/sdk/v/4.0.0-alpha.0)   |
| [React](./react.md) | Use protocol hooks and transaction lifecycle state in React.           | [0.1.0-alpha.1](https://www.npmjs.com/package/@0xintuition/react/v/0.1.0-alpha.1) |
| [CLI](./cli.md)     | Inspect contract encoders and generate calldata from a terminal.       | [0.1.0-alpha.0](https://www.npmjs.com/package/@0xintuition/cli/v/0.1.0-alpha.0)   |

## Data modeling

| Package                                 | Use it to                                                       | npm                                                                                         |
| --------------------------------------- | --------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| [Primitives](./primitives.md)           | Build atoms and triples from validated input.                   | [0.1.0-alpha.1](https://www.npmjs.com/package/@0xintuition/primitives/v/0.1.0-alpha.1)      |
| [Classifications](./classifications.md) | Use shared entity types, identity rules, and Creation Profiles. | [0.1.0-alpha.1](https://www.npmjs.com/package/@0xintuition/classifications/v/0.1.0-alpha.1) |
| [Predicates](./predicates.md)           | Use canonical relationship vocabulary and predicate IDs.        | [0.1.0-alpha.1](https://www.npmjs.com/package/@0xintuition/predicates/v/0.1.0-alpha.1)      |
| [Schema.org](./schema-org.md)           | Look up schema.org types and inherited properties.              | [0.1.0-alpha.1](https://www.npmjs.com/package/@0xintuition/schema-org/v/0.1.0-alpha.1)      |

## Identity

| Package                            | Use it to                                                            | npm                                                                                      |
| ---------------------------------- | -------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| [IID](./iid.md)                    | Parse, validate, and derive Intuition identifiers.                   | [0.1.0-alpha.0](https://www.npmjs.com/package/@0xintuition/iid/v/0.1.0-alpha.0)          |
| [IDs](./ids.md)                    | Calculate deterministic atom, triple, and counter-triple IDs.        | [0.1.0-alpha.1](https://www.npmjs.com/package/@0xintuition/ids/v/0.1.0-alpha.1)          |
| [IID ladder](./iid-ladder.md)      | Select an identity from provider and application inputs.             | [0.1.0-alpha.0](https://www.npmjs.com/package/@0xintuition/iid-ladder/v/0.1.0-alpha.0)   |
| [IID registry](./iid-registry.md)  | Look up identifier meaning and provider capabilities.                | [0.1.0-alpha.0](https://www.npmjs.com/package/@0xintuition/iid-registry/v/0.1.0-alpha.0) |
| [IID specification](./iid-spec.md) | Implement the identifier specification and run conformance fixtures. | [0.1.0-alpha.0](https://www.npmjs.com/package/@0xintuition/iid-spec/v/0.1.0-alpha.0)     |

## Processing

| Package                                         | Use it to                                                      | npm                                                                                             |
| ----------------------------------------------- | -------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| [Atom parser](./atom-parser.md)                 | Recognize IIDs, URLs, JSON, addresses, names, and text.        | [0.1.0-alpha.0](https://www.npmjs.com/package/@0xintuition/atom-parser/v/0.1.0-alpha.0)         |
| [Atom classification](./atom-classification.md) | Classify entities with local or server plugins.                | [0.1.0-alpha.0](https://www.npmjs.com/package/@0xintuition/atom-classification/v/0.1.0-alpha.0) |
| [Atom enrichment](./atom-enrichment.md)         | Fetch provider artifacts and extract metadata with provenance. | [0.1.0-alpha.0](https://www.npmjs.com/package/@0xintuition/atom-enrichment/v/0.1.0-alpha.0)     |
| [Atom runtime](./atom-runtime.md)               | Compose processing engines, presets, and caches.               | [0.1.0-alpha.0](https://www.npmjs.com/package/@0xintuition/atom-runtime/v/0.1.0-alpha.0)        |
| [Pipeline runtime](./pipeline-runtime.md)       | Manage concurrency, cancellation, and provider outcomes.       | [0.1.0-alpha.0](https://www.npmjs.com/package/@0xintuition/pipeline-runtime/v/0.1.0-alpha.0)    |

## Contracts

| Package                         | Use it to                                                          | npm                                                                                     |
| ------------------------------- | ------------------------------------------------------------------ | --------------------------------------------------------------------------------------- |
| [Protocol](./protocol.md)       | Read, encode, and call protocol contracts with viem.               | [3.0.0-alpha.0](https://www.npmjs.com/package/@0xintuition/protocol/v/3.0.0-alpha.0)    |
| [Deployments](./deployments.md) | Resolve contract ABIs, bytecode, addresses, and chain metadata.    | [0.1.0-alpha.1](https://www.npmjs.com/package/@0xintuition/deployments/v/0.1.0-alpha.1) |
| [Periphery](./periphery.md)     | Use FeeProxy, router, and bridge contract wrappers.                | [0.1.0-alpha.1](https://www.npmjs.com/package/@0xintuition/periphery/v/0.1.0-alpha.1)   |
| [Curves](./curves.md)           | Calculate curve previews and exact-net quotes from supplied state. | [0.1.0-alpha.1](https://www.npmjs.com/package/@0xintuition/curves/v/0.1.0-alpha.1)      |

## Combine packages in an application

[Build a music catalog](../guides/music-catalog.md) brings identity, entity types, and relationships together. [Processing and enrichment](../guides/processing.md) adds provider metadata. [On-chain actions](../guides/onchain.md) takes the resulting terms into a wallet flow.

For an existing integration, use the [upgrade guide](../migration.md) to map imports and preserve stored identities.
