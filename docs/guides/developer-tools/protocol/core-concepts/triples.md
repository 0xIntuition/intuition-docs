---
title: Triples
sidebar_label: Triples
sidebar_position: 2
description: Understanding triples - statements that connect atoms in the Intuition knowledge graph
keywords: [triples, statements, claims, subject, predicate, object, counter-triples]
---

# Triples

**Triples** are statements that connect atoms in subject-predicate-object relationships, forming the semantic layer of the Intuition knowledge graph.

## What is a Triple?

A triple is a statement composed of three atoms:

- **Subject**: The atom being described
- **Predicate**: The relationship or property type
- **Object**: The value or target atom

**Example**: `(Alice, knows, Bob)` where:
- Subject = Alice (atom)
- Predicate = knows (atom)
- Object = Bob (atom)

## Triple Structure

When you query a triple, you receive:

```typescript
const triple = await multiVaultGetTriple(
  { address, publicClient },
  { args: [tripleId] }
)
// Returns: [id, subjectId, predicateId, objectId, counterVaultId, creatorAtomId]
```

- **`id`**: The triple's unique identifier (bytes32)
- **`subjectId`**: Subject atom ID
- **`predicateId`**: Predicate atom ID
- **`objectId`**: Object atom ID
- **`counterVaultId`**: ID of the counter-triple vault (for opposing position)
- **`creatorAtomId`**: The atom ID of the triple creator

## Creating Triples

### Basic Creation

```typescript
import {
  multiVaultGetTripleCost,
  multiVaultCreateTriples,
  eventParseTripleCreated,
} from '@0xintuition/protocol'

// Assume atoms exist: Alice, knows, Bob
const subjectId = '0x1234...' // Alice
const predicateId = '0x2345...' // knows
const objectId = '0x3456...' // Bob

// 1. Get triple creation cost
const tripleCost = await multiVaultGetTripleCost({ address, publicClient })

// 2. Create triple
const txHash = await multiVaultCreateTriples(
  { address, walletClient, publicClient },
  {
    args: [
      [subjectId],
      [predicateId],
      [objectId],
      [tripleCost],
    ],
    value: tripleCost,
  }
)

// 3. Get triple ID from events
const events = await eventParseTripleCreated(publicClient, txHash)
const tripleId = events[0].args.tripleId
```

### Creation with Initial Deposit

```typescript
import { parseEther } from 'viem'

const tripleCost = await multiVaultGetTripleCost({ address, publicClient })
const initialDeposit = parseEther('0.05')
const totalAssets = tripleCost + initialDeposit

const txHash = await multiVaultCreateTriples(
  { address, walletClient, publicClient },
  {
    args: [
      [subjectId],
      [predicateId],
      [objectId],
      [totalAssets],
    ],
    value: totalAssets,
  }
)
```

## Counter-Triples

Every triple has an associated **counter-triple** representing the opposing position. Counter-triples enable users to stake against a statement.

### Checking for Counter-Triples

```typescript
import { multiVaultIsCounterTriple } from '@0xintuition/protocol'

const isCounter = await multiVaultIsCounterTriple(
  { address, publicClient },
  { args: [tripleId1, tripleId2] }
)
```

### Getting the Inverse Triple

```typescript
import { multiVaultGetInverseTripleId } from '@0xintuition/protocol'

const inverseId = await multiVaultGetInverseTripleId(
  { address, publicClient },
  { args: [tripleId] }
)
```

### Depositing to Counter-Triples

```typescript
// Get the triple details to find counter vault
const triple = await multiVaultGetTriple(
  { address, publicClient },
  { args: [tripleId] }
)
const counterVaultId = triple[4]

// Deposit to counter vault (stake against the statement)
const txHash = await multiVaultDeposit(
  { address, walletClient, publicClient },
  {
    args: [
      account.address,
      counterVaultId, // Counter-triple vault
      curveId,
      minShares,
    ],
    value: depositAmount,
  }
)
```

## Triple Vaults

Each triple has two associated vaults:

1. **For Vault**: Staking in support of the statement
2. **Against Vault** (Counter-triple): Staking against the statement

```typescript
// Check if a vault is a triple
const isTriple = await multiVaultIsTriple(
  { address, publicClient },
  { args: [vaultId] }
)
```

## Atom Deposit Fractions

When creating triples, a fraction of the deposit is automatically allocated to the constituent atoms:

