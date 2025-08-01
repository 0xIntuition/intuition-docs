### **Implementation**

```typescript
// Example structure for decentralized fact-checking system
import { createAtomFromString, createTripleStatement, getEthMultiVaultAddress } from '@0xintuition/sdk'

// Get the correct vault address for the current chain
const ethMultiVaultAddress = getEthMultiVaultAddress(walletClient.chain.id)

// Create fact claim atom - represents the claim being verified
// This creates a unique identifier for the blockchain fact about Bitcoin consensus
const claimAtom = await createAtomFromString(
  { walletClient, publicClient, address: ethMultiVaultAddress },
  'Bitcoin uses Proof of Work consensus - blockchain fact'
)

// Create expert fact-checker atom - represents the domain expert
// This identifies the blockchain expert who is verifying the claim
const expertAtom = await createAtomFromString(
  { walletClient, publicClient, address: ethMultiVaultAddress },
  'expert:blockchain_fact_checker'
)

// Create evidence atom - represents the supporting evidence
// This stores the URLs and sources that support the claim
const evidenceAtom = await createAtomFromString(
  { walletClient, publicClient, address: ethMultiVaultAddress },
  'evidence:bitcoin.org/whitepaper,github.com/bitcoin'
)

// Expert verification of claim - links the expert to the claim they verify
// This creates a semantic statement: "expert:blockchain_fact_checker VERIFIES Bitcoin consensus claim"
const expertVerificationTriple = await createTripleStatement(
  { walletClient, publicClient, address: ethMultiVaultAddress },
  {
    args: [expertAtom.state.vaultId, 'VERIFIES', claimAtom.state.vaultId]
  }
)

// Link claim to evidence - connects the claim to its supporting evidence
// This creates a semantic statement: "Bitcoin consensus claim SUPPORTED_BY evidence sources"
const claimEvidenceTriple = await createTripleStatement(
  { walletClient, publicClient, address: ethMultiVaultAddress },
  {
    args: [claimAtom.state.vaultId, 'SUPPORTED_BY', evidenceAtom.state.vaultId]
  }
)
``` 