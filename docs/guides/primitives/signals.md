---
title: Signals
sidebar_position: 4
---

# Signals

Signals represent the trust, confidence, or relevance that the community assigns to Atoms and Triples in the Intuition knowledge graph. Think of the knowledge graph as a weighted graph where Signal is the weight on each node (Atom) or edge (Triple), indicating how strongly people believe in or care about this information.

## Understanding Signals

Signals transform static data into a dynamic, trusted intelligence layer. When someone stakes $TRUST tokens on an Atom or Triple, they emit a Signal expressing that they find that piece of information important or true. Conversely, staking on a Triple's negative side signals doubt. These individual signals aggregate to form an overall weighted state for each item in the knowledge graph.

:::info
In essence, Signals are the lifeblood of Intuition's trust layer. They turn subjective judgments into quantifiable, shareable data, creating an internet where information is contextualized with trust—allowing everyone to navigate knowledge supported by transparent evidence and collective wisdom.
:::

## How Signals are Created

The core mechanism for creating signals is through **staking** (also called attesting). When you deposit $TRUST tokens into an Atom's vault or a Triple's vaults, you're effectively buying "shares" in that piece of information.

### Staking Mechanics

- **Atoms**: Each Atom has a single staking vault
- **Triples**: Each Triple has two vaults (positive and negative)
- **Shares**: Your stake represents proportional ownership and conviction

For example:
- Staking 100 TRUST on the Atom `[Ethereum]` gives you a fraction of total Atom Shares for `[Ethereum]`
- Staking 50 TRUST on `[Alice] isFriendOf [Bob]` in the affirmative vault gives you Triple Shares supporting that friendship claim

### Bonding Curves

The bonding curve mechanics mean share prices depend on existing stake levels:
- Early stakers get better prices
- Later stakers pay more for the same signal increment
- This creates a perpetual prediction market for information

### Continuous Markets

Staking is not a one-time vote but a continuous market:
- Add more stake to increase your signal
- Withdraw stake (with potential rewards or penalties)
- Counter-stake on opposite sides for Triples
- Market "odds" constantly adjust to reflect aggregated beliefs

## Total Value Locked and Consensus

Each Atom and Triple accrues **Total Value Locked (TVL)** in its vaults—a direct measure of tokenized trust. Higher TVL generally implies greater relevance or credibility, helping filter signal from noise.

### Consensus Calculation

The consensus score weighs multiple variables:
- Amount staked on each side
- Number of distinct attestors
- Past reliability (reputation) of attestors

For example, if a claim has:
- 10,000 TRUST staked in support (from 2 whales)
- 2,000 TRUST staked against (from 100 knowledgeable users)

The raw numbers alone don't tell the full story. The consensus algorithm factors in these nuances, which can be tuned through governance.

### Economic Incentives and Ownership

Signals create a revolutionary ownership model for information. When you stake TRUST on an Atom or Triple, you're not just voting—you're buying ownership shares in that piece of data.

#### How Signal Economics Work

1. **Stake TRUST, Receive Tokens**: When you stake TRUST on any Atom or Triple, you receive proportional tokens representing your ownership share
   - Each Atom and Triple has its own token supply
   - The number of tokens you receive depends on the bonding curve price at the time of staking
   - Early stakers get more tokens per TRUST than later stakers

2. **Bonding Curve Pricing**: Everything operates on bonding curves, creating dynamic pricing:
   - Initial stakes are cheap (more tokens per TRUST)
   - As more people stake, the price increases
   - This rewards early discovery and conviction
   - Creates a market mechanism for information value

3. **Fee Distribution to Token Holders**: Here's where it gets powerful—token holders earn from all interactions:
   - When someone queries the data, fees go to token holders
   - When others stake on the same Atom/Triple, trading fees accrue to existing holders
   - When the data is traversed in graph queries, micro-fees flow to owners
   - The more useful the data, the more fees it generates

#### Signals as Data Ownership

This model transforms Signals from simple attestations into **programmatic value flows**:

