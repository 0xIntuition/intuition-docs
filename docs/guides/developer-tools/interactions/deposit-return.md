---
id: deposit-return
title: Deposit & Return
sidebar_label: Deposit & Return
sidebar_position: 4
description: Manage deposits and withdrawals from vaults with proper fee handling
---

# Deposit & Return

Managing deposits and withdrawals from vaults in the Intuition protocol involves interacting with the EthMultiVault contract to stake and unstake tokens. This process includes proper fee handling and share price calculations.

## Prerequisites

This implementation guide assumes that you've completed the setup steps in the [Overview](/docs/guides/developer-tools/interactions/overview) guide. Steps for creating the `createMultivaultContract` and the `publicClient` referenced in this implementation example can be found in the overview.

## Implementation

We recommend creating a `multivault.ts` that includes the following deposit and withdrawal functionality:

<div style={{ backgroundColor: 'var(--ifm-color-emphasis-50)', padding: '1.5rem', borderRadius: '8px', marginTop: '2rem', marginBottom: '2rem' }}>
<h3 style={{ marginTop: 0, marginBottom: '1rem' }}>Core Deposit Pattern</h3>
<div style={{ backgroundColor: 'var(--ifm-background-color)', padding: '1rem', borderRadius: '6px', border: '1px solid var(--ifm-color-emphasis-300)' }}>
<pre style={{ margin: 0, fontSize: '0.9rem', fontFamily: 'monospace' }}>
{`// Deposit into vault
const depositConfig = {
  ...multiVaultContract,
  functionName: 'deposit',
  args: [vaultId, amount],
}

// Execute transaction
const hash = await walletClient.writeContract(depositConfig)`}
</pre>
</div>
</div>

## Key Functions

We use these patterns to manage vault deposits and withdrawals:

<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginTop: '2rem', marginBottom: '2rem' }}>

<div style={{ border: '1px solid var(--ifm-color-emphasis-300)', borderRadius: '6px', padding: '1rem', backgroundColor: 'var(--ifm-background-color)' }}>
<h4 style={{ marginTop: 0, marginBottom: '0.5rem' }}>deposit</h4>
<p style={{ margin: 0, fontSize: '0.9rem' }}>
Deposit tokens into a vault and receive shares based on current share price.
</p>
</div>

<div style={{ border: '1px solid var(--ifm-color-emphasis-300)', borderRadius: '6px', padding: '1rem', backgroundColor: 'var(--ifm-background-color)' }}>
<h4 style={{ marginTop: 0, marginBottom: '0.5rem' }}>withdraw</h4>
<p style={{ margin: 0, fontSize: '0.9rem' }}>
Withdraw tokens from a vault by burning shares at current share price.
</p>
</div>

<div style={{ border: '1px solid var(--ifm-color-emphasis-300)', borderRadius: '6px', padding: '1rem', backgroundColor: 'var(--ifm-background-color)' }}>
<h4 style={{ marginTop: 0, marginBottom: '0.5rem' }}>estimateDeposit</h4>
<p style={{ margin: 0, fontSize: '0.9rem' }}>
Estimate the number of shares received for a given deposit amount.
</p>
</div>

</div>

## Usage Examples

<div style={{ backgroundColor: 'var(--ifm-color-emphasis-50)', padding: '1.5rem', borderRadius: '8px', marginTop: '2rem', marginBottom: '2rem' }}>
<h3 style={{ marginTop: 0, marginBottom: '1rem' }}>Basic Deposit</h3>
<div style={{ backgroundColor: 'var(--ifm-background-color)', padding: '1rem', borderRadius: '6px', border: '1px solid var(--ifm-color-emphasis-300)' }}>
<pre style={{ margin: 0, fontSize: '0.9rem', fontFamily: 'monospace' }}>
{`// Deposit into vault
const vaultId = 123n
const amount = parseEther("0.1")

const result = await deposit(
  MULTIVAULT_CONTRACT_ADDRESS,
  vaultId,
  amount,
  walletClient,
  publicClient
)`}
</pre>
</div>
</div>

<div style={{ backgroundColor: 'var(--ifm-color-emphasis-50)', padding: '1.5rem', borderRadius: '8px', marginTop: '2rem', marginBottom: '2rem' }}>
<h3 style={{ marginTop: 0, marginBottom: '1rem' }}>Basic Withdrawal</h3>
<div style={{ backgroundColor: 'var(--ifm-background-color)', padding: '1rem', borderRadius: '6px', border: '1px solid var(--ifm-color-emphasis-300)' }}>
<pre style={{ margin: 0, fontSize: '0.9rem', fontFamily: 'monospace' }}>
{`// Withdraw from vault
const vaultId = 123n
const shares = parseEther("10")

const result = await withdraw(
  MULTIVAULT_CONTRACT_ADDRESS,
  vaultId,
  shares,
  walletClient,
  publicClient
)`}
</pre>
</div>
</div>

