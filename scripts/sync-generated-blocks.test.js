'use strict';
const assert = require('node:assert/strict');
const test = require('node:test');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const {
  releasePins,
  versionEquivalents,
  replaceBlocks,
  syncGeneratedBlocks,
} = require('./sync-generated-blocks');
const manifest = require('../static/intuition-release.json');
const fixture = fs.readFileSync(
  path.join(__dirname, '__fixtures__/sync-generated-blocks/page.md'),
  'utf8',
);
test('writes table source and preserves every byte outside markers', () => {
  const result = replaceBlocks(fixture, () => releasePins(manifest));
  assert.equal(result.blocks, 1);
  assert.ok(result.text.startsWith(fixture.slice(0, fixture.indexOf('OLD'))));
  assert.ok(
    result.text.endsWith(
      fixture.slice(fixture.indexOf('{/* generated:end */}')),
    ),
  );
  assert.equal(
    replaceBlocks(result.text, () => releasePins(manifest)).text,
    result.text,
  );
  assert.equal(
    result.text
      .split('\n')
      .filter((line) => line.startsWith('| `@0xintuition/')).length,
    21,
  );
});
test('rejects orphan, nested, and unknown blocks', () => {
  for (const source of [
    '{/* generated:end */}',
    '{/* generated:start release-pins */}',
    '{/* generated:start a */}{/* generated:start b */}{/* generated:end */}',
  ])
    assert.throws(() => replaceBlocks(source, () => ''), /Unpaired/);
});
test('equivalence rows omit forbidden pairs and refuse unshipped targets', () => {
  const pairs = [
    { v1: 'old', v2: 'new' },
    { v1: 'experimental-applications/mcp-server', v2: 'agents/index' },
    { v1: 'graphql-api/queries', v2: 'not-shipped' },
  ];
  const current = [
      { id: 'new', route: '/docs/new', frontMatter: { title: 'Current' } },
    ],
    legacy = [
      { id: 'old', route: '/docs/v1/old', frontMatter: { title: 'Previous' } },
    ];
  const table = versionEquivalents(pairs, current, legacy);
  assert.match(table, /\[Previous\]\(\/docs\/v1\/old\)/);
  assert.doesNotMatch(table, /MCP|mcp-server|queries/);
  assert.throws(
    () => versionEquivalents([{ v1: 'old', v2: 'missing' }], current, legacy),
    /unshipped/,
  );
});
test('migration labels use the native body H1 when a frozen page has no title', () => {
  const legacy = {
    id: 'intuition-network/rpc',
    route: '/docs/v1/intuition-network/rpc',
    frontMatter: {},
    body: '\n# Remote Procedure Call (RPC)\n',
  };
  const current = {
    id: 'build/connect',
    route: '/docs/build/connect',
    frontMatter: { title: 'Connect to a network' },
  };
  const pairs = [{ v1: legacy.id, v2: current.id }];
  const expected =
    '| [Remote Procedure Call (RPC)](/docs/v1/intuition-network/rpc) | [Connect to a network](/docs/build/connect) |';
  for (const title of [undefined, '   ']) {
    const table = versionEquivalents(
      pairs,
      [current],
      [{ ...legacy, frontMatter: { title } }],
    );
    assert.equal(table.split('\n').at(-1), expected);
  }
  const titled = { ...legacy, frontMatter: { title: 'Existing title' } };
  assert.match(
    versionEquivalents(pairs, [current], [titled]),
    /\[Existing title\]/,
  );
});
test('check detects one-byte drift; scoped write leaves unrelated page untouched', (t) => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'generated-blocks-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const write = (file, text) => {
    fs.mkdirSync(path.dirname(path.join(root, file)), { recursive: true });
    fs.writeFileSync(path.join(root, file), text);
  };
  write('static/intuition-release.json', JSON.stringify(manifest));
  write('src/data/version-equivalents.json', '{"pairs":[]}');
  write('docs/_data/one.md', fixture);
  write('docs/_data/two.md', fixture);
  assert.equal(syncGeneratedBlocks({ root }).errors.length, 2);
  assert.equal(
    syncGeneratedBlocks({ root, write: true, files: ['docs/_data/one.md'] })
      .errors.length,
    0,
  );
  assert.equal(
    fs.readFileSync(path.join(root, 'docs/_data/two.md'), 'utf8'),
    fixture,
  );
  assert.equal(
    syncGeneratedBlocks({ root, files: ['docs/_data/one.md'] }).errors.length,
    0,
  );
  fs.appendFileSync(path.join(root, 'docs/_data/one.md'), 'outside');
  assert.equal(
    syncGeneratedBlocks({ root, files: ['docs/_data/one.md'] }).errors.length,
    0,
  );
  assert.throws(
    () => syncGeneratedBlocks({ root, files: ['../outside.md'] }),
    /existing V2 page/,
  );
  write('docs/_data/one.md', fixture.replace('release-pins', 'unsupported'));
  assert.match(
    syncGeneratedBlocks({ root, files: ['docs/_data/one.md'] }).errors[0],
    /Unknown/,
  );
});

