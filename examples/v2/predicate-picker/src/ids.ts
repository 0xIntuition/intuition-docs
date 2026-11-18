import assert from 'node:assert/strict';

// #region ordered-ids
import {
  calculateAtomId,
  calculateCounterTripleId,
  calculateTripleId,
} from '@0xintuition/ids';
import { toHex } from 'viem';

// Synthetic bytes, with no claim about a real recording or artist.
const data = 'example:recording';
const recordingId = calculateAtomId(data);
const artistId = calculateAtomId('example:artist');
const predicateId = calculateAtomId('example:relationship');
const tripleId = calculateTripleId(recordingId, predicateId, artistId);
const reverseId = calculateTripleId(artistId, predicateId, recordingId);
const counterId = calculateCounterTripleId(tripleId);
console.log({
  sameBytes: recordingId === calculateAtomId(toHex(data)),
  changedBytes: recordingId !== calculateAtomId(`${data} `),
  reverseDiffers: reverseId !== tripleId,
  counterDiffersFromReverse: counterId.toString() !== reverseId.toString(),
});
// #endregion

assert.equal(recordingId, calculateAtomId(toHex(data)));
assert.notEqual(recordingId, calculateAtomId(`${data} `));
assert.notEqual(reverseId, tripleId);
assert.notEqual(counterId, reverseId);
assert.notEqual(counterId, tripleId);
