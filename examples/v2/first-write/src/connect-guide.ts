// #region choose-network
import {
  getMultiVaultAddressFromChainId,
  intuitionMainnet,
  intuitionTestnet,
} from '@0xintuition/deployments';
import { multiVaultGetAtomCost } from '@0xintuition/protocol';
import {
  createPublicClient,
  getAddress,
  http,
  isAddress,
  zeroAddress,
} from 'viem';
import { foundry } from 'viem/chains';

export function networkSettings(args: string[]) {
  const [name, deployedAddress] = args;
  if (args.length === 1 && (name === 'mainnet' || name === 'testnet')) {
    const chain = name === 'mainnet' ? intuitionMainnet : intuitionTestnet;
    return {
      chain,
      rpc: chain.rpcUrls.default.http[0],
      address: getMultiVaultAddressFromChainId(chain.id),
    };
  }

  if (args.length !== 2 || (name !== 'local' && name !== 'local-container'))
    throw new Error(
      'Choose mainnet, testnet, local ADDRESS or local-container ADDRESS.',
    );
  if (
    deployedAddress?.length !== 42 ||
    !isAddress(deployedAddress) ||
    deployedAddress === zeroAddress
  )
    throw new Error(
      'Supply the MultiVault proxy address from your local deployment.',
    );
  return {
    chain: foundry,
    rpc: name === 'local' ? 'http://localhost:8545' : 'http://anvil:8545',
    address: getMultiVaultAddressFromChainId(foundry.id, {
      MultiVault: { [foundry.id]: getAddress(deployedAddress) },
    }),
  };
}
// #endregion

// #region verify-connection
export async function connect(args: string[]) {
  const { chain, rpc, address } = networkSettings(args);
  const publicClient = createPublicClient({
    chain,
    transport: http(rpc, { timeout: 5000, retryCount: 0 }),
  });
  const actual = await publicClient.getChainId();
  if (actual !== chain.id)
    throw new Error(
      `Expected chain ${chain.id}, but the RPC returned ${actual}.`,
    );
  const atomCost = await multiVaultGetAtomCost({ publicClient, address });
  return {
    chainId: actual,
    multiVault: address,
    atomCostWei: atomCost.toString(),
  };
}
// #endregion

if (import.meta.main) {
  try {
    console.log(JSON.stringify(await connect(process.argv.slice(2)), null, 2));
  } catch (error) {
    console.error(
      error instanceof Error ? error.message : 'Connection failed.',
    );
    process.exitCode = 1;
  }
}
