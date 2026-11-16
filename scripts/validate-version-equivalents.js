#!/usr/bin/env node
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const { versions } = require('../docs-versions.config');
const ROOT = path.resolve(__dirname, '..');
const SEEDS = [
  { v1: 'index', v2: 'index' },
  { v1: 'getting-started/ai-skills', v2: 'agents/skills' },
  { v1: 'resources/community-and-support/community', v2: 'community/index' },
];
function readGlobalVersions(globalData) {
  const loaded =
    globalData?.['docusaurus-plugin-content-docs']?._data?.versions;
  if (!Array.isArray(loaded))
    throw new Error(
      'Missing _data versions in .docusaurus/globalData.json; run npm run build first',
    );
  for (const version of Object.values(versions)) {
    if (
      !loaded.some(
        (entry) => entry.name === version.name && Array.isArray(entry.docs),
      )
    )
      throw new Error(`Built metadata missing version ${version.name}`);
  }
  return loaded;
}
function validateEquivalents(map, loaded, seeds = SEEDS) {
  const errors = [];
  if (map?.schemaVersion !== 1 || !Array.isArray(map.pairs))
    return ['Equivalence map must have schemaVersion 1 and pairs array'];
  const ids = Object.fromEntries(
    Object.values(versions).map((version) => [
      version.name,
      new Set(
        loaded
          .find((entry) => entry.name === version.name)
          ?.docs.filter((doc) => !doc.id.startsWith('/'))
          .map((doc) => doc.id) || [],
      ),
    ]),
  );
  const seen = { v1: new Set(), v2: new Set() };
  for (const pair of map.pairs) {
    for (const [side, version] of [
      ['v1', versions.v1.name],
      ['v2', versions.current.name],
    ]) {
      const id = pair?.[side];
      if (typeof id !== 'string' || !ids[version].has(id))
        errors.push(`Unknown ${side} doc id: ${id}`);
      if (seen[side].has(id)) errors.push(`Repeated ${side} doc id: ${id}`);
      seen[side].add(id);
    }
  }
  for (const seed of seeds) {
    if (
      ids[versions.current.name].has(seed.v2) &&
      !map.pairs.some((pair) => pair.v1 === seed.v1 && pair.v2 === seed.v2)
    )
      errors.push(`Missing shipped seed pair: ${seed.v1} ↔ ${seed.v2}`);
  }
  return errors;
}
function run(root = ROOT) {
  const loaded = readGlobalVersions(
    JSON.parse(
      fs.readFileSync(path.join(root, '.docusaurus/globalData.json'), 'utf8'),
    ),
  );
  const map = JSON.parse(
    fs.readFileSync(
      path.join(root, 'src/data/version-equivalents.json'),
      'utf8',
    ),
  );
  return {
    errors: validateEquivalents(map, loaded),
    pairs: map.pairs?.length || 0,
  };
}
if (require.main === module) {
  try {
    const result = run();
    if (result.errors.length) throw new Error(result.errors.join('\n'));
    console.log(
      `Version equivalents PASS: ${result.pairs} unique pairs resolve in both built versions.`,
    );
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
module.exports = { SEEDS, readGlobalVersions, validateEquivalents, run };
