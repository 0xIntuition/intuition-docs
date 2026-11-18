---
title: Glossary
sidebar_label: Glossary
description: Look up terms used in Intuition V2 and follow each definition to its underlying concept.
kind: reference
reader: ["app","agent","operator","plugin"]
packages: []
---

A recording can have an IID that names it, an atom ID that identifies its stored bytes, and a triple ID for a claim about its artist. Look up the term you have to see what it identifies and what you can infer from it.

## A–D

| Term | Meaning |
| --- | --- |
| [Atom](/docs/concepts/atoms) | A unit of graph data with its own ID. A catalog can make the recording and the artist separate atoms so other entries can refer to each one. |
| [Atom classification](/docs/concepts/atom-classification) | A plugin recognizes a pattern in an input. An eligible resolver can then return a type, fields and evidence for that interpretation. Recognizing a music link can leave the particular recording unresolved. |
| [Atom ID](/docs/concepts/deterministic-ids) | A 32-byte identifier derived from the exact atom data. Two callers supplying the same bytes get the same ID, even before either writes to a chain. |
| [Atom parsing](/docs/concepts/atom-parsing) | The step that preserves the raw input and identifies what form it takes, such as text, a URL or an IID candidate. A candidate can still fail validation. |
| [Atom runtime](/docs/concepts/atom-runtime) | The host’s configured classification and enrichment engines. Applications use the runtime to process inputs with their chosen plugins and provider settings. |
| [Bonding curve](/docs/concepts/bonding-curves) | The rule that converts an asset deposit to shares or a share redemption to assets at a vault’s current state. |
| [Canonical form](/docs/concepts/iid-schemes) | The spelling a scheme produces for an accepted identifier. Different input spellings can produce the same canonical bytes. |
| [Chain event](/docs/concepts/indexing-and-querying) | A record emitted by a contract when it executes, such as an atom creation event. A Core indexer can store the event before a projection has added the atom to the graph. |
| [Claim](/docs/concepts/triples) | A statement expressed by an ordered subject, predicate and object. Evidence for the statement can refer to that particular triple ID. |
| [Classification](/docs/concepts/classifications) | A definition of an entity kind, such as a music recording. It supplies a stable slug, a type and fields, and can specify how to derive an identifier. |
| [Counter-triple](/docs/concepts/triples) | The term for opposition to a particular triple. It has its own ID and keeps the original subject, predicate and object in their original order. |
| [Creation Profile](/docs/concepts/classifications) | The fields and suggested relationships an application can offer when someone creates an entity of a particular kind. |
| [Deposit](/docs/concepts/vaults) | A payment of native assets into a vault that issues shares to a receiver. The receiver can be a different account from the sender. |
| [Deterministic ID](/docs/concepts/deterministic-ids) | An ID anyone can reproduce by applying the same rule to the same inputs. Triple IDs depend on the order of their three component IDs. |

## E–P

| Term | Meaning |
| --- | --- |
| [Enrichment](/docs/concepts/enrichment) | Adding sourced information to a classified entity. A provider’s record can supply an artist credit, for example, and the application can keep the source alongside the extracted field. |
| [Epoch](/docs/concepts/fees-and-rewards) | A time interval defined by the emissions controller. TrustBonding uses bonded balances and utilization to determine rewards for a completed epoch. |
| [Identity ladder](/docs/concepts/identity-ladder) | An entity type’s ordered ways of identifying one of its members. Choose the strongest rung for which you have all required, valid inputs. |
| [IID (Intuition Identifier)](/docs/concepts/iid) | A name of the form `int:<scheme>:<value>` for an entity under a scheme’s rules. Several atom payloads can carry the same IID. |
| [IID registry](/docs/concepts/iid-registry) | The canonical list of admitted schemes and their rules. The registry package also maps supported IIDs to classification hints and potential enrichment providers. |
| [Indexing](/docs/concepts/indexing-and-querying) | Recording chain events for a Core node to process. A confirmed write can appear in the node’s graph after the transaction receipt arrives. |
| [MultiVault](/docs/concepts/protocol-writes) | The contract that accepts atom and triple creations and vault operations on a deployment. A signed transaction can change its state. |
| [Nested triple](/docs/concepts/triples) | A claim that uses an existing triple ID as one of its components. A source attribution can use the artist-credit triple as its subject. |
| [Object](/docs/concepts/triples) | The third term in a claim. In “recording, by artist, Mira,” Mira’s term ID occupies the object slot. |
| [Position](/docs/concepts/vaults) | An account’s share balance for one term and bonding curve on one deployment. |
| [Predicate](/docs/concepts/predicates) | The relation between the subject and object. A registry key such as `byArtist` selects a definition whose atom ID goes in the middle of the triple. |
| [Projection](/docs/concepts/indexing-and-querying) | The step that turns a Core node’s recorded chain events into graph records. Once a node has projected an atom creation event, a reader can look up the atom through that self-hosted node’s [Query API](/docs/build/query-core). |
| [Protocol fee](/docs/concepts/fees-and-rewards) | A charge MultiVault applies under the deployment’s fee configuration. An operation can also have entry, exit or other fees. |
| [Protocol write](/docs/concepts/protocol-writes) | A transaction that changes on-chain state when it succeeds. A local action plan describes the intended write, and a receipt records its execution outcome. |

## R–V

| Term | Meaning |
| --- | --- |
| [Receipt](/docs/concepts/protocol-writes) | The chain’s record of a transaction’s execution, including its status and emitted logs. A transaction hash lets you track the submission before you have that outcome. |
| [Redemption](/docs/concepts/vaults) | Burning shares in a particular vault to receive native assets after applicable fees. |
| [Representation profile](/docs/concepts/representation-profiles) | The choice of bytes an atom uses to carry an IID. P0 uses the bare identifier, P1 includes identity context, and P2 allows descriptive data. Different payloads for one IID can produce different atom IDs. |
| [sameAs](/docs/concepts/same-as) | A predicate asserting that two atoms refer to the same real-world entity. Each atom retains its own bytes, ID and history. |
| [Schema.org vocabulary](/docs/concepts/schema-org) | Shared definitions of types and properties. For a recording, an application can look up what `MusicRecording` means and which properties it inherits. |
| [Scheme](/docs/concepts/iid-schemes) | The part of an IID that determines what its value identifies, which inputs are valid and how to spell the result. |
| [Share](/docs/concepts/vaults) | A unit a vault issues on deposit and burns on redemption. To estimate its value in assets, use that specific vault and curve. |
| [Signal (stake)](/docs/concepts/signals) | Economic weight behind a term, visible through a vault position. A deposit can support a claim or its counter-side. Evaluating the claim’s truth requires evidence of its own. |
| [Subject](/docs/concepts/triples) | The first term in a claim. In “recording, by artist, Mira,” the recording’s term ID occupies the subject slot. |
| [Term](/docs/concepts/vaults) | An atom or a triple that the protocol can reference by ID. A term can have vaults on more than one curve. |
| [Triple](/docs/concepts/triples) | An ordered subject, predicate and object that together express one claim. The triple has its own ID, so another triple can refer to that claim. |
| [Vault](/docs/concepts/vaults) | The assets and shares MultiVault accounts for under one term ID and one curve ID. A different curve on the same term has separate balances. |
