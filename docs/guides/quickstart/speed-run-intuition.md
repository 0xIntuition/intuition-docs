---
sidebar_position: 2
---

# Speed Run Intuition

Get up and running with Intuition in under 5 minutes! This guide showcases the [Intuition SDK Showcase](https://github.com/robbiekruszynski/intuition_speedrun) project - a comprehensive demonstration of Intuition's SDK capabilities for creating atoms, triples, and exploring real-world use cases.

## What is the Intuition SDK Showcase?

The [Intuition SDK Showcase](https://github.com/robbiekruszynski/intuition_speedrun) is a full-featured Next.js application that demonstrates all major Intuition SDK functions with a modern, user-friendly interface. It serves as both a learning tool and a reference implementation for building Intuition-powered applications.

## Key Features

<div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
<div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
<div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: 'var(--ifm-color-success)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
<svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M9,20.42L2.79,14.21L5.62,11.38L9,14.77L18.88,4.88L21.71,7.71L9,20.42Z"/></svg>
</div>
<span style={{ fontSize: '1rem', fontWeight: '500' }}><strong>Atom Creation</strong>: Multiple methods for creating atoms (string, IPFS, Ethereum accounts, things)</span>
</div>

<div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
<div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: 'var(--ifm-color-success)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
<svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M9,20.42L2.79,14.21L5.62,11.38L9,14.77L18.88,4.88L21.71,7.71L9,20.42Z"/></svg>
</div>
<span style={{ fontSize: '1rem', fontWeight: '500' }}><strong>Triple Creation</strong>: Create subject-predicate-object relationships between atoms</span>
</div>

<div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
<div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: 'var(--ifm-color-success)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
<svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M9,20.42L2.79,14.21L5.62,11.38L9,14.77L18.88,4.88L21.71,7.71L9,20.42Z"/></svg>
</div>
<span style={{ fontSize: '1rem', fontWeight: '500' }}><strong>Batch Operations</strong>: Efficient bulk creation of atoms and triples</span>
</div>

<div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
<div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: 'var(--ifm-color-success)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
<svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M9,20.42L2.79,14.21L5.62,11.38L9,14.77L18.88,4.88L21.71,7.71L9,20.42Z"/></svg>
</div>
<span style={{ fontSize: '1rem', fontWeight: '500' }}><strong>Vault Lookup</strong>: Search and view atom/triple vaults and trading data</span>
</div>

<div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
<div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: 'var(--ifm-color-success)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
<svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M9,20.42L2.79,14.21L5.62,11.38L9,14.77L18.88,4.88L21.71,7.71L9,20.42Z"/></svg>
</div>
<span style={{ fontSize: '1rem', fontWeight: '500' }}><strong>Use Cases</strong>: Real-world examples and applications</span>
</div>

<div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
<div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: 'var(--ifm-color-success)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
<svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M9,20.42L2.79,14.21L5.62,11.38L9,14.77L18.88,4.88L21.71,7.71L9,20.42Z"/></svg>
</div>
<span style={{ fontSize: '1rem', fontWeight: '500' }}><strong>IPFS Integration</strong>: Pinata integration for decentralized file storage</span>
</div>

<div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
<div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: 'var(--ifm-color-success)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
<svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M9,20.42L2.79,14.21L5.62,11.38L9,14.77L18.88,4.88L21.71,7.71L9,20.42Z"/></svg>
</div>
<span style={{ fontSize: '1rem', fontWeight: '500' }}><strong>Multi-Network Support</strong>: Works on Base and Base Sepolia (per current SDK deployments)</span>
</div>
</div>

## Prerequisites

<div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
<div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
<div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: 'var(--ifm-color-success)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
<svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M9,20.42L2.79,14.21L5.62,11.38L9,14.77L18.88,4.88L21.71,7.71L9,20.42Z"/></svg>
</div>
<span style={{ fontSize: '1rem', fontWeight: '500' }}>Node.js 18+</span>
</div>

<div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
<div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: 'var(--ifm-color-success)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
<svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M9,20.42L2.79,14.21L5.62,11.38L9,14.77L18.88,4.88L21.71,7.71L9,20.42Z"/></svg>
</div>
<span style={{ fontSize: '1rem', fontWeight: '500' }}>pnpm (recommended) or npm</span>
</div>

<div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
<div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: 'var(--ifm-color-success)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
<svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M9,20.42L2.79,14.21L5.62,11.38L9,14.77L18.88,4.88L21.71,7.71L9,20.42Z"/></svg>
</div>
<span style={{ fontSize: '1rem', fontWeight: '500' }}>MetaMask or other Web3 wallet</span>
</div>

<div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
<div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: 'var(--ifm-color-success)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
<svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M9,20.42L2.79,14.21L5.62,11.38L9,14.77L18.88,4.88L21.71,7.71L9,20.42Z"/></svg>
</div>
<span style={{ fontSize: '1rem', fontWeight: '500' }}>Testnet ETH for transactions</span>
</div>
</div>

## Quick Start

### 1. Fork/Clone the Repository

```bash
git clone https://github.com/robbiekruszynski/intuition_speedrun.git
cd intuition_speedrun
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory:

```bash
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
NEXT_PUBLIC_PINATA_API_TOKEN=your_pinata_api_token
```

**Getting Environment Variables:**

1. **WalletConnect Project ID**:  
   - Go to [WalletConnect Cloud](https://cloud.walletconnect.com/)
   - Create a new project  
   - Copy the Project ID

2. **Pinata API Token**:  
   - Go to [Pinata](https://app.pinata.cloud/)
   - Create an account and get your API token  
   - Ensure it has the necessary scopes for IPFS uploads

### 4. Run the Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## SDK Functionality Deep Dive

### Atom Creation

The showcase demonstrates multiple ways to create atoms using the Intuition SDK:

#### String-based Atom Creation

```typescript
import { createAtomFromString, getEthMultiVaultAddressFromChainId } from '@0xintuition/sdk'

const config = {
  walletClient,
  publicClient,
  address: getEthMultiVaultAddressFromChainId(walletClient.chain.id),
}

const result = await createAtomFromString(config, 'Hello World')
console.log('Atom created vaultId:', result.state.vaultId)
```

#### Ethereum Account Atom Creation

```typescript
import { batchCreateAtomsFromEthereumAccounts } from '@0xintuition/sdk'

const addresses = ['0x123...', '0x456...']
const result = await batchCreateAtomsFromEthereumAccounts(config, addresses)
```

#### IPFS-based Atom Creation

```typescript
import { pinThing, uploadJsonToPinata } from '@0xintuition/sdk'

// 1) GraphQL-based pin (returns uri)
const pinned = await pinThing({ thing: { name: 'Test', description: 'A test thing' } })
console.log(pinned) // { uri: 'ipfs://...' }

// 2) Direct Pinata upload (returns IpfsHash) — requires API token
const uploaded = await uploadJsonToPinata(process.env.NEXT_PUBLIC_PINATA_API_TOKEN!, {
  title: 'My Data',
  content: 'Some content',
})
console.log(uploaded.IpfsHash)
```

### Triple Creation

Create semantic relationships between atoms:

```typescript
import { createTripleStatement } from '@0xintuition/sdk'

// After creating atoms a, b, c (see earlier), reference their vaultIds
const triple = await createTripleStatement(
  config,
  { args: [a.state.vaultId, b.state.vaultId, c.state.vaultId] },
)
```

### Data Retrieval

Query existing atoms and triples:

```typescript
import { getAtom, getTriple } from '@0xintuition/sdk'

const atom = await getAtom('atom-id-123')
const triple = await getTriple('triple-id-456')
```

## Project Architecture

### File Structure

```
src/
├── app/                    # Next.js app directory
├── components/             # React components
│   ├── tabs/             # Tab components for different features
│   └── ...               # Other UI components
├── hooks/                 # Custom React hooks
├── lib/                   # Configuration and utilities
└── providers/             # Context providers
```

### Key Components

#### Tab Components

The application is organized into functional tabs:

- **Atom Creation**: Multiple methods for creating atoms
- **Triple Creation**: Building relationships between atoms
- **Batch Operations**: Efficient bulk operations
- **Vault Lookup**: Exploring atom/triple vaults
- **Use Cases**: Real-world applications

#### Configuration

```typescript
// src/lib/intuition-config.ts (align with SDK deployments)
export const supportedNetworks = [
  { id: 8453, name: 'Base Mainnet', rpcUrl: 'https://mainnet.base.org' },
  { id: 84532, name: 'Base Sepolia', rpcUrl: 'https://sepolia.base.org' },
]
```

## Supported Networks

The application supports multiple networks for maximum flexibility:

- **Base Mainnet** (Chain ID: 8453)
- **Base Sepolia Testnet** (Chain ID: 84532)

## Walkthrough: Creating Your First Atom

### Step 1: Connect Your Wallet

1. Open the application at [http://localhost:3000](http://localhost:3000)
2. Click "Connect Wallet" in the top right
3. Select your preferred wallet (MetaMask, WalletConnect, etc.)
4. Approve the connection

### Step 2: Select Network

1. Choose your target network from the dropdown
2. Ensure you have sufficient ETH for gas fees
3. For testing, use Sepolia or Base Sepolia testnets

### Step 3: Create an Atom

1. Navigate to the "Atom Creation" tab
2. Choose your creation method:
   - **String**: Simple text-based atoms
   - **IPFS**: Decentralized file storage
   - **Ethereum Account**: Wallet addresses
   - **Thing**: Complex data structures

3. Fill in the required fields
4. Click "Create Atom"
5. Approve the transaction in your wallet

### Step 4: Create Relationships

1. Navigate to the "Triple Creation" tab
2. Enter your subject, predicate, and object
3. Click "Create Triple"
4. Approve the transaction

### Step 5: Explore Vaults

1. Go to the "Vault Lookup" tab
2. Search for your created atoms/triples
3. View trading data and market activity
4. Explore the economic aspects of your data

## Advanced Features

### Batch Operations

The SDK supports efficient batch operations for creating multiple atoms or triples in a single transaction:

```typescript
// Batch atom creation
const atomStrings = ['Atom1', 'Atom2', 'Atom3']
const result = await batchCreateAtomsFromStrings(config, atomStrings)

// Batch triple creation
const tripleStatements = [
  { subject: 'A', predicate: 'relates to', object: 'B' },
  { subject: 'B', predicate: 'relates to', object: 'C' }
]
const result = await batchCreateTripleStatements(config, tripleStatements)
```

### Error Handling

The application includes comprehensive error handling:

```typescript
try {
  const result = await createAtomFromString(config, 'Test Atom')
  console.log('Success:', result)
} catch (error) {
  if (error.message.includes('EthMultiVault_AtomExists')) {
    console.log('Atom already exists')
  } else {
    console.error('Unexpected error:', error)
  }
}
```

### IPFS Integration

Store complex data structures on IPFS:

```typescript
import { pinThing } from '@0xintuition/sdk'

const complexData = {
  name: 'My Project',
  description: 'A comprehensive project description',
  metadata: {
    tags: ['intuition', 'web3', 'decentralized'],
    version: '1.0.0',
    author: '0x123...'
  }
}

const pinned = await pinThing(complexData)
console.log('IPFS CID:', pinned.cid)
```


## Development

### Available Scripts

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
```

### Customization

The application is designed to be easily customizable:

1. **Add New Networks**: Update `src/lib/intuition-config.ts`
2. **Modify UI**: Edit components in `src/components/`
3. **Add Features**: Extend the SDK usage in tab components

## Troubleshooting

### Common Issues

1. **Wallet Connection Problems**:  
   - Ensure WalletConnect Project ID is correctly set  
   - Check network compatibility

2. **IPFS Upload Failures**:  
   - Verify Pinata API token is valid  
   - Check token permissions

3. **Transaction Failures**:  
   - Ensure sufficient ETH for gas fees  
   - Check network connectivity

### Getting Help

- Check the [Intuition SDK Documentation](https://docs.intuition.systems)
- Review the [Intuition Contracts](https://github.com/0xIntuition/intuition-contracts)
- Join the [Intuition Discord](https://discord.gg/0xintuition)


^ UPDATE LINKS 


## Contributing

1. Fork the [repository](https://github.com/robbiekruszynski/intuition_speedrun)
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## Next Steps

- Explore the [Official Intuition Kits](/guides/quickstart/official-intuition-kits) for pre-built templates
- Learn about [Smart Contracts](/guides/developer-tools/contracts) for advanced features
- Check out the [GraphQL API documentation](/graphql) for more query options
- Join the [Intuition Community](https://discord.gg/0xintuition) for support and collaboration

---

**Ready to build?** Clone the [Intuition SDK Showcase](https://github.com/robbiekruszynski/intuition_speedrun) and start creating your own Intuition-powered applications! 🚀 
