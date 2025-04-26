---
sidebar_position: 3
---

# Triples

Triples are the relationship primitives in the Intuition protocol, connecting atoms and enabling complex data structures and relationships.

## Overview

Triples consist of:
- Subject (source atom)
- Predicate (relationship type)
- Object (target atom)

## Creating Triples

```typescript
const triple = await intuition.createTriple({
  subject: sourceAtomId,
  predicate: 'OWNS',
  object: targetAtomId
});
```

## Triple Types

### Ownership Triples
- Track asset ownership
- Manage permissions
- Enable transfers

### Relationship Triples
- Define connections
- Create hierarchies
- Build networks

### Metadata Triples
- Add properties
- Store attributes
- Track states

## Working with Triples

### Querying Triples
```typescript
// Find all triples where an atom is the subject
const triples = await intuition.findTriples({
  subject: atomId
});

// Find specific relationships
const relationships = await intuition.findTriples({
  predicate: 'OWNS'
});
```

### Updating Triples
```typescript
const updatedTriple = await intuition.updateTriple(tripleId, {
  predicate: newPredicate
});
```

### Deleting Triples
```typescript
await intuition.deleteTriple(tripleId);
```

## Best Practices

1. Use meaningful predicate names
2. Maintain consistent relationship patterns
3. Consider triple performance implications
4. Implement proper error handling 