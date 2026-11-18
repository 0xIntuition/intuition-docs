import assert from 'node:assert/strict';
import { test } from 'node:test';
import { MutationObserver, onlineManager } from '@tanstack/react-query';
import { createWalletQueryClient, submitWalletWrite } from './wallet-write.ts';

test('a reviewed write cannot wait for reconnect or retry after failure', async (t) => {
  const client = createWalletQueryClient();
  const initiallyOnline = onlineManager.isOnline();
  client.mount();
  t.after(() => {
    client.unmount();
    client.clear();
    onlineManager.setOnline(initiallyOnline);
  });

  let sender = 'reviewed account';
  const proposals: string[] = [];
  const observer = new MutationObserver(client, {
    mutationKey: ['writeContract'],
    mutationFn: async () => {
      proposals.push(sender);
      return sender;
    },
  });
  onlineManager.setOnline(false);
  assert.equal(
    submitWalletWrite(() => observer.mutate()),
    undefined,
  );
  assert.equal(client.getMutationCache().getAll().length, 0);
  sender = 'new account';
  onlineManager.setOnline(true);
  await client.resumePausedMutations();
  assert.equal(proposals.length, 0);

  assert.equal(await submitWalletWrite(() => observer.mutate()), sender);
  assert.deepEqual(proposals, [sender]);

  // The connection can drop between the submit check and the mutation's first attempt.
  const failing = new MutationObserver(client, {
    mutationKey: ['writeContract'],
    mutationFn: async () => {
      proposals.push(sender);
      throw new Error('Connection lost');
    },
  });
  const pending = submitWalletWrite(() => {
    onlineManager.setOnline(false);
    return failing.mutate();
  });
  assert.ok(pending);
  await assert.rejects(pending, /Connection lost/);
  sender = 'another account';
  onlineManager.setOnline(true);
  await client.resumePausedMutations();
  assert.deepEqual(proposals, ['new account', 'new account']);
  assert.deepEqual(client.getMutationDefaults(['otherMutation']), {});
});
