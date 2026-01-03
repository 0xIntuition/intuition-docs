---
title: Bonding Curves
sidebar_label: Bonding Curves
sidebar_position: 3
description: How bonding curves create markets for knowledge
keywords: [bonding curves, economics, pricing, liquidity, token mechanics]
---

import BondingCurveDemo from '@site/src/components/BondingCurveDemo';

# Bonding Curves

Bonding curves are a core economic primitive in Intuition, determining how the price of shares changes as more users stake tokens in Atom and Triple vaults.

## What is a Bonding Curve?

A bonding curve is a mathematical function that defines the relationship between the supply of tokens and their price. In Intuition:

- Price increases as more tokens are staked
- Price decreases as tokens are withdrawn
- Creates continuous liquidity
- Eliminates need for order books

## How Bonding Curves Work

### Basic Mechanics

1. **Initial Price**: First stake gets shares at base price
2. **Progressive Pricing**: Each subsequent stake pays slightly more
3. **Continuous Market**: No waiting for buyers/sellers
4. **Deterministic**: Price is always calculable from supply

### Example Progression

```
Stake 1: 100 tokens → 100 shares (price: 1.00)
Stake 2: 100 tokens → 95 shares (price: 1.05)
Stake 3: 100 tokens → 91 shares (price: 1.10)
Stake 4: 100 tokens → 87 shares (price: 1.15)
```

## Curve Types in Intuition

### Linear Curve
Simple linear progression:
- Price = basePrice + (supply * slope)
- Predictable, straightforward
- Used for most standard vaults

### Offset Progressive Curve
More complex pricing with offset:
- Allows for custom curve shapes
- Can have different growth rates
- Used for specialized vaults

## Bonding Curve Demo

<BondingCurveDemo />

## Dynamic Pricing Benefits

Intuition uses bonding curves to create dynamic pricing mechanisms that automatically adjust based on supply and demand. This sophisticated approach provides multiple benefits:

<div className="uniform-card-grid">

<div className="uniform-card">
<h3 className="uniform-card-title">Automated Market Making</h3>
<p className="uniform-card-content">
Liquidity is provided automatically through mathematical curves, eliminating the need for traditional order books or manual market makers.
</p>
<div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '1rem' }}>
<span style={{ backgroundColor: 'var(--ifm-color-emphasis-100)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.875rem', color: 'var(--ifm-color-emphasis-700)' }}>Liquidity</span>
<span style={{ backgroundColor: 'var(--ifm-color-emphasis-100)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.875rem', color: 'var(--ifm-color-emphasis-700)' }}>Automated</span>
</div>
</div>

<div className="uniform-card">
<h3 className="uniform-card-title">Early Incentives</h3>
<p className="uniform-card-content">
Early participants get better prices, encouraging adoption and rewarding pioneers who identify valuable data structures before they become widely recognized.
</p>
<div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '1rem' }}>
<span style={{ backgroundColor: 'var(--ifm-color-emphasis-100)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.875rem', color: 'var(--ifm-color-emphasis-700)' }}>Early Bird</span>
<span style={{ backgroundColor: 'var(--ifm-color-emphasis-100)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.875rem', color: 'var(--ifm-color-emphasis-700)' }}>Adoption</span>
</div>
</div>

<div className="uniform-card">
<h3 className="uniform-card-title">Supply Control</h3>
<p className="uniform-card-content">
Prices increase as more tokens are minted, preventing inflation while ensuring scarcity creates value for established data structures.
</p>
<div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '1rem' }}>
<span style={{ backgroundColor: 'var(--ifm-color-emphasis-100)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.875rem', color: 'var(--ifm-color-emphasis-700)' }}>Scarcity</span>
<span style={{ backgroundColor: 'var(--ifm-color-emphasis-100)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.875rem', color: 'var(--ifm-color-emphasis-700)' }}>Control</span>
</div>
</div>

<div className="uniform-card">
<h3 className="uniform-card-title">Economic Alignment</h3>
<p className="uniform-card-content">
Pricing automatically reflects the value of underlying assets, ensuring market mechanisms accurately represent the true worth of data and relationships.
</p>
<div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '1rem' }}>
<span style={{ backgroundColor: 'var(--ifm-color-emphasis-100)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.875rem', color: 'var(--ifm-color-emphasis-700)' }}>Value</span>
<span style={{ backgroundColor: 'var(--ifm-color-emphasis-100)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.875rem', color: 'var(--ifm-color-emphasis-700)' }}>Alignment</span>
</div>
</div>

</div>

## Economic Implications

### For Early Stakers

**Advantages:**
- Get shares at lower prices
- Earn fees from all future stakers
- Benefit from price appreciation
- Higher ownership percentage

**Risks:**
- May not attract later stakers
- TVL could remain low
- Limited fee generation if unused

### For Later Stakers

**Advantages:**
- Join proven, popular data
- Higher confidence in value
- More established signal

**Disadvantages:**
- Pay premium prices
- Lower ownership percentage
- Less potential upside

## Liquidity Benefits

### Always Available
- No need to find counterparty
- Instant stake/unstake
- Deterministic pricing
- No slippage from order books

### Price Discovery
- Continuous price updates
- Reflects real demand
- Self-balancing mechanism
- Market-driven valuations

## Curve Parameters

### Configurable Elements

1. **Base Price**: Starting price for first share
2. **Curve Slope**: Rate of price increase
3. **Curve Type**: Linear vs progressive
4. **Reserve Ratio**: Backing percentage

### Governance

- Curve parameters may be adjustable
- Community governance controls changes
- Different curves for different vault types
- Balances accessibility and sustainability

---

## Next Steps

- [Fees & Rewards](/docs/intuition-concepts/economics/fees-and-rewards) - Understanding the fee structure
- [Tokenomics](/docs/intuition-concepts/economics/tokenomics) - Learn about $TRUST token utility
- [Incentive Design](/docs/intuition-concepts/economics/incentive-design) - How economics drive consensus
