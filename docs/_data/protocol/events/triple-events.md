---
title: Triple Events
sidebar_label: Triple Events
sidebar_position: 2
description: API reference for triple event parsing functions
keywords: [events, triples, parsing, transaction logs]
---

# Triple Events

Functions for parsing triple-related events from transaction receipts.

## eventParseTripleCreated

Parse TripleCreated events from a transaction.

### Parameters

| Parameter | Type | Description | Required |
|-----------|------|-------------|----------|
| publicClient | `PublicClient` | Viem public client | Yes |
| txHash | `Hash` | Transaction hash | Yes |

### Returns

```typescript
Promise<Array<{
  args: {
    tripleId: bigint
    subjectId: bigint
    predicateId: bigint
    objectId: bigint
    counterVaultId: bigint
    creatorAtomId: bigint
  }
}>>
```

### Example

```typescript
import { eventParseTripleCreated } from '@0xintuition/protocol'

const events = await eventParseTripleCreated(publicClient, txHash)

events.forEach((event) => {
  console.log('Triple ID:', event.args.tripleId)
  console.log('Subject:', event.args.subjectId)
  console.log('Predicate:', event.args.predicateId)
  console.log('Object:', event.args.objectId)
  console.log('Counter vault:', event.args.counterVaultId)
})
```

---

## eventParseTripleDepositCreated

Parse TripleDepositCreated events.

### Returns

```typescript
Promise<Array<{
  args: {
    tripleId: bigint
    sender: Address
    receiver: Address
    assets: bigint
    shares: bigint
  }
}>>
```

### Example

```typescript
import { eventParseTripleDepositCreated } from '@0xintuition/protocol'

const events = await eventParseTripleDepositCreated(publicClient, txHash)

events.forEach((event) => {
  console.log('Triple ID:', event.args.tripleId)
  console.log('Deposit:', formatEther(event.args.assets))
  console.log('Shares:', formatEther(event.args.shares))
})
```

---

## See Also

- [Atom Events](/docs/guides/developer-tools/protocol/events/atom-events)
- [Vault Events](/docs/guides/developer-tools/protocol/events/vault-events)
