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
npm install @tanstack/react-query wagmi viem
```

Wagmi hooks require `WagmiProvider`, while both TanStack Query hooks and Wagmi's query-backed hooks require `QueryClientProvider`. Create the Wagmi config once:

```typescript title="wagmi-config.ts"
import { intuitionTestnet } from '@0xintuition/sdk'
import { createConfig, http } from 'wagmi'
import { injected } from 'wagmi/connectors'

export const config = createConfig({
  chains: [intuitionTestnet],
  connectors: [injected()],
  transports: {
    [intuitionTestnet.id]: http(),
  },
})
```

Then pass that config to an application wrapper with both providers. Keeping `WagmiProvider` outside `QueryClientProvider` matches the provider tree used by the hooks below, including `useWalletClient`, which reads both contexts:

```typescript title="AppProviders.tsx"
import type { PropsWithChildren } from 'react'
import { WagmiProvider, type Config } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './sdk-config'

const queryClient = new QueryClient()

type AppProvidersProps = PropsWithChildren<{ config: Config }>

export function AppProviders({ children, config }: AppProvidersProps) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}
```

SDK read helpers use the mainnet GraphQL API by default. If the mutation hooks below write to Intuition Testnet, initialize the testnet read endpoint once before rendering the application:

```typescript title="sdk-config.ts"
import { configureSdk } from '@0xintuition/sdk'
import { API_URL_DEV } from '@0xintuition/graphql'

configureSdk({ apiUrl: API_URL_DEV })
```

Use `API_URL_PROD` instead when the write clients target `intuitionMainnet`. Atom creation helpers fetch and forward the required base cost; an optional amount is an additional TRUST/tTRUST deposit (signal).

Provider convention: Every usage component in this guide must render inside the `WagmiProvider` and `QueryClientProvider` shown above. Pasting a component into an app without that wrapper can throw `WagmiProviderNotFoundError` or `"No QueryClient set"`.

## Query Hooks

Create reusable query hooks for SDK functions.

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
import { globalSearch, type GlobalSearchOptions } from '@0xintuition/sdk'
import '../sdk-config'

export function useGlobalSearch(
  query: string,
  options: GlobalSearchOptions = {}
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
  getAtomDetails,
  getMultiVaultAddressFromChainId,
} from '@0xintuition/sdk'
import { parseEther } from 'viem'
import '../sdk-config'

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
    onSuccess: async (result) => {
      // Invalidate search queries to refetch
      await queryClient.invalidateQueries({ queryKey: ['search'] })

      // Populate the atom-details cache with the GraphQL result shape.
      await queryClient.prefetchQuery({
        queryKey: ['atom', result.state.termId],
        queryFn: () => getAtomDetails(result.state.termId),
      })
    },
  })
}
```

### useCreateTriple

The payable triple-deposit example is pending the post-publish SDK resync, so it is excluded from copy-paste typechecking until the published package has the corrected deposit-value behavior.

<!-- docs-typecheck: skip -->
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
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useChainId, usePublicClient, useWalletClient } from 'wagmi'
import {
  configureSdk,
  createAtomFromString,
  getAtomDetails,
  getMultiVaultAddressFromChainId,
  globalSearch,
} from '@0xintuition/sdk'
import { API_URL_DEV } from '@0xintuition/graphql'
import { parseEther } from 'viem'

configureSdk({ apiUrl: API_URL_DEV })

