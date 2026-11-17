import assert from 'node:assert/strict';

// #region reviewed-link
import { inspectIntuitionId } from '@0xintuition/iid';
import { calculateAtomId } from '@0xintuition/ids';
import { sameAsId } from '@0xintuition/predicates/sameAs';
import { buildTriple } from '@0xintuition/primitives/triple';

type CatalogRecord = {
  atomData: string;
  level: 'recording' | 'article';
  recordingIid?: string;
};

export function planLink(
  left: CatalogRecord,
  right: CatalogRecord,
  reviewerApproved: boolean,
) {
  if (left.level !== 'recording' || right.level !== 'recording')
    return { reason: 'Different entity level' };
  if (!left.recordingIid || !right.recordingIid)
    return { reason: 'Missing recording identifier' };
  const a = inspectIntuitionId(left.recordingIid);
  const b = inspectIntuitionId(right.recordingIid);
  if (
    !a.valid ||
    !b.valid ||
    a.scheme !== 'isrc' ||
    b.scheme !== 'isrc' ||
    a.iid !== b.iid
  ) {
    return { reason: 'Recording identifiers do not match' };
  }
  if (!reviewerApproved) return { reason: 'Awaiting review' };
  const subjectId = calculateAtomId(left.atomData);
  const objectId = calculateAtomId(right.atomData);
  if (subjectId === objectId) return { reason: 'Already the same atom' };
  const claim = buildTriple(subjectId, 'sameAs', objectId);
  if (!claim.success) throw new Error(claim.errors.join(', '));
  return { claim: claim.value };
}
// #endregion

if (import.meta.main) {
  // Synthetic archived UTF-8 payload and later bare-IID anchor. A catalog
  // editor verified their recording-level ISRC in the fixture's source records.
  const iid = 'int:isrc:USRC17607839';
  const archive: CatalogRecord = {
    atomData:
      '{"name":"Local track","sameAs":["https://example.org/catalog/track"]}',
    level: 'recording',
    recordingIid: iid,
  };
  const anchor: CatalogRecord = {
    atomData: iid,
    level: 'recording',
    recordingIid: iid,
  };
  const { claim } = planLink(archive, anchor, true);
  assert.ok(claim);
  assert.notEqual(claim.subjectId, claim.objectId);
  assert.equal(claim.predicateId, sameAsId);
  const article: CatalogRecord = {
    atomData: 'Local track review',
    level: 'article',
    recordingIid: iid,
  };
  const missing: CatalogRecord = {
    atomData: 'Local track',
    level: 'recording',
  };
  const another: CatalogRecord = {
    atomData: 'Second recording',
    level: 'recording',
    recordingIid: 'int:isrc:GBUM71029604',
  };
  const skipped = [article, missing, another].map(
    (candidate) => planLink(archive, candidate, false).reason,
  );
  assert.deepEqual(skipped, [
    'Different entity level',
    'Missing recording identifier',
    'Recording identifiers do not match',
  ]);
  assert.equal(planLink(archive, anchor, false).reason, 'Awaiting review');
  console.log(claim, skipped);
}
