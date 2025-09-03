---
title: Bonding Curves
sidebar_position: 2
---

# Bonding Curves

Bonding curves are the mathematical functions that govern the economic dynamics of Intuition's data primitives, creating predictable and fair pricing mechanisms for Atoms, Triples, and Signals.

## What are Bonding Curves?

A bonding curve is an algorithmic pricing mechanism that automatically adjusts the price of tokens based on supply and demand. In Intuition, bonding curves:

- **Provide Instant Liquidity**: Buy or sell at any time without counterparties
- **Enable Price Discovery**: Market determines fair value through participation
- **Reward Early Adopters**: Earlier participants get better prices
- **Prevent Manipulation**: Mathematical formulas ensure predictable pricing

## How Bonding Curves Work

### Basic Mechanics

When users interact with a bonding curve:

1. **Buying**: Price increases as supply increases
2. **Selling**: Price decreases as supply decreases
3. **Continuous**: No order books or matching required
4. **Deterministic**: Price at any supply level is known

### Mathematical Foundation

The basic bonding curve formula:
```
Price = Base Price × (Current Supply / Base Supply) ^ Curve Exponent
```

Where:
- **Base Price**: Starting price for the first unit
- **Current Supply**: Total tokens in circulation
- **Base Supply**: Reference supply for calculations
- **Curve Exponent**: Determines curve steepness

## Types of Bonding Curves

### Linear Bonding Curve
Price increases linearly with supply:
```
Price = a × Supply + b
```
- **Characteristics**: Steady, predictable growth
- **Use Case**: Stable value accrual
- **Risk Profile**: Low volatility

### Exponential Bonding Curve
Price increases exponentially:
```
Price = a × e^(b × Supply)
```
- **Characteristics**: Rapid price appreciation
- **Use Case**: Scarce, high-value data
- **Risk Profile**: High volatility

### Polynomial Bonding Curve
Flexible curve shapes:
```
Price = a × Supply^n + b
```
- **Characteristics**: Customizable growth rates
- **Use Case**: Balanced incentives
- **Risk Profile**: Moderate volatility

### Sigmoid Bonding Curve
S-shaped curve with saturation:
```
Price = Max Price / (1 + e^(-k(Supply - midpoint)))
```
- **Characteristics**: Slow start, rapid middle, plateau
- **Use Case**: Natural growth limits
- **Risk Profile**: Variable by phase

## Bonding Curves in Intuition

### Atom Bonding Curves

Each Atom has its own bonding curve:
```javascript
// Atom creation with bonding curve
const atom = await createAtom({
  data: "ethereum",
  bondingCurve: {
    type: "polynomial",
    basePrice: 0.001,
    exponent: 1.5,
    maxSupply: 1000000
  }
});
```

**Dynamics:**
- Creation mints initial supply
- Signals increase demand
- Usage drives value
- Network effects compound

### Triple Bonding Curves

Triples inherit value from constituent Atoms:
```javascript
// Triple value calculation
const tripleValue = 
  subjectAtom.value * 0.4 +
  predicateAtom.value * 0.2 +
  objectAtom.value * 0.4 +
  intrinsicValue;
```

**Factors:**
- Component Atom values
- Relationship importance
- Signal accumulation
- Usage frequency

### Signal Bonding Curves

Signals follow stake-based curves:
```javascript
// Signal staking curve
const signalCost = calculateSignalCost({
  currentSignals: 1000,
  signalStrength: 100,
  curveType: "exponential"
});
```

**Mechanics:**
- Early signals cost less
- Consensus increases price
- Counter-signals create volatility
- Time decay affects value

## Economic Implications

### For Creators

**Early Creation Advantage:**
- Lower costs for first movers
- Higher potential returns
- Network effect benefits
- Reputation building opportunity

**Value Capture:**
- Royalties from usage
- Appreciation from adoption
- Signal rewards
- Secondary market profits

### For Validators

**Signaling Strategy:**
- Early validation rewards
- Consensus alignment bonuses
- Contrarian opportunities
- Portfolio diversification

**Risk Management:**
- Stake sizing decisions
- Timing optimization
- Exit strategies
- Hedging positions

### For Consumers

**Access Costs:**
- Usage-based pricing
- Subscription models
- Bulk discounts
- Time-based access

**Value Assessment:**
- Quality indicators
- Community validation
- Historical performance
- Comparative pricing

## Advanced Features

### Dynamic Curves

