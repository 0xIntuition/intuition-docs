// #region link-representations
import assert from 'node:assert/strict';
import { buildAtomData } from '@0xintuition/classifications';
import { calculateAtomId } from '@0xintuition/ids';
import { sameAsId } from '@0xintuition/predicates/sameAs';
import { buildTriple } from '@0xintuition/primitives/triple';

// Both catalog entries describe the same recording in this local fixture.
const recording = { name: 'Example recording' };
const left = calculateAtomId(
  buildAtomData('music-recording', {
    ...recording,
    sameAs: ['https://example.org/catalog/a'],
  }),
);
const right = calculateAtomId(
  buildAtomData('music-recording', {
    ...recording,
    sameAs: ['https://example.org/catalog/b'],
  }),
);
assert.notEqual(left, right);

const claim = buildTriple(left, 'sameAs', right);
if (!claim.success) throw new Error(claim.errors.join('; '));
assert.equal(claim.value.subjectId, left);
assert.equal(claim.value.predicateId, sameAsId);
assert.equal(claim.value.objectId, right);
// #endregion

const reverse = buildTriple(right, 'sameAs', left);
if (!reverse.success) throw new Error(reverse.errors.join('; '));
assert.notEqual(reverse.value.id, claim.value.id);

// #region profile-bytes
import { buildIidAnchor } from '@0xintuition/primitives/anchor';

const values = { name: 'Example recording', byArtist: 'Example artist' };
const p1 = buildIidAnchor('music-recording', values, { profile: 'p1' });
const p2 = buildIidAnchor('music-recording', values, { profile: 'p2' });
if (!p1.success) throw new Error(p1.errors.join('; '));
if (!p2.success) throw new Error(p2.errors.join('; '));
console.log(p1.value.profile, p2.value.profile);
console.log(p1.value.data === p2.value.data, p1.value.id === p2.value.id);
// #endregion

assert.equal(p1.value.profile, 'p1');
assert.equal(p2.value.profile, 'p2');
assert.equal(p1.value.data, p2.value.data);
assert.equal(p1.value.dataHex, p2.value.dataHex);
assert.equal(p1.value.id, p2.value.id);
assert.equal(JSON.parse(p2.value.data).name, values.name);
assert.equal(Object.hasOwn(JSON.parse(p2.value.data), 'byArtist'), false);
