---
title: Counter Triples
sidebar_label: Counter Triples
sidebar_position: 4
description: Work with opposing positions using counter-triple vaults
keywords: [sdk, triple, counter, opposing, position, for, against]
---

# Counter Triples

Every triple has a counter-triple representing the opposing position. Users can stake either FOR or AGAINST a statement.

## calculateCounterTripleId

Calculate the counter-triple ID from a triple ID.

### Function Signature

```typescript
function calculateCounterTripleId(tripleId: Hex): Hex
```

### Parameters

| Parameter | Type | Description | Required |
|-----------|------|-------------|----------|
| `tripleId` | `Hex` | Triple ID | Yes |

### Returns

Returns the counter-triple ID (hex string).

### Basic Example

```typescript
import { calculateCounterTripleId } from '@0xintuition/sdk'

const tripleId = '0x4957d3f442acc301...'
const counterTripleId = calculateCounterTripleId(tripleId)

console.log('Main Triple ID:', tripleId)
console.log('Counter Triple ID:', counterTripleId)
```

## Understanding Counter Triples

### For and Against Positions

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

## Use Cases

### Building Prediction Markets

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

### Governance Voting

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

## Querying Counter Vault Details

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
    console.log('\n✓ Majority supports FOR')
  } else if (againstShares > forShares) {
    console.log('\n✗ Majority supports AGAINST')
  } else {
    console.log('\n= Tied')
  }
}
```

## Related Functions

- [**createTripleStatement**](./create-triple.md) - Create triples
- [**deposit**](../vaults/deposits.md) - Deposit into vaults
- [**getTripleDetails**](./querying.md) - Query triple data

## See Also

- [Core Concepts: Signals](../../../../core-concepts/primitives/signals/fundamentals.md)
- [Vault Operations](../vaults/deposits.md)
- [GraphQL: Query Positions](../../graphql-api/queries/vaults/user-positions.md)
