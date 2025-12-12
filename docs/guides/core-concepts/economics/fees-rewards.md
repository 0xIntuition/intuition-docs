---
title: Fees & Rewards
sidebar_label: Fees & Rewards
sidebar_position: 2
description: Detailed breakdown of fee structures and reward mechanisms in Intuition
keywords: [fees, rewards, economics, incentives, protocol fees, staking rewards]
---

# Fees & Rewards

In the Intuition system, interactions incur fees similar to gas costs in blockchain transactions. These fees serve critical roles in maintaining system integrity, incentivizing contributions, and fostering high-quality data.

## Purpose of Fees

### Preventing Abuse and Attacks

Decentralized systems face risks such as Sybil and DoS attacks. Intuition mitigates these through economic disincentives:

- Fees deter malicious activity by imposing costs
- Network resilience: attacks inadvertently benefit the system through fee payments
- Similar to how Ethereum benefits from all transaction fees

### Encouraging Active Participation

Economic incentives motivate meaningful contributions:

- Historical challenge: Web2 platforms (Amazon, Yelp, Wikipedia) struggle with participation
- Intuition mirrors blockchain block rewards model
- Tangible incentives for creating valuable data

### Promoting High-Quality Data

Shifts focus from quantity to quality:

- Economic mechanisms discourage irrelevant data
- Rewards align with data quality and usage
- Reduces "junk data" proliferation

### Establishing Standards Through Incentives

Traditional standards creation is challenging ("standards hell"):

- Applies blockchain consensus principles to social consensus
- Financial rewards for distributed agreement
- Extends to data structures, schemas, formats, identifiers

## Fee Allocation

Intuition allocates fees in two key ways:

1. **Granting Ownership in Data**  
   Portion of fee grants users ownership of data they interact with

2. **Rewarding Data Owners**  
   Portion distributed to existing data owners

## Fee Structure Details

### Entry Fees
- Charged when depositing into vaults
- Distributed to existing shareholders
- Incentivizes early discovery
- Amount varies by bonding curve position

### Exit Fees
- May be charged on withdrawal
- Helps stabilize vaults
- Prevents rapid speculation
- Protects remaining stakers

### Protocol Fees
- Portion goes to protocol treasury
- Funds development and maintenance
- Supports ecosystem growth
- Governed by community

### Atom Deposit Fraction
- Special fee for Atom interactions
- Ensures Atom owners benefit when used in Triples
- Aligns incentives across primitives
- Creates value flow through graph structure

## Fractals Data Structure Incentives

The data model (Atoms, Triples, Signal) enables programmatic value distribution:

### Example: YouTube Video Like

1. User creates Triple: `[User] [likes] [YouTube Video]`
2. Creation fee rewards owners of component Atoms
3. Initial deposit grants Triple ownership
4. Future deposits reward this user
5. Value flows through entire structure

This ensures:
- High-quality data remains prominent
- Incentives align with accuracy
- Meaningful contributions rewarded
- Natural quality filtering

## Reward Distribution

### Share-Proportional Rewards

Rewards distributed based on ownership:

```typescript
yourReward = totalFees * (yourShares / totalShares)
```

### Temporal Advantages

Early participants benefit more:
- Better share prices
- Longer fee accumulation period
- Compound growth effects

### Usage-Based Generation

More useful data generates more fees:
- Popular Atoms referenced frequently
- Valuable Triples queried often
- Infrastructure data constantly used

## Aligning Incentives with Data Structure

Economic model motivates users to:

- **Converge on Entities**: Consensus on key data points
- **Adopt Effective References**: Best ways to structure data
- **Support Quality**: Back accurate, useful information
- **Create Standards**: Emerge organically through use

Drives fractal consensus from individual Atoms to complex nested Triples.

## Self-Regulating Ecosystem

Economic integration achieves:

- **System Security**: Fees deter attacks
- **Meaningful Contributions**: Rewards motivate quality
- **Structured Consensus**: Incentive-driven standardization
- **Sustainable Growth**: Value flows support development

---

## Next Steps

- [Bonding Curves](./bonding-curves) - Understand pricing mechanics
- [Signal Rewards](../primitives/signals/rewards) - Detailed reward calculations
- [Signal Fundamentals](../primitives/signals/fundamentals) - Economic participation
