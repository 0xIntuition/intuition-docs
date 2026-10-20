---
id: fee-proxy-integration
title: Integrate FeeProxy
sidebar_label: Integrate FeeProxy
sidebar_position: 6
description: Register as a FeeProxy affiliate, check a user's readiness, and route deposits and atom or triple creation through FeeProxy with the Intuition SDK
---

# Integrate FeeProxy

This guide takes an app from zero to its first fee-earning deposit through [FeeProxy](/docs/intuition-smart-contracts/fee-proxy):

1. Register the app as an affiliate.
2. Check what the user still needs, and send the MultiVault approval.
3. Quote the fee and deposit through FeeProxy.

It also covers creating atoms and triples through FeeProxy, reading your affiliate stats, and refund recovery. Read the [FeeProxy contract page](/docs/intuition-smart-contracts/fee-proxy) first for the fee model and the rules each call enforces.

The SDK helpers below do the bookkeeping that is easy to get wrong by hand: they read the affiliate's current fees, pin the `FeeGuard` to them, keep existing MultiVault approvals when adding new ones, size creation amounts so every atom or triple still gets its full cost and deposit after the fee, and preview each call before you send it.

## Prerequisites

- `@0xintuition/sdk`, `@0xintuition/periphery` and `viem`, at the versions that include the FeeProxy helpers.
- A viem `publicClient` and `walletClient` for Intuition Testnet or Mainnet. See the [Overview](/docs/interaction-guide/overview) for network setup.
- A FeeProxy deployment on your network. It is live on Intuition Mainnet and Testnet; see the [contract page](/docs/intuition-smart-contracts/fee-proxy#deployments). The SDK resolves both addresses from the chain ID, so you never paste one by hand.

```typescript title="feeProxy.ts"
import { getFeeProxyAddressFromChainId } from '@0xintuition/periphery';
import {
  getMultiVaultAddressFromChainId,
  intuitionTestnet,
} from '@0xintuition/sdk';
import type { Address, Hex, PublicClient, WalletClient } from 'viem';

// Pick the network once: intuitionTestnet.id to try things out, intuitionMainnet.id for production.
export const CHAIN_ID = intuitionTestnet.id;
export const FEE_PROXY_ADDRESS: Address =
  getFeeProxyAddressFromChainId(CHAIN_ID);

// The FeeProxy and MultiVault read configs every helper takes.
export function feeProxyConfigs(publicClient: PublicClient) {
  return {
    feeProxy: { address: FEE_PROXY_ADDRESS, publicClient },
    multiVault: {
      address: getMultiVaultAddressFromChainId(CHAIN_ID),
      publicClient,
    },
  };
}
```

The readiness, quote and plan helpers check that the MultiVault you pass is the one FeeProxy routes to, and throw if it is not.

## Step 1: Register as an affiliate

Run this once, from the address that will be your affiliate identity. Users and your front end pass this address as `affiliate` on every routed call. Fees can go to a different address, such as a multisig.

```typescript title="feeProxy.ts"
import {
  feeProxyMaxFeeBps,
  feeProxyMaxFixedFee,
  feeProxyRegisterAffiliate,
  feeProxyRegistrationFee,
} from '@0xintuition/periphery';

export async function registerAffiliate(
  publicClient: PublicClient,
  walletClient: WalletClient,
  feeRecipient: Address,
) {
  const feeProxy = { address: FEE_PROXY_ADDRESS, publicClient };
  const [registrationFee, maxFeeBps, maxFixedFee] = await Promise.all([
    feeProxyRegistrationFee(feeProxy),
    feeProxyMaxFeeBps(feeProxy),
    feeProxyMaxFixedFee(feeProxy),
  ]);

  // 1% on deposits, 2% on creation, no flat fee. Each value must be within the caps.
  const fees = {
    depositBps: 100n,
    creationBps: 200n,
    depositFixedFee: 0n,
    creationFixedFee: 0n,
  };
  if (fees.depositBps > maxFeeBps || fees.creationBps > maxFeeBps) {
    throw new Error(`Fee above the protocol cap of ${maxFeeBps} bps`);
  }
  if (
    fees.depositFixedFee > maxFixedFee ||
    fees.creationFixedFee > maxFixedFee
  ) {
    throw new Error(`Flat fee above the protocol cap of ${maxFixedFee} wei`);
  }

  return feeProxyRegisterAffiliate(
    { address: FEE_PROXY_ADDRESS, walletClient, publicClient },
    { args: [fees, feeRecipient], value: registrationFee }, // the fee must match exactly
  );
}
```

Later, change your fees with `feeProxyUpdateAffiliateFees` or your payout address with `feeProxyUpdateFeeRecipient`, from the same affiliate address. Both are in `@0xintuition/periphery`.

:::tip
Make sure `feeRecipient` can receive TRUST. If the fee transfer fails, every routed call through your affiliate reverts.
:::

### Your affiliate dashboard

`feeProxyGetAffiliateProfile` reads everything about an affiliate in one batched call: registration and pause state, fees (also as percentages), headroom against the protocol caps, and lifetime stats.

```typescript title="feeProxy.ts"
import { feeProxyGetAffiliateProfile } from '@0xintuition/sdk';

export async function affiliateDashboard(
  publicClient: PublicClient,
  affiliate: Address,
) {
  const profile = await feeProxyGetAffiliateProfile(
    { address: FEE_PROXY_ADDRESS, publicClient },
    { affiliate },
  );
  // profile.active, profile.feePercent.deposit (for example 1 for 100 bps),
  // profile.headroom, profile.withinCaps, profile.stats
  return profile;
}
```

## Step 2: Check readiness and approve

A user can only route through FeeProxy once FeeProxy is approved on **MultiVault**: for `DEPOSIT` to deposit, and for `CREATION` to create atoms or triples. `feeProxyGetReadiness` checks this together with everything else the contract checks (the global pause, an active affiliate, fees within the caps). It returns what is missing and ready-to-send approval transactions.

```typescript title="feeProxy.ts"
import { feeProxyExecutePlan, feeProxyGetReadiness } from '@0xintuition/sdk';

export async function ensureReady(
  publicClient: PublicClient,
  walletClient: WalletClient,
  affiliate: Address,
) {
  const user = walletClient.account!.address;
  const readiness = await feeProxyGetReadiness(feeProxyConfigs(publicClient), {
    user,
    affiliate,
    kinds: ['deposit', 'create'],
  });
  if (readiness.ready) return readiness;

  // Problems only the protocol or the affiliate can fix, such as a paused affiliate.
  const blockers = readiness.missing.filter((issue) => !issue.fixable);
  if (blockers.length > 0) {
    throw new Error(blockers.map((issue) => issue.message).join('; '));
  }

  // The rest are approvals: send them from the user's wallet.
  await feeProxyExecutePlan(
    { walletClient, publicClient },
    { steps: readiness.approvalSteps },
  );

  // Re-read: the first result is a snapshot from before the approvals.
  return feeProxyGetReadiness(feeProxyConfigs(publicClient), {
    user,
    affiliate,
    kinds: ['deposit', 'create'],
  });
}
```

MultiVault's `approve` **replaces** an account's earlier approval instead of adding to it. The approval step keeps whatever the user already granted and adds what is missing, in one transaction. FeeProxy never needs `REDEMPTION`. Users can revoke at any time with `approve(feeProxy, 0)` on MultiVault.

## Step 3: Quote and deposit

`feeProxyBuildDepositViaPlan` runs the readiness check, quotes the deposit and returns the steps to send: any missing approval first, then the routed deposit. Show the user the quote before executing.

```typescript title="feeProxy.ts"
import { feeProxyBuildDepositViaPlan } from '@0xintuition/sdk';

export async function depositViaAffiliate(
  publicClient: PublicClient,
  walletClient: WalletClient,
  params: {
    affiliate: Address;
    termId: Hex;
    curveId: bigint;
    grossAssets: bigint;
    slippageBps: bigint; // for example 50n = 0.5%
  },
) {
  const { affiliate, termId, curveId, grossAssets, slippageBps } = params;
  const user = walletClient.account!.address;

  const plan = await feeProxyBuildDepositViaPlan(
    feeProxyConfigs(publicClient),
    {
      user,
      affiliate,
      deposits: [{ termId, curveId, grossAssets }],
      slippageBps,
    },
  );

  // Show the user: the fee, what reaches the vault, and the shares they get.
  const [leg] = plan.quote.legs;
  console.log({
    affiliateFee: plan.quote.affiliateFee,
    forwardedAssets: leg?.forwardedAssets,
    expectedShares: leg?.expectedShares,
    minShares: leg?.minShares,
  });

  return feeProxyExecutePlan({ walletClient, publicClient }, plan);
}
```

What the plan sends:

- **Value:** exactly the gross amount, so there is nothing to refund.
- **`minShares`:** from MultiVault's own preview of the post-fee amount, less your slippage.
- **`FeeGuard`:** pinned to the affiliate's current deposit fees. If the affiliate raises them before the transaction lands, the call reverts instead of charging more. A fee decrease still goes through.

**Several vaults in one transaction.** Pass more than one entry in `deposits` and the plan uses `depositBatchVia`. The fee is charged once on the total, and the post-fee total is split across the vaults in proportion to each gross amount.

**Depositing for someone else.** Pass `receiver`. The receiver gets the shares, and the receiver must have approved both FeeProxy and your caller for `DEPOSIT` on MultiVault. Those approval steps are signed by the receiver, so `feeProxyExecutePlan` refuses to send the plan from the caller's wallet until the receiver has sent them from theirs.

## Creating atoms and triples through FeeProxy

Creation uses the affiliate's creation-side fee, and the user needs the `CREATION` approval. MultiVault records the user as the creator.

The amount that reaches MultiVault must cover each atom's or triple's creation cost plus any deposit you want in its new vault. `feeProxyBuildCreateViaPlan` works backwards from that: you say what should land in each vault, and it works out what to send.

```typescript title="feeProxy.ts"
import { feeProxyBuildCreateViaPlan } from '@0xintuition/sdk';
import { parseEther, toHex } from 'viem';

export async function createAtomsViaAffiliate(
  publicClient: PublicClient,
  walletClient: WalletClient,
  affiliate: Address,
) {
  const user = walletClient.account!.address;

  const plan = await feeProxyBuildCreateViaPlan(feeProxyConfigs(publicClient), {
    user,
    affiliate,
    atoms: [{ data: toHex('alice') }, { data: toHex('bob') }],
    depositPerTerm: parseEther('0.1'), // on top of the creation cost, per atom
  });

  // plan.atoms: termIds, grossAssets, forwardedAssets, expectedShares, affiliateFee
  return feeProxyExecutePlan({ walletClient, publicClient }, plan);
}
```

- **Per-term deposits.** Set `deposit` on an individual atom or triple to override `depositPerTerm` for it. Omit both to create with no deposit.
- **Triples** take `triples: [{ subjectId, predicateId, objectId }]`. One plan can contain atoms and triples; it sends the atoms first, so a triple can use atoms created earlier in the same plan. For such a triple, the expected shares are previewed before those atoms exist, so treat them as an estimate.
- **URIs.** Give an atom `uris` and the plan uses `createAtomsWithUrisVia` for the whole set.
- **Sizing.** Every atom or triple receives at least its creation cost plus its deposit, and still does if the affiliate lowers its fee before the transaction lands. The rounding margin is a few wei. The plan checks its sizing against the contract's own `previewCreationFee` and previews each creation on MultiVault before returning.
- **Avoid a deposit of exactly 1 wei.** An atom or triple created with exactly 1 wei above its creation cost can revert: when more than one MultiVault fee applies, each rounds up to 1 wei and together they exceed the deposit. The plan steers its rounding margin around this and checks a deposit you chose against MultiVault's own preview.

## Refund recovery

The plans send the exact amount, so there is normally nothing to refund. If a call does send more than the gross total and the refund cannot be delivered (for example, a smart-contract wallet that cannot receive TRUST), FeeProxy credits it to the user instead of failing the call. `feeProxyClaimRefundIfAny` returns a claim transaction only when something is owed:

```typescript title="feeProxy.ts"
import { feeProxyClaimRefundIfAny } from '@0xintuition/sdk';

export async function recoverRefund(
  publicClient: PublicClient,
  walletClient: WalletClient,
  recipient?: Address, // set when the user's wallet cannot receive TRUST
) {
  const user = walletClient.account!.address;
  const claim = await feeProxyClaimRefundIfAny(
    { address: FEE_PROXY_ADDRESS, publicClient },
    { user, recipient },
  );
  if (!claim) return null; // nothing owed

  return walletClient.sendTransaction({
    account: walletClient.account!,
    chain: walletClient.chain,
    to: claim.tx.to,
    data: claim.tx.data,
    value: claim.tx.value,
  });
}
```

The claim carries the balance at the time it was read. Only the user can claim their own balance, so the only way it can shrink before the claim lands is the user's own earlier claim.

## Without the SDK

Every helper above is built from plain contract calls, so you can integrate with viem alone. Import `FeeProxyAbi` from `@0xintuition/periphery`. Then, for each routed call:

1. Read `affiliateConfig(affiliate)` and build the `FeeGuard` from the fees for the side you use: `{ maxFeeBps: fees.depositBps, maxFixedFee: fees.depositFixedFee }` for deposits, or the creation fields for creation.
2. Read `previewDepositFee` or `previewCreationFee` for the gross total. The fee is `gross * bps / 10_000` (rounded down) plus the flat fee, charged once per call on the summed gross.
3. For deposits, compute `minShares` from MultiVault's `previewDeposit` on the forwarded amount, not the gross.
4. Send exactly the gross total as `value`.

For creation, sizing the gross amounts by hand is error-prone with more than one atom or triple, because FeeProxy splits the forwarded total across them in proportion to their gross and gives the rounding remainder to the last one. Use `feeProxyGrossUpForTargets` from `@0xintuition/periphery`, which implements that split exactly.

## Common errors

| Error                                                                    | Cause                                                                               | Fix                                                                                   |
| ------------------------------------------------------------------------ | ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| `FeeProxy_ProxyNotApprovedForDeposit`                                    | The receiver has not approved FeeProxy for `DEPOSIT`.                               | Run Step 2 from the receiver's wallet.                                                |
| `FeeProxy_ProxyNotApprovedForCreation`                                   | The caller has not approved FeeProxy for `CREATION`.                                | Run Step 2 with `kinds: ['create']`.                                                  |
| `FeeProxy_ReceiverNotApproved`                                           | Depositing for someone else who has not approved the caller.                        | The receiver approves the caller for `DEPOSIT` on MultiVault, or deposit to yourself. |
| `FeeProxy_AffiliateNotRegistered` / `FeeProxy_AffiliatePaused`           | The affiliate cannot route right now.                                               | Readiness reports this as a blocker.                                                  |
| `FeeProxy_BpsExceedsCallerGuard` / `FeeProxy_FixedFeeExceedsCallerGuard` | The affiliate raised its fee after the quote.                                       | Build a new plan, show the new fee, and retry.                                        |
| `FeeProxy_BpsExceedsCap` / `FeeProxy_FixedFeeExceedsCap`                 | The affiliate's fee is above a protocol cap (for example, after a cap was lowered). | The affiliate lowers its fee with `feeProxyUpdateAffiliateFees`.                      |
| `FeeProxy_InsufficientValue`                                             | `msg.value` is below the gross total.                                               | Send the plan's `value`.                                                              |
| `FeeProxy_FeeExceedsGross`                                               | The fee would take the whole amount.                                                | Increase the gross amount.                                                            |
| `FeeProxy_RegistrationFeeMismatch`                                       | `msg.value` is not exactly `registrationFee()`.                                     | Read `registrationFee()` and send that amount.                                        |
| `EnforcedPause`                                                          | FeeProxy is globally paused.                                                        | Wait for the protocol to unpause. Users can still redeem on MultiVault.               |
| Arithmetic underflow (`0x11`) on creation                                | 1 wei above creation cost, and MultiVault's rounded-up fees exceeded it.            | Use a deposit of 0, or of at least a few wei.                                         |
| MultiVault errors (slippage, minimum deposit, atom exists)               | The routed MultiVault call reverted.                                                | The whole call reverted and no fee was charged. Fix the input and retry.              |

## Next steps

- [FeeProxy.sol](/docs/intuition-smart-contracts/fee-proxy) - full reference: fee model, pausing, roles and events
- [Deposit & Return](/docs/interaction-guide/deposit-return) - direct MultiVault deposits and redemptions
- [Create Atom](/docs/interaction-guide/create-atom) - direct atom creation
