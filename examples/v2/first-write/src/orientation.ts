// #region prepare
import { buildThing } from '@0xintuition/primitives';
import { multivaultCreateAndSeedTerm } from '@0xintuition/sdk/actions';
import type { WriteConfig } from '@0xintuition/protocol';
import { stringToHex, type Address } from 'viem';

export async function prepareNamedAtom(
  config: WriteConfig,
  receiver: Address,
  name: string,
  assetsIn: bigint,
) {
  const result = buildThing({ name });
  if (!result.success) throw new Error(result.errors.join('; '));
  return multivaultCreateAndSeedTerm(config, {
    receiver,
    atomsToCreate: [
      {
        termId: result.value.id,
        data: stringToHex(result.value.data),
        assetsIn,
      },
    ],
    seedDeposits: [],
  });
}
// #endregion
