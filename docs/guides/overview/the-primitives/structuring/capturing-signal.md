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

### 1. Event Tracking

```javascript
import { trackSignal } from '@intuition/protocol';

// Track atom view
await trackSignal({
  type: 'atom_view',
  atomId: "did:ethr:mainnet:0x...",
  userId: userDid,
  metadata: {
    source: 'search',
    duration: 30,
    interaction: 'read'
  }
});

// Track triple creation
await trackSignal({
  type: 'triple_creation',
  tripleId: "did:ethr:mainnet:0x...",
  userId: userDid,
  metadata: {
    confidence: 0.9,
    evidence: ['research', 'expertise']
  }
});
```

### 2. Batch Processing

```javascript
// Process multiple signals at once
const signals = [
  { type: 'atom_view', atomId: "did:ethr:mainnet:0x...", userId: userDid },
  { type: 'atom_share', atomId: "did:ethr:mainnet:0x...", userId: userDid },
  { type: 'triple_like', tripleId: "did:ethr:mainnet:0x...", userId: userDid }
];

await processSignals(signals);
```

### 3. Real-time Streaming

```javascript
// Subscribe to real-time signal updates
const signalStream = subscribeToSignals({
  atomId: "did:ethr:mainnet:0x...",
  callback: (signal) => {
    console.log('New signal:', signal);
    updateAtomScore(signal);
  }
});
```

## Signal Processing

### 1. Aggregation

```javascript
const aggregatedSignal = await aggregateSignals({
  atomId: "did:ethr:mainnet:0x...",
  timeframe: "24h",
  metrics: ['views', 'likes', 'shares', 'references']
});
```

### 2. Normalization

```javascript
const normalizedSignal = await normalizeSignal({
  rawSignal: aggregatedSignal,
  baseline: historicalBaseline,
  factors: ['user_quality', 'time_decay', 'network_effect']
});
```

### 3. Weighting

```javascript
const weightedSignal = await applySignalWeights({
  signal: normalizedSignal,
  weights: {
    direct_interaction: 1.0,
    indirect_reference: 0.7,
    network_spread: 0.5
  }
});
```

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

```javascript
const dashboard = await createSignalDashboard({
  atomId: "did:ethr:mainnet:0x...",
  metrics: ['usage', 'quality', 'growth'],
  timeframe: 'realtime'
});
```

### 2. Historical Analysis

```javascript
const history = await getSignalHistory({
  atomId: "did:ethr:mainnet:0x...",
  timeframe: "90d",
  granularity: "hourly"
});
```

### 3. Network Mapping

```javascript
const networkMap = await createSignalNetworkMap({
  atomId: "did:ethr:mainnet:0x...",
  depth: 3,
  metrics: ['influence', 'reach', 'quality']
});
```

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

```javascript
// React component for signal tracking
function AtomViewer({ atomId }) {
  useEffect(() => {
    trackSignal({
      type: 'atom_view',
      atomId,
      userId: currentUser.did,
      metadata: {
        component: 'AtomViewer',
        duration: 0
      }
    });
  }, [atomId]);

  // Component logic...
}
```

### Mobile Application

```javascript
// React Native signal tracking
const trackAtomInteraction = async (atomId, interactionType) => {
  await trackSignal({
    type: interactionType,
    atomId,
    userId: userDid,
    metadata: {
      platform: 'mobile',
      appVersion: '1.2.0'
    }
  });
};
```

## Next Steps

Now that you understand signal capture, explore:

- [Calculating Rewards](./calculating-rewards.md) - Learn how signal translates into rewards
- [Atoms](./atoms.md) - Review atom structure fundamentals
- [Triples](./triples.md) - Understand triple relationships