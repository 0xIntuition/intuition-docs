---
title: "Signals"
sidebar_label: "Signals"
description: "Interpret deposits on atoms, triples and counter-triples using the side, curve, account and observation time."
kind: concept
reader: ["app", "agent", "operator", "plugin"]
packages: ["@0xintuition/sdk", "@0xintuition/react"]
depends_on: ["vaults", "bonding-curves"]
---

<AppliesTo />

A deposit makes a signal observable by putting assets behind a particular term. A position on an atom can draw attention to an entity. A position on a triple or its counter-triple can back one side of a specific claim. Its economic weight depends on the amount and the vault. Establishing the claim itself takes evidence.

**Builds on:** [Vaults, shares and positions](/docs/concepts/vaults), [Bonding curves](/docs/concepts/bonding-curves).

**Implemented by:** [sdk](/docs/reference/packages/sdk), [react](/docs/reference/packages/react).

## How it works

Choose what the deposit refers to. Depositing on Mira’s artist atom backs that representation of Mira. Depositing on the credit “Night Ferry, by artist, Mira” backs a particular relationship. The counter-side is another term with its own vault. In the pinned MultiVault, a receiver with shares on one side cannot deposit on the other side of that triple **on the same curve**. [Deposit checks](https://github.com/0xIntuition/intuition-contracts-v2/blob/82cfcdb832c100fd2e53ee3f474289ae14cc6020/src/libraries/MultiVaultLib.sol)

To interpret a signal, keep the side, curve, deployment and observation block. A deposit records an action at a point in time. A current position records the shares still held after subsequent deposits and redemptions. The SDK exposes `multivaultGetUserPositionSnapshot` for an account, term and curve. In React, `usePosition` reads shares and estimates their asset value. [SDK position reads](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/sdk/src/actions/multivault.ts) · [React position reads](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/react/src/hooks/use-position.ts)

## Example

At one block on one curve, suppose an app finds positions on the recording credit with an estimated gross asset value of 90 units on the positive side and 30 on the counter-side. Of these 120 units, 75% back the positive side. Label that figure **share of observed asset value backing the credit** and name the curve and block.

The same figures could arise from one large positive position or several smaller ones. They tell you neither the number of independent people who agree nor the probability that Mira performed the recording. To evaluate the credit, inspect the source for that claim, such as the cited liner notes.

## Common mistakes

- **Counting deposits as people.** An account can deposit repeatedly or redeem later. A single person can also control multiple accounts.
- **Combining raw shares across curves or sides.** Convert the positions using their own vaults and identify the measure you summed.
- **Mistaking an empty counter-side for verification.** Zero observed opposition supplies no evidence about who played on a recording.

## Next

To show a holder the position behind a signal, see the [React package](/docs/reference/packages/react). To read indexed terms and relationships, see [Query a Core node](/docs/build/query-core).
