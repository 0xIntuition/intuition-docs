---
id: use-cases
title: Use Cases
sidebar_label: Use Cases
sidebar_position: 1
description: Explore real-world applications and use cases for the Intuition protocol
---

# Use Cases

Intuition's decentralized knowledge graph enables a wide range of applications that benefit from verifiable, structured data. Here are some key use cases and implementation examples.

import IntuitionSandbox from '@site/src/components/IntuitionSandbox';

## Live Code Sandbox

Test Intuition SDK code snippets directly in your browser:

<IntuitionSandbox />

## Quick Examples

Here are some quick examples of how to implement common use cases with Intuition:

### Product Reviews

```typescript
// Example structure for product review system
import { createAtomFromString, createTripleStatement, getEthMultiVaultAddress } from '@0xintuition/sdk'

// Get the correct vault address for the current chain
const ethMultiVaultAddress = getEthMultiVaultAddress(walletClient.chain.id)

// Create product atom - represents the product being reviewed
// This creates a unique identifier for the iPhone 15 Pro in the knowledge graph
const productAtom = await createAtomFromString(
  { walletClient, publicClient, address: ethMultiVaultAddress },
  'iPhone 15 Pro - Apple Electronics'
)

// Create user atom - represents the user who is writing the review
// This creates a unique identifier for the user in the knowledge graph
const userAtom = await createAtomFromString(
  { walletClient, publicClient, address: ethMultiVaultAddress },
  'user:alice_dev'
)

// Create review relationship - links the user to the product they're reviewing
// This creates a semantic statement: "user:alice_dev REVIEWS iPhone 15 Pro"
const reviewTriple = await createTripleStatement(
  { walletClient, publicClient, address: ethMultiVaultAddress },
  {
    args: [userAtom.state.vaultId, 'REVIEWS', productAtom.state.vaultId]
  }
)
```

### Social Network Post

```typescript
// Example structure for social network post
import { createAtomFromString, createTripleStatement, getEthMultiVaultAddress } from '@0xintuition/sdk'

// Get the correct vault address for the current chain
const ethMultiVaultAddress = getEthMultiVaultAddress(walletClient.chain.id)

// Create post content atom - represents the actual post content
// This stores the text content of the social media post
const postAtom = await createAtomFromString(
  { walletClient, publicClient, address: ethMultiVaultAddress },
  'Just deployed my first Intuition app!'
)

// Create user atom - represents the author of the post
// This identifies who created the post
const userAtom = await createAtomFromString(
  { walletClient, publicClient, address: ethMultiVaultAddress },
  'user:alice_dev'
)

// Link post to user - creates the authorship relationship
// This creates a semantic statement: "user:alice_dev AUTHORED post content"
const postTriple = await createTripleStatement(
  { walletClient, publicClient, address: ethMultiVaultAddress },
  {
    args: [userAtom.state.vaultId, 'AUTHORED', postAtom.state.vaultId]
  }
)
```

### Identity Verification

```typescript
// Example structure for identity verification
import { createAtomFromString, createTripleStatement, getEthMultiVaultAddress } from '@0xintuition/sdk'

// Get the correct vault address for the current chain
const ethMultiVaultAddress = getEthMultiVaultAddress(walletClient.chain.id)

// Create user identity atom - represents the person being verified
// This creates a unique identifier for the user's identity
const userAtom = await createAtomFromString(
  { walletClient, publicClient, address: ethMultiVaultAddress },
  'user:alice_dev'
)

// Create verification authority atom - represents the verifying institution
// This could be a government agency, university, or other trusted entity
const authorityAtom = await createAtomFromString(
  { walletClient, publicClient, address: ethMultiVaultAddress },
  'verification:government_id'
)

// Create verification relationship - links the authority to the user
// This creates a semantic statement: "user:alice_dev VERIFIED_BY government_id"
const verificationTriple = await createTripleStatement(
  { walletClient, publicClient, address: ethMultiVaultAddress },
  {
    args: [userAtom.state.vaultId, 'VERIFIED_BY', authorityAtom.state.vaultId]
  }
)
```

## Use Case Categories

<div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>

<div style={{ border: '1px solid var(--ifm-color-emphasis-300)', borderRadius: '8px', padding: '1.5rem', backgroundColor: 'var(--ifm-background-color)' }} className="docs-card">
<h3 style={{ marginTop: 0, marginBottom: '1rem' }}>Knowledge Curation</h3>
<p style={{ marginBottom: '1rem', color: 'var(--ifm-color-emphasis-700)' }}>
Build decentralized knowledge bases, educational platforms, and content discovery systems. Enable expert verification and community-driven content curation.
</p>
<a href="/guides/use-cases/knowledge-curation" style={{ color: 'var(--ifm-color-primary)', textDecoration: 'none', fontWeight: '500' }}>
Explore Knowledge Curation →
</a>
</div>

<div style={{ border: '1px solid var(--ifm-color-emphasis-300)', borderRadius: '8px', padding: '1.5rem', backgroundColor: 'var(--ifm-background-color)' }} className="docs-card">
<h3 style={{ marginTop: 0, marginBottom: '1rem' }}>Social Platforms</h3>
<p style={{ marginBottom: '1rem', color: 'var(--ifm-color-emphasis-700)' }}>
Create decentralized social networks with verifiable user identities, content attribution, and reputation systems.
</p>
<a href="/guides/use-cases/social-platforms" style={{ color: 'var(--ifm-color-primary)', textDecoration: 'none', fontWeight: '500' }}>
Explore Social Platforms →
</a>
</div>

<div style={{ border: '1px solid var(--ifm-color-emphasis-300)', borderRadius: '8px', padding: '1.5rem', backgroundColor: 'var(--ifm-background-color)' }} className="docs-card">
<h3 style={{ marginTop: 0, marginBottom: '1rem' }}>Trust & Reputation</h3>
<p style={{ marginBottom: '1rem', color: 'var(--ifm-color-emphasis-700)' }}>
Build cross-platform identity systems, credential verification, and reputation networks that work across applications.
</p>
<a href="/guides/use-cases/trust-reputation" style={{ color: 'var(--ifm-color-primary)', textDecoration: 'none', fontWeight: '500' }}>
Explore Trust & Reputation →
</a>
</div>

<div style={{ border: '1px solid var(--ifm-color-emphasis-300)', borderRadius: '8px', padding: '1.5rem', backgroundColor: 'var(--ifm-background-color)' }} className="docs-card">
<h3 style={{ marginTop: 0, marginBottom: '1rem' }}>Verification & Q&A</h3>
<p style={{ marginBottom: '1rem', color: 'var(--ifm-color-emphasis-700)' }}>
Create decentralized fact-checking systems, Q&A platforms, and verification networks with expert attestation.
</p>
<a href="/guides/use-cases/verification-qa" style={{ color: 'var(--ifm-color-primary)', textDecoration: 'none', fontWeight: '500' }}>
Explore Verification & Q&A →
</a>
</div>

</div> 