---
title: "Configuration and URI limits"
sidebar_label: "Configuration and URI limits"
description: "Read the active MultiVault creation costs, fee rates, minimums and byte limits for an atom and its context URIs."
kind: reference
reader: ["app"]
packages: ["@0xintuition/protocol"]
---

<AppliesTo />

Read configuration from the intended MultiVault on the intended chain. A quote based on an earlier block can change before creation.

| Getter | What to read |
| --- | --- |
| `getGeneralConfig()` | `atomDataMaxLength` limits the atom payload in bytes. `minDeposit` is a native asset amount and `minShare` is the share seed for vault creation. `feeDenominator` is the denominator for configured fee rates. |
| `getAtomConfig()` | `atomCreationProtocolFee` is the flat creation fee in native wei. `atomWalletDepositFee` is a rate applied to deposits. |
| `getAtomCost()` | Returns the static cost per atom. The implementation adds the creation fee and one `minShare` seed under its 1:1 default-curve assumption. |
| `getTripleCost()` | Returns the static cost per triple. This includes the triple creation fee and two seeds for the triple and its counter. |
| `getVaultFees()` | Returns `entryFee`, `exitFee`, and `protocolFee` as numerators over `feeDenominator`. |
| `getBondingCurveConfig()` | Returns the curve registry and `defaultCurveId`. |

To estimate a creation that also buys shares, use `previewAtomCreate(termId, assets)` or `previewTripleCreate(subjectId, predicateId, objectId, assets)`. Each returns shares, the asset base used to calculate rate fees, and net assets credited after fees. A static creation cost alone cannot tell you how many shares the creator will receive.

## Check URI inputs

`getAtomUriConfig()` returns two effective limits in order, `maxUriCount` per atom and `maxUriLength` in bytes per URI. The getter applies the implementation's defaults if storage is unset. The timelock can update the limits. Count encoded bytes when validating text, since a character may occupy several bytes.

For a creation with two atoms, supply two URI lists in the same order as the payloads. An empty list attaches no context to that atom. MultiVault emits opaque URI bytes for a nonempty list. It does not fetch a resource, validate its contents, or store its bytes as part of the atom's identity.

The protocol package exposes `multiVaultGetAtomCost` and `multiVaultGetAtomUriConfig` for these reads. [Configuration structures](https://github.com/0xIntuition/intuition-contracts-v2/blob/82cfcdb832c100fd2e53ee3f474289ae14cc6020/src/interfaces/IMultiVaultCore.sol) · [Cost calculations](https://github.com/0xIntuition/intuition-contracts-v2/blob/82cfcdb832c100fd2e53ee3f474289ae14cc6020/src/protocol/MultiVaultCore.sol) · [Effective URI limits](https://github.com/0xIntuition/intuition-contracts-v2/blob/82cfcdb832c100fd2e53ee3f474289ae14cc6020/src/protocol/MultiVault.sol) · [URI validation](https://github.com/0xIntuition/intuition-contracts-v2/blob/82cfcdb832c100fd2e53ee3f474289ae14cc6020/src/libraries/MultiVaultLib.sol)
