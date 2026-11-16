---
title: Intuition developer docs
sidebar_label: Intuition developer docs
description: Understand the Intuition documentation generations, install agent skills, and find community support.
kind: concept
reader: ["app", "agent", "operator", "plugin"]
packages: []
---

Intuition is an identity and knowledge graph protocol. Its TypeScript packages provide shared vocabulary, deterministic identifiers, and tools for modeling entities and their relationships.

## About V2

V2 names the new generation of Intuition tools: the packages published from [0xIntuition/packages](https://github.com/0xIntuition/packages/tree/6dea404ee1b4f57902604d7435e7331ac232cb3e) and Intuition Core. V2 is the default documentation version; it does not name a package version range.

The packages are published as stable npm releases. Intuition Core is a release candidate.

The protocol's building blocks include:

- **Atoms:** entities represented by data bytes, with deterministic identifiers.
- **Triples:** relationships between a subject atom, a predicate atom, and an object atom.
- **Vaults:** on-chain shares and assets associated with an atom or triple on a particular bonding curve.

## Start here

- [Install the agent skills](/docs/agents/skills) to give your coding agent canonical context for protocol operations and ERC-8004 planning.
- [Get help](/docs/community) through Intuition's support and community channels.

## Looking for V1?

The [V1 documentation](/docs/v1) covers the `intuition-ts` packages and `intuition-rs` services. Agents can start with the [V1 documentation index](/docs/v1/llms.txt).
