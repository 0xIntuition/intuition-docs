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

test('every shipped seed resolves in the authored trees and removing any one fails', () => {
  const shippedIds = new Set(
    sourceLoaded
      .find((version) => version.name === versions.current.name)
      .docs.map((doc) => doc.id),
  );
  const shippedSeeds = SEEDS.filter((seed) => shippedIds.has(seed.v2));
  assert.equal(shippedSeeds.length, 36);
  assert.deepEqual(map.pairs, shippedSeeds);
  assert.deepEqual(validateEquivalents(map, sourceLoaded), []);
  for (const seed of shippedSeeds) {
    const pairs = map.pairs.filter((pair) => pair.v2 !== seed.v2);
    assert.ok(
      validateEquivalents({ schemaVersion: 1, pairs }, sourceLoaded).includes(
        `Missing shipped seed pair: ${seed.v1} ↔ ${seed.v2}`,
      ),
      seed.v2,
    );
  }
});

test('rejects swapped Phase 4 destinations, duplicate pairs and non-native IDs', () => {
  const pairs = map.pairs.filter(({ v2 }) =>
    ['build/create-atoms', 'build/create-triples'].includes(v2),
  );
  const [atom, triple] = pairs;
  const native = Object.values(versions).map((version) => ({
    name: version.name,
    docs: pairs.map((pair) => ({
      id: pair[version.name === versions.v1.name ? 'v1' : 'v2'],
    })),
  }));
  const check = (entries) =>
    validateEquivalents({ schemaVersion: 1, pairs: entries }, native);
  assert.deepEqual(check(pairs), []);
  const swapped = check([
    { ...atom, v2: triple.v2 },
    { ...triple, v2: atom.v2 },
  ]);
  for (const { v1, v2 } of pairs)
    assert.ok(swapped.includes(`Missing shipped seed pair: ${v1} ↔ ${v2}`));
  assert.deepEqual(check([...pairs, atom]), [
    'Repeated v1 doc id: interaction-guide/create-atom',
    'Repeated v2 doc id: build/create-atoms',
  ]);
  for (const [side, id] of [
    ['v1', '/docs/v1/interaction-guide/create-atom'],
    ['v2', '/docs/build/create-atoms'],
  ])
    assert.ok(
      check([{ ...atom, [side]: id }, triple]).includes(
        `Unknown ${side} doc id: ${id}`,
      ),
    );
});
