---
id: calculating-rewards
title: Calculating Rewards
sidebar_label: Calculating Rewards
sidebar_position: 4
description: Understanding how rewards are calculated in Intuition
---

# Calculating Rewards

The reward system in Intuition incentivizes high-quality contributions and active participation in the ecosystem. Understanding how rewards are calculated helps users maximize their earnings and contribute effectively.

## Reward Fundamentals

### What are Rewards?

Rewards in Intuition are distributed in $TRUST tokens to users who:
- Create valuable atoms and triples
- Provide accurate and useful information
- Engage with the ecosystem meaningfully
- Stake tokens to back their contributions

### Reward Types

#### 1. Creation Rewards
Rewards for creating high-quality atoms and triples.

```javascript
const creationReward = await calculateCreationReward({
  atomId: "did:ethr:mainnet:0x...",
  creator: userDid,
  quality: 0.95,
  stake: 1000, // TRUST tokens
  usage: 150   // views/interactions
});
```

#### 2. Usage Rewards
Rewards for atoms and triples that are frequently used.

```javascript
const usageReward = await calculateUsageReward({
  atomId: "did:ethr:mainnet:0x...",
  timeframe: "30d",
  usage: {
    views: 500,
    references: 25,
    shares: 10
  }
});
```

#### 3. Quality Rewards
Rewards for maintaining high accuracy and relevance.

```javascript
const qualityReward = await calculateQualityReward({
  atomId: "did:ethr:mainnet:0x...",
  accuracy: 0.98,
  consensus: 0.92,
  relevance: 0.85
});
```

#### 4. Staking Rewards
Rewards for staking tokens to back contributions.

```javascript
const stakingReward = await calculateStakingReward({
  userId: userDid,
  stakedAmount: 5000, // TRUST tokens
  duration: 90, // days
  atomQuality: 0.9
});
```

## Reward Calculation Formula

### Base Reward Formula

```javascript
const baseReward = (qualityScore * stakeAmount * usageMultiplier) / totalStake;
```

### Quality Score Components

```javascript
const qualityScore = (
  accuracyScore * 0.4 +
  relevanceScore * 0.3 +
  consensusScore * 0.2 +
  noveltyScore * 0.1
);
```

### Usage Multiplier

```javascript
const usageMultiplier = Math.log(1 + totalUsage) / Math.log(10);
```

## Detailed Calculation Examples

### 1. Atom Creation Reward

```javascript
const atomReward = await calculateAtomReward({
  atom: {
    id: "did:ethr:mainnet:0x...",
    content: "Machine Learning",
    creator: userDid,
    stake: 1000
  },
  metrics: {
    views: 250,
    references: 15,
    accuracy: 0.95,
    consensus: 0.88
  },
  timeframe: "30d"
});

// Reward calculation:
// Base: 1000 TRUST (stake)
// Quality: 0.95 * 0.4 + 0.88 * 0.2 = 0.556
// Usage: log(1 + 265) / log(10) = 2.42
// Total: (1000 * 0.556 * 2.42) / 10000 = 134.6 TRUST
```

### 2. Triple Creation Reward

```javascript
const tripleReward = await calculateTripleReward({
  triple: {
    id: "did:ethr:mainnet:0x...",
    subject: "did:ethr:mainnet:0x...", // Ethereum
    predicate: "did:ethr:mainnet:0x...", // is
    object: "did:ethr:mainnet:0x...", // decentralized
    creator: userDid,
    stake: 500
  },
  metrics: {
    usage: 120,
    confidence: 0.92,
    consensus: 0.85
  }
});
```

### 3. Staking Reward

```javascript
const stakingReward = await calculateStakingReward({
  userId: userDid,
  stakedAtoms: [
    { atomId: "did:ethr:mainnet:0x...", amount: 2000, quality: 0.9 },
    { atomId: "did:ethr:mainnet:0x...", amount: 1500, quality: 0.85 }
  ],
  duration: 60, // days
  totalEcosystemStake: 100000
});
```

## Reward Distribution

### 1. Daily Distribution

```javascript
const dailyRewards = await distributeDailyRewards({
  date: "2024-01-15",
  totalPool: 10000, // TRUST tokens
  participants: activeUsers,
  metrics: dailyMetrics
});
```

### 2. Weekly Bonuses

```javascript
const weeklyBonus = await calculateWeeklyBonus({
  userId: userDid,
  week: "2024-W03",
  activities: {
    atomsCreated: 5,
    triplesCreated: 12,
    interactions: 150,
    quality: 0.92
  }
});
```

### 3. Monthly Milestones

```javascript
const monthlyMilestone = await calculateMonthlyMilestone({
  userId: userDid,
  month: "2024-01",
  achievements: {
    topContributor: true,
    qualityExcellence: true,
    communityLeader: true
  }
});
```

