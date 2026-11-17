---
title: "Intuition developer docs"
sidebar_label: "Intuition developer docs"
description: "Build shared identities and relationships, prepare protocol actions, and query a Core node with the V2 packages."
kind: concept
reader: ["app", "agent", "operator", "plugin"]
packages: []
---

Intuition is an identity and knowledge graph protocol. Its packages help applications identify entities consistently, connect them with explicit relationships, and prepare actions through which people signal what they trust.

An **atom** stores a chosen representation as bytes. Its **atom ID** identifies those exact bytes. An **Intuition Identifier (IID)** names the represented entity; the same IID can appear in different representations. A **triple** connects a subject, predicate, and object in that order.

## Choose your path

| I want to… | Start here | Then build |
| --- | --- | --- |
| Build an application | [Derive an atom ID offline](/docs/get-started/quickstart) | [A music catalog](/docs/examples/music-catalog) with explicit recording, artist, and album relationships |
| Build with agents | [Read the agent contract](/docs/agents) | [Review action plans](/docs/build/action-plans) before a human authorizes execution |
| Run Core | [Query a Core node](/docs/build/query-core) | Fork, pin, build, and run the source to own graph storage and reads |
| Extend processing | [Classify and enrich inputs](/docs/build/classify-enrich) | [Write a classification plugin](/docs/core/classification-plugin) for your domain |

You can build identities and triples offline before choosing a wallet or backend. Processing, persistence, protocol submission, and indexing each have their own lifecycle; [How the pieces fit](/docs/get-started/how-it-fits) explains the boundaries.

## Explore the documentation

- [Concepts](/docs/concepts) introduces representations, directed relationships, and protocol writes.
- [Build guides](/docs/build) cover tasks from modeling an identity to verifying a write.
- [Worked examples](/docs/examples) walk through creation forms, identity links, React integration, and graph queries.
- [Packages](/docs/reference/packages) covers every published library; the [SDK reference](/docs/reference/sdk) lists action signatures.
- [Install agent skills](/docs/agents/skills) for contract-level guidance, or [get help](/docs/community).

## Versions and source

**V2 names a generation**, covering the packages in the [release manifest](/intuition-release.json) and Intuition Core. The packages are published as stable npm releases; each example uses exact pins. See [versions and release status](/docs/get-started/versions).

Core is a source application you fork, build, and run. These docs describe [Core source at the pinned revision](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/README.md). The source pin identifies code, rather than an npm distribution or a released container image. The default source stack requires its indexing profile and chain configuration to start chain ingestion.

:::note Looking for V1?
The [V1 documentation](/docs/v1) covers the `intuition-ts` packages and `intuition-rs` services. For agents, use the [V1 documentation index](/docs/v1/llms.txt). Start with [Migrate from V1](/docs/get-started/migrate-from-v1) when moving an integration.
:::

Source: [Package concepts and application patterns](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/README.md#core-concepts).
