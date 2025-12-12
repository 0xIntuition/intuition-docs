---
title: Create Atom from String
sidebar_label: Create from String
sidebar_position: 1
description: Create atoms from plain text strings using the Intuition SDK
keywords: [sdk, atom, create, string, text, simple]
---

# Create Atom from String

Create an atom from a plain text string. This is the simplest way to create an atom in the Intuition protocol.

## Function Signature

```typescript
function createAtomFromString(
  config: WriteConfig,
  data: string,
  deposit?: bigint
): Promise<AtomCreationResult>
```

## Parameters

| Parameter | Type | Description | Required |
|-----------|------|-------------|----------|
| `config` | `WriteConfig` | Client configuration with wallet, public client, and contract address | Yes |
| `data` | `string` | The text string to create an atom from | Yes |
| `deposit` | `bigint` | Optional initial deposit amount in wei | No |

### WriteConfig

```typescript
type WriteConfig = {
  address: Address              // MultiVault contract address
  publicClient: PublicClient   // Viem public client
  walletClient: WalletClient   // Viem wallet client
}
```

## Returns

```typescript
type AtomCreationResult = {
  uri: string                    // The atom's URI (same as input string)
  transactionHash: `0x${string}` // Transaction hash
  state: {
    creator: Address             // Address that created the atom
    termId: Hex                  // Unique atom ID (keccak256 hash)
    atomData: Hex               // Encoded atom data
    atomWallet: Address         // Atom's dedicated vault address
  }
}
```

## Basic Example

Create a simple atom from a text string:

```typescript
import {
  createAtomFromString,
  getMultiVaultAddressFromChainId,
  intuitionTestnet,
} from '@0xintuition/sdk'
import { createPublicClient, createWalletClient, http, parseEther } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'

// Setup clients
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

// Create atom
const atom = await createAtomFromString(
  { walletClient, publicClient, address },
  'developer',
  parseEther('0.01') // Optional: 0.01 TRUST initial deposit
)

console.log('Atom ID:', atom.state.termId)
console.log('Transaction:', atom.transactionHash)
```

## Advanced Example

Create an atom with error handling and balance checking:

```typescript
import {
  createAtomFromString,
  getMultiVaultAddressFromChainId,
  intuitionTestnet,
} from '@0xintuition/sdk'
import { createPublicClient, createWalletClient, http, parseEther, formatEther } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'

async function createAtomWithChecks(atomText: string, depositAmount: bigint) {
  // Setup
  const account = privateKeyToAccount(process.env.PRIVATE_KEY as `0x${string}`)
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

  try {
    // Check balance
    const balance = await publicClient.getBalance({
      address: account.address,
    })

    if (balance < depositAmount) {
      throw new Error(
        `Insufficient balance. Have: ${formatEther(balance)} TRUST, Need: ${formatEther(depositAmount)} TRUST`
      )
    }

    console.log(`Creating atom: "${atomText}"`)
    console.log(`Initial deposit: ${formatEther(depositAmount)} TRUST`)

    // Create atom
    const atom = await createAtomFromString(
      { walletClient, publicClient, address },
      atomText,
      depositAmount
    )

    console.log('✓ Atom created successfully!')
    console.log('  Atom ID:', atom.state.termId)
    console.log('  Creator:', atom.state.creator)
    console.log('  Vault:', atom.state.atomWallet)
    console.log('  Transaction:', atom.transactionHash)

    return atom

  } catch (error) {
    console.error('Error creating atom:', error)
    throw error
  }
}

// Usage
createAtomWithChecks('TypeScript', parseEther('0.05'))
  .then(atom => console.log('Success:', atom.state.termId))
  .catch(error => console.error('Failed:', error.message))
```

## Common Use Cases

### Creating Tags or Labels

```typescript
const tag = await createAtomFromString(
  { walletClient, publicClient, address },
  'blockchain'
)
```

### Creating Simple Identifiers

```typescript
const identifier = await createAtomFromString(
  { walletClient, publicClient, address },
  'user-role-admin'
)
```

### Creating Predicates for Triples

