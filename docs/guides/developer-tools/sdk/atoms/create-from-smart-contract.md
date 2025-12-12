---
title: Create Atom from Smart Contract
sidebar_label: Create from Smart Contract
sidebar_position: 4
description: Create atoms representing smart contracts on Ethereum
keywords: [sdk, atom, smart contract, contract, ethereum, address]
---

# Create Atom from Smart Contract

Create an atom representing a smart contract address. This allows you to create on-chain references to protocols, tokens, and other smart contracts.

## Function Signature

```typescript
function createAtomFromSmartContract(
  config: WriteConfig,
  contractAddress: Address,
  deposit?: bigint
): Promise<AtomCreationResult>
```

## Parameters

| Parameter | Type | Description | Required |
|-----------|------|-------------|----------|
| `config` | `WriteConfig` | Client configuration | Yes |
| `contractAddress` | `Address` | Smart contract address | Yes |
| `deposit` | `bigint` | Optional initial deposit | No |

## Returns

Standard `AtomCreationResult` with the contract address as the URI.

## Basic Example

```typescript
import {
  createAtomFromSmartContract,
  getMultiVaultAddressFromChainId,
  intuitionTestnet,
} from '@0xintuition/sdk'
import { parseEther } from 'viem'

// Create atom for Uniswap contract
const uniswap = await createAtomFromSmartContract(
  { walletClient, publicClient, address },
  '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984', // UNI token
  parseEther('0.01')
)

console.log('Contract Atom ID:', uniswap.state.termId)
```

## Common Use Cases

### Creating Protocol Atoms

```typescript
// Create atoms for DeFi protocols
const aave = await createAtomFromSmartContract(
  config,
  '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9' // AAVE token
)

const compound = await createAtomFromSmartContract(
  config,
  '0xc00e94Cb662C3520282E6f5717214004A7f26888' // COMP token
)
```

### Building Protocol Relationships

```typescript
// Create atoms for protocols and relationships
const protocol = await createAtomFromSmartContract(
  config,
  '0xProtocolAddress...'
)

const supports = await createAtomFromString(config, 'supports')
const erc20 = await createAtomFromString(config, 'ERC20')

// Create triple: Protocol supports ERC20
const triple = await createTripleStatement(config, {
  args: [
    [protocol.state.termId],
    [supports.state.termId],
    [erc20.state.termId],
    [parseEther('0.1')],
  ],
  value: parseEther('0.1'),
})
```

### Batch Create Contract Atoms

```typescript
import { batchCreateAtomsFromSmartContracts } from '@0xintuition/sdk'

const contracts = [
  '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984', // Uniswap
  '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9', // Aave
  '0xc00e94Cb662C3520282E6f5717214004A7f26888', // Compound
]

const result = await batchCreateAtomsFromSmartContracts(
  config,
  contracts,
  parseEther('0.01')
)

console.log('Created', result.state.length, 'contract atoms')
```

## Related Functions

- [**createAtomFromEthereumAccount**](./create-from-ethereum-account.md) - Create account atoms
- [**batchCreateAtomsFromSmartContracts**](./batch-creation.md#batchcreateatomsfromsmartcontracts) - Batch create
- [**calculateAtomId**](./querying.md#calculateatomid) - Calculate atom ID

## See Also

- [Batch Creation Example](../examples/batch-ethereum-accounts.md)
- [Protocol: Atom Management](../../protocol/api-reference/multivault/atoms.md)
