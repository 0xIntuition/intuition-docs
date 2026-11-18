import assert from 'node:assert/strict';

// #region predicate-identity
import { calculateAtomId, calculateTripleId } from '@0xintuition/ids';
import {
  byArtist,
  byArtistAtomData,
  byArtistId,
  byArtistSpec,
} from '@0xintuition/predicates/byArtist';

// Synthetic local fixture atoms; these strings claim no external identity.
const recordingId = calculateAtomId('example:recording');
const artistId = calculateAtomId('example:artist');
const byArtistTripleId = calculateTripleId(recordingId, byArtistId, artistId);
console.log({
  key: byArtistSpec.key,
  label: byArtist.name,
  data: byArtistAtomData,
  predicateId: byArtistId,
  tripleId: byArtistTripleId,
});
// #endregion

assert.equal(calculateAtomId(byArtistAtomData), byArtistId);
assert.equal(byArtistSpec.key, 'byArtist');
assert.equal(byArtist.name, 'by artist');

// JSON-LD @context is inside the hashed payload, unlike companion contextUris.
const predicateDocument: Record<string, unknown> = JSON.parse(byArtistAtomData);
const changedContext = JSON.stringify({
  ...predicateDocument,
  '@context': 'https://example.com/vocabulary',
});
assert.notEqual(calculateAtomId(changedContext), byArtistId);
