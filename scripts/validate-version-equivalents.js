#!/usr/bin/env node
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const { versions } = require('../docs-versions.config');
const ROOT = path.resolve(__dirname, '..');
const SEEDS = [
  { v1: 'index', v2: 'index' },
  { v1: 'getting-started/ai-skills', v2: 'agents/skills' },
  { v1: 'resources/community-and-support', v2: 'community/index' },
  { v1: 'getting-started/architecture', v2: 'get-started/how-it-fits' },
  { v1: 'quick-start/using-the-sdk', v2: 'get-started/quickstart' },
  { v1: 'experimental-applications/mcp-server', v2: 'agents/index' },
  { v1: 'intuition-concepts/primitives/index', v2: 'concepts/index' },
  { v1: 'intuition-sdk/installation-and-setup', v2: 'build/install' },
  { v1: 'intuition-sdk/search-guide', v2: 'build/read-with-sdk' },
  { v1: 'tutorials/overview', v2: 'examples/index' },
  { v1: 'intuition-sdk/quick-start', v2: 'reference/packages/sdk' },
  {
    v1: 'protocol/getting-started/overview',
    v2: 'reference/packages/protocol',
  },
  { v1: 'getting-started/choose-your-path', v2: 'get-started/choose-packages' },
  {
    v1: 'intuition-concepts/primitives/Atoms/fundamentals',
    v2: 'concepts/atoms',
  },
  {
    v1: 'intuition-concepts/primitives/Triples/fundamentals',
    v2: 'concepts/triples',
  },
  { v1: 'protocol/core-concepts/vaults', v2: 'concepts/vaults' },
  {
    v1: 'intuition-concepts/economics/bonding-curves',
    v2: 'concepts/bonding-curves',
  },
  {
    v1: 'intuition-concepts/primitives/Signals/fundamentals',
    v2: 'concepts/signals',
  },
  {
    v1: 'intuition-concepts/economics/fees-and-rewards',
    v2: 'concepts/fees-and-rewards',
  },
  { v1: 'intuition-smart-contracts/overview', v2: 'reference/contracts/index' },
  {
    v1: 'intuition-smart-contracts/multivault',
    v2: 'reference/contracts/multivault',
  },
  {
    v1: 'intuition-smart-contracts/fee-proxy',
    v2: 'reference/contracts/fee-proxy',
  },
  {
    v1: 'intuition-smart-contracts/trust-bonding',
    v2: 'reference/contracts/trust-bonding',
  },
  {
    v1: 'intuition-smart-contracts/configuration',
    v2: 'reference/contracts/configuration',
  },
  {
    v1: 'intuition-smart-contracts/deployments',
    v2: 'reference/contracts/deployments',
  },
  {
    v1: 'protocol/events/atom-events',
    v2: 'reference/contracts/events-and-errors',
  },
  {
    v1: 'intuition-smart-contracts/audit-reports',
    v2: 'reference/contracts/audits',
  },
  { v1: 'intuition-network/network', v2: 'reference/networks/index' },
  { v1: 'quick-start/testnet-faucet', v2: 'reference/networks/faucet' },
  { v1: 'intuition-network/rpc', v2: 'build/connect' },
  { v1: 'interaction-guide/create-atom', v2: 'build/create-atoms' },
  { v1: 'interaction-guide/create-triple', v2: 'build/create-triples' },
  { v1: 'interaction-guide/deposit-return', v2: 'build/deposit-redeem' },
  { v1: 'protocol/examples/batch-operations', v2: 'build/batch-writes' },
  { v1: 'interaction-guide/fee-proxy-integration', v2: 'build/fee-proxy' },
  { v1: 'intuition-sdk/integrations/react', v2: 'build/react' },
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