test('deployments use the exact examples install, preserve chain/contract/asset roles, and reject address drift', (t) => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'deployment-blocks-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const write = (file, content) => {
    const target = path.join(root, file);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, content);
  };
  const address = (n) => '0x' + String(n).padStart(40, '0');
  const maps = {
    BASE_CHAIN_ID: 8453,
    intuitionDeployments: {
      MultiVault: { 1155: address(1), 13579: address(2) },
    },
    intuitionPeripheryDeployments: {
      FeeProxy: { 1155: address(3) },
      TrustSwapAndBridgeRouter: {},
    },
    intuitionPeripheryMetaERC20HubDeployments: { USDC: { 8453: address(4) } },
    intuitionPeripheryMetaERC20SpokeDeployments: { USDC: { 1155: address(4) } },
    intuitionPeripheryBaseBridgeAssetDeployments: { USDC: address(5) },
    intuitionMainnet: {
      id: 1155,
      contracts: { multicall3: { address: address(6) } },
    },
    intuitionTestnet: {
      id: 13579,
      contracts: { multicall3: { address: address(6) } },
    },
  };
  const name = '@0xintuition/deployments';
  const metadata = {
    name,
    version: manifest.packages.find((pkg) => pkg.name === name).version,
    type: 'module',
    exports: { '.': { import: './entry.js' } },
  };
  write('static/intuition-release.json', JSON.stringify(manifest));
  write('src/data/version-equivalents.json', '{"pairs":[]}');
  write('node_modules/' + name + '/package.json', JSON.stringify(metadata));
  write(
    'node_modules/' + name + '/entry.js',
    "throw new Error('wrong installation');",
  );
  const file = 'docs/_data/reference/contracts/deployments.md';
  const fixture =
    'Before\n{/* generated:start deployments */}\nOLD\n{/* generated:end */}\nAfter\n';
  write(file, fixture);
  const sync = (write = false) =>
    syncGeneratedBlocks({ root, write, files: [file] }).errors;
  assert.match(sync().join('\n'), /examples\/v2\/node_modules/);
  const installed = 'examples/v2/node_modules/' + name;
  write(
    installed + '/package.json',
    JSON.stringify({ ...metadata, version: '0.0.0' }),
  );
  assert.match(sync().join('\n'), /does not match/);
  write(installed + '/package.json', JSON.stringify(metadata));
  write(
    installed + '/entry.js',
    Object.entries(maps)
      .map(
        ([key, value]) =>
          'export const ' + key + ' = ' + JSON.stringify(value) + ';',
      )
      .join('\n'),
  );
  assert.deepEqual(sync(true), []);
  const output = fs.readFileSync(path.join(root, file), 'utf8');
  assert.ok(output.startsWith('Before\n{/* generated:start deployments */}'));
  assert.ok(output.endsWith('{/* generated:end */}\nAfter\n'));
  assert.equal(
    output.split('\n').filter((line) => /^\| \d/.test(line)).length,
    8,
  );
  for (const row of [
    [1155, 'MultiVault', '—', 1],
    [13579, 'MultiVault', '—', 2],
    [1155, 'FeeProxy', '—', 3],
    [8453, 'MetaERC20Hub', 'USDC', 4],
    [1155, 'MetaERC20Spoke', 'USDC', 4],
    [8453, 'Base bridge asset', 'USDC', 5],
    [1155, 'multicall3', '—', 6],
    [13579, 'multicall3', '—', 6],
  ]) {
    assert.ok(
      output.includes(
        `| ${row[0]} | ${row[1]} | ${row[2]} | \`${address(row[3])}\` |`,
      ),
    );
  }
  assert.doesNotMatch(output, /TrustSwapAndBridgeRouter/);
  assert.deepEqual(sync(), []);
  write(file, output.replace(address(1), address(8)));
  assert.match(sync().join('\n'), /drift/);
  write(
    file,
    output
      .split('\n')
      .filter((line) => !line.includes('MetaERC20Hub'))
      .join('\n'),
  );
  assert.match(sync().join('\n'), /drift/);
  write(file, 'No markers');
  assert.match(sync().join('\n'), /needs one generated/);
  const { deploymentTable } = require('./sync-generated-blocks');
  const missing = { ...maps };
  delete missing.intuitionPeripheryBaseBridgeAssetDeployments;
  assert.throws(() => deploymentTable(missing));
  const escaped = {
    ...maps,
    intuitionDeployments: { 'Pipe|and\nnewline': { 1155: address(1) } },
  };
  assert.ok(deploymentTable(escaped).includes('Pipe\\|and newline'));
});