## Fee Structure

<div style={{ backgroundColor: 'var(--ifm-color-emphasis-50)', padding: '1.5rem', borderRadius: '8px', marginTop: '2rem', marginBottom: '2rem' }}>
<h3 style={{ marginTop: 0, marginBottom: '1rem' }}>Understanding Fees</h3>
<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
<div style={{ border: '1px solid var(--ifm-color-emphasis-300)', borderRadius: '6px', padding: '1rem', backgroundColor: 'var(--ifm-background-color)' }}>
<h4 style={{ marginTop: 0, marginBottom: '0.5rem' }}>Entry Fee</h4>
<p style={{ margin: 0, fontSize: '0.9rem' }}>
Fee charged when depositing into a vault, calculated as a percentage of deposit.
</p>
</div>
<div style={{ border: '1px solid var(--ifm-color-emphasis-300)', borderRadius: '6px', padding: '1rem', backgroundColor: 'var(--ifm-background-color)' }}>
<h4 style={{ marginTop: 0, marginBottom: '0.5rem' }}>Exit Fee</h4>
<p style={{ margin: 0, fontSize: '0.9rem' }}>
Fee charged when withdrawing from a vault, calculated as a percentage of withdrawal.
</p>
</div>
<div style={{ border: '1px solid var(--ifm-color-emphasis-300)', borderRadius: '6px', padding: '1rem', backgroundColor: 'var(--ifm-background-color)' }}>
<h4 style={{ marginTop: 0, marginBottom: '0.5rem' }}>Protocol Fee</h4>
<p style={{ margin: 0, fontSize: '0.9rem' }}>
Fee collected by the protocol for maintaining the system and infrastructure.
</p>
</div>
</div>
</div>

## Share Price Dynamics

<div style={{ backgroundColor: 'var(--ifm-color-emphasis-50)', padding: '1.5rem', borderRadius: '8px', marginTop: '2rem', marginBottom: '2rem' }}>
<h3 style={{ marginTop: 0, marginBottom: '1rem' }}>Bonding Curve Mechanics</h3>
<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
<div style={{ border: '1px solid var(--ifm-color-emphasis-300)', borderRadius: '6px', padding: '1rem', backgroundColor: 'var(--ifm-background-color)' }}>
<h4 style={{ marginTop: 0, marginBottom: '0.5rem' }}>Price Discovery</h4>
<p style={{ margin: 0, fontSize: '0.9rem' }}>
Share price increases as more tokens are deposited into the vault.
</p>
</div>
<div style={{ border: '1px solid var(--ifm-color-emphasis-300)', borderRadius: '6px', padding: '1rem', backgroundColor: 'var(--ifm-background-color)' }}>
<h4 style={{ marginTop: 0, marginBottom: '0.5rem' }}>Early Adopter Advantage</h4>
<p style={{ margin: 0, fontSize: '0.9rem' }}>
Early depositors receive more shares for the same token amount.
</p>
</div>
<div style={{ border: '1px solid var(--ifm-color-emphasis-300)', borderRadius: '6px', padding: '1rem', backgroundColor: 'var(--ifm-background-color)' }}>
<h4 style={{ marginTop: 0, marginBottom: '0.5rem' }}>Liquidity Provision</h4>
<p style={{ margin: 0, fontSize: '0.9rem' }}>
Vaults provide continuous liquidity for depositors and withdrawers.
</p>
</div>
</div>
</div>

## Best Practices

- Always estimate fees before executing transactions
- Consider share price impact when depositing large amounts
- Implement proper error handling for failed transactions
- Monitor vault state and share prices before transactions
- Use multicall patterns for batch operations
- Provide clear feedback to users about fee structures

## Next Steps

After managing deposits and withdrawals, explore:

- [Retrieve Vault Details](/docs/guides/developer-tools/interactions/retrieve-vault-details) - Get comprehensive vault information
- [Create Atom](/docs/guides/developer-tools/interactions/create-atom) - Create atoms to deposit into
- [Create Triple](/docs/guides/developer-tools/interactions/create-triple) - Create triples with associated vaults

For a full reference implementation, see the [Intuition TypeScript SDK](https://github.com/0xIntuition/intuition-ts). 