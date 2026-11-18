// #region quickstart
import assert from 'node:assert/strict';
import { buildIidAnchor } from '@0xintuition/primitives/anchor';

const result = buildIidAnchor(
  'music-recording',
  { isrc: 'US-RC1-76-07839' },
  { contextUris: ['https://example.com/recordings/1'] },
);
if (!result.success) throw new Error(result.errors.join('; '));
const atom = result.value;
assert.equal(atom.iid, 'int:isrc:USRC17607839');
assert.equal(atom.profile, 'p0');
assert.equal(atom.data, atom.iid);

const otherContext = buildIidAnchor(
  'music-recording',
  { isrc: 'USRC17607839' },
  { contextUris: ['https://example.org/alternate-evidence'] },
);
if (!otherContext.success) throw new Error(otherContext.errors.join('; '));
assert.equal(otherContext.value.data, atom.data);
assert.equal(otherContext.value.dataHex, atom.dataHex);
assert.equal(otherContext.value.id, atom.id);

console.log(atom.iid);
console.log(atom.profile);
console.log(atom.dataHex);
console.log(atom.id);
// #endregion
