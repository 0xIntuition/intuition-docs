---
title: ERC-8004 Agent Layer Partner Guide
sidebar_label: ERC-8004 Agent Layer
sidebar_position: 7
description: Integrate an ERC-8004 trust provider and publish mutable agent assessments through Intuition's knowledge graph.
keywords: [erc-8004, agents, reputation, trust provider, assessments, sdk]
---

# Integrating with the ERC-8004 Agent Layer on Intuition

:::note TL;DR

Intuition is the curation layer for ERC-8004 reputation: where the feedback agents post on 8004 gets weighted and aggregated into a signal consumers can trust. The ERC-8004 V1 agent layer is live on Intuition mainnet today, and the reputation-ranked agents from the top-100 snapshot are already queryable as Atoms — each linked to its on-chain ERC-8004 identity by a `same as` attestation, with further attestations covering capability, category, tag, endpoint, and trust-surface.

As an integration partner, you can now stand up **your own trust-provider identity**, **publish per-agent assessments**, and **let the ecosystem attest to / stake on the assessments it finds credible** — without re-writing on-chain Triples every time your scores change.

This guide walks you through the canonical write pattern, gives you a worked end-to-end example, shows how consumer queries light up once your data lands, and lists the five things you need to ship a working integration.

:::

## Why Intuition for ERC-8004 reputation

