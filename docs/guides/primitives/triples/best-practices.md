---
title: Best Practices for Structuring Triples
sidebar_position: 4
---

# Best Practices for Structuring Triples

## Use Precise Predicates

The Predicate Atom is crucial for clarity. Guidelines:
- **Search first**: Check if a canonical predicate already exists
- **Reuse standards**: Don't create `[worksFor]` if `[employeeOf]` is widely used
- **Converge on conventions**: Using common predicates helps data link up instead of fragmenting

The Intuition community and token mechanics organically push toward standard predicates through signal accumulation.

## One Fact Per Triple

Each Triple should capture a single discrete claim:
- ❌ "Alice isFriendOf Bob and coworker at CompanyX"
- ✅ Two separate Triples: one for friendship, another for workplace

Keeping to one relation makes staking and validation straightforward—people can agree with one link and not the other.

## Leverage Nesting for Context

When statements need qualification:
- Create auxiliary Triples rather than complicating the original
- Attach timeframes or sources through supporting Triples
- Use nested Triples for meta-information

Example: Time-bound relationships
```
Main Triple: [Alice] -- [isFriendOf] --> [Bob]
Context Triple: [Triple ID] -- [validSince] --> [2023]
```

## Handle Counter-Claims Wisely

Generally, you don't need to manually create "not X" Triples—the negative staking vault handles disagreement. However, sometimes a negation has specific meaning that deserves its own predicate (e.g., `[isNotFriendOf]` as a distinct relation type).

The "Counter Triple" concept is more about how the UI and indexing organize the negative vault signal than about separate data objects.
