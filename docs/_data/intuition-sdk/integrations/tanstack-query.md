---
title: TanStack Query Integration
sidebar_label: TanStack Query
sidebar_position: 3
description: Use the Intuition SDK with TanStack Query for optimized data fetching and caching
keywords: [sdk, react-query, tanstack, hooks, caching, data fetching]
---

# TanStack Query Integration

Integrate the Intuition SDK with TanStack Query (React Query) for powerful data fetching, caching, and synchronization.

## Setup

```bash
npm install @tanstack/react-query
```

```typescript title="App.tsx"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <YourApp />
    </QueryClientProvider>
  )
}
```

## Query Hooks

Create reusable query hooks for SDK functions:

### useAtomDetails

```typescript title="hooks/useAtomDetails.ts"
import { useQuery } from '@tanstack/react-query'
import { getAtomDetails } from '@0xintuition/sdk'

export function useAtomDetails(atomId: string | undefined) {
  return useQuery({
    queryKey: ['atom', atomId],
    queryFn: () => atomId ? getAtomDetails(atomId) : null,
    enabled: !!atomId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}
```

### useGlobalSearch

```typescript title="hooks/useGlobalSearch.ts"
import { useQuery } from '@tanstack/react-query'
import { globalSearch } from '@0xintuition/sdk'

export function useGlobalSearch(
  query: string,
  options?: { atomsLimit?: number }
) {
  return useQuery({
    queryKey: ['search', query, options],
    queryFn: () => globalSearch(query, options),
    enabled: query.length > 2,
    staleTime: 1000 * 60, // 1 minute
  })
}
```

## Mutation Hooks

Create mutation hooks for write operations:

### useCreateAtom

```typescript title="hooks/useCreateAtom.ts"
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { usePublicClient, useWalletClient, useChainId } from 'wagmi'
import {
  createAtomFromString,
  getMultiVaultAddressFromChainId,
} from '@0xintuition/sdk'
import { parseEther } from 'viem'

export function useCreateAtom() {
  const queryClient = useQueryClient()
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
    onSuccess: (result) => {
      // Invalidate search queries to refetch
      queryClient.invalidateQueries({ queryKey: ['search'] })

      // Optionally prefetch the new atom details
      queryClient.setQueryData(['atom', result.state.termId], result)
    },
  })
}
```

### useCreateTriple

```typescript title="hooks/useCreateTriple.ts"
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { usePublicClient, useWalletClient, useChainId } from 'wagmi'
import {
  createTripleStatement,
  getMultiVaultAddressFromChainId,
} from '@0xintuition/sdk'
import { parseEther } from 'viem'

export function useCreateTriple() {
  const queryClient = useQueryClient()
  const chainId = useChainId()
  const publicClient = usePublicClient()
  const { data: walletClient } = useWalletClient()

  return useMutation({
    mutationFn: async ({
      subjectId,
      predicateId,
      objectId,
      deposit,
    }: {
      subjectId: string
      predicateId: string
      objectId: string
      deposit: string
    }) => {
      if (!publicClient || !walletClient) {
        throw new Error('Wallet not connected')
      }

      const address = getMultiVaultAddressFromChainId(chainId)
      const depositAmount = parseEther(deposit)

      return createTripleStatement(
        { walletClient, publicClient, address },
        {
          args: [
            [subjectId as `0x${string}`],
            [predicateId as `0x${string}`],
            [objectId as `0x${string}`],
            [depositAmount],
          ],
          value: depositAmount,
        }
      )
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['search'] })
      queryClient.invalidateQueries({ queryKey: ['triple'] })
    },
  })
}
```

## Complete Example

Full React component with TanStack Query:

```typescript title="AtomExplorer.tsx"
import { useState } from 'react'
import { useCreateAtom, useGlobalSearch, useAtomDetails } from './hooks'

export function AtomExplorer() {
  const [searchQuery, setSearchQuery] = useState('')
  const [newAtomData, setNewAtomData] = useState('')
  const [selectedAtomId, setSelectedAtomId] = useState<string>()

  // Queries
  const search = useGlobalSearch(searchQuery, { atomsLimit: 10 })
  const atomDetails = useAtomDetails(selectedAtomId)

  // Mutations
  const createAtom = useCreateAtom()

  const handleCreateAtom = async () => {
    try {
      const result = await createAtom.mutateAsync({
        data: newAtomData,
        deposit: '0.01',
      })

      setNewAtomData('')
      setSelectedAtomId(result.state.termId)

    } catch (error) {
      console.error('Failed to create atom:', error)
    }
  }

  return (
    <div>
      {/* Search */}
      <div>
        <h3>Search Atoms</h3>
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search..."
        />

        {search.isLoading && <p>Searching...</p>}

        {search.data?.atoms.map(atom => (
          <div
            key={atom.id}
            onClick={() => setSelectedAtomId(atom.id)}
            style={{ cursor: 'pointer' }}
          >
            {atom.label}
          </div>
        ))}
      </div>

      {/* Create */}
      <div>
        <h3>Create Atom</h3>
        <input
          value={newAtomData}
          onChange={(e) => setNewAtomData(e.target.value)}
          placeholder="Atom data..."
        />
        <button
          onClick={handleCreateAtom}
          disabled={createAtom.isPending || !newAtomData}
        >
          {createAtom.isPending ? 'Creating...' : 'Create'}
        </button>

        {createAtom.isError && (
          <p>Error: {createAtom.error.message}</p>
        )}
      </div>

      {/* Details */}
      {selectedAtomId && (
        <div>
          <h3>Atom Details</h3>
          {atomDetails.isLoading && <p>Loading...</p>}

          {atomDetails.data && (
            <div>
              <p>Label: {atomDetails.data.label}</p>
              <p>Creator: {atomDetails.data.creator}</p>
              <p>Shares: {atomDetails.data.vault.totalShares}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
```

## Advanced Patterns

### Optimistic Updates

```typescript
const createAtom = useMutation({
  mutationFn: createAtomFunction,
  onMutate: async (newAtom) => {
    // Cancel outgoing refetches
    await queryClient.cancelQueries({ queryKey: ['search'] })

    // Snapshot previous value
    const previous = queryClient.getQueryData(['search'])

    // Optimistically update
    queryClient.setQueryData(['search'], (old: any) => ({
      ...old,
      atoms: [...(old?.atoms || []), { id: 'temp', label: newAtom.data }],
    }))

    return { previous }
  },
  onError: (err, newAtom, context) => {
    // Rollback on error
    queryClient.setQueryData(['search'], context?.previous)
  },
  onSettled: () => {
    queryClient.invalidateQueries({ queryKey: ['search'] })
  },
})
```

### Dependent Queries

```typescript
function AtomWithTriples({ atomId }: { atomId: string }) {
  const atom = useAtomDetails(atomId)

  const triples = useQuery({
    queryKey: ['triples', atomId],
    queryFn: () => fetchTriplesForAtom(atomId),
    enabled: !!atom.data, // Only fetch when atom is loaded
  })

  return (/* ... */)
}
```

## Related Resources

- [React Integration](./react.md)
- [TanStack Query Documentation](https://tanstack.com/query)

## See Also

- [Wagmi Hooks](https://wagmi.sh)
- [SDK Query Functions](../search/global-search.md)
