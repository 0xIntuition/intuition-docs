---
title: "Networks"
sidebar_label: "Networks"
description: "Find the chain ID, native currency, RPC transports and explorer for each Intuition network."
kind: reference
reader: ["app", "operator"]
packages: ["@0xintuition/deployments"]
---

<AppliesTo />

Select the Intuition chain that holds the state you want to read. The deployments package exports `intuitionMainnet` and `intuitionTestnet` as viem chain definitions. These are the defaults recorded in that package.

| Setting | Intuition mainnet | Intuition testnet |
| --- | --- | --- |
| Chain ID | `1155` | `13579` |
| Native currency | TRUST, 18 decimals | tTRUST, 18 decimals |
| HTTP RPC | `https://rpc.intuition.systems/http` | `https://testnet.rpc.intuition.systems/http` |
| WebSocket RPC | `wss://rpc.intuition.systems/ws` | `wss://testnet.rpc.intuition.systems/ws` |
| Block explorer | [Mainnet explorer](https://explorer.intuition.systems) | [Testnet explorer](https://testnet.explorer.intuition.systems) |

Use the explorer for the same chain as the transaction or address. Base (8453) and Base Sepolia (84532) appear in the [deployment tables](/docs/reference/contracts/deployments) for associated contracts. Use the Intuition chain IDs above for Intuition vault operations.

The [testnet faucet](/docs/reference/networks/faucet) supplies the entry point for requesting test currency. For application queries against an indexed graph, use the [Query API on your own Core node](/docs/build/query-core). [Pinned network definitions](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/deployments/src/networks.ts)
