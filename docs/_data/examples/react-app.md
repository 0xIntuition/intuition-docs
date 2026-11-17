---
title: "React app with @0xintuition/react"
sidebar_label: "React app with @0xintuition/react"
description: "Mount a React 19 application, read atom bytes on Intuition testnet, and verify a reviewed wallet transaction against its receipt and the resulting atom."
kind: tutorial
reader: ["app"]
packages: ["@0xintuition/react", "@0xintuition/protocol", "@0xintuition/deployments"]
---

<AppliesTo />

**Time:** 20 minutes · **Steps:** 4

## What you'll build

Build a page that reads an atom from its testnet term ID. Connect a wallet to create an atom from text, inspect the exact bytes and payment, then read back the term ID returned by the confirmed transaction.

## Before you start

Use Node 22.21.0 with npm, Bun 1.3.11 for bundling and Python 3 for a local static server. To use the page, supply a browser-accessible Intuition testnet RPC URL. Have an existing atom term ID for a wallet-free lookup. To create an atom, use an injected browser wallet on chain 13579 funded for native payment and gas. The build and typecheck run offline after dependency installation. [Pinned installation](/docs/build/install) · [Atom identity](/docs/concepts/atoms)

## Steps

### 1. Install the isolated host

From the documentation checkout containing the full source below, install the example lockfile. This resolves React and React DOM 19.1.0, wagmi 2.15.4, React Query 5.90.2 and viem 2.31.4. Keep the terminal in `examples/v2` for the remaining commands.

```sh
cd examples/v2
npm ci --ignore-scripts
./node_modules/.bin/tsc -p react-app/tsconfig.json --noEmit
```

A successful typecheck exits without output. The HTML host loads the compiled JavaScript module, whose entry point mounts the application.

{/* example:start examples/v2/react-app/src/main.tsx#mount */}
```tsx
const host = document.getElementById('root');
if (!host) throw new Error('Add an element with id="root" to the host page.');
createRoot(host).render(<App />);
```
{/* example:end */}

### 2. Connect the RPC and read a term

The application checks the chain ID when you select **Use this RPC**. It then mounts `WagmiProvider`, `QueryClientProvider` and `IntuitionProvider` with the testnet deployment. Paste a 32-byte term ID into **Read an atom** to see its bytes, curve ID, total assets in wei and total shares. An incomplete contract response offers a retry. The wallet connection remains optional for this step. [Provider and read hook setup](/docs/build/react)

### 3. Review the wallet call

Connect the intended testnet account. Enter new text whose exact bytes you want to use as the atom’s identity. Spaces and case affect the payload. Select **Review creation** once the contract returns the atom cost. The review encodes one allocation equal to the cost, with no additional stake. Gas is separate.

{/* example:start examples/v2/react-app/src/review.ts#review */}
```ts
export function prepareReview(
  chainId: number,
  sender: Address,
  target: Address,
  text: string,
  atomCost: bigint,
) {
  if (!text.trim()) throw new Error('Enter text for the atom.');
  const data = [stringToHex(text)];
  const assets = [atomCost];
  return {
    chainId,
    sender,
    target,
    data,
    assets,
    value: atomCost,
    calldata: multiVaultCreateAtomsEncode(data, assets),
  };
}
```
{/* example:end */}

Compare the sender, chain ID, MultiVault address, data, assets, total value and calldata with the intended call. Editing the text clears the review. Disconnecting, switching accounts or chains, or observing a changed cost also requires another review. Submission checks the latest cached cost from the hook. The contract still enforces the cost at execution. [MultiVault deployments](/docs/reference/contracts/deployments)

### 4. Submit and read the receipt

Select **Submit to wallet** only if the review matches your intent. In the wallet, verify the account, network, target, payment and gas before approving. The application passes the reviewed arrays to `createAtom` and displays the hash while waiting for the receipt. Stay on Intuition testnet during this wait because the receipt hook follows wagmi’s current chain. A rejected request or reverted transaction surfaces an error. If you received a hash, inspect it before making another attempt.

{/* example:start examples/v2/react-app/src/app.tsx#submit */}
```tsx
  async function submit(review: Review) {
    const wallet = getAccount(config);
    if (
      !wallet.isConnected ||
      wallet.chainId !== review.chainId ||
      wallet.address !== review.sender ||
      review.target !== multivaultAddress ||
      review.value !== flow.atomCost ||
      cost.isError
    ) {
      setAttempt((value) => value + 1);
      setMessage(
        'The wallet or cost changed. Review the current details again.',
      );
      return;
    }
    setMessage('');
    setIds([]);
    try {
      const { receipt, termIds } = await flow.createAtom({
        data: review.data,
        assets: review.assets,
      });
      setIds(termIds);
      setMessage(`Confirmed in block ${receipt.blockNumber}.`);
      if (termIds[0]) {
        setLookup(termIds[0]);
        void cache.invalidateQueries({ type: 'active' });
      }
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : 'The wallet or transaction failed.',
      );
    }
  }
```
{/* example:end */}

On success, the page shows the receipt block and returned term IDs. The first ID fills the lookup field so you can compare the contract’s atom bytes with the review. If the receipt contains no matching event, the page reports that separately.

## Run it

From `examples/v2`, build the browser bundle, copy its HTML host and serve the generated directory on loopback.

```sh
bun build react-app/src/main.tsx --target browser --production --outdir react-app/dist
cp react-app/index.html react-app/dist/index.html
python3 -m http.server 4173 --bind 127.0.0.1 --directory react-app/dist
```

Open `http://127.0.0.1:4173`. You should see **Read and create an atom** and a field for your RPC URL. The first RPC request follows **Use this RPC**. To exercise creation, follow the wallet review and approval steps above. Stop the server with Ctrl+C when finished.

## Full source

[React app, HTML host and strict TypeScript project](https://github.com/0xIntuition/intuition-docs/tree/3ecbc129ab353220b8bf71f4a80c97677dddd944/examples/v2/react-app)

## Next steps

[Use React hooks in your own host](/docs/build/react) · [Create atoms with URI context](/docs/build/create-atoms) · [Interpret vault totals](/docs/concepts/vaults)