```typescript
import { multiVaultGetTripleConfig } from '@0xintuition/protocol'

const config = await multiVaultGetTripleConfig({ address, publicClient })
// Returns: {
//   tripleCreationProtocolFee,
//   atomDepositFractionOnTripleCreation,
//   atomDepositFractionForTriple
// }

// Calculate atom deposit fraction
import { multiVaultAtomDepositFractionAmount } from '@0xintuition/protocol'

const fraction = await multiVaultAtomDepositFractionAmount(
  { address, publicClient },
  { args: [depositAmount] }
)
```

## Triple Creation Cost

The protocol charges a base fee to create triples:

```typescript
const cost = await multiVaultGetTripleCost({ address, publicClient })
// Returns: bigint (in wei)
```

## Common Use Cases

### Creating Social Relationships

```typescript
// (Alice, follows, Bob)
const aliceId = '0x...'
const followsId = '0x...'
const bobId = '0x...'

const txHash = await multiVaultCreateTriples(
  { address, walletClient, publicClient },
  {
    args: [[aliceId], [followsId], [bobId], [tripleCost]],
    value: tripleCost,
  }
)
```

### Creating Tags/Categories

```typescript
// (Document, hasTag, TypeScript)
const documentId = '0x...'
const hasTagId = '0x...'
const typescriptId = '0x...'

const txHash = await multiVaultCreateTriples(
  { address, walletClient, publicClient },
  {
    args: [[documentId], [hasTagId], [typescriptId], [tripleCost]],
    value: tripleCost,
  }
)
```

### Creating Attestations

```typescript
// (User, isVerified, true)
const userId = '0x...'
const isVerifiedId = '0x...'
const trueId = '0x...'

const txHash = await multiVaultCreateTriples(
  { address, walletClient, publicClient },
  {
    args: [[userId], [isVerifiedId], [trueId], [tripleCost]],
    value: tripleCost,
  }
)
```

### Batch Triple Creation

```typescript
// Create multiple triples at once
const subjects = [aliceId, bobId, charlieId]
const predicates = [followsId, followsId, followsId]
const objects = [bobId, charlieId, aliceId]
const costs = Array(3).fill(tripleCost)
const totalCost = tripleCost * 3n

const txHash = await multiVaultCreateTriples(
  { address, walletClient, publicClient },
  {
    args: [subjects, predicates, objects, costs],
    value: totalCost,
  }
)
```

## Nested Triples

Triples can reference other triples as atoms, enabling complex relationships:

```typescript
// First create: (Alice, knows, Bob)
const triple1Id = '0x...'

// Then create: (Charlie, believes, (Alice, knows, Bob))
const charlieId = '0x...'
const believesId = '0x...'

const txHash = await multiVaultCreateTriples(
  { address, walletClient, publicClient },
  {
    args: [[charlieId], [believesId], [triple1Id], [tripleCost]],
    value: tripleCost,
  }
)
```

## Related Functions

- [multiVaultCreateTriples](/docs/guides/developer-tools/protocol/api-reference/multivault/triples#multivaultcreatetriples) - Create triples
- [multiVaultGetTriple](/docs/guides/developer-tools/protocol/api-reference/multivault/triples#multivaultgettriple) - Query triple details
- [multiVaultGetTripleCost](/docs/guides/developer-tools/protocol/api-reference/multivault/triples#multivaultgettriplecost) - Get creation cost
- [multiVaultIsTriple](/docs/guides/developer-tools/protocol/api-reference/multivault/triples#multivaultistriple) - Check if vault is a triple
- [multiVaultIsCounterTriple](/docs/guides/developer-tools/protocol/api-reference/multivault/triples#multivaultiscountertriple) - Check counter-triple relationship

## Next Steps

- [Vaults](/docs/guides/developer-tools/protocol/core-concepts/vaults) - Understand triple vaults and deposits
- [API Reference](/docs/guides/developer-tools/protocol/api-reference/multivault/triples) - Explore triple functions
- [Examples](/docs/guides/developer-tools/protocol/examples/creating-atoms-triples) - See complete workflows

## See Also

- [SDK: Create Triples](/docs/guides/developer-tools/sdk/triples/create-triple) - Higher-level triple creation API
- [Core Concepts: Triples](/docs/guides/core-concepts/primitives/triples/fundamentals) - Conceptual overview of triples
- [GraphQL: Query Triples](/docs/guides/developer-tools/graphql-api/queries/triples/single-triple) - Query triple data after creation
