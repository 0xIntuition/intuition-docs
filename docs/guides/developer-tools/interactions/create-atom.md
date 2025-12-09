---
id: create-atom
title: Create Atom
sidebar_label: Create Atom
sidebar_position: 2
description: Learn how to create atoms and manage their associated vaults
---

# Create Atom

Creating atoms in the Intuition protocol involves interacting with the EthMultiVault contract to establish new entities in the knowledge graph. This process includes creating the atom itself and managing its associated vault.

## Prerequisites

This implementation guide assumes that you've completed the setup steps in the [Overview](/docs/guides/developer-tools/interactions/overview) guide. Steps for creating the `createMultivaultContract` and the `publicClient` referenced in this implementation example can be found in the overview.

## Implementation

We recommend creating a `multivault.ts` that includes the following atom creation functionality:

<div style={{ backgroundColor: 'var(--ifm-color-emphasis-50)', padding: '1.5rem', borderRadius: '8px', marginTop: '2rem', marginBottom: '2rem' }}>
<h3 style={{ marginTop: 0, marginBottom: '1rem' }}>Core Atom Creation Pattern</h3>
<div style={{ backgroundColor: 'var(--ifm-background-color)', padding: '1rem', borderRadius: '6px', border: '1px solid var(--ifm-color-emphasis-300)' }}>
<pre style={{ margin: 0, fontSize: '0.9rem', fontFamily: 'monospace' }}>
{`// Create atom with initial deposit
const createAtomConfig = {
  ...multiVaultContract,
  functionName: 'createAtom',
  args: [atomData, initialDeposit],
}

// Execute transaction
const hash = await walletClient.writeContract(createAtomConfig)

// Wait for confirmation
const receipt = await publicClient.waitForTransactionReceipt({ hash })`}
</pre>
</div>
</div>

## Complete Example

Here is a full example of the atom creation pattern used in the `createAtom` function:

<div style={{ backgroundColor: 'var(--ifm-color-emphasis-50)', padding: '1.5rem', borderRadius: '8px', marginTop: '2rem', marginBottom: '2rem' }}>
<h3 style={{ marginTop: 0, marginBottom: '1rem' }}>Full Implementation</h3>
<div style={{ backgroundColor: 'var(--ifm-background-color)', padding: '1rem', borderRadius: '6px', border: '1px solid var(--ifm-color-emphasis-300)' }}>
<pre style={{ margin: 0, fontSize: '0.9rem', fontFamily: 'monospace' }}>
{`export async function createAtom(
  contract: string,
  atomData: string,
  initialDeposit: bigint,
  walletClient: WalletClient,
  publicClient: PublicClient
) {
  const multiVaultContract = createMultiVaultContract(contract)

  // Prepare atom creation transaction
  const createAtomConfig = {
    ...multiVaultContract,
    functionName: 'createAtom',
    args: [atomData, initialDeposit],
  }

  try {
    // Execute the transaction
    const hash = await walletClient.writeContract(createAtomConfig)
    
    // Wait for transaction confirmation
    const receipt = await publicClient.waitForTransactionReceipt({ hash })
    
    // Parse events to get atom ID
    const atomCreatedEvent = receipt.logs.find(
      log => log.eventName === 'AtomCreated'
    )
    
    if (!atomCreatedEvent) {
      throw new Error('Atom creation event not found')
    }
    
    const atomId = atomCreatedEvent.args.atomId
    const vaultId = atomCreatedEvent.args.vaultId
    
    return {
      success: true,
      atomId,
      vaultId,
      transactionHash: hash,
      receipt
    }
  } catch (error) {
    return {
      success: false,
      error: error.message
    }
  }
}`}
</pre>
</div>
</div>

## Key Functions

We use this pattern to create atoms and manage their lifecycle:

<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginTop: '2rem', marginBottom: '2rem' }}>

<div style={{ border: '1px solid var(--ifm-color-emphasis-300)', borderRadius: '6px', padding: '1rem', backgroundColor: 'var(--ifm-background-color)' }}>
<h4 style={{ marginTop: 0, marginBottom: '0.5rem' }}>createAtom</h4>
<p style={{ margin: 0, fontSize: '0.9rem' }}>
Creates a new atom with optional initial deposit and returns atom/vault IDs.
</p>
</div>

