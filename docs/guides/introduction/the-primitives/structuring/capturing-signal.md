---
id: capturing-signal
title: Capturing Signal
sidebar_label: Capturing Signal
sidebar_position: 3
description: Understanding how to capture and measure signal in Intuition
---

# Capturing Signal

Signal capture is the process of measuring and quantifying how users interact with atoms and triples in the Intuition ecosystem. This data drives the reward system and helps identify the most valuable and relevant information.

## What is Signal?

Signal represents the collective behavior and preferences of users interacting with the Intuition protocol. It includes:

- **Usage Patterns**: How often atoms and triples are accessed
- **User Engagement**: Time spent, interactions, and feedback
- **Quality Indicators**: Accuracy, relevance, and usefulness
- **Network Effects**: How data spreads and influences other users

## Signal Types

### 1. Direct Signal
Explicit user actions that directly indicate value.

```javascript
// User explicitly rates an atom
const rating = await rateAtom({
  atomId: "did:ethr:mainnet:0x...",
  rating: 5, // 1-5 scale
  userId: userDid,
  timestamp: new Date().toISOString()
});
```

### 2. Implicit Signal
Inferred from user behavior patterns.

```javascript
// User searches for and views an atom
const view = await trackAtomView({
  atomId: "did:ethr:mainnet:0x...",
  userId: userDid,
  duration: 45, // seconds
  context: "search_result"
});
```

### 3. Network Signal
Signal derived from how data flows through the network.

```javascript
// Atom is referenced in a triple
const reference = await trackAtomReference({
  atomId: "did:ethr:mainnet:0x...",
  tripleId: "did:ethr:mainnet:0x...",
  context: "subject"
});
```

## Signal Metrics

### Usage Metrics

#### Frequency
```javascript
const frequency = await calculateAtomFrequency({
  atomId: "did:ethr:mainnet:0x...",
  timeframe: "30d",
  metric: "views"
});
```

#### Duration
```javascript
const avgDuration = await calculateAverageDuration({
  atomId: "did:ethr:mainnet:0x...",
  timeframe: "7d"
});
```

#### Reach
```javascript
const reach = await calculateAtomReach({
  atomId: "did:ethr:mainnet:0x...",
  timeframe: "24h"
});
```

### Quality Metrics

#### Accuracy Score
```javascript
const accuracy = await calculateAccuracyScore({
  atomId: "did:ethr:mainnet:0x...",
  method: "community_consensus"
});
```

#### Relevance Score
```javascript
const relevance = await calculateRelevanceScore({
  atomId: "did:ethr:mainnet:0x...",
  context: "search_query",
  userProfile: userProfile
});
```

#### Consensus Score
```javascript
const consensus = await calculateConsensusScore({
  atomId: "did:ethr:mainnet:0x...",
  metric: "agreement_rate"
});
```

## Signal Collection Methods

### 1. Event Tracking (Conceptual)

Event collection endpoints are not exposed as an SDK API. The signals you see in the UI are derived from on-chain deposits/redemptions and graph events. Use GraphQL to query signals data.

### 2. Query Signals (GraphQL)

```ts
import { configureClient, createServerClient, API_URL_DEV, GetSignalsDocument } from '@0xintuition/graphql'

configureClient({ apiUrl: API_URL_DEV })
const client = createServerClient({})

const data = await client.request(GetSignalsDocument, { limit: 10 })
console.log('Signals returned:', data.signals.length)
```

### 3. Real-time Streaming

Real-time streams are not part of the public SDK; poll GraphQL or subscribe via your own infra.

## Signal Processing

### 1. Aggregation

Aggregation helpers shown below are conceptual. Use GraphQL aggregations where available.

### 2. Normalization

Normalization is application-specific. No public SDK function currently exists.

### 3. Weighting

Weighting strategies are left to the integrator.

## Signal Analytics

### 1. Trend Analysis

```javascript
const trends = await analyzeSignalTrends({
  atomId: "did:ethr:mainnet:0x...",
  timeframe: "30d",
  metrics: ['usage', 'quality', 'reach']
});
```

### 2. Comparative Analysis

```javascript
const comparison = await compareSignals({
  atoms: ["did:ethr:mainnet:0x...", "did:ethr:mainnet:0x..."],
  metrics: ['engagement', 'accuracy', 'consensus']
});
```

### 3. Predictive Modeling

```javascript
const prediction = await predictSignalGrowth({
  atomId: "did:ethr:mainnet:0x...",
  timeframe: "7d",
  factors: ['current_trend', 'network_effects', 'quality_score']
});
```

## Signal Quality Assurance

### 1. Spam Detection

```javascript
const isSpam = await detectSignalSpam({
  userId: userDid,
  signalType: 'atom_view',
  patterns: ['bot_behavior', 'artificial_inflation']
});
```

### 2. Sybil Resistance

```javascript
const sybilScore = await calculateSybilResistance({
  userId: userDid,
  factors: ['stake_amount', 'reputation_score', 'behavior_patterns']
});
```

### 3. Quality Validation

```javascript
const qualityScore = await validateSignalQuality({
  signal: userSignal,
  criteria: ['authenticity', 'relevance', 'consistency']
});
```

## Signal Visualization

### 1. Real-time Dashboards

Build dashboards using GraphQL queries and your preferred charting library.

### 2. Historical Analysis

Use GraphQL date filters and ordering to build historical views.

### 3. Network Mapping

No public helper exists; derive network relationships via triples queries.

## Best Practices

### 1. Privacy-First Design
- Anonymize user data when possible
- Use differential privacy techniques
- Respect user consent and preferences

### 2. Efficient Processing
- Implement real-time processing where needed
- Use batch processing for historical analysis
- Optimize for scale and performance

### 3. Quality Over Quantity
- Focus on meaningful signal patterns
- Filter out noise and spam
- Prioritize high-quality interactions

### 4. Continuous Improvement
- Regularly update signal models
- Incorporate user feedback
- Adapt to changing patterns

## Integration Examples

### Web Application

Use the `useGetSignalsQuery` React hook from `@0xintuition/graphql` for UI displays.

### Mobile Application

Mobile integrations query the same GraphQL endpoints; no mobile-specific SDK is required.

## Next Steps

Now that you understand signal capture, explore:

- [Calculating Rewards](./calculating-rewards.md) - Learn how signal translates into rewards
- [Atoms](./atoms.md) - Review atom structure fundamentals
- [Triples](./triples.md) - Understand triple relationships
