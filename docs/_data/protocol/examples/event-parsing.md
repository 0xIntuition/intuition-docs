---
title: Event Parsing Examples
sidebar_label: Event Parsing
sidebar_position: 4
description: Complete examples for parsing transaction events
keywords: [examples, events, parsing, transactions, logs]
---

# Event Parsing Examples

Complete workflows for parsing events from transaction receipts.

## Example 1: Parse Atom Creation Events

```typescript
import {
  multiVaultCreateAtoms,
  eventParseAtomCreated,
  eventParseDeposited,
} from '@0xintuition/protocol'
import { toHex, parseEther, formatEther } from 'viem'

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

// Parse AtomCreated events
const atomEvents = await eventParseAtomCreated(publicClient, txHash)
atomEvents.forEach((event) => {
  console.log('Atom ID:', event.args.termId)
  console.log('Atom URI:', event.args.termData)
  console.log('Creator:', event.args.creatorAtomId)
})

// Parse Deposited events
const depositEvents = await eventParseDeposited(publicClient, txHash)
depositEvents.forEach((event) => {
  console.log('Vault ID:', event.args.vaultId)
  console.log('Assets:', formatEther(event.args.assets))
  console.log('Shares:', formatEther(event.args.shares))
})
```

## Example 2: Parse Multiple Event Types

```typescript
import {
  eventParseAtomCreated,
  eventParseTripleCreated,
  eventParseDeposited,
  eventParseSharePriceChanged,
} from '@0xintuition/protocol'

const parseAllEvents = async (txHash: Hash) => {
  // Parse all event types in parallel
  const [atomEvents, tripleEvents, depositEvents, priceEvents] = await Promise.all([
    eventParseAtomCreated(publicClient, txHash).catch(() => []),
    eventParseTripleCreated(publicClient, txHash).catch(() => []),
    eventParseDeposited(publicClient, txHash).catch(() => []),
    eventParseSharePriceChanged(publicClient, txHash).catch(() => []),
  ])

  return {
    atoms: atomEvents,
    triples: tripleEvents,
    deposits: depositEvents,
    prices: priceEvents,
  }
}

const events = await parseAllEvents(txHash)
console.log('Transaction events:', events)
```

## Example 3: Build Activity Feed

```typescript
// Monitor recent transactions and build an activity feed
const buildActivityFeed = async (userAddress: Address, blockRange: number) => {
  const currentBlock = await publicClient.getBlockNumber()
  const fromBlock = currentBlock - BigInt(blockRange)

  // Get transaction receipts for user
  // (In production, use event logs filtering)
  const activities = []

  // Example: Track atom creations
  const atomLogs = await publicClient.getLogs({
    address: address,
    event: {
      name: 'AtomCreated',
      inputs: [
        { indexed: true, name: 'termId', type: 'bytes32' },
        { indexed: false, name: 'termData', type: 'bytes' },
        { indexed: true, name: 'creatorAtomId', type: 'bytes32' },
      ],
    },
    fromBlock,
    toBlock: currentBlock,
  })

  for (const log of atomLogs) {
    activities.push({
      type: 'atom_created',
      atomId: log.args.termId,
      creator: log.args.creatorAtomId,
      blockNumber: log.blockNumber,
      transactionHash: log.transactionHash,
    })
  }

  return activities
}

const feed = await buildActivityFeed(account.address, 1000)
console.log('Recent activity:', feed)
```

## See Also

- [Atom Events](/docs/protocol/events/atom-events)
- [Vault Events](/docs/protocol/events/vault-events)
- [Triple Events](/docs/protocol/events/triple-events)
