---
sidebar_position: 5
---

# Bonding Curves

Bonding Curves are the pricing and liquidity primitives in the Intuition protocol, enabling automated market making and dynamic pricing mechanisms.

## Overview

Bonding Curves provide:
- Automated market making
- Dynamic pricing
- Liquidity provision
- Token distribution

## Creating Bonding Curves

```typescript
const curve = await intuition.createBondingCurve({
  type: 'LINEAR',
  parameters: {
    slope: 0.1,
    initialPrice: 1.0
  }
});
```

## Curve Types

### Linear Curves
- Simple linear pricing
- Predictable growth
- Easy to understand
- Stable markets

### Exponential Curves
- Accelerating growth
- Early incentives
- Viral potential
- High volatility

### Polynomial Curves
- Custom growth rates
- Flexible pricing
- Complex markets
- Advanced control

## Working with Bonding Curves

### Buying Tokens
```typescript
const purchase = await curve.buy({
  amount: 100,
  maxPrice: 2.0
});
```

### Selling Tokens
```typescript
const sale = await curve.sell({
  amount: 50,
  minPrice: 1.5
});
```

### Querying Curve State
```typescript
const state = await curve.getState();
console.log('Current price:', state.price);
console.log('Total supply:', state.supply);
```

## Best Practices

1. Choose appropriate curve types
2. Set reasonable parameters
3. Monitor market conditions
4. Implement safety checks 