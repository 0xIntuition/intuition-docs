---
title: 'Example: Thing IPFS Pinning'
sidebar_label: Thing IPFS Pinning
sidebar_position: 7
description: Create rich entities with JSON-LD and automatic IPFS pinning
keywords: [sdk, example, thing, ipfs, metadata, json-ld]
---

# Example: Thing IPFS Pinning

This example demonstrates creating a rich entity (Thing) with automatic IPFS pinning.

SDK reads default to the mainnet GraphQL API, so this testnet write-and-read flow sets `API_URL_DEV` alongside its pinning configuration. `createAtomFromThing` fetches the required atom base cost; `depositAmount` is an additional tTRUST signal.

## Complete Code

```typescript
import {
  configureSdk,
  intuitionTestnet,
  getMultiVaultAddressFromChainId,
  createAtomFromThing,
  pinThing,
  getAtomDetails,
  wait,
} from '@0xintuition/sdk';
import { API_URL_DEV } from '@0xintuition/graphql';
import { createPublicClient, createWalletClient, http, parseEther } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';

async function main() {
  // Setup
  const account = privateKeyToAccount(process.env.PRIVATE_KEY as `0x${string}`);
  configureSdk({
    apiUrl: API_URL_DEV,
    pinApiKey: process.env.INTUITION_PIN_API_KEY,
  });

  const publicClient = createPublicClient({
    chain: intuitionTestnet,
    transport: http(),
  });
  const walletClient = createWalletClient({
    chain: intuitionTestnet,
    transport: http(),
    account,
  });
  const address = getMultiVaultAddressFromChainId(intuitionTestnet.id);

  // Define rich entity
  const project = {
    url: 'https://github.com/myorg/awesome-project',
    name: 'Awesome DeFi Protocol',
    description:
      'A groundbreaking decentralized finance protocol built on Intuition',
    image: 'https://myproject.com/logo.png',
  };

  console.log('=== Project Metadata ===');
  console.log(JSON.stringify(project, null, 2));

  // 1. Pin to IPFS (without creating atom)
  console.log('\n=== Pinning to IPFS ===');
  const ipfsUri = await pinThing(project);

  console.log('✓ Pinned to IPFS:', ipfsUri);

  // 2. Create atom with Thing (auto-pins and creates atom)
  console.log('\n=== Creating Atom ===');
  const atom = await createAtomFromThing(
    { walletClient, publicClient, address },
    project,
    { depositAmount: parseEther('0.1') },
  );

  console.log('✓ Atom created!');
  console.log('  Atom ID:', atom.state.termId);
  console.log('  IPFS URI:', atom.uri);
  console.log('  Transaction:', atom.transactionHash);

  // 3. Wait for indexing
  console.log('\nWaiting for indexing...');
  await wait(atom.transactionHash);

  // 4. Query details
  const details = await getAtomDetails(atom.state.termId);
  if (!details) throw new Error('Created atom was not found on the testnet API');

  const vault = details.term?.vaults[0];

  console.log('\n=== Atom Details ===');
  console.log('Label:', details.label);
  console.log('Creator:', details.creator?.label ?? details.creator_id);
  console.log('Total Shares:', vault?.total_shares);

  console.log('\nSuccess!');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Error:', error);
    process.exit(1);
  });
```

## See Also

- [createAtomFromThing](../atoms-guide.md#creating-from-thing)
- [pinThing](../integrations/pinata-ipfs.md)
- [IPFS Integration](../integrations/pinata-ipfs.md)
