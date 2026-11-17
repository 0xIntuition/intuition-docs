---
title: "Deposit and redeem"
sidebar_label: "Deposit and redeem"
description: "Quote a deposit in native wei or a redemption in shares, review the minimum output, and verify the holder’s position."
kind: how-to
reader: ["app"]
packages: ["@0xintuition/sdk", "@0xintuition/protocol", "@0xintuition/curves"]
---

<AppliesTo />

Deposit native assets into a term’s vault or redeem its shares for a payout, using a fresh quote for your selected curve and account.

## Before you start

Follow [Install and pin the packages](/docs/build/install) and select an existing term on a compatible MultiVault. Identify the curve ID, signing account and share holder. The helper uses the signer as receiver, holder and payout address and uses the same interactive session as [Create atoms](/docs/build/create-atoms). Keep enough native currency for gas on either operation. [Vaults](/docs/concepts/vaults) · [Example source](https://github.com/0xIntuition/intuition-docs/blob/d928b7692bdee7f3c9e24f65bf0c38e8c26bc152/examples/v2/first-write/src/deposit-redeem-guide.ts)

## Steps

### 1. Choose the input and output units

| Operation | Input | Minimum output encoded in the call |
| --- | --- | --- |
| Deposit | `assetsIn`, native wei sent as transaction value | `minSharesOut`, vault share units |
| Redeem | `sharesIn`, units held by the receiver for this term and curve | `minAssetsOut`, native wei paid to the receiver |

Use `bigint` quantities. For example, viem’s `parseEther("0.01")` converts 0.01 TRUST or tTRUST to native wei. To redeem, select a share quantity from `multiVaultGetShares`; an amount of native currency does not identify a share quantity. Determine the slippage you accept in basis points. At 50 basis points, the minimum is the quoted output multiplied by 9,950 and divided by 10,000, rounded down. The examples reject a floor that rounds to zero.

### 2. Review the deposit for the chosen receiver

For a read-only estimate, import `multivaultQuoteDepositPlan` from `@0xintuition/sdk/actions` and supply the read config plus `termId`, `curveId`, `assetsIn` and `slippageBps`. The prepared transaction uses a fresh quote. Review its actual output estimate, fee breakdown, share floor, receiver, chain, target and calldata. Leave the value override unset so the payment equals the quoted gross assets. The receiver must approve a different caller for deposits.

{/* example:start examples/v2/first-write/src/deposit-redeem-guide.ts#deposit */}
```ts
  const tx = await multivaultPrepareDepositTx(s, {
    receiver,
    termId,
    curveId,
    assetsIn,
    slippageBps,
  });
  if (tx.quote.minSharesOut <= 0n)
    throw new Error('The share floor rounds to zero.');
  await review(s, 'DEPOSIT', { to: s.address, receiver, ...tx });
  const hash = await multiVaultDeposit(s, { args: tx.args, value: tx.value });
  const receipt = await waitForOriginal(s, hash);
```
{/* example:end */}

### 3. Price a redemption for the actual holder

For a read-only estimate, use `multivaultQuoteRedeemPlan` from the same entry point with `termId`, `curveId`, `account`, `sharesIn` and `slippageBps`. Set `account` to the **receiver whose shares will be burned and who receives the payout**. An approved operator can sign on behalf of that receiver. The raw contract `previewRedeem` does not price holder-specific curve fees for that account. The SDK’s account-aware quote includes them. The redeem call carries zero native value.

{/* example:start examples/v2/first-write/src/deposit-redeem-guide.ts#redeem */}
```ts
  const account = s.signer;
  const position = await multiVaultGetShares(s, {
    args: [account, termId, curveId],
  });
  if (sharesIn > position)
    throw new Error('Insufficient shares in this vault.');
  const tx = await multivaultPrepareRedeemTx(s, {
    receiver: account,
    account,
    termId,
    curveId,
    sharesIn,
    slippageBps,
  });
  if (tx.quote.minAssetsOut <= 0n)
    throw new Error('The payout floor rounds to zero.');
  await review(s, 'REDEEM', {
    to: s.address,
    receiver: account,
    ...tx,
    value: 0n,
  });
  const hash = await multiVaultRedeem(s, { args: tx.args });
  const receipt = await waitForOriginal(s, hash);
```
{/* example:end */}

## Check the result

Save the original hash and wait for a matching successful receipt. Inspect the selected MultiVault’s `Deposited` or `Redeemed` event for the sender, receiver or account, term, curve, input quantity and actual output. The actual output must meet the reviewed floor. Read `getShares(account, termId, curveId)` again for the current position. Use the event’s post-operation balance for the balance at the instant of that operation. [Events and errors](/docs/reference/contracts/events-and-errors)

## Troubleshooting

A paused contract, insufficient shares, missing approval, minimum deposit, prohibited opposing stake or market movement can stop the operation. Confirm the receipt state, refresh the live quote and inspect the new minimum before signing again. The standalone curve library can illustrate conversion and fees with assumed state. Use the selected deployment’s current state for execution amounts. [Bonding curves](/docs/concepts/bonding-curves) · [SDK quote implementation](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/sdk/src/actions/multivault.ts)

## Related

[Create atoms](/docs/build/create-atoms) · [Batch writes](/docs/build/batch-writes) · [SDK MultiVault reference](/docs/reference/sdk/multivault)
