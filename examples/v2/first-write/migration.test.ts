import assert from 'node:assert/strict';
import test from 'node:test';
import { calculateAtomId } from '@0xintuition/ids';
import { stringToHex } from 'viem';
import { preserveAtom } from './src/migration.ts';

// V1 createAtomFromString always encoded the literal text as UTF-8 bytes.
// These tests invoke only the offline preservation helper, never a write.
test('migration preserves ordinary text and its exact bytes', () => {
  const data = 'Intuition documentation';
  const atom = preserveAtom(data);
  assert.equal(atom.data, data);
  assert.equal(atom.dataHex, stringToHex(data));
  assert.equal(atom.id, calculateAtomId(atom.dataHex));
  assert.equal(atom.id, calculateAtomId(data));
});

test('migration treats hex-looking historical text as literal UTF-8', () => {
  const atom = preserveAtom('0xdeadbeef');
  assert.equal(atom.data, '0xdeadbeef');
  assert.equal(atom.dataHex, '0x30786465616462656566');
  assert.equal(atom.id, calculateAtomId(atom.dataHex));
  assert.equal(
    atom.id,
    '0xacbd05eea775aa5807313f3ff6ef595805dc165e1c2f1e0044c8a663b4779b41',
  );
  assert.notEqual(atom.id, calculateAtomId('0xdeadbeef'));
});
