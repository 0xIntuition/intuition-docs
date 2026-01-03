---
id: retrieve-vault-details
title: Retrieve Vault Details
sidebar_label: Retrieve Vault Details
sidebar_position: 5
description: Get comprehensive vault information including assets, prices, and positions
---

# Retrieve Vault Details

The Intuition protocol's EthMultiVault contract manages complex state involving Atoms, Triples, and their associated vaults. When interacting with these primitives, we recommend retrieving the state data directly from the EthMultiVault contract.

We utilize multicall operations that batch multiple read-only contract calls into a single request. This approach significantly reduces RPC calls and provides data you'll need for contract interactions, such as the `atomCost` that is referenced in the contract interaction guides.

## Implementation

This implementation guide assumes that you've completed the steps in the [Overview](/guides/developer-tools/interactions/overview) guide. Steps for creating the `createMultivaultContract` and the `publicClient` referenced in this implementation example can be found in the overview.

We recommend creating a `multivault.ts` that includes the following:

<div style={{ backgroundColor: 'var(--ifm-color-emphasis-50)', padding: '1.5rem', borderRadius: '8px', marginTop: '2rem', marginBottom: '2rem' }}>
<h3 style={{ marginTop: 0, marginBottom: '1rem' }}>Core Multicall Configuration</h3>
<div style={{ backgroundColor: 'var(--ifm-background-color)', padding: '1rem', borderRadius: '6px', border: '1px solid var(--ifm-color-emphasis-300)' }}>
<pre style={{ margin: 0, fontSize: '0.9rem', fontFamily: 'monospace' }}>
{`// createMultiVaultcontract
const multiVaultContract = createMultiVaultContract(contract)

// Core multicall configuration
const coreContractConfigs = [
  {
    ...multiVaultContract,
    functionName: 'vaults',
    args: [vid],
  },
  {
    ...multiVaultContract, 
    functionName: 'currentSharePrice',
    args: [vid],
  },
  // ... additional calls
]

// Execute multicall
const resp: MulticallResponse[] = await publicClient.multicall({
  contracts: coreContractConfigs,
})`}
</pre>
</div>
</div>

## Complete Example

Here is a full example of the multicall pattern used in the `getMultivaultConfig` function:

<div style={{ backgroundColor: 'var(--ifm-color-emphasis-50)', padding: '1.5rem', borderRadius: '8px', marginTop: '2rem', marginBottom: '2rem' }}>
<h3 style={{ marginTop: 0, marginBottom: '1rem' }}>Full Implementation</h3>
<div style={{ backgroundColor: 'var(--ifm-background-color)', padding: '1rem', borderRadius: '6px', border: '1px solid var(--ifm-color-emphasis-300)' }}>
<pre style={{ margin: 0, fontSize: '0.9rem', fontFamily: 'monospace' }}>
{`export async function getMultiVaultConfig(contract: string) {
  const multiVaultContract = createMultiVaultContract(contract)

  const coreContractConfigs = [
    {
      ...multiVaultContract,
      functionName: 'generalConfig',
      args: [],
    },
    {
      ...multiVaultContract,
      functionName: 'vaultFees',
      args: [0],
    },
    {
      ...multiVaultContract,
      functionName: 'atomConfig',
      args: [],
    },
  ]

  const resp: MulticallResponse[] = await publicClient.multicall({
    contracts: coreContractConfigs,
  })

  const admin = resp[0].result[0] as \`0x\${string}\`
  const protocol_vault = resp[0].result[1] as \`0x\${string}\`
  const fee_denominator = resp[0].result[2] as bigint
  const formatted_fee_denominator = formatUnits(fee_denominator, 18)
  const min_deposit = resp[0].result[3] as bigint
  const formatted_min_deposit = formatUnits(min_deposit, 18)
  const min_share = resp[0].result[4] as bigint
  const formatted_min_share = formatUnits(min_share, 18)
  const entry_fee = resp[1].result[0] as bigint
  const formatted_entry_fee = formatUnits(entry_fee, 18)
  const exit_fee = resp[1].result[1] as bigint
  const formatted_exit_fee = formatUnits(exit_fee, 18)
  const protocol_fee = resp[1].result[2] as bigint
  const formatted_protocol_fee = formatUnits(protocol_fee, 18)
  const atom_cost = resp[2].result[0] as bigint
  const formatted_atom_cost = formatUnits(atom_cost, 18)
  const atom_creation_fee = resp[2].result[1] as bigint
  const formatted_atom_creation_fee = formatUnits(atom_creation_fee, 18)

  return {
    admin,
    protocol_vault,
    fee_denominator: fee_denominator.toString(),
    formatted_fee_denominator,
    min_deposit: min_deposit.toString(),
    formatted_min_deposit,
    min_share: min_share.toString(),
    formatted_min_share,
    entry_fee: entry_fee.toString(),
    formatted_entry_fee,
    exit_fee: exit_fee.toString(),
    formatted_exit_fee,
    protocol_fee: protocol_fee.toString(),
    formatted_protocol_fee,
    atom_cost: atom_cost.toString(),
    formatted_atom_cost,
    atom_creation_fee: atom_creation_fee.toString(),
    formatted_atom_creation_fee,
  } as MultivaultConfig
}`}
</pre>
</div>
</div>

