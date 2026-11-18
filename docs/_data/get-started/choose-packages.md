---
title: Choose your packages
sidebar_label: Choose your packages
description: Match a development task to a pinned Intuition package and its public entry points.
kind: reference
reader: ["app", "agent"]
packages: ["@0xintuition/atom-classification","@0xintuition/atom-enrichment","@0xintuition/atom-parser","@0xintuition/atom-runtime","@0xintuition/classifications","@0xintuition/cli","@0xintuition/curves","@0xintuition/deployments","@0xintuition/ids","@0xintuition/iid","@0xintuition/iid-ladder","@0xintuition/iid-registry","@0xintuition/iid-spec","@0xintuition/periphery","@0xintuition/pipeline-runtime","@0xintuition/predicates","@0xintuition/primitives","@0xintuition/protocol","@0xintuition/react","@0xintuition/schema-org","@0xintuition/sdk"]
---

<AppliesTo />

Start with the operation your application needs. Install each package you import directly, even when another package includes it as a dependency. The linked references include exact install commands and supported entry points.

| I want to… | Install | Then read |
| --- | --- | --- |
| Build an atom or a triple from validated inputs | `@0xintuition/primitives@0.1.0` | [Atom and triple builders](/docs/reference/packages/primitives) |
| Compute a term ID from existing bytes | `@0xintuition/ids@0.1.0` | [Deterministic ID functions](/docs/reference/packages/ids) |
| Canonicalize an Intuition Identifier | `@0xintuition/iid@0.1.0` | [IID parsing and normalization](/docs/reference/packages/iid) |
| Use the packaged IID grammar and test vectors | `@0xintuition/iid-spec@0.1.0` | [IID specification files](/docs/reference/packages/iid-spec) |
| Select the strongest available identifier for a record | `@0xintuition/iid-ladder@0.1.0` | [Identity projection](/docs/reference/packages/iid-ladder) |
| Find classifications and providers for an IID scheme | `@0xintuition/iid-registry@0.1.0` | [IID registry lookups](/docs/reference/packages/iid-registry) |
| Build a form from a Creation Profile | `@0xintuition/classifications@0.1.0` | [Creation Profiles](/docs/reference/packages/classifications) |
| Look up schema.org types and properties | `@0xintuition/schema-org@0.1.0` | [Schema vocabulary](/docs/reference/packages/schema-org) |
| Choose a predicate for a relationship | `@0xintuition/predicates@0.1.0` | [Predicate registry](/docs/reference/packages/predicates) |
| Recognize and normalize incoming atom data | `@0xintuition/atom-parser@0.1.0` | [Atom parsing](/docs/reference/packages/atom-parser) |
| Classify parsed data with rules and plugins | `@0xintuition/atom-classification@0.1.0` | [Classification engine](/docs/reference/packages/atom-classification) |
| Collect enrichment results from providers | `@0xintuition/atom-enrichment@0.1.0` | [Enrichment adapters](/docs/reference/packages/atom-enrichment) |
| Compose classification and enrichment in one service | `@0xintuition/atom-runtime@0.1.0` | [Runtime composition](/docs/reference/packages/atom-runtime) |
| Apply cancellation and host policies to provider requests | `@0xintuition/pipeline-runtime@0.1.0` | [Pipeline utilities](/docs/reference/packages/pipeline-runtime) |
| Find a network, contract address, or ABI | `@0xintuition/deployments@0.1.0` | [Deployment catalog](/docs/reference/packages/deployments) |
| Read a vault or submit a protocol transaction | `@0xintuition/protocol@4.0.0` | [Contract wrappers](/docs/reference/packages/protocol) |
| Calculate shares and prices from local curve state | `@0xintuition/curves@0.1.0` | [Curve math](/docs/reference/packages/curves) |
| Work with periphery contracts and bridge calls | `@0xintuition/periphery@0.1.0` | [Periphery interfaces](/docs/reference/packages/periphery) |
| Prepare a quote or an unsigned action envelope | `@0xintuition/sdk@4.0.0` | [SDK actions](/docs/reference/packages/sdk) |
| Discover contract encoders and print calldata in a terminal | `@0xintuition/cli@0.1.0` | [CLI encoders](/docs/reference/packages/cli) |
| Use protocol hooks in a React application | `@0xintuition/react@0.1.0` | [React hooks](/docs/reference/packages/react) |

To read the **indexed graph**, run a Core node and use its Query API. For a first local project, the offline quickstart needs just the primitives package. [Query your Core node](/docs/build/query-core) · [Offline quickstart](/docs/get-started/quickstart) · [Install compatible packages](/docs/build/install)

Sources include the [package task guide](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/docs/getting-started.md) and the [package map](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/docs/architecture/package-map.md).
