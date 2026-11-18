import { MultiVaultAbi } from '@0xintuition/deployments';
import { FeeProxyAbi } from '@0xintuition/periphery';
import {
  feeProxyBuildCreateViaPlan,
  feeProxyBuildDepositViaPlan,
  feeProxyExecutePlan,
  feeProxyGetAffiliateProfile,
  type FeeProxyPlanStep,
} from '@0xintuition/sdk/actions';
import {
  decodeFunctionData,
  isAddressEqual,
  type Address,
  type Hex,
  type PublicClient,
  type TransactionReceipt,
} from 'viem';
import {
  checkAtomData,
  review,
  verifyReceipt,
  type Session,
} from './create-atoms-guide.ts';

type Route = { user: Address; affiliate: Address } & (
  | { kind: 'create'; data: Hex; depositWei: bigint }
  | {
      kind: 'deposit';
      receiver: Address;
      termId: Hex;
      curveId: bigint;
      grossAssets: bigint;
      slippageBps: bigint;
    }
);
export type SubmittedStep = {
  chainId: number;
  step: FeeProxyPlanStep;
  hash: Hex;
  receipt?: TransactionReceipt;
};

export async function routeNext(
  s: Session,
  proxy: Address,
  intent: Route,
  history: SubmittedStep[],
) {
  const route = structuredClone(intent);
  const { affiliate, user } = route;
  // #region build
  const configs = {
    multiVault: { address: s.address, publicClient: s.publicClient },
    feeProxy: { address: proxy, publicClient: s.publicClient },
  };
  const profile = await feeProxyGetAffiliateProfile(configs.feeProxy, {
    affiliate,
  });
  if (
    !profile.active ||
    !profile.withinCaps[route.kind === 'create' ? 'creation' : 'deposit']
  ) {
    throw new Error('Check affiliate registration, pause status and fee caps.');
  }
  if (route.kind === 'create') await checkAtomData(s, route.data);
  const plan =
    route.kind === 'create'
      ? await feeProxyBuildCreateViaPlan(configs, {
          user,
          affiliate,
          atoms: [{ data: route.data, deposit: route.depositWei }],
        })
      : await feeProxyBuildDepositViaPlan(configs, {
          user,
          affiliate,
          receiver: route.receiver,
          slippageBps: route.slippageBps,
          deposits: [
            {
              termId: route.termId,
              curveId: route.curveId,
              grossAssets: route.grossAssets,
            },
          ],
        });
  // #endregion
  if ('quote' in plan && plan.quote.legs.some((leg) => leg.minShares <= 0n)) {
    throw new Error('The share floor rounds to zero.');
  }
  const [step] = plan.steps;
  const approval = step.kind === 'approve';
  if (!isAddressEqual(step.from, s.signer))
    throw new Error('This step needs signer ' + step.from);
  if (!isAddressEqual(step.to, approval ? s.address : proxy))
    throw new Error('Unexpected target.');
  const abi = approval ? MultiVaultAbi : FeeProxyAbi;
  const call = decodeFunctionData({ abi, data: step.data });
  await s.publicClient.call({
    account: step.from,
    to: step.to,
    data: step.data,
    value: step.value,
  });
  await review(s, step.kind.toUpperCase(), {
    route,
    proxy,
    profile,
    plan,
    stepCount: plan.steps.length,
    nextStep: step,
    call,
  });

  // #region execute
  const publicClient: PublicClient = {
    ...s.publicClient,
    waitForTransactionReceipt: async (options) => {
      const record: SubmittedStep = {
        chainId: s.chainId,
        step,
        hash: options.hash,
      };
      history.push(record);
      console.log('Submitted:', record.hash);
      record.receipt = await s.publicClient.waitForTransactionReceipt(options);
      return verifyReceipt(record.hash, record.receipt);
    },
  };
  const executed = await feeProxyExecutePlan(
    { walletClient: s.walletClient, publicClient },
    { steps: [step] },
  );
  // #endregion
  return { complete: !approval, executed };
}
