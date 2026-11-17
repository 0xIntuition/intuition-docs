import { intuitionTestnet } from '@0xintuition/deployments';
import {
  IntuitionProvider,
  useAtom,
  useAtomCost,
  useCreateAtomFlow,
  useIntuitionConfig,
} from '@0xintuition/react';
import {
  QueryClient,
  QueryClientProvider,
  useQueryClient,
} from '@tanstack/react-query';
import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import {
  createPublicClient,
  type Address,
  type Hex,
  type TransactionReceipt,
} from 'viem';
import {
  createConfig,
  http,
  injected,
  useAccount,
  useConfig,
  useConnect,
  useDisconnect,
  WagmiProvider,
} from 'wagmi';
import { getAccount } from 'wagmi/actions';
import { verifyCreationReceipt } from './receipt.ts';
import { prepareReview, type Review } from './review.ts';

export function App() {
  const [url, setUrl] = useState('');
  const [endpoint, setEndpoint] = useState('');
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState('');

  async function openEndpoint(event: FormEvent) {
    event.preventDefault();
    setChecking(true);
    setError('');
    try {
      const rpc = new URL(url);
      if (!['http:', 'https:'].includes(rpc.protocol)) throw new Error();
      const client = createPublicClient({ transport: http(rpc.href) });
      if ((await client.getChainId()) !== intuitionTestnet.id) {
        setError(
          `Choose an RPC for Intuition testnet (chain ${intuitionTestnet.id}).`,
        );
        return;
      }
      setEndpoint(rpc.href);
    } catch {
      setError(
        'Could not read the chain ID. Check the RPC URL and its browser access settings.',
      );
    } finally {
      setChecking(false);
    }
  }

  return (
    <main>
      <h1>Read and create an atom</h1>
      {endpoint ? (
        <Providers endpoint={endpoint}>
          <Workspace />
        </Providers>
      ) : (
        <form onSubmit={openEndpoint}>
          <label htmlFor="endpoint">Intuition testnet RPC URL</label>
          <input
            id="endpoint"
            type="url"
            required
            value={url}
            disabled={checking}
            onChange={(event) => setUrl(event.target.value)}
          />
          <button disabled={checking} aria-busy={checking}>
            Use this RPC
          </button>
          {checking && <p role="status">Checking the chain ID…</p>}
          {error && <p role="alert">{error}</p>}
        </form>
      )}
    </main>
  );
}

// #region providers
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
// #endregion

function Wallet() {
  const account = useAccount();
  const connection = useConnect();
  const { disconnect } = useDisconnect();
  return (
    <section>
      <h2>Wallet</h2>
      {account.isConnected ? (
        <>
          <p>
            Connected account <code>{account.address}</code> on chain{' '}
            {account.chainId}.
          </p>
          {account.chainId !== intuitionTestnet.id && (
            <p role="status">
              Switch your wallet to Intuition testnet (chain{' '}
              {intuitionTestnet.id}) to create an atom.
            </p>
          )}
          <button onClick={() => disconnect()}>Disconnect wallet</button>
        </>
      ) : (
        <>
          <p>
            Connect a browser wallet to create an atom. Reads work without a
            wallet.
          </p>
          {connection.connectors.map((connector) => (
            <button
              key={connector.uid}
              disabled={connection.isPending}
              onClick={() => connection.connect({ connector })}
            >
              Connect {connector.name}
            </button>
          ))}
          {connection.isPending && (
            <p role="status">Open your wallet to approve the connection.</p>
          )}
          {connection.isError && (
            <p role="alert">
              Enable your wallet extension or unlock it, then connect again.
            </p>
          )}
        </>
      )}
    </section>
  );
}

function isTermId(value: string): value is Hex {
  return /^0x[0-9a-fA-F]{64}$/.test(value);
}

// #region read
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
// #endregion

function ReviewForm({
  sender,
  chainId,
  target,
  cost,
  text,
  setText,
  submit,
}: {
  sender: Address;
  chainId: number;
  target: Address;
  cost: bigint;
  text: string;
  setText: (text: string) => void;
  submit: (review: Review) => void;
}) {
  const [review, setReview] = useState<Review>();
  return (
    <>
      <label htmlFor="payload">Atom text</label>
      <input
        id="payload"
        value={text}
        onChange={(event) => {
          setText(event.target.value);
          setReview(undefined);
        }}
      />
      {review ? (
        <>
          <dl>
            <dt>Chain ID</dt>
            <dd>{review.chainId}</dd>
            <dt>Sender</dt>
            <dd>
              <code>{review.sender}</code>
            </dd>
            <dt>MultiVault target</dt>
            <dd>
              <code>{review.target}</code>
            </dd>
            <dt>Method</dt>
            <dd>createAtoms</dd>
            <dt>Data (one atom)</dt>
            <dd>
              <code>{review.data[0]}</code>
            </dd>
            <dt>Assets (one allocation)</dt>
            <dd>{String(review.assets[0])} wei</dd>
            <dt>Total value, before gas</dt>
            <dd>{String(review.value)} wei</dd>
            <dt>Calldata</dt>
            <dd>
              <code>{review.calldata}</code>
            </dd>
          </dl>
          <button onClick={() => submit(review)}>Submit to wallet</button>
        </>
      ) : (
        <button
          disabled={!text.trim()}
          onClick={() =>
            setReview(prepareReview(chainId, sender, target, text, cost))
          }
        >
          Review creation
        </button>
      )}
    </>
  );
}

