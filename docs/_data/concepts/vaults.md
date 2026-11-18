---
title: "Vaults, shares and positions"
sidebar_label: "Vaults, shares and positions"
description: "Identify a vault by its term and curve, read a holder’s shares, and distinguish deposited assets from a redemption estimate."
kind: concept
reader: ["app"]
packages: ["@0xintuition/protocol", "@0xintuition/sdk"]
depends_on: ["atoms", "triples"]
---

<AppliesTo />

A vault holds assets against a particular term under a particular bonding curve. Depositing assets gives the receiver shares in that vault. A position is the number of those shares an account holds. To locate one, identify the deployment, term, curve and account.

**Builds on:** [Atoms](/docs/concepts/atoms), [Triples, counter-triples and nested triples](/docs/concepts/triples).

**Implemented by:** [protocol](/docs/reference/packages/protocol), [sdk](/docs/reference/packages/sdk).

## How it works

An atom and a triple are both **terms**. Each term has a default-curve vault at creation. MultiVault keeps separate accounting for each pair of term ID and curve ID. An eligible first deposit can initialize another vault on a registered non-default curve. For a triple, the creation path also initializes the counter-side on the same curve. [Vault initialization and accounting](https://github.com/0xIntuition/intuition-contracts-v2/blob/82cfcdb832c100fd2e53ee3f474289ae14cc6020/src/libraries/MultiVaultLib.sol)

**Assets** are amounts of the network’s native token, measured in base units (wei). **Shares** are units of a particular vault. Depositing native assets mints shares to a receiver. Redeeming burns shares and pays native assets after applicable fees. An account can therefore keep the same share balance while the estimated asset value of that balance changes.

The contract's `getVault` returns total assets and total shares for one term and curve. Its `getShares` additionally takes the account. `previewDeposit` estimates shares and assets after fees for a proposed deposit. The minimum output on a reviewed deposit request is denominated in shares, while the minimum on a redemption is denominated in assets. [MultiVault reads and writes](https://github.com/0xIntuition/intuition-contracts-v2/blob/82cfcdb832c100fd2e53ee3f474289ae14cc6020/src/protocol/MultiVault.sol)

## Example

For the same recording on one deployment, suppose two initialized linear vaults have the following balances at one block. All amounts are integer base units.

| Curve | Total assets | Total shares | Mira’s shares | Gross asset value of Mira’s shares |
| --- | ---: | ---: | ---: | ---: |
| A | 120 | 100 | 10 | 12 |
| B | 200 | 100 | 10 | 20 |

On curve A, 10 shares represent `10 × 120 / 100 = 12` asset units before fees. Curve B has its own ratio and yields 20. Adding the two share counts loses the price information. To estimate the combined gross value, convert each position in its own vault first.

## Common mistakes

- **Reading the sender's balance when someone else received the shares.** Match the receiver, term and curve in the deposit event.
- **Displaying a share count as native currency.** A conversion gives a gross estimate. A payout also depends on fees, rounding, and state at execution.
- **Expecting every curve to have a funded vault.** Term existence and the balances on a selected curve answer different questions.

## Next

- [Bonding curves](/docs/concepts/bonding-curves) explains conversion and rounding. [Signals](/docs/concepts/signals) explains what the position says about a claim.
- [Fees, epochs and rewards](/docs/concepts/fees-and-rewards) follows the economic flows. [Protocol writes](/docs/concepts/protocol-writes) traces the steps from a quote to a receipt.
