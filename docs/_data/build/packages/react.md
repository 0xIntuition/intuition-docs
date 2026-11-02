---
title: '@0xintuition/react guide'
slug: /build/packages/react
sidebar_position: 21
---

Compose protocol read/write hooks and observable transaction lifecycle state in React.

Published alpha version: **0.1.0-alpha.1**. [Release compatibility](../compatibility.md) records npm publication, peer dependencies, and deployment boundaries.

## Install

```sh
npm install @0xintuition/react@0.1.0-alpha.1 @0xintuition/protocol@3.0.0-alpha.0 @0xintuition/deployments@0.1.0-alpha.1 react@">=18" wagmi@^2 @tanstack/react-query@^5 viem@^2
```

Use ESM imports. Required peers: `@tanstack/react-query >=5`, `react >=18`, `viem ^2.0.0`, `wagmi >=2`, `@0xintuition/protocol 3.0.0-alpha.0`, and `@0xintuition/deployments 0.1.0-alpha.1`.

## Main surface

| Export or operation  | Purpose                                                  |
| -------------------- | -------------------------------------------------------- |
| `IntuitionProvider`  | Intuition configuration inside wagmi and Query providers |
| `useAtomCost()`      | Creation-cost read hook                                  |
| `useTransactionFlow` | Submission and receipt-confirmation state                |
| `useCreateAtomFlow`  | Ordinary atom creation plus ID extraction                |

## First use

Wrap the application in `WagmiProvider`, then `QueryClientProvider`, then `IntuitionProvider`. Start with a read-only `useAtomCost` component. Add wallet connectors and explicit transaction handling when implementing writes. See the complete [provider setup](https://github.com/0xIntuition/packages/tree/dde4fdf5774447b84cd0b820593fb0db7366e58d/packages/react/README.md#providers).

## Integration decisions

Use compatible React, wagmi, TanStack Query, and viem peers. The release supports React 18+ but release checks exercise React 19/wagmi 2/Query 5. Reset does not cancel a submitted transaction, and the ordinary creation hook does not register URI context.

## Source and full contract

[Source and package guide](https://github.com/0xIntuition/packages/tree/dde4fdf5774447b84cd0b820593fb0db7366e58d/packages/react) · [npm package](https://www.npmjs.com/package/@0xintuition/react/v/0.1.0-alpha.1). The [machine-readable manifest](/intuition-release.json) lists all declared public subpaths and peer dependencies. Exact npm versions, tarball integrity, and observed dist-tags are recorded in the manifest.
