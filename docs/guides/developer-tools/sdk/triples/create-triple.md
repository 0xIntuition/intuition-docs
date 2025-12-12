---
title: Create Triple Statement
sidebar_label: Create Triple
sidebar_position: 1
description: Create subject-predicate-object statements connecting atoms
keywords: [sdk, triple, create, statement, relationship, subject, predicate, object]
---

# Create Triple Statement

Create a triple (subject-predicate-object statement) connecting three atoms in a relationship.

## Function Signature

```typescript
function createTripleStatement(
  config: WriteConfig,
  args: {
    args: [
      subjects: Hex[],
      predicates: Hex[],
      objects: Hex[],
      deposits: bigint[]
    ],
    value: bigint
  }
): Promise<TripleCreationResult>
```

## Parameters

| Parameter | Type | Description | Required |
|-----------|------|-------------|----------|
| `config` | `WriteConfig` | Client configuration | Yes |
| `args.args[0]` | `Hex[]` | Subject atom IDs | Yes |
| `args.args[1]` | `Hex[]` | Predicate atom IDs | Yes |
| `args.args[2]` | `Hex[]` | Object atom IDs | Yes |
| `args.args[3]` | `bigint[]` | Deposit per triple | Yes |
| `args.value` | `bigint` | Total transaction value | Yes |

## Returns

```typescript
type TripleCreationResult = {
  transactionHash: `0x${string}`
  state: Array<{
    args: {
      tripleId: Hex
      subjectId: Hex
      predicateId: Hex
      objectId: Hex
      counterVaultId: Hex
      // Additional event fields
    }
    eventName: 'TripleCreated'
  }>
}
```

## Basic Example

Create a simple "Alice follows Bob" triple:

```typescript
import {
  createAtomFromString,
  createTripleStatement,
  getMultiVaultAddressFromChainId,
  intuitionTestnet,
} from '@0xintuition/sdk'
import { createPublicClient, createWalletClient, http, parseEther } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'

// Setup
const account = privateKeyToAccount('0x...')
const publicClient = createPublicClient({
  chain: intuitionTestnet,
  transport: http(),
})
const walletClient = createWalletClient({
  chain: intuitionTestnet,
  transport: http(),
  account,
})
const address = getMultiVaultAddressFromChainId(intuitionTestnet.id)

// Create atoms
const alice = await createAtomFromString(config, 'Alice')
const follows = await createAtomFromString(config, 'follows')
const bob = await createAtomFromString(config, 'Bob')

// Create triple: Alice follows Bob
const triple = await createTripleStatement(
  { walletClient, publicClient, address },
  {
    args: [
      [alice.state.termId],    // subjects
      [follows.state.termId],  // predicates
      [bob.state.termId],      // objects
      [parseEther('0.1')],     // deposits
    ],
    value: parseEther('0.1'),  // total value
  }
)

console.log('Triple ID:', triple.state[0].args.tripleId)
console.log('Transaction:', triple.transactionHash)
```

## Advanced Example

Create multiple triples with validation:

```typescript
import { createTripleStatement } from '@0xintuition/sdk'
import { parseEther, formatEther } from 'viem'

async function createTripleWithValidation(
  subject: Hex,
  predicate: Hex,
  object: Hex,
  deposit: bigint
) {
  try {
    // Check balance
    const balance = await publicClient.getBalance({
      address: walletClient.account.address,
    })

    if (balance < deposit) {
      throw new Error(`Insufficient balance: ${formatEther(balance)} TRUST`)
    }

    console.log('Creating triple...')
    console.log('  Subject:', subject)
    console.log('  Predicate:', predicate)
    console.log('  Object:', object)
    console.log('  Deposit:', formatEther(deposit), 'TRUST')

    const triple = await createTripleStatement(
      { walletClient, publicClient, address },
      {
        args: [
          [subject],
          [predicate],
          [object],
          [deposit],
        ],
        value: deposit,
      }
    )

    console.log('✓ Triple created successfully')
    console.log('  Triple ID:', triple.state[0].args.tripleId)
    console.log('  Counter Vault ID:', triple.state[0].args.counterVaultId)

    return triple

  } catch (error) {
    console.error('Error creating triple:', error)
    throw error
  }
}
```