```javascript
// Example: Staking creates ownership
const stake = await stakeOnAtom({
  atomId: "ethereum-atom",
  amount: 100  // 100 TRUST
});

// You now own tokens representing your share
console.log(stake);
// {
//   tokensReceived: 45,  // Based on bonding curve
//   totalSupply: 1000,    // Total tokens for this Atom
//   ownership: 0.045,     // You own 4.5% of this Atom
//   currentPrice: 2.22    // Current price per token
// }

// As the Atom generates fees, you earn proportionally
// Every query, every reference, every interaction = revenue
```

#### Value Flow Examples

Consider these scenarios:

**Popular Identity Atom**: An Atom representing "Vitalik Buterin"
- Thousands of Triples reference it
- Queries constantly traverse through it
- Early stakers earn fees from every interaction
- Acts like owning "shares" in a highly-trafficked data highway

**Valuable Triple**: "[CompanyX] [acquired] [CompanyY]"
- News services query it
- Financial models reference it
- Trading bots check it
- Token holders earn from all this usage

**Infrastructure Data**: Common predicates like "owns" or "created"
- Used in millions of queries
- Essential graph infrastructure
- Stakers essentially own critical data infrastructure

This creates an economy where:
- **Discovery is rewarded**: Find and stake on useful data early
- **Curation has value**: Your stake helps validate quality
- **Usage generates returns**: Popular data pays dividends
- **Information becomes an asset class**: Data literally has owners who profit from its use

## Three Forms of Signal Generation

The Intuition model accounts for three distinct forms of signal generation:

### 1. Explicit Signal

Direct stakes or votes by users—the most straightforward form:
- Users explicitly declare stance by locking tokens
- Like upvoting/downvoting with money at risk
- Ensures serious, considered assertions

### 2. Implicit Signal

Derived from usage and interaction patterns:
- Frequency of queries and references
- Inclusion in other Triples
- Application usage metrics
- Off-chain indexing tracks these metrics
- "Crowds vote with their attention/tools"

### 3. Transitive Signal

Reflects web-of-trust effects:
- Signals from trusted sources carry more weight
- If Alice stakes on a claim and you historically align with Alice, her signal counts more strongly in your view
- Trust propagates through the social graph of attestors
- Reality Tunnels use this for personalized perspectives

## Interpreting Signals

Every piece of signal data is fully transparent and on-chain, allowing anyone to inspect why an Atom/Triple has its reputation:

### Transparency Features

- View which addresses have staked
- See stake amounts and sides
- Analyze attestor profiles
- Trust but verify approach

### Meta-Information Value

The meta-layer reveals crucial context:
- A 95% consensus might have dissenting 5% from domain experts
- Highly reputable DAOs and individuals staking together lends strong credibility
- "Who trusts this and who doesn't" becomes quantifiable data

This transparency enables both users and AI agents to evaluate information with full context rather than blind trust.

## Using Signals: Filtering and Reality Tunnels

Now that we understand how signals work, let's explore their most powerful application: filtering information based on trust. In traditional databases, you can query for data that exists. In Intuition, you can query for data that is *trusted*—and define exactly what "trusted" means to you.

### Trust-Based Filtering

Think of signals as creating a trust layer over all information. Instead of getting raw, unvetted data, you can filter results based on community confidence, stake amounts, or specific attestors. This transforms queries from "what exists" to "what can I trust."

#### Filtering by Consensus and Stakes

When querying the knowledge graph, you can set minimum trust thresholds. For example, imagine you're building a DeFi aggregator that needs to identify legitimate DAO treasuries. Rather than maintaining a manual whitelist, you can query for addresses that the community has strongly validated:

```javascript
// Find DAO treasuries with strong community backing
const trustedDAOs = await query({
  pattern: "[Address] [isDAOTreasury] [True]",
  minSignal: {
    tvl: 10000,        // At least 10,000 TRUST staked
    consensus: 0.8     // At least 80% positive consensus
  }
});
```

This query returns only addresses where:
- The community has staked significant value (10,000+ TRUST) on the claim
- There's strong agreement (80%+ consensus) that it's actually a DAO treasury
- The signal data provides economic backing for the classification

#### Filtering by Specific Attestors

