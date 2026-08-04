---
id: create-atom
title: Create Atom
sidebar_label: Create Atom
sidebar_position: 2
description: Learn how to create atoms and manage their associated vaults
---

# Create Atom

Atoms are created through the deployed `MultiVault.createAtoms` entry point. Although the contract function accepts arrays, the same function is used for both single and batch creation.

## Prerequisites

Complete the client and contract-address setup in the [Overview](/docs/interaction-guide/overview) guide. The examples below expect a `publicClient`, a connected `walletClient`, and the deployed MultiVault `address` for the selected Intuition network.

## Cost Semantics

Read the current atom base cost immediately before creating an atom. The protocol can change this value, so it must not be hardcoded or treated as a fixed fee.

The value assigned to one atom is:

```text
assets = current atom base cost + optional additional deposit
```

The optional amount is an additional TRUST/tTRUST deposit (signal). It does not replace the required base cost. Both the per-atom `assets` entry and transaction `value` must include the full amount.

## Implementation

Use the protocol helpers to read the cost, simulate and submit `createAtoms`, and parse the resulting `AtomCreated` event:

```typescript title="multivault.ts"
import {
  eventParseAtomCreated,
  multiVaultCreateAtoms,
  multiVaultGetAtomCost,
  type WriteConfig,
} from '@0xintuition/protocol'
import { toHex } from 'viem'

export async function createAtom(
  config: WriteConfig,
  atomData: string,
  additionalDeposit = 0n,
) {
  const { address, publicClient } = config

  // Fetch the live protocol requirement instead of hardcoding it.
  const atomBaseCost = await multiVaultGetAtomCost({ address, publicClient })
  const assets = atomBaseCost + additionalDeposit

  const transactionHash = await multiVaultCreateAtoms(config, {
    args: [[toHex(atomData)], [assets]],
    value: assets,
  })

  const [created] = await eventParseAtomCreated(publicClient, transactionHash)
  if (!created) {
    throw new Error(`No AtomCreated event found for ${transactionHash}`)
  }

  return {
    transactionHash,
    termId: created.args.termId,
    atomWallet: created.args.atomWallet,
  }
}
```

## Usage Example

Pass `0n` or omit the third argument to create the atom with only its current base cost. Pass an amount to add signal at creation time:

```typescript
import type { WriteConfig } from '@0xintuition/protocol'
import { parseEther } from 'viem'
import { createAtom } from './multivault'

async function createExample(config: WriteConfig) {
  const created = await createAtom(
    config,
    'did:ethr:mainnet:0x1234567890abcdef',
    parseEther('0.1'), // Optional additional TRUST/tTRUST signal
  )

  console.log('Atom term ID:', created.termId)
  console.log('Atom wallet:', created.atomWallet)
  console.log('Transaction:', created.transactionHash)
}
```

For the higher-level SDK equivalent, `createAtomFromString` and its sibling atom helpers perform the same dynamic base-cost read internally.

## Best Practices

- Fetch the base cost immediately before submitting the transaction.
- Keep `args[1][0]` and `value` equal for a single atom.
- Treat an optional amount as additional signal, not as the base cost.
- Display amounts in TRUST on Mainnet and tTRUST on Intuition Testnet.
- Parse `AtomCreated.termId`; the current event does not return legacy `atomId` or `vaultId` fields.
- Surface simulation, insufficient-balance, RPC, and reverted-transaction errors to the user.

## Next Steps

After creating atoms, explore:

- [Create Triple](/docs/interaction-guide/create-triple) - Learn how to create relationships between atoms
- [Deposit & Return](/docs/interaction-guide/deposit-return) - Manage vault deposits and withdrawals
- [Retrieve Vault Details](/docs/interaction-guide/retrieve-vault-details) - Get comprehensive vault information

For a full reference implementation, see the [Intuition TypeScript SDK](https://github.com/0xIntuition/intuition-ts).
