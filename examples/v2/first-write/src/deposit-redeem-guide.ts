import { MultiVaultAbi } from '@0xintuition/deployments';
import {
  multiVaultDeposit,
  multiVaultGetGeneralConfig,
  multiVaultGetShares,
  multiVaultRedeem,
} from '@0xintuition/protocol';
import {
  multivaultPrepareDepositTx,
  multivaultPrepareRedeemTx,
} from '@0xintuition/sdk/actions';
import { isAddressEqual, parseEventLogs, type Hex } from 'viem';
import {
  review,
  vaultLogs,
  waitForOriginal,
  type Session,
} from './create-atoms-guide.ts';

// The signer owns the position in this walkthrough.
export async function deposit(
  s: Session,
  termId: Hex,
  curveId: bigint,
  assetsIn: bigint,
  slippageBps: bigint,
) {
  const receiver = s.signer;
  const { minDeposit } = await multiVaultGetGeneralConfig(s);
  if (assetsIn < minDeposit)
    throw new Error('Deposit is below the configured minimum.');
  // #region deposit
  const tx = await multivaultPrepareDepositTx(s, {
    receiver,
    termId,
    curveId,
    assetsIn,
    slippageBps,
  });
  if (tx.quote.minSharesOut <= 0n)
    throw new Error('The share floor rounds to zero.');
  await review(s, 'DEPOSIT', { to: s.address, receiver, ...tx });
  const hash = await multiVaultDeposit(s, { args: tx.args, value: tx.value });
  const receipt = await waitForOriginal(s, hash);
  // #endregion
  const events = parseEventLogs({
    abi: MultiVaultAbi,
    eventName: 'Deposited',
    logs: vaultLogs(s, receipt),
  });
  const result = events.find(
    ({ args }) =>
      isAddressEqual(args.receiver, receiver) &&
      isAddressEqual(args.sender, s.signer) &&
      args.termId === termId.toLowerCase() &&
      args.curveId === curveId &&
      args.assets === assetsIn &&
      args.shares >= tx.quote.minSharesOut,
  );
  if (!result) throw new Error('Inspect the confirmed deposit: ' + hash);
  const position = await multiVaultGetShares(s, {
    args: [receiver, termId, curveId],
  });
  return { receipt, sharesMinted: result.args.shares, position };
}

export async function redeem(
  s: Session,
  termId: Hex,
  curveId: bigint,
  sharesIn: bigint,
  slippageBps: bigint,
) {
  // #region redeem
  const account = s.signer;
  const position = await multiVaultGetShares(s, {
    args: [account, termId, curveId],
  });
  if (sharesIn > position)
    throw new Error('Insufficient shares in this vault.');
  const tx = await multivaultPrepareRedeemTx(s, {
    receiver: account,
    account,
    termId,
    curveId,
    sharesIn,
    slippageBps,
  });
  if (tx.quote.minAssetsOut <= 0n)
    throw new Error('The payout floor rounds to zero.');
  await review(s, 'REDEEM', {
    to: s.address,
    receiver: account,
    ...tx,
    value: 0n,
  });
  const hash = await multiVaultRedeem(s, { args: tx.args });
  const receipt = await waitForOriginal(s, hash);
  // #endregion
  const events = parseEventLogs({
    abi: MultiVaultAbi,
    eventName: 'Redeemed',
    logs: vaultLogs(s, receipt),
  });
  const result = events.find(
    ({ args }) =>
      isAddressEqual(args.account, account) &&
      isAddressEqual(args.sender, s.signer) &&
      args.termId === termId.toLowerCase() &&
      args.curveId === curveId &&
      args.shares === sharesIn &&
      args.assetsAfterFees >= tx.quote.minAssetsOut,
  );
  if (!result) throw new Error('Inspect the confirmed redemption: ' + hash);
  return {
    receipt,
    receivedWei: result.args.assetsAfterFees,
    position: await multiVaultGetShares(s, {
      args: [account, termId, curveId],
    }),
  };
}
