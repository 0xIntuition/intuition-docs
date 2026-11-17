// #region recording-menu
import { musicRecordingCreationProfile } from '@0xintuition/classifications/creation/music-recording';
import { calculateAtomId, calculateTripleId } from '@0xintuition/ids';
import { getPredicateById, getPredicateId } from '@0xintuition/predicates';

export const recording = {
  name: 'Paper Moon Demo',
  data: 'example:recording:paper-moon',
};
export const catalog = [
  {
    name: 'Night Shift Trio',
    classification: 'music-group',
    data: 'example:group:night-shift',
  },
  {
    name: 'After Hours',
    classification: 'music-album',
    data: 'example:album:after-hours',
  },
];
export const relationships = musicRecordingCreationProfile.relationships.filter(
  ({ predicate }) =>
    predicate.key === 'byArtist' || predicate.key === 'inAlbum',
);

export function objectHints(key: string): string[] {
  const relation = relationships.find(({ predicate }) => predicate.key === key);
  return (
    relation?.expectedObjects.flatMap((hint) =>
      hint.kind === 'classification' ? [hint.slug] : [],
    ) ?? []
  );
}
// #endregion

// #region preview-triple
export function previewTriple(key: string, objectData: string) {
  const relation = relationships.find(({ predicate }) => predicate.key === key);
  if (!relation)
    return { ok: false as const, message: 'Choose a relationship.' };
  const predicate = getPredicateById(relation.predicate.id);
  if (!predicate || predicate.key !== key) {
    return {
      ok: false as const,
      message: 'The predicate is missing from this registry.',
    };
  }
  const target = catalog.find((item) => item.data === objectData);
  if (!target)
    return { ok: false as const, message: 'Choose a catalog entry.' };
  if (!objectHints(key).includes(target.classification)) {
    return {
      ok: false as const,
      message: 'Choose an entry with a suggested classification.',
    };
  }
  const subjectId = calculateAtomId(recording.data);
  const predicateId = getPredicateId(predicate.key);
  const objectId = calculateAtomId(target.data);
  return {
    ok: true as const,
    status: predicate.status,
    subjectId,
    predicateId,
    objectId,
    tripleId: calculateTripleId(subjectId, predicateId, objectId),
  };
}
// #endregion
