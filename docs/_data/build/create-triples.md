---
title: "Create triples"
sidebar_label: "Create triples"
description: "Create an ordered relationship from existing term IDs and verify both its triple and counter-triple on MultiVault."
kind: how-to
reader: ["app"]
packages: ["@0xintuition/protocol", "@0xintuition/sdk", "@0xintuition/ids"]
---

<AppliesTo />

Create a relationship from three existing term IDs and verify the base triple and its counter on the default curve.

## Before you start

Follow [Install and pin the packages](/docs/build/install) and [Create atoms](/docs/build/create-atoms). Use the same chain, MultiVault and funded signer for your reads and write. Keep the three term IDs in subject, predicate, object order. The helper accepts a session plus an object with `subjectId`, `predicateId` and `objectId`. [Example source](https://github.com/0xIntuition/intuition-docs/blob/d928b7692bdee7f3c9e24f65bf0c38e8c26bc152/examples/v2/first-write/src/create-triples-guide.ts)

## Steps

### 1. Confirm each term and derive the pair

For a simple claim such as “Alice follows Bob,” resolve Alice, the predicate and Bob to existing atom IDs on this MultiVault. You can also place an already-created triple or counter-triple in **any** slot. A deterministically computed ID still needs to exist on the selected chain. The contract checks all three slots with the same term-existence rule. [MultiVault term validation](https://github.com/0xIntuition/intuition-contracts-v2/blob/82cfcdb832c100fd2e53ee3f474289ae14cc6020/src/libraries/MultiVaultLib.sol)

{/* example:start examples/v2/first-write/src/create-triples-guide.ts#terms */}
```ts
  const tripleId = calculateTripleId(subjectId, predicateId, objectId);
  const counterId = calculateCounterTripleId(tripleId);
  const [subject, predicate, object, exists] = await Promise.all(
    [subjectId, predicateId, objectId, tripleId].map((id) =>
      multiVaultIsTermCreated(s, { args: [id] }),
    ),
  );
  if (!subject || !predicate || !object)
    throw new Error('Create missing terms first.');
  if (exists) throw new Error('This ordered triple already exists.');
```
{/* example:end */}

`calculateTripleId` hashes the ordered IDs with the triple salt. Reversing the subject and object describes a different claim. `calculateCounterTripleId` derives the opposing side from the base ID and a distinct salt. [ID derivation](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/ids/src/triple-id.ts)

### 2. Review and fund the base creation

Read `multiVaultGetTripleCost` and reserve gas. The live cost covers the creation fee and bootstrap for both vaults. The example allocates exactly that cost, with no extra user stake. Each input array has one item per triple. For an array of relationships, align each subject, predicate, object and payment by index and send the sum of the allocations.

{/* example:start examples/v2/first-write/src/create-triples-guide.ts#create */}
```ts
  const { tripleId, counterId } = await checkTriple(s, {
    subjectId,
    predicateId,
    objectId,
  });
  const cost = await multiVaultGetTripleCost(s);
  const args = [[subjectId], [predicateId], [objectId], [cost]] as const;
  const calldata = multiVaultCreateTriplesEncode(
    [subjectId],
    [predicateId],
    [objectId],
    [cost],
  );
  await review(s, 'CREATE TRIPLE', {
    to: s.address,
    creator: s.signer,
    subjectId,
    predicateId,
    objectId,
    tripleId,
    counterId,
    args,
    calldata,
    value: cost,
  });
  const hash = await multiVaultCreateTriples(s, { args, value: cost });
  const receipt = await waitForOriginal(s, hash);
```
{/* example:end */}

### 3. Inspect both vaults

One base transaction records the same ordered tuple for both IDs, links the counter to the base, and initializes the default-curve vault on each side. The counter receives its minimum bootstrap shares at the burn address. The creator’s optional additional stake goes into the base vault. A separate counter creation is unnecessary.

## Check the result

Save the submitted hash. On its original successful receipt, filter by the MultiVault address and find `TripleCreated` with the signer as creator, the expected base ID and all three ordered term IDs. Expect one creation event for this relationship. Read `isTermCreated` for both IDs on the same contract. The helper returns both IDs and the verified receipt. [Triple and counter initialization](https://github.com/0xIntuition/intuition-contracts-v2/blob/82cfcdb832c100fd2e53ee3f474289ae14cc6020/src/libraries/MultiVaultLib.sol)

## Troubleshooting

If a slot is missing, finish that term’s creation and check its receipt first. If another writer created the same triple, verify its tuple and use the existing ID. On a cost or simulation failure, re-read the contract and review a new call. Resolve an unknown, replaced or reverted transaction from its hash before retrying.

## Related

[Triples](/docs/concepts/triples) · [Batch writes](/docs/build/batch-writes) · [SDK MultiVault actions](/docs/reference/sdk/multivault)
