---
title: "MultiVault"
sidebar_label: "MultiVault"
description: "Look up term creation, deposit and redemption methods, then encode a deposit with the V2 protocol package."
kind: reference
reader: ["app"]
packages: ["@0xintuition/protocol"]
---

<AppliesTo />

An atom's input is a byte string. Its `termId` is the 32-byte ID derived from those bytes. A triple combines three existing term IDs in subject, predicate, object order. Vault operations take both a term ID and a curve ID, so keep both when displaying a balance.

## Create and look up terms

| Function | Inputs and result |
| --- | --- |
| `calculateAtomId(data)`, `isTermCreated(termId)` | Derive an ID, then check whether that term already exists. Calculating an ID requires no registration. |
| `createAtoms(data, assets)` | Create one atom per byte string with its corresponding native asset amount. A duplicate atom reverts. |
| `createAtomsWithUris(creator, data, assets, uris)` | Supply one URI list per atom at creation. Nonempty lists appear in `AtomContextRegistered`. These pointers are excluded from the ID and atom storage. Creating on behalf of another address requires its creation approval. |
| `createTriples(subjectIds, predicateIds, objectIds, assets)` | Supply parallel arrays of equal length. Each triple refers to three existing terms. |
| `getAtom(atomId)`, `getTriple(tripleId)` | Read the stored atom bytes or the three component IDs. These getters revert for a missing term. |

Use [configuration and URI limits](/docs/reference/contracts/configuration) for creation costs and input bounds. For a batch creation the native call value must equal the sum of the asset amounts.

## Preview a vault operation

`previewDeposit(termId, curveId, assets)` returns expected shares and assets credited after fees. `getShares(account, termId, curveId)` reads a holder's balance. `redeem(receiver, termId, curveId, shares, minAssets)` burns shares subject to a minimum payout. Its preview, `previewRedeem(termId, curveId, shares)`, has no account argument. On a curve with account-specific fees, a holder's actual redemption can differ from this preview.

## Encode a deposit

Pass the intended share floor as `minShares`. The encoder below produces calldata offline. A payable deposit also needs a target contract and native call value in wei. A preview describes the state read at quote time. Use the confirmed receipt and the target contract's [events](/docs/reference/contracts/events-and-errors) to determine the actual shares issued.

{/* example:start examples/v2/first-write/src/package-examples.ts#protocol-encoding */}
```ts
import { multiVaultDepositEncode } from '@0xintuition/protocol';
import type { Address, Hex } from 'viem';

// Caller-supplied values must describe an existing term and chosen curve.
export function encodeDeposit(
  receiver: Address,
  termId: Hex,
  curveId: bigint,
  minShares: bigint,
) {
  return multiVaultDepositEncode(receiver, termId, curveId, minShares);
}
```
{/* example:end */}

[MultiVault interface](https://github.com/0xIntuition/intuition-contracts-v2/blob/82cfcdb832c100fd2e53ee3f474289ae14cc6020/src/interfaces/IMultiVault.sol) · [Term getters](https://github.com/0xIntuition/intuition-contracts-v2/blob/82cfcdb832c100fd2e53ee3f474289ae14cc6020/src/interfaces/IMultiVaultCore.sol) · [Creation implementation](https://github.com/0xIntuition/intuition-contracts-v2/blob/82cfcdb832c100fd2e53ee3f474289ae14cc6020/src/libraries/MultiVaultLib.sol) · [V2 protocol wrappers](https://github.com/0xIntuition/packages/tree/4e9af1373b81a453d16bc650983138e35afb97d1/packages/protocol/src/core/multivault)