function Workspace() {
  const [lookup, setLookup] = useState('');
  const [text, setText] = useState('');
  const cache = useQueryClient();
  const [completed, setCompleted] = useState<{
    review: Review;
    receipt: TransactionReceipt;
  }>();
  const [message, setMessage] = useState('');
  const [attempt, setAttempt] = useState(0);
  const { address, chainId: walletChainId, isConnected } = useAccount();
  const { chainId, multivaultAddress } = useIntuitionConfig();
  const config = useConfig();
  const flow = useCreateAtomFlow();
  const cost = useAtomCost();
  const busy = flow.status === 'submitting' || flow.status === 'confirming';

  // #region submit
  async function submit(review: Review) {
    setCompleted(undefined);
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
    try {
      const { receipt } = await flow.createAtom({
        data: review.data,
        assets: review.assets,
      });
      setCompleted({ review, receipt });
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : 'The wallet or transaction failed.',
      );
    }
  }

  const result =
    completed &&
    flow.status === 'confirmed' &&
    flow.receipt === completed.receipt
      ? verifyCreationReceipt(completed.review, flow.hash, completed.receipt)
      : undefined;
  const verifiedTermId = result?.termId;
  useEffect(() => {
    if (verifiedTermId) {
      setLookup(verifiedTermId);
      void cache.invalidateQueries({ type: 'active' });
    }
  }, [verifiedTermId, cache]);
  // #endregion

  return (
    <>
      <section>
        <h2>Read an atom</h2>
        <label htmlFor="term">Term ID</label>
        <input
          id="term"
          value={lookup}
          onChange={(event) => setLookup(event.target.value)}
        />
        {isTermId(lookup) ? (
          <AtomResult termId={lookup} />
        ) : (
          <p role="status">Enter a 32-byte term ID starting with 0x.</p>
        )}
      </section>
      <Wallet />
      <section>
        <h2>Create an atom</h2>
        {flow.hash && (
          <p>
            Submitted hash <code>{flow.hash}</code>
          </p>
        )}
        {completed && (
          <p>
            Mined hash <code>{completed.receipt.transactionHash}</code>
          </p>
        )}
        <p role="status">{result?.message}</p>
        {verifiedTermId && (
          <p>
            Verified term ID <code>{verifiedTermId}</code>
          </p>
        )}
        {busy ? (
          <p role="status">
            {flow.status === 'submitting'
              ? 'Check the sender, chain and payment in your wallet.'
              : 'Waiting for a testnet receipt…'}
          </p>
        ) : (
          <>
            {message && (
              <p role={flow.status === 'error' ? 'alert' : 'status'}>
                {message}
              </p>
            )}
            {flow.status === 'error' && (
              <p>
                {flow.hash
                  ? 'Inspect this transaction on testnet before retrying.'
                  : 'Check your wallet and funds, then review the creation again.'}
              </p>
            )}
            {cost.isError || flow.atomCost === undefined ? (
              <>
                <p role="status">
                  {cost.isLoading
                    ? 'Reading the creation cost…'
                    : 'Creation cost unavailable. Check your RPC.'}
                </p>
                <button
                  disabled={cost.isFetching}
                  onClick={() => void cost.refetch()}
                >
                  Retry cost read
                </button>
              </>
            ) : (
              <>
                <p>
                  Creation cost {String(flow.atomCost)} wei, plus wallet gas.
                </p>
                {isConnected && address && walletChainId === chainId ? (
                  <ReviewForm
                    key={[address, chainId, flow.atomCost, attempt].join('/')}
                    sender={address}
                    chainId={chainId}
                    target={multivaultAddress}
                    cost={flow.atomCost}
                    text={text}
                    setText={setText}
                    submit={submit}
                  />
                ) : (
                  <p>
                    Connect a wallet on Intuition testnet to review a creation.
                  </p>
                )}
              </>
            )}
          </>
        )}
      </section>
    </>
  );
}
