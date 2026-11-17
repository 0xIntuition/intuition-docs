// #region action-envelope
import {
  multiVaultMulticallEnvelope,
  validateAgentActionEnvelope,
} from '@0xintuition/sdk/actions';
import { multiVaultDepositEncode } from '@0xintuition/protocol';
import { calculateAtomId } from '@0xintuition/ids';

// Illustrative inputs only: no claim that this term exists on testnet.
const receiver = '0x0000000000000000000000000000000000000001';
const termId = calculateAtomId('docs:offline-envelope-fixture');
const calldata = multiVaultDepositEncode(receiver, termId, 1n, 1n);
const envelope = multiVaultMulticallEnvelope({
  chainId: 13579,
  subCalls: [{ calldata, value: 1_000_000_000_000_000n }],
});
validateAgentActionEnvelope(envelope);
console.log(JSON.stringify(envelope, null, 2));
// #endregion