## Key Functions

We use this multicall pattern to retrieve configuration that we're able to use throughout the app:

<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginTop: '2rem', marginBottom: '2rem' }}>

<div style={{ border: '1px solid var(--ifm-color-emphasis-300)', borderRadius: '6px', padding: '1rem', backgroundColor: 'var(--ifm-background-color)' }}>
<h4 style={{ marginTop: 0, marginBottom: '0.5rem' }}>getVaultDetails</h4>
<p style={{ margin: 0, fontSize: '0.9rem' }}>
Retrieves comprehensive vault information including total assets, conviction, current share price, fee configurations, user-specific positions, and counter-vault details.
</p>
</div>

<div style={{ border: '1px solid var(--ifm-color-emphasis-300)', borderRadius: '6px', padding: '1rem', backgroundColor: 'var(--ifm-background-color)' }}>
<h4 style={{ marginTop: 0, marginBottom: '0.5rem' }}>getMultiVaultConfig</h4>
<p style={{ margin: 0, fontSize: '0.9rem' }}>
Retrieves global protocol configuration including fee structures, minimum deposits, and protocol admin addresses.
</p>
</div>

</div>

## Usage Example

The full `getVaultDetails` function follows the same pattern used in the `getMultiVaultConfig` example but is too large to include in the docs. We recommend looking at the [Intuition TypeScript SDK](https://github.com/0xIntuition/intuition-ts/blob/main/apps/portal/app/.server/multivault.ts) for a full reference implementation.

<div style={{ backgroundColor: 'var(--ifm-color-emphasis-50)', padding: '1.5rem', borderRadius: '8px', marginTop: '2rem', marginBottom: '2rem' }}>
<h3 style={{ marginTop: 0, marginBottom: '1rem' }}>Basic Usage</h3>
<div style={{ backgroundColor: 'var(--ifm-background-color)', padding: '1rem', borderRadius: '6px', border: '1px solid var(--ifm-color-emphasis-300)' }}>
<pre style={{ margin: 0, fontSize: '0.9rem', fontFamily: 'monospace' }}>
{`// Fetch vault and countervault details with user positions:
const vaultDetails = await getVaultDetails(
  MULTIVAULT_CONTRACT_ADDRESS,
  vaultId,
  userWallet,
  counterVaultId
)

// Access formatted values such as atom_cost and triple_cost
console.log({
  atomCost: vaultDetails.atom_cost,
  tripleCost: vaultDetails.triple_cost,
})`}
</pre>
</div>
</div>

## Reference Implementation

For a full example of how we implement all of our EthMultiVault multicalls, you can look at a reference implementation in our monorepo:

- [https://github.com/0xIntuition/intuition-ts/blob/main/apps/portal/app/.server/multivault.ts](https://github.com/0xIntuition/intuition-ts/blob/main/apps/portal/app/.server/multivault.ts)

## Best Practices

- Use multicall patterns to reduce RPC calls and improve performance
- Always handle errors gracefully when retrieving vault data
- Cache vault details when possible to reduce redundant calls
- Validate returned data before using it in your application
- Monitor vault state changes and update your UI accordingly

## Next Steps

After retrieving vault details, explore:

- [Create Atom](/guides/developer-tools/interactions/create-atom) - Create atoms and manage their vaults
- [Create Triple](/guides/developer-tools/interactions/create-triple) - Create triples with associated vaults
- [Deposit & Return](/guides/developer-tools/interactions/deposit-return) - Manage vault deposits and withdrawals

For a full reference implementation, see the [Intuition TypeScript SDK](https://github.com/0xIntuition/intuition-ts). 