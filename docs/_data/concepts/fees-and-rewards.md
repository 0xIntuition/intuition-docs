---
title: "Fees, epochs and rewards"
sidebar_label: "Fees, epochs and rewards"
description: "Trace creation costs and affiliate fees, then learn how bonded balances and utilization determine rewards for a completed epoch."
kind: concept
reader: ["app"]
packages: ["@0xintuition/protocol", "@0xintuition/sdk", "@0xintuition/curves", "@0xintuition/periphery"]
depends_on: ["vaults", "bonding-curves"]
---

<AppliesTo />

Creating a term, depositing assets and redeeming shares have different costs. Routing a transaction through FeeProxy can add an affiliate fee. Epoch rewards come from a separate contract, TrustBonding, which uses locked balances and protocol utilization to allocate emissions over time.

**Builds on:** [Vaults, shares and positions](/docs/concepts/vaults), [Bonding curves](/docs/concepts/bonding-curves).

**Implemented by:** [protocol](/docs/reference/packages/protocol), [sdk](/docs/reference/packages/sdk), [curves](/docs/reference/packages/curves), [periphery](/docs/reference/packages/periphery).

## How it works

**Creation.** MultiVault’s `getAtomCost` and `getTripleCost` expose configured creation costs. Each includes a fixed creation protocol fee and a minimum share seed. A triple seeds both positive and counter vaults. The creation preview estimates how much of a proposed payment remains available for the creator’s shares after costs and applicable fees. [Creation costs](https://github.com/0xIntuition/intuition-contracts-v2/blob/82cfcdb832c100fd2e53ee3f474289ae14cc6020/src/protocol/MultiVaultCore.sol) · [Creation previews](https://github.com/0xIntuition/intuition-contracts-v2/blob/82cfcdb832c100fd2e53ee3f474289ae14cc6020/src/protocol/MultiVault.sol)

**Deposits and redemptions.** MultiVault applies a protocol fee to the applicable asset base, rounding the fee up using the configured denominator. Depending on the operation and term, entry or exit fees, atom-wallet fees, a fraction allocated to component vaults, or a curve’s own fee may also apply. Read the deployment’s configuration and preview the specific operation before deciding on a minimum output. [Fee calculation and allocation](https://github.com/0xIntuition/intuition-contracts-v2/blob/82cfcdb832c100fd2e53ee3f474289ae14cc6020/src/libraries/MultiVaultLib.sol)

**Affiliate routing.** FeeProxy forwards deposits and creations for a registered active affiliate. The affiliate’s schedule may include a percentage and a fixed amount. The proxy checks the fee caps, caller's fee guard, and required approvals. It deducts the affiliate fee before forwarding the remainder to MultiVault, where protocol rules still apply. [FeeProxy routing and previews](https://github.com/0xIntuition/intuition-contracts-v2/blob/82cfcdb832c100fd2e53ee3f474289ae14cc6020/src/periphery/FeeProxy.sol)

**Epoch rewards.** TrustBonding uses a token lock to establish a bonded balance. An epoch is a time interval defined by the emissions controller. The contract uses the account’s share of total bonded balance at epoch end and the available epoch emissions to calculate its raw reward. System utilization adjusts the emissions from epoch 2 onward. Personal utilization adjusts the account’s reward. A vault deposit alone does not establish a bonded balance. [TrustBonding reward calculation](https://github.com/0xIntuition/intuition-contracts-v2/blob/82cfcdb832c100fd2e53ee3f474289ae14cc6020/src/protocol/emissions/TrustBonding.sol)

## Example

Suppose a FeeProxy deposit has 20,100 asset base units gross, a hypothetical affiliate rate of 50 basis points, and a fixed fee of 3 units. One basis point is one ten-thousandth. The percentage component is `20,100 × 50 / 10,000`, rounded down to 100 units. Adding the fixed 3 gives **103 units to the affiliate** and **19,997 units forwarded to MultiVault**. Quoting shares uses the forwarded amount and the vault’s own costs. [Affiliate fee formula](https://github.com/0xIntuition/intuition-contracts-v2/blob/82cfcdb832c100fd2e53ee3f474289ae14cc6020/src/periphery/FeeProxy.sol)

For rewards, suppose the current epoch is 8. A claim in that epoch targets epoch 7. The caller needs a positive adjusted reward for epoch 7 and must still be eligible to claim it. The contract checks for an earlier claim, a nonzero recipient, an unpaused claim path, and remaining epoch budget. The budget can cap the payout. Use `getUserCurrentClaimableRewards` to read the account’s estimate before reviewing any claim transaction. [Claim checks](https://github.com/0xIntuition/intuition-contracts-v2/blob/82cfcdb832c100fd2e53ee3f474289ae14cc6020/src/protocol/emissions/TrustBonding.sol)

## Common mistakes

- **Treating gross assets as the share purchase amount.** Follow the deductions from the gross payment to the assets actually priced by the vault.
- **Treating an affiliate fee as the protocol fee.** Each layer has its own base, settings and rounding.
- **Saving up several old epoch claims.** The claim path targets only the immediately preceding epoch and cannot pay a claim during epoch zero.

## Next

Use the [FeeProxy reference](/docs/reference/contracts/fee-proxy) for routing and the [TrustBonding reference](/docs/reference/contracts/trust-bonding) for locks and claims.
