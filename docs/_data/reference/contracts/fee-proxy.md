---
title: "FeeProxy"
sidebar_label: "FeeProxy"
description: "Trace the affiliate fee, forwarded amount, permissions and refund for a routed MultiVault call."
kind: reference
reader: ["app"]
packages: ["@0xintuition/periphery", "@0xintuition/sdk"]
---

<AppliesTo />

FeeProxy lets an affiliate charge a disclosed fee on a MultiVault deposit or creation. The Solidity contract ships in the core contracts artifact. The V2 periphery library provides FeeProxy helpers, and the SDK builds higher-level plans.

## Quote a route

`affiliateConfig(affiliate)` exposes the fee recipient and separate deposit and creation rates. `previewDepositFee(affiliate, grossAssets)` and `previewCreationFee(affiliate, grossAssets)` each return the affiliate fee and the assets available to forward. The fee equals `floor(grossAssets × bps / 10,000) + fixedFee`, in native wei.

For example, a hypothetical deposit of 10,000 wei at 50 basis points with a fixed fee of 3 wei gives the affiliate 53 wei and forwards 9,947 wei. That is the amount entering MultiVault before its own fees. For a batch, FeeProxy calculates one fee over the sum, allocates the forwarded amount in proportion to each gross amount, and assigns the rounding remainder to the last item.

| Operation | Execution requirements |
| --- | --- |
| `registerAffiliate(fees, feeRecipient)` | The calling address becomes the affiliate. It supplies exactly `registrationFee()`, a nonzero recipient, and fee settings within protocol caps. The affiliate can later call `updateAffiliateFees` and `updateFeeRecipient`. |
| `depositVia`, `depositBatchVia` | The receiver must approve FeeProxy for deposits in MultiVault. A receiver distinct from the caller must also approve that caller. Pass the share floor for the net deposit. |
| `createAtomsVia`, `createAtomsWithUrisVia`, `createTriplesVia` | The creator must approve FeeProxy for creation in MultiVault. The forwarded assets still have to cover the underlying creation costs. |

A preview only does fee arithmetic. A route requires an unpaused proxy and a registered, unpaused affiliate. FeeProxy checks the active side's protocol caps and the caller's `FeeGuard` fields, `maxFeeBps` and `maxFixedFee`. It rejects a fee equal to or larger than gross assets.

## Payments and refunds

After the MultiVault call succeeds, FeeProxy pays the affiliate's fee recipient. If that transfer fails, the routed call reverts. Excess native value beyond the declared gross amount goes back to the caller. If the caller cannot receive it, FeeProxy records a credit in `pendingRefund(user)`.

`claimRefund()` pays the caller its credit. `claimRefundTo(recipient)` sends the caller's credit to another payable address and rejects the zero address and FeeProxy itself. The SDK's `feeProxyCreateAtomsWithUrisEnvelope` includes a creation-fee quote and URI bounds for review before execution.

[FeeProxy implementation](https://github.com/0xIntuition/intuition-contracts-v2/blob/82cfcdb832c100fd2e53ee3f474289ae14cc6020/src/periphery/FeeProxy.sol) · [FeeProxy interface](https://github.com/0xIntuition/intuition-contracts-v2/blob/82cfcdb832c100fd2e53ee3f474289ae14cc6020/src/interfaces/IFeeProxy.sol) · [SDK plan](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/sdk/src/actions/plans/fee-proxy.ts)
