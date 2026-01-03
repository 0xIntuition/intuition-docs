---
title: Working with Triples
sidebar_label: Triples
sidebar_position: 3
description: Create and query triples using the SDK
---

# Working with Triples

**Conceptual overview:** [Triples Fundamentals](/docs/docs/intuition-concepts/triples/fundamentals)

Triples are subject-predicate-object statements that connect three atoms to form relationships in the knowledge graph. This guide covers all ways to create and query triples using the SDK.

## Table of Contents

- [Creating Triples](#creating-triples)
- [Batch Creation](#batch-creation)
- [Querying Triples](#querying-triples)
- [Counter-Triples](#counter-triples)

---

## Creating Triples

Create a triple (subject-predicate-object statement) connecting three atoms in a relationship.

### Function Signature

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

### Parameters

| Parameter | Type | Description | Required |
|-----------|------|-------------|----------|
| `config` | `WriteConfig` | Client configuration | Yes |
| `args.args[0]` | `Hex[]` | Subject atom IDs | Yes |
| `args.args[1]` | `Hex[]` | Predicate atom IDs | Yes |
| `args.args[2]` | `Hex[]` | Object atom IDs | Yes |
| `args.args[3]` | `bigint[]` | Deposit per triple | Yes |
| `args.value` | `bigint` | Total transaction value | Yes |

### Returns

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

### Basic Example

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

### Common Use Cases

#### Social Relationships

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

#### Skill Attestations

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

#### Project Relationships

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

### Understanding Triples

#### Triple Components

A triple consists of three atoms:

1. **Subject**: The atom being described
2. **Predicate**: The type of relationship
3. **Object**: The target atom

#### Counter Triples

Each triple automatically has a counter-triple representing the opposing position:

```typescript
const triple = await createTripleStatement(config, args)

// The main triple vault (FOR position)
const tripleId = triple.state[0].args.tripleId

// The counter vault (AGAINST position)
const counterVaultId = triple.state[0].args.counterVaultId
```

### Best Practices

#### 1. Create Atoms First

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

#### 2. Verify Atom IDs

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

#### 3. Handle Transaction Value Correctly

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

---

## Batch Creation

Create multiple triples in a single transaction for improved efficiency and reduced gas costs.

### Function Signature

```typescript
function batchCreateTripleStatements(
  config: WriteConfig,
  subjects: Hex[],
  predicates: Hex[],
  objects: Hex[],
  deposits: bigint[]
): Promise<TripleCreationResult>
```

### Parameters

| Parameter | Type | Description | Required |
|-----------|------|-------------|----------|
| `config` | `WriteConfig` | Client configuration | Yes |
| `subjects` | `Hex[]` | Array of subject atom IDs | Yes |
| `predicates` | `Hex[]` | Array of predicate atom IDs | Yes |
| `objects` | `Hex[]` | Array of object atom IDs | Yes |
| `deposits` | `bigint[]` | Array of deposit amounts | Yes |

All arrays must be the same length.

### Basic Example

```typescript
import {
  batchCreateTripleStatements,
  createAtomFromString,
} from '@0xintuition/sdk'
import { parseEther } from 'viem'

// Create atoms
const alice = await createAtomFromString(config, 'Alice')
const bob = await createAtomFromString(config, 'Bob')
const charlie = await createAtomFromString(config, 'Charlie')
const follows = await createAtomFromString(config, 'follows')

// Batch create: Alice follows Bob, Bob follows Charlie
const result = await batchCreateTripleStatements(
  config,
  [alice.state.termId, bob.state.termId],      // subjects
  [follows.state.termId, follows.state.termId], // predicates
  [bob.state.termId, charlie.state.termId],     // objects
  [parseEther('0.1'), parseEther('0.1')]        // deposits
)

console.log('Created', result.state.length, 'triples')
console.log('Triple IDs:', result.state.map(s => s.args.tripleId))
```

### Advanced Example

Build a complete knowledge graph:

```typescript
import { batchCreateTripleStatements } from '@0xintuition/sdk'
import { parseEther } from 'viem'

async function buildKnowledgeGraph() {
  // Create base atoms
  const ts = await createAtomFromString(config, 'TypeScript')
  const js = await createAtomFromString(config, 'JavaScript')
  const web3 = await createAtomFromString(config, 'Web3')

  const isA = await createAtomFromString(config, 'isA')
  const usedFor = await createAtomFromString(config, 'usedFor')

  const language = await createAtomFromString(config, 'Programming Language')
  const development = await createAtomFromString(config, 'Development')

  // Batch create relationships
  const result = await batchCreateTripleStatements(
    config,
    [ts.state.termId, js.state.termId, ts.state.termId],
    [isA.state.termId, isA.state.termId, usedFor.state.termId],
    [language.state.termId, language.state.termId, web3.state.termId],
    [parseEther('0.1'), parseEther('0.1'), parseEther('0.1')]
  )

  console.log('Knowledge graph created:', result.state.length, 'relationships')
  return result
}
```

### Gas Savings

Batch triple creation saves significant gas:

| Triples | Individual Txs | Batch Tx | Savings |
|---------|---------------|----------|---------|
| 2 | ~400k gas | ~250k gas | 37% |
| 5 | ~1M gas | ~500k gas | 50% |
| 10 | ~2M gas | ~850k gas | 57% |

---

## Querying Triples

Query triple information and calculate triple IDs.

### getTripleDetails

Fetch comprehensive triple details from the Intuition API.

#### Function Signature

```typescript
function getTripleDetails(tripleId: string): Promise<TripleDetails>
```

#### Parameters

| Parameter | Type | Description | Required |
|-----------|------|-------------|----------|
| `tripleId` | `string` | Triple ID (hex string) | Yes |

#### Returns

```typescript
type TripleDetails = {
  id: string
  subject: { id: string, label: string }
  predicate: { id: string, label: string }
  object: { id: string, label: string }
  vault: {
    totalShares: string
    positionCount: number
  }
  counterVault: {
    totalShares: string
    positionCount: number
  }
  creator: Address
  // Additional fields
}
```

#### Basic Example

```typescript
import { getTripleDetails } from '@0xintuition/sdk'

const tripleId = '0x4957d3f442acc301...'
const details = await getTripleDetails(tripleId)

console.log('Triple:', details.subject.label, details.predicate.label, details.object.label)
console.log('For Position Shares:', details.vault.totalShares)
console.log('Against Position Shares:', details.counterVault.totalShares)
```

### calculateTripleId

Calculate the triple ID from atom IDs without querying the blockchain.

#### Function Signature

```typescript
function calculateTripleId(
  subjectId: Hex,
  predicateId: Hex,
  objectId: Hex
): Hex
```

#### Basic Example

```typescript
import { calculateTripleId } from '@0xintuition/sdk'

const tripleId = calculateTripleId(
  '0x1234...', // subject
  '0x5678...', // predicate
  '0x9abc...'  // object
)

console.log('Triple ID:', tripleId)
```

#### Use Case: Check if Triple Exists

```typescript
import { calculateTripleId, getTripleDetails } from '@0xintuition/sdk'

async function tripleExists(
  subjectId: Hex,
  predicateId: Hex,
  objectId: Hex
): Promise<boolean> {
  const tripleId = calculateTripleId(subjectId, predicateId, objectId)

  try {
    await getTripleDetails(tripleId)
    return true
  } catch {
    return false
  }
}
```

---

## Counter-Triples

Every triple has a counter-triple representing the opposing position. Users can stake either FOR or AGAINST a statement.

### calculateCounterTripleId

Calculate the counter-triple ID from a triple ID.

#### Function Signature

```typescript
function calculateCounterTripleId(tripleId: Hex): Hex
```

#### Parameters

| Parameter | Type | Description | Required |
|-----------|------|-------------|----------|
| `tripleId` | `Hex` | Triple ID | Yes |

#### Basic Example

```typescript
import { calculateCounterTripleId } from '@0xintuition/sdk'

const tripleId = '0x4957d3f442acc301...'
const counterTripleId = calculateCounterTripleId(tripleId)

console.log('Main Triple ID:', tripleId)
console.log('Counter Triple ID:', counterTripleId)
```

### Understanding Counter Triples

#### For and Against Positions

When a triple is created:

- **Main Vault (FOR)**: Users who agree with the statement
- **Counter Vault (AGAINST)**: Users who disagree with the statement

Example: "Alice follows Bob"
- FOR vault: Users who believe Alice follows Bob
- AGAINST vault: Users who believe Alice does NOT follow Bob

### Depositing into Counter Vaults

```typescript
import {
  createTripleStatement,
  calculateCounterTripleId,
  deposit,
} from '@0xintuition/sdk'
import { parseEther } from 'viem'

// Create triple: Alice follows Bob
const triple = await createTripleStatement(config, {
  args: [[aliceId], [followsId], [bobId], [parseEther('0.1')]],
  value: parseEther('0.1'),
})

const tripleId = triple.state[0].args.tripleId
const counterTripleId = calculateCounterTripleId(tripleId)

// Deposit into FOR vault
await deposit(config, [
  walletClient.account.address,
  tripleId,
  1n,
  parseEther('1'),
  0n,
])

// Deposit into AGAINST vault
await deposit(config, [
  walletClient.account.address,
  counterTripleId,
  1n,
  parseEther('1'),
  0n,
])
```

### Use Cases

#### Building Prediction Markets

```typescript
// Create prediction: "Price will go up"
const prediction = await createTripleStatement(config, {
  args: [[priceId], [willId], [goUpId], [parseEther('1')]],
  value: parseEther('1'),
})

const forId = prediction.state[0].args.tripleId
const againstId = calculateCounterTripleId(forId)

// Users can deposit into either position
console.log('FOR vault:', forId)
console.log('AGAINST vault:', againstId)
```

#### Governance Voting

```typescript
// Proposal: "Accept proposal #42"
const proposal = await createTripleStatement(config, {
  args: [[communityId], [acceptsId], [proposal42Id], [parseEther('10')]],
  value: parseEther('10'),
})

const yesVoteVault = proposal.state[0].args.tripleId
const noVoteVault = calculateCounterTripleId(yesVoteVault)

// Voting is done via deposits
```

### Querying Counter Vault Details

```typescript
import { getTripleDetails, calculateCounterTripleId } from '@0xintuition/sdk'

async function comparePositions(tripleId: Hex) {
  const details = await getTripleDetails(tripleId)

  console.log('=== Triple ===')
  console.log(`${details.subject.label} ${details.predicate.label} ${details.object.label}`)
  console.log('')
  console.log('FOR Position:')
  console.log('  Shares:', details.vault.totalShares)
  console.log('  Positions:', details.vault.positionCount)
  console.log('')
  console.log('AGAINST Position:')
  console.log('  Shares:', details.counterVault.totalShares)
  console.log('  Positions:', details.counterVault.positionCount)

  // Determine which position has more support
  const forShares = BigInt(details.vault.totalShares)
  const againstShares = BigInt(details.counterVault.totalShares)

  if (forShares > againstShares) {
    console.log('\nMajority supports FOR')
  } else if (againstShares > forShares) {
    console.log('\nMajority supports AGAINST')
  } else {
    console.log('\nTied')
  }
}
```

---

## Complete Examples

See working examples in the SDK Examples section

## Next Steps

- [Working with Vaults](/docs/docs/intuition-sdk/vaults-guide) - Deposit and redeem from vaults
- [Search and Discovery](/docs/docs/intuition-sdk/search-guide) - Find triples
- [SDK Integrations](/docs/docs/intuition-sdk/integrations/react) - Use with React
