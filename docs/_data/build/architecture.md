---
title: 'Design your Intuition application'
sidebar_label: 'Application architecture'
slug: /build/architecture
---

An Intuition application combines local data modeling with the services it needs for reads, persistence, metadata, and transactions. Choose those services according to the feature you are building.

## Start with the application data model

Use [primitives](./packages/primitives.md) to build atoms and triples, [classifications](./packages/classifications.md) for entity types and forms, and [predicates](./packages/predicates.md) for relationships. These operations run locally and produce data your application can store or publish later.

Keep canonical atom bytes alongside the atom ID. Store labels, images, provider observations, and application-specific state separately. The [music catalog tutorial](./guides/music-catalog.md) shows this separation in a small application object.

## Choose a read and storage API

| Requirement                                        | Integration                                                                          | What to configure                                        |
| -------------------------------------------------- | ------------------------------------------------------------------------------------ | -------------------------------------------------------- |
| Read the hosted, indexed graph                     | [SDK API client](./guides/sdk-reads.md) or [GraphQL API](/docs/graphql-api/overview) | Mainnet or testnet endpoint and queries                  |
| Own the graph database and write off-chain records | [Core REST](./guides/core-rest.md)                                                   | A running Core node, authentication, and its API version |
| Keep a local catalog or prototype                  | Your application storage                                                             | Serialization, deduplication, and provenance             |
| Read current contract state                        | [Protocol](./packages/protocol.md) or [SDK actions](./guides/onchain.md)             | Chain, RPC client, and contract address                  |

**Intuition Core** is a self-hosted graph backend with REST APIs for records and processing. Use it when your application needs to ingest and query its own graph. It is optional for local modeling and hosted GraphQL reads. Core REST and hosted GraphQL have different request and response contracts; choose an adapter for each API you use.

A locally derived ID does not guarantee that a hosted API has indexed the corresponding term. Handle missing records and the delay between transaction confirmation and indexing.

## Place processing in the right runtime

Use [atom-parser](./packages/atom-parser.md) to recognize an input, [atom-classification](./packages/atom-classification.md) to determine its type, and [atom-enrichment](./packages/atom-enrichment.md) to retrieve provider metadata. [Atom runtime](./packages/atom-runtime.md) composes engines and caches when you want a shared setup.

Local parsing and compatible classification plugins can run in a browser. Network inspection and providers that require secrets belong on your server. Configure credentials, timeouts, cache lifetime, and cancellation explicitly. Return accepted fields and their provenance to the client; let your application decide when to persist them.

See [processing and enrichment](./guides/processing.md) for the handoff between stages and [custom processing](./guides/processing-plugins.md) for plugins and providers.

## Add wallet interactions

Use SDK actions to quote and prepare operations, or protocol wrappers for direct contract calls. Present the chain, destination, amounts, and receiver before asking a wallet to sign. Track submission, receipt, and indexed visibility as separate states.

For a backend or agent that prepares work for another executor, [action envelopes](./guides/action-envelopes.md) provide serializable plans. The executor still validates the destination and authorizes the transaction.

Only enable operations supported by the selected contract deployment. [Versions and compatibility](./compatibility.md) explains package peers and contract capability checks; [React hooks](./packages/react.md) supply transaction lifecycle state for React applications.

## Keep ownership explicit

Your application owns authentication, authorization, storage access, provider credentials, and the interpretation of claims and signals. Shared packages supply common representations and operations. Design your API so users can see which records were imported, which claims were attributed to an account, and which actions were confirmed on-chain.
