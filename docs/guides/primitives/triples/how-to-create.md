---
title: How to create
sidebar_position: 1
---

# How to create

There are multiple ways to create Triples on the Intuition platform. Choose the method that best fits your development workflow:

## Development Options

<div className="uniform-card-grid">

<div className="uniform-card">
<h3 className="uniform-card-title">SDK</h3>
<p className="uniform-card-content">
Use the Intuition SDK for a streamlined development experience with TypeScript support and built-in helpers.
</p>
<a href="/docs/developer-tools/sdks/overview" style={{ color: 'var(--ifm-color-primary)', textDecoration: 'none', fontWeight: '500' }}>Explore SDK →</a>
</div>

<div className="uniform-card">
<h3 className="uniform-card-title">Smart Contracts</h3>
<p className="uniform-card-content">
Interact directly with Intuition smart contracts for maximum control and customization.
</p>
<a href="/docs/developer-tools/contracts/contract-architecture" style={{ color: 'var(--ifm-color-primary)', textDecoration: 'none', fontWeight: '500' }}>View Smart Contracts →</a>
</div>

</div>

---

## Practical Implementation

### Creating Triples

```javascript
// Basic Triple creation
const triple = await createTriple({
  subjectId: aliceAtom.id,
  predicateId: livesInAtom.id,
  objectId: parisAtom.id
});

// With temporal context
const employmentTriple = await createTriple({
  subjectId: person.id,
  predicateId: "employed-by",
  objectId: company.id,
  metadata: {
    startDate: "2024-01-01",
    department: "Engineering"
  }
});
```

## Best Practices for Structuring Triples

### Use Precise Predicates

The Predicate Atom is crucial for clarity. Guidelines:
- **Search first**: Check if a canonical predicate already exists
- **Reuse standards**: Don't create `[works for]` if `[employee of]` is widely used
- **Converge on conventions**: Using common predicates helps data link up instead of fragmenting

The Intuition community and token mechanics organically push toward standard predicates through signal accumulation.

For a curated list of recommended predicates, visit the [**Recommended Predicates List**](https://portal.intuition.systems/explore/list/0x49487b1d5bf2734d497d6d9cfcd72cdfbaefb4d4f03ddc310398b24639173c9d-0x6bb9e11ee289fed0c12c340e063ca0f0b21ed538dc671348730caa8cb4fe68aa) on the Intuition Portal.

### One Fact Per Triple

Each Triple should capture a single discrete claim:
- ❌ "Alice isFriendOf Bob and coworker at CompanyX"
- ✅ Two separate Triples: one for friendship, another for workplace

Keeping to one relation makes staking and validation straightforward—people can agree with one link and not the other.

### Leverage Nesting for Context

When statements need qualification:
- Create auxiliary Triples rather than complicating the original
- Attach timeframes or sources through supporting Triples
- Use nested Triples for meta-information

Example: Time-bound relationships
```
Main Triple: [Alice] -- [is friend of] --> [Bob]
Context Triple: [Triple ID] -- [valid since] --> [2023]
```

### Handle Counter-Claims Wisely

Generally, you don't need to manually create "not X" Triples—the negative staking vault handles disagreement. However, sometimes a negation has specific meaning that deserves its own predicate (e.g., `[is Not Friend Of]` as a distinct relation type).

The "Counter Triple" concept is more about how the UI and indexing organize the negative vault signal than about separate data objects
