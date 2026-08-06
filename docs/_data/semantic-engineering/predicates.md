---
title: Predicates
sidebar_label: Predicates
sidebar_position: 3
description: The canonical predicate catalog, usage patterns, and common mistakes to avoid when building with Intuition triples
keywords:
  [
    predicates,
    triples,
    knowledge graph,
    enshrined predicates,
    semantic relationships,
    I atom,
    depositional,
    attributive,
  ]
---

# Predicates

:::tip This page covers how atoms relate to each other
For what goes inside an atom, see [Data Structures](./data-structures). For creating triples onchain, see [Triple Fundamentals](../intuition-concepts/primitives/Triples/fundamentals.md).
:::

Predicates are the relationship vocabulary of the Intuition knowledge graph. When you create a triple like `(I, follow, Vitalik)`, the predicate `follow` defines how the subject and object relate. **Enshrined predicates** are the canonical set supported across the ecosystem — SDK, indexer, API, and frontends.

## Key Concepts

1. **Triples** are `(Subject, Predicate, Object)` — three atoms that form a knowledge claim
2. **Predicates** define the relationship between subject and object
3. **Enshrined predicates** are the canonical predicates supported by the Intuition ecosystem
4. **The `I` atom** is a singleton atom with data `"I"` — the universal subject for first-person claims
5. **Vaults** are created per triple — deposits express conviction, TVL is the signal

## The `I` Atom Pattern

This is the most important concept. Getting it wrong fragments your markets.

### The Problem

```
BAD:  (Alice, follow, Vitalik)   → vault with 1 depositor
BAD:  (Bob, follow, Vitalik)     → vault with 1 depositor
BAD:  (Carol, follow, Vitalik)   → vault with 1 depositor
Result: 3 tiny vaults. No signal.

GOOD: (I, follow, Vitalik)       → vault with 3 depositors
Result: 1 deep vault. TVL = aggregate follow signal.
```

The difference is between **a thousand puddles and a lake**. Deep markets produce better price signals. Shallow markets produce noise.

### The Rule

**If the depositor IS the claim-maker (first-person claim), always use `I` as the subject.**

When Alice deposits on `(I, follow, Vitalik)`, the blockchain records her address. The identity of "I" is resolved per-depositor from the vault's deposit ledger.

### When NOT to Use `I`

Use a specific entity as subject when:

- **Factual claims**: `(Ethereum, created by, Vitalik)` — a fact about the world
- **Comparisons**: `(Rust, better than, Solidity)` — comparing two entities
- **Collections**: `(DeFi Blue Chips, contain, Aave)` — curating a list

### Decision Tree

```
Is the depositor making a claim about themselves?
├── YES → Subject = I
│         (I, follow, Vitalik)
│         (I, bullish on, Ethereum)
│         (I, trust, Trail of Bits)
└── NO  → Is it a comparison between two things?
          ├── YES → Subject = the entity being compared
          │         (Rust, better than, Solidity)
          └── NO  → Subject = the entity the claim is about
                    (Ethereum, created by, Vitalik)
                    (DeFi Blue Chips, contain, Aave)
```

## Three Classes of Triples

### Depositional Triples (First-Person Markets)

Subject is `I`. Anyone deposits to make the claim about themselves. The vault's depositor list = everyone who holds this position.

```
(I, follow, Vitalik)          → "I follow Vitalik"
(I, bullish on, Ethereum)     → "I'm bullish on ETH"
(I, trust, Trail of Bits)     → "I trust this auditor"
(I, expert in, ZK proofs)     → "I claim expertise in ZK"
```

**Reading the data:** Depositor count = headcount. TVL = capital-weighted conviction.

### Comparative Triples (Opinion Markets)

Subject is a real entity. Deposits mean agreement with the comparison.

```
(Rust, better than, Solidity)         → depositors agree Rust > Solidity
(Solana, alternative to, Ethereum)    → depositors agree these are substitutes
(Uniswap v4, supersede, Uniswap v3)  → depositors agree v4 replaces v3
```

**Reading the data:** Compare `(A, better than, B)` TVL with `(B, better than, A)` TVL for the full picture. The TVL ratio is the market's verdict.

### Attributive Triples (Factual Claims)

Subject is a specific entity. The triple asserts a fact. Deposits mean "I agree this is true."

```
(Ethereum, created by, Vitalik)      → factual attribution
(Aave v3, audited by, Trail of Bits) → factual audit claim
(USDC, pegged to, USD)               → factual economic relationship
```

