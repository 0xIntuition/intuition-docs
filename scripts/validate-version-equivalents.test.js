'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { versions } = require('../docs-versions.config');
const { readDocs } = require('./lib/docs-tree');
const path = require('node:path');
const map = require('../src/data/version-equivalents.json');
const {
  SEEDS,
  readGlobalVersions,
  validateEquivalents,
} = require('./validate-version-equivalents');
const loaded = [
  {
    name: versions.v1.name,
    docs: [
      { id: 'index' },
      { id: 'getting-started/ai-skills' },
      { id: 'resources/community-and-support' },
      { id: '/category/generated' },
    ],
  },
  {
    name: versions.current.name,
    docs: [{ id: 'index' }, { id: 'agents/skills' }, { id: 'community/index' }],
  },
];
const phaseOneSeeds = SEEDS.filter((pair) =>
  loaded[1].docs.some((doc) => doc.id === pair.v2),
);
const sourceLoaded = Object.values(versions).map((version) => ({
  name: version.name,
  docs: readDocs(path.resolve(__dirname, '..'), version),
}));
test('AC-18 accepts native IDs and all three Phase 1 seeds', () => {
  assert.equal(phaseOneSeeds.length, 3);
  assert.deepEqual(
    validateEquivalents({ schemaVersion: 1, pairs: phaseOneSeeds }, loaded),
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
    [...phaseOneSeeds, { v1: 'missing', v2: 'index' }],
    [...phaseOneSeeds, phaseOneSeeds[0]],
    [...phaseOneSeeds.slice(1)],
    [...phaseOneSeeds, { v1: '/category/generated', v2: 'index' }],
  ])
    assert.ok(validateEquivalents({ schemaVersion: 1, pairs }, loaded).length);
  assert.throws(() => readGlobalVersions({}), /run npm run build/);
});

test('community seed matches the frozen source ID and authored map', () => {
  const source = readDocs(path.resolve(__dirname, '..'), versions.v1).find(
    (doc) => doc.relativePath === 'resources/community-and-support.md',
  );
  assert.equal(source.id, 'resources/community-and-support');
  assert.deepEqual(validateEquivalents(map, sourceLoaded), []);
  for (const pairs of [
    map.pairs.filter((pair) => pair.v2 !== 'community/index'),
    map.pairs.map((pair) =>
      pair.v2 === 'community/index'
        ? { ...pair, v1: 'resources/community-and-support/community' }
        : pair,
    ),
  ]) {
    assert.match(
      validateEquivalents({ schemaVersion: 1, pairs }, sourceLoaded).join('\n'),
      /Missing shipped seed pair: resources\/community-and-support ↔ community\/index/,
    );
  }
});

test('all 12 Phase 2 seeds resolve in the authored trees and each shipped seed is required', () => {
  assert.equal(SEEDS.length, 12);
  assert.deepEqual(map.pairs, SEEDS);
  assert.deepEqual(validateEquivalents(map, sourceLoaded), []);
  for (const seed of SEEDS) {
    const pairs = map.pairs.filter((pair) => pair.v2 !== seed.v2);
    assert.ok(
      validateEquivalents({ schemaVersion: 1, pairs }, sourceLoaded).includes(
        `Missing shipped seed pair: ${seed.v1} ↔ ${seed.v2}`,
      ),
      seed.v2,
    );
  }
});
