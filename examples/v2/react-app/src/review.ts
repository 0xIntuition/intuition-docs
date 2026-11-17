import { multiVaultCreateAtomsEncode } from '@0xintuition/protocol';
import { stringToHex, type Address } from 'viem';

// #region review
export function prepareReview(
  chainId: number,
  sender: Address,
  target: Address,
  text: string,
  atomCost: bigint,
) {
  if (!text.trim()) throw new Error('Enter text for the atom.');
  const data = [stringToHex(text)];
  const assets = [atomCost];
  return {
    chainId,
    sender,
    target,
    data,
    assets,
    value: atomCost,
    calldata: multiVaultCreateAtomsEncode(data, assets),
  };
}
// #endregion

export type Review = ReturnType<typeof prepareReview>;
