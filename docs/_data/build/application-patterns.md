---
title: 'What to build with a shared knowledge graph'
slug: /build/application-patterns
sidebar_position: 7
---

The packages remove repeated identity and modeling work. Core supplies a graph backend. Contracts add shared registration and economic signaling. An application combines those capabilities with its own product policy.

| Pattern                       | Start with                                                | Add when needed                                  | Decisions your app owns                             |
| ----------------------------- | --------------------------------------------------------- | ------------------------------------------------ | --------------------------------------------------- |
| Media discovery and curation  | Category identity ladder, Creation Profiles, Core triples | Provider enrichment and account signals          | Duplicate reconciliation, ranking, moderation       |
| Research and evidence graph   | Stable anchors, canonical predicates, provenance          | Nested claims and selected on-chain registration | Evidence quality, citations, access control         |
| Portable collections          | Canonical item IDs and containment relationships          | Accounts and public sharing                      | Membership order, permissions, deletion semantics   |
| Contextual reputation         | Attributed claims and queryable relationships             | Vault positions and signals                      | Context, scoring, manipulation resistance           |
| Agent-assisted graph building | Offline builders, explicit plans, Core reads              | Approved writes and transaction execution        | Scope, budget, provenance, human authorization      |
| Enrichment service            | Parser and processing engines                             | Persistent artifacts and refresh scheduling      | Provider terms, credentials, retry and cache policy |

These are application designs, not claims that a hosted product or turnkey ranking API already exists.

## Example: a recording discovery app

1. Collect a strong identifier such as an ISRC and retain the provider source.
2. Build the canonical recording anchor with `primitives`.
3. Use the shared profile to offer relationships to artists, albums, or playlists.
4. Persist chosen terms and triples in Core.
5. Enrich display metadata through configured providers without rewriting identity.
6. Query attributed relationships and apply your own ranking policy.
7. Offer optional on-chain registration or signaling through an explicit wallet flow.

Two applications using the same supported canonical representation can refer to the same atom. They may still disagree on labels, claims, visibility, or ranking. That disagreement is data an application can expose and contextualize.

## Example: an evidence-aware agent

Give an agent a fixed list of source URLs and a maximum number of proposed claims. Have it return canonical candidate identities, source attribution, and relationship proposals before persistence. Validate the package results and show which inputs remain uncertain. Store accepted claims through your server; execute economic actions only through an authorized signer with a bounded budget.

The agent should cite the source behind each claim and preserve processing failures. It should not infer that a fetched artifact is trustworthy, that `sameAs` proves equivalence, or that a large vault balance validates a claim. See the [agent contract](./agents.md).
