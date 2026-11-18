import { onlineManager, QueryClient } from '@tanstack/react-query';

export function createWalletQueryClient() {
  const client = new QueryClient();
  // A wallet request belongs to the current review. Never queue it for reconnect.
  client.setMutationDefaults(['writeContract'], {
    networkMode: 'always',
    retry: 0,
  });
  return client;
}

export function submitWalletWrite<T>(write: () => Promise<T>) {
  if (onlineManager.isOnline()) return write();
}