[ERC-8004](https://eips.ethereum.org/EIPS/eip-8004) gives agents three registries: an Identity Registry that mints a portable, ERC-721 identity for each agent, a Validation Registry for independent checks, and a Reputation Registry, the on-chain place where anyone who has worked with an agent can post feedback about it. The Reputation Registry is live on mainnet and already in heavy use: 267,785 registered agents, 410,907 feedback submissions, and 261,436 active participants reported by [https://8004scan.io/](https://8004scan.io/) as of June 2026.

The Reputation Registry is intentionally thin. When a client who has used an agent calls `giveFeedback`, the contract stores a numeric score, a couple of optional tags, and a revocation flag. The written review itself lives off the contract, behind an emitted pointer. The one rule it enforces is that an agent cannot rate itself; anyone else can submit feedback, and it costs nothing to do so. That minimalism is deliberate. The standard says so directly: "While simple filtering by reviewer and by tag are enabled on-chain, more complex reputation aggregation will happen off-chain." And on the risk it creates: "Sybil attacks are possible, inflating the reputation of fake agents… We expect many players to build reputation systems, for example, trusting or giving reputation to reviewers."

The spec is asking other people to build the reputation layer it stops short of. Intuition is that layer: a general-purpose trust protocol, an on-chain knowledge graph where anyone can make a claim about anything and stake value behind it. Agent reputation is one of its uses. The part 8004 leaves open — weighting feedback and aggregating it into a verdict — is exactly what Intuition does. It does not replace the Reputation Registry. Feedback keeps getting posted to 8004, and Intuition is where it becomes curated, so consumers can tell which feedback to trust.

That trust has to come from somewhere. On Intuition, it comes from cost. A free rating risks nothing, so it carries no weight — anyone can leave one for anyone. Intuition gives every claim a vault, a market where anyone can back it with capital: to support a claim you stake \$TRUST, taking a position whose value rises and falls with how the rest of the market judges it. Staking real capital is what separates genuine conviction from an idle opinion, and because anyone can stake against a claim as readily as for it, belief and doubt are priced side by side. The weight behind a claim then reflects what people are willing to put at risk for it.

A reputation on Intuition is the sum of those staked signals, read across a few factors rather than one: how much stake backs a claim, how many independent participants put it there, how long the consensus has held, and how much stake takes the other side. Who is doing the staking matters too. A participant with a record of correct, well-supported claims carries more weight on the next one. This is the Sybil resistance the 8004 authors ask for. A thousand free ratings from throwaway accounts count for little against a few positions backed by capital and a history of being right, because influence follows stake and track record, not the number of accounts.

On 8004, feedback sits in a separate registry on each chain, with no shared surface to query them together. Intuition connects agents, providers, capabilities, and claims in a single knowledge graph, so assessments from many providers and many chains resolve into one view. A consumer asks once instead of assembling an agent's standing registry by registry.

---

## Why publish: bootstrapping the Web of Trust

Your assessments already create value on your own surfaces. Published into the Intuition Knowledge Graph, they become part of a shared trust layer that wallets, marketplaces, agent frameworks, and other providers can all build against — a layer that gets more valuable for you as each new provider adds theirs, and which serves as a free distribution channel.

This works because the semantics of these attestations are permissionless, composable, and standardized. Every provider publishes into the same structure, so a consumer evaluating an agent can traverse, in one query path:

- **Who is doing the scoring** — provider identities, linked to every agent they assess
- **How good their scoring methods are** — methodology, dimensions, and evidence exposed in each assessment document
- **How usable the data is** — live resolver URLs with declared freshness windows, readable by any consuming app
- **What the scorer's own reputation is** — the stake placed on each provider's `has trust provider` edges, the market's running answer to whose opinion deserves weight

Every question that matters about a trust signal becomes traversable graph structure rather than a claim on a provider's landing page. And because the structure is shared — the same four-Triple shell, the same resolver convention, the same staking surface — each provider that integrates makes every other provider's data more useful. The providers who publish early are the ones consumers learn to query first.

The query guide, found later in this document, shows each of these reads end to end.

---

## What you can do today

- **Query any of the currently indexed agents** — stored as [Atoms](/docs/intuition-concepts/primitives/Atoms/fundamentals) on Intuition — with full structured capability, category, tag, endpoint, and trust-surface metadata.
- **Stand up your own provider identity** and publish assessments that the ecosystem can query, surface in product, and stake on.
- **Compose assessments across providers** on the same agent. ERC-8004's Reputation Registry produces opinions; Intuition gives those opinions a shared composable surface — without picking a winner.
- **Anchor to the Agent’s ERC-8004 on-chain identity** through the `same as` predicate. Your integration references the canonical registration, it does not duplicate it. Intuition is not a competing registry — it is merely a knowledge graph where attestations can be attached to the Agent.

---

## The core write pattern

Stable graph edges, partner-owned mutable JSON. This is the canonical shape for any assessment, score, risk signal, or trust surface that can change over time.

:::tip

**New to Intuition? Learn these three primitives.** The knowledge graph is built from three building blocks:

- [**Atom**](/docs/intuition-concepts/primitives/Atoms/fundamentals) — a universal identifier for any entity or concept; the nodes of the graph (an agent, a trust provider, a capability).
- [**Triple**](/docs/intuition-concepts/primitives/Triples/fundamentals) — a subject-predicate-object claim that links Atoms; the edges (for example, agent → has trust provider → provider).
- [**Signal**](/docs/intuition-concepts/primitives/Signals/fundamentals) — staked \$TRUST on an Atom or Triple; the weight, and the economic skin-in-the-game behind every claim.

Full primer: [Primitives overview](/docs/intuition-concepts/primitives) · [Glossary](/docs/resources/glossary). Throughout this guide, "RDF Triple" means a Triple written in subject-predicate-object form.

:::

### Entity types, Atoms, and the pin operations

Three concepts stack here, and knowing them up front makes the rest of the recipe read more cleanly.

**1. The entity types that exist.** Every Atom is one of three types, from [schema.org](http://schema.org):

| Entity type      | What it represents                                                                    |
| ---------------- | ------------------------------------------------------------------------------------- |
| **Thing**        | The default — any entity or concept: an agent, a trust provider, an assessment source |
| **Person**       | A human identity                                                                      |
| **Organization** | A company, DAO, or other collective                                                   |

Everything in this guide is a **Thing** — agents, providers, and assessment sources are all Things. `Person` and `Organization` exist for when you model those directly.

**2. How you create an Atom for a type.** An Atom doesn't store its metadata on-chain as raw bytes. The metadata lives in a small JSON record pinned to IPFS, and the Atom points to it by a permanent `ipfs://…` URI. So creating an Atom is two moves: pin the metadata, then mint the Atom from the URI the pin returns.

**3. The operations that do the pinning.** Each entity type has its own pin operation — the function you call to store that type's metadata:

| Operation         | Pins metadata for |
| ----------------- | ----------------- |
| `pinThing`        | a Thing           |
| `pinPerson`       | a Person          |
| `pinOrganization` | an Organization   |

Each takes a JSON record (`name`, `description`, `image`, `url`) and returns the `ipfs://…` URI. `pinThing` is to an Atom what `createAtom` is to the chain write: the function you call, not the thing itself. A provider Atom _is a Thing_ — `pinThing` is just how you pin its metadata. Throughout this guide you'll only see `pinThing`, since everything we create is a Thing. (Operation details, auth, and examples: **The Partner Pinning API** below, and the [pinThing reference](/docs/graphql-api/mutations/pin-thing).)

### Why this shape

Reputation scores change. Risk levels move. Freshness windows close. If every score update required writing a new immutable on-chain attestation (captured in the form of [**RDF Triples**](/docs/intuition-concepts/primitives/Triples/fundamentals) in Intuition), every prior attestation would become a stranded staking surface, and consumers who staked on the old assessment would be forced to migrate every time you re-scored an agent.

The mainnet pattern resolves this with a stable graph shell that points to mutable partner-owned JSON. The shell never changes. The JSON does.

:::warning

**Anti-pattern: do not write mutable scores as direct Triples.** Creating a new `(agent, has score, 87)` Triple every time a score updates fragments the staking surface and forces consumers to migrate support from old Triples to new ones. Use the `pinThing` + JSON pattern below.

:::

### The trust pattern: four RDF Triples

Every assessment you publish has the same four-edge shape — we call it the **trust pattern**, and you'll see it referenced throughout the guide:

```text
(agent, has trust provider, provider)
(agent, has trust assessment, provider-specific assessment source)
(provider-specific assessment source, provided by, provider)
(provider-specific assessment source, has type, Trust Assessment Source)
```

Visualized:

```mermaid
flowchart LR
  agent[Agent]
  provider[Trust provider]
  source[Assessment source]
  sourceType[Trust Assessment Source]

  agent -->|has trust provider| provider
  agent -->|has trust assessment| source
  source -->|provided by| provider
  source -->|has type| sourceType
```

**What each edge does:**

| Edge                                          | Role                                                                                                                                     |
| --------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `(agent, has trust provider, provider)`       | Declares that this provider has an opinion about this agent. Stakeable: consumers can signal which providers they trust on which agents. |
| `(agent, has trust assessment, source)`       | Points the agent to the specific assessment-source handle. Consumers traverse this edge to find the current assessment.                  |
| `(source, provided by, provider)`             | Closes the loop. Lets queries start from the source and find the provider.                                                               |
| `(source, has type, Trust Assessment Source)` | Type marker. Makes the assessment-source pattern queryable across all providers without knowing provider identities.                     |

### How Atoms store metadata

[Atoms](/docs/intuition-concepts/primitives/Atoms/fundamentals) in this pattern carry their metadata via a pinned JSON document, not as on-chain bytes. The Atom is stable. The JSON it points to is the partner's to update.

- Your **provider Atom** is a Thing — pin its stable metadata (name, description, logo, canonical URL) with `pinThing`, then mint the Atom from the returned URI. You rarely change it.
- Your **assessment-source Atom** is a Thing with a `url` field pointing to the resolver URL where the live assessment lives. You change the JSON behind it as scores update, not the Atom itself.

### The Partner Pinning API

The `pinThing` calls in the worked example reach Intuition's gated pinning service. Partner integrations authenticate with an API key Intuition issues you.

**Getting your key.** Request one from the Intuition Business Development team (contact at the end of this guide), or apply for a key using [our official form](https://forms.gle/7mhm55dFQzvyBLyG9). We issue a personal key and share it securely. Treat it like a password — store it in a secrets manager; don't commit it to git or paste it into chat or tickets. If a key is ever exposed, we can rotate or revoke it instantly, and revoking your key never affects any other partner.

**Endpoint and auth.**

- Endpoint: `https://pin.intuition.systems/v1/graphql`
- Send your key in a request header named `apikey`. We have a specific code snippet available in the end to end integration example section.
- Using the `@0xintuition/sdk`? Call `configureSdk({ pinApiKey })` once and the SDK sends this header for you — see the [SDK pinning guide](/docs/intuition-sdk/integrations/pinata-ipfs).

:::warning

The key goes in a **header**, not the URL. Putting it in the query string (`…/v1/graphql?apiKey=…`) returns `401 No API key found` — keys in URLs aren't accepted because they leak into logs.

:::

One endpoint serves all networks — pins are content-addressed, so the pinning endpoint is network-agnostic. You use the same endpoint whether you're dry-running on testnet or writing to mainnet.

**Operations available to your key:**

| Operation                                    | What it does                                                                                                                                                                                                                                                                                                                                                                                   |
| -------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pinThing` / `pinPerson` / `pinOrganization` | Pin a JSON metadata record → `ipfs://…` URI                                                                                                                                                                                                                                                                                                                                                    |
| `uploadJsonToIpfs`                           | Pin an arbitrary JSON document to IPFS. Argument is `json: jsonb!`, returns `{ hash, name, size }` (no `uri` field). For Thing/Person/Organization metadata records, prefer `pinThing`, which returns a ready-to-use `ipfs://` URI.                                                                                                                                                            |
| `uploadImage` / `uploadImageFromUrl`         | Safety-check an image, then pin it. Argument is a nested input object — `uploadImageFromUrl(image: { url })`, not a bare `url` — and the result is a list under an `images` key: `{ images: [{ url, safe }] }`. Example: `mutation($i: UploadImageFromUrlInput!) { uploadImageFromUrl(image: $i) { images { url safe } } }` with variables `{ "i": { "url": "https://…direct-image-url…" } }`. |

Your key is scoped to exactly these operations and is rate-limited (currently ~120 requests/minute per key; ask if you need more headroom).

**Example — pin provider metadata:**

```bash
curl https://pin.intuition.systems/v1/graphql \
  -H "apikey: YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{"query":"mutation($t:PinThingInput!){pinThing(thing:$t){uri}}","variables":{"t":{"name":"Example Trust Provider","description":"Multi-dimensional ERC-8004 agent trust scoring.","image":"https://provider.example/logo.svg","url":"https://provider.example"}}}'
# -> {"data":{"pinThing":{"uri":"ipfs://bafkrei…"}}}
#
# To verify manually, fetch the CID through a gateway such as https://w3s.link/ipfs/<cid>.
# Resolving that URI returns the pinned schema.org JSON-LD record:
# {"@context":"https://schema.org","@type":"Thing","name":"Example Trust Provider",
#  "description":"Multi-dimensional ERC-8004 agent trust scoring.",
#  "image":"https://provider.example/logo.svg","url":"https://provider.example"}
```

`pinThing` requires all of `name`, `description`, `image`, and `url`; `pinPerson` additionally requires `email` and `identifier`; `pinOrganization` additionally requires `email`. Omitting a required field fails the request. Image uploads run an automated NSFW check and return `{ images: [{ url, safe }] }`; use a direct, hotlink-friendly image URL, since some hosts block server-side fetches and return an empty result. When your goal is to reproduce an existing canonical atom (rather than create a new one), the payload must match the original's bytes exactly — including any historical quirks in its field values. Pin first and compare the returned URI to the canonical atom's `data` field before minting.

**Common errors:**

| Symptom                                                                                                                                       | Fix                                                                                                                                                                                                                |
| --------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `401 No API key found in request`                                                                                                             | Send the key as the `apikey` header, not in the URL.                                                                                                                                                               |
| `401 Invalid authentication credentials`                                                                                                      | Key is revoked or mistyped — confirm with the Business Development team.                                                                                                                                           |
| `Attribute Error: 'Object' has no attritubte 'description'` (verbatim — the typo is upstream, and the error names `'Object'`, not `pinThing`) | Provide all of `name`, `description`, `image`, `url`.                                                                                                                                                              |
| `uploadImageFromUrl` returns `internal error` — or an empty `images` array                                                                    | The image host blocked or failed the server-side fetch — use a direct, hotlink-friendly image URL. (An unreachable host surfaces as an `internal error`; a reachable host whose fetch fails returns `images: []`.) |

### Resolver URL convention

Use a stable, well-known path so consumers and indexers can resolve assessments without out-of-band coordination:

```text
https://{your-domain}/.well-known/intuition/erc8004/agents/{chainId}/{tokenId}/trust-assessment.json
```

- `{chainId}` — the EVM chain ID where the ERC-8004 agent is registered (Base = 8453, BSC = 56, Ethereum = 1).
- `{tokenId}` — the ERC-8004 Identity Registry token ID.

If your assessment doesn't fit per-agent (e.g., it's a class-level signal across many agents), use a class-level path and reference it from each per-agent assessment-source — but the per-agent resolver path is the recommended default.

### The JSON document

Minimal required fields:

```json
{
  "$schema": "https://provider.example/schemas/trust-assessment/v1.json",
  "agent": {
    "chainId": 8453,
    "tokenId": "1380",
    "registry": "0x8004A169FB4a3325136EB29fA0ceB6D2e539a432"
  },
  "provider": {
    "id": "example-trust-provider",
    "name": "Example Trust Provider",
    "url": "https://provider.example"
  },
  "assessment": {
    "score": 87,
    "scoreScale": "0-100",
    "lastUpdated": "2026-06-08T15:00:00Z"
  }
}
```

`$schema` is optional and illustrative — Intuition does not host a central schema document. If you publish a JSON Schema for your own assessment format, point `$schema` at it; otherwise omit the field. The authoritative definition of the required shape is the example above.

Recommended fields when applicable:

```json
{
  "assessment": {
    "riskLevel": "low",
    "freshness": {
      "validUntil": "2026-06-15T00:00:00Z",
      "refreshIntervalSeconds": 86400
    },
    "sourceChain": "base",
    "dimensions": {
      "reliability": 91,
      "safety": 84,
      "latency": 88
    },
    "evidence": [
      {
        "type": "feedback-summary",
        "url": "https://provider.example/evidence/..."
      },
      {
        "type": "validator-attestation",
        "url": "https://provider.example/attestations/..."
      }
    ],
    "signature": {
      "alg": "EIP-712",
      "signer": "0x...",
      "value": "0x..."
    }
  }
}
```

- **Dimensions** — if your scoring system is multi-factor (DJD's 7-dimension score, Helixa's 11-factor Cred Score, Verity's Brier Skill Scores), expose them. Don't collapse to a single number unless that's actually your product.
- **Freshness** — declare validity windows. Consumers who cache assessments rely on this.
- **Evidence** — URLs to the underlying data. Optional but builds credibility.
- **Signature** — required if the assessment is compliance-sensitive or needs cryptographic verification. EIP-712 with your provider signer is the recommended default.

### Don't want to host JSON?

The contract with consumers is a stable external URL that you control and can update. JSON at the well-known path is the recommended default because consuming apps can parse it without custom handling — but the URL can point to a webpage, a GitHub-hosted markdown file, or a public Notion page that carries the same assessment data. If you publish a format other than JSON, the apps ingesting your assessments take on the parsing themselves; the Intuition backend doesn't transform assessment content either way.

---

## Adding an agent that isn't in the indexed cohort

The initial mainnet cohort (98 agents; 101 on testnet at the 2026-07-08 snapshot — the testnet count grows as partners dry-run the recipe) is the indexable slice of the top-100 ERC-8004 reputation snapshot. If the agent you want to assess — your own, or a third party's — isn't already an Atom, you create it yourself before running the four-Triple trust pattern. This is the canonical recipe, and it must match Intuition's ingestion **exactly**, so your agent resolves to the same Atom everyone else's does.

:::tip

**Why the recipe is exact, not approximate.** Atom IDs are content-deterministic — the same input bytes always produce the same Atom ID, and a single-character difference produces a different one. The agent identity Atom must therefore be minted from an exact, shared recipe, or two people indexing the same agent mint two different "canonical" Atoms and split its staking surface — the exact fragmentation this architecture exists to prevent.

:::

### Step 0 — Preflight (always run first)

Run the **Preflight — Resolve the canonical agent Atom** query (in the worked example below) against the agent's ERC-8004 identity. If it returns a Triple, the agent already exists — reuse `subject.term_id` and skip straight to the trust pattern. Only if it returns nothing do you mint a new agent, using Steps A–C.

```graphql
query FindAgentByERC8004Identity(
  $sameAsPredicateId: String!
  $caipId: String!
) {
  triples(
    where: {
      predicate_id: { _eq: $sameAsPredicateId }
      object: { value: { thing: { name: { _eq: $caipId } } } }
    }
    limit: 1
  ) {
    term_id
    subject {
      term_id
      label
      value {
        thing {
          name
          image
          url
        }
      }
    }
    predicate {
      term_id
      label
    }
    object {
      term_id
      label
      data
      value {
        thing {
          name
          url
        }
      }
    }
  }
}
```

```json
{
  "sameAsPredicateId": "0xbeebfb7d177cbd96ffc239d2196c72ec346efe81f39dc595773f13d83506f5f0",
  "caipId": "eip155:8453/erc721:0x8004A169FB4a3325136EB29fA0ceB6D2e539a432/1380"
}
```

A returned Triple's `subject.term_id` is the canonical agent Atom (for Captain Dackie, `0x45078ae569def2264355f77e592028dd6f1f5d6373c204fe82bf3141ab1861fb`). The same query also appears in the worked example below.

### Step A — Mint the identity Atom

:::warning

**Before you write:** you need a partner pinning [API key](https://forms.gle/7mhm55dFQzvyBLyG9), a funded wallet on the target network, and exact `term_id` values for every Triple subject, predicate, and object. `createTripleStatement` does not resolve labels. Use returned Atom IDs for newly created Atoms, use the published canonical predicate constants (identical on both networks, except `has tag`, which is per-network), and resolve any label-based IDs through GraphQL with an explicit zero/multiple-match check.

:::

The agent identity Atom is a `pinThing` containing four fields derived from the agent's ERC-8004 `registrationFile` (queryable from the ERC-8004 subgraph, or supplied by you for your own agent).

**How to get these field values.** For your own agent, you already have them. For a third-party agent, read its ERC-8004 registration record — name, description, image, and web endpoint — from any ERC-8004 data provider; see the directory of tools at [8004.org/build](http://8004.org/build). Reliable options include [8004scan.io](http://8004scan.io) and [agentscan.info](http://agentscan.info). Map `name`, `description`, and `image` straight across. For `url`, use the agent's human-facing web/homepage endpoint from the registration record — the service whose purpose is the web endpoint, not its MCP or A2A endpoint. If no human-facing web endpoint is present, fall back to `https://8004scan.io/agents/{chainId}/{tokenId}`. (Recipe note: this fallback string is part of the frozen recipe — it is an identifier first, a URL second.) (MCP and A2A endpoints are captured separately as capability metadata, not as the Atom `url`.) Then apply the normalization and fallbacks below.

**Client setup (used by every write snippet in this guide).** Every write snippet builds `const config = { walletClient, publicClient, address }` and passes it as the first argument. `address` is the **MultiVault contract address** for your target network — it is _not_ your wallet address. Passing a wallet address fails at gas simulation with an unhelpful revert. The clients are standard viem clients pointed at the Intuition network; the SDK exports the chain objects and a contract-address lookup:

```typescript
import { createWalletClient, createPublicClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import {
  intuitionTestnet,
  getMultiVaultAddressFromChainId,
} from '@0xintuition/sdk'; // intuitionMainnet for production

const account = privateKeyToAccount(process.env.PRIVATE_KEY);
const publicClient = createPublicClient({
  chain: intuitionTestnet,
  transport: http(),
});
const walletClient = createWalletClient({
  account,
  chain: intuitionTestnet,
  transport: http(),
});
const address = getMultiVaultAddressFromChainId(intuitionTestnet.id); // MultiVault contract — NOT your wallet
const config = { walletClient, publicClient, address };
```

The resolved addresses match the MultiVault constants in Appendix B (`0x6E35cF57…` mainnet, `0x2Ece8D4d…` testnet).

**Use this exact derivation — the same source fields must produce the same Atom ID as Intuition's ingestion, or your agent splits into a duplicate.** Reproduce the normalization and fallbacks below verbatim:

```typescript
import {
  configureSdk,
  pinThing,
  createAtomFromIpfsUri,
} from '@0xintuition/sdk';
import { parseEther } from 'viem';

// Configure the SDK once. pinThing and createAtomFromIpfsUri then send your partner apikey automatically.
configureSdk({ pinApiKey: process.env.INTUITION_PIN_API_KEY });

// Derive the four pinThing fields using the canonical Intuition planning recipe.
function normalizeText(value?: string | null): string | null {
  if (typeof value !== 'string') return null;
  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
}

const agentKey = `${chainId}:${tokenId}`;
const thing = {
  name: normalizeText(registrationFile.name) ?? `Agent ${agentKey}`,
  description:
    normalizeText(registrationFile.description) ?? `ERC-8004 agent ${agentKey}`,
  image: normalizeText(registrationFile.image) ?? '',
  url:
    normalizeText(registrationFile.webEndpoint) ??
    `https://8004scan.io/agents/${chainId}/${tokenId}`,
};

// pinThing pins the canonical JSON and returns a deterministic ipfs:// URI (identical fields -> identical URI).
const agentUri = await pinThing(thing);
const { state } = await createAtomFromIpfsUri(
  { walletClient, publicClient, address },
  agentUri,
  parseEther('0.001'),
);
const agentAtomId = state.termId; // canonical agent Atom ID
```

You supply the four field **values**; the pinning service canonicalizes the JSON server-side, so two creators who pass identical normalized values get an identical `ipfs://` URI and therefore an identical Atom ID. Your only job is to reproduce these values exactly. The rule is not "any plausible metadata for this agent" — it is "the same planned values produce the same Atom ID." Alternate values produce a different Atom hash even when they describe the same ERC-8004 agent; the `same as` anchor (Step B) is what lets consumers and Preflight reconcile such variants.

### Step B — Mint the ERC-8004 identity anchor (the `same as` edge)

This is the 8004 identity anchor. Use the canonical `createTripleStatement(config, { args, value })` shape here.

This links your agent Atom to its canonical ERC-8004 NFT identity, and it is what the Preflight query matches on. The object is a `pinThing` Atom whose `name` is the exact CAIP identity string:

```text
eip155:{chainId}/erc721:0x8004A169FB4a3325136EB29fA0ceB6D2e539a432/{tokenId}
```

```typescript
const config = { walletClient, publicClient, address };

// Object: a pinThing Atom whose display name is the exact CAIP identity string.
const caipId = `eip155:${chainId}/erc721:0x8004A169FB4a3325136EB29fA0ceB6D2e539a432/${tokenId}`;
const identityObjectUri = await pinThing({
  name: caipId,
  description:
    'CAIP-style external identifier atom for linking an Intuition atom to an ERC-8004 registry identity.',
  image: '',
  url: '',
});
const identityObjectAtomId = (
  await createAtomFromIpfsUri(config, identityObjectUri, parseEther('0.001'))
).state.termId;

// Predicate: the canonical `same as` term ID (see Appendix B).
// This ID is identical on mainnet and testnet — the same constant works on both networks.
const sameAsPredicateId =
  '0xbeebfb7d177cbd96ffc239d2196c72ec346efe81f39dc595773f13d83506f5f0';

// createTripleStatement takes (config, { args, value }); there is no single-object overload.
const tripleDeposit = parseEther('0.001');
const tripleCost = await multiVaultGetTripleCost({ publicClient, address });
const assets = tripleCost + tripleDeposit;

await createTripleStatement(config, {
  args: [[agentAtomId], [sameAsPredicateId], [identityObjectAtomId], [assets]],
  value: assets,
});
```

:::info

**The ERC-8004 Identity Registry is the same address on every EVM chain:** `0x8004A169FB4a3325136EB29fA0ceB6D2e539a432` (deterministic deploy). Only `{chainId}` and `{tokenId}` vary. Common chain IDs: Ethereum `1`, Base `8453`, BNB Chain `56`, Polygon `137`, Arbitrum `42161`, Optimism `10`, Avalanche `43114`, Linea `59144`, Scroll `534352`. Full list: [8004scan.io/networks](http://8004scan.io/networks). Solana is non-EVM and out of scope for this CAIP format.

:::

These snippets use the `@0xintuition/sdk` helpers — see the [SDK pinning guide](/docs/intuition-sdk/integrations/pinata-ipfs) for setup (`configureSdk({ pinApiKey })`) and full signatures.

### Step C — Classification Triples

A net-new agent is "valid" with the identity Atom plus the three **required** Triples below. Everything under _Recommended_ enriches discovery but isn't required for the trust pattern to work.

**Required (the identity floor):**

| Triple                                 | Purpose                                            |
| -------------------------------------- | -------------------------------------------------- |
| `(agent, same as, eip155:…/{tokenId})` | ERC-8004 identity anchor (Step B) — the dedupe key |
| `(agent, has type, AIAgent)`           | Classifies the Atom as an agent                    |
| `(agent, implement, ERC-8004)`         | Asserts ERC-8004 compliance                        |

**Recommended (discovery richness — the same enrichment Intuition's ingestion applies):**

| Triple                                                      | Source field             |
| ----------------------------------------------------------- | ------------------------ |
| `(agent, available on, {chain})`                            | registration chain       |
| `(agent, created by, {owner address})`                      | `registrationFile` owner |
| `(agent, has type, MCP Server)` / `(agent, use, MCP)`       | endpoints                |
| `(agent, has type, A2A Agent)` / `(agent, use, A2A)`        | endpoints                |
| `(agent, has tag, x402)` • `(agent, compatible with, x402)` | `x402Support`            |
| `(agent, has tag, {oasf skill})`                            | `oasfSkills`             |
| `(agent, has category, {oasf domain})`                      | `oasfDomains`            |
| `(agent, has tag, {trust model})`                           | `supportedTrusts`        |

:::tip

**OASF skills and domains — use the canonical atoms.** OASF is the [Open Agentic Schema Framework](https://github.com/agntcy/oasf) — the taxonomy ERC-8004 registration files draw their skill and domain slugs from (137 skill slugs, 205 domain slugs; browsable at [schema.oasf.outshift.com](http://schema.oasf.outshift.com)). On Intuition, canonical skill/domain atoms are identified by their term IDs in **Appendix B**, not by name. Naming varies for historical reasons: newer taxonomy atoms are named by their full slug path (e.g. `analytical_skills/data_analysis`), while some older ingestion atoms are named by the bare leaf — and leaf names collide across branches (two different `search` skills exist). Never resolve taxonomy atoms by label; resolve them from the Appendix B tables. Canonical atom IDs for the in-use vocabulary, plus their `has category` hierarchy, are published in **Appendix B — Canonical object atoms**. Resolve there before minting; only mint a new skill/domain atom if its slug is not listed, and name it with the full slug path.

:::

:::tip

**Owner atoms — exact recipe.** The object of `(agent, created by, {owner})` is a pinned **Thing**, not an account atom — all 98 indexed mainnet agents use this construction, and it is fully reproducible. The same recipe-derived owner atoms also exist on testnet as of 2026-07-08 (mirrored with identical IDs), so pin-convergence holds on both networks; testnet's original ingestion additionally left older, differently-constructed owner atoms alongside — those are superseded. Pin a Thing with exactly these four fields (address lowercased), then mint via `createAtomFromIpfsUri`:

```json
{
  "name": "{owner address, lowercase, e.g. 0xf9d1d63f362bbf1ee08ab9acb36fe74afc48d5f1}",
  "description": "Wallet address atom observed in ERC-8004 registry data.",
  "image": "",
  "url": ""
}
```

Note `image` and `url` are empty strings here — this differs from the OASF taxonomy recipe's `"image": "null"` in Appendix B; each canonical family must be reproduced with its own exact bytes. As with every canonical construction, pin first and resolve the returned URI against the graph before minting — if the owner atom already exists, use it. Do **not** use the SDK's `createAtomFromEthereumAccount` for this edge: it creates a protocol account atom — a different construction with a different atom ID — which splits the owner's signal away from the atoms the indexed cohort already points at.

:::

**Worked example — Captain Dackie, fully attached.** Concrete Object values for every Triple (values below the identity floor are illustrative; use the agent's real registration data):

| Triple                                                      | Example Object value                                                                                                              |
| ----------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `(agent, same as, …)`                                       | `eip155:8453/erc721:0x8004A169FB4a3325136EB29fA0ceB6D2e539a432/1380`                                                              |
| `(agent, has type, AIAgent)`                                | `AIAgent`                                                                                                                         |
| `(agent, implement, ERC-8004)`                              | `ERC-8004`                                                                                                                        |
| `(agent, available on, {chain})`                            | `Base`                                                                                                                            |
| `(agent, created by, {owner})`                              | `0xf9d1d63f362bbf1ee08ab9acb36fe74afc48d5f1` (registration-file owner, lowercased — pinned Thing per the owner-atom recipe above) |
| `(agent, has type, MCP Server)` / `(agent, use, MCP)`       | from `mcpEndpoint`                                                                                                                |
| `(agent, has type, A2A Agent)` / `(agent, use, A2A)`        | from `a2aEndpoint`                                                                                                                |
| `(agent, has tag, x402)` / `(agent, compatible with, x402)` | `x402` (if x402 supported)                                                                                                        |
| `(agent, has tag, {oasf skill})`                            | e.g. `tool_interaction/blockchain_interaction` (full slug path — see Appendix B)                                                  |
| `(agent, has category, {oasf domain})`                      | e.g. `technology/blockchain` (full slug path — see Appendix B)                                                                    |
| `(agent, has tag, {trust model})`                           | e.g. `reputation`                                                                                                                 |

**Attaching them in code.** Each enrichment Triple is one `createTripleStatement` call. The object Atom is created like any other — pin its metadata, mint from the URI:

```typescript
// Reuse canonical object + predicate term IDs from Appendix B. Do NOT mint your own
// 'Base'/'AIAgent'/etc. Atoms - a differently-pinned object is a different node and
// fragments the graph. Only mint new Atoms for genuinely novel objects (e.g. custom tags).
const config = { walletClient, publicClient, address };
const tripleDeposit = parseEther('0.001');
const tripleCost = await multiVaultGetTripleCost({ publicClient, address });
const assets = tripleCost + tripleDeposit;

// Object + predicate term IDs from Appendix B (mainnet).
const availableOnPredicateId =
  '0xa974ce85010776bb6eb81e4492bdb8712f127aa75ae737f02cbe80e72409f7d3';
const baseAtomId =
  '0x3a9975dff190314abfb2f36b2a6c42775fc024bae587e7cdc17528465453655f'; // community 'Base' atom (25,770 stakers) — canonical by adoption; see Appendix B

// One row per classification/enrichment edge - same (config, { args, value }) shape as Step B.
const classification = [
  [agentAtomId, availableOnPredicateId, baseAtomId], // (agent, available on, Base)
  // [agentAtomId, hasTypePredicateId, aiAgentAtomId],     // (agent, has type, AIAgent)
  // [agentAtomId, compatibleWithPredicateId, x402AtomId], // (agent, compatible with, x402)
  // ...one row per capability the registration supports
];

for (const [subjectId, predicateId, objectId] of classification) {
  await createTripleStatement(config, {
    args: [[subjectId], [predicateId], [objectId], [assets]],
    value: assets,
  });
}
```

Resolve predicate IDs (`available on`, `has tag`, `has category`, …) once from the canonical term IDs in Appendix B, then reuse them across agents.

**Read the classification edges back.** Confirm everything attached to the agent:

```graphql
query AgentClassification($agentId: String!) {
  atom(term_id: $agentId) {
    term_id
    label
    as_subject_triples(
      where: {
        predicate: {
          label: {
            _in: [
              "same as"
              "has type"
              "implement"
              "available on"
              "created by"
              "use"
              "has tag"
              "has category"
              "compatible with"
            ]
          }
        }
      }
    ) {
      predicate {
        label
      }
      object {
        term_id
        label
        value {
          thing {
            name
          }
        }
      }
    }
  }
}
```

```json
{
  "agentId": "0x45078ae569def2264355f77e592028dd6f1f5d6373c204fe82bf3141ab1861fb"
}
```

Each row in `as_subject_triples` is one classification edge; together they are the agent's full profile in the graph.

### Verify you matched our process

Before you mint at scale, confirm your recipe converges with Intuition's: pick an agent that is **already** in the indexed cohort, derive its `agentAtomId` locally with Step A, then run the Preflight query for that agent and check that your derived ID equals the `subject.term_id` Preflight returns. If they match, your derivation is byte-for-byte aligned with our ingestion and you can mint net-new agents with confidence. If they don't, re-check your field normalization before writing any Triples.

Once the identity Atom + required Triples exist, proceed to **The core write pattern** (the four-Triple trust assessment) exactly as for a pre-indexed agent — your `agentAtomId` is the subject.

---

## Worked example: end-to-end integration

Publishing a trust assessment for Captain Dackie under a fictional provider, _Example Trust Provider_.

:::info

**Prerequisite:** Steps 1–2 pin metadata through the gated pinning service, so you need your Intuition API key first. You can request one here: [API key request form](https://forms.gle/7mhm55dFQzvyBLyG9) — see **The Partner Pinning API** above.

:::

:::note

The snippets below use the `@0xintuition/sdk`. Call `configureSdk({ pinApiKey })` once so `pinThing` and `createAtomFromThing` send your partner key automatically. Full setup and signatures: [SDK pinning guide](/docs/intuition-sdk/integrations/pinata-ipfs).

:::

### Preflight — Resolve the canonical agent Atom (dedupe check)

Before you create anything, confirm whether an Atom for the agent identity already exists. Atom IDs are deterministic, but a single-character difference in the input produces a different ID — so matching by **name** will not reliably block duplicate identities. Use the agent's **ERC-8004 identity edge** (`same as` → CAIP-style identity object) as the canonical dedupe check, and reuse the returned `subject.term_id` as the agent Atom. Name lookup is acceptable only as a human fallback. The query matches on the pinned metadata's `name` rather than the indexer-derived `label`, which is robust to occasional indexer label gaps.

```graphql
query FindAgentByERC8004Identity(
  $sameAsPredicateId: String!
  $caipId: String!
) {
  triples(
    where: {
      predicate_id: { _eq: $sameAsPredicateId }
      object: { value: { thing: { name: { _eq: $caipId } } } }
    }
    limit: 1
  ) {
    term_id
    subject {
      term_id
      label
      value {
        thing {
          name
          image
          url
        }
      }
    }
    predicate {
      term_id
      label
    }
    object {
      term_id
      label
      data
      value {
        thing {
          name
          url
        }
      }
    }
  }
}
```

Variables for the Captain Dackie reference agent:

```json
{
  "sameAsPredicateId": "0xbeebfb7d177cbd96ffc239d2196c72ec346efe81f39dc595773f13d83506f5f0",
  "caipId": "eip155:8453/erc721:0x8004A169FB4a3325136EB29fA0ceB6D2e539a432/1380"
}
```

If the query returns a Triple, use its `subject.term_id` as the canonical agent Atom — for Captain Dackie that resolves to `0x45078ae569def2264355f77e592028dd6f1f5d6373c204fe82bf3141ab1861fb` — and skip creating a new agent Atom. If it returns nothing, the agent isn't indexed yet: create the agent Atom and link it via `same as` to its ERC-8004 identity before proceeding — see **Adding an agent that isn't in the indexed cohort** above for the exact recipe.

### Step 1 — Create your provider identity Atom

```typescript
import { configureSdk, createAtomFromThing } from '@0xintuition/sdk';
import { parseEther } from 'viem';

// Configure once — createAtomFromThing pins your metadata and sends your apikey automatically.
configureSdk({ pinApiKey: process.env.INTUITION_PIN_API_KEY });

// Pin provider metadata to IPFS and create the Atom in one call.
const provider = await createAtomFromThing(
  { walletClient, publicClient, address },
  {
    name: 'Example Trust Provider',
    description: 'Multi-dimensional ERC-8004 agent trust scoring.',
    image: 'https://provider.example/logo.svg',
    url: 'https://provider.example',
  },
  { depositAmount: parseEther('0.001') },
);
const providerAtomId = provider.state.termId; // reuse for every agent you assess
console.log('IPFS URI:', provider.uri); // ipfs://… (the pinned schema.org Thing)
```

Do this once. Reuse `providerAtomId` for every agent you assess.

### Step 2 — Create the assessment-source Atom

```typescript
const captainDackieChainId = 8453;
const captainDackieTokenId = '1380';

const resolverUrl =
  `https://provider.example/.well-known/intuition/erc8004/` +
  `agents/${captainDackieChainId}/${captainDackieTokenId}/trust-assessment.json`;

// Pin the assessment-source metadata and create its Atom in one call.
const source = await createAtomFromThing(
  { walletClient, publicClient, address },
  {
    name: 'Example Trust Provider — Captain Dackie assessment',
    description: 'Live trust assessment for Captain Dackie.',
    image: 'https://provider.example/logo.svg',
    url: resolverUrl,
  },
  { depositAmount: parseEther('0.001') },
);
const sourceAtomId = source.state.termId;
```

Do this once per assessed agent (or once per assessment class, depending on how you organize). The resolver URL is the stable handle consumers will follow.

### Step 3 — Write the four Triples

```typescript
import {
  createTripleStatement,
  multiVaultGetTripleCost,
} from '@0xintuition/sdk';
import { parseEther } from 'viem';

const captainDackieAtomId =
  '0x45078ae569def2264355f77e592028dd6f1f5d6373c204fe82bf3141ab1861fb';
// Canonical Trust Assessment Source atom — identical on testnet + mainnet (see Appendix B).
const trustAssessmentSourceTypeAtomId =
  '0xf8a0ea34c8e7195b63d1641141166cc56e9128e25cf8c9f68ac6b81527b78f07';

// Predicate term IDs from Appendix B (mainnet). The trust-pattern IDs are identical on testnet.
const hasTrustProviderPredicateId =
  '0xdc3c5639b39f9b6553b75b37c47fa4810961392b28956234ba9f401a98f43888';
const hasTrustAssessmentPredicateId =
  '0x7f455fb041f766c3f24552db4c943888c6778c2475d4f2d434b84ad03298457c';
const providedByPredicateId =
  '0x9a310b5ca895009792e5b1dc0131539f36c054e8e32987989367ec73a1a3ef19';
const hasTypePredicateId =
  '0xa632a94306ab1d56911cff8c06473659a7caa2dfec6de3921bc23ec8ebf96ced';

const tripleDeposit = parseEther('0.001');
const tripleCost = await multiVaultGetTripleCost({ publicClient, address });
const assets = tripleCost + tripleDeposit;

const trustTriples = [
  [captainDackieAtomId, hasTrustProviderPredicateId, providerAtomId],
  [captainDackieAtomId, hasTrustAssessmentPredicateId, sourceAtomId],
  [sourceAtomId, providedByPredicateId, providerAtomId],
  [sourceAtomId, hasTypePredicateId, trustAssessmentSourceTypeAtomId],
] as const;

for (const [subjectId, predicateId, objectId] of trustTriples) {
  await createTripleStatement(config, {
    args: [[subjectId], [predicateId], [objectId], [assets]],
    value: assets,
  });
}
```

The four Triples close the graph shell. From this point forward, you maintain only the JSON.

### Step 4 — Publish the JSON document

```bash
# Whatever your hosting is — S3, Cloudflare R2, your own server.
# The contract with consumers is: the URL is stable and the JSON is current.

curl -X PUT https://provider.example/.well-known/intuition/erc8004/agents/8453/1380/trust-assessment.json \
  -H "Content-Type: application/json" \
  --data-binary @captain-dackie.json
```

Update this JSON whenever your score changes. The graph stays exactly as it is. Consumers re-fetch the URL when they need the latest assessment.

### Step 5 — Verify

```graphql
# query example for Captain Dackie
# won't return results since no matches are found (no trust providers added yet)

query AgentTrustSurface($agentId: String!) {
  atom(term_id: $agentId) {
    term_id
    label
    as_subject_triples(
      where: {
        predicate: {
          label: { _in: ["has trust provider", "has trust assessment"] }
        }
      }
    ) {
      term_id
      predicate {
        label
      }
      object {
        term_id
        label
        data
        value {
          thing {
            name
            description
            url
          }
        }
      }
    }
  }
}

# variables (Captain Dackie's term_id)

{
  "agentId": "0x45078ae569def2264355f77e592028dd6f1f5d6373c204fe82bf3141ab1861fb"
}
```

Run against the mainnet GraphQL endpoint — the variables block above already points at Captain Dackie. Once your Triples land, you should see your provider on `has trust provider` and your assessment-source Atom on `has trust assessment`. Read each resolver URL from `object.value.thing.url` (the parsed Thing metadata) — not from `object.data`, which holds the pinned `ipfs://…` URI for the Atom, not the resolver URL.

:::tip

**Future enhancement — provider authenticity.** Today, anyone can publish an assessment under any provider name; the practical gate is the resolver URL you control. A natural next step is for each provider to publicly prove that the attestor address writing its Triples is one it controls (for example, a signed statement linking provider identity to signer address). Not required for V1, but on the roadmap for hardening provider trust.

:::

---

## Query guide — what you get back

The write pattern earns its keep on the read side. Every provider publishes the same four-Triple shell, so one set of queries covers the entire trust layer — a consumer integrates the pattern once and reads every provider through it. The four reads below map to the four questions in the opening section, each with the response shape it returns.

:::note

Query shapes follow the same conventions as the Step 5 verification query. These reads use predicate **labels** for readability and select only the structural fields. **\$TRUST stake / market data comes back only when you explicitly select it** — see the production variant under Read 1 (and Read 4) for the market-bearing fields. For a production consumer, filter root `triples` by `subject_id` + `predicate_id` and switch label matching to the predicate `term_id`s published in Appendix B (label matching is ambiguous for some predicates on mainnet). Confirm exact field names against the current mainnet GraphQL schema before shipping.

:::

### Read 1 — One agent's full trust surface

_Who is scoring this agent, and where do their live assessments resolve?_

```graphql
query AgentTrustSurface($agentId: String!) {
  atom(term_id: $agentId) {
    term_id
    label
    as_subject_triples(
      where: {
        predicate: {
          label: { _in: ["has trust provider", "has trust assessment"] }
        }
      }
    ) {
      term_id
      predicate {
        label
      }
      object {
        term_id
        label
        data
        value {
          thing {
            name
            description
            url
          }
        }
      }
    }
  }
}
```

```json
{
  "data": {
    "atom": {
      "term_id": "0x4507…61fb",
      "label": "Captain Dackie",
      "as_subject_triples": [
        {
          "predicate": { "label": "has trust provider" },
          "object": {
            "term_id": "0x8f3a…c21d",
            "label": "Example Trust Provider",
            "data": "ipfs://bafkreid2x…q9af",
            "value": {
              "thing": {
                "name": "Example Trust Provider",
                "description": "Multi-dimensional ERC-8004 agent trust scoring.",
                "url": "https://provider.example"
              }
            }
          }
        },
        {
          "predicate": { "label": "has trust assessment" },
          "object": {
            "term_id": "0xb71e…944a",
            "label": "Example Trust Provider — Captain Dackie assessment",
            "data": "ipfs://bafkreih7m…k3lp",
            "value": {
              "thing": {
                "name": "Example Trust Provider — Captain Dackie assessment",
                "description": "Live trust assessment for Captain Dackie.",
                "url": "https://provider.example/.well-known/intuition/erc8004/agents/8453/1380/trust-assessment.json"
              }
            }
          }
        },
        {
          "predicate": { "label": "has trust provider" },
          "object": {
            "term_id": "0x2d90…77e1",
            "label": "Demo Risk Labs",
            "data": "ipfs://bafkreia4n…w8rc",
            "value": {
              "thing": {
                "name": "Demo Risk Labs",
                "url": "https://demorisk.example"
              }
            }
          }
        },
        {
          "predicate": { "label": "has trust assessment" },
          "object": {
            "term_id": "0x66cf…1b08",
            "label": "Demo Risk Labs — Captain Dackie assessment",
            "data": "ipfs://bafkreif6t…b1qd",
            "value": {
              "thing": {
                "name": "Demo Risk Labs — Captain Dackie assessment",
                "url": "https://demorisk.example/.well-known/intuition/erc8004/agents/8453/1380/trust-assessment.json"
              }
            }
          }
        }
      ]
    }
  }
}
```

This is the same query you run to verify your own write in Step 5. Every provider that has published on this agent lands in the one response, in the same shape regardless of who they are — a wallet or marketplace can render a full trust panel from this single query. On each `object`, `data` is the pinned `ipfs://…` URI, while the human-readable `name` and the live resolver `url` come from `value.thing`. Follow `value.thing.url` to fetch the assessment document — not `data`.

**Production variant — Read 1 with \$TRUST market data.** The labeled query above is fine while the trust predicate IDs are unpublished. For a production consumer, filter root `triples` by `subject_id` + `predicate_id` and select the market fields you need. This shape was verified on mainnet against the `same as` + `has tag` predicate IDs — swap in the `has trust provider` / `has trust assessment` `term_id`s from Appendix B:

```graphql
query AgentTrustSurface($agentId: String!, $predicateIds: [String!]) {
  triples(
    where: {
      subject_id: { _eq: $agentId }
      predicate_id: { _in: $predicateIds }
    }
    order_by: { term: { total_market_cap: desc } }
  ) {
    term_id
    predicate {
      term_id
      label
    }
    object {
      term_id
      label
      data
      value {
        thing {
          name
          description
          image
          url
        }
      }
    }
    term {
      total_market_cap
      total_assets
      vaults(where: { curve_id: { _eq: "1" } }, limit: 1) {
        market_cap
        total_assets
        total_shares
        current_share_price
        position_count
      }
    }
    counter_term {
      total_market_cap
      total_assets
      vaults(where: { curve_id: { _eq: "1" } }, limit: 1) {
        market_cap
        total_assets
        total_shares
        current_share_price
        position_count
      }
    }
  }
}
```

`term` carries the support-side market; `counter_term` carries the opposition side. `triple_vaults` (used in Read 4) is also valid for market ranking, but its schema exposes `market_cap`, `total_assets`, `total_shares`, and `position_count` — not `current_share_price`.

### Read 2 — Every assessment in the graph, from one predicate

_Query a single predicate and get back the full assessment surface across all agents and providers._

```graphql
query AllTrustAssessments {
  triples(where: { predicate: { label: { _eq: "has trust assessment" } } }) {
    subject {
      term_id
      label
    }
    object {
      label
      data
      value {
        thing {
          url
        }
      }
    }
  }
}
```

```json
{
  "data": {
    "triples": [
      {
        "subject": { "term_id": "0x4507…61fb", "label": "Captain Dackie" },
        "object": {
          "label": "Example Trust Provider — Captain Dackie assessment",
          "data": "ipfs://bafkreih7m…k3lp",
          "value": {
            "thing": {
              "url": "https://provider.example/.well-known/intuition/erc8004/agents/8453/1380/trust-assessment.json"
            }
          }
        }
      },
      {
        "subject": { "term_id": "0x9c2e…07aa", "label": "AgentX" },
        "object": {
          "label": "Demo Risk Labs — AgentX assessment",
          "data": "ipfs://bafkreif6t…b1qd",
          "value": {
            "thing": {
              "url": "https://demorisk.example/.well-known/intuition/erc8004/agents/8453/2041/trust-assessment.json"
            }
          }
        }
      }
    ]
  }
}
```

Resolving each object's `value.thing.url` returns the provider's live document — `"score": 87` for one agent, `"score": 64` for the next, plus dimensions, freshness, and evidence. (`data` holds the pinned `ipfs://…` URI; read the live resolver URL from `value.thing.url`.) One predicate query plus URL fetches gives you a live, cross-provider score feed: aggregated risk dashboards, agent leaderboards, and routing logic all start from this read.

### Read 3 — A provider's full coverage map

_Which agents has this provider assessed?_

```graphql
query ProviderCoverage($providerId: String!) {
  triples(
    where: {
      predicate: { label: { _eq: "has trust provider" } }
      object_id: { _eq: $providerId }
    }
  ) {
    subject {
      term_id
      label
    }
  }
}
```

```json
{
  "data": {
    "triples": [
      { "subject": { "term_id": "0x4507…61fb", "label": "Captain Dackie" } },
      { "subject": { "term_id": "0x9c2e…07aa", "label": "AgentX" } },
      { "subject": { "term_id": "0x1f44…3c5b", "label": "AgentY" } }
    ]
  }
}
```

This is your public footprint in the graph. Integrators evaluating providers see your coverage instantly — and it grows with every agent you assess.

### Read 4 — Provider credibility as a market signal

_Whose opinion does the ecosystem actually back on this agent?_ Each `has trust provider` Triple is itself a vault. Take the `term_id` values of those Triples from Read 1 and read their vaults:

```graphql
query ProviderCredibility($tripleIds: [String!]) {
  triple_vaults(
    where: { term_id: { _in: $tripleIds } }
    order_by: { market_cap: desc }
  ) {
    term_id
    total_assets
    market_cap
    position_count
  }
}
```

```json
{
  "data": {
    "triple_vaults": [
      {
        "term_id": "0xaa12…40ce",
        "total_assets": "412600000000000000000",
        "market_cap": "498100000000000000000",
        "position_count": 38
      },
      {
        "term_id": "0x77fe…b913",
        "total_assets": "97100000000000000000",
        "market_cap": "112400000000000000000",
        "position_count": 9
      }
    ]
  }
}
```

Sorted by market cap, this is a market-weighted ranking of the providers on this agent — the stake behind each `has trust provider` Triple is the ecosystem's running answer to which opinions deserve weight. Read 1 tells a consumer who has weighed in; this read tells them who to believe.

---

## Canonical SDK write shape

Use `createTripleStatement`, not `createTriple`. Triple writes take arrays of term IDs plus an `assets[]` array. The `assets` value must include the current triple cost plus the deposit you want to stake.

```typescript
import {
  configureSdk,
  createTripleStatement,
  multiVaultGetTripleCost,
} from '@0xintuition/sdk';
import { parseEther } from 'viem';

configureSdk({ pinApiKey: process.env.INTUITION_PIN_API_KEY });

const config = { walletClient, publicClient, address };
const deposit = parseEther('0.001');
const tripleCost = await multiVaultGetTripleCost({ publicClient, address });
const assets = tripleCost + deposit;

await createTripleStatement(config, {
  args: [[subjectId], [predicateId], [objectId], [assets]],
  value: assets,
});
```

For multiple Triples from one wallet, write sequentially unless you are using a reviewed batch helper:

```typescript
for (const [subjectId, predicateId, objectId] of triples) {
  await createTripleStatement(config, {
    args: [[subjectId], [predicateId], [objectId], [assets]],
    value: assets,
  });
}
```

## Resolving term IDs

Triple writes require existing term IDs. Use term IDs returned by Atom creation for provider/source Atoms, the published canonical predicate constants (identical on both networks, except `has tag`, which is per-network) for predicates such as `same as`, and GraphQL lookups for any labels you have not pinned in config.

Do not silently choose the first label match. Labels can be duplicated, so a resolver should reject zero or multiple matches:

```typescript
async function resolveUniqueAtomTermId(label: string, endpoint: string) {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      query: `
        query ResolveAtom($label: String!) {
          atoms(where: { label: { _eq: $label } }, limit: 2) {
            term_id
            label
          }
        }
      `,
      variables: { label },
    }),
  });

  const json = await response.json();
  const atoms = json.data?.atoms ?? [];

  if (atoms.length !== 1) {
    throw new Error(
      `Expected one atom labeled "${label}", found ${atoms.length}`,
    );
  }

  return atoms[0].term_id;
}
```

For canonical predicates and objects, prefer the documented Appendix B network constants instead of label lookup: many labels resolve to multiple atoms and will make this resolver throw. On mainnet that includes `Base`, `has tag`, `use`, and `implement`; on testnet it now includes every classification predicate and object (`same as`, `has type`, `implement`, `available on`, `created by`, `use`, `has category`, `compatible with`, `AIAgent`, `ERC-8004`, `Base`, `has tag`) plus all four trust-pattern terms (`has trust provider`, `has trust assessment`, `provided by`, `Trust Assessment Source`), because the canonical atoms were replicated onto testnet alongside pre-existing duplicate-label atoms.

## Partner Requirements Checklist

What you need to ship a working integration.

- [ ] **Runnable package versions** — use `@0xintuition/sdk@^3.0.1`, `@0xintuition/graphql@^3.0.1` if importing GraphQL constants directly, and `viem`.
- [ ] **Intuition pinning API key** for the gated pinning service, requested from the Business Development team and supplied as the `apikey` header. With the SDK, call `configureSdk({ pinApiKey })` once before `pinThing` / `createAtomFromThing`.
- [ ] **Funded wallet on the target network** — writes require gas and TRUST/tTRUST. Use a funded testnet wallet for dry-runs before mainnet.
- [ ] **Agent Atom resolved** — run Preflight to reuse the canonical agent Atom. If Preflight returns a hit, skip Steps A-C and go straight to the trust-pattern write. If the agent isn't in the indexed cohort, mint it and link it to its ERC-8004 identity with the canonical `same as` predicate (`0xbeebfb7d177cbd96ffc239d2196c72ec346efe81f39dc595773f13d83506f5f0`, identical on both networks).
- [ ] **Term IDs resolved before triple writes** — `createTripleStatement` requires subject, predicate, and object `term_id` values. It does not accept labels or names.
- [ ] **Provider identity Atom** created via `pinThing` / `createAtomFromThing`, with stable name, description, URL, and logo.
- [ ] **Assessment-source Atom** created per assessed agent (or per assessment class), with the stable resolver URL in metadata.
- [ ] **Triple cost/value math included** — fetch `multiVaultGetTripleCost`, set each `assets[]` entry to `tripleCost + deposit`, and pass the same amount as `value` for a single triple write.
- [ ] **Four trust Triples written sequentially** — `(agent, has trust provider, provider)`, `(agent, has trust assessment, source)`, `(source, provided by, provider)`, `(source, has type, Trust Assessment Source)`. Do not fire same-wallet writes with `Promise.all`; send them sequentially unless using a reviewed batch helper.
- [ ] **Stable resolver URL** following the `/.well-known/intuition/erc8004/agents/{chainId}/{tokenId}/trust-assessment.json` convention.
- [ ] **JSON document** at that URL with required fields populated and a refresh process behind it.
- [ ] **Signature / attestation strategy** if your assessments are compliance-sensitive or need cryptographic verification (EIP-712 recommended).

---

## What you get back

### Composability across providers

Multiple providers coexist on the same agent. There is no winner-takes-all reputation registry. A single agent can carry `has trust provider` edges to a security-oriented provider, a yield-quality provider, and a uptime-monitoring provider all at once. Consumers slice by provider and by dimension.

### Stakeable signal on provider credibility

The `(agent, has trust provider, provider)` Triple is itself a vault. Consumers who agree that _this provider's opinion about this agent matters_ can stake on the Triple. TVL on `has trust provider` becomes the market-aggregated signal of which providers are credible on which agents. This is the layer ERC-8004's Reputation Registry alone does not produce.

### Stable consumer query shape

Because every provider uses the same four-Triple shell, consumer queries are identical across all providers. A single GraphQL query against an agent returns every provider that has weighed in, every assessment source, and every resolver URL — without consumers needing to know any individual provider's schema.

---

## Appendix A — Writing immutable data directly

For stable structural facts about an agent — capability declarations, supported protocols, chains of operation — you can write Triples directly into the graph without the pinThing-pointer pattern. The underlying fact isn't mutable, so the staking-surface fragmentation problem doesn't apply.

**Use this for:**

- Capability declarations (`has tag, {OASF skill}` — resolve the skill atom from Appendix B; this is the same pattern the indexed cohort uses)
- Protocol / standard use (`use, A2A` · `use, MCP` · `use, OASF`)
- Operating chain (`available on, Base`)
- Payment compatibility (`compatible with, x402`)
- ERC-8004 implementation (`implement, ERC-8004`)
- Authorship / provenance (`created by, AgentFramework`)

**Do not use this for:**

- Scores, ratings, risk levels
- Anything with a freshness window
- Anything you'd want to revoke

Worked example — declaring that Captain Dackie uses the A2A protocol:

```typescript
import {
  createTripleStatement,
  multiVaultGetTripleCost,
} from '@0xintuition/sdk';
import { parseEther } from 'viem';

const deposit = parseEther('0.001');
const tripleCost = await multiVaultGetTripleCost({ publicClient, address });
const assets = tripleCost + deposit;

// Triple writes use term IDs, not labels. Resolve and pin canonical IDs first.
await createTripleStatement(config, {
  args: [[captainDackieAtomId], [usePredicateId], [a2aAtomId], [assets]],
  value: assets,
});
```

`createTripleStatement` is the SDK write helper. It takes the raw MultiVault tuple arrays: `subjectIds[]`, `predicateIds[]`, `objectIds[]`, and `assets[]`. The `assets` value for each triple must include the current triple cost plus the deposit you want to stake. Resolve labels to term IDs before writing, and reject ambiguous label matches rather than silently choosing one.

### Predicate reference for stable 8004 facts

| Predicate         | Object type                   | Example                                                                                                                                                                                                                                                                                              |
| ----------------- | ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `is`              | `DefinedTerm`                 | `(AgentX, is, autonomous agent)`                                                                                                                                                                                                                                                                     |
| `has type`        | `DefinedTerm`                 | `(AgentX, has type, language-model)`                                                                                                                                                                                                                                                                 |
| `has tag`         | `DefinedTerm`                 | `(AgentX, has tag, multimodal)` · capability declarations use this predicate with a canonical OASF skill atom from Appendix B — e.g. `(AgentX, has tag, natural_language_processing/natural_language_generation/text_completion)`. There is no separate `has capability` predicate; do not mint one. |
| `use`             | `DefinedTerm`                 | `(AgentX, use, A2A)` · `(AgentX, use, MCP)`                                                                                                                                                                                                                                                          |
| `available on`    | `DefinedTerm` / chain Atom    | `(AgentX, available on, Base)`                                                                                                                                                                                                                                                                       |
| `compatible with` | `DefinedTerm`                 | `(AgentX, compatible with, x402)`                                                                                                                                                                                                                                                                    |
| `implement`       | `DefinedTerm` / standard Atom | `(AgentX, implement, ERC-8004)`                                                                                                                                                                                                                                                                      |
| `created by`      | `Organization` / `Person`     | `(AgentX, created by, OrgY)`                                                                                                                                                                                                                                                                         |
| `same as`         | ERC-8004 identity Atom        | `(AgentX, same as, erc8004:base/0x.../1380)`                                                                                                                                                                                                                                                         |

Full predicate catalog and entity-type guidance can be found in the [predicate-usage-by-entity-type](https://github.com/0xIntuition/intuition-data-structures/blob/main/predicates/2-predicate-usage-by-entity-type.md) doc.

Label matching is ambiguous on mainnet for some of these predicates (`has tag`, `use`, and `implement` all have duplicate label matches), so production writes and reads should resolve and pin the predicate `term_id` rather than matching by label.

:::danger

**Reminder:** If the fact you're writing could ever change, use the pinThing + JSON pattern from the main guide, not direct Triples. Immutable-write is for structural facts only.

:::

---

## Appendix B — Reference

**Mainnet integration constants**

- Network: Intuition mainnet (L3, chain ID 1155)
- RPC URL: `https://rpc.intuition.systems/http`
- GraphQL endpoint (reads): `https://mainnet.intuition.sh/v1/graphql`
- Pinning API (writes): `https://pin.intuition.systems/v1/graphql` — auth via `apikey` header; network-agnostic (same endpoint for testnet and mainnet)
- MultiVault contract: `0x6E35cF57A41fA15eA0EaE9C33e751b01A784Fe7e`
- Native token: TRUST (mainnet native gas token)
- Executor signer: `0xA1AbE59f1473887Ab40D4EcF43c43d780b1a7d22`
- Executor Atom: [0x3cb51c403a74e27a4f3c66514e0aa595337d22d86d25cb1588675ffc3df04f9a](https://portal.intuition.systems/explore/atom/0x3cb51c403a74e27a4f3c66514e0aa595337d22d86d25cb1588675ffc3df04f9a?tab=overview)
- Reference agent (Captain Dackie): [0x45078ae569def2264355f77e592028dd6f1f5d6373c204fe82bf3141ab1861fb](https://portal.intuition.systems/explore/atom/0x45078ae569def2264355f77e592028dd6f1f5d6373c204fe82bf3141ab1861fb?tab=overview)
- `same as` predicate term ID: `0xbeebfb7d177cbd96ffc239d2196c72ec346efe81f39dc595773f13d83506f5f0`
- Final ingestion manifest: `data/runs/2026-06-04T03-19-41-800Z-mainnet.json` (8004 data-scraper repo)

**Canonical mainnet term IDs for write-path examples**

- `same as`: `0xbeebfb7d177cbd96ffc239d2196c72ec346efe81f39dc595773f13d83506f5f0`
- `has type`: `0xa632a94306ab1d56911cff8c06473659a7caa2dfec6de3921bc23ec8ebf96ced`
- `is` (community atom, canonical by adoption — the dominant `is` predicate with 500+ edges; same term ID resolves on both networks): `0xdd4320a03fcd85ed6ac29f3171208f05418324d6943f1fac5d3c23cc1ce10eb3`
- `implement`: `0xfa02609bfde5a9a7ba18fa8afc1c42bc643edfaf7d44e3ce9e50835290d03324`
- `available on`: `0xa974ce85010776bb6eb81e4492bdb8712f127aa75ae737f02cbe80e72409f7d3`
- `created by`: `0x5a959cdd3493fb6335c315df14eb35edb7f2cc578ccae899a89c0f7f330239eb`
- `use`: `0x9ddda4ac2477ec6908e9561ab31ccd767bf3642e0ed0531fd61d447badd896ab`
- `has tag`: `0x7ec36d201c842dc787b45cb5bb753bea4cf849be3908fb1b0a7d067c3c3cc1f5`
- `has category`: `0x96c20ddd7f83034666e200aa976cbe2249946bf76a7c66333212be82f284ad4b`
- `compatible with`: `0xaf3ca6cd6db1cc57c5ae68b1177ba1fd426488bd781494166ab8cb0ed28a6ea3`
- `has trust provider`: `0xdc3c5639b39f9b6553b75b37c47fa4810961392b28956234ba9f401a98f43888`
- `has trust assessment`: `0x7f455fb041f766c3f24552db4c943888c6778c2475d4f2d434b84ad03298457c`
- `provided by`: `0x9a310b5ca895009792e5b1dc0131539f36c054e8e32987989367ec73a1a3ef19`
- `AIAgent`: `0x800342c0ded1c288e69f39a2dc96d8cff9b242e9f573193e6e0a849e5315d3e9`
- `ERC-8004`: `0x595ba5059b23a9aa4d64deff324ff3d957866715d5b7b8015eebc9009bab78b2`
- `Base` (community atom, canonical by adoption): `0x3a9975dff190314abfb2f36b2a6c42775fc024bae587e7cdc17528465453655f` — the legacy ingestion Base atom `0xa9d3369082d5616143ae1562866b1b6ec815f295c9c1edb2cb82f8d81382d158` is bridged to it via `same as`; use the community atom for new writes
- `Trust Assessment Source`: `0xf8a0ea34c8e7195b63d1641141166cc56e9128e25cf8c9f68ac6b81527b78f07`
- `MCP Server` (object of `has type`): `0xb52bb294a1cbf67a3fccc6bc8423e0758a11acfeb60caf6a0465ffca9ec3ae79`
- `A2A Agent` (object of `has type`): `0x6f0aee1b3bc88f578afc00e9444213d0f54cd9ab40cac7130f1d3453fd5c317e`

The trust-pattern term IDs (`has trust provider`, `has trust assessment`, `provided by`, `Trust Assessment Source`) and every classification predicate and object ID listed above are identical on mainnet and testnet — the same constant resolves on both networks. The one nuance is `has tag`: **both** `has tag` atoms exist on both networks (`0x7ec36d20…` pins `https://schema.org/keywords`; `0x6de69cc0…` pins the string `has tag`). What differs is which one each network's ecosystem writes with — use `0x7ec36d20…` for mainnet writes and `0x6de69cc0…` for testnet writes to match each network's in-use vocabulary.

**Canonical object atoms — chains, standards, trust models, OASF skills & domains (mainnet)**

These are the canonical object atoms for the classification and enrichment Triples in this guide — the vocabulary in live use across ERC-8004 agents, published on mainnet 2026-07-08. Resolve object `term_id`s from these tables; do **not** mint your own copies — a differently-pinned duplicate is a different node and fragments the staking surface. If a value you need is missing from the tables, mint it with the exact construction recipe below (or ask the Business Development team to extend the canon). The recipe applies only to slugs not listed above — it cannot be used to re-derive rows marked **legacy**, and re-deriving a **full-slug** row is unnecessary (the ID is already published). For every listed slug, use the table's `term_id` verbatim.

_Minting a missing OASF skill/domain atom — exact recipe._ Atom IDs are content-deterministic, so this recipe must be reproduced **byte-for-byte** — the same discipline as the agent-identity recipe in Step A. Any variation in any field mints a different atom ID and splits the vocabulary. This recipe is how new (post-2026-07-08) taxonomy atoms are constructed; the rows marked **legacy** in the tables above predate it and follow a different historical construction — never attempt to reproduce those, just use their listed IDs. Pin a Thing with exactly these four fields, then mint via `createAtomFromThing` / `createAtomFromIpfsUri`:

```json
{
  "name": "{full slug path, e.g. audio/speech/speech_to_text}",
  "description": "OASF skill category: {full slug path}",
  "image": "null",
  "url": "https://github.com/agntcy/oasf"
}
```

:::warning

`"image": "null"` is intentional — the literal four-character string `null`, not an empty string and not JSON `null`. The live canonical taxonomy atoms were pinned with exactly this payload, and atom IDs are content-derived, so reproducing a canonical ID requires reproducing the payload byte-for-byte. Do not normalize `"null"` to `""` when reproducing these IDs — that mints a different atom ID and splits the vocabulary. This is a historical artifact of the ingestion pipeline; reproduce it verbatim.

:::

For a domain, the description prefix is `OASF domain category: {full slug path}` — everything else is identical. Use the slug exactly as it appears in the [OASF schema explorer](https://schema.oasf.outshift.com/) (lowercase, underscores, `/`-separated path). After minting, write the hierarchy edge `(new atom, has category, parent atom)` using the `has category` predicate and the parent's ID from the tables below (mint missing intermediate parents with the same recipe), then link your agent to it (`has tag` for a skill, `has category` for a domain).

**Verify convergence before minting.** Pinning is free and deterministic, so always pin first and check the result before sending a transaction. Call `pinThing` with your four fields, then resolve the returned URI against mainnet:

```graphql
query {
  atoms(where: { data: { _eq: "ipfs://…your-pinned-uri…" } }) {
    term_id
    label
  }
}
```

If the slug appears in the tables above, this must return exactly the listed `term_id` — if it returns nothing or a different ID, stop: your payload has drifted from the canonical bytes. Only mint when the slug is genuinely absent from the tables **and** the URI resolves to no existing atom.

Chains do not follow this recipe: the canonical chain atoms are Things named with their human-readable names (`Base`, `Ethereum`, …), with human-written descriptions and homepage URLs — not CAIP-2 identifiers. Every registry-deployment chain already exists in the table below, so never mint a chain atom yourself — ask the Business Development team if a chain you need is missing. (Write manifest: `data/runs/canonical-object-atoms-written-mainnet.json`, 8004 data-scraper repo.)

_Chains — object of **`available on`** (canonical by adoption):_

| Chain                     | Atom ID                                                              |
| ------------------------- | -------------------------------------------------------------------- |
| Ethereum                  | `0x1de157191ec5d1e398819f11b3664b1827d80437d5e6d1db61bbf569f90ae980` |
| Base                      | `0x3a9975dff190314abfb2f36b2a6c42775fc024bae587e7cdc17528465453655f` |
| BSC (Binance Smart Chain) | `0x2c224499b7983dabe9acd30b4340f52e4ac99d39b7b9d98fc1a6b3ba1575fecb` |
| Polygon                   | `0xb471e2b9f4acbb94bced318d24fb4a5ec69cbb94d2159719b83c823890c8a51b` |
| Monad                     | `0x5c5198d21b8ee026022156a0bf1a9a4e2bae37f89ed0484dbde3a8d61f4784e6` |
| Arbitrum                  | `0xd902d98dbf0dcbeed85baa03003dec3f9dfced5da03b7673eff41c740c1d5c72` |
| Optimism                  | `0x7bf6901464ac66759724bca0fe56284319ef000c995257433c65641005c21aa0` |

_Standards — object of **`compatible with`** / **`use`**:_

| Standard | Atom ID                                                              |
| -------- | -------------------------------------------------------------------- |
| ERC-8004 | `0x595ba5059b23a9aa4d64deff324ff3d957866715d5b7b8015eebc9009bab78b2` |
| x402     | `0x598193f2ac7f951b82b59a9c454cc012c3d7bfd76328331f4e4c9e5e75a2be8f` |
| MCP      | `0xcfba7ccac56d280356b324ef16332100707ab50e7a6c1c7ab7dfdeb5fb62e43d` |
| A2A      | `0x9146ad2efc85bece6280476c8b338d01ddf0bec09ba56ee0441c9405a852a6e9` |
| OASF     | `0xec422ccd84fecb350432533e68a2565c11addff74d80335d1548941518aefb9e` |

_Trust models — object of **`has tag`**:_

| Trust model     | Atom ID                                                              |
| --------------- | -------------------------------------------------------------------- |
| reputation      | `0xd22b16d68b364ec3d75ffbab4435e1348be87cc7bed4eda6f6a4d59ca79ae0bf` |
| crypto-economic | `0x1e49b9102c046de00f1a448041f4e98bc1430fb4a002f7f0ba52840843ad9eb3` |
| tee-attestation | `0x671725c78c95813ee4a58addc29304bc68b6ebb15eed981df3202cc9da87a0ec` |
| validation      | `0x2068af1313239d0b61198461eca34fb21030adce5202e92948ced9ae6d9c35aa` |

**How to read these tables.** The `term_id` in each row is canonical — always use it verbatim. Rows are one of two constructions:

- **full-slug** — a taxonomy atom pinned with the exact recipe below (name = full slug path). Reproducing the recipe for its slug yields this ID.
- **legacy** — an older ingestion atom named by the bare leaf slug (description: "Value atom observed in ERC-8004 agent registry data."). These are canonical by adoption — live agent data points at them. The recipe does not and must not be used to re-derive them; a recipe-minted atom for these slugs would be a duplicate that fragments the graph.

_OASF skills — object of **`has tag`**; slugs listed as full paths, atom construction per the legend above:_

| Skill slug                                                                                         | Atom ID                                                                                                              |
| -------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `advanced_reasoning_planning`                                                                      | `0x572aaf312d2c2133cac797532235acc72a7fcc2a316bc5f20ce111692d5e122f`                                                 |
| `advanced_reasoning_planning/chain_of_thought_structuring` — **legacy**                            | `0x8668d70ddb3f1c5bbf830d0e8f2bb0ff29dc740de753110a1f8aaa0c20033a3c`                                                 |
| `advanced_reasoning_planning/decision_making` — **legacy**                                         | `0x23b90d9faa6d5ed8fd9416d6a1c270e92e406d48afc9ab9885fb2de557205741`                                                 |
| `advanced_reasoning_planning/hypothesis_generation` — **legacy**                                   | `0x314d758ff43f51dc518772ea0d70753af04390ec6f00f2fc412c0a6ca7bbaba1`                                                 |
| `advanced_reasoning_planning/risk_assessment` — **legacy**                                         | `0x1c6b97ad92d0c838cfb05f70dec3e5bb4bb9ef01b99b2bd381df5db1f1ec84df`                                                 |
| `advanced_reasoning_planning/strategic_planning` — **legacy**                                      | `0x9790f1f6812db5e33ecaf5a3be1a6a3391b788990646d162fa56323076056b82`                                                 |
| `analytical_skills`                                                                                | `0xa0f9a190135b986977da5f26498c7d8976b3035a2e6c5f5f50ba8593bf73cc16`                                                 |
| `analytical_skills/data_analysis`                                                                  | `0xee7f94be7b49501ae217ba2c7a1587285f542b47a83fff40e8f15a9cae7db977`                                                 |
| `analytical_skills/data_analysis/blockchain_analysis` — **legacy**                                 | `0xbdeb19cf9a9bbfe1abc32b4bef6aa72ea7153b756619cd812b4f23c4e8f0915a`                                                 |
| `analytical_skills/financial_analysis`                                                             | `0x791e4dc5d024c98922db6130d0666b643a4b63321c79f52bb92d0bfeeb16e60a`                                                 |
| `analytical_skills/financial_analysis/investment_analysis` — **legacy**                            | `0x73192dacb8f49021e79b1dd23e6ee3ca29d94c360612f652c4f279c9d592fe37`                                                 |
| `analytical_skills/forecasting`                                                                    | `0x2d9725eddf8a5988f02b68cc76c33ffa10a4689698d4629428ce49b7624144a9`                                                 |
| `automation`                                                                                       | `0x39e20dc1a2c652c61c6038fa4c27eb04468c3e787dabd3d9944e01412b8a0564`                                                 |
| `automation/transaction_execution` — **legacy**                                                    | `0xd9d94f1e3a89564433c5a55e2f978fbf204422a3caf302b8145e4562ee40c503`                                                 |
| `automation/workflow_automation` — **legacy**                                                      | `0xaa48f7e4c77b65653e1a7f6e139783e82af640df73c66e432ab25426979de6c2`                                                 |
| `data_analysis`                                                                                    | `0xbe6d2950b1fa76ee421a1fe954aef2e74ac3dc913fccfce43601d26965707da2`                                                 |
| `data_analysis/market_analysis` — **legacy**                                                       | `0x268c3bf09621f6c17c1136a4933e13eea3a9f10aaee4eac617891e15dd26dc8a`                                                 |
| `data_analysis/pattern_recognition` — **legacy**                                                   | `0xdd4e17ebf44ba8d430b8153a8eca4cfcc49c15701300dbd32e95abd502f115f1`                                                 |
| `data_analysis/quantitative_analysis` — **legacy**                                                 | `0x9d04d57aefffa7a81874b3e07219630109af0ea997c19edf52e464329250897f`                                                 |
| `natural_language_processing`                                                                      | `0x3589087bc165ed78835871cbc01c3e9ee1ae7a4bacd1c264a04ca3ebdb691eca`                                                 |
| `natural_language_processing/analytical_reasoning` — **legacy**                                    | `0x2709fc47322c70f9d3d6af2289c258b5ad021fe5fb35d9d7ffc33ec0ee063920`                                                 |
| `natural_language_processing/analytical_reasoning/analytical_reasoning` — **legacy**               | `0x2709fc47322c70f9d3d6af2289c258b5ad021fe5fb35d9d7ffc33ec0ee063920` (same atom as parent)                           |
| `natural_language_processing/information_retrieval_synthesis`                                      | `0x4045032efa29fdde7c18ca04d22c91dd923e78cca720005ec5e4293b1ea1c870`                                                 |
| `natural_language_processing/information_retrieval_synthesis/search`                               | `0x892d6be9922a124b1fe75dd485cdf78c5c3b8eb096907e4315ff6aaf3ea62a64`                                                 |
| `natural_language_processing/natural_language_generation`                                          | `0xe51b703b977c651bffe368da84b4d165c12644e54aede7e831047ad1059df057`                                                 |
| `natural_language_processing/natural_language_generation/text_generation` — **legacy**             | `0x16a8daeb3343b864361882857d4bbebac6aca15795dc558aa0e7fbc3e8647be8`                                                 |
| `natural_language_processing/natural_language_understanding`                                       | `0xd7652445b2d5e3364d16ee258ab1fbb42db7fb1ae00fe93347dc0705b6669168`                                                 |
| `natural_language_processing/natural_language_understanding/contextual_comprehension` — **legacy** | `0xa20b52de0aaf46a3f5c3a28dc53733381d4ffe380f4ae7687f038d8d1779acfb`                                                 |
| `retrieval_augmented_generation`                                                                   | `0x0d7c96d17aa67f41f50f92227501028055b651d0e545fa55f9a515344216f817`                                                 |
| `retrieval_augmented_generation/retrieval_of_information` — **legacy**                             | `0x4e8a462e99c27c58307166f12e778b25deed01ae781c4c5f6eda3b159d23a802`                                                 |
| `retrieval_augmented_generation/retrieval_of_information/retrieval_of_information` — **legacy**    | `0x4e8a462e99c27c58307166f12e778b25deed01ae781c4c5f6eda3b159d23a802` (same atom as parent)                           |
| `retrieval_augmented_generation/retrieval_of_information/search`                                   | `0x0f26b903542b5d30ebd9cdbeb47b3919da1acf0a5750302a93d21582e20b1217`                                                 |
| `tool_interaction`                                                                                 | `0x528cf7b3bf2be545916bca63b09d8fdf556f86c50316a6613834b1de9e5f2019`                                                 |
| `tool_interaction/api_integration` — **legacy**                                                    | `0xda550e795d6f98476c25748cfc2a9d2a73174f0f0f2e4ae2b20dd0e0b09327af`                                                 |
| `tool_interaction/blockchain_interaction` — **legacy**                                             | `0x71b96cfa48de061286fdf688c3308e309ffff2afc3032b6931c369da07dcde99`                                                 |
| `tool_interaction/tool_use_planning` — **legacy**                                                  | `0xffea236f8bef36de25d2e8ac4a336f4c3a40549dd0376aacacfb48fd9dc0948f`                                                 |
| `tool_interaction/workflow_automation` — **legacy**                                                | `0xaa48f7e4c77b65653e1a7f6e139783e82af640df73c66e432ab25426979de6c2` (same atom as `automation/workflow_automation`) |

_OASF domains — object of **`has category`**; slugs listed as full paths, atom construction per the legend above:_

| Domain slug                                                     | Atom ID                                                                                    |
| --------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| `base_domain`                                                   | `0x76244d5b8680d37424191c1b43d1415c6b08d59db7fcac0b30ea69b13fe46385`                       |
| `energy`                                                        | `0xc109e8ebae39cd43f94c74429fe29993d78f316dc0401761f78c7422a83ca6ed`                       |
| `energy/energy`                                                 | `0xe10613ab3ff347455cfb751de548700beaf1874eef8a0a5d67e0c11459f07432`                       |
| `energy/energy_management` — **legacy**                         | `0xbe9684d0c89e722eff4516fefc5049d1bd0af03aeedfab0184ceef3c985693e7`                       |
| `finance_and_business`                                          | `0x016f0c8e0d5bcf1525ef8bed4fa0fb91c82b362ab0784ff202cd12d3d08985e5`                       |
| `finance_and_business/crypto_assets` — **legacy**               | `0xfd7f47ae1b71c3c9c4336a84ec161f13a5d6db151f0b177352c63484a2b95725`                       |
| `finance_and_business/defi`                                     | `0x551307cb0a449e205f70795d86e15f459238bdcab649c4d8bdaaded4ced21da3`                       |
| `finance_and_business/finance`                                  | `0x327ea69224980fc51eb279e7b46a2b1977a9a44d78856753ac33e88a8ceffeac`                       |
| `finance_and_business/finance_and_business`                     | `0x016f0c8e0d5bcf1525ef8bed4fa0fb91c82b362ab0784ff202cd12d3d08985e5` (same atom as parent) |
| `finance_and_business/investment_services` — **legacy**         | `0x3bdcd590dbdd0254786d687b2e7357a9e1c7690e2d9dd6bbc739f9933f1cdc7a`                       |
| `finance_and_business/trading`                                  | `0x7cd4a685a9f0f9dffd6f87c66a9df4ad8a39637508f9be2a5288bdd679ce771a`                       |
| `technology`                                                    | `0x6e4256a82c45e4157de883d82e21df49cd3e69c0693ba5177b71fa7d20b3a90e`                       |
| `technology/blockchain`                                         | `0xa8437e51cbc509831fa85473a51b63c8c1b8d39c8fb476a665fc1663c5a01075`                       |
| `technology/blockchain/cryptocurrency` — **legacy**             | `0x4cc26acf2b44e1852c879cd47f2d08a67acb1d64859645d7681a42a59f14c35d`                       |
| `technology/smart_contracts` — **legacy**                       | `0x08ff9888468aabe8e707358c6d35835bc27b8a31833a68be213d063a4398a8b4`                       |
| `technology/software_engineering` — **legacy**                  | `0x68ae2b1c65b0bd9d3353afb27577b3a3a62818a8a2e32af7ac69a8e9a71b1890`                       |
| `technology/software_engineering/apis_integration` — **legacy** | `0xdaa1d5f260675ceff53b555834c1f20b42a87bb54d3fb99f0fab59945bacaa0c`                       |

The skill/domain taxonomy also carries `has category` hierarchy edges (leaf → mid → top), so consumers can roll leaf declarations up to their parent categories. These object IDs are validated on **both networks**: the full object-atom set in these tables was replicated to testnet on 2026-07-08 from the same pinned IPFS payloads, so every term ID below is byte-identical on testnet and mainnet and the same constants work for testnet dry-runs and mainnet writes. Preflighting object IDs before writing remains good practice.

**Testnet integration constants (for development)**

Dry-run your integration on Intuition Testnet before writing to mainnet. The SDK calls and four-Triple write pattern are the same. The canonical term IDs below are now identical to their mainnet values — the classification atoms have been replicated onto testnet with matching IDs, so the same constant works on both networks (the one per-network choice is `has tag` — both atoms exist on both networks, but each network's ecosystem writes with a different one; use the per-network value listed below). As of 2026-07-09 the indexed testnet cohort also carries the full canonical edge set: every indexed mainnet agent's classification and enrichment edges were mirrored onto testnet with identical subject/predicate/object term IDs (with `has tag` written as the testnet value), so term_id-filtered reads — including the production variant of Read 1 — return the pre-indexed testnet agents exactly as they do on mainnet. Testnet's original ingestion also wrote edges through older, non-canonical predicate/object atoms; those remain on chain alongside the canonical mirror — treat them as residue and query by the canonical constants. Indexed agent data can still differ by network, so run preflight reads against the testnet endpoint. Testnet also contains legacy string-based `same as` edges from the original ingestion (predicate `0xb1fd0950fad5f69c984a488888493ea84a8cdcd52677f658cbe79c63bfdd4505`). These are superseded: the canonical `same as` predicate (`0xbeebfb7d…`) now anchors every indexed testnet agent, and the documented Preflight query works identically on testnet and mainnet. This is one more reason to resolve predicates by the published constants, never by label.

- Network: Intuition Testnet (L3, chain ID 13579)
- RPC URL: `https://testnet.rpc.intuition.systems/http`
- GraphQL endpoint: `https://testnet.intuition.sh/v1/graphql`
- Pinning API: `https://pin.intuition.systems/v1/graphql` — network-agnostic; auth via `apikey` header
- MultiVault contract: `0x2Ece8D4dEdcB9918A398528f3fa4688b1d2CAB91`
- Native token: tTRUST (testnet TRUST) — fund a test wallet from the [testnet faucet](https://testnet.hub.intuition.systems/), reach out to Business Development if you need more tTRUST for testing
- Block explorer: [testnet.explorer.intuition.systems](http://testnet.explorer.intuition.systems)

**Canonical testnet term IDs for write-path examples**

- `same as`: `0xbeebfb7d177cbd96ffc239d2196c72ec346efe81f39dc595773f13d83506f5f0`
- `has type`: `0xa632a94306ab1d56911cff8c06473659a7caa2dfec6de3921bc23ec8ebf96ced`
- `is` (community atom, canonical by adoption — same term ID as the mainnet list): `0xdd4320a03fcd85ed6ac29f3171208f05418324d6943f1fac5d3c23cc1ce10eb3`
- `has tag`: `0x6de69cc0ae3efe4000279b1bf365065096c8715d8180bc2a98046ee07d3356fd`
- `implement`: `0xfa02609bfde5a9a7ba18fa8afc1c42bc643edfaf7d44e3ce9e50835290d03324`
- `available on`: `0xa974ce85010776bb6eb81e4492bdb8712f127aa75ae737f02cbe80e72409f7d3`
- `created by`: `0x5a959cdd3493fb6335c315df14eb35edb7f2cc578ccae899a89c0f7f330239eb`
- `use`: `0x9ddda4ac2477ec6908e9561ab31ccd767bf3642e0ed0531fd61d447badd896ab`
- `has category`: `0x96c20ddd7f83034666e200aa976cbe2249946bf76a7c66333212be82f284ad4b`
- `compatible with`: `0xaf3ca6cd6db1cc57c5ae68b1177ba1fd426488bd781494166ab8cb0ed28a6ea3`
- `has trust provider`: `0xdc3c5639b39f9b6553b75b37c47fa4810961392b28956234ba9f401a98f43888`
- `has trust assessment`: `0x7f455fb041f766c3f24552db4c943888c6778c2475d4f2d434b84ad03298457c`
- `provided by`: `0x9a310b5ca895009792e5b1dc0131539f36c054e8e32987989367ec73a1a3ef19`
- `AIAgent`: `0x800342c0ded1c288e69f39a2dc96d8cff9b242e9f573193e6e0a849e5315d3e9`
- `ERC-8004`: `0x595ba5059b23a9aa4d64deff324ff3d957866715d5b7b8015eebc9009bab78b2`
- `Base` (community atom, canonical by adoption): `0x3a9975dff190314abfb2f36b2a6c42775fc024bae587e7cdc17528465453655f` — the legacy ingestion Base atom `0xa9d3369082d5616143ae1562866b1b6ec815f295c9c1edb2cb82f8d81382d158` is bridged to it via `same as`; use the community atom for new writes
- `Trust Assessment Source`: `0xf8a0ea34c8e7195b63d1641141166cc56e9128e25cf8c9f68ac6b81527b78f07`
- `MCP Server` (object of `has type`): `0xb52bb294a1cbf67a3fccc6bc8423e0758a11acfeb60caf6a0465ffca9ec3ae79`
- `A2A Agent` (object of `has type`): `0x6f0aee1b3bc88f578afc00e9444213d0f54cd9ab40cac7130f1d3453fd5c317e`

The trust-pattern term IDs (`has trust provider`, `has trust assessment`, `provided by`, `Trust Assessment Source`) are canonical and identical on testnet and mainnet. Always use these constants; do not resolve these labels via GraphQL, because testnet also contains older duplicate-label atoms for all four terms (the resolver's one-match check will throw).

**Canonical Intuition data-structures docs**

- [Integration Partner Guide](https://github.com/0xIntuition/intuition-data-structures/blob/main/predicates/7-predicate-integration-partner-guide.md) — I-atom pattern, market patterns, common mistakes
- [Predicate Analysis (catalog)](https://github.com/0xIntuition/intuition-data-structures/blob/main/predicates/1-predicate-analysis.md) — enshrined predicate list with definitions
- [Predicate Usage by Entity Type](https://github.com/0xIntuition/intuition-data-structures/blob/main/predicates/2-predicate-usage-by-entity-type.md) — entity-type-to-predicate mapping
- [Predicate Display and Conjugation](https://github.com/0xIntuition/intuition-data-structures/blob/main/predicates/3-predicate-display-and-conjugation.md) — base-form verb convention
- [Architecture First Principles](https://github.com/0xIntuition/intuition-data-structures/blob/main/predicates/4-predicate-architecture-first-principles.md)
- [SDK Implementation Guide](https://github.com/0xIntuition/intuition-data-structures/blob/main/predicates/6-predicate-sdk-implementation-guide.md)

**OASF reference (skill / domain taxonomy)**

- [agntcy/oasf](https://github.com/agntcy/oasf) — Open Agentic Schema Framework: the source taxonomy for agent skill and domain slugs
- [OASF schema explorer](https://schema.oasf.outshift.com/) — browse the full skill and domain trees

**ERC-8004 reference**

- [EIP-8004 specification](https://eips.ethereum.org/EIPS/eip-8004)
- [erc-8004-contracts](https://github.com/erc-8004/erc-8004-contracts) — reference implementation
- [awesome-erc8004](https://github.com/sudeepb02/awesome-erc8004) — ecosystem overview
- [8004.org/build](http://8004.org/build) — developer hub

---

## Appendix C — FAQ

<details>

<summary>**How do I get write access / an API key?**</summary>

Programmatic pinning is gated behind a personal API key that Intuition issues. Request one from the Business Development team (contact above). You send it as an `apikey` request header on calls to the pinning endpoint, `https://pin.intuition.systems/v1/graphql` — see **The Partner Pinning API** in the main guide for the operations, an example, and common errors. Keys can be rotated or revoked instantly if one is ever exposed.

</details>

<details>

<summary>**Is the pinning endpoint the same as the GraphQL endpoint I query?**</summary>

No. Reads (querying agents, trust surfaces, and market data) go to the mainnet GraphQL endpoint, `https://mainnet.intuition.sh/v1/graphql`. Writes that pin metadata (`pinThing` and the related operations) go to the pinning endpoint, `https://pin.intuition.systems/v1/graphql`, with your `apikey` header. The pinning endpoint is network-agnostic; the read endpoint is per-network (testnet vs mainnet).

</details>

<details>

<summary>**My agent isn't in the indexed cohort of 98. Can I add it?**</summary>

The initial mainnet cohort was the indexable subset of the top-200 ERC-8004 reputation snapshot from 2026-06-01. If your agent isn't included, the integration pattern still works — you can create a new Atom for the agent, link it via `same as` to its ERC-8004 identity, and proceed with the four-Triple write pattern — follow the exact recipe in **Adding an agent that isn't in the indexed cohort**. Reach out to the Business Development team if you'd like coordinated ingestion for a batch.

</details>

<details>

<summary>**Does my agent need to be on Base, BSC, or Ethereum to use this?**</summary>

No. The `same as` predicate carries chain-aware identity references in its object Atom, so agents on any ERC-8004-deployed chain can be linked. The Intuition Knowledge Graph itself is chain-agnostic at the data layer.

</details>

<details>

<summary>**Can I update my JSON without re-writing Triples?**</summary>

Yes. That's the entire point of the pinThing + resolver-URL pattern. The Atom and the four Triples are stable. The JSON behind the resolver URL is yours to update on whatever cadence makes sense — every minute, every day, every audit cycle.

</details>

<details>

<summary>**Does my assessment document have to be JSON?**</summary>

No. The pattern requires a stable external URL that you control and can update. JSON at the well-known resolver path is the recommended default because consuming apps can parse it without custom handling, but the URL can point to a webpage, a GitHub-hosted markdown file, or any document that carries your assessment. Keep the URL stable and the content current; apps ingesting non-JSON formats handle the parsing on their side.

</details>

<details>

<summary>**What if I need to revoke a score?**</summary>

Update the JSON at the resolver URL. Set the assessment fields to a revoked state (`status: "revoked"`, `revokedAt: "2026-.."`), and optionally null the `score` field. Consumers re-fetching the URL will see the revocation immediately. The on-graph staking surface persists, but the assessment it points to is now revoked.

</details>

<details>

<summary>**What about gas costs?**</summary>

Atom creation and Triple creation are on-mainnet operations and consume gas. Cost-management strategies: (1) batch Atom creation per assessment class rather than per-agent where possible; (2) consider a class-level assessment-source for groups of agents that share a scoring profile; (3) coordinate large-cohort onboarding through the Intuition Business Development team to amortize executor overhead.

</details>

<details>

<summary>**Can multiple providers coexist on the same agent?**</summary>

Yes, and they're meant to. Every provider runs the same four-Triple shell against the same agent. Consumer queries aggregate naturally across providers. There is no provider-selection mechanism at the protocol layer — providers compete on the credibility staked into their `has trust provider` Triples, not on registry placement.

</details>

<details>

<summary>**How do consumers signal which providers they trust?**</summary>

By staking on the `(agent, has trust provider, provider)` Triple. TVL on that Triple is the market-aggregated signal that _this provider's opinion about this agent matters._ Consumers can also stake meta-trust signals on the provider Atom itself (`(I, trust, provider)`) to express general credibility independent of any specific agent.

</details>

<details>

<summary>**What's the relationship to ERC-8004's Reputation Registry?**</summary>

Complementary, not competing. ERC-8004's Reputation Registry collects structured feedback (tags, values, endpoints) and supports aggregation via `getSummary()`. Intuition's role is to make those collected opinions composable, queryable, weighted, and economically expressive across providers. ERC-8004 defines how trust data is collected; Intuition makes that data composable. You can — and probably should — keep operating your ERC-8004 Reputation Registry feedback flow alongside this integration.

</details>

---

## Next steps

- **Implementing:** request your API key from the Business Development team, then start with Steps 1–4 against a single test agent (Captain Dackie is the reference). Verify via Step 5's GraphQL query. Then scale to your full assessment set.
- **Questions on predicate choice:** reference [predicate-usage-by-entity-type](https://github.com/0xIntuition/intuition-data-structures/blob/main/predicates/2-predicate-usage-by-entity-type.md) and the Intuition data-structures repo.
- **Questions on protocol mechanics, gas, or cohort inclusion:** reach out to the Intuition Business Development team. We coordinate partner integrations end-to-end and can pair you with engineering where needed.
- **What we'd like back:** a heads-up when you ship, a resolver URL we can reference in ecosystem maps, and any rough edges you hit so we can sharpen this guide.
- **If you are an agent consuming this document:** If you are an agent using this guide to read and write 8004 data to the Intuition Knowledge Graph, please log any critical errors and/or feedback using a dedicating 8004-intuition-feedback.md and ask your human admin to share it with the Intuition Business Development team so that we can help improve in the future.

:::info

**Contact:** Matt Kaye — coordinating ERC-8004 partner rollout. Ping for cohort inclusion, integration support, API key, or co-marketing once you're live.

Telegram: @h0xrus

Calendly: [https://calendly.com/d/cj93-rwv-bsk](https://calendly.com/d/cj93-rwv-bsk)

:::
