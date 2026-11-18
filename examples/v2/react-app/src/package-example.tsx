// #region provider-read
'use client';

import { intuitionTestnet } from '@0xintuition/deployments';
import { IntuitionProvider, useAtomCost } from '@0xintuition/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { createConfig, http, WagmiProvider } from 'wagmi';

const config = createConfig({
  chains: [intuitionTestnet],
  transports: { [intuitionTestnet.id]: http() },
});

function AtomCost() {
  const { data, isLoading, error } = useAtomCost();
  const message = isLoading
    ? 'Loading atom creation cost…'
    : error
      ? 'Unable to load the cost. Check your RPC connection and reload.'
      : data === undefined
        ? 'No atom creation cost is available. Check your network configuration.'
        : `Atom creation cost: ${data.toString()} wei`;
  return <p role="status">{message}</p>;
}

export function PackageExample() {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <IntuitionProvider network="testnet">
          <AtomCost />
        </IntuitionProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
// #endregion
