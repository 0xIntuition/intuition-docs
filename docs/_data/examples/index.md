---
title: "What you can build"
sidebar_label: "What you can build"
description: "Choose a worked example for atom creation, predicates, identity, React wallet flows, indexed queries or catalog modeling."
kind: reference
reader: ["app", "agent", "operator", "plugin"]
packages: []
---

The packages supply shared identities and graph modeling tools. Core supplies storage, processing workers, and queries. Protocol contracts add registration and economic positions. Your application combines these with its own rules for evidence, permissions, and ranking.

<div className="examples-grid">
<Card to="/docs/examples/atom-creation-form" title="Create an atom from a schema" description="Generate a form from a Creation Profile." />
<Card to="/docs/examples/predicate-picker" title="Choose a predicate" description="Find a relationship that fits the claim you want to make." />
<Card to="/docs/examples/identity-linking" title="Link two identities" description="Keep each identity distinct while recording a sameAs claim." />
<Card to="/docs/examples/react-app" title="Read and create an atom in React" description="Review a wallet call and read back its confirmed atom." />
<Card to="/docs/examples/core-query-api" title="Query your Core node" description="Retrieve indexed graph records from your own node." />
<Card to="/docs/examples/music-catalog" title="Build a music catalog" description="Connect a recording, artist and album with explicit triples." />
</div>

## Apply the pattern

| Application | Shared building blocks | Decisions your application owns |
| --- | --- | --- |
| Media discovery and curation | Identity ladders, Creation Profiles, explicit triples | Duplicate review, ranking, moderation |
| Research and evidence | Stable anchors, shared predicates, provenance | Evidence quality, citations, access control |
| Portable collections | Item IDs and containment relationships | Membership order, permissions, deletion semantics |
| Contextual reputation | Attributed claims and vault positions | Context, scoring, resistance to manipulation |
| Agent-assisted graph building | Offline builders and reviewed action plans | Scope, budget, provenance, authorization |
| Enrichment services | Parser, classifier, provider runtime | Provider terms, credentials, retries, cache policy |

When adapting the music catalog, decide which entity each record identifies, which bytes represent it, and which directed relationship you are asserting. Your application supplies the evidence policy for claims and decides how a position contributes to reputation.

For a smaller starting point, run the [offline quickstart](/docs/get-started/quickstart). For operational boundaries, read [How the pieces fit](/docs/get-started/how-it-fits).

Source: [What you can build with the packages](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/README.md#what-you-can-build).
