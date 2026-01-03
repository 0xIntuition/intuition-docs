---
title: Working with Primitives
sidebar_label: Primitives
sidebar_position: 3
description: Create and interact with atoms, triples, and vaults using the Protocol package
---

# Working with Primitives

This guide shows how to create and interact with atoms, triples, and vaults using the Protocol package (low-level contract interactions).

**For conceptual understanding:** [Primitives Overview](/docs/guides/concepts/primitives)

## Creating Atoms

Atoms are unique identifiers for any entity. Here's how to create them with the Protocol package:

```typescript
import { multiVaultCreateAtoms } from '@0xintuition/protocol'
import { createPublicClient, createWalletClient, http } from 'viem'

// Setup clients
const publicClient = createPublicClient({
  chain: intuitionTestnet,
  transport: http(),
})

const walletClient = createWalletClient({
  chain: intuitionTestnet,
  transport: http(),
  account: yourAccount,
})

// Create an atom from a string
const atomData = {
  value: 'TypeScript',
}

const tx = await multiVaultCreateAtoms({
  publicClient,
  walletClient,
  atoms: [atomData],
})

console.log('Atom created:', tx.atomIds[0])
```

**See also:** [Atoms Concept](/docs/guides/concepts/primitives/atoms)

## Creating Triples

Triples connect three atoms to create structured claims:

```typescript
import { multiVaultCreateTriples } from '@0xintuition/protocol'

// Create a triple: [Alice] - [knows] - [Bob]
const tripleData = {
  subjectId: aliceAtomId,
  predicateId: knowsAtomId,
  objectId: bobAtomId,
}

const tx = await multiVaultCreateTriples({
  publicClient,
  walletClient,
  triples: [tripleData],
})

console.log('Triple created:', tx.tripleIds[0])
```

**See also:** [Triples Concept](/docs/guides/concepts/primitives/triples)

## Vault Operations

Every atom and triple has an associated vault for staking:

### Depositing (Signaling Support)

```typescript
import { multiVaultDeposit } from '@0xintuition/protocol'

// Deposit into an atom's vault
const depositTx = await multiVaultDeposit({
  publicClient,
  walletClient,
  vaultId: atomVaultId,
  amount: parseEther('1.0'), // 1 TRUST token
})

console.log('Deposited into vault:', depositTx.shares)
```

### Redeeming (Withdrawing)

```typescript
import { multiVaultRedeem } from '@0xintuition/protocol'

// Redeem shares from a vault
const redeemTx = await multiVaultRedeem({
  publicClient,
  walletClient,
  vaultId: atomVaultId,
  shares: sharesAmount,
})

console.log('Redeemed assets:', redeemTx.assets)
```

### Querying Vault Details

```typescript
import { getVaultDetails } from '@0xintuition/protocol'

const vaultDetails = await getVaultDetails({
  publicClient,
  vaultId: atomVaultId,
})

console.log('Total assets:', vaultDetails.totalAssets)
console.log('Total shares:', vaultDetails.totalShares)
console.log('Share price:', vaultDetails.currentSharePrice)
```

**See also:** [Signals Concept](/docs/guides/concepts/primitives/signals)

## Batch Operations

Create multiple atoms or triples in a single transaction:

```typescript
// Batch create atoms
const atoms = [
  { value: 'TypeScript' },
  { value: 'React' },
  { value: 'Solidity' },
]

const batchTx = await multiVaultCreateAtoms({
  publicClient,
  walletClient,
  atoms,
})

console.log('Created atom IDs:', batchTx.atomIds)
```

## Counter-Triples

Create opposing claims (for/against):

```typescript
// Original claim
const claim = {
  subjectId: contractAtomId,
  predicateId: isSafeAtomId,
  objectId: trueAtomId,
}

// Counter-claim (opposing)
const counterClaim = {
  subjectId: contractAtomId,
  predicateId: isSafeAtomId,
  objectId: falseAtomId,
}
```

## Events

Listen for primitive creation events:

```typescript
import { parseAtomCreatedEvent, parseTripleCreatedEvent } from '@0xintuition/protocol'

// Watch for atom creation
publicClient.watchContractEvent({
  address: multiVaultAddress,
  abi: multiVaultAbi,
  eventName: 'AtomCreated',
  onLogs: (logs) => {
    logs.forEach((log) => {
      const event = parseAtomCreatedEvent(log)
      console.log('New atom:', event.atomId, event.data)
    })
  },
})
```

## Examples

See complete examples:
- [Protocol Examples](/docs/guides/developer-tools/protocol/examples)

## SDK Alternative

For a higher-level API with React hooks, see:
- [SDK Atoms Guide](/docs/guides/developer-tools/sdk/atoms-guide)
- [SDK Triples Guide](/docs/guides/developer-tools/sdk/triples-guide)
- [SDK Vaults Guide](/docs/guides/developer-tools/sdk/vaults-guide)

## API Reference

Full API documentation:
- [MultiVault API Reference](/docs/guides/developer-tools/protocol/api-reference/multivault)
