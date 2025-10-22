---
title: Practical Examples
sidebar_position: 5
---

# Practical Examples

## Identity Atom

```javascript
const aliceAtom = {
  atomData: "https://alice.id/profile.json",
  id: "atom_0x123...", // Deterministically generated from atomData
  vault: "0xabc...",
  signal: 1500
}
```

## Concept Atom

```javascript
const defiAtom = {
  atomData: {
    name: "DeFi",
    definition: "Decentralized Finance",
    reference: "ipfs://QmX.../defi-definition.json"
  },
  id: "atom_0x456...", // Deterministically generated from atomData
  vault: "0xdef...",
  signal: 8500
}
```

## Relationship Atom (Predicate)

```javascript
const expertInAtom = {
  atomData: "expertIn",
  id: "atom_0x789...", // Deterministically generated from "expertIn"
  vault: "0xghi...",
  signal: 3200
}
```

## Next Steps

With Atoms as your foundation, you can:
- Learn about [Triples](../triples) to create meaningful relationships between Atoms
- Explore [Signals](../signals) to understand attestation and trust mechanics
- Review [Vaults](../vaults) for staking and economic participation
- Check the [SDK Documentation](/docs/developer-tools/sdks/overview) for implementation details
