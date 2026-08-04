---
title: Working with Triples
sidebar_label: Triples
sidebar_position: 3
description: Create and query triples using the SDK
---

# Working with Triples

**Conceptual overview:** [Triples Fundamentals](/docs/intuition-concepts/primitives/Triples/fundamentals)

Triples are subject-predicate-object statements that connect three atoms to form relationships in the knowledge graph. This guide covers all ways to create and query triples using the SDK.

:::info Match SDK reads to your network
SDK read helpers use the mainnet GraphQL API by default. The write examples on this page use Intuition Testnet, so configure reads once before calling a read helper:

```typescript
import { configureSdk } from '@0xintuition/sdk'
import { API_URL_DEV } from '@0xintuition/graphql'

configureSdk({ apiUrl: API_URL_DEV })
```
:::

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
import type { WriteConfig } from '@0xintuition/sdk'
import type { Address, Hex } from 'viem'

type TripleCreationResult = {
  transactionHash: Hex
  state: Array<{
    args: {
      creator: Address
      termId: Hex
      subjectId: Hex
      predicateId: Hex
      objectId: Hex
    }
    eventName: 'TripleCreated'
  }>
}

declare function createTripleStatement(
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
import type { Address, Hex } from 'viem'

type TripleCreationResult = {
  transactionHash: `0x${string}`
  state: Array<{
    args: {
      creator: Address
      termId: Hex
      subjectId: Hex
      predicateId: Hex
      objectId: Hex
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
const config = { walletClient, publicClient, address }

// Create atoms
const alice = await createAtomFromString(config, 'Alice')
const follows = await createAtomFromString(config, 'follows')
const bob = await createAtomFromString(config, 'Bob')

// Create triple: Alice follows Bob
const triple = await createTripleStatement(
  config,
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

console.log('Triple ID:', triple.state[0].args.termId)
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
import {
  calculateCounterTripleId,
  createTripleStatement,
} from '@0xintuition/sdk'

function getPositionIds(
  triple: Awaited<ReturnType<typeof createTripleStatement>>,
) {
  // The main triple vault (FOR position)
  const tripleId = triple.state[0].args.termId

  // Derive the counter triple vault (AGAINST position)
  const counterTripleId = calculateCounterTripleId(tripleId)

  return { tripleId, counterTripleId }
}
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
import {
  createTripleStatement,
  getAtomDetails,
  type WriteConfig,
} from '@0xintuition/sdk'
import { parseEther, type Hex } from 'viem'

async function verifyAtoms(ids: Hex[]) {
  for (const id of ids) {
    const atom = await getAtomDetails(id)
    if (atom === null) {
      console.error('Atom does not exist:', id)
      throw new Error(`Invalid atom ID: ${id}`)
    }
  }
}

async function createVerifiedTriple(
  config: WriteConfig,
  subjectId: Hex,
  predicateId: Hex,
  objectId: Hex,
) {
  await verifyAtoms([subjectId, predicateId, objectId])
  const deposit = parseEther('0.1')

  return createTripleStatement(config, {
    args: [[subjectId], [predicateId], [objectId], [deposit]],
    value: deposit,
  })
}
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
import type { WriteConfig } from '@0xintuition/sdk'
import type { Address, Hex } from 'viem'

declare function batchCreateTripleStatements(
  config: WriteConfig,
  data: [
    subjects: Hex[],
    predicates: Hex[],
    objects: Hex[],
    assets: bigint[],
  ],
  depositAmount?: bigint,
): Promise<{
  transactionHash: Hex
  state: Array<{
    creator: Address
    termId: Hex
    subjectId: Hex
    predicateId: Hex
    objectId: Hex
  }>
}>
```

### Parameters

| Parameter | Type | Description | Required |
|-----------|------|-------------|----------|
| `config` | `WriteConfig` | Client configuration | Yes |
| `data[0]` | `Hex[]` | Array of subject atom IDs | Yes |
| `data[1]` | `Hex[]` | Array of predicate atom IDs | Yes |
| `data[2]` | `Hex[]` | Array of object atom IDs | Yes |
| `data[3]` | `bigint[]` | Array of asset amounts | Yes |
| `depositAmount` | `bigint` | Optional additional transaction deposit | No |

All arrays must be the same length.

### Basic Example

```typescript
import {
  batchCreateTripleStatements,
  createAtomFromString,
  type WriteConfig,
} from '@0xintuition/sdk'
import { parseEther } from 'viem'

async function createFollowTriples(config: WriteConfig) {
  const alice = await createAtomFromString(config, 'Alice')
  const bob = await createAtomFromString(config, 'Bob')
  const charlie = await createAtomFromString(config, 'Charlie')
  const follows = await createAtomFromString(config, 'follows')

  // Batch create: Alice follows Bob, Bob follows Charlie
  const result = await batchCreateTripleStatements(
    config,
    [
      [alice.state.termId, bob.state.termId],       // subjects
      [follows.state.termId, follows.state.termId], // predicates
      [bob.state.termId, charlie.state.termId],     // objects
      [parseEther('0.1'), parseEther('0.1')],        // assets
    ],
    parseEther('0.2'), // Optional additional transaction deposit
  )

  console.log('Created', result.state.length, 'triples')
  console.log('Triple IDs:', result.state.map(s => s.termId))
}
```

### Advanced Example

Build a complete knowledge graph:

```typescript
import {
  batchCreateTripleStatements,
  createAtomFromString,
  type WriteConfig,
} from '@0xintuition/sdk'
import { parseEther } from 'viem'

async function buildKnowledgeGraph(config: WriteConfig) {
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
    [
      [ts.state.termId, js.state.termId, ts.state.termId],
      [isA.state.termId, isA.state.termId, usedFor.state.termId],
      [language.state.termId, language.state.termId, web3.state.termId],
      [parseEther('0.1'), parseEther('0.1'), parseEther('0.1')],
    ],
    parseEther('0.3'),
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
function getTripleDetails(tripleId: string): Promise<TripleDetails | null>
```

#### Parameters

| Parameter | Type | Description | Required |
|-----------|------|-------------|----------|
| `tripleId` | `string` | Triple ID (hex string) | Yes |

#### Returns

```typescript
type TripleDetails = {
  subject?: { label?: string | null } | null
  predicate?: { label?: string | null } | null
  object?: { label?: string | null } | null
  term?: {
    vaults: Array<{ total_shares: string }>
  } | null
  counter_term?: {
    vaults: Array<{ total_shares: string }>
  } | null
}
```

#### Basic Example

```typescript
import { getTripleDetails } from '@0xintuition/sdk'

const tripleId = '0x4957d3f442acc301...'
const details = await getTripleDetails(tripleId)
if (!details) throw new Error('Triple not found')

const forVault = details.term?.vaults[0]
const againstVault = details.counter_term?.vaults[0]

console.log('Triple:', details.subject?.label, details.predicate?.label, details.object?.label)
console.log('For Position Shares:', forVault?.total_shares)
console.log('Against Position Shares:', againstVault?.total_shares)
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
import type { Hex } from 'viem'

async function tripleExists(
  subjectId: Hex,
  predicateId: Hex,
  objectId: Hex
): Promise<boolean> {
  const tripleId = calculateTripleId(subjectId, predicateId, objectId)
  const triple = await getTripleDetails(tripleId)
  return triple !== null
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

The payable `deposit` wrapper is pending the post-publish SDK resync, so this end-to-end deposit flow is excluded from copy-paste typechecking until that package shape is available.

<!-- docs-typecheck: skip -->
```typescript
import {
  createTripleStatement,
  calculateCounterTripleId,
  deposit,
  type WriteConfig,
} from '@0xintuition/sdk'
import { parseEther, type Hex } from 'viem'

async function createAndSignalCounter(
  config: WriteConfig,
  aliceId: Hex,
  followsId: Hex,
  bobId: Hex,
) {
  // Create triple: Alice follows Bob
  const triple = await createTripleStatement(config, {
    args: [[aliceId], [followsId], [bobId], [parseEther('0.1')]],
    value: parseEther('0.1'),
  })

  const tripleId = triple.state[0].args.termId
  const counterTripleId = calculateCounterTripleId(tripleId)

  // Deposit into FOR vault
  await deposit(config, [
    config.walletClient.account.address,
    tripleId,
    1n,
    parseEther('1'),
    0n,
  ])

  // Deposit into AGAINST vault
  await deposit(config, [
    config.walletClient.account.address,
    counterTripleId,
    1n,
    parseEther('1'),
    0n,
  ])
}
```

### Use Cases

#### Building Prediction Markets

```typescript
import {
  calculateCounterTripleId,
  createTripleStatement,
  type WriteConfig,
} from '@0xintuition/sdk'
import { parseEther, type Hex } from 'viem'

async function getPredictionVaults(
  config: WriteConfig,
  priceId: Hex,
  willId: Hex,
  goUpId: Hex,
) {
  const prediction = await createTripleStatement(config, {
    args: [[priceId], [willId], [goUpId], [parseEther('1')]],
    value: parseEther('1'),
  })

  const forId = prediction.state[0].args.termId
  const againstId = calculateCounterTripleId(forId)

  return { forId, againstId }
}
```

#### Governance Voting

```typescript
import {
  calculateCounterTripleId,
  createTripleStatement,
  type WriteConfig,
} from '@0xintuition/sdk'
import { parseEther, type Hex } from 'viem'

async function getProposalVaults(
  config: WriteConfig,
  communityId: Hex,
  acceptsId: Hex,
  proposal42Id: Hex,
) {
  const proposal = await createTripleStatement(config, {
    args: [[communityId], [acceptsId], [proposal42Id], [parseEther('10')]],
    value: parseEther('10'),
  })

  const yesVoteVault = proposal.state[0].args.termId
  const noVoteVault = calculateCounterTripleId(yesVoteVault)

  return { yesVoteVault, noVoteVault }
}
```

### Querying Counter Vault Details

```typescript
import { getTripleDetails } from '@0xintuition/sdk'
import type { Hex } from 'viem'

async function comparePositions(tripleId: Hex) {
  const details = await getTripleDetails(tripleId)
  if (!details) throw new Error('Triple not found')

  const forVault = details.term?.vaults[0]
  const againstVault = details.counter_term?.vaults[0]
  if (!forVault || !againstVault) throw new Error('Triple vaults not found')

  console.log('=== Triple ===')
  console.log(`${details.subject?.label} ${details.predicate?.label} ${details.object?.label}`)
  console.log('')
  console.log('FOR Position:')
  console.log('  Shares:', forVault.total_shares)
  console.log('  Positions:', forVault.allPositions.aggregate?.count ?? 0)
  console.log('')
  console.log('AGAINST Position:')
  console.log('  Shares:', againstVault.total_shares)
  console.log('  Positions:', againstVault.allPositions.aggregate?.count ?? 0)

  // Determine which position has more support
  const forShares = BigInt(forVault.total_shares)
  const againstShares = BigInt(againstVault.total_shares)

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

- [Working with Vaults](/docs/intuition-sdk/vaults-guide) - Deposit and redeem from vaults
- [Search and Discovery](/docs/intuition-sdk/search-guide) - Find triples
- [SDK Integrations](/docs/intuition-sdk/integrations/react) - Use with React
