// #region deployment-selection
import {
  getMultiVaultAddressFromChainId,
  intuitionTestnet,
} from '@0xintuition/deployments';

export const target = {
  chainId: intuitionTestnet.id,
  address: getMultiVaultAddressFromChainId(intuitionTestnet.id),
};
console.log(target);
// #endregion

// #region protocol-encoding
import { multiVaultDepositEncode } from '@0xintuition/protocol';
import type { Address, Hex } from 'viem';

// Caller-supplied values must describe an existing term and chosen curve.
export function encodeDeposit(
  receiver: Address,
  termId: Hex,
  curveId: bigint,
  minShares: bigint,
) {
  return multiVaultDepositEncode(receiver, termId, curveId, minShares);
}
// #endregion

// #region sdk-envelope
import { multiVaultDepositEnvelope } from '@0xintuition/sdk/actions';
import { calculateAtomId } from '@0xintuition/ids';
import { getMultiVaultAddressFromChainId as getEnvelopeTarget } from '@0xintuition/deployments';

// Synthetic quote and recipient; this atom has not been registered on-chain.
export const envelope = await multiVaultDepositEnvelope({
  chainId: 13579,
  multiVaultAddress: getEnvelopeTarget(13579),
  receiver: '0x1111111111111111111111111111111111111111',
  termId: calculateAtomId('Synthetic package reference'),
  curveId: 1n,
  assetsIn: 1000n,
  slippageBps: 100n,
  readContext: {
    previewDeposit: { sharesOut: 500n, assetsAfterFees: 990n },
    entryFeeAmount: 5n,
    protocolFeeAmount: 5n,
    currentSharePrice: 2_000_000_000_000_000_000n,
  },
});
export const envelopeJson = JSON.stringify(envelope);
console.log(envelope.action, envelope.steps.length);
// #endregion

// #region refund-encoding
import {
  feeProxyClaimRefundToEncode,
  getFeeProxyAddressFromChainId,
} from '@0xintuition/periphery';
import type { Address as RefundRecipient } from 'viem';

export function encodeRefund(recipient: RefundRecipient) {
  return {
    to: getFeeProxyAddressFromChainId(13579),
    data: feeProxyClaimRefundToEncode(recipient),
    value: 0n,
  };
}
// #endregion

// #region curve-preview
import { createLinearCurve, type CurveState } from '@0xintuition/curves';

const curve = createLinearCurve();
const state: CurveState = { totalAssets: 3n, totalShares: 2n };
export const preview = {
  depositShares: curve.previewDeposit(2n, state),
  mintAssets: curve.previewMint(2n, state),
};
console.log(preview); // 1n share for a deposit; 3n assets to mint 2n shares.
// #endregion
