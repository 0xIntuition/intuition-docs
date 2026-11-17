---
title: "Use React hooks"
sidebar_label: "Use React hooks"
description: "Connect a React application to Intuition testnet, read an atom by term ID, and submit a reviewed creation through the connected wallet."
kind: how-to
reader: ["app"]
packages: ["@0xintuition/react", "@0xintuition/protocol", "@0xintuition/deployments"]
---

<AppliesTo />

Use the same MultiVault deployment for a wallet-free atom lookup and a wallet-approved creation in your React application.

## Before you start

Install the pinned packages and peers in a React host. The [worked React app](/docs/examples/react-app) includes the dependencies, connector, mount and browser bundle instructions. Have a testnet RPC URL and an existing 32-byte atom term ID for the read. Creation also requires an injected wallet on Intuition testnet and native funds for the creation cost and gas. [Install the packages](/docs/build/install) · [Atoms](/docs/concepts/atoms) · [Protocol writes](/docs/concepts/protocol-writes)

## Steps

### 1. Match the providers to your deployment

Give wagmi the chain and the reader's RPC endpoint. Keep one query client for the lifetime of the provider. The testnet preset resolves the MultiVault address from the deployments package. For a custom deployment, supply a verified chain, chain ID and MultiVault address through the provider’s `config` prop and configure the same chain in wagmi. [Provider implementation](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/react/src/provider.tsx)

{/* example:start examples/v2/react-app/src/app.tsx#providers */}
```tsx
function Providers({
  endpoint,
  children,
}: {
  endpoint: string;
  children: ReactNode;
}) {
  const [config] = useState(() =>
    createConfig({
      chains: [intuitionTestnet],
      connectors: [injected()],
      transports: { [intuitionTestnet.id]: http(endpoint) },
    }),
  );
  const [client] = useState(() => new QueryClient());
  return (
    <WagmiProvider config={config} reconnectOnMount={false}>
      <QueryClientProvider client={client}>
        <IntuitionProvider network="testnet">{children}</IntuitionProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
```
{/* example:end */}

### 2. Read the atom by term ID

Mount the reader after validating the term ID. `useAtom(termId, { enabled, curveId, chainId })` reads the contract through wagmi. The provider supplies the chain and the contract supplies the default curve when you omit those overrides. The result includes the atom bytes and vault totals when all component reads succeed. Treat a missing result as an incomplete read. Only an explicit false `isAtom` establishes the negative result returned by this hook. [Read hook implementation](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/react/src/hooks/use-atom.ts)

{/* example:start examples/v2/react-app/src/app.tsx#read */}
```tsx
function AtomResult({ termId }: { termId: Hex }) {
  const query = useAtom(termId, { enabled: true });
  const cache = useQueryClient();
  if (query.isLoading) return <p role="status">Reading the atom…</p>;
  if (query.isError || !query.data)
    return (
      <>
        <p role="status">
          Could not read all atom fields. Check the term ID and RPC.
        </p>
        <button onClick={() => void cache.refetchQueries({ type: 'active' })}>
          Retry reads
        </button>
      </>
    );
  if (!query.data.isAtom)
    return <p role="status">No atom exists for this term ID.</p>;
  return (
    <dl>
      <dt>Atom bytes</dt>
      <dd>
        <code>{query.data.atomData}</code>
      </dd>
      <dt>Curve ID</dt>
      <dd>{String(query.data.curveId)}</dd>
      <dt>Total assets (wei)</dt>
      <dd>{String(query.data.totalAssets)}</dd>
      <dt>Total shares</dt>
      <dd>{String(query.data.totalShares)}</dd>
    </dl>
  );
}
```
{/* example:end */}

### 3. Review and submit one creation

Call `useCreateAtomFlow()` inside the component. Enable review only after the wallet connects on the selected chain and the hook returns an atom cost. Prepare the UTF-8 data, one asset allocation in native wei and the encoded call. Display the sender, target, chain, arguments and value before enabling submission. An account, chain, payload or cost change requires a new review.

Only the submit button calls `createAtom({ data, assets })`. It invokes ordinary MultiVault `createAtoms` with value equal to the sum of allocations. The example assigns the exact creation cost to its single atom. Additional deposits change the amount the user must review. URI context registration uses a separate protocol operation. [Creation flow](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/react/src/hooks/use-create-atom-flow.ts) · [Create atoms](/docs/build/create-atoms)

## Check the result

While the wallet is open, show that approval is pending. After broadcast, display the submitted hash from the hook. Keep the wallet on the selected chain while the flow polls. Compare that attempt’s submitted hash with `receipt.transactionHash` once `createAtom` resolves. A wallet replacement can produce a successful receipt with a different hash. Show both hashes and ask the reader to inspect the replacement before retrying.

For the original hash, check receipt success, sender and MultiVault target. This one-atom example also requires one `AtomCreated` event from that transaction and MultiVault. Check its creator, exact atom bytes and term ID derived from those bytes. Only then select the term for a contract read on the same chain. [Creation flow tests](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/react/src/__tests__/use-create-atom-flow.test.tsx)

## Troubleshooting

If the cost is unavailable, retry the contract read and keep submission disabled. If the user declines the wallet request, let them start a fresh review. A reverted receipt rejects the flow. If you already have a hash and receipt polling fails, inspect that hash on the selected chain before retrying. [Transaction flow implementation](https://github.com/0xIntuition/packages/blob/4e9af1373b81a453d16bc650983138e35afb97d1/packages/react/src/hooks/use-transaction-flow.ts)

## Related

[Build the React app](/docs/examples/react-app) · [React package reference](/docs/reference/packages/react) · [Query indexed data on your Core node](/docs/build/query-core)
