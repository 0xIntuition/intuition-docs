---
title: Trust Bonding Events
sidebar_label: Trust Bonding Events
sidebar_position: 4
description: API reference for Trust Bonding event parsing functions
keywords: [events, trust bonding, rewards, parsing]
---

# Trust Bonding Events

Functions for parsing Trust Bonding events from transaction receipts.

## eventParseRewardsClaimed

Parse RewardsClaimed events from a transaction.

### Returns

```typescript
Promise<Array<{
  args: {
    user: Address
    amount: bigint
    epoch: bigint
  }
}>>
```

### Example

```typescript
import { eventParseRewardsClaimed } from '@0xintuition/protocol'

const events = await eventParseRewardsClaimed(publicClient, txHash)

events.forEach((event) => {
  console.log('User:', event.args.user)
  console.log('Rewards claimed:', formatEther(event.args.amount))
  console.log('Epoch:', event.args.epoch)
})
```

---

## Generic Event Parser

For parsing any event from protocol contracts:

```typescript
import { eventParse, MultiVaultAbi, TrustBondingAbi } from '@0xintuition/protocol'

// Parse any MultiVault event
const events = await eventParse(
  publicClient,
  txHash,
  MultiVaultAbi,
  'EventName'
)

// Parse any TrustBonding event
const bondingEvents = await eventParse(
  publicClient,
  txHash,
  TrustBondingAbi,
  'EventName'
)
```

---

## See Also

- [Atom Events](/docs/protocol/events/atom-events)
- [Vault Events](/docs/protocol/events/vault-events)
- [Examples: Event Parsing](/docs/protocol/examples/event-parsing)
