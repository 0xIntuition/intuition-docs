---
title: Practical Implementation Examples
sidebar_position: 1
---

# Practical Implementation Examples

## Creating and Querying Signals

```javascript
// Stake on an Atom
const atomSignal = await stake({
  vaultId: ethereumAtom.vaultId,
  amount: 100 // 100 TRUST tokens
});

// Stake on a Triple (positive)
const tripleSignal = await stake({
  vaultId: friendshipTriple.positiveVaultId,
  amount: 50
});

// Counter-stake (negative)
const disputeSignal = await stake({
  vaultId: claimTriple.negativeVaultId,
  amount: 75
});

// Query with confidence threshold
const trustedClaims = await query({
  minConsensus: 0.7,
  minTVL: 1000
});
```

## Building Trust-Aware Applications

```javascript
// Create a trust-filtered API
class TrustAPI {
  async getVerifiedFacts(topic, minTrust = 0.8) {
    const results = await intuition.query({
      pattern: `[*] [relatesTo] [${topic}]`,
      filters: {
        consensus: { gte: minTrust },
        attestors: { gte: 10 }
      }
    });

    return results.map(r => ({
      fact: r.triple,
      trust: r.consensus,
      evidence: r.signals
    }));
  }
}
```