export function AtomExplorer() {
  // Renders inside the providers from Setup
  const chainId = useChainId()
  const publicClient = usePublicClient()
  const { data: walletClient } = useWalletClient()
  const queryClient = useQueryClient()
  const [searchQuery, setSearchQuery] = useState('')
  const [newAtomData, setNewAtomData] = useState('')
  const [selectedAtomId, setSelectedAtomId] = useState<string>()

  // Queries
  const search = useQuery({
    queryKey: ['search', searchQuery],
    queryFn: () => globalSearch(searchQuery, { atomsLimit: 10 }),
    enabled: searchQuery.length > 2,
  })
  const atomDetails = useQuery({
    queryKey: ['atom', selectedAtomId],
    queryFn: () => selectedAtomId ? getAtomDetails(selectedAtomId) : null,
    enabled: !!selectedAtomId,
  })

  // Mutations
  const createAtom = useMutation({
    mutationFn: async ({ data, deposit }: { data: string, deposit: string }) => {
      if (!publicClient || !walletClient) {
        throw new Error('Wallet not connected')
      }

      return createAtomFromString(
        {
          walletClient,
          publicClient,
          address: getMultiVaultAddressFromChainId(chainId),
        },
        data,
        parseEther(deposit),
      )
    },
    onSuccess: async (result) => {
      await queryClient.invalidateQueries({ queryKey: ['search'] })
      await queryClient.prefetchQuery({
        queryKey: ['atom', result.state.termId],
        queryFn: () => getAtomDetails(result.state.termId),
      })
    },
  })

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
            key={atom.term_id}
            onClick={() => setSelectedAtomId(atom.term_id)}
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
              <p>Creator: {atomDetails.data.creator?.label ?? atomDetails.data.creator_id}</p>
              <p>Shares: {atomDetails.data.term?.vaults[0]?.total_shares ?? 'Unavailable'}</p>
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
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createAtomFromString } from '@0xintuition/sdk'
import type { WriteConfig } from '@0xintuition/protocol'

type NewAtom = { data: string }
type AtomSummary = { term_id: string, label: string }
type SearchData = { atoms: AtomSummary[] }

export function useOptimisticCreateAtom(
  config: WriteConfig,
) {
  const queryClient = useQueryClient()

  return useMutation<
    AtomSummary,
    Error,
    NewAtom,
    { previous: SearchData | undefined }
  >({
    mutationFn: async (newAtom) => {
      const result = await createAtomFromString(config, newAtom.data)
      return { term_id: result.state.termId, label: newAtom.data }
    },
    onMutate: async (newAtom) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['search'] })

      // Snapshot previous value
      const previous = queryClient.getQueryData<SearchData>(['search'])

      // Optimistically update
      queryClient.setQueryData<SearchData>(['search'], (old) => ({
        ...old,
        atoms: [...(old?.atoms || []), { term_id: 'temp', label: newAtom.data }],
      }))

      return { previous }
    },
    onError: (_error, _newAtom, context) => {
      // Rollback on error
      queryClient.setQueryData(['search'], context?.previous)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['search'] })
    },
  })
}
```

### Dependent Queries

```typescript
import { useQuery } from '@tanstack/react-query'
import { getAtomDetails } from '@0xintuition/sdk'
import type { Hex } from 'viem'

type TripleSummary = { term_id: Hex, label: string }

type AtomWithTriplesProps = {
  atomId: Hex
  fetchTriplesForAtom: (atomId: Hex) => Promise<TripleSummary[]>
}

export function AtomWithTriples({
  atomId,
  fetchTriplesForAtom,
}: AtomWithTriplesProps) {
  // Renders inside the providers from Setup
  const atom = useQuery({
    queryKey: ['atom', atomId],
    queryFn: () => getAtomDetails(atomId),
  })

  const triples = useQuery({
    queryKey: ['triples', atomId],
    queryFn: () => fetchTriplesForAtom(atomId),
    enabled: !!atom.data, // Only fetch when atom is loaded
  })

  if (atom.isLoading || triples.isLoading) return <p>Loading...</p>

  return (
    <ul>
      {triples.data?.map((triple) => (
        <li key={triple.term_id}>{triple.label}</li>
      ))}
    </ul>
  )
}
```

## Related Resources

- [React Integration](./react.md)
- [TanStack Query Documentation](https://tanstack.com/query)

## See Also

- [Wagmi Hooks](https://wagmi.sh)
- [SDK Query Functions](/docs/intuition-sdk/search-guide)
