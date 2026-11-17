---
title: Enrichment providers
sidebar_label: Enrichment providers
description: Find keyless enrichment sources and the optional credentials that enable additional provider coverage.
kind: reference
reader: ["operator","plugin"]
packages: ["@0xintuition/atom-enrichment"]
---

<AppliesTo />

Core can enrich a book identified by ISBN, a public repository or a web page without a provider account. For other inputs, a credential can unlock additional fields or access to a specific service. Coverage depends on the plugins in the selected preset, the classified input each plugin accepts, and the transport it can use.

## Sources available without credentials

The following lookups are included in the stock `default` preset. External lookups still need outbound network access and are subject to timeouts, rate limits and missing records.

| Source | What a matching input can return |
| --- | --- |
| OpenGraph, microdata and favicon | A public page's title, description, preview image, structured JSON-LD and site icon, when available. |
| oEmbed | Embed data from supported YouTube, Vimeo and X URLs. |
| Wikipedia and Wikidata | Article extracts, entity labels and structured claims. A name search can return descriptive evidence with lower identity confidence. |
| GitHub and npm | Public GitHub repository or user details. Registry metadata and optional weekly downloads for an npm package. |
| Crossref | Publication and citation metadata for a recognized DOI. |
| Open Library | Book, edition and work metadata by a recognized identifier, including ISBN. |
| MusicBrainz, Apple Music and Spotify | Artist, release or recording information for supported targets. Spotify can use public oEmbed or URL-derived data for a direct resource without client credentials. |
| Letterboxd and Steam | Film-page metadata or Steam app details for matching URLs. |

The provider catalog also contains **payload schemas** for arXiv, PubMed, dictionary entries, color palettes, dedicated ISBN records, ENS and NFT metadata. The pinned release has no dedicated lookup implementations for those schemas. Open Library handles ISBN input. To populate the ENS or NFT schema in a fork, supply a plugin and suitable chain/RPC transport. Other schema-only entries include AI summaries and entities, company profiles, Crunchbase, geocoding, Reddit posts, screenshots and Vimeo records. Vimeo oEmbed works independently. The package exports a TVmaze provider that a fork can add to a preset. [Provider implementations](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/atom-enrichment/src/plugins/providers/index.ts) · [Payload schema catalog](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/atom-enrichment/docs/README.md) · [Stock bundles](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/atom-enrichment/src/presets/bundles.ts)

## Optional provider credentials

All eleven integrations below ship in the stock default preset. Use the named operator account to issue credentials. The last column describes what a missing credential means **for an eligible input**. A provider can also skip an unrelated input even when correctly configured.

