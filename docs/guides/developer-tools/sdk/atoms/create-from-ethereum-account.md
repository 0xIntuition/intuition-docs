---
title: Create Atom from Ethereum Account
sidebar_label: Create from Ethereum Account
sidebar_position: 3
description: Create identity atoms from Ethereum wallet addresses
keywords: [sdk, atom, ethereum, address, wallet, identity, account]
---

# Create Atom from Ethereum Account

Create an atom representing an Ethereum wallet address. This is commonly used for creating identity atoms or representing user accounts.

## Function Signature

```typescript
function createAtomFromEthereumAccount(
  config: WriteConfig,
  address: Address,
  deposit?: bigint
): Promise<AtomCreationResult>
```

## Parameters

| Parameter | Type | Description | Required |
|-----------|------|-------------|----------|
| `config` | `WriteConfig` | Client configuration | Yes |
| `address` | `Address` | Ethereum address (0x...) | Yes |
| `deposit` | `bigint` | Optional initial deposit | No |

## Returns

Standard `AtomCreationResult` with the Ethereum address as the URI.

## Basic Example

```typescript
import {
  createAtomFromEthereumAccount,
  getMultiVaultAddressFromChainId,
  intuitionTestnet,
} from '@0xintuition/sdk'
import { createPublicClient, createWalletClient, http, parseEther } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'

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

// Create atom from Ethereum address
const atom = await createAtomFromEthereumAccount(
  { walletClient, publicClient, address },
  '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
  parseEther('0.01')
)

console.log('Identity Atom ID:', atom.state.termId)
console.log('Address:', atom.uri) // 0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045
```

## Common Use Cases

### Creating User Identity Atoms

```typescript
// Create atom for user's wallet
const userAtom = await createAtomFromEthereumAccount(
  { walletClient, publicClient, address },
  walletClient.account.address
)
```

### Creating Identity for Other Users

```typescript
// Create atoms for a list of users
const users = [
  '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
  '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
]

for (const userAddress of users) {
  const atom = await createAtomFromEthereumAccount(
    { walletClient, publicClient, address },
    userAddress
  )
  console.log(`Created identity atom for ${userAddress}:`, atom.state.termId)
}
```

### Building Social Graphs

```typescript
// Create atoms for follower relationships
const alice = await createAtomFromEthereumAccount(
  config,
  '0xAlice...'
)

const bob = await createAtomFromEthereumAccount(
  config,
  '0xBob...'
)

// Then create a "follows" triple
const follows = await createAtomFromString(config, 'follows')
const triple = await createTripleStatement(config, {
  args: [
    [alice.state.termId],
    [follows.state.termId],
    [bob.state.termId],
    [parseEther('0.1')],
  ],
  value: parseEther('0.1'),
})
```

## Address Validation

The function accepts standard Ethereum addresses:

```typescript
// Valid formats
'0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'  // Checksummed
'0xd8da6bf26964af9d7eed9e03e53415d37aa96045'  // Lowercase
'0xD8DA6BF26964AF9D7EED9E03E53415D37AA96045'  // Uppercase
```

## Related Functions

- [**createAtomFromSmartContract**](./create-from-smart-contract.md) - Create atoms for contracts
- [**batchCreateAtomsFromEthereumAccounts**](./batch-creation.md#batchcreateatomsfromethereumaccounts) - Batch create account atoms
- [**calculateAtomId**](./querying.md#calculateatomid) - Calculate atom ID for an address

## See Also

- [Protocol: Atom Creation](../../protocol/api-reference/multivault/atoms.md)
- [Example: Batch Ethereum Accounts](../examples/batch-ethereum-accounts.md)
