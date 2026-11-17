---
title: "Batch writes"
sidebar_label: "Batch writes"
description: "Create many atoms and triples in dependency order, quote deposits after creation, and keep each confirmed transaction for recovery."
kind: how-to
reader: ["app"]
packages: ["@0xintuition/sdk", "@0xintuition/protocol"]
---

<AppliesTo />

Create several terms and seed their vaults in dependency order, checking the result of each transaction before pricing the next one.

## Before you start

Follow [Install and pin the packages](/docs/build/install), [Create atoms](/docs/build/create-atoms) and [Create triples](/docs/build/create-triples). Use a compatible MultiVault, a funded signer and the same interactive session for each stage. Set aside gas for **each** transaction. The example’s signer creates the terms and receives the seed shares. [Complete stage helper](https://github.com/0xIntuition/intuition-docs/blob/d928b7692bdee7f3c9e24f65bf0c38e8c26bc152/examples/v2/first-write/src/batch-writes-guide.ts)

## Steps

### 1. Split inputs at their dependencies

For example, to create Alice, “follows” and Bob, then create “Alice follows Bob” and fund its vault, prepare three stages. Batch the missing atoms first. Use their primary bytes to derive the IDs. After their original successful receipt, prepare the triple with those IDs. After the triple’s receipt, preview and seed its vault. Create any nested triples in dependency order, waiting for each prerequisite transaction.

The read-backed `multivaultCreateAndSeedTerm` action can return `create-atoms`, `create-triples` and `deposit-batch` steps in that order, with per-leg previews and a `totalValue`. Planning reads current state. A triple preview can run before its input terms exist and use fee assumptions that change once they do. Triple execution checks all three terms. A deposit preview for a term that has yet to be created reverts. Prepare each dependent stage against confirmed state. [SDK planner](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/sdk/src/actions/multivault.ts) · [MultiVault previews](https://github.com/0xIntuition/intuition-contracts-v2/blob/82cfcdb832c100fd2e53ee3f474289ae14cc6020/src/protocol/MultiVault.sol)

### 2. Build one bounded stage

The helper accepts a `kind` and its `rows`. For `atoms`, pass the primary byte strings. For `triples`, pass ordered subject, predicate and object IDs. For `seeds`, pass the target term, curve, gross native wei and slippage in basis points for each leg. Each nonempty stage must fit the deployment’s `MAX_BATCH_SIZE`. Align inputs by index and keep each term/curve pair unique in a seed batch. If one leg could materially change the next leg’s quote, submit them separately.

{/* example:start examples/v2/first-write/src/batch-writes-guide.ts#stages */}
```ts
  if (stage.kind === 'atoms') {
    unique(stage.rows);
    const assetsIn = await multiVaultGetAtomCost(s);
    const atomsToCreate = await Promise.all(
      stage.rows.map(async (data) => ({
        data,
        assetsIn,
        termId: await checkAtomData(s, data),
      })),
    );
    return multivaultCreateAndSeedTerm(s, { receiver, atomsToCreate });
  }
  if (stage.kind === 'triples') {
    const assetsIn = await multiVaultGetTripleCost(s);
    const triplesToCreate = await Promise.all(
      stage.rows.map(async (roles) => ({
        ...roles,
        assetsIn,
        termId: (await checkTriple(s, roles)).tripleId,
      })),
    );
    unique(triplesToCreate.map((triple) => triple.termId));
    return multivaultCreateAndSeedTerm(s, { receiver, triplesToCreate });
  }
  unique(stage.rows.map((seed) => seed.termId + '/' + seed.curveId));
  const exists = await Promise.all(
    stage.rows.map(({ termId }) =>
      multiVaultIsTermCreated(s, { args: [termId] }),
    ),
  );
  if (!exists.every(Boolean))
    throw new Error('Wait for creation before quoting this deposit.');
  const plan = await multivaultCreateAndSeedTerm(s, {
    receiver,
    seedDeposits: stage.rows,
  });
```
{/* example:end */}

At creation the helper pays the current per-item creation cost. For seeds, choose the actual gross assets to deposit, check the encoded `minShares` on every leg and reserve the sum as payment. Output estimates are per leg. The contract decides whether the batch can execute at those minima.

### 3. Review and send this stage

Call `submitStage(session, stage)` once for the stage you intend to send. Read the chain, MultiVault, signer, receiver, term bytes or ordered IDs, decoded arguments, calldata and exact native value in the terminal. The helper accepts exactly one planned step, simulates its complete calldata, prompts for that operation and records its submitted hash.

{/* example:start examples/v2/first-write/src/batch-writes-guide.ts#send */}
```ts
  const tx = { to: s.address, data: step.calldata, value: plan.totalValue };
  const call = decodeFunctionData({ abi: MultiVaultAbi, data: tx.data });
  await s.publicClient.call({ ...tx, account: s.signer });
  await review(s, step.type.toUpperCase(), {
    receiver: plan.receiver,
    stage,
    call,
    plan,
    ...tx,
  });
  const hash = await s.walletClient.sendTransaction({
    ...tx,
    account: s.walletClient.account!,
    chain: s.walletClient.chain,
  });
  const receipt = await waitForOriginal(s, hash);
```
{/* example:end */}

The complete helper matches creation events to the expected IDs and seed events to the receiver, term, curve, payment and minimum shares. Use its returned receipt and plan as your record before preparing the next stage.

## Check the result

An individual batch call reverts as a unit. Earlier transactions persist if a later transaction fails. For the example above, you should have a successful atom receipt, a successful triple receipt, and then a separate successful deposit receipt. Verify each against the original hash and selected MultiVault address. Read the final receiver’s share balance for the seeded term and curve. [Deposit and redeem](/docs/build/deposit-redeem)

## Troubleshooting

If confirmation times out or the wallet replaces a transaction, resolve its original hash and any replacement first. If the atom stage succeeded and triple creation reverted, keep the atom receipt. Check whether the triple now exists, derive only the outstanding work, read costs again and review a new transaction. For deposits, inspect the original receipt’s deposit events before retrying: a second successful submission would deposit a second time.

## Related

[Build action plans and envelopes](/docs/build/action-plans) · [Route writes through the FeeProxy](/docs/build/fee-proxy) · [Protocol write lifecycle](/docs/concepts/protocol-writes)
