---
title: Atom Events
sidebar_label: Atom Events
sidebar_position: 1
description: API reference for atom event parsing functions
keywords: [events, atoms, parsing, transaction logs]
---

# Atom Events

Functions for parsing atom-related events from transaction receipts.

## eventParseAtomCreated

Parse AtomCreated events from a transaction.

### Parameters

| Parameter | Type | Description | Required |
|-----------|------|-------------|----------|
| publicClient | `PublicClient` | Viem public client | Yes |
| txHash | `Hash` | Transaction hash | Yes |

### Returns

```typescript
Promise<Array<{
  args: {
    termId: bigint
    termData: bytes
    creatorAtomId: bigint
  }
  eventName: 'AtomCreated'
  // ... other event fields
}>>
```

### Example

```typescript
import { eventParseAtomCreated } from '@0xintuition/protocol'

const events = await eventParseAtomCreated(publicClient, txHash)

events.forEach((event) => {
  console.log('Atom ID:', event.args.termId)
  console.log('Atom URI:', event.args.termData)
  console.log('Creator:', event.args.creatorAtomId)
})
```

---

## eventParseAtomDepositCreated

Parse AtomDepositCreated events (atom creation with initial deposit).

### Returns

```typescript
Promise<Array<{
  args: {
    termId: bigint
    sender: Address
    receiver: Address
    assets: bigint
    shares: bigint
  }
}>>
```

### Example

```typescript
import { eventParseAtomDepositCreated } from '@0xintuition/protocol'

const events = await eventParseAtomDepositCreated(publicClient, txHash)

events.forEach((event) => {
  console.log('Atom ID:', event.args.termId)
  console.log('Initial deposit:', formatEther(event.args.assets))
  console.log('Shares received:', formatEther(event.args.shares))
})
```

---

## Complete Example

```typescript
import {
  multiVaultCreateAtoms,
  eventParseAtomCreated,
  eventParseDeposited,
} from '@0xintuition/protocol'
import { toHex, parseEther } from 'viem'

// Create atom with deposit
const atomCost = await multiVaultGetAtomCost({ address, publicClient })
const deposit = atomCost + parseEther('1')

const txHash = await multiVaultCreateAtoms(
  { address, walletClient, publicClient },
  {
    args: [[toHex('My Atom')], [deposit]],
    value: deposit,
  }
)

// Parse all events
const atomEvents = await eventParseAtomCreated(publicClient, txHash)
const depositEvents = await eventParseDeposited(publicClient, txHash)

console.log('Created atoms:', atomEvents.map(e => e.args.termId))
console.log('Deposits:', depositEvents.map(e => formatEther(e.args.assets)))
```

---

## See Also

- [Triple Events](/docs/protocol/events/triple-events)
- [Vault Events](/docs/protocol/events/vault-events)
- [Examples: Event Parsing](/docs/protocol/examples/event-parsing)