<div style={{ border: '1px solid var(--ifm-color-emphasis-300)', borderRadius: '6px', padding: '1rem', backgroundColor: 'var(--ifm-background-color)' }}>
<h4 style={{ marginTop: 0, marginBottom: '0.5rem' }}>validateAtomData</h4>
<p style={{ margin: 0, fontSize: '0.9rem' }}>
Validates atom data format and ensures it meets protocol requirements.
</p>
</div>

<div style={{ border: '1px solid var(--ifm-color-emphasis-300)', borderRadius: '6px', padding: '1rem', backgroundColor: 'var(--ifm-background-color)' }}>
<h4 style={{ marginTop: 0, marginBottom: '0.5rem' }}>estimateAtomCost</h4>
<p style={{ margin: 0, fontSize: '0.9rem' }}>
Estimates the cost of creating an atom including fees and gas costs.
</p>
</div>

</div>

## Usage Example

<div style={{ backgroundColor: 'var(--ifm-color-emphasis-50)', padding: '1.5rem', borderRadius: '8px', marginTop: '2rem', marginBottom: '2rem' }}>
<h3 style={{ marginTop: 0, marginBottom: '1rem' }}>Basic Atom Creation</h3>
<div style={{ backgroundColor: 'var(--ifm-background-color)', padding: '1rem', borderRadius: '6px', border: '1px solid var(--ifm-color-emphasis-300)' }}>
<pre style={{ margin: 0, fontSize: '0.9rem', fontFamily: 'monospace' }}>
{`// Create a new atom
const atomData = "did:ethr:mainnet:0x1234567890abcdef"
const initialDeposit = parseEther("0.1")

const result = await createAtom(
  MULTIVAULT_CONTRACT_ADDRESS,
  atomData,
  initialDeposit,
  walletClient,
  publicClient
)

if (result.success) {
  console.log({
    atomId: result.atomId,
    vaultId: result.vaultId,
    transactionHash: result.transactionHash
  })
} else {
  console.error('Atom creation failed:', result.error)
}`}
</pre>
</div>
</div>

## Error Handling

<div style={{ backgroundColor: 'var(--ifm-color-emphasis-50)', padding: '1.5rem', borderRadius: '8px', marginTop: '2rem', marginBottom: '2rem' }}>
<h3 style={{ marginTop: 0, marginBottom: '1rem' }}>Common Error Scenarios</h3>
<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
<div style={{ border: '1px solid var(--ifm-color-emphasis-300)', borderRadius: '6px', padding: '1rem', backgroundColor: 'var(--ifm-background-color)' }}>
<h4 style={{ marginTop: 0, marginBottom: '0.5rem' }}>Insufficient Funds</h4>
<p style={{ margin: 0, fontSize: '0.9rem' }}>
Ensure wallet has sufficient ETH for gas and deposit amount.
</p>
</div>
<div style={{ border: '1px solid var(--ifm-color-emphasis-300)', borderRadius: '6px', padding: '1rem', backgroundColor: 'var(--ifm-background-color)' }}>
<h4 style={{ marginTop: 0, marginBottom: '0.5rem' }}>Invalid Atom Data</h4>
<p style={{ margin: 0, fontSize: '0.9rem' }}>
Validate atom data format before submission.
</p>
</div>
<div style={{ border: '1px solid var(--ifm-color-emphasis-300)', borderRadius: '6px', padding: '1rem', backgroundColor: 'var(--ifm-background-color)' }}>
<h4 style={{ marginTop: 0, marginBottom: '0.5rem' }}>Network Issues</h4>
<p style={{ margin: 0, fontSize: '0.9rem' }}>
Handle RPC failures and network connectivity issues.
</p>
</div>
</div>
</div>

## Best Practices

- Always validate atom data before submission
- Estimate costs before executing transactions
- Implement proper error handling and user feedback
- Use multicall patterns for batch operations
- Monitor transaction status and provide confirmation feedback

## Next Steps

After creating atoms, explore:

- [Create Triple](/docs/guides/developer-tools/interactions/create-triple) - Learn how to create relationships between atoms
- [Deposit & Return](/docs/guides/developer-tools/interactions/deposit-return) - Manage vault deposits and withdrawals
- [Retrieve Vault Details](/docs/guides/developer-tools/interactions/retrieve-vault-details) - Get comprehensive vault information

For a full reference implementation, see the [Intuition TypeScript SDK](https://github.com/0xIntuition/intuition-ts). 