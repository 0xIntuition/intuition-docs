---
title: Configuration Queries
sidebar_label: Configuration
sidebar_position: 5
description: API reference for querying protocol configuration parameters
keywords: [configuration, settings, fees, parameters, protocol]
---

# Configuration Queries

Functions for querying protocol configuration settings.

## multiVaultGetGeneralConfig

Get general protocol configuration.

### Returns

```typescript
Promise<{
  admin: Address
  protocolVault: Address
  feeDenominator: bigint
  minDeposit: bigint
  minShare: bigint
}>
```

### Example

```typescript
import { multiVaultGetGeneralConfig } from '@0xintuition/protocol'

const config = await multiVaultGetGeneralConfig({ address, publicClient })

console.log('Admin:', config.admin)
console.log('Protocol vault:', config.protocolVault)
console.log('Min deposit:', formatEther(config.minDeposit))
```

---

## multiVaultGetAtomConfig

Get atom-specific configuration.

### Returns

```typescript
Promise<{
  atomUriMaxLength: bigint
  atomCreationProtocolFee: bigint
  atomCost: bigint
  atomWalletInitialDepositAmount: bigint
}>
```

### Example

```typescript
import { multiVaultGetAtomConfig } from '@0xintuition/protocol'

const config = await multiVaultGetAtomConfig({ address, publicClient })

console.log('Atom cost:', formatEther(config.atomCost))
console.log('Max URI length:', config.atomUriMaxLength)
console.log('Protocol fee:', formatEther(config.atomCreationProtocolFee))
```

---

## multiVaultGetTripleConfig

Get triple-specific configuration.

### Returns

```typescript
Promise<{
  tripleCreationProtocolFee: bigint
  atomDepositFractionOnTripleCreation: bigint
  atomDepositFractionForTriple: bigint
}>
```

### Example

```typescript
import { multiVaultGetTripleConfig } from '@0xintuition/protocol'

const config = await multiVaultGetTripleConfig({ address, publicClient })

console.log('Triple cost:', formatEther(config.tripleCreationProtocolFee))
console.log('Atom deposit fraction:', config.atomDepositFractionOnTripleCreation)
```

---

## multiVaultGetBondingCurveConfig

Get bonding curve configuration.

### Returns

```typescript
Promise<{
  registry: Address
}>
```

### Example

```typescript
import { multiVaultGetBondingCurveConfig } from '@0xintuition/protocol'

const config = await multiVaultGetBondingCurveConfig({ address, publicClient })

console.log('Curve registry:', config.registry)
```

---

## multiVaultGetWalletConfig

Get wallet configuration.

### Returns

```typescript
Promise<{
  atomWarden: Address
  atomWalletFactory: Address
}>
```

### Example

```typescript
import { multiVaultGetWalletConfig } from '@0xintuition/protocol'

const config = await multiVaultGetWalletConfig({ address, publicClient })

console.log('Atom warden:', config.atomWarden)
console.log('Wallet factory:', config.atomWalletFactory)
```

---

## multiVaultMultiCallIntuitionConfigs

Get all configurations in a single multicall.

### Returns

```typescript
Promise<{
  generalConfig: GeneralConfig
  atomConfig: AtomConfig
  tripleConfig: TripleConfig
  vaultFeeConfig: VaultFeeConfig
  bondingCurveConfig: BondingCurveConfig
  walletConfig: WalletConfig
}>
```

### Example

```typescript
import { multiVaultMultiCallIntuitionConfigs } from '@0xintuition/protocol'

const configs = await multiVaultMultiCallIntuitionConfigs({ address, publicClient })

console.log('All configurations:', configs)
```

### Advanced Example

```typescript
// Fetch and display all protocol settings
const configs = await multiVaultMultiCallIntuitionConfigs({ address, publicClient })

console.log('\nGeneral Config:')
console.log('- Admin:', configs.generalConfig.admin)
console.log('- Min deposit:', formatEther(configs.generalConfig.minDeposit))

console.log('\nAtom Config:')
console.log('- Creation cost:', formatEther(configs.atomConfig.atomCost))
console.log('- Max URI length:', configs.atomConfig.atomUriMaxLength)

console.log('\nTriple Config:')
console.log('- Creation fee:', formatEther(configs.tripleConfig.tripleCreationProtocolFee))

console.log('\nVault Fee Config:')
console.log('- Entry fee:', configs.vaultFeeConfig.entryFee)
console.log('- Exit fee:', configs.vaultFeeConfig.exitFee)

console.log('\nBonding Curve Config:')
console.log('- Registry:', configs.bondingCurveConfig.registry)

console.log('\nWallet Config:')
console.log('- Atom warden:', configs.walletConfig.atomWarden)
```

---

## See Also

- [Configuration Guide](/docs/docs/protocol/getting-started/configuration)
- [Fee Calculations](/docs/docs/protocol/api-reference/multivault/fees)
