---
title: Data Structures
sidebar_label: Data Structures
sidebar_position: 2
description: How to structure atom data using Schema.org classifications and the enrichment system
keywords:
  [
    data structures,
    atom classification,
    enrichment,
    schema.org,
    atom data,
    JSON-LD,
    onchain,
    offchain,
  ]
---

# Data Structures

:::tip This page covers how to format atom data
For creating atoms onchain, see [Atom Fundamentals](../intuition-concepts/primitives/Atoms/fundamentals.md). For connecting atoms with predicates, see [Predicates](./predicates).
:::

Every atom in Intuition needs data. The data you put in determines the atom's permanent identity — so getting the format right matters. This page covers the classification system that standardizes atom data across the ecosystem.

## The Core Idea

**Store minimal identity onchain. Attach rich context offchain.**

An atom's data should contain just enough to identify and disambiguate the entity. Everything else — descriptions, images, social links, market data — comes from enrichment providers that refresh independently.

```
Onchain (permanent):     { "@type": "Person", "name": "Vitalik Buterin" }
Offchain (refreshable):  Wikipedia bio, GitHub profile, ENS records, profile photo
```

## Atom Classification

Classifications define the minimal shape of an atom for each entity type. They use [Schema.org](https://schema.org/) types for universal compatibility.

### Format

Every classified atom follows this structure:

```json
{
  "@context": "https://schema.org/",
  "@type": "Person",
  "name": "Vitalik Buterin",
  "sameAs": ["https://www.wikidata.org/wiki/Q35332"]
}
```

The key fields:

- `@context` — Always `"https://schema.org/"`
- `@type` — The Schema.org type (Person, Organization, SoftwareSourceCode, etc.)
- Identity fields — The minimum needed to identify the entity

### Common Classification Examples

#### Person

```json
{
  "@context": "https://schema.org/",
  "@type": "Person",
  "name": "Vitalik Buterin",
  "sameAs": ["https://www.wikidata.org/wiki/Q35332"]
}
```

Only `name` is required. `sameAs` links to a canonical identifier for disambiguation.

#### Organization / Company

```json
{
  "@context": "https://schema.org/",
  "@type": "Organization",
  "name": "Uniswap Labs",
  "url": "https://uniswap.org"
}
```

#### Software

```json
{
  "@context": "https://schema.org/",
  "@type": "SoftwareSourceCode",
  "name": "Foundry",
  "codeRepository": "https://github.com/foundry-rs/foundry"
}
```

#### Ethereum Account

```json
{
  "chainId": "1",
  "address": "0xA0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
}
```

Blockchain-native types use their natural identifiers rather than Schema.org.

#### Defined Term (Tags, Concepts, Predicates)

```json
{
  "@context": "https://schema.org/",
  "@type": "DefinedTerm",
  "name": "Knowledge Graph",
  "description": "A structured, semantic network of entities and relationships"
}
```

`DefinedTerm` is important — it's the type used for tags, concepts, and enshrined predicates.

### All Classification Types

| Type | Schema.org `@type` | Required Fields |
| --- | --- | --- |
| Person | `Person` | `name` |
| Company | `Organization` | `name`, `url` |
| Software | `SoftwareSourceCode` | `name`, `codeRepository` |
| Location | `Place` | `name` |
| Product | `Product` | `name` |
| Event | `Event` | `name` |
| Article | `Article` | `name` |
| Book | `Book` | `name` |
| Movie | `Movie` | `name` |
| Music Recording | `MusicRecording` | `name`, `byArtist` |
| Defined Term | `DefinedTerm` | `name` |
| Ethereum Account | *(custom)* | `chainId`, `address` |
| Ethereum ERC20 | *(custom)* | `chainId`, `address` |
| Smart Contract | *(custom)* | `chainId`, `address` |

For the full catalog of all 36 classification types, see [classifications/](https://github.com/0xIntuition/intuition-data-structures/tree/main/classifications) in the data structures repo.

### Why Minimal?

Each additional field in an atom is permanent onchain data. Mutable information belongs in enrichment:

| Field | Where It Goes | Why |
| --- | --- | --- |
| Name | Atom (onchain) | Stable identity — rarely changes |
| Profile photo | Enrichment (offchain) | Changes frequently |
| Bio/description | Enrichment (offchain) | Changes over time |
| Social links | Enrichment (offchain) | Platforms come and go |
| Market cap | Enrichment (offchain) | Changes every second |

## Atom Enrichment

Enrichment is the context layer — refreshable, offchain metadata attached to classified atoms. It provides everything a frontend needs without bloating atom payloads.

### Enrichment Envelope

All enrichment data uses a standard envelope:

```json
{
  "artifact_type": "wikipedia",
  "data": {
    "summary": "Canadian-Russian computer programmer and co-founder of Ethereum",
    "image": "https://upload.wikimedia.org/example.jpg"
  },
  "meta": {
    "pluginId": "wikipedia",
    "provider": "wikipedia",
    "fetchedAt": "2026-02-26T12:00:00Z",
    "sourceUrl": "https://en.wikipedia.org/wiki/Vitalik_Buterin",
    "confidence": 0.98
  }
}
```

The `meta` block tells you where the data came from, when it was fetched, and how confident the source is.

### How Enrichment Works

1. An atom is created onchain with minimal classification data
2. Backend workers detect the atom and run enrichment providers
3. Each provider returns an artifact with its specific data
4. Clients compose identity (onchain) + enrichment (offchain) at query time

This means a single `Person` atom can have enrichment from Wikipedia, GitHub, Twitter, ENS, and more — all updated independently.

### Enrichment Providers

The system supports 37+ enrichment providers across categories:

| Category | Providers |
| --- | --- |
| Knowledge | Wikipedia, Wikidata, Dictionary |
| Developer | GitHub, NPM, arXiv |
| Blockchain | CoinGecko, Etherscan, ENS, NFT Metadata |
| Media | Spotify, Apple Music, YouTube, Vimeo, TMDB, MusicBrainz |
| Social | Twitter Profile, Reddit Post |
| Web | OpenGraph, oEmbed, Favicon, Microdata |
| Business | Crunchbase, Company Profile, Product Listing |
| Location | Geocode, Places |
| AI | AI Summary, AI Entities |

For the full enrichment specification, see [enrichment/](https://github.com/0xIntuition/intuition-data-structures/tree/main/enrichment) in the data structures repo.

## End-to-End Example

Here's the full flow for creating a `Person` atom:

### 1. Input

A user submits a URL: `https://en.wikipedia.org/wiki/Vitalik_Buterin`

### 2. Classification (Onchain)

The system classifies this as a Person and stores the minimal identity:

```json
{
  "@context": "https://schema.org/",
  "@type": "Person",
  "name": "Vitalik Buterin",
  "sameAs": ["https://www.wikidata.org/wiki/Q35332"]
}
```

### 3. Enrichment (Offchain)

Providers attach context artifacts:

```json
// Wikipedia enrichment
{
  "artifact_type": "wikipedia",
  "data": {
    "summary": "Canadian-Russian programmer, co-founder of Ethereum",
    "image": "https://upload.wikimedia.org/..."
  },
  "meta": { "provider": "wikipedia", "fetchedAt": "2026-02-26T12:00:00Z" }
}

// GitHub enrichment
{
  "artifact_type": "github",
  "data": {
    "username": "vbuterin",
    "repos": 42,
    "followers": 12500
  },
  "meta": { "provider": "github", "fetchedAt": "2026-02-26T12:00:00Z" }
}
```

### 4. Query-Time Composition

Clients compose the full picture at read time:

- Stable atom identity from onchain data
- Latest enrichment from backend services
- Rich UX without bloated atom payloads

## Design Principles

1. **Minimal by default** — Keep only the smallest viable identity payload in base atoms
2. **Durable over complete** — Prefer fields that are stable over time
3. **Separate identity and context** — Onchain atom = identity, offchain enrichment = context
4. **Extensible by artifacts** — New metadata sources don't require changing atom identity
5. **Schema.org aligned** — Universal compatibility with web standards

## Next Steps

- **[Predicates](./predicates)** — Learn how to connect atoms with the canonical predicate vocabulary
- **[Atom Fundamentals](../intuition-concepts/primitives/Atoms/fundamentals.md)** — How to create atoms onchain
- **[intuition-data-structures repo](https://github.com/0xIntuition/intuition-data-structures)** — Full specification for all classification and enrichment types
