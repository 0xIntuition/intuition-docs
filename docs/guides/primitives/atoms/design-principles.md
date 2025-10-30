---
title: Design Principles - Atomic Granularity
sidebar_position: 3
---

# Design Principles: Atomic Granularity

:::tip The Power of Flat Data
A crucial best practice is keeping information modular and atomic. You are economically incentivized to create "flatter" Atoms – each representing a single, minimal concept – rather than packing composite information into one Atom.
:::

## Why Granularity Matters

Consider representing the statement: **"Tiger Research was founded in 2021"**

### Monolithic Approach (Not Recommended)

```javascript
// One Atom containing all information
const statementAtom = {
  data: "Tiger Research was founded in 2021"
}
```

Problems with this approach:
- Hard to verify which part might be incorrect if disputed
- Cannot reuse individual components
- Difficult to update or correct specific elements
- Less composable with other data

### Atomic Approach (Best Practice)

```javascript
// Three separate Atoms
const tigerResearchAtom = { data: "Tiger Research" }
const foundedInAtom = { data: "founded in" }
const year2021Atom = { data: "2021" }

// Connected via a Triple
const foundingTriple = {
  subject: tigerResearchAtom,
  predicate: foundedInAtom,
  object: year2021Atom
}
```

Benefits of this approach:
- Each piece can be independently verified and traced
- Individual components are reusable (the `[2021]` Atom can be used in countless other triples)
- Corrections can be made to specific elements without discarding everything
- Trust accrued by each Atom benefits all its usages

## Economic Incentives for Granularity

Intuition's economic model naturally guides users toward optimal granularity:

- **Reusable Atoms** accumulate more Signal as they're referenced in multiple Triples
- **High-Signal Atoms** attract more $TRUST stakes, increasing their network gravity
- **Composite Atoms** with embedded data are less likely to be reused or staked
- **Modular Design** maximizes potential for community adoption and value accrual

## Flexibility and Scope

Atoms are not limited to static concepts. They can represent:

- **Dynamic entities**: User-generated content, evolving documents
- **Abstract concepts**: Tags, categories, classifications
- **Data structures**: JSON schemas, configuration templates
- **Content chunks**: Text snippets, code fragments (via IPFS CID)

Regardless of what an Atom represents, the principles remain consistent:
1. Give it a clear, unique identity
2. Include relevant data in the atomData field
3. Keep its scope narrow for maximum verifiability and reusability
