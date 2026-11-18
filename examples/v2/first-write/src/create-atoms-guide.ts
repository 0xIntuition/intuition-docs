import { createInterface } from 'node:readline/promises';
import { MultiVaultAbi } from '@0xintuition/deployments';
import { calculateAtomId } from '@0xintuition/ids';
import {
  multiVaultCreateAtoms,
  multiVaultCreateAtomsEncode,
  multiVaultCreateAtomsWithUris,
  multiVaultCreateAtomsWithUrisEncode,
  multiVaultGetAtomCost,
  multiVaultGetAtomUriConfig,
  multiVaultGetGeneralConfig,
  multiVaultIsTermCreated,
  type WriteConfig,
} from '@0xintuition/protocol';
import {
  isAddressEqual,
  isHex,
  parseEventLogs,
  size,
  type Address,
  type Hex,
  type TransactionReceipt,
} from 'viem';

export type Session = Readonly<
  WriteConfig & { chainId: number; signer: Address }
>;

async function checkSession(s: Session) {
  const [rpcChain, walletChain] = await Promise.all([
    s.publicClient.getChainId(),
    s.walletClient.getChainId(),
  ]);
  if (
    rpcChain !== s.chainId ||
    walletChain !== s.chainId ||
    s.walletClient.chain?.id !== s.chainId ||
    !s.walletClient.account ||
    !isAddressEqual(s.walletClient.account.address, s.signer)
  ) {
    throw new Error('Check the RPC chain, wallet chain and signing account.');
  }
}

export async function review(s: Session, operation: string, fields: object) {
  if (!process.stdin.isTTY)
    throw new Error('Use an interactive terminal for review.');
  await checkSession(s);
  const display = {
    chainId: s.chainId,
    signer: s.signer,
    multiVault: s.address,
    ...fields,
  };
  console.log(
    JSON.stringify(
      display,
      (_, v) => (typeof v === 'bigint' ? v.toString() : v),
      2,
    ),
  );
  const terminal = createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  try {
    const answer = await terminal.question(
      'Type ' + operation + ' to sign this step: ',
    );
    if (answer !== operation) throw new Error('Stopped before signing.');
  } finally {
    terminal.close();
  }
  await checkSession(s);
}

export function verifyReceipt(hash: Hex, receipt: TransactionReceipt) {
  if (receipt.transactionHash !== hash) {
    throw new Error(
      'Transaction replaced. Inspect the original and replacement: ' +
        hash +
        ' / ' +
        receipt.transactionHash,
    );
  }
  if (receipt.status !== 'success')
    throw new Error('Transaction reverted: ' + hash);
  return receipt;
}

export async function waitForOriginal(s: Session, hash: Hex) {
  console.log('Submitted:', hash);
  return verifyReceipt(
    hash,
    await s.publicClient.waitForTransactionReceipt({ hash }),
  );
}

export function vaultLogs(s: Session, receipt: TransactionReceipt) {
  return receipt.logs.filter((log) => isAddressEqual(log.address, s.address));
}

export async function checkAtomData(s: Session, data: Hex) {
  const { atomDataMaxLength } = await multiVaultGetGeneralConfig(s);
  if (
    !isHex(data, { strict: true }) ||
    data.length % 2 !== 0 ||
    size(data) === 0 ||
    BigInt(size(data)) > BigInt(atomDataMaxLength)
  ) {
    throw new Error('Check the atom bytes against atomDataMaxLength.');
  }
  const termId = calculateAtomId(data);
  if (await multiVaultIsTermCreated(s, { args: [termId] })) {
    throw new Error('This atom already exists: ' + termId);
  }
  return termId;
}

export async function createAtom(
  s: Session,
  data: Hex,
  contextUris?: readonly Hex[],
) {
  const termId = await checkAtomData(s, data);
  const cost = await multiVaultGetAtomCost(s);
  const uris = contextUris && [...contextUris];
  let hash: Hex;
  // #region create
  if (uris) {
    const [maxUriCount, maxUriLength] = await multiVaultGetAtomUriConfig(s);
    const input = {
      args: [s.signer, [data], [cost], [uris]] as const,
      value: cost,
      uriLimits: { maxUriCount, maxUriLength },
    };
    const calldata = multiVaultCreateAtomsWithUrisEncode(input);
    await review(s, 'CREATE WITH URIS', {
      to: s.address,
      termId,
      ...input,
      calldata,
    });
    hash = await multiVaultCreateAtomsWithUris(s, input);
  } else {
    const args = [[data], [cost]] as const;
    const calldata = multiVaultCreateAtomsEncode([data], [cost]);
    await review(s, 'CREATE ATOM', {
      to: s.address,
      creator: s.signer,
      termId,
      args,
      value: cost,
      calldata,
    });
    hash = await multiVaultCreateAtoms(s, { args, value: cost });
  }
  // #endregion
  const receipt = await waitForOriginal(s, hash);
  const logs = vaultLogs(s, receipt);
  const created = parseEventLogs({
    abi: MultiVaultAbi,
    eventName: 'AtomCreated',
    logs,
  });
  if (
    !created.some(
      ({ args }) =>
        args.termId === termId &&
        args.atomData.toLowerCase() === data.toLowerCase() &&
        isAddressEqual(args.creator, s.signer),
    )
  ) {
    throw new Error(
      'Inspect the receipt for the expected AtomCreated event: ' + hash,
    );
  }
  if (uris?.length) {
    const contexts = parseEventLogs({
      abi: MultiVaultAbi,
      eventName: 'AtomContextRegistered',
      logs,
    });
    if (
      !contexts.some(
        ({ args }) =>
          args.termId === termId &&
          isAddressEqual(args.registrant, s.signer) &&
          args.uris.length === uris.length &&
          args.uris.every(
            (uri, index) => uri.toLowerCase() === uris[index].toLowerCase(),
          ),
      )
    ) {
      throw new Error('Inspect the context registration in receipt ' + hash);
    }
  }
  return { termId, receipt };
}
