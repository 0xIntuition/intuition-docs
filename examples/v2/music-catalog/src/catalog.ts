// #region catalog
import assert from 'node:assert/strict';
import { calculateAtomId } from '@0xintuition/ids';
import { inspectIntuitionId } from '@0xintuition/iid';
import { classificationForIid } from '@0xintuition/iid-registry';
import { buildIidAnchor } from '@0xintuition/primitives/anchor';
import { getPredicateInfo } from '@0xintuition/primitives/predicate';
import { buildTriple } from '@0xintuition/primitives/triple';
import type { BuildResult } from '@0xintuition/primitives';

function unwrap<T>(result: BuildResult<T>): T {
  if (!result.success) throw new Error(result.errors.join('; '));
  return result.value;
}

// Synthetic test identifiers, not verified MusicBrainz records.
const recordingValues = {
  name: 'One More Time',
  sameAs: [
    'https://musicbrainz.org/recording/b1a9c0e9-d987-4042-ae91-78d6a3267d69',
  ],
};
const recording = unwrap(buildIidAnchor('music-recording', recordingValues));
const artist = unwrap(buildIidAnchor('music-group', { name: 'Daft Punk' }));
const album = unwrap(
  buildIidAnchor('music-album', {
    name: 'Discovery',
    sameAs: [
      'https://musicbrainz.org/release-group/41b3f6ea-f7b6-3a6c-9a0a-3f8d6e2a1b55',
    ],
  }),
);
const byArtist = getPredicateInfo('byArtist');
const inAlbum = getPredicateInfo('inAlbum');
assert.ok(byArtist && inAlbum);

const claims = [
  unwrap(buildTriple(recording.id, byArtist.key, artist.id)),
  unwrap(buildTriple(recording.id, inAlbum.key, album.id)),
];
assert.equal(claims[0].predicateId, byArtist.id);
assert.equal(calculateAtomId(byArtist.atomData), byArtist.id);
assert.notEqual(
  unwrap(buildTriple(artist.id, byArtist.key, recording.id)).id,
  claims[0].id,
);

// Companion context travels alongside the atom; it is not atom data.
const withContext = unwrap(
  buildIidAnchor('music-recording', recordingValues, {
    contextUris: ['https://example.org/catalog/recording.json'],
  }),
);
assert.equal(withContext.id, recording.id);
assert.equal(withContext.data, recording.data);
const changedJson = artist.data.replace(
  'https://schema.org/',
  'https://schema.org',
);
assert.notEqual(calculateAtomId(changedJson), artist.id);

const repeated = unwrap(buildIidAnchor('music-recording', recordingValues));
assert.equal(repeated.id, recording.id);
const nameOnly = unwrap(
  buildIidAnchor('music-recording', { name: 'One More Time' }),
);
assert.notEqual(nameOnly.id, recording.id);
assert.equal(nameOnly.profile, 'p1');
assert.equal(inspectIntuitionId(recording.iid!).valid, true);
assert.equal(classificationForIid(recording.iid!)?.slug, 'music-recording');
assert.equal(classificationForIid('int:wd:Q42'), undefined);

const catalog = {
  synthetic: true,
  entities: [recording, artist, album].map(({ data, iid, profile, id }) => ({
    data,
    iid,
    profile,
    id,
  })),
  predicates: [byArtist, inAlbum].map(({ key, atomData, id }) => ({
    key,
    atomData,
    id,
  })),
  claims: claims.map((triple) => ({
    triple,
    source: 'local synthetic fixture',
  })),
};
console.log(JSON.stringify(catalog, null, 2));
console.log('3 entities, 2 predicate atoms, 2 directed claims');
console.log(
  `Profiles: ${catalog.entities.map((entity) => entity.profile).join(', ')}`,
);
console.log(
  'Context unchanged; reversed edge differs; bare Wikidata type unknown',
);
// #endregion
