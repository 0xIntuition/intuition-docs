---
title: '@0xintuition/react'
sidebar_label: 'React'
description: 'Configure providers and use chain read, write, and transaction-flow hooks in a React application.'
kind: reference
reader: ["app"]
packages: ["@0xintuition/react"]
---

<AppliesTo />

## What it's for

React hooks for protocol reads, writes, and transaction lifecycle state. The hooks query contracts through wagmi; they do not query the indexed graph from Intuition Core.

## When to use it

Use it inside an existing React application that needs atom, triple, vault, or position state and explicit write flows. Use [protocol](/docs/reference/packages/protocol) in a framework-independent script. For indexed V2 graph reads, [query a Core node](/docs/build/query-core).

## Install

```sh
npm install @0xintuition/react@0.1.0 @0xintuition/protocol@4.0.0 @0xintuition/deployments@0.1.0 react@19.1.0 react-dom@19.1.0 wagmi@2.15.4 @tanstack/react-query@5.90.2 viem@2.31.4
```

Use ESM. This example uses the release-tested React 19, wagmi 2, and Query 5 combination. The host supplies its renderer; `react-dom` is not a peer declared by this library.

## Entry points

| Subpath | Purpose |
| --- | --- |
| `.` | Providers, read/write/flow hooks, identity hooks, and public types |

## Depends on and works with

Runtime graph edges: [deployments](/docs/reference/packages/deployments), [ids](/docs/reference/packages/ids), and [protocol](/docs/reference/packages/protocol). The manifest declares ids as an ordinary dependency and deployments/protocol as peers so the host selects shared copies.

| Peer | Published range |
| --- | --- |
| `@tanstack/react-query` | `>=5` |
| `react` | `>=18` |
| `viem` | `^2.0.0` |
| `wagmi` | `>=2` |
| `@0xintuition/protocol` | `^4.0.0` |
| `@0xintuition/deployments` | `^0.1.0` |

Use `WagmiProvider`, then `QueryClientProvider`, then `IntuitionProvider`. In an existing app, reuse its wagmi and Query providers. The documented TypeScript setup is strict with `skipLibCheck: true`, matching the release consumer checks; checking the entire upstream declaration graph without that option is not verified by this package release.

## Example

Mounting this component performs a testnet RPC read over HTTP. It requires no wallet connector, signing key, or Core node.

{/* example:start examples/v2/react-app/src/package-example.tsx#provider-read */}
```tsx
'use client';

import { intuitionTestnet } from '@0xintuition/deployments';
import { IntuitionProvider, useAtomCost } from '@0xintuition/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { createConfig, http, WagmiProvider } from 'wagmi';

const config = createConfig({
  chains: [intuitionTestnet],
  transports: { [intuitionTestnet.id]: http() },
});

function AtomCost() {
  const { data, isLoading, error } = useAtomCost();
  const message = isLoading
    ? 'Loading atom creation cost…'
    : error
      ? 'Unable to load the cost. Check your RPC connection and reload.'
      : data === undefined
        ? 'No atom creation cost is available. Check your network configuration.'
        : `Atom creation cost: ${data.toString()} wei`;
  return <p role="status">{message}</p>;
}

export function PackageExample() {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <IntuitionProvider network="testnet">
          <AtomCost />
        </IntuitionProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
```
{/* example:end */}

Loading, missing data, and errors produce readable status text. This is a minimal provider/hook composition, not a complete application. Configure a compatible RPC and deployment through the providers before mounting it.

For writes, supply your application's connected wallet and handle promise rejection. `useTransactionFlow` coordinates submission and receipt confirmation; `reset()` or unmount rejects a pending execution but does not cancel a wallet request or on-chain transaction. Reverted receipts are errors, and only one execution may be active.

`useCreateAtomFlow` uses ordinary `createAtoms` and extracts term IDs only from the configured MultiVault's logs. It does not implicitly register URI context. For URI-aware creation, compose `multiVaultCreateAtomsWithUris` from protocol with `useTransactionFlow`; no dedicated URI-aware creation hook is included in this release.

## Related concepts

- [Signals](/docs/concepts/signals)

## Source

[Package README](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/react/README.md), [public exports](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/react/src/index.ts), [atom hooks](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/react/src/hooks/use-atom.ts), and [creation flow](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/react/src/hooks/use-create-atom-flow.ts).