**Reading the data:** TVL = market confidence that the claim is accurate.

## Predicate Catalog

Enshrined predicates are organized into categories. These use **base verb form** (not third-person) because they read with the `I` subject: "I follow," not "I follows."

### Identity and Classification (1-8)

| Predicate | Intent | Example Triple |
| --- | --- | --- |
| `has type` | Type classification | `(Uniswap, has type, DEX)` |
| `same as` | Cross-representation identity | `(ETH, same as, Ether)` |
| `alias of` | Alternative name | `(BTC, alias of, Bitcoin)` |
| `instance of` | Class membership | `(USDC, instance of, stablecoin)` |
| `subclass of` | Taxonomy hierarchy | `(DEX, subclass of, exchange)` |
| `has tag` | Free-form tagging | `(Aave, has tag, lending)` |
| `has category` | Categorical grouping | `(Chainlink, has category, oracle)` |

### Social and Reputation (9-18)

| Predicate | Intent | Example Triple |
| --- | --- | --- |
| `follow` | Subscription | `(I, follow, Vitalik)` |
| `like` | Lightweight positive signal | `(I, like, Ethereum)` |
| `endorse` | Strong public support | `(I, endorse, EIP-4844)` |
| `trust` | Positive trust assertion | `(I, trust, Trail of Bits)` |
| `distrust` | Negative trust assertion | `(I, distrust, Scam Project)` |
| `recommend` | Active recommendation | `(I, recommend, Hardhat)` |
| `vouch for` | Personal credibility stake | `(I, vouch for, Bob)` |

### Curation and Containment (19-25)

| Predicate | Intent | Example Triple |
| --- | --- | --- |
| `contain` | Collection membership | `(L1 Watchlist, contain, Ethereum)` |
| `curated by` | Collection ownership | `(DeFi Blue Chips, curated by, Alice)` |
| `pinned in` | Highlighted in collection | `(Ethereum, pinned in, L1 Watchlist)` |
| `depend on` | Functional dependency | `(Arbitrum, depend on, Ethereum)` |
| `alternative to` | Substitutability | `(Solana, alternative to, Ethereum)` |

### Authorship and Contribution (26-31)

| Predicate | Intent | Example Triple |
| --- | --- | --- |
| `created by` | Origin attribution | `(Ethereum, created by, Vitalik)` |
| `authored by` | Written content | `(Whitepaper, authored by, Satoshi)` |
| `contributed to` | Contribution record | `(Alice, contributed to, OpenZeppelin)` |
| `forked from` | Divergent copy | `(Sushiswap, forked from, Uniswap)` |
| `derived from` | Adaptation | `(Optimism, derived from, Ethereum)` |

### Sentiment and Opinion (51-58)

| Predicate | Intent | Example Triple |
| --- | --- | --- |
| `agree with` | Alignment | `(I, agree with, EIP-4844)` |
| `disagree with` | Opposition | `(I, disagree with, PoW Revival)` |
| `bullish on` | Positive conviction | `(I, bullish on, Ethereum)` |
| `bearish on` | Negative conviction | `(I, bearish on, Memecoins)` |
| `skeptical of` | Cautious doubt | `(I, skeptical of, Restaking)` |

### Comparison and Ranking (59-66)

| Predicate | Intent | Example Triple |
| --- | --- | --- |
| `better than` | Subjective superiority | `(Rust, better than, Solidity)` |
| `equivalent to` | Functional parity | `(USDC, equivalent to, USDT)` |
| `compete with` | Market competition | `(Uniswap, compete with, Curve)` |
| `supersede` | Replacement | `(Uniswap v4, supersede, Uniswap v3)` |

### Provenance and Evidence (75-82)

| Predicate | Intent | Example Triple |
| --- | --- | --- |
| `verified by` | Third-party verification | `(Contract, verified by, CertiK)` |
| `audited by` | Security audit | `(Aave v3, audited by, Trail of Bits)` |
| `evidenced by` | Supporting proof | `(Claim, evidenced by, On-chain Proof)` |