```typescript
// Create predicate atoms for relationships
const hasSkill = await createAtomFromString(
  { walletClient, publicClient, address },
  'hasSkill'
)

const worksOn = await createAtomFromString(
  { walletClient, publicClient, address },
  'worksOn'
)

const follows = await createAtomFromString(
  { walletClient, publicClient, address },
  'follows'
)
```

### Creating Atoms Without Initial Deposit

```typescript
// No deposit - just create the atom
const atom = await createAtomFromString(
  { walletClient, publicClient, address },
  'my-simple-atom'
  // No deposit parameter
)
```

## How It Works

1. **Validation**: The function validates the input string
2. **Data Encoding**: The string is encoded as atom data
3. **Transaction**: Calls `multiVaultCreateAtoms` on the MultiVault contract
4. **Event Parsing**: Parses the `AtomCreated` event from the transaction receipt
5. **Return**: Returns the atom details including the unique atom ID

### Atom ID Calculation

The atom ID is calculated as:

```typescript
atomId = keccak256(atomData)
```

You can calculate it offline using:

```typescript
import { calculateAtomId } from '@0xintuition/sdk'

const atomId = calculateAtomId('developer')
console.log('Predicted atom ID:', atomId)
```

## Gas Considerations

Creating an atom typically costs:

- **Without deposit**: ~150,000 gas
- **With deposit**: ~200,000 gas (includes vault deposit)

At 20 gwei gas price:

- Without deposit: ~0.003 ETH
- With deposit: ~0.004 ETH + deposit amount

## Related Functions

- [**createAtomFromThing**](./create-from-thing.md) - Create rich entities with metadata
- [**calculateAtomId**](./querying.md#calculateatomid) - Calculate atom ID offline
- [**getAtomDetails**](./querying.md#getatomdetails) - Query atom information
- [**batchCreateAtomsFromStrings**](./batch-creation.md) - Create multiple atoms efficiently

## Best Practices

### 1. Use Descriptive Strings

```typescript
// Good - clear and descriptive
await createAtomFromString(config, 'JavaScript Developer')

// Avoid - too vague
await createAtomFromString(config, 'dev')
```

### 2. Check for Existing Atoms

Before creating an atom, check if it already exists:

```typescript
import { calculateAtomId, getAtomDetails } from '@0xintuition/sdk'

const atomId = calculateAtomId('developer')
const exists = await getAtomDetails(atomId)

if (exists) {
  console.log('Atom already exists:', atomId)
} else {
  const atom = await createAtomFromString(config, 'developer')
}
```

### 3. Use Consistent Casing

```typescript
// Decide on a casing convention
await createAtomFromString(config, 'blockchain')      // lowercase
await createAtomFromString(config, 'TypeScript')      // PascalCase
await createAtomFromString(config, 'web3-developer')  // kebab-case
```

### 4. Consider Initial Deposits

Initial deposits help bootstrap the vault:

```typescript
import { parseEther } from 'viem'

// Small deposit for testing
await createAtomFromString(config, 'test', parseEther('0.001'))

// Larger deposit for important atoms
await createAtomFromString(config, 'featured-project', parseEther('1'))
```

## Error Handling

Common errors and solutions:

### Insufficient Balance

```
Error: Insufficient balance
```

**Solution**: Ensure you have enough TRUST tokens for the transaction and deposit.

### Atom Already Exists

```
Error: Atom already created
```

**Solution**: The atom with this exact data already exists. You can still deposit into its vault.

### Invalid String

```
Error: Invalid atom data
```

**Solution**: Ensure the string is not empty and contains valid UTF-8 characters.

## Next Steps

- [**Create from Thing**](./create-from-thing.md) - Create rich entities with JSON-LD
- [**Batch Creation**](./batch-creation.md) - Create multiple atoms at once
- [**Querying Atoms**](./querying.md) - Fetch atom details
- [**Create Triple**](../triples/create-triple.md) - Connect atoms in relationships

## See Also

- [Protocol: multiVaultCreateAtoms](../../protocol/api-reference/multivault/atoms.md) - Low-level atom creation
- [Core Concepts: Atoms](../../../../core-concepts/primitives/atoms/fundamentals.md) - Understanding atoms
- [GraphQL: Query Atoms](../../graphql-api/queries/atoms/single-atom.md) - Query atom data