## Common Use Cases

### Social Relationships

```typescript
// Alice follows Bob
const followTriple = await createTripleStatement(config, {
  args: [
    [aliceId],
    [followsId],
    [bobId],
    [parseEther('0.1')],
  ],
  value: parseEther('0.1'),
})
```

### Skill Attestations

```typescript
// Bob has skill TypeScript
const skillTriple = await createTripleStatement(config, {
  args: [
    [bobId],
    [hasSkillId],
    [typeScriptId],
    [parseEther('0.05')],
  ],
  value: parseEther('0.05'),
})
```

### Project Relationships

```typescript
// Project uses Library
const usesTriple = await createTripleStatement(config, {
  args: [
    [projectId],
    [usesId],
    [libraryId],
    [parseEther('0.2')],
  ],
  value: parseEther('0.2'),
})
```

## Understanding Triples

### Triple Components

A triple consists of three atoms:

1. **Subject**: The atom being described
2. **Predicate**: The type of relationship
3. **Object**: The target atom

### Counter Triples

Each triple automatically has a counter-triple representing the opposing position:

```typescript
const triple = await createTripleStatement(config, args)

// The main triple vault (FOR position)
const tripleId = triple.state[0].args.tripleId

// The counter vault (AGAINST position)
const counterVaultId = triple.state[0].args.counterVaultId
```

## Related Functions

- [**batchCreateTripleStatements**](./batch-create.md) - Create multiple triples
- [**getTripleDetails**](./querying.md#gettripledetails) - Query triple data
- [**calculateTripleId**](./querying.md#calculatetripleid) - Calculate triple ID
- [**calculateCounterTripleId**](./counter-triples.md) - Get counter-triple ID

## Best Practices

### 1. Create Atoms First

```typescript
// Good - atoms created first
const atom1 = await createAtomFromString(config, 'data1')
const atom2 = await createAtomFromString(config, 'data2')
const atom3 = await createAtomFromString(config, 'data3')

const triple = await createTripleStatement(config, {
  args: [[atom1.state.termId], [atom2.state.termId], [atom3.state.termId], [deposit]],
  value: deposit,
})

// Avoid - using non-existent atom IDs
const triple = await createTripleStatement(config, {
  args: [['0xinvalid...'], ['0xinvalid...'], ['0xinvalid...'], [deposit]],
  value: deposit,
}) // Will fail
```

### 2. Verify Atom IDs

```typescript
import { getAtomDetails } from '@0xintuition/sdk'

async function verifyAtoms(ids: Hex[]) {
  for (const id of ids) {
    try {
      await getAtomDetails(id)
    } catch {
      console.error('Atom does not exist:', id)
      throw new Error(`Invalid atom ID: ${id}`)
    }
  }
}

// Use before creating triple
await verifyAtoms([subjectId, predicateId, objectId])
const triple = await createTripleStatement(config, args)
```

### 3. Handle Transaction Value Correctly

```typescript
// The total value must match the sum of deposits
const depositAmount = parseEther('0.1')

const triple = await createTripleStatement(config, {
  args: [
    [subjectId],
    [predicateId],
    [objectId],
    [depositAmount],
  ],
  value: depositAmount, // Must equal the deposit
})
```

## Next Steps

- [**Batch Create Triples**](./batch-create.md) - Create multiple triples efficiently
- [**Query Triples**](./querying.md) - Fetch triple information
- [**Counter Triples**](./counter-triples.md) - Work with opposing positions
- [**Deposit into Vaults**](../vaults/deposits.md) - Add liquidity to triples

## See Also

- [Core Concepts: Triples](../../../../core-concepts/primitives/triples/fundamentals.md)
- [Protocol: Create Triples](../../protocol/api-reference/multivault/triples.md)
- [Example: Create Triple Statement](../examples/create-triple-statement.md)
