---
title: Capturing Signal
sidebar_label: Capturing
sidebar_position: 2
description: Advanced techniques for capturing and interpreting signal in the knowledge graph
keywords: [signal capture, staking, deposits, attestation, trust measurement]
---

# Capturing Signal

This guide covers advanced techniques for capturing signal from users and interpreting signal data within the Intuition ecosystem.

## Signal Capture Mechanisms

### Direct Staking
Users explicitly deposit tokens to signal support or opposition:

```typescript
// Deposit into an Atom vault
await deposit(atomVaultId, amount)

// Deposit into a Triple vault (positive side)
await deposit(tripleVaultIdFor, amount)

// Deposit into counter-triple vault (negative side)
await deposit(counterTripleVaultIdAgainst, amount)
```

### Continuous Markets

Staking is not a one-time vote but a continuous market:
- Add more stake to increase your signal
- Withdraw stake (with potential rewards or penalties)
- Counter-stake on opposite sides for Triples
- Market "odds" constantly adjust to reflect aggregated beliefs

## Interpreting Signal Strength

### Analyzing TVL (Total Value Locked)

Higher TVL generally indicates:
- Greater community interest
- More economic backing
- Higher perceived relevance or truth
- Stronger consensus (for Triples)

### Consensus Metrics

For Triples, analyze the balance between positive and negative vaults:

```typescript
const consensusScore = positiveStake / (positiveStake + negativeStake)
// Result between 0 and 1
// > 0.5 = net positive consensus
// < 0.5 = net negative consensus
// ≈ 0.5 = disputed/uncertain
```

### Attestor Quality

Consider not just the amount staked, but who is staking:
- Number of unique attestors
- Reputation of attestors
- Historical accuracy of attestors
- Domain expertise of attestors

## Advanced Applications

### Following Lists

Instead of creating 1,000 separate "following" claims, use a single Triple:

```
[User X] - [following] - [Creator Y]
```

Multiple users adjust their balances on this Triple to express following. To see all followers, examine who has positive balances.

### Tiered Preferences

Users can express varying levels of interest by staking different amounts:

```typescript
// Strong support
await deposit(tripleVaultId, 100)

// Moderate support  
await deposit(tripleVaultId, 10)

// Weak support
await deposit(tripleVaultId, 1)
```

### Prediction Markets

Signal can function as a prediction market mechanism where:
- Early accurate signals are rewarded
- Later participants pay premium prices
- Market prices reflect collective probability assessment

## Economic Dynamics

### Fee Distribution

When someone stakes on an Atom or Triple:
- Existing stakers earn fees from the new deposit
- Fee amount depends on bonding curve position
- Creates incentive to identify valuable data early

### Self-Refinement

The economic model drives system improvement:
1. Stakers who identify valuable data earn more rewards
2. Stakers on unused data earn less
3. Useful information becomes economically advantageous to support
4. Irrelevant claims naturally receive less stake

---

## Next Steps

- [Signal Rewards](./rewards) - Understand fee and reward calculations
- [Signal Fundamentals](./fundamentals) - Review signal basics
