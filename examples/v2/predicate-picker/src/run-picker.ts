import assert from 'node:assert/strict';
import { calculateTripleId } from '@0xintuition/ids';
import { catalog, previewTriple } from './picker-model.ts';

// #region review-picks
if (import.meta.main) {
  const [group, album] = catalog;
  const suggestion = previewTriple('byArtist', group.data);
  assert.ok(suggestion.ok);
  assert.equal(previewTriple('byArtist', '').ok, false);
  assert.equal(previewTriple('inAlbum', album.data).ok, true);
  const { subjectId, predicateId, objectId, tripleId } = suggestion;
  assert.notEqual(
    calculateTripleId(objectId, predicateId, subjectId),
    tripleId,
  );
  console.log('byArtist', suggestion.status, tripleId);
  for (const attempt of [
    previewTriple('', ''),
    previewTriple('byArtist', album.data),
  ]) {
    assert.ok(!attempt.ok);
    console.log(attempt.message);
  }
}
// #endregion
