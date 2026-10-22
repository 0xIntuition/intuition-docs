---
title: '@0xintuition/react guide'
slug: /build/packages/react
sidebar_position: 19
---

Compose protocol read/write hooks and observable transaction lifecycle state in React.

Candidate source version: **0.1.0-alpha.1**. [Release compatibility](../compatibility.md) explains publication and deployment prerequisites.

## Install

```sh
npm install @0xintuition/react@0.1.0-alpha.1 viem@^2
```

Use ESM imports. Required peers: `@tanstack/react-query >=5`, `react >=18`, `viem ^2.0.0`, `wagmi >=2`.

## Main surface

| Export or operation  | Purpose                                                  |
| -------------------- | -------------------------------------------------------- |
| `IntuitionProvider`  | Intuition configuration inside wagmi and Query providers |
| `useAtomCost()`      | Creation-cost read hook                                  |
| `useTransactionFlow` | Submission and receipt-confirmation state                |
| `useCreateAtomFlow`  | Ordinary atom creation plus ID extraction                |

## First use

Wrap the application in `WagmiProvider`, then `QueryClientProvider`, then `IntuitionProvider`. Start with a read-only `useAtomCost` component. Add wallet connectors and explicit transaction handling when implementing writes. See the complete [provider setup](https://github.com/0xIntuition/packages/tree/1dc7103d2a05f23bc565a81df4b001336ce9ba53/packages/react/README.md#providers).

## Integration decisions

Use compatible React, wagmi, TanStack Query, and viem peers. The candidate supports React 18+ but release checks exercise React 19/wagmi 2/Query 5. Reset does not cancel a submitted transaction, and the ordinary creation hook does not register URI context.

## Source and full contract

[Source and package guide](https://github.com/0xIntuition/packages/tree/1dc7103d2a05f23bc565a81df4b001336ce9ba53/packages/react) · [npm package](https://www.npmjs.com/package/@0xintuition/react). The [machine-readable manifest](/intuition-release.json) lists all declared public subpaths and peer dependencies. Npm links name the intended package; this page does not assert that the candidate has been published.
