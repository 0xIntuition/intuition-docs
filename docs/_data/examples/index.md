---
title: "What you can build"
sidebar_label: "What you can build"
description: "Use a worked music catalog to connect identity, explicit relationships, enrichment, storage, and protocol planning."
kind: reference
reader: ["app", "agent", "operator", "plugin"]
packages: []
---

The packages supply shared identities and graph modeling tools. Core supplies storage, processing workers, and queries. Protocol contracts add registration and economic positions. Your application combines these with its own rules for evidence, permissions, and ranking.

## Build a music catalog

[Build a music catalog](/docs/examples/music-catalog) connects recording, artist, and album atoms with explicit triples. It uses clearly labeled synthetic identities, keeps display metadata separate, and shows where persistence and protocol planning fit.

Use the catalog to answer three questions: which entity is this, which bytes represent it, and which directed relationship am I asserting? Those answers transfer to other domains.

## Apply the pattern

| Application | Shared building blocks | Decisions your application owns |
| --- | --- | --- |
| Media discovery and curation | Identity ladders, Creation Profiles, explicit triples | Duplicate review, ranking, moderation |
| Research and evidence | Stable anchors, shared predicates, provenance | Evidence quality, citations, access control |
| Portable collections | Item IDs and containment relationships | Membership order, permissions, deletion semantics |
| Contextual reputation | Attributed claims and vault positions | Context, scoring, resistance to manipulation |
| Agent-assisted graph building | Offline builders and reviewed action plans | Scope, budget, provenance, authorization |
| Enrichment services | Parser, classifier, provider runtime | Provider terms, credentials, retries, cache policy |

These are application patterns; each still needs product-specific policy and implementation. A valid identifier does not prove a claim, and a position alone does not establish reputation.

For a smaller starting point, run the [offline quickstart](/docs/get-started/quickstart). For operational boundaries, read [How the pieces fit](/docs/get-started/how-it-fits).

Source: [What you can build with the packages](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/README.md#what-you-can-build).
