---
title: Signal Rewards
sidebar_label: Rewards
sidebar_position: 3
description: Understanding fee structures and reward distribution for signal participants
keywords: [rewards, fees, incentives, staking rewards, bonding curves, economic model]
---

# Signal Rewards

Understanding the economic incentives and reward mechanisms is crucial for participating effectively in the Intuition signal economy.

## Fee Structure

### Entry Fees
When a user deposits tokens into an Atom or Triple vault:
- A small fee is charged on the deposit
- Fee goes to existing vault shareholders
- Incentivizes early discovery and staking

### Exit Fees
When a user withdraws their stake:
- A fee may be charged on redemption
- Helps stabilize the vault
- Discourages rapid speculation

### Protocol Fees
A portion of fees goes to:
- Protocol treasury
- Development funding
- Network maintenance

## Reward Distribution

### Share-Based Rewards

When you stake on an Atom or Triple, you receive shares:

```typescript
// Example reward calculation
const yourShares = 45
const totalShares = 1000
const ownershipPercent = yourShares / totalShares // 4.5%

// When new fees come in
const newFees = 100
const yourReward = newFees * ownershipPercent // 4.5 tokens
```

### Bonding Curve Dynamics

The bonding curve affects both:
- **Entry Price**: Later stakers pay more per share
- **Exit Price**: Early stakers can exit at profit if TVL grew

Example progression:
1. First staker: 100 tokens → 100 shares (1:1 ratio)
2. Second staker: 100 tokens → 90 shares (worse ratio)
3. Third staker: 100 tokens → 82 shares (even worse ratio)

### Value Flow Examples

**Popular Identity Atom**: 
- Thousands of Triples reference it
- Queries constantly traverse through it
- Early stakers earn fees from every interaction

**Valuable Triple**: 
- News services query it
- Financial models reference it
- Token holders earn from all usage

## Economic Incentives

### Early Discovery Rewards

- First stakers get best prices
- Accumulate more shares per token
- Earn fees from all future stakers
- Benefit from TVL growth

### Quality Curation Rewards

- Staking on useful data generates ongoing fees
- Popular Atoms/Triples attract more interaction
- More interaction = more fees to distribute
- Creates virtuous cycle for quality content

### Information as Asset Class

This creates an economy where:
- **Discovery is rewarded**: Find and stake on useful data early
- **Curation has value**: Your stake helps validate quality
- **Usage generates returns**: Popular data pays dividends
- **Information becomes an asset**: Data literally has owners who profit from its use

## Calculating Expected Returns

### Factors Affecting Returns

1. **Your Share Percentage**: Higher ownership = more fees
2. **Vault Activity**: More deposits = more fees distributed
3. **Usage Frequency**: How often the data is queried/used
4. **Time in Vault**: Longer staking = more fee events

### Risk Considerations

- **TVL Decline**: If others withdraw, share value may decrease
- **Competition**: Similar Atoms/Triples may fragment interest
- **Accuracy**: False claims may lose support over time
- **Market Dynamics**: Bonding curve means exit prices vary

## Maximizing Rewards

### Strategies

1. **Early Identification**: Stake on valuable data before others
2. **Quality Focus**: Choose Atoms/Triples likely to be used
3. **Long-Term Holding**: Benefit from accumulated fees
4. **Diversification**: Spread stake across multiple entities

### Anti-Patterns to Avoid

- Staking on duplicate/redundant data
- Following hype without substance
- Short-term speculation
- Ignoring signal quality

---

## Next Steps

- [Economics Overview](../../economics/bonding-curves) - Deep dive into bonding curve mechanics
- [Fees & Rewards](../../economics/fees-rewards) - Detailed fee structure
- [Signal Fundamentals](./fundamentals) - Review signal basics
