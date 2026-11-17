import { MultiVaultAbi } from '@0xintuition/deployments';
import { calculateCounterTripleId, calculateTripleId } from '@0xintuition/ids';
import {
  multiVaultCreateTriples,
  multiVaultCreateTriplesEncode,
  multiVaultGetTripleCost,
  multiVaultIsTermCreated,
} from '@0xintuition/protocol';
import { isAddressEqual, parseEventLogs, type Hex } from 'viem';
import {
  review,
  vaultLogs,
  waitForOriginal,
  type Session,
} from './create-atoms-guide.ts';

export type Roles = Readonly<{
  subjectId: Hex;
  predicateId: Hex;
  objectId: Hex;
}>;

export async function checkTriple(
  s: Session,
  { subjectId, predicateId, objectId }: Roles,
) {
  // #region terms
  const tripleId = calculateTripleId(subjectId, predicateId, objectId);
  const counterId = calculateCounterTripleId(tripleId);
  const [subject, predicate, object, exists] = await Promise.all(
    [subjectId, predicateId, objectId, tripleId].map((id) =>
      multiVaultIsTermCreated(s, { args: [id] }),
    ),
  );
  if (!subject || !predicate || !object)
    throw new Error('Create missing terms first.');
  if (exists) throw new Error('This ordered triple already exists.');
  return { tripleId, counterId };
  // #endregion
}

export async function createTriple(
  s: Session,
  { subjectId, predicateId, objectId }: Roles,
) {
  // #region create
  const { tripleId, counterId } = await checkTriple(s, {
    subjectId,
    predicateId,
    objectId,
  });
  const cost = await multiVaultGetTripleCost(s);
  const args = [[subjectId], [predicateId], [objectId], [cost]] as const;
  const calldata = multiVaultCreateTriplesEncode(
    [subjectId],
    [predicateId],
    [objectId],
    [cost],
  );
  await review(s, 'CREATE TRIPLE', {
    to: s.address,
    creator: s.signer,
    subjectId,
    predicateId,
    objectId,
    tripleId,
    counterId,
    args,
    calldata,
    value: cost,
  });
  const hash = await multiVaultCreateTriples(s, { args, value: cost });
  const receipt = await waitForOriginal(s, hash);
  // #endregion
  const events = parseEventLogs({
    abi: MultiVaultAbi,
    eventName: 'TripleCreated',
    logs: vaultLogs(s, receipt),
  });
  const found = events.some(
    ({ args }) =>
      isAddressEqual(args.creator, s.signer) &&
      args.termId === tripleId &&
      args.subjectId === subjectId.toLowerCase() &&
      args.predicateId === predicateId.toLowerCase() &&
      args.objectId === objectId.toLowerCase(),
  );
  const present = await Promise.all(
    [tripleId, counterId].map((id) =>
      multiVaultIsTermCreated(s, { args: [id] }),
    ),
  );
  if (!found || !present.every(Boolean))
    throw new Error('Inspect the confirmed triple and its counter: ' + hash);
  return { tripleId, counterId, receipt };
}
