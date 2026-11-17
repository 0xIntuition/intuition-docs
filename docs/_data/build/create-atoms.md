---
title: "Create atoms"
sidebar_label: "Create atoms"
description: "Create an atom from exact bytes, attach optional URI context, and verify the creation against its transaction receipt."
kind: how-to
reader: ["app"]
packages: ["@0xintuition/protocol", "@0xintuition/sdk", "@0xintuition/deployments"]
---

<AppliesTo />

Create an atom on a selected MultiVault deployment and use its receipt to verify the bytes and any context URIs you registered.

## Before you start

Follow [Install and pin the packages](/docs/build/install) and the [first on-chain write](/docs/get-started/first-write) for an interactive testnet setup. Use a funded signing account, a public client and a wallet client configured for the same chain. Resolve MultiVault with `getMultiVaultAddressFromChainId` from `@0xintuition/deployments` or supply your compatible local deployment. Check the selected address and chain against your deployment record. [Contract deployments](/docs/reference/contracts/deployments)

The complete example exports `createAtom(session, data, contextUris?)`. Its session contains `address` (MultiVault), `publicClient`, `walletClient`, the expected `chainId` and the expected `signer`. Use it from an interactive Node terminal. The helper checks the client chains and wallet account and asks you to type the displayed operation before submitting it. [Example source](https://github.com/0xIntuition/intuition-docs/blob/d928b7692bdee7f3c9e24f65bf0c38e8c26bc152/examples/v2/first-write/src/create-atoms-guide.ts)

## Steps

### 1. Choose the identity bytes

Encode the primary payload as nonempty bytes. For text, use viem’s `stringToHex` so the input and its encoding are explicit. Compute `calculateAtomId(data)` and check `multiVaultIsTermCreated` on the chosen MultiVault. If that ID exists, reuse it. If the atom represents a content URI, making the URI itself the primary payload makes its exact bytes part of the ID. An optional context URI is a separate pointer and leaves the ID unchanged. [Atom identity](/docs/concepts/atoms)

### 2. Size the payment and context

Read `multiVaultGetAtomCost` in native wei. The example pays that exact cost for one atom on the default curve. Paying only the creation cost can leave the creator with zero shares. Keep gas separate. In a batch, each allocation must cover its own cost and the transaction value must equal their sum.

For ordinary creation, use the data and asset arrays. To register context, supply one URI array per atom, including an empty array for any atom without pointers. Encode each URI as bytes. The live `maxUriCount` limits pointers per atom and `maxUriLength` limits **bytes per URI**. Check the independent `atomDataMaxLength` for the primary payload. The example uses the signer as creator. A different creator must have approved the caller for creation.

### 3. Submit the reviewed call

Review the chain, MultiVault address, signer, creator, identity bytes, term ID, URI arrays, calldata and native payment. Pick one branch for a given atom. Each protocol wrapper simulates that call and submits through the wallet after your confirmation.

{/* example:start examples/v2/first-write/src/create-atoms-guide.ts#create */}
```ts
  if (uris) {
    const [maxUriCount, maxUriLength] = await multiVaultGetAtomUriConfig(s);
    const input = {
      args: [s.signer, [data], [cost], [uris]] as const,
      value: cost,
      uriLimits: { maxUriCount, maxUriLength },
    };
    const calldata = multiVaultCreateAtomsWithUrisEncode(input);
    await review(s, 'CREATE WITH URIS', {
      to: s.address,
      termId,
      ...input,
      calldata,
    });
    hash = await multiVaultCreateAtomsWithUris(s, input);
  } else {
    const args = [[data], [cost]] as const;
    const calldata = multiVaultCreateAtomsEncode([data], [cost]);
    await review(s, 'CREATE ATOM', {
      to: s.address,
      creator: s.signer,
      termId,
      args,
      value: cost,
      calldata,
    });
    hash = await multiVaultCreateAtoms(s, { args, value: cost });
  }
```
{/* example:end */}

## Check the result

Save the returned hash immediately and wait for a successful receipt whose transaction hash matches it. Filter its logs by the selected MultiVault address. Match `AtomCreated` on creator, term ID and exact data. A nonempty URI list also produces `AtomContextRegistered` with the same term ID, registrant and URI bytes. These pointers are emitted in logs. The receipt establishes their registration, while any content retrieval is a separate operation. [MultiVault creation implementation](https://github.com/0xIntuition/intuition-contracts-v2/blob/82cfcdb832c100fd2e53ee3f474289ae14cc6020/src/libraries/MultiVaultLib.sol)

## Troubleshooting

A duplicate atom, oversized payload, exceeded URI count or byte length, insufficient per-atom payment, missing creation approval or paused contract can prevent execution. Re-read the relevant state before changing the call. For a timeout or replacement, inspect the original hash, replacement and current term state before considering another submission.

## Related

[Create triples](/docs/build/create-triples) · [Deposit and redeem](/docs/build/deposit-redeem) · [URI creation wrapper](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/protocol/src/core/multivault/create-atoms-with-uris.ts)
