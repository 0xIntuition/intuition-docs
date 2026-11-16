'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { versions } = require('../docs-versions.config');
const {
  SEEDS,
  readGlobalVersions,
  validateEquivalents,
} = require('./validate-version-equivalents');
const loaded = [
  {
    name: versions.v1.name,
    docs: [
      ...SEEDS.map((pair) => ({ id: pair.v1 })),
      { id: '/category/generated' },
    ],
  },
  { name: versions.current.name, docs: SEEDS.map((pair) => ({ id: pair.v2 })) },
];
test('AC-18 accepts native IDs and all three Phase 1 seeds', () => {
  assert.deepEqual(
    validateEquivalents({ schemaVersion: 1, pairs: SEEDS }, loaded),
    [],
  );
  assert.equal(
    readGlobalVersions({
      'docusaurus-plugin-content-docs': { _data: { versions: loaded } },
    }),
    loaded,
  );
});
test('AC-18 rejects missing ids, duplicates, generated-index IDs and omitted shipped seeds', () => {
  for (const pairs of [
    [...SEEDS, { v1: 'missing', v2: 'index' }],
    [...SEEDS, SEEDS[0]],
    [...SEEDS.slice(1)],
    [...SEEDS, { v1: '/category/generated', v2: 'index' }],
  ])
    assert.ok(validateEquivalents({ schemaVersion: 1, pairs }, loaded).length);
  assert.throws(() => readGlobalVersions({}), /run npm run build/);
});
