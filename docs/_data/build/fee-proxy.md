---
title: "Route writes through the FeeProxy"
sidebar_label: "Route writes through the FeeProxy"
description: "Inspect an affiliate, quote routed creation and deposits, and verify approval and payment steps individually."
kind: how-to
reader: ["app"]
packages: ["@0xintuition/periphery", "@0xintuition/sdk"]
---

<AppliesTo />

Route an atom creation or deposit through an affiliate’s FeeProxy and verify each approval and routed payment separately.

## Before you start

Follow [Install and pin the packages](/docs/build/install) and [Create atoms](/docs/build/create-atoms). Identify the **FeeProxy** and its **MultiVault** on the same chain. Resolve the canonical FeeProxy with `getFeeProxyAddressFromChainId` from `@0xintuition/periphery`, or supply the verified address of a compatible local deployment. The swap-and-bridge router has a separate address and interface. Use the same public client for both read configurations. The builders verify that the proxy’s `multiVault()` points at the supplied MultiVault. [Contract deployments](/docs/reference/contracts/deployments) · [FeeProxy reference](/docs/reference/contracts/fee-proxy)

## Steps

### 1. Inspect the affiliate’s current profile

Read `feeProxyGetAffiliateProfile(feeProxyConfig, { affiliate })` from `@0xintuition/sdk/actions`. Check registration, row pause status, fee recipient and the rates and fixed fees for the intended operation. Compare those settings with the protocol caps. The registration fee applies when registering a new affiliate. A registered, active affiliate still needs an unpaused proxy and fee settings within the caps for this route.

FeeProxy charges `floor(grossAssets × basisPoints / 10,000) + fixedFee` on the declared gross value of each routed call. All payment fields use **wei of native TRUST or tTRUST**. The result after the affiliate fee enters MultiVault, where its own fees and share pricing apply. A batch deposit charges the fixed fee once and allocates the forwarded amount across its legs, giving the rounding remainder to the last leg.

### 2. Build the requested route

For creation, give the builder exact atom bytes and the desired extra deposit **above** the live creation cost. It calculates the gross value needed after the affiliate fee. Its creation preview reports expected shares and pins the affiliate fee guard. It can also prepare URI-aware atoms and ordered triples. Atom and triple routes are separate calls, each with its own fee. For dependent terms, confirm the prerequisite terms, then prepare the next route.

For deposits, specify the user, affiliate, share receiver, existing term, curve, gross assets and slippage. The builder quotes the forwarded amount and each leg’s share floor, then encodes the deposit with a fee guard. Compare the plan’s gross value, affiliate fee, forwarded value, fixed fee and rate cap with your intent. [Complete route helper](https://github.com/0xIntuition/intuition-docs/blob/d928b7692bdee7f3c9e24f65bf0c38e8c26bc152/examples/v2/first-write/src/fee-proxy-guide.ts)

{/* example:start examples/v2/first-write/src/fee-proxy-guide.ts#build */}
```ts
  const configs = {
    multiVault: { address: s.address, publicClient: s.publicClient },
    feeProxy: { address: proxy, publicClient: s.publicClient },
  };
  const profile = await feeProxyGetAffiliateProfile(configs.feeProxy, {
    affiliate,
  });
  if (
    !profile.active ||
    !profile.withinCaps[route.kind === 'create' ? 'creation' : 'deposit']
  ) {
    throw new Error('Check affiliate registration, pause status and fee caps.');
  }
  if (route.kind === 'create') await checkAtomData(s, route.data);
  const plan =
    route.kind === 'create'
      ? await feeProxyBuildCreateViaPlan(configs, {
          user,
          affiliate,
          atoms: [{ data: route.data, deposit: route.depositWei }],
        })
      : await feeProxyBuildDepositViaPlan(configs, {
          user,
          affiliate,
          receiver: route.receiver,
          slippageBps: route.slippageBps,
          deposits: [
            {
              termId: route.termId,
              curveId: route.curveId,
              grossAssets: route.grossAssets,
            },
          ],
        });
```
{/* example:end */}

### 3. Verify who signs the next step

Inspect the actual number and order of `plan.steps`, including each step’s `kind`, `from`, `to`, calldata and value. An approval targets MultiVault and costs zero native value plus gas. A routed write targets FeeProxy and sends the quoted gross amount plus a separate gas cost.

For creation, the user must grant FeeProxy the creation permission. For deposits, the receiver grants FeeProxy the deposit permission. When the receiver differs from the user, the receiver also grants the user deposit permission. The builder keeps existing permission bits when encoding a missing approval. Use the signer named by each step. Review any approval’s spender and resulting permission mask before signing it.

### 4. Submit one reviewed step

Call `routeNext(session, proxy, intent, history)` from an interactive terminal with the appropriate signing account. Supply a history array you keep across calls. The helper simulates and displays the next step and the full plan before prompting. Its receipt client records the original hash as soon as the SDK starts waiting. Keep the hashes in your application’s transaction history so a restart preserves them.

{/* example:start examples/v2/first-write/src/fee-proxy-guide.ts#execute */}
```ts
  const publicClient: PublicClient = {
    ...s.publicClient,
    waitForTransactionReceipt: async (options) => {
      const record: SubmittedStep = {
        chainId: s.chainId,
        step,
        hash: options.hash,
      };
      history.push(record);
      console.log('Submitted:', record.hash);
      record.receipt = await s.publicClient.waitForTransactionReceipt(options);
      return verifyReceipt(record.hash, record.receipt);
    },
  };
  const executed = await feeProxyExecutePlan(
    { walletClient: s.walletClient, publicClient },
    { steps: [step] },
  );
```
{/* example:end */}

A returned `complete` value of `false` means the approval succeeded: inspect that receipt, rebuild the requested route and review its next step. Stop when `complete` is `true`. The SDK executor normally requires one wallet that matches every supplied step; this example supplies only the single step the current signer reviewed. [SDK builders and executor](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/sdk/src/actions/fee-proxy-builders.ts)

## Check the result

For each step, verify the receipt’s status and original hash. An approval receipt establishes a permission change. For the routed transaction, compare FeeProxy’s creation or deposit event with the intended user, affiliate, gross amount, affiliate fee and forwarded amount. Check the expected MultiVault creation or deposit logs and the resulting term or receiver position. [FeeProxy implementation](https://github.com/0xIntuition/intuition-contracts-v2/blob/82cfcdb832c100fd2e53ee3f474289ae14cc6020/src/periphery/FeeProxy.sol)

Send the plan’s exact value. FeeProxy attempts to return any excess to the caller, crediting `pendingRefund(user)` only if the transfer fails. `feeProxyClaimRefundIfAny(feeProxyConfig, { user, recipient })` returns either `null` or a claim transaction for the ledger owner to review and send separately. Select a payable recipient distinct from the proxy and zero address. [Refund helper](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/sdk/src/actions/fee-proxy-claim-refund-if-any.ts)

## Troubleshooting

If a fee rises above the encoded guard, the proxy pauses, the recipient rejects a fee transfer, or a deposit misses its share minimum, the routed transaction can revert. A previous approval remains effective. If a receipt is missing or the transaction was replaced, look up the saved hash and replacement in the signing wallet. Reconcile events and current permissions before building and reviewing only what remains. Replaying a successful deposit would fund the vault twice.

## Related

[Deposit and redeem](/docs/build/deposit-redeem) · [Batch writes](/docs/build/batch-writes) · [Affiliate profile fields](/docs/reference/sdk/fee-proxy-affiliate-profile)
