---
title: Practical Implementation
sidebar_position: 1
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


