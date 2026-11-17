import { createInterface } from 'node:readline/promises';
import {
  getMultiVaultAddressFromChainId,
  intuitionTestnet,
} from '@0xintuition/deployments';
import { buildThing } from '@0xintuition/primitives';
import {
  multiVaultCreateAtomsWithUris,
  multiVaultCreateAtomsWithUrisEncode,
  multiVaultDeposit,
  multiVaultDepositEncode,
  multiVaultGetAtomCost,
  multiVaultGetAtomUriConfig,
  multiVaultGetBondingCurveConfig,
  multiVaultGetGeneralConfig,
  multiVaultGetShares,
  multiVaultIsTermCreated,
  multiVaultPreviewDeposit,
  type CreateAtomsWithUrisInputs,
} from '@0xintuition/protocol';
import {
  createPublicClient,
  createWalletClient,
  formatEther,
  http,
  isHex,
  parseEther,
  stringToHex,
  type Address,
  type Hex,
} from 'viem';
import { privateKeyToAccount } from 'viem/accounts';

const chain = intuitionTestnet;
const address = getMultiVaultAddressFromChainId(chain.id);

export function prepareCreation(
  signer: Address,
  atomCost: bigint,
  uriLimits: CreateAtomsWithUrisInputs['uriLimits'],
) {
  // #region create
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
  return {
    uuid,
    data,
    dataHex,
    id,
    uri,
    inputs,
    calldata: multiVaultCreateAtomsWithUrisEncode(inputs),
  };
  // #endregion
}

export async function afterReview<T>(
  operation: string,
  answer: string,
  execute: () => Promise<T>,
) {
  if (answer !== operation) throw new Error('Stopped before ' + operation);
  return execute();
}

async function main() {
  if (!process.stdin.isTTY) throw new Error('Run in an interactive terminal.');
  const key = process.env.TESTNET_PRIVATE_KEY;
  if (!key || !isHex(key) || key.length !== 66)
    throw new Error('Set a throwaway testnet key in .env.');
  const account = privateKeyToAccount(key);
  const signer = account.address;
  const publicClient = createPublicClient({ chain, transport: http() });
  if ((await publicClient.getChainId()) !== chain.id)
    throw new Error('Unexpected RPC chain.');
  const config = {
    address,
    publicClient,
    walletClient: createWalletClient({ account, chain, transport: http() }),
  };
  const terminal = createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  async function review(operation: string, fields: object) {
    console.log(
      JSON.stringify(
        {
          operation,
          chainId: chain.id,
          contract: address,
          signer,
          receiver: signer,
          ...fields,
        },
        (_, value) => (typeof value === 'bigint' ? value.toString() : value),
        2,
      ),
    );
    return terminal.question(
      'Type ' + operation + ' to sign and send this transaction: ',
    );
  }
  async function confirm(hash: Hex) {
    console.log(
      'Transaction:',
      chain.blockExplorers.default.url + '/tx/' + hash,
    );
    const receipt = await publicClient.waitForTransactionReceipt({ hash });
    if (receipt.transactionHash !== hash)
      throw new Error('Transaction replaced. Inspect the receipt before continuing.');
    if (receipt.status !== 'success')
      throw new Error('Transaction reverted: ' + hash);
  }
  try {
    const [
      cost,
      [maxUriCount, maxUriLength],
      { minDeposit },
      { defaultCurveId },
    ] = await Promise.all([
      multiVaultGetAtomCost(config),
      multiVaultGetAtomUriConfig(config),
      multiVaultGetGeneralConfig(config),
      multiVaultGetBondingCurveConfig(config),
    ]);
    const deposit = parseEther(process.env.DEPOSIT_TTRUST ?? '0.001');
    if (deposit <= 0n || deposit < minDeposit) {
      throw new Error(
        'Set DEPOSIT_TTRUST to a positive amount of at least ' +
          formatEther(minDeposit),
      );
    }
    const atom = prepareCreation(signer, cost, { maxUriCount, maxUriLength });
    if (await multiVaultIsTermCreated(config, { args: [atom.id] }))
      throw new Error('Atom already exists.');
    // #region execute-creation
    const createAnswer = await review('CREATE', {
      atomId: atom.id,
      data: atom.data,
      dataHex: atom.dataHex,
      uri: atom.uri,
      maxUriCount,
      maxUriLength,
      calldata: atom.calldata,
      valueWei: cost,
      valueTtrust: formatEther(cost),
    });
    const createHash = await afterReview('CREATE', createAnswer, () =>
      multiVaultCreateAtomsWithUris(config, atom.inputs),
    );
    await confirm(createHash);
    // #endregion
    // #region deposit
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
      valueTtrust: formatEther(deposit),
    });
    const depositHash = await afterReview('DEPOSIT', depositAnswer, () =>
      multiVaultDeposit(config, { args, value: deposit }),
    );
    await confirm(depositHash);
    // #endregion
    // #region position
    const shares = await multiVaultGetShares(config, {
      args: [signer, atom.id, defaultCurveId],
    });
    console.log('Atom ID:', atom.id);
    console.log('Position (shares):', shares.toString());
    // #endregion
  } finally {
    terminal.close();
  }
}

if (import.meta.main) await main();
