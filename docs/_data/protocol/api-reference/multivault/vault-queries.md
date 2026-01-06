---
title: Vault Queries
sidebar_label: Vault Queries
sidebar_position: 8
description: API reference for vault query functions
keywords: [vault, queries, term, type]
---

# Vault Queries

Functions for querying vault information and state.

## multiVaultGetVault

Get vault details.

### Parameters

| Parameter | Type | Description | Required |
|-----------|------|-------------|----------|
| config | `ReadConfig` | Contract address and publicClient | Yes |
| args | `[bytes32]` | Vault ID | Yes |

### Returns

```typescript
Promise<VaultData> // Vault information
```

### Example

```typescript
import { multiVaultGetVault } from '@0xintuition/protocol'

const vault = await multiVaultGetVault(
  { address, publicClient },
  { args: [vaultId] }
)

console.log('Vault details:', vault)
```

---

## multiVaultGetVaultType

Get vault type (atom or triple).

### Parameters

| Parameter | Type | Description | Required |
|-----------|------|-------------|----------|
| config | `ReadConfig` | Contract address and publicClient | Yes |
| args | `[bytes32]` | Vault ID | Yes |

### Returns

```typescript
Promise<bigint> // 0 for atom, 1 for triple
```

### Example

```typescript
import { multiVaultGetVaultType } from '@0xintuition/protocol'

const vaultType = await multiVaultGetVaultType(
  { address, publicClient },
  { args: [vaultId] }
)

if (vaultType === 0n) {
  console.log('This is an atom vault')
} else if (vaultType === 1n) {
  console.log('This is a triple vault')
}
```

---

## multiVaultIsTermCreated

Check if a term (atom/triple) has been created.

### Parameters

| Parameter | Type | Description | Required |
|-----------|------|-------------|----------|
| config | `ReadConfig` | Contract address and publicClient | Yes |
| args | `[bytes]` | Term data (atom URI or triple hash) | Yes |

### Returns

```typescript
Promise<boolean>
```

### Example

```typescript
import { multiVaultIsTermCreated } from '@0xintuition/protocol'
import { toHex } from 'viem'

const atomUri = toHex('TypeScript')
const exists = await multiVaultIsTermCreated(
  { address, publicClient },
  { args: [atomUri] }
)

if (exists) {
  console.log('Atom already exists - do not recreate')
} else {
  console.log('Atom does not exist - safe to create')
}
```

### Use Case Example

```typescript
// Check before creating to avoid duplicate atoms
const checkAndCreate = async (atomUri: string) => {
  const uriHex = toHex(atomUri)
  const exists = await multiVaultIsTermCreated(
    { address, publicClient },
    { args: [uriHex] }
  )

  if (exists) {
    console.log('Atom already exists')
    return null
  }

  const atomCost = await multiVaultGetAtomCost({ address, publicClient })
  const txHash = await multiVaultCreateAtoms(
    { address, walletClient, publicClient },
    {
      args: [[uriHex], [atomCost]],
      value: atomCost,
    }
  )

  return txHash
}

const txHash = await checkAndCreate('My Unique Atom')
```

---

## See Also

- [Core Concepts: Vaults](/docs/protocol/core-concepts/vaults)
- [Core Concepts: Atoms](/docs/intuition-concepts/primitives/Atoms/fundamentals)