Sometimes you don't just want community consensus—you want verification from specific, authoritative sources. Signal filtering allows you to require attestations from particular entities.

Consider an HR application that needs to verify employment. Instead of trusting any claim that "Alice works at Company Y," you can require that Company Y itself has attested to this relationship:

```javascript
// Get employee data that's been verified by the employer
const employees = await query({
  pattern: "[Person] [employeeOf] [CompanyY]",
  requireSignalFrom: "CompanyY"  // Company must have attested
});
```

This ensures you're only getting employment claims that the company itself has staked on, providing authoritative verification without centralized APIs or manual verification processes.

### Reality Tunnels

Reality Tunnels take signal filtering to the next level by creating complete worldviews or perspectives through which to interpret data. Think of them as curated lenses that determine whose signals you trust and how much weight to give them.

#### What is a Reality Tunnel?

A Reality Tunnel is essentially a trust configuration that filters and weights signals according to specific criteria. Instead of seeing "raw truth," you see truth as interpreted through a particular perspective. The same underlying data can look completely different through different tunnels.

For example, when evaluating a claim like "Cryptocurrency X is a good investment":
- A **Conservative Investor Tunnel** might heavily weight signals from established financial institutions
- A **Crypto Native Tunnel** might prioritize signals from DeFi protocols and veteran traders
- A **Risk Averse Tunnel** might only show claims with near-unanimous positive consensus

#### Types of Reality Tunnels

Different tunnels serve different needs and communities:

- **Conservative Tunnel**: Weights signals from established, verified experts in traditional fields. Useful for risk-averse users who prefer institutional validation.

- **Scientific Tunnel**: Only considers claims backed by academic citations, peer review signals, or attestations from verified researchers. Filters out speculation and opinion.

- **Community Tunnel**: Follows broad majority consensus, essentially "wisdom of the crowds." Good for general-purpose queries where you want mainstream agreement.

- **Custom Tunnels**: Users or organizations can create their own trust parameters, perhaps weighting signals from specific DAOs, professional networks, or social graphs.

#### How Reality Tunnels Work

When you select a Reality Tunnel, you're essentially applying a complex filter to all signal data:

```javascript
// Example: Scientific Reality Tunnel configuration
const scientificTunnel = {
  requiredSignals: ["peer-reviewed", "has-citations"],
  minAttestors: 3,
  attestorRequirements: {
    mustInclude: ["verified-researcher", "academic-institution"]
  },
  consensusThreshold: 0.7,
  weights: {
    "university-attestor": 2.0,    // Double weight for universities
    "peer-reviewer": 1.5,          // 1.5x weight for peer reviewers
    "general-user": 0.5            // Half weight for general users
  }
};

// Query through this tunnel
const scientificFacts = await query({
  pattern: "[Study] [shows] [Result]",
  tunnel: scientificTunnel
});
```

Each tunnel adjusts which signals influence results while maintaining the same underlying data. Users can inspect or adopt any trust framework as needed.

### Protocol Neutrality

**Crucially, the Intuition protocol does not tell anyone how to interpret signals.** The protocol operates at a very low level, simply allowing things to "say things about things" without imposing any specific interpretation logic.

Key principles of protocol neutrality:
- **No Forced Interpretation**: The protocol never dictates what signals mean
- **Unopinionated Infrastructure**: Signal data exists as raw, neutral information
- **Interpretation Layer Separation**: All meaning-making happens higher up the stack
- **Multiple Valid Views**: Different applications can interpret the same signals differently
- **User Sovereignty**: You choose which interpretation framework to trust

This means:
- There may be default interpretations or Reality Tunnels provided for convenience
- Communities and trusted entities can build their own interpretation layers
- Applications can implement custom consensus algorithms
- Users are never locked into a singular worldview
- The same signal data can support contradictory but equally valid interpretations

The protocol's unopinionated nature ensures that Intuition remains a neutral substrate for trust, allowing diverse ecosystems of interpretation to flourish on top of the same underlying signal data.

## Signal Strategies and Best Practices

### Optimal Signaling Strategy

