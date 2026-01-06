---
title: Vault Events
sidebar_label: Vault Events
sidebar_position: 3
description: API reference for vault event parsing functions
keywords: [events, vaults, deposits, redemptions, parsing]
---

# Vault Events

Functions for parsing vault-related events from transaction receipts.

## eventParseDeposited

Parse Deposited events from a transaction.

### Returns

```typescript
Promise<Array<{
  args: {
    sender: Address
    receiver: Address
    vaultId: bigint
    assets: bigint
    shares: bigint
  }
}>>
```

### Example

```typescript
import { eventParseDeposited } from '@0xintuition/protocol'

const events = await eventParseDeposited(publicClient, txHash)

events.forEach((event) => {
  console.log('Vault ID:', event.args.vaultId)
  console.log('Deposited:', formatEther(event.args.assets))
  console.log('Shares received:', formatEther(event.args.shares))
})
```

---

## eventParseRedeemed

Parse Redeemed events from a transaction.

### Returns

```typescript
Promise<Array<{
  args: {
    sender: Address
    receiver: Address
    vaultId: bigint
    assets: bigint
    shares: bigint
  }
}>>
```

### Example

```typescript
import { eventParseRedeemed } from '@0xintuition/protocol'

const events = await eventParseRedeemed(publicClient, txHash)

events.forEach((event) => {
  console.log('Vault ID:', event.args.vaultId)
  console.log('Shares redeemed:', formatEther(event.args.shares))
  console.log('Assets received:', formatEther(event.args.assets))
})
```

---

## eventParseSharePriceChanged

Parse SharePriceChanged events.

### Returns

```typescript
Promise<Array<{
  args: {
    vaultId: bigint
    oldPrice: bigint
    newPrice: bigint
  }
}>>
```

### Example

```typescript
import { eventParseSharePriceChanged } from '@0xintuition/protocol'

const events = await eventParseSharePriceChanged(publicClient, txHash)

events.forEach((event) => {
  console.log('Vault ID:', event.args.vaultId)
  console.log('Old price:', formatEther(event.args.oldPrice))
  console.log('New price:', formatEther(event.args.newPrice))
})
```

---

## See Also

- [Atom Events](/docs/protocol/events/atom-events)
- [Triple Events](/docs/protocol/events/triple-events)
- [Examples: Event Parsing](/docs/protocol/examples/event-parsing)
