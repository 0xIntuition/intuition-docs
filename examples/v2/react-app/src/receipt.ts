import { calculateAtomId } from '@0xintuition/ids';
import { MultiVaultAbi } from '@0xintuition/protocol';
import { parseEventLogs, type Hex, type TransactionReceipt } from 'viem';
import type { Review } from './review.ts';

type CreationReceipt = Pick<
  TransactionReceipt,
  'from' | 'to' | 'status' | 'transactionHash' | 'blockNumber' | 'logs'
>;

export function verifyCreationReceipt(
  review: Review,
  submittedHash: Hex | undefined,
  receipt: CreationReceipt,
) {
  if (!submittedHash)
    return {
      message:
        'Check the mined transaction. The submitted hash is unavailable.',
    };
  if (receipt.transactionHash.toLowerCase() !== submittedHash.toLowerCase())
    return {
      message:
        'A replacement transaction was mined. Inspect both hashes before retrying.',
    };
  if (
    receipt.status !== 'success' ||
    receipt.to?.toLowerCase() !== review.target.toLowerCase() ||
    receipt.from.toLowerCase() !== review.sender.toLowerCase()
  )
    return {
      message: 'Inspect the receipt status, sender and target before retrying.',
    };

  const events = parseEventLogs({
    abi: MultiVaultAbi,
    eventName: 'AtomCreated',
    logs: receipt.logs.filter(
      (log) =>
        !log.removed &&
        log.transactionHash?.toLowerCase() === submittedHash.toLowerCase() &&
        log.address.toLowerCase() === review.target.toLowerCase(),
    ),
  });
  const event = events[0];
  const data = review.data[0];
  if (
    events.length !== 1 ||
    event.eventName !== 'AtomCreated' ||
    event.args.creator.toLowerCase() !== review.sender.toLowerCase() ||
    event.args.atomData.toLowerCase() !== data.toLowerCase() ||
    event.args.termId.toLowerCase() !== calculateAtomId(data)
  )
    return {
      message:
        'The receipt does not show the reviewed atom. Inspect its event logs.',
    };
  return {
    message: `Verified the reviewed creation in block ${receipt.blockNumber}.`,
    termId: event.args.termId,
  };
}
