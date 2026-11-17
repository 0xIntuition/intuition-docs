// #region imports
import { calculateAtomId } from '@0xintuition/ids';
import { PREDICATE_IDS } from '@0xintuition/predicates';
import { multivaultPrepareDepositTx } from '@0xintuition/sdk/actions';
import { getMultiVaultAddressFromChainId } from '@0xintuition/protocol';

export const migrationImports = {
  calculateAtomId,
  PREDICATE_IDS,
  multivaultPrepareDepositTx,
  getMultiVaultAddressFromChainId,
};
// #endregion

// #region atoms
import { buildIidAnchor } from '@0xintuition/primitives/anchor';
import { multiVaultCreateAtomsWithUris } from '@0xintuition/protocol';
import type { AtomUriLimits, WriteConfig } from '@0xintuition/protocol';
import { stringToHex, type Address } from 'viem';

// Calling this function simulates and submits a wallet transaction.
export async function createRecording(
  config: WriteConfig,
  creator: Address,
  isrc: string,
  assets: bigint,
  uriLimits: AtomUriLimits,
) {
  const result = buildIidAnchor('music-recording', { isrc });
  if (!result.success) throw new Error(result.errors.join('; '));
  const atom = result.value;
  const transactionHash = await multiVaultCreateAtomsWithUris(config, {
    args: [
      creator,
      [atom.dataHex],
      [assets],
      [atom.contextUris.map((uri) => stringToHex(uri))],
    ],
    value: assets,
    uriLimits,
  });
  return { atom, transactionHash };
}
// #endregion

// #region triples
import { calculateTripleId } from '@0xintuition/ids';
import {
  multiVaultCreateTriples,
  type WriteConfig as TripleWriteConfig,
} from '@0xintuition/protocol';
import type { Hex } from 'viem';

// The three atoms must already exist on the selected deployment.
export async function createRelationship(
  config: TripleWriteConfig,
  subject: Hex,
  predicate: Hex,
  object: Hex,
  assets: bigint,
) {
  const id = calculateTripleId(subject, predicate, object);
  const transactionHash = await multiVaultCreateTriples(config, {
    args: [[subject], [predicate], [object], [assets]],
    value: assets,
  });
  return { id, transactionHash };
}
// #endregion

// #region preserve
import { calculateAtomId as atomIdFromData } from '@0xintuition/ids';
import { stringToHex as encodeData } from 'viem';

export function preserveAtom(data: string) {
  return { data, dataHex: encodeData(data), id: atomIdFromData(data) };
}
// #endregion
