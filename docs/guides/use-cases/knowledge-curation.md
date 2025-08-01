### **Implementation**

```typescript
// Example structure for product review system
import { createAtomFromString, createTripleStatement, getEthMultiVaultAddress } from '@0xintuition/sdk'

// Get the correct vault address for the current chain
const ethMultiVaultAddress = getEthMultiVaultAddress(walletClient.chain.id)

// Create product atom - represents the product being reviewed
// This creates a unique identifier for the iPhone 15 Pro with price information
const productAtom = await createAtomFromString(
  { walletClient, publicClient, address: ethMultiVaultAddress },
  'iPhone 15 Pro - Apple Electronics - $999'
)

// Create user atom - represents the user who is writing the review
// This creates a unique identifier for the reviewer in the knowledge graph
const userAtom = await createAtomFromString(
  { walletClient, publicClient, address: ethMultiVaultAddress },
  'user:alice_dev'
)

// Create review content atom - represents the actual review text and rating
// This stores the detailed review content including rating and comments
const reviewContentAtom = await createAtomFromString(
  { walletClient, publicClient, address: ethMultiVaultAddress },
  'Excellent camera quality and battery life - 5 stars'
)

// Create review relationship - links the user to the product they're reviewing
// This creates a semantic statement: "user:alice_dev REVIEWS iPhone 15 Pro"
const reviewTriple = await createTripleStatement(
  { walletClient, publicClient, address: ethMultiVaultAddress },
  {
    args: [userAtom.state.vaultId, 'REVIEWS', productAtom.state.vaultId]
  }
)

// Link review content to review - connects the review text to the review relationship
// This creates a semantic statement: "review relationship HAS_CONTENT review text"
const reviewContentTriple = await createTripleStatement(
  { walletClient, publicClient, address: ethMultiVaultAddress },
  {
    args: [reviewTriple.state.vaultId, 'HAS_CONTENT', reviewContentAtom.state.vaultId]
  }
)
```

### **Implementation**

```typescript
// Example structure for knowledge base system
import { createAtomFromString, createTripleStatement, getEthMultiVaultAddress } from '@0xintuition/sdk'

// Get the correct vault address for the current chain
const ethMultiVaultAddress = getEthMultiVaultAddress(walletClient.chain.id)

// Create knowledge article atom - represents the educational content
// This creates a unique identifier for the blockchain consensus article
const articleAtom = await createAtomFromString(
  { walletClient, publicClient, address: ethMultiVaultAddress },
  'Blockchain Consensus Mechanisms: Proof of Work vs Proof of Stake'
)

// Create expert user atom - represents the domain expert
// This identifies the blockchain developer who is attesting to the content
const expertAtom = await createAtomFromString(
  { walletClient, publicClient, address: ethMultiVaultAddress },
  'expert:blockchain_developer'
)

// Create expertise category atom - represents the expert's specialization
// This categorizes the expert's domain of knowledge
const expertiseAtom = await createAtomFromString(
  { walletClient, publicClient, address: ethMultiVaultAddress },
  'expertise:blockchain_developer'
)

// Expert attestation to article - links the expert to the content they verify
// This creates a semantic statement: "expert:blockchain_developer ATTESTS_TO article"
const expertAttestationTriple = await createTripleStatement(
  { walletClient, publicClient, address: ethMultiVaultAddress },
  {
    args: [expertAtom.state.vaultId, 'ATTESTS_TO', articleAtom.state.vaultId]
  }
)

// Link expert to their expertise - connects the expert to their specialization
// This creates a semantic statement: "expert:blockchain_developer HAS_EXPERTISE blockchain_developer"
const expertiseTriple = await createTripleStatement(
  { walletClient, publicClient, address: ethMultiVaultAddress },
  {
    args: [expertAtom.state.vaultId, 'HAS_EXPERTISE', expertiseAtom.state.vaultId]
  }
)
```

### **Implementation**

```typescript
// Example structure for content discovery system
import { createAtomFromString, createTripleStatement, getEthMultiVaultAddress } from '@0xintuition/sdk'

// Get the correct vault address for the current chain
const ethMultiVaultAddress = getEthMultiVaultAddress(walletClient.chain.id)

// Create content atom - represents the educational article
// This creates a unique identifier for the Intuition primitives article
const contentAtom = await createAtomFromString(
  { walletClient, publicClient, address: ethMultiVaultAddress },
  'Understanding Intuition Primitives - Educational Article'
)

// Create user atom - represents the content discoverer
// This identifies the user who discovered and recommends the content
const userAtom = await createAtomFromString(
  { walletClient, publicClient, address: ethMultiVaultAddress },
  'user:content_discoverer'
)

// Create category atom - represents the content category
// This categorizes the content for better discovery and filtering
const categoryAtom = await createAtomFromString(
  { walletClient, publicClient, address: ethMultiVaultAddress },
  'category:blockchain'
)

// User recommendation - links the user to the content they recommend
// This creates a semantic statement: "user:content_discoverer RECOMMENDS article"
const recommendationTriple = await createTripleStatement(
  { walletClient, publicClient, address: ethMultiVaultAddress },
  {
    args: [userAtom.state.vaultId, 'RECOMMENDS', contentAtom.state.vaultId]
  }
)

// Link content to category - connects the content to its category
// This creates a semantic statement: "article BELONGS_TO blockchain category"
const categoryTriple = await createTripleStatement(
  { walletClient, publicClient, address: ethMultiVaultAddress },
  {
    args: [contentAtom.state.vaultId, 'BELONGS_TO', categoryAtom.state.vaultId]
  }
)
``` 