---
title: Bonding Curves
sidebar_label: Bonding Curves
sidebar_position: 1
description: Understanding the bonding curve mechanics that power Intuition's economic model
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

- [Fees & Rewards](./fees-rewards) - Understanding the fee structure
- [Signal Rewards](../primitives/signals/rewards) - How stakers earn returns
