---
title: "TrustBonding"
sidebar_label: "TrustBonding"
description: "Distinguish locked principal, time-weighted voting power and the rewards claimable for the previous epoch."
kind: reference
reader: ["app"]
packages: ["@0xintuition/protocol", "@0xintuition/sdk"]
---

<AppliesTo />

TrustBonding locks a token balance for a chosen duration. The principal stays locked while its voting power declines toward zero as the unlock time approaches. Rewards use epoch-end voting power and protocol activity.

## Lock and withdraw

`create_lock(_value, _unlock_time)` takes a token amount in base units and a Unix timestamp in seconds. The escrow transfers the configured token from the caller, so the account needs that token and sufficient allowance. For a WrappedTrust position, the amount is in 18-decimal WTRUST units. The SDK's claim-and-restake plan includes separate wrapping and allowance steps when needed.

The contract rounds the requested unlock time down to a whole week and checks it against `MINTIME` and `MAXTIME`. An account can add principal with `increase_amount` or extend an active lock with `increase_unlock_time`. Under normal lock conditions, `withdraw()` returns the underlying principal after expiry. Read `getUserInfo(account)` for the lock end and bonded balance.

## Epochs and claims

| Question | Contract read |
| --- | --- |
| Which epoch is open? | `currentEpoch()` and `epochTimestampEnd(epoch)` identify the epoch and its closing timestamp. |
| What weight did this account contribute? | `userBondedBalanceAtEpochEnd(account, epoch)` gives the account's snapshot. Compare it with `totalBondedBalanceAtEpochEnd(epoch)`. |
| What can this account claim now? | `getUserCurrentClaimableRewards(account)` estimates the previous epoch's claim. `hasClaimedRewardsForEpoch(account, epoch)` checks claim history. |

System utilization determines the epoch emissions available for distribution. The account's fraction of total epoch-end voting power determines its raw share. Personal utilization adjusts that share. A claim also respects the remaining epoch budget.

`claimRewards(recipient)` claims for the caller and sends the reward to the specified nonzero recipient. During epoch 8, for example, it can claim epoch 7 once. There is no claim during epoch 0 and no parameter to claim an older missed epoch. A successful claim emits `RewardsClaimed(user, recipient, amount)`. The SDK exposes `trustBondingGetClaimActionState` for applications deciding whether to show the claim action.

[TrustBonding implementation](https://github.com/0xIntuition/intuition-contracts-v2/blob/82cfcdb832c100fd2e53ee3f474289ae14cc6020/src/protocol/emissions/TrustBonding.sol) · [Lock accounting](https://github.com/0xIntuition/intuition-contracts-v2/blob/82cfcdb832c100fd2e53ee3f474289ae14cc6020/src/external/curve/VotingEscrow.sol) · [Protocol wrappers](https://github.com/0xIntuition/packages/tree/4e9af1373b81a453d16bc650983138e35afb97d1/packages/protocol/src/core/trustbonding) · [SDK actions](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/sdk/src/actions/trust-bonding.ts)
