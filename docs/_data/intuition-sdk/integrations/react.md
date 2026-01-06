---
title: React Integration
sidebar_label: React
sidebar_position: 2
description: Integrate the Intuition SDK with React applications using Wagmi hooks
keywords: [sdk, react, wagmi, hooks, integration, frontend]
---

# React Integration

Use the Intuition SDK with React applications via Wagmi hooks for wallet connectivity and blockchain interactions.

## Setup

Install required dependencies:

```bash
npm install wagmi viem @tanstack/react-query
```

## Wagmi Configuration

Set up Wagmi provider in your app:

```typescript title="wagmi-config.ts"
import { http, createConfig } from 'wagmi'
import { intuitionTestnet } from '@0xintuition/sdk'
import { injected } from 'wagmi/connectors'

export const config = createConfig({
  chains: [intuitionTestnet],
  connectors: [injected()],
  transports: {
    [intuitionTestnet.id]: http(),
  },
})
```

```typescript title="App.tsx"
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { config } from './wagmi-config'

const queryClient = new QueryClient()

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <YourApp />
      </QueryClientProvider>
    </WagmiProvider>
  )
}
```

## Creating Atoms

Use SDK functions with Wagmi hooks:

```typescript title="CreateAtomButton.tsx"
import { usePublicClient, useWalletClient, useChainId } from 'wagmi'
import {
  createAtomFromString,
  getMultiVaultAddressFromChainId,
} from '@0xintuition/sdk'
import { parseEther } from 'viem'
import { useState } from 'react'

export function CreateAtomButton() {
  const chainId = useChainId()
  const publicClient = usePublicClient()
  const { data: walletClient } = useWalletClient()
  const [loading, setLoading] = useState(false)
  const [atomId, setAtomId] = useState<string | null>(null)

  const handleCreateAtom = async () => {
    if (!publicClient || !walletClient) {
      alert('Connect wallet first')
      return
    }

    setLoading(true)
    try {
      const address = getMultiVaultAddressFromChainId(chainId)

      const atom = await createAtomFromString(
        { walletClient, publicClient, address },
        'My Atom',
        parseEther('0.01')
      )

      setAtomId(atom.state.termId)
      console.log('Created atom:', atom.state.termId)

    } catch (error) {
      console.error('Error:', error)
      alert('Failed to create atom')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <button onClick={handleCreateAtom} disabled={loading || !walletClient}>
        {loading ? 'Creating...' : 'Create Atom'}
      </button>
      {atomId && <p>Created: {atomId}</p>}
    </div>
  )
}
```

## Custom Hooks

Create reusable hooks for SDK operations:

```typescript title="useCreateAtom.ts"
import { useMutation } from '@tanstack/react-query'
import { usePublicClient, useWalletClient, useChainId } from 'wagmi'
import {
  createAtomFromString,
  getMultiVaultAddressFromChainId,
} from '@0xintuition/sdk'
import { parseEther } from 'viem'

export function useCreateAtom() {
  const chainId = useChainId()
  const publicClient = usePublicClient()
  const { data: walletClient } = useWalletClient()

  return useMutation({
    mutationFn: async ({ data, deposit }: { data: string, deposit?: string }) => {
      if (!publicClient || !walletClient) {
        throw new Error('Wallet not connected')
      }

      const address = getMultiVaultAddressFromChainId(chainId)

      return createAtomFromString(
        { walletClient, publicClient, address },
        data,
        deposit ? parseEther(deposit) : undefined
      )
    },
  })
}

// Usage in component
function MyComponent() {
  const createAtom = useCreateAtom()

  const handleCreate = async () => {
    const result = await createAtom.mutateAsync({
      data: 'My Atom',
      deposit: '0.01',
    })
    console.log('Created:', result.state.termId)
  }

  return (
    <button
      onClick={handleCreate}
      disabled={createAtom.isPending}
    >
      {createAtom.isPending ? 'Creating...' : 'Create Atom'}
    </button>
  )
}
```

## Query Hooks

Fetch data with React Query:

```typescript title="useAtomDetails.ts"
import { useQuery } from '@tanstack/react-query'
import { getAtomDetails } from '@0xintuition/sdk'

export function useAtomDetails(atomId: string | undefined) {
  return useQuery({
    queryKey: ['atom', atomId],
    queryFn: () => atomId ? getAtomDetails(atomId) : null,
    enabled: !!atomId,
    staleTime: 30000, // 30 seconds
  })
}

// Usage
function AtomDisplay({ atomId }: { atomId: string }) {
  const { data: atom, isLoading, error } = useAtomDetails(atomId)

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error loading atom</div>
  if (!atom) return null

  return (
    <div>
      <h3>{atom.label}</h3>
      <p>Creator: {atom.creator}</p>
      <p>Shares: {atom.vault.totalShares}</p>
    </div>
  )
}
```

## Complete Example

Full-featured React component:

```typescript title="AtomManager.tsx"
import { useState } from 'react'
import { useAccount, usePublicClient, useWalletClient, useChainId } from 'wagmi'
import { useQuery, useMutation } from '@tanstack/react-query'
import {
  createAtomFromString,
  getAtomDetails,
  globalSearch,
  getMultiVaultAddressFromChainId,
} from '@0xintuition/sdk'
import { parseEther } from 'viem'

export function AtomManager() {
  const chainId = useChainId()
  const { address: accountAddress } = useAccount()
  const publicClient = usePublicClient()
  const { data: walletClient } = useWalletClient()
  const [searchQuery, setSearchQuery] = useState('')
  const [newAtomData, setNewAtomData] = useState('')

  // Search atoms
  const { data: searchResults } = useQuery({
    queryKey: ['search', searchQuery],
    queryFn: () => globalSearch(searchQuery, { atomsLimit: 10 }),
    enabled: searchQuery.length > 2,
  })

  // Create atom mutation
  const createAtom = useMutation({
    mutationFn: async (data: string) => {
      if (!publicClient || !walletClient) throw new Error('Not connected')

      const address = getMultiVaultAddressFromChainId(chainId)
      return createAtomFromString(
        { walletClient, publicClient, address },
        data,
        parseEther('0.01')
      )
    },
    onSuccess: (result) => {
      console.log('Created:', result.state.termId)
      setNewAtomData('')
    },
  })

  return (
    <div>
      <h2>Atom Manager</h2>

      {/* Search */}
      <div>
        <h3>Search Atoms</h3>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search..."
        />
        {searchResults?.atoms.map(atom => (
          <div key={atom.id}>{atom.label}</div>
        ))}
      </div>

      {/* Create */}
      <div>
        <h3>Create Atom</h3>
        <input
          type="text"
          value={newAtomData}
          onChange={(e) => setNewAtomData(e.target.value)}
          placeholder="Atom data..."
        />
        <button
          onClick={() => createAtom.mutate(newAtomData)}
          disabled={!accountAddress || createAtom.isPending}
        >
          {createAtom.isPending ? 'Creating...' : 'Create'}
        </button>
      </div>
    </div>
  )
}
```

## Related Resources

- [TanStack Query Integration](./tanstack-query.md)
- [Wagmi Documentation](https://wagmi.sh)
- [SDK Quick Start](../getting-started/quick-start.md)

## See Also

- [Wagmi Hooks Reference](https://wagmi.sh/react/hooks)
- [TanStack Query](https://tanstack.com/query)