| Provider and credential issuer | Core environment | What it enables and how keyless behavior differs |
| --- | --- | --- |
| [GitHub personal access tokens](https://github.com/settings/personal-access-tokens) | `GITHUB_TOKEN` | A higher allowance for public repository and user lookups. Anonymous access works, and the provider can retry anonymously after a rejected token. |
| [Spotify Developer Dashboard](https://developer.spotify.com/dashboard) | `SPOTIFY_CLIENT_ID` and `SPOTIFY_CLIENT_SECRET`, optional `SPOTIFY_MARKET` | Create an app for Web API metadata on tracks, albums, artists, playlists, shows and episodes. Without the pair, a direct resource can still yield a basic Spotify artifact. An ISRC search returns no record. |
| [Etherscan API keys](https://etherscan.io/apis) | `ETHERSCAN_API_KEY` | Authenticates requests for address balances, transaction counts and available contract/token metadata. The plugin can attempt an address lookup without a key. The upstream response determines coverage. |
| [TMDB account API settings](https://www.themoviedb.org/settings/api) | `TMDB_API_KEY` | Film or TV details and credits. The plugin skips when the key or a supported target is missing. |
| [CoinGecko API dashboard](https://www.coingecko.com/en/api) | `COINGECKO_API_KEY` | A Demo API key authenticates token market-data requests. The plugin can make anonymous requests when the key is absent. Check market fields and lookup status in the returned data. |
| [Google Cloud Console](https://console.cloud.google.com/) · YouTube Data API v3 | `YOUTUBE_API_KEY` | Enable the API in your project and issue an API key for video details. Without it, the YouTube Data plugin skips. A separate oEmbed artifact can still supply a title or thumbnail. |
| [Google Cloud Console](https://console.cloud.google.com/) · Places API | `GOOGLE_PLACES_API_KEY` | Enable Places and issue an API key for business details, ratings and photos on confirmed matches. Without a key the plugin can still derive a name and coordinates from a Maps URL. |
| [X Developer Portal](https://developer.x.com/) | `X_BEARER_TOKEN` | Issue a bearer token for profile data. A recognized profile without the token yields `auth_failed`. |
| [Brandfetch developer account](https://brandfetch.com/developers) | `BRANDFETCH_API_KEY` | Authenticates domain lookups for logos, colors and other brand assets. When full data is unavailable the plugin can return a fallback icon. |
| [Podcast Index API account](https://api.podcastindex.org/) | `PODCAST_INDEX_API_KEY` and `PODCAST_INDEX_API_SECRET` | Authenticates feed lookups for podcast metadata. Both values must be present for the plugin to match. An unrecognized feed can return no record. |
| [Canopy API account](https://www.canopyapi.co/) | `CANOPY_API_KEY` | Authenticates Amazon product lookups. A supported product URL or short link without a key yields `auth_failed`. |

The runtime maps environment variables to constructor options. Each provider then decides which inputs it can handle and whether a fallback is available. [Credential mapping](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/atom-enrichment/src/presets/bundles.ts) · [Spotify fallbacks](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/atom-enrichment/src/plugins/providers/spotify/index.ts) · [X authentication](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/atom-enrichment/src/plugins/providers/x-profile/index.ts) · [Canopy authentication](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/atom-enrichment/src/plugins/providers/product-listing/index.ts)

## Presets and worker scope

| Package preset | Providers |
| --- | --- |
| `default`, `custom` | The full server bundle unless the host supplies an override. |
| `company` | OpenGraph, Brandfetch and favicon. |
| `music` | OpenGraph, Spotify, MusicBrainz and Apple Music. |
| `crypto` | Etherscan and CoinGecko. |
| `academic` | Crossref and Wikipedia. |

The HTTP service maps a request's `default` or `custom` selection to its configured default preset. The worker selects its own `WORKERS_DEFAULT_PRESET` and then applies `WORKERS_PROCESSING_SCOPE` and any applicable identifier provider plan. A music scope can restrict the artifact types accepted by a worker even when more providers are installed. Preset selection and scope filtering happen separately. [Package preset factories](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/atom-runtime/src/presets.ts) · [HTTP preset selection](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/services/atom-services/src/service/processing.ts) · [Worker execution](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/services/workers/src/kg/atom-enrichment/index.ts)

## Configure your Core services

Set credentials in the local environment used by your Core source checkout. Replace both placeholders below with values from the same Spotify app. Edit the local `.env` file and keep it outside version control.

```dotenv
SPOTIFY_CLIENT_ID=YOUR_SPOTIFY_CLIENT_ID
SPOTIFY_CLIENT_SECRET=YOUR_SPOTIFY_CLIENT_SECRET
SPOTIFY_MARKET=US
```

Stock Compose forwards the listed provider variables into `atom-services` and the worker containers. Recreate the consumers that should use the changed values from your Core repository root:

```sh
docker compose -f docker-compose.yml up -d --force-recreate atom-services workers-classification workers-enrichment
```

The stock file forwards `WORKERS_PROCESSING_SCOPE`. To change `WORKERS_DEFAULT_PRESET` or `ATOM_SERVICES_DEFAULT_PRESET` in Compose, explicitly pass the selector in the corresponding service's environment. The package can also accept a `MUSICBRAINZ_USER_AGENT`. Using that setting in a worker fork requires forwarding it through Compose and the worker's environment allowlist. [Core Compose environment](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/docker-compose.yml) · [Worker settings and allowlist](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/services/workers/src/shared/config.ts)

**Shared cache.** For an Upstash Redis database, obtain its REST URL and token from the database console. Supply `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`, then pass `ATOM_SERVICES_CACHE_PROVIDER=upstash` or `WORKERS_CACHE_PROVIDER=upstash` into each service that should share the cache. Both default to memory. The stock Compose file forwards the credentials and requires an explicit environment entry for either selector. Missing REST credentials with Upstash selected produce an in-memory fallback and a warning. [Upstash console](https://console.upstash.com/) · [Core cache selection](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/atom-runtime/src/consumers.ts)

**Search credentials.** Core reserves `OPENAI_API_KEY`, `ANTHROPIC_API_KEY` and `GOOGLE_GENERATIVE_AI_API_KEY` for its search tier. Setting one does not register an enrichment provider or turn on a search service. [Core credential inventory](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/docs/enrichment-providers.md)

## Diagnose a missing result

First check `GET /ready` on the atom service for the preset's plugin IDs and cache warnings. Send a classified input to `POST /v1/enrich`, optionally narrowing `enrichment.plugins` to the provider under test. For a raw URL, send `rawInput` to `POST /v1/process` and inspect its `enrichment` field. [Atom services API](/docs/reference/atom-services-api)

| Observation | What to check |
| --- | --- |
| Provider absent from preset | Check the service's selected preset and rebuild the fork after changing its composition. An allowlist can only select registered plugins. |
| `skipped[].reason` is `not_applicable`, `filtered` or `runtime_mismatch` | Check the classified identifiers/URL and any required keys, plugin/artifact filters, and server or client runtime respectively. A skip alone cannot identify a bad key. |
| `status: "success"` with no artifact from the target plugin | A matching provider can return an empty array when no record exists. Look for a skip separately. For a fallback artifact, inspect `meta.provider` and its actual fields. |
| `errors[].code` is `auth_failed`, `rate_limited`, `upstream_error` or `timeout` | Verify credentials in the service environment, the provider's allowance or service availability as applicable. Use the returned `retriable` flag and any structured HTTP status or retry delay. |
| Some records succeeded | The engine reports `partial` when artifacts and errors coexist, and `failed` when errors leave no artifacts. Inspect the successful artifacts before deciding what to retry. |

Use the plugin ID, error code, retry flag and redacted message for diagnostics. Keep tokens, raw URLs carrying credentials and full provider responses out of reports. For a worker job, compare its scope and completion state with the atom's stored artifacts on your self-hosted node. [Response redaction](https://github.com/0xIntuition/intuition-core/blob/a402f880600f92969dc8fb013ca0f69fc9a02420/services/atom-services/src/service/redaction.ts) · [Engine error mapping](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/atom-enrichment/src/engine.ts) · [Query Core](/docs/build/query-core)

## Related

- [Write an enrichment plugin](/docs/core/enrichment-plugin)
- [Classify and enrich input](/docs/build/classify-enrich)