The game-theoretic optimal strategy is to:
1. Identify accurate, useful information early
2. Stake before widespread recognition
3. Earn from value flow as data gets utilized
4. Build reputation through consistent accuracy

### Risk Considerations

- **No Absolute Truth Guarantee**: Signals represent consensus and confidence, not absolute truth
- **Early Stage Risks**: Fewer participants can mean less reliable signals
- **Potential for Manipulation**: Large stakes can temporarily skew consensus
- **Opportunity Cost**: Staking on irrelevant or unused claims means missing better opportunities

### Defensive Strategies

- Always examine the trust trail behind strong signals
- Drill down into attestor profiles and motivations
- Consider contrarian positions when consensus seems wrong
- Diversify across multiple claims and domains

## Economic Dynamics and Network Effects

### Value Flow Distribution

Whenever data is utilized (queried or referenced), fees flow to stakers:
- Early stakers earn proportionally more
- Active data generates continuous rewards
- Unused claims provide no returns
- Creates natural quality filtering

### Self-Refinement Mechanism

The economic incentives naturally drive system improvement:
1. Stakers who identify valuable data earn more rewards
2. Stakers on unused or irrelevant data earn less
3. Useful information becomes economically advantageous to support
4. Irrelevant claims naturally receive less stake
5. System quality improves through market dynamics

:::warning
Importantly, the protocol itself never determines what is "true" or "false." It simply rewards participation in frequently-used data. Higher-level applications can build resolution mechanisms, prediction markets, or truth determination systems on top of this neutral substrate.
:::

### Network Effects

As more users participate:
- Signal reliability increases
- Trust networks strengthen
- Economic incentives amplify
- Information quality improves
- Collective wisdom emerges

## Practical Implementation Examples

### Creating and Querying Signals

```javascript
// Stake on an Atom
const atomSignal = await stake({
  vaultId: ethereumAtom.vaultId,
  amount: 100 // 100 TRUST tokens
});

// Stake on a Triple (positive)
const tripleSignal = await stake({
  vaultId: friendshipTriple.positiveVaultId,
  amount: 50
});

// Counter-stake (negative)
const disputeSignal = await stake({
  vaultId: claimTriple.negativeVaultId,
  amount: 75
});

// Query with confidence threshold
const trustedClaims = await query({
  minConsensus: 0.7,
  minTVL: 1000
});
```

### Building Trust-Aware Applications

```javascript
// Create a trust-filtered API
class TrustAPI {
  async getVerifiedFacts(topic, minTrust = 0.8) {
    const results = await intuition.query({
      pattern: `[*] [relatesTo] [${topic}]`,
      filters: {
        consensus: { gte: minTrust },
        attestors: { gte: 10 }
      }
    });

    return results.map(r => ({
      fact: r.triple,
      trust: r.consensus,
      evidence: r.signals
    }));
  }
}
```

## Key Takeaways

### The Signal Trinity

1. **Atoms** provide the entities
2. **Triples** provide the relationships and facts
3. **Signals** tell us which facts and entities are trusted, relevant, and by whom

Together, this trinity creates a knowledge graph where:
- Information comes with trust context
- Truth emerges from collective wisdom
- Economic incentives align with accuracy
- Transparency enables verification

### Why Signals Matter

Signals transform the internet's information layer:
- **From blind trust** → To transparent verification
- **From centralized sources** → To decentralized consensus
- **From misinformation** → To economically-backed truth
- **From static data** → To dynamic, living knowledge

### The Vision

Intuition aims to create an internet where every piece of information carries its trust signature—where we navigate knowledge with an intuition of what to believe, supported by transparent evidence and collective wisdom rather than blind faith in centralized authorities.

## Next Steps

- Understand [Atoms](./atoms) and [Triples](./triples) as signal targets
- Explore [Reality Tunnels](./reality-tunnels) for personalized trust views
- Learn about [Smart Contracts](/docs/developer-tools/contracts/contract-architecture) for on-chain signaling
- Review [Economics](/docs/guides/introduction/the-economics) for detailed tokenomics
- Check the [API Documentation](/docs/developer-tools/graphql-api/overview) for implementation details