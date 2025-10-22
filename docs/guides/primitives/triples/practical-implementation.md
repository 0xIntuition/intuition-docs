---
title: Practical Implementation
sidebar_position: 6
---

# Practical Implementation

## Creating Triples

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
