---
title: Signals
sidebar_position: 4
---

# Signals

Signals are the attestation mechanism that brings community validation and economic weight to claims in the Intuition knowledge graph, transforming static data into dynamic, trusted intelligence.

## What are Signals?

A Signal is an economic attestation that users can add to Atoms or Triples to express support, disagreement, or validation. By staking tokens behind their attestations, users create a web of economically-backed trust that helps separate truth from fiction.

## How Signals Work

### Economic Attestations
Unlike simple votes or likes, Signals require users to stake tokens, creating:
- **Skin in the Game**: Real economic commitment to claims
- **Quality Filtering**: Higher stakes indicate stronger conviction
- **Sybil Resistance**: Economic cost prevents spam and manipulation

### Signal Direction
Signals can be:
- **Positive**: Supporting or validating a claim
- **Negative**: Disputing or disagreeing with a claim
- **Neutral**: Acknowledging without judgment

### Signal Weight
The strength of a Signal depends on:
- **Stake Amount**: More tokens = stronger signal
- **Staker Reputation**: Signals from verified users carry more weight
- **Time Factor**: Earlier signals may have more impact

## Creating Signals

### Basic Signal
```javascript
const signal = await createSignal({
  targetId: atomOrTripleId,
  direction: "positive",
  stake: 100 // Amount of tokens to stake
});
```

### Signal with Context
```javascript
const signal = await createSignal({
  targetId: tripleId,
  direction: "positive",
  stake: 500,
  metadata: {
    reason: "Verified through primary sources",
    evidence: "ipfs://...",
    confidence: 0.95
  }
});
```

## Signal Economics

### Staking Mechanism
When creating a Signal:
1. **Lock Tokens**: Stake amount is locked in the contract
2. **Bonding Curve**: Price increases with more signals
3. **Reward Distribution**: Stakers can earn from future signals

### Fee Structure
Signal creation involves:
- **Network Fee**: Basic transaction cost
- **Protocol Fee**: Small percentage for protocol sustainability
- **Stake Amount**: User-defined commitment

### Value Accrual
Signals create value through:
- **Early Staking Rewards**: First movers get better rates
- **Consensus Rewards**: Aligning with community consensus
- **Curation Rewards**: Identifying valuable information early

## Types of Signals

### Validation Signals
Confirm the accuracy of information:
- Fact-checking claims
- Verifying credentials
- Authenticating sources

### Reputation Signals
Build trust networks:
- Endorsing individuals
- Vouching for organizations
- Supporting quality content

### Preference Signals
Express subjective opinions:
- Quality ratings
- Relevance scoring
- Personal recommendations

### Dispute Signals
Challenge incorrect information:
- Flagging misinformation
- Correcting errors
- Raising concerns

## Signal Aggregation

### Consensus Mechanisms
Signals aggregate to form consensus:
```javascript
// Query aggregate signal data
const consensus = await getSignalConsensus({
  targetId: tripleId,
  metric: "weighted_average"
});

console.log(consensus);
// {
//   positive: 1500, // Total positive stake
//   negative: 200,  // Total negative stake
//   consensus: 0.88, // Consensus score
//   confidence: "high"
// }
```

### Weighting Algorithms
Different methods for calculating signal strength:
- **Linear**: Direct sum of stakes
- **Logarithmic**: Diminishing returns on large stakes
- **Reputation-Weighted**: Factor in staker credibility
- **Time-Weighted**: Recent signals count more

## Querying Signals

### Get Signals for Target
```graphql
query {
  signals(where: { targetId: "atom_or_triple_id" }) {
    id
    direction
    stake
    creator {
      address
      reputation
    }
    timestamp
  }
}
```

### Aggregate Signal Data
```graphql
query {
  signalStats(targetId: "triple_123") {
    totalPositive
    totalNegative
    uniqueSignalers
    consensusScore
    topSignalers {
      address
      totalStake
    }
  }
}
```

## Signal Strategies

### Early Signaling
Benefits of signaling early:
- Better bonding curve position
- Higher potential returns
- Influence on consensus formation

