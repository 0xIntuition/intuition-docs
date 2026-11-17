import assert from 'node:assert/strict';
import { calculateAtomId } from '@0xintuition/ids';

// #region suggest-edge
import { musicRecordingCreationProfile } from '@0xintuition/classifications/creation/music-recording';
import { getPredicateById, getPredicateId } from '@0xintuition/predicates';
import type { Hex } from 'viem';

export function suggestRelationship(
  recordingId: Hex,
  key: string,
  target: { id: Hex; classification: string },
) {
  const relation = musicRecordingCreationProfile.relationships.find(
    (entry) => entry.predicate.key === key,
  );
  if (!relation) return { reason: 'No profile recommendation' };
  const allowed = relation.expectedObjects.some(
    (hint) =>
      hint.kind === 'classification' && hint.slug === target.classification,
  );
  if (!allowed)
    return { reason: 'Target falls outside the recommended classifications' };
  const predicate = getPredicateById(relation.predicate.id);
  if (!predicate || predicate.key !== key)
    return { reason: 'Unknown predicate' };
  return {
    subjectId: recordingId,
    predicateId: getPredicateId(predicate.key),
    objectId: target.id,
    label: predicate.name,
    status: predicate.status,
  };
}
// #endregion

if (import.meta.main) {
  const recording = calculateAtomId('example:recording');
  const group = {
    id: calculateAtomId('example:group'),
    classification: 'music-group',
  };
  const album = {
    id: calculateAtomId('example:album'),
    classification: 'music-album',
  };
  const suggestion = suggestRelationship(recording, 'byArtist', group);
  assert.equal(suggestion.status, 'proposed');
  assert.equal(suggestion.subjectId, recording);
  assert.equal(suggestion.objectId, group.id);
  const rejected = suggestRelationship(recording, 'byArtist', album);
  const missing = suggestRelationship(recording, '', group);
  assert.ok(rejected.reason);
  assert.ok(missing.reason);
  console.log(suggestion, rejected.reason, missing.reason);
}
