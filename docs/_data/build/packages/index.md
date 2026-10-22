---
title: 'Choose the packages your application needs'
slug: /build/packages/index
sidebar_position: 0
---

Install the smallest layer that supplies your workflow. All names below refer to public package artifacts in the selected source train; Core's private database and worker packages are service implementation details.

| Package                                                      | Responsibility                                                                                                                                            | Candidate version |
| ------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- |
| [@0xintuition/iid-spec](./iid-spec.md)                       | The normative identifier specification and conformance corpus. Read it when implementing an identifier producer or comparing independent implementations. | `0.1.0-alpha.0`   |
| [@0xintuition/iid](./iid.md)                                 | Parse, inspect, canonicalize, and derive Intuition identifiers entirely offline.                                                                          | `0.1.0-alpha.0`   |
| [@0xintuition/iid-registry](./iid-registry.md)               | Resolve identifier meaning and provider capabilities without HTTP or credentials.                                                                         | `0.1.0-alpha.0`   |
| [@0xintuition/iid-ladder](./iid-ladder.md)                   | Choose canonical identities from application, provider, seed, and import inputs.                                                                          | `0.1.0-alpha.0`   |
| [@0xintuition/ids](./ids.md)                                 | Calculate deterministic atom, predicate, triple, counter-triple, and authentication-related IDs.                                                          | `0.1.0-alpha.1`   |
| [@0xintuition/schema-org](./schema-org.md)                   | Look up the pinned schema.org vocabulary and inherited properties for forms and tooling.                                                                  | `0.1.0-alpha.0`   |
| [@0xintuition/classifications](./classifications.md)         | Use canonical entity specifications, identity ladders, Creation Profiles, discovery metadata, and atom-data builders.                                     | `0.1.0-alpha.1`   |
| [@0xintuition/predicates](./predicates.md)                   | Use shared relationship vocabulary, canonical predicate data and IDs, semantic flags, and display helpers.                                                | `0.1.0-alpha.1`   |
| [@0xintuition/primitives](./primitives.md)                   | Build atoms and triples with validated, deterministic public helpers.                                                                                     | `0.1.0-alpha.1`   |
| [@0xintuition/atom-parser](./atom-parser.md)                 | Detect and normalize raw strings, JSON objects/arrays, URLs, IPFS, addresses, names, and ISBNs.                                                           | `0.1.0-alpha.0`   |
| [@0xintuition/atom-classification](./atom-classification.md) | Compose a plugin-based classification engine for client, progressive, or server execution.                                                                | `0.1.0-alpha.0`   |
| [@0xintuition/atom-enrichment](./atom-enrichment.md)         | Execute selected enrichment providers and extract fields from artifacts.                                                                                  | `0.1.0-alpha.0`   |
| [@0xintuition/deployments](./deployments.md)                 | Resolve the shared ABI, bytecode, address, and chain metadata consumed by all protocol packages.                                                          | `0.1.0`           |
| [@0xintuition/protocol](./protocol.md)                       | Call or encode core protocol contracts with explicit viem clients and deployment configuration.                                                           | `4.0.0`           |
| [@0xintuition/periphery](./periphery.md)                     | Use direct FeeProxy, router, and meta-bridge wrappers and encoders.                                                                                       | `0.1.0`           |
| [@0xintuition/curves](./curves.md)                           | Calculate local curve previews and exact-net gross-up quotes using explicit state and parameters.                                                         | `0.1.0`           |
| [@0xintuition/sdk](./sdk.md)                                 | Build integrations with hosted GraphQL reads, deterministic utilities, and explicit on-chain action plans.                                                | `4.0.0`           |
| [@0xintuition/cli](./cli.md)                                 | Discover encoders and produce deterministic calldata or action envelopes for agents and scripts.                                                          | `0.1.0`           |
| [@0xintuition/react](./react.md)                             | Compose protocol read/write hooks and observable transaction lifecycle state in React.                                                                    | `0.1.0-alpha.1`   |

Start with `primitives` for an offline atom, `classifications` for a form, `sdk` for a protocol integration, or Core REST for graph persistence. Add processing engines when you own their runtime. The existing `@0xintuition/graphql` hosted-schema tooling belongs to the earlier documentation surface and is not one of this repository's new package artifacts.

Do not install private Core packages as if they were public SDKs. Use the [system map](../architecture.md) and [compatibility matrix](../compatibility.md) to choose the correct boundary.
