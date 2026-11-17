import assert from 'node:assert/strict';
import { sameAsId } from '@0xintuition/predicates/sameAs';
import { reviewLink } from './linking-plan.ts';

if (import.meta.main) {
  // #region review-decisions
  const recording = {
    candidate: 'anchor' as const,
    evidence:
      'The two catalog records credit the same take and list the same recording code.',
  };
  const accepted = reviewLink({ ...recording, approved: true });
  const waiting = reviewLink({ ...recording, approved: false });
  const article = reviewLink({
    candidate: 'review',
    approved: false,
    evidence: 'The critic cites the recording in a review.',
  });
  const namesake = reviewLink({
    candidate: 'namesake',
    approved: false,
    evidence: 'Only the title matches.',
  });
  // #endregion
  assert.ok('claim' in accepted && accepted.claim);
  const claim = accepted.claim;
  assert.equal(claim.predicateId, sameAsId);
  assert.notEqual(claim.subjectId, claim.objectId);
  console.log('Subject', claim.subjectId);
  console.log(claim.predicateKey, claim.predicateId);
  console.log('Object', claim.objectId);
  console.log('Triple', claim.id);
  for (const result of [waiting, article, namesake]) {
    assert.ok(result.reason);
    console.log(result.candidate, result.reason);
  }
}
