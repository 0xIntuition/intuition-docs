---
id: create-triple
title: Create Triple
sidebar_label: Create Triple
sidebar_position: 3
description: Learn how to create triples and manage their relationships
---

# Create Triple

Creating triples in the Intuition protocol involves establishing relationships between atoms through the EthMultiVault contract. This process creates both the triple structure and its associated vaults for positive and negative positions.

## Prerequisites

This implementation guide assumes that you've completed the setup steps in the [Overview](/docs/interaction-guide/overview) guide and have existing atoms to work with.

## Implementation

We recommend creating a `multivault.ts` that includes the following triple creation functionality:

<div style={{ backgroundColor: 'var(--ifm-color-emphasis-50)', padding: '1.5rem', borderRadius: '8px', marginTop: '2rem', marginBottom: '2rem' }}>
<h3 style={{ marginTop: 0, marginBottom: '1rem' }}>Core Triple Creation Pattern</h3>
<div style={{ backgroundColor: 'var(--ifm-background-color)', padding: '1rem', borderRadius: '6px', border: '1px solid var(--ifm-color-emphasis-300)' }}>
<pre style={{ margin: 0, fontSize: '0.9rem', fontFamily: 'monospace' }}>
{`// Create triple with initial deposit
const createTripleConfig = {
  ...multiVaultContract,
  functionName: 'createTriple',
  args: [subjectId, predicateId, objectId, initialDeposit],
}

// Execute transaction
const hash = await walletClient.writeContract(createTripleConfig)`}
</pre>
</div>
</div>

## Key Functions

We use this pattern to create triples and manage their lifecycle:

<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginTop: '2rem', marginBottom: '2rem' }}>

<div style={{ border: '1px solid var(--ifm-color-emphasis-300)', borderRadius: '6px', padding: '1rem', backgroundColor: 'var(--ifm-background-color)' }}>
<h4 style={{ marginTop: 0, marginBottom: '0.5rem' }}>createTriple</h4>
<p style={{ margin: 0, fontSize: '0.9rem' }}>
Creates a new triple with optional initial deposit and returns triple/vault IDs.
</p>
</div>

<div style={{ border: '1px solid var(--ifm-color-emphasis-300)', borderRadius: '6px', padding: '1rem', backgroundColor: 'var(--ifm-background-color)' }}>
<h4 style={{ marginTop: 0, marginBottom: '0.5rem' }}>validateTripleComponents</h4>
<p style={{ margin: 0, fontSize: '0.9rem' }}>
Validates that subject, predicate, and object atoms exist and are valid.
</p>
</div>

<div style={{ border: '1px solid var(--ifm-color-emphasis-300)', borderRadius: '6px', padding: '1rem', backgroundColor: 'var(--ifm-background-color)' }}>
<h4 style={{ marginTop: 0, marginBottom: '0.5rem' }}>estimateTripleCost</h4>
<p style={{ margin: 0, fontSize: '0.9rem' }}>
Estimates the cost of creating a triple including fees and gas costs.
</p>
</div>

</div>

## Usage Example

<div style={{ backgroundColor: 'var(--ifm-color-emphasis-50)', padding: '1.5rem', borderRadius: '8px', marginTop: '2rem', marginBottom: '2rem' }}>
<h3 style={{ marginTop: 0, marginBottom: '1rem' }}>Basic Triple Creation</h3>
<div style={{ backgroundColor: 'var(--ifm-background-color)', padding: '1rem', borderRadius: '6px', border: '1px solid var(--ifm-color-emphasis-300)' }}>
<pre style={{ margin: 0, fontSize: '0.9rem', fontFamily: 'monospace' }}>
{`// Create a new triple
const subjectId = 123n  // Atom ID for "Alice"
const predicateId = 456n // Atom ID for "knows"
const objectId = 789n    // Atom ID for "Bob"
const initialDeposit = parseEther("0.1")

const result = await createTriple(
  MULTIVAULT_CONTRACT_ADDRESS,
  subjectId,
  predicateId,
  objectId,
  initialDeposit,
  walletClient,
  publicClient
)`}
</pre>
</div>
</div>

## Vault Management

Each triple creates two vaults:

<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginTop: '2rem', marginBottom: '2rem' }}>

<div style={{ border: '1px solid var(--ifm-color-emphasis-300)', borderRadius: '6px', padding: '1rem', backgroundColor: 'var(--ifm-background-color)' }}>
<h4 style={{ marginTop: 0, marginBottom: '0.5rem' }}>Positive Vault</h4>
<p style={{ margin: 0, fontSize: '0.9rem' }}>
For users who believe the triple is true. Deposits here signal agreement.
</p>
</div>

<div style={{ border: '1px solid var(--ifm-color-emphasis-300)', borderRadius: '6px', padding: '1rem', backgroundColor: 'var(--ifm-background-color)' }}>
<h4 style={{ marginTop: 0, marginBottom: '0.5rem' }}>Negative Vault</h4>
<p style={{ margin: 0, fontSize: '0.9rem' }}>
For users who believe the triple is false. Deposits here signal disagreement.
</p>
</div>

</div>

## Best Practices

- Validate all atom IDs before creating triples
- Check for existing triples to avoid duplicates
- Estimate costs before executing transactions
- Implement proper error handling and user feedback
- Use multicall patterns for batch operations

## Next Steps

After creating triples, explore:

- [Deposit & Return](/docs/interaction-guide/deposit-return) - Manage vault deposits and withdrawals
- [Retrieve Vault Details](/docs/interaction-guide/retrieve-vault-details) - Get comprehensive vault information

For a full reference implementation, see the [Intuition TypeScript SDK](https://github.com/0xIntuition/intuition-ts). 