---
title: Ecosystem
sidebar_label: Ecosystem
description: Explore Intuition’s Portal, agent integration and experimental applications in the V1 documentation.
kind: reference
reader: ["app","agent","operator","plugin"]
packages: []
---

## Explore identities and claims

The Portal is a reader-facing explorer for the Intuition graph. The V1 guide shows how someone can create an identity as an atom, link identities in a claim, and use tags to organize them into lists. [Portal guide (V1)](/docs/v1/portal)

If you operate your own Core node, its built-in Explorer shows the health of your services and the progress of your workers. An application can read indexed graph data through that node’s Query API. [Run a node](/docs/core/run-a-node) · [Query a Core node](/docs/build/query-core)

## Connect an agent to a trust provider

ERC-8004 defines a contract-level agent layer with registries for identity, reputation and validation. The V1 partner guide shows how a provider links an Intuition atom to an agent’s registered identity and publishes an assessment. Stable graph links identify the agent and provider, while a provider-owned document holds the score and evidence that may change. [ERC-8004 agent layer (V1)](/docs/v1/erc-8004-agent-layer)

## Experimental applications

These archived guides describe three ways people used the graph from other interfaces. Each is optional for V2 development.

- **Data Populator (deprecated).** Import a CSV of atom data, review the entries together, and batch their submission. [Data Populator (V1)](/docs/v1/experimental-applications/data-populator)
- **Farcaster Frames.** A frame embedded in a Farcaster post lets readers create identities and make claims within the post. [Farcaster Frames (V1)](/docs/v1/experimental-applications/farcaster-frames)
- **MetaMask Snap.** The wallet integration exposes atoms, triples and staking actions through MetaMask. [MetaMask Snap (V1)](/docs/v1/experimental-applications/metamask-snap)

{/* cspell:words Populator Farcaster */}