Curves that adapt over time:
```javascript
// Adaptive bonding curve
const adaptiveCurve = {
  baseFormula: "polynomial",
  adjustments: {
    timeDecay: 0.01, // Daily decay
    usageBoost: 1.1, // Usage multiplier
    signalWeight: 0.5 // Signal influence
  }
};
```

### Multi-dimensional Curves

Curves with multiple variables:
```javascript
// Complex pricing model
const price = calculatePrice({
  supply: currentSupply,
  demand: recentDemand,
  quality: signalScore,
  time: age,
  competition: alternativeCount
});
```

### Curve Governance

Community-controlled parameters:
- **Proposal System**: Submit curve changes
- **Voting Mechanism**: Token-weighted decisions
- **Implementation**: Automatic execution
- **Emergency Controls**: Safety mechanisms

## Implementation Examples

### Creating an Atom with Custom Curve

```javascript
// Deploy Atom with specific curve
const customAtom = await protocol.createAtom({
  data: {
    name: "DeFi Protocol Rating",
    category: "finance"
  },
  bondingCurve: {
    type: "sigmoid",
    basePrice: 0.01,
    maxPrice: 100,
    inflectionPoint: 10000,
    steepness: 0.001
  },
  metadata: {
    description: "Community rating system for DeFi protocols",
    created: Date.now()
  }
});
```

### Calculating Optimal Entry Points

```javascript
// Analyze curve for entry
const analysis = await analyzeBondingCurve(atomId);

console.log({
  currentPrice: analysis.price,
  predictedPrice30d: analysis.forecast,
  optimalEntry: analysis.entryPoint,
  riskScore: analysis.risk
});
```

### Arbitrage Opportunities

```javascript
// Find price discrepancies
const opportunities = await findArbitrage({
  curves: [curve1, curve2],
  capital: 1000,
  slippage: 0.02
});

if (opportunities.length > 0) {
  await executeArbitrage(opportunities[0]);
}
```

## Curve Analytics

### Key Metrics

Monitor curve performance:
- **Total Value Locked**: Assets in curve
- **Price Velocity**: Rate of change
- **Volatility Index**: Price stability
- **Liquidity Depth**: Available trading volume

### Visualization Tools

Understanding curve dynamics:
```javascript
// Generate curve visualization
const chartData = generateCurveChart({
  curve: bondingCurve,
  currentSupply: 50000,
  range: [0, 100000],
  granularity: 100
});
```

### Performance Tracking

Measure curve effectiveness:
- **Adoption Rate**: New participants
- **Retention**: Continued engagement
- **Price Efficiency**: Market accuracy
- **User Satisfaction**: Community feedback

## Risk Considerations

### Volatility Risks
- Rapid price movements
- Cascade effects
- Liquidity crunches
- Market manipulation

### Mitigation Strategies
- **Circuit Breakers**: Pause mechanisms
- **Rate Limiting**: Transaction throttling
- **Reserve Pools**: Stability funds
- **Insurance**: Coverage options

## Best Practices

### For Curve Designers
- Model various scenarios
- Consider edge cases
- Implement safety mechanisms
- Document parameters clearly

### For Participants
- Understand curve mechanics
- Calculate risk/reward
- Diversify positions
- Monitor market conditions

### For Developers
- Use standard libraries
- Implement proper testing
- Handle edge cases
- Provide clear documentation

## Future Developments

### Planned Features
- **AI-Optimized Curves**: Machine learning adjustments
- **Cross-Chain Curves**: Interoperable pricing
- **Fractional Curves**: Partial ownership models
- **Meta-Curves**: Curves of curves

### Research Areas
- Game theory optimization
- Behavioral economics integration
- Zero-knowledge proofs
- Quantum-resistant algorithms

## Tools and Resources

### Curve Simulator
Test different curve parameters:
```javascript
// Simulate curve behavior
const simulation = await simulateCurve({
  type: "exponential",
  parameters: { a: 0.001, b: 0.0001 },
  transactions: 1000,
  actors: 100
});
```

### SDK Integration
```javascript
import { BondingCurve } from '@intuition/sdk';

const curve = new BondingCurve({
  type: 'polynomial',
  config: { /* parameters */ }
});

const price = curve.calculatePrice(supply);
const cost = curve.calculateCost(amount);
```

## Next Steps

- Review [Write Monetization](./write-monetization) for creator economics
- Explore [Read Monetization](./read-monetization) for consumer pricing
- Study [Economics Overview](./overview) for system context
- Check [Smart Contracts](/docs/developer-tools/contracts/contract-architecture) for implementation