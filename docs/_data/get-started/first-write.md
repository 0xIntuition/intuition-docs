---
title: "Quickstart: your first on-chain write"
sidebar_label: "Your first on-chain write"
description: "Create a unique atom on Intuition Testnet, deposit test TRUST into its vault, and read back your shares."
kind: tutorial
reader: ["app"]
packages: ["@0xintuition/deployments", "@0xintuition/protocol", "@0xintuition/primitives"]
---

<AppliesTo />

**Time:** 10 minutes · **Steps:** 8

## What you'll build

Create a named atom and attach a context URI on Intuition Testnet. After its creation receipt arrives, deposit test TRUST into the new vault and read the number of shares your account owns. You review and authorize the two transactions separately.

## Before you start

Use Node 22.18 or newer, npm, and a throwaway **testnet-only** account. You need an interactive terminal and access to the Intuition Testnet RPC. Have the account's public address handy for the faucet. Keep its private key on your machine.

## Steps

### 1. Fund the testnet account

Request tTRUST for your public address at the [Intuition Testnet faucet](https://testnet.hub.intuition.systems/). Leave enough balance for the atom creation cost, your chosen deposit, and gas for both transactions.

### 2. Install the pinned packages

```sh
mkdir intuition-first-write
cd intuition-first-write
npm init -y
npm pkg set type=module
npm install --save-exact @0xintuition/deployments@0.1.0 @0xintuition/protocol@4.0.0 @0xintuition/primitives@0.1.0 viem@2.31.4
```

Save the [complete first-write.ts script](https://github.com/0xIntuition/intuition-docs/blob/f181e57eca7eacb34212214d3befe8358470254a/examples/v2/first-write/src/first-write.ts) in this folder. The excerpts below show what it runs.

### 3. Set the throwaway key and deposit

Add `.env` to `.gitignore` before creating it. In a local editor, save the following as `.env` and replace the placeholder with your throwaway key. Set `DEPOSIT_AMOUNT` to the amount you want to deposit, in whole-token units.

```text
TESTNET_PRIVATE_KEY=<your 0x-prefixed testnet private key>
DEPOSIT_AMOUNT=0.001
```

### 4. Read the creation cost and URI limits

Start the script **once** and leave the terminal open for steps 5–7.

```sh
node --env-file=.env first-write.ts
```

The script checks the RPC's chain ID against Intuition Testnet (`13579`). It reads `getAtomCost` and `getAtomUriConfig` from the pinned MultiVault address, then checks your deposit against the current minimum. At the first prompt, find the creation payment, maximum URI count, and maximum byte length per URI. One tTRUST equals 10¹⁸ wei.

### 5. Review and create the atom

Each preparation generates a fresh UUID for the atom's name. The builder returns the serialized data and the ID derived from it. Encoding that exact string produces the bytes sent to MultiVault. The context URI identifies this run and travels alongside those bytes.

{/* example:start examples/v2/first-write/src/first-write.ts#create */}
```ts
  const uuid = crypto.randomUUID();
  const result = buildThing({ name: 'Intuition docs first write ' + uuid });
  if (!result.success) throw new Error(result.errors.join('; '));
  const { data, id } = result.value;
  const dataHex = stringToHex(data);
  const uri = 'urn:uuid:' + uuid;
  const inputs: CreateAtomsWithUrisInputs = {
    args: [signer, [dataHex], [atomCost], [[stringToHex(uri)]]],
    value: atomCost,
    uriLimits,
  };
  const creation = {
    uuid,
    data,
    dataHex,
    id,
    uri,
    inputs,
    calldata: multiVaultCreateAtomsWithUrisEncode(inputs),
  };
```
{/* example:end */}

Check the chain ID, MultiVault destination, signer and receiver against your intended account and deployment. Inspect the generated name, atom ID, URI, exact calldata, and creation payment. The payment equals the single atom's assets entry. Gas is additional and depends on network fees. Check the [testnet deployment addresses](/docs/reference/contracts/deployments).

Type `CREATE` only to authorize this creation. Any other answer stops before signing. The wrapper simulates, then submits the same prepared inputs. The script prints the transaction link and waits for its successful receipt before preparing a deposit.

{/* example:start examples/v2/first-write/src/first-write.ts#execute-creation */}
```ts
    const createAnswer = await review('CREATE', {
      atomId: atom.id,
      data: atom.data,
      dataHex: atom.dataHex,
      uri: atom.uri,
      maxUriCount,
      maxUriLength,
      calldata: atom.calldata,
      valueWei: cost,
      valueTokens: formatEther(cost),
    });
    const createHash = await afterReview('CREATE', createAnswer, () =>
      multiVaultCreateAtomsWithUris(config, atom.inputs),
    );
    await confirm(createHash);
```
{/* example:end */}

### 6. Review and deposit into its vault

Check that the second prompt shows the **same atom ID**, your address as receiver, the default curve ID, and your chosen deposit. The script calls `previewDeposit` on the newly created vault and rounds the minimum shares **up** to 99% of the quote. A price move below that floor causes the deposit to revert.

Type `DEPOSIT` only to authorize the displayed calldata and value. The wrapper simulates the call before sending it. Declining this second prompt leaves the confirmed atom on-chain.

{/* example:start examples/v2/first-write/src/first-write.ts#deposit */}
```ts
    const [quotedShares] = await multiVaultPreviewDeposit(config, {
      args: [atom.id, defaultCurveId, deposit],
    });
    if (quotedShares <= 0n) throw new Error('Deposit would mint no shares.');
    const minShares = (quotedShares * 99n + 99n) / 100n;
    const args = [signer, atom.id, defaultCurveId, minShares] as const;
    const depositAnswer = await review('DEPOSIT', {
      atomId: atom.id,
      curveId: defaultCurveId,
      quotedShares,
      minShares,
      calldata: multiVaultDepositEncode(...args),
      valueWei: deposit,
      valueTokens: formatEther(deposit),
    });
    const depositHash = await afterReview('DEPOSIT', depositAnswer, () =>
      multiVaultDeposit(config, { args, value: deposit }),
    );
    await confirm(depositHash);
```
{/* example:end */}

### 7. Read your position

After the deposit receipt succeeds, `getShares` reads your position using the receiver, the reviewed atom ID, and the same curve ID.

{/* example:start examples/v2/first-write/src/first-write.ts#position */}
```ts
    const shares = await multiVaultGetShares(config, {
      args: [signer, atom.id, defaultCurveId],
    });
```
{/* example:end */}

### 8. Inspect the receipts

Open each transaction link printed by the script in the [testnet explorer](https://testnet.explorer.intuition.systems). Check the sender, MultiVault destination, status, and native value. Keep the creation hash, deposit hash, and atom ID together. If receipt lookup times out, check the printed hash before attempting another transaction.

## Run it

Use the single interactive run started in step 4. Running the command again prepares a different atom. After the two approvals and successful receipts, look for these lines among the review details:

```text
Transaction: https://testnet.explorer.intuition.systems/tx/<creation transaction hash>
Transaction: https://testnet.explorer.intuition.systems/tx/<deposit transaction hash>
Atom ID: <your atom ID>
Position (shares): <your share balance>
```

## Next steps

- [Vaults and positions](/docs/concepts/vaults) explains what those shares represent.
- [Protocol wrappers](/docs/reference/packages/protocol) covers more reads and writes.
- [Prepare action plans](/docs/build/action-plans) shows how to hand unsigned operations to a separate executor.

The [package getting-started guide](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/docs/getting-started.md#move-from-offline-data-to-a-transaction), [URI-aware creation wrapper](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/protocol/src/core/multivault/create-atoms-with-uris.ts), and [MultiVault contract](https://github.com/0xIntuition/intuition-contracts-v2/blob/82cfcdb832c100fd2e53ee3f474289ae14cc6020/src/protocol/MultiVault.sol) define the calls used here.