For the complete catalog of all 100 predicates across 12 categories, see [predicate-analysis.md](https://github.com/0xIntuition/intuition-data-structures/blob/main/predicates/1-predicate-analysis.md) in the data structures repo.

## Market Patterns

Each predicate has a market pattern that determines how your app should handle it.

### Depositional (Subject = `I`)

Everyone deposits on the same triple. One vault, many depositors.

```
(I, follow, Vitalik)       ← one vault, many depositors
(I, bullish on, Ethereum)  ← one vault, many depositors
```

**Your app should:** Find the existing `(I, predicate, object)` triple and deposit on it. Never create `(UserName, follow, Vitalik)` — this fragments the market.

### Attributive (Subject = specific entity)

The triple asserts a fact. Deposits mean "I agree this is true."

```
(Ethereum, created by, Vitalik)     ← factual claim
(DeFi Blue Chips, contain, Aave)    ← curation fact
```

**Your app should:** Create the `(entity, predicate, object)` triple if it doesn't exist, then deposit.

### Comparative (Subject = entity being ranked)

The triple is a comparison. Check for both the triple and its inverse.

```
(Rust, better than, Solidity)     ← opinion market
```

**Your app should:** The TVL ratio between `(A, better than, B)` and `(B, better than, A)` is the signal.

## Common Mistakes

### 1. Fragmenting the market

```typescript
// BAD — creates a unique vault only Alice would deposit on
createTriple({ subject: aliceAtomId, predicate: FOLLOW, object: vitalikAtomId })

// GOOD — everyone deposits on the same vault
createTriple({ subject: I_SUBJECT, predicate: FOLLOW, object: vitalikAtomId })
```

### 2. Using UI concepts as predicates

```typescript
// BAD — "bookmark" and "star" are UI labels, not semantic predicates
createTriple({ subject: I_SUBJECT, predicate: 'bookmark', object: uniswapAtomId })

// GOOD — "like" is the semantic concept. Render it as a bookmark icon in your UI.
createTriple({ subject: I_SUBJECT, predicate: LIKE, object: uniswapAtomId })
```

### 3. Using third-person verb forms

```typescript
// BAD — "follows" and "follow" hash to different atom IDs
createTriple({ predicate: 'follows' })

// GOOD — always use base form
createTriple({ predicate: FOLLOW })  // "follow"
```

Predicates use base verb form because they read with the `I` subject: "I follow Vitalik," not "I follows Vitalik."

### 4. Creating custom predicates for covered concepts

Before creating a custom predicate, check if an enshrined one covers your use case:

| You want to express | Use this predicate |
| --- | --- |
| User saves/bookmarks something | `like` |
| User subscribes to updates | `follow` |
| User rates something positively | `like` or `endorse` |
| User adds item to a list | `contain` (collection as subject) |
| User tags something | `has tag` |
| User thinks X is better than Y | `better than` |
| User expresses positive outlook | `bullish on` |

### 5. Wrong triple direction

```
BAD:   (Vitalik, authored by, Ethereum Whitepaper)   ← backwards
GOOD:  (Ethereum Whitepaper, authored by, Vitalik)    ← the work was authored by the person

BAD:   (Alice, curated by, DeFi Blue Chips)           ← backwards
GOOD:  (DeFi Blue Chips, curated by, Alice)            ← the collection was curated by Alice
```

### 6. Missing paired markets

For opinion predicates, ensure both sides exist:

```
INCOMPLETE:  (I, bullish on, Ethereum)     ← exists
             (I, bearish on, Ethereum)     ← doesn't exist

COMPLETE:    (I, bullish on, Ethereum)     ← exists
             (I, bearish on, Ethereum)     ← also exists
```

The ratio between paired markets is the signal.

## Predicate Format: DefinedTerm Objects

Enshrined predicates are moving from raw strings to `DefinedTerm` objects — the same Schema.org classification used for other atoms:

```json
{
  "@context": "https://schema.org/",
  "@type": "DefinedTerm",
  "name": "follow",
  "description": "Unidirectional subscription — the depositor follows the object entity"
}
```

This makes predicates self-describing and consistent with the rest of the classification system. The SDK handles the transition — always use SDK constants rather than raw strings.

## Next Steps

- **[Data Structures](./data-structures)** — How to format the atom data that predicates connect
- **[Triple Fundamentals](../intuition-concepts/primitives/Triples/fundamentals.md)** — Creating triples onchain
- **[Integration Partner Guide](https://github.com/0xIntuition/intuition-data-structures/blob/main/predicates/7-predicate-integration-partner-guide.md)** — Full implementation guide for builders
- **[Predicate Catalog](https://github.com/0xIntuition/intuition-data-structures/blob/main/predicates/1-predicate-analysis.md)** — Complete catalog of all 100 predicates