## Reward Optimization Strategies

### 1. Quality-First Approach

```javascript
// Focus on creating high-quality content
const qualityStrategy = {
  research: true,
  verification: true,
  communityFeedback: true,
  iterativeImprovement: true
};
```

### 2. Strategic Staking

```javascript
// Stake on promising atoms early
const stakingStrategy = {
  earlyAdoption: true,
  diversification: true,
  qualityAssessment: true,
  activeMonitoring: true
};
```

### 3. Network Building

```javascript
// Create valuable connections
const networkStrategy = {
  meaningfulTriples: true,
  crossReferences: true,
  communityEngagement: true,
  knowledgeSharing: true
};
```

## Reward Analytics

### 1. Personal Analytics

```javascript
const personalAnalytics = await getPersonalRewardAnalytics({
  userId: userDid,
  timeframe: "90d",
  metrics: ['totalEarned', 'qualityScore', 'usageRate', 'stakeROI']
});
```

### 2. Comparative Analysis

```javascript
const comparison = await compareRewardPerformance({
  users: [userDid1, userDid2, userDid3],
  timeframe: "30d",
  metrics: ['rewardRate', 'qualityScore', 'efficiency']
});
```

### 3. Predictive Modeling

```javascript
const prediction = await predictRewardGrowth({
  userId: userDid,
  timeframe: "7d",
  factors: ['currentQuality', 'usageTrend', 'stakeGrowth']
});
```

## Reward Claiming

### 1. Automatic Claims

```javascript
// Set up automatic claiming
await setupAutoClaim({
  userId: userDid,
  threshold: 100, // TRUST tokens
  frequency: "weekly"
});
```

### 2. Manual Claims

```javascript
// Manually claim rewards
const claim = await claimRewards({
  userId: userDid,
  amount: 500, // TRUST tokens
  gasEstimate: true
});
```

### 3. Batch Claims

```javascript
// Claim multiple reward types at once
const batchClaim = await batchClaimRewards({
  userId: userDid,
  types: ['creation', 'usage', 'staking', 'quality'],
  gasOptimization: true
});
```

## Reward Security

### 1. Fraud Prevention

```javascript
const fraudCheck = await detectRewardFraud({
  userId: userDid,
  patterns: ['artificial_inflation', 'sock_puppets', 'collusion']
});
```

### 2. Dispute Resolution

```javascript
const dispute = await createRewardDispute({
  rewardId: "did:ethr:mainnet:0x...",
  reason: "inaccurate_information",
  evidence: ["source1", "source2"],
  stake: 1000
});
```

### 3. Appeal Process

```javascript
const appeal = await appealRewardDecision({
  disputeId: "did:ethr:mainnet:0x...",
  newEvidence: ["additional_source"],
  communityVote: true
});
```

## Best Practices

### 1. Content Quality
- Research thoroughly before creating atoms
- Verify information from multiple sources
- Update content as new information becomes available
- Engage with the community for feedback

### 2. Strategic Participation
- Focus on high-value, underserved topics
- Build meaningful connections between atoms
- Stake tokens on quality content
- Participate in community governance

### 3. Continuous Learning
- Monitor reward performance analytics
- Adapt strategies based on results
- Learn from successful contributors
- Stay updated on protocol changes

### 4. Community Engagement
- Help other users improve their content
- Participate in discussions and feedback
- Share knowledge and best practices
- Contribute to protocol governance

## Integration Examples

### Web Application

```javascript
// React component for reward tracking
function RewardTracker({ userId }) {
  const [rewards, setRewards] = useState(null);
  
  useEffect(() => {
    const fetchRewards = async () => {
      const userRewards = await getUserRewards({
        userId,
        timeframe: "30d"
      });
      setRewards(userRewards);
    };
    
    fetchRewards();
  }, [userId]);

  return (
    <div>
      <h3>Your Rewards</h3>
      <p>Total Earned: {rewards?.total} TRUST</p>
      <p>Quality Score: {rewards?.qualityScore}</p>
      <button onClick={() => claimRewards(userId)}>
        Claim Rewards
      </button>
    </div>
  );
}
```

### Mobile Application

```javascript
// React Native reward tracking
const trackRewardActivity = async (activity) => {
  await logRewardActivity({
    userId: userDid,
    activity,
    timestamp: new Date().toISOString(),
    metadata: {
      platform: 'mobile',
      appVersion: '1.2.0'
    }
  });
};
```

## Next Steps

Now that you understand reward calculation, explore:

- [Atoms](./atoms.md) - Learn how to create valuable atoms
- [Triples](./triples.md) - Understand how to build meaningful relationships
- [Capturing Signal](./capturing-signal.md) - Discover how signal drives rewards