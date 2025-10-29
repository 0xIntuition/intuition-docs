---
title: Practical Implementation
sidebar_position: 1
---

# Practical Implementation

## Contextualization with Nested Triples

One of the most powerful features of nested Triples is the ability to add context and nuance to claims. Rather than making broad, absolute statements, you can progressively refine claims with additional layers of context.

### Progressive Context Building

Consider how trust can be contextualized at different levels:

**Level 1: Basic Trust Statement**
```
[I] -- [trust] --> [Billy]
```
This is a simple, general claim of trust without any specific context.

**Level 2: Domain-Specific Trust**
```
[I] -- [trust] --> [Billy]
[[I trust Billy]] -- [in context of] --> [Web3]
```
Here, we've added a layer of context by creating a nested Triple that specifies the domain. The trust claim now has a qualifier: it applies specifically within the Web3 ecosystem.

**Level 3: Adding Justification**
```
[I] -- [trust] --> [Billy]
[[I trust Billy]] -- [in context of] --> [Web3]
[[[I trust Billy] in context of Web3]] -- [because] --> [Intuition]
```
We can further refine by adding justification or reasoning. This creates a rich, layered claim that captures not just what you believe, but why and in what context.

### Why This Matters

This progressive contextualization allows for:
- **Precision**: Claims can be as specific or general as needed
- **Transparency**: The reasoning behind beliefs becomes explicit and verifiable
- **Flexibility**: Context can evolve without invalidating the base claim
- **Nuance**: Complex real-world relationships aren't reduced to binary yes/no statements

Instead of creating separate, disconnected claims for each variation, nested Triples build upon each other, creating a structured hierarchy that preserves the relationships between related statements.

---

## Nested Triple Example

```javascript
// Create the base claim
const friendshipClaim = await createTriple({
  subjectId: bob.id,
  predicateId: isFriendOf.id,
  objectId: alice.id
});

// Alice disputes the claim
const dispute = await createTriple({
  subjectId: alice.id,
  predicateId: disproves.id,
  objectId: friendshipClaim.id  // Reference to the Triple itself
});
```

## Building Evidence Chains

```javascript
// Create a research finding
const researchClaim = await createTriple({
  subjectId: study.id,
  predicateId: concludes.id,
  objectId: result.id
});

// Link to supporting document
const evidence = await createTriple({
  subjectId: researchClaim.id,  // Triple as subject
  predicateId: basedOn.id,
  objectId: peerReviewedPaper.id
});
```