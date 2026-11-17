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

const { createHash } = require('node:crypto');
const { predicateTable } = require('./lib/catalog-blocks');
const { cleanContent } = require('./generate-llms-full');

const catalogFiles = [
  'iid-registry-0.1.0.json',
  'iid-normalization-vectors-0.1.0.json',
];
const exampleId = (n) => '0x' + n.toString(16).padStart(64, '0');
function predicateFixture() {
  return {
    PREDICATE_RECORDS: [
      { key: 'zKey', name: 'lowercase z', status: 'proposed' },
      { key: 'AKey', name: 'A | <Tag> {text} & `name`', status: 'enshrined' },
    ],
    PREDICATE_IDS: { AKey: exampleId(1), zKey: exampleId(2) },
    PREDICATE_ID_TO_KEY: { [exampleId(1)]: 'AKey', [exampleId(2)]: 'zKey' },
    PREDICATE_STATUSES: { AKey: 'enshrined', zKey: 'proposed' },
  };
}

function catalogFixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'catalog-blocks-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  function write(file, value) {
    const dest = path.join(root, file);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.writeFileSync(
      dest,
      typeof value === 'string' ? value : JSON.stringify(value),
    );
  }
  const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
  const sync = (write = false, ...files) =>
    syncGeneratedBlocks({ root, write, files });
  write('static/intuition-release.json', manifest);
  write('src/data/version-equivalents.json', { pairs: [] });
  for (const file of catalogFiles)
    write(
      'scripts/' + file,
      fs.readFileSync(path.join(__dirname, file), 'utf8'),
    );
  const registry = JSON.parse(read('scripts/' + catalogFiles[0]));
  const packages = 'examples/v2/node_modules/@0xintuition/';
  for (const name of ['iid', 'iid-spec', 'predicates'])
    write(packages + name + '/package.json', {
      name: '@0xintuition/' + name,
      version: '0.1.0',
      exports: { '.': { import: './entry.cjs' } },
    });
  const examples = {
    'apple-podcasts': '1222114325',
    letterboxd: 'film:moonlight',
    'podcast-index': '3421639',
  };
  const schemes = Object.fromEntries(
    Object.entries(registry.schemes).map(([name, meta]) => [
      name,
      { class: meta.class },
    ]),
  );
  for (const name of Object.keys(examples)) schemes[name] = { class: 'D' };
  write(packages + 'iid/definitions.json', { schemes, examples });
  write(
    packages + 'iid/entry.cjs',
    fs.readFileSync(
      path.join(__dirname, '__fixtures__/catalog-blocks/iid-runtime.cjs'),
      'utf8',
    ),
  );
  const conformance = packages + 'iid-spec/conformance/';
  function fixture(kind, data) {
    write(conformance + kind + '.json', {
      kind,
      fixtureVersion: 1,
      specVersion: '0.1.0',
      ...data,
    });
  }
  fixture('schemes', { schemes });
  fixture('canonicalization', {
    vectors: Object.entries(examples).flatMap(([scheme, raw]) => [
      { scheme, raw, canonical: raw },
      { scheme, raw: ' ' + raw, canonical: null },
    ]),
  });
  fixture('validation', {
    vectors: Object.entries(examples).map(([name, raw]) => ({
      iid: `int:${name}:${raw}`,
      valid: true,
      anchorEligible: false,
    })),
  });
  write(
    packages + 'predicates/entry.cjs',
    'module.exports = ' + JSON.stringify(predicateFixture()),
  );
  const page = (name) => 'docs/_data/reference/' + name + '.md';
  const marker = (name) =>
    `Before\n{/* generated:start ${name} */}\nold\n{/* generated:end */}\nAfter\n`;
  write(page('iid-schemes'), marker('iid-schemes'));
  write(page('predicates'), marker('predicates'));
  return { root, read, write, sync, packages, conformance, page, marker };
}

test('canonical source snapshots keep their independently pinned bytes', () => {
  const hashes = catalogFiles.map((file) =>
    createHash('sha256')
      .update(fs.readFileSync(path.join(__dirname, file)))
      .digest('hex'),
  );
  assert.deepEqual(hashes, [
    '6ec55d2a5aa2208aa33feff632f75631a592ceee3ee85b69b6762ee456c0ab77',
    '78e524c28e27cdd7c5bd2bfb2267c8eee1abe9a7f03b4047f1466b2bd84d1a1a',
  ]);
});

test('scoped catalog writes are idempotent and checks detect drift without writing', (t) => {
  const { read, write, sync, page, marker } = catalogFixture(t);
  const iid = page('iid-schemes'),
    pred = page('predicates');
  assert.equal(sync().errors.length, 2);
  assert.equal(read(iid), marker('iid-schemes'));
  assert.deepEqual(sync(true, iid), { blocks: 1, errors: [] });
  assert.equal(read(pred), marker('predicates'));
  assert.deepEqual(sync(true), { blocks: 2, errors: [] });
  const output = read(iid);
  assert.equal(
    output.split('\n').filter((line) => line.startsWith('| [')).length,
    29,
  );
  assert.equal(
    output.split('\n').filter((line) => line.includes(' | D | ')).length,
    3,
  );
  const registry = require('./iid-registry-0.1.0.json');
  const vectors = require('./iid-normalization-vectors-0.1.0.json').vectors;
  for (const [name, meta] of Object.entries(registry.schemes)) {
    const sample = vectors.find(
      (x) =>
        x.scheme === name && x.canonical !== null && x.canonical !== x.input,
    );
    const line = output
      .split('\n')
      .find((s) => s.startsWith('| [' + name + ']'));
    assert.ok(
      line.includes(
        '/blob/' +
          manifest.specs[0].commit +
          '/schemes/' +
          name +
          '.md#canonicalization) | ' +
          meta.class +
          ' | ' +
          meta.identifies +
          ' |',
      ),
    );
    assert.ok(line.includes(sample.input));
    assert.ok(line.includes('int:' + name + ':' + sample.canonical));
  }
  for (const iid of [
    'int:apple-podcasts:1222114325',
    'int:letterboxd:film:moonlight',
    'int:podcast-index:3421639',
  ])
    assert.ok(output.includes(iid));
  assert.ok(
    output.includes(
      '/blob/' + manifest.source.commit + '/packages/iid-spec/schemes/',
    ),
  );
  assert.equal(output.match(/\[wd\]\(/g).length, 1);
  assert.deepEqual(sync(true), { blocks: 2, errors: [] });
  assert.equal(read(iid), output);
  const predicates = read(pred);
  assert.deepEqual(sync(), { blocks: 2, errors: [] });
  for (const [file, mutated] of [
    [iid, output.replace('int:wd:Q42', 'int:wd:Q43')],
    [pred, predicates.replace(exampleId(1), exampleId(9))],
  ]) {
    write(file, mutated);
    assert.match(sync(false, file).errors[0], /drift/);
    assert.equal(read(file), mutated);
    assert.deepEqual(sync(true, file).errors, []);
  }
  assert.equal(read(pred), predicates);
  assert.equal(read(iid), output);
  for (const source of [output, predicates]) {
    const rows = source.split('\n').filter((line) => line.startsWith('| '));
    assert.deepEqual(
      cleanContent(source, 'Catalog', { version: 'current' })
        .split('\n')
        .filter((line) => line.startsWith('| ')),
      rows,
    );
  }
});

test('catalogs enforce their exact owning pages, one pair per page, and nesting', (t) => {
  const { write, sync, page, marker } = catalogFixture(t);
  const target = page('iid-schemes');
  for (const [content, reason] of [
    ['No generated content', /needs one/],
    [marker('predicates'), /Incorrect/],
    [marker('release-pins'), /Incorrect/],
    [marker('iid-schemes') + marker('iid-schemes'), /needs one/],
    [
      marker('iid-schemes').replace(
        'old',
        '{/* generated:start predicates */}',
      ),
      /nested/,
    ],
  ]) {
    write(target, content);
    assert.match(sync(false, target).errors[0], reason);
  }
  write(page('other'), marker('predicates'));
  assert.match(sync(false, page('other')).errors[0], /Incorrect/);
});

test('pinned sources and conformance schemas fail closed', (t) => {
  const { read, write, sync, page, packages, conformance } = catalogFixture(t);
  const iid = page('iid-schemes');
  function reject(file, mutate, message, target = iid) {
    const old = read(file);
    const data = JSON.parse(old);
    mutate(data);
    write(file, data);
    assert.match(sync(false, target).errors[0], message);
    write(file, old);
  }
  for (const name of ['iid', 'iid-spec', 'predicates']) {
    const target = name === 'predicates' ? page('predicates') : iid;
    reject(
      packages + name + '/package.json',
      (m) => {
        m.name = 'wrong';
      },
      /does not match/,
      target,
    );
    reject(
      packages + name + '/package.json',
      (m) => {
        m.version = '0.0.1';
      },
      /does not match/,
      target,
    );
  }
  reject(
    packages + 'iid/package.json',
    (m) => {
      m.exports['.'].import = '../escape.cjs';
    },
    /package-local/,
  );
  reject(
    'scripts/' + catalogFiles[0],
    (r) => {
      r.specVersion = '9';
    },
    /schema/,
  );
  reject(
    'scripts/' + catalogFiles[0],
    (r) => {
      delete r.schemes.wd;
    },
    /normalization keys/,
  );
  reject(
    'scripts/' + catalogFiles[0],
    (r) => {
      r.schemes.wd.class = 'E';
    },
    /class/,
  );
  reject(
    'scripts/' + catalogFiles[0],
    (r) => {
      r.schemes.wd.class = 'B';
    },
    /inconsistent canonical IID class/,
  );
  reject(
    'scripts/' + catalogFiles[1],
    (v) => {
      v.vectors.forEach((x) => {
        if (x.scheme === 'wd') x.canonical = null;
      });
    },
    /positive example/,
  );
  reject(
    'scripts/' + catalogFiles[1],
    (v) => {
      delete v.vectors;
    },
    /schema/,
  );
  reject(
    conformance + 'schemes.json',
    (s) => {
      s.fixtureVersion = 2;
    },
    /schema/,
  );
  reject(
    conformance + 'schemes.json',
    (s) => {
      delete s.schemes.letterboxd;
    },
    /runtime IID scheme names/,
  );
  reject(
    conformance + 'schemes.json',
    (s) => {
      s.schemes.other = { class: 'D' };
    },
    /runtime IID scheme names/,
  );
  reject(
    conformance + 'schemes.json',
    (s) => {
      s.schemes.letterboxd.class = 'B';
    },
    /Class D/,
  );
  reject(
    conformance + 'canonicalization.json',
    (s) => {
      s.vectors[0].raw = ' ' + s.vectors[0].raw;
    },
    /without repair/,
  );
  reject(
    conformance + 'validation.json',
    (s) => {
      s.vectors[0].anchorEligible = true;
    },
    /anchor-ineligible/,
  );
});

test('predicates require complete and consistent key, ID and status maps', () => {
  for (const [mutate, reason] of [
    [
      (p) => {
        delete p.PREDICATE_RECORDS;
      },
      /schema/,
    ],
    [
      (p) => {
        delete p.PREDICATE_IDS.AKey;
      },
      /predicate ID keys/,
    ],
    [
      (p) => {
        p.PREDICATE_IDS.extra = exampleId(3);
      },
      /predicate ID keys/,
    ],
    [
      (p) => {
        p.PREDICATE_RECORDS[1].key = 'zKey';
      },
      /predicate ID keys/,
    ],
    [
      (p) => {
        p.PREDICATE_IDS.AKey = p.PREDICATE_IDS.zKey;
      },
      /reverse ID keys/,
    ],
    [
      (p) => {
        p.PREDICATE_ID_TO_KEY[exampleId(1)] = 'zKey';
      },
      /Invalid predicate/,
    ],
    [
      (p) => {
        p.PREDICATE_IDS.AKey = '0xabc';
        delete p.PREDICATE_ID_TO_KEY[exampleId(1)];
        p.PREDICATE_ID_TO_KEY['0xabc'] = 'AKey';
      },
      /Invalid predicate/,
    ],
    [
      (p) => {
        p.PREDICATE_STATUSES.AKey = 'proposed';
      },
      /Invalid predicate/,
    ],
    [
      (p) => {
        p.PREDICATE_RECORDS[0].status = 'draft';
      },
      /Invalid predicate/,
    ],
  ]) {
    const p = predicateFixture();
    mutate(p);
    assert.throws(() => predicateTable(p), reason);
  }
});

test('encoded predicate cells retain exact visible text without creating MDX or extra columns', async () => {
  const { createProcessor } = await import('@mdx-js/mdx');
  const gfm = (await import('remark-gfm')).default;
  const p = predicateFixture();
  const output = predicateTable(p);
  const tree = createProcessor({ remarkPlugins: [gfm] }).parse(output);
  const table = tree.children[0];
  assert.equal(table.type, 'table');
  assert.equal(table.children.length, 3);
  const row = table.children[1];
  assert.equal(row.children.length, 4);
  assert.deepEqual(
    row.children.map((c) => c.children.map((node) => node.value).join('')),
    ['AKey', p.PREDICATE_RECORDS[1].name, 'enshrined', exampleId(1)],
  );
  assert.equal(row.children[1].children[0].type, 'text');
});

test('consistent upstream predicate ID and scheme example changes require a resync', (t) => {
  const { read, write, sync, page, packages } = catalogFixture(t);
  const pred = page('predicates'),
    iid = page('iid-schemes');
  assert.deepEqual(sync(true).errors, []);
  const previous = read(pred);
  const update = predicateFixture();
  delete update.PREDICATE_ID_TO_KEY[update.PREDICATE_IDS.AKey];
  update.PREDICATE_IDS.AKey = exampleId(7);
  update.PREDICATE_ID_TO_KEY[exampleId(7)] = 'AKey';
  // A new package entry simulates a fresh process loading a changed input.
  write(
    packages + 'predicates/next.cjs',
    'module.exports = ' + JSON.stringify(update),
  );
  const file = packages + 'predicates/package.json';
  const metadata = JSON.parse(read(file));
  metadata.exports['.'].import = './next.cjs';
  write(file, metadata);
  const vendor = 'scripts/' + catalogFiles[1];
  const data = JSON.parse(read(vendor));
  data.vectors.find(
    (v) => v.scheme === 'wd' && v.canonical && v.canonical !== v.input,
  ).input = 'q42';
  write(vendor, data);
  assert.equal(
    sync().errors.filter((error) => error.includes('drift')).length,
    2,
  );
  assert.equal(read(pred), previous);
  assert.deepEqual(sync(true).errors, []);
  assert.ok(read(pred).includes(exampleId(7)));
  assert.ok(read(iid).includes('`q42` → `int:wd:Q42`'));
});

test('predicate IDs compare bytes even when hex letters have different casing', () => {
  const p = predicateFixture();
  p.PREDICATE_IDS = {
    AKey: exampleId(10),
    zKey: exampleId(10).replace(/a$/, 'A'),
  };
  p.PREDICATE_ID_TO_KEY = Object.fromEntries(
    Object.entries(p.PREDICATE_IDS).map(([key, id]) => [id, key]),
  );
  assert.throws(() => predicateTable(p), /Duplicate predicate atom ID/);
});
