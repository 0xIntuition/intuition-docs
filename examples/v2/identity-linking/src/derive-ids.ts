import assert from 'node:assert/strict';

// #region derive-recording
import {
  calculateAtomId,
  calculateCounterTripleId,
  calculateTripleId,
} from '@0xintuition/ids';
import { inspectIntuitionId } from '@0xintuition/iid';
import { projectIdentifierLadder } from '@0xintuition/iid-ladder';
import { buildIidAnchor } from '@0xintuition/primitives/anchor';
import { byArtistId } from '@0xintuition/predicates/byArtist';

export function deriveRecording(
  strongIdentifiers: Record<string, string>,
  canonicalUrl?: string,
) {
  const selection = projectIdentifierLadder({
    strongIdentifiers,
    canonicalUrl,
  });
  if (selection.iid === null) return { reason: selection.reason };
  const inspection = inspectIntuitionId(selection.iid);
  if (!inspection.valid) return { reason: inspection.reason };

  const anchor = buildIidAnchor(
    'music-recording',
    { name: 'Local catalog' },
    {
      candidateIid: selection.iid,
      contextUris: ['https://example.org/context'],
    },
  );
  if (!anchor.success) throw new Error(anchor.errors.join(', '));
  const { iid, dataHex, profile, contextUris } = anchor.value;
  const atomId = calculateAtomId(dataHex);
  const artistId = calculateAtomId('example:artist');
  const tripleId = calculateTripleId(atomId, byArtistId, artistId);
  return {
    iid,
    profile,
    contextUris,
    dataHex,
    atomId,
    tripleId,
    counterId: calculateCounterTripleId(tripleId),
  };
}
// #endregion

if (import.meta.main) {
  const result = deriveRecording(
    { isrc: 'US-RC1-76-07839' },
    'https://example.org/track',
  );
  assert.equal(result.iid, 'int:isrc:USRC17607839');
  assert.equal(result.profile, 'p0');
  assert.equal(result.atomId, calculateAtomId('int:isrc:USRC17607839'));
  assert.notEqual(result.counterId, result.tripleId);
  const missing = deriveRecording({});
  assert.equal(missing.reason, 'no-identifier');
  console.log(result, missing);
}
