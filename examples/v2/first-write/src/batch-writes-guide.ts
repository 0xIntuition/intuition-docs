import { MultiVaultAbi } from '@0xintuition/deployments';
import {
  multiVaultGetAtomCost,
  multiVaultGetTripleCost,
  multiVaultIsTermCreated,
} from '@0xintuition/protocol';
import {
  multivaultCreateAndSeedTerm,
  type MultiVaultSeedDepositInput,
} from '@0xintuition/sdk/actions';
import {
  decodeFunctionData,
  isAddressEqual,
  parseEventLogs,
  type Hex,
} from 'viem';
import {
  checkAtomData,
  review,
  vaultLogs,
  waitForOriginal,
  type Session,
} from './create-atoms-guide.ts';
import { checkTriple, type Roles } from './create-triples-guide.ts';

type Stage =
  | { kind: 'atoms'; rows: Hex[] }
  | { kind: 'triples'; rows: Roles[] }
  | { kind: 'seeds'; rows: MultiVaultSeedDepositInput[] };

function unique(keys: string[]) {
  if (new Set(keys.map((key) => key.toLowerCase())).size !== keys.length) {
    throw new Error('Remove duplicate targets from this stage.');
  }
}

async function prepareStage(s: Session, stage: Stage) {
  const max = await s.publicClient.readContract({
    address: s.address,
    abi: MultiVaultAbi,
    functionName: 'MAX_BATCH_SIZE',
  });
  if (!stage.rows.length || BigInt(stage.rows.length) > max)
    throw new Error('Invalid batch size.');
  const receiver = s.signer;
  // #region stages
  if (stage.kind === 'atoms') {
    unique(stage.rows);
    const assetsIn = await multiVaultGetAtomCost(s);
    const atomsToCreate = await Promise.all(
      stage.rows.map(async (data) => ({
        data,
        assetsIn,
        termId: await checkAtomData(s, data),
      })),
    );
    return multivaultCreateAndSeedTerm(s, { receiver, atomsToCreate });
  }
  if (stage.kind === 'triples') {
    const assetsIn = await multiVaultGetTripleCost(s);
    const triplesToCreate = await Promise.all(
      stage.rows.map(async (roles) => ({
        ...roles,
        assetsIn,
        termId: (await checkTriple(s, roles)).tripleId,
      })),
    );
    unique(triplesToCreate.map((triple) => triple.termId));
    return multivaultCreateAndSeedTerm(s, { receiver, triplesToCreate });
  }
  unique(stage.rows.map((seed) => seed.termId + '/' + seed.curveId));
  const exists = await Promise.all(
    stage.rows.map(({ termId }) =>
      multiVaultIsTermCreated(s, { args: [termId] }),
    ),
  );
  if (!exists.every(Boolean))
    throw new Error('Wait for creation before quoting this deposit.');
  return multivaultCreateAndSeedTerm(s, { receiver, seedDeposits: stage.rows });
  // #endregion
}

export async function submitStage(s: Session, input: Stage) {
  const stage = structuredClone(input);
  const plan = await prepareStage(s, stage);
  const [step] = plan.steps;
  if (
    plan.steps.length !== 1 ||
    step.value !== plan.totalValue ||
    plan.seedDepositQuotes.some((quote) => quote.minSharesOut <= 0n)
  ) {
    throw new Error('Check the stage, payment and per-vault share floors.');
  }
  // #region send
  const tx = { to: s.address, data: step.calldata, value: plan.totalValue };
  const call = decodeFunctionData({ abi: MultiVaultAbi, data: tx.data });
  await s.publicClient.call({ ...tx, account: s.signer });
  await review(s, step.type.toUpperCase(), {
    receiver: plan.receiver,
    stage,
    call,
    plan,
    ...tx,
  });
  const hash = await s.walletClient.sendTransaction({
    ...tx,
    account: s.walletClient.account!,
    chain: s.walletClient.chain,
  });
  const receipt = await waitForOriginal(s, hash);
  // #endregion
  const logs = vaultLogs(s, receipt);
  if (stage.kind === 'seeds') {
    const events = parseEventLogs({
      abi: MultiVaultAbi,
      eventName: 'Deposited',
      logs,
    });
    for (const quote of plan.seedDepositQuotes) {
      if (
        !events.some(
          ({ args }) =>
            args.termId === quote.termId.toLowerCase() &&
            args.curveId === quote.curveId &&
            isAddressEqual(args.receiver, plan.receiver) &&
            args.assets === quote.assetsIn &&
            args.shares >= quote.minSharesOut,
        )
      ) {
        throw new Error('Reconcile the deposit legs in receipt ' + hash);
      }
    }
  } else {
    const name = stage.kind === 'atoms' ? 'AtomCreated' : 'TripleCreated';
    const events = parseEventLogs({
      abi: MultiVaultAbi,
      eventName: name,
      logs,
    });
    for (const { termId } of [
      ...plan.createAtomPreviews,
      ...plan.createTriplePreviews,
    ]) {
      if (
        !events.some(
          ({ args }) =>
            args.termId === termId && isAddressEqual(args.creator, s.signer),
        )
      ) {
        throw new Error('Reconcile the created terms in receipt ' + hash);
      }
    }
  }
  return { plan, receipt };
}