### Contrarian Signaling
Strategic counter-signaling:
- Identify overvalued claims
- Profit from corrections
- Provide market balance

### Portfolio Signaling
Diversified signal strategies:
- Spread risk across multiple claims
- Build domain expertise
- Create signal portfolios

## Advanced Concepts

### Signal Cascades
How signals influence each other:
```
Initial Signal → Attracts Attention → 
More Signals → Consensus Forms → 
Network Effects → Value Accrual
```

### Signal Decay
Time-based signal relevance:
- Recent signals may have more weight
- Historical signals provide context
- Decay rates vary by use case

### Signal Delegation
Allowing others to signal on your behalf:
```javascript
const delegation = await delegateSignaling({
  delegate: expertAddress,
  amount: 1000,
  duration: 30 * 24 * 60 * 60, // 30 days
  constraints: {
    topics: ["DeFi", "Security"],
    maxPerSignal: 100
  }
});
```

## Use Cases

### Fact Checking
Community-driven verification:
- News validation
- Claim verification
- Source authentication

### Reputation Systems
Building trust networks:
- Professional endorsements
- Skill validations
- Identity verification

### Content Curation
Quality filtering:
- Research paper validation
- Code review attestations
- Educational content rating

### Prediction Markets
Signaling future outcomes:
- Event predictions
- Trend forecasting
- Risk assessment

## Risk Management

### Signal Risks
Understanding potential downsides:
- **Stake Loss**: Wrong consensus can mean losses
- **Opportunity Cost**: Locked tokens can't be used elsewhere
- **Market Manipulation**: Whale influence on small markets

### Mitigation Strategies
Protecting your stakes:
- Diversify signal portfolio
- Research before signaling
- Start with small stakes
- Monitor consensus shifts

## Example Implementations

### Building a Fact-Checking System
```javascript
// Create a claim Triple
const claim = await createTriple({
  subjectId: newsArticle.id,
  predicateId: "claims",
  objectId: statement.id
});

// Community signals on claim validity
const proSignal = await createSignal({
  targetId: claim.id,
  direction: "positive",
  stake: 250,
  metadata: {
    sources: ["source1", "source2"],
    verifiedBy: "fact-checker-dao"
  }
});

const contraSignal = await createSignal({
  targetId: claim.id,
  direction: "negative",
  stake: 100,
  metadata: {
    reason: "Conflicting evidence",
    evidence: "ipfs://..."
  }
});

// Query consensus
const verdict = await getConsensus(claim.id);
```

### Reputation Staking
```javascript
// Create reputation Triple
const endorsement = await createTriple({
  subjectId: user.id,
  predicateId: "has-skill",
  objectId: skill.id
});

// Multiple users signal to validate
for (const endorser of endorsers) {
  await createSignal({
    targetId: endorsement.id,
    direction: "positive",
    stake: endorser.confidence * 100,
    metadata: {
      relationship: endorser.relationship,
      yearsKnown: endorser.years
    }
  });
}
```

## Integration with Other Primitives

### With Atoms
- Signals validate Atom existence and relevance
- Atom value increases with positive signals
- Signal consensus affects Atom visibility

### With Triples
- Signals verify Triple accuracy
- Triple credibility depends on signal consensus
- Disputed Triples have mixed signals

## Best Practices

### Signal Hygiene
- Research before signaling
- Document signal reasoning
- Monitor signal performance
- Adjust strategy based on results

### Portfolio Management
- Diversify across topics
- Balance risk levels
- Track signal ROI
- Rebalance periodically

### Community Engagement
- Follow signal leaders
- Share signal insights
- Participate in governance
- Contribute to standards

## Next Steps

- Review [Atoms](./atoms) and [Triples](./triples) to understand signal targets
- Explore the [GraphQL API](/docs/developer-tools/graphql-api/overview) for signal queries
- Learn about [Smart Contracts](/docs/developer-tools/contracts/contract-architecture) for on-chain signaling
- Check the [Economics](/docs/introduction/the-economics/the-economics) page for detailed tokenomics