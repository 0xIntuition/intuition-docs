---
title: "Events and errors"
sidebar_label: "Events and errors"
description: "Identify term and vault events in receipts and choose the ABI that can decode a contract error."
kind: reference
reader: ["app", "operator"]
packages: ["@0xintuition/protocol"]
---

<AppliesTo />

Filter receipt logs by the emitting contract address before decoding them. Indexed fields can be filtered as topics. The remaining fields come from the log data. For example, a FeeProxy deposit can produce both a MultiVault deposit event and a FeeProxy routing event in one receipt.

## Decode events

The fields in each row are in ABI order. For these events the indexed fields come first.

| Contract and event | Indexed fields, in order | Data fields, in order |
| --- | --- | --- |
| MultiVault `AtomCreated` | `creator`, `termId` | `atomData`, `atomWallet` |
| MultiVault `AtomContextRegistered` | `termId`, `registrant` | `uris` |
| MultiVault `TripleCreated` | `creator`, `termId` | `subjectId`, `predicateId`, `objectId` |
| MultiVault `Deposited` | `sender`, `receiver`, `termId` | `curveId`, `assets`, `assetsAfterFees`, `shares`, `receiverSharesAfter`, `vaultType` |
| MultiVault `Redeemed` | `sender`, `account`, `termId` | `curveId`, `shares`, `accountSharesAfter`, `assetsAfterFees`, `totalFees`, `vaultType` |
| TrustBonding `RewardsClaimed` | `user`, `recipient` | `amount` |

Group atom context with the atom using its `termId`. An empty URI list produces no context event. For a vault position, keep its `termId` and `curveId` together. The final share balance in a deposit or redemption event belongs to the named holder. In a rewards claim, the user earned the reward and the recipient received the transfer.

## Interpret a revert

A custom error has a selector and, for errors that take arguments, ABI-encoded data. Decode it against the implementation and call path you used.

| Error | What to check |
| --- | --- |
| `MultiVault_AtomExists(bytes atomData)` | The bytes already identify an existing atom. Reuse that ID when referring to it. |
| `MultiVault_AtomUriCountExceeded()`, `MultiVault_AtomUriLengthExceeded()` | Compare each atom's URI list with the [current limits](/docs/reference/contracts/configuration). |
| `MultiVault_SlippageExceeded()` | Compare the deposit or redemption result with the minimum output on the request. |
| `FeeProxy_BpsExceedsCallerGuard(uint256 configured, uint256 callerMax)` | The affiliate's rate exceeds the caller's maximum. Refresh the quote before deciding whether to proceed. |
| `TrustBonding_RewardsAlreadyClaimedForEpoch()` | Check the caller's claim history for the previous epoch. |

A MultiVault call can also propagate an error from a curve or its registry, such as `BondingCurveRegistry_InvalidCurveId()`. Use `MultiVaultWithRevertsAbi` to decode those cases. The packages library constructs this composite by adding distinct external error signatures to `MultiVaultAbi`. It keeps the published MultiVault ABI available separately.

[MultiVault events](https://github.com/0xIntuition/intuition-contracts-v2/blob/82cfcdb832c100fd2e53ee3f474289ae14cc6020/src/interfaces/IMultiVault.sol) · [FeeProxy errors](https://github.com/0xIntuition/intuition-contracts-v2/blob/82cfcdb832c100fd2e53ee3f474289ae14cc6020/src/interfaces/IFeeProxy.sol) · [TrustBonding events and errors](https://github.com/0xIntuition/intuition-contracts-v2/blob/82cfcdb832c100fd2e53ee3f474289ae14cc6020/src/interfaces/ITrustBonding.sol) · [Composite ABI source](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/deployments/src/abis/multivault-reverts-abi.ts)
