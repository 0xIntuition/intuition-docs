---
sidebar_position: 2
---

# Atoms

Atoms are the fundamental building blocks of the Intuition protocol, representing the basic units of value and information in the system.

## Overview

Atoms serve as:
- Basic units of value
- Information containers
- State holders
- Transaction objects

## Creating Atoms

To create a new atom:

```typescript
const atom = await intuition.createAtom({
  type: 'data',
  content: {
    // Your atom content here
  }
});
```

## Atom Types

### Data Atoms
- Store arbitrary data
- Support versioning
- Enable state tracking

### Value Atoms
- Represent digital assets
- Track ownership
- Enable transfers

### Identity Atoms
- Store user information
- Manage permissions
- Handle authentication

## Working with Atoms

### Reading Atoms
```typescript
const atom = await intuition.getAtom(atomId);
const content = atom.content;
```

### Updating Atoms
```typescript
const updatedAtom = await intuition.updateAtom(atomId, {
  content: newContent
});
```

### Deleting Atoms
```typescript
await intuition.deleteAtom(atomId);
```

## Best Practices

1. Always validate atom content before creation
2. Implement proper error handling
3. Use appropriate atom types for your use case
4. Follow security guidelines for sensitive data 