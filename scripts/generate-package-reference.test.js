'use strict';
const assert = require('node:assert/strict');
const test = require('node:test');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const {
  generateReference,
  SDK_REFERENCE_FILES,
  R15_WARNING,
} = require('./generate-package-reference');
const actual = require('../static/intuition-release.json');
function fixture(t) {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'package-reference-'));
  t.after(() => fs.rmSync(temp, { recursive: true, force: true }));
  const root = path.join(temp, 'source'),
    repoRoot = path.join(temp, 'docs');
  const write = (dir, file, content) => {
    const absolute = path.join(dir, file);
    fs.mkdirSync(path.dirname(absolute), { recursive: true });
    fs.writeFileSync(absolute, content);
  };
  fs.mkdirSync(root);
  execFileSync('git', ['init', '-q', root]);
  const git = (...args) =>
    execFileSync('git', ['-C', root, ...args], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    }).trim();
  git('config', 'user.name', 'Docs fixture');
  git('config', 'user.email', 'fixture@example.invalid');
  git('remote', 'add', 'origin', 'https://github.com/0xIntuition/packages.git');
  write(
    root,
    'packages/sdk/package.json',
    JSON.stringify({
      name: '@0xintuition/sdk',
      version: '4.0.0',
      exports: {
        './api': { types: './dist/api/index.d.ts' },
        './actions': { types: './dist/actions/index.d.ts' },
      },
    }),
  );
  write(
    root,
    'packages/sdk/src/api/index.ts',
    fs.readFileSync(
      path.join(__dirname, '__fixtures__/package-reference/api.ts.txt'),
      'utf8',
    ),
  );
  write(
    root,
    'packages/sdk/src/actions/index.ts',
    "export * from './sample';\n",
  );
  write(
    root,
    'packages/sdk/src/actions/sample.ts',
    '/** Prepare a fixture. */\nexport function prepare(input: string): string { return input; }\n',
  );
  git('add', '.');
  git('commit', '-qm', 'initial source');
  const previous = git('rev-parse', 'HEAD');
  write(root, 'README.md', 'New release changes another package.\n');
  git('add', '.');
  git('commit', '-qm', 'new release');
  const commit = git('rev-parse', 'HEAD');
  const manifest = {
    ...structuredClone(actual),
    source: { repository: actual.source.repository, commit },
    sentinel: { keep: true },
    packages: [
      {
        ...structuredClone(
          actual.packages.find((pkg) => pkg.name === '@0xintuition/sdk'),
        ),
        registry: {
          ...actual.packages.find((pkg) => pkg.name === '@0xintuition/sdk')
            .registry,
          gitHead: previous,
        },
        customField: 'preserve package metadata',
      },
    ],
  };
  const file = path.join(repoRoot, 'static/intuition-release.json');
  write(
    repoRoot,
    'static/intuition-release.json',
    JSON.stringify(manifest, null, 2) + '\n',
  );
  const sections = [
    ['api/index.ts', 'API client', 'api'],
    ['actions/sample.ts', 'Sample actions', 'actions'],
  ];
  const run = (check = false) =>
    generateReference({ root, repoRoot, check, sections });
  return { root, repoRoot, git, manifest, file, run, write, previous };
}
test('API inventory is exactly 18 allowlisted files and require does not generate', () => {
  assert.equal(SDK_REFERENCE_FILES.length, 18);
  assert.equal(new Set(SDK_REFERENCE_FILES).size, 18);
  assert.ok(SDK_REFERENCE_FILES.includes('docs/_data/reference/sdk/index.md'));
});
test('regeneration preserves all unrelated manifest and registry fields, supports unchanged ancestor publication', async (t) => {
  const f = fixture(t);
  await f.run();
  const result = JSON.parse(fs.readFileSync(f.file));
  for (const key of [
    'schemaVersion',
    'generation',
    'status',
    'registryPublicationVerified',
    'registryVerifiedAt',
    'core',
    'specs',
    'contracts',
    'sentinel',
  ])
    assert.deepEqual(result[key], f.manifest[key]);
  assert.deepEqual(
    result.packages[0].registry,
    f.manifest.packages[0].registry,
  );
  assert.equal(result.packages[0].customField, 'preserve package metadata');
  assert.deepEqual(result.packages[0].entrypoints, ['./api', './actions']);
  const snapshot = fs.readFileSync(f.file, 'utf8');
  await f.run(true);
  await f.run();
  assert.equal(fs.readFileSync(f.file, 'utf8'), snapshot);
  const changed = JSON.parse(snapshot);
  changed.registryVerifiedAt = '2030-01-01T00:00:00Z';
  changed.core.keepSentinel = true;
  changed.specs.push({ sentinel: 'survives' });
  changed.packages[0].registry.sentinel = 'survives';
  fs.writeFileSync(f.file, JSON.stringify(changed));
  await f.run(true);
  await f.run();
  assert.deepEqual(JSON.parse(fs.readFileSync(f.file)), changed);
});
test('outputs source-faithful declarations, defaults, types, metadata, absolute links and R15 warning', async (t) => {
  const f = fixture(t);
  await f.run();
  const api = fs.readFileSync(
    path.join(f.repoRoot, 'docs/_data/reference/sdk/api.md'),
    'utf8',
  );
  assert.ok(api.includes(`<AppliesTo />\n\n${R15_WARNING}`));
  assert.match(api, /function readValue\(value\?: number\): number;/);
  assert.match(api, /Defaults: `value = 1`/);
  assert.match(api, /Module-local helper; not a public export/);
  assert.match(api, /Public export/);
  assert.match(api, /#L6/);
  assert.match(api, /TESTNET_API_URL/);
  assert.doesNotMatch(api, /PRIVATE_QUERY|query NeverPublish/);
  assert.match(api, /generated_by: scripts\/generate-package-reference.js/);
  assert.doesNotMatch(api, /^slug:|^id:/m);
  assert.match(api, /\[Compatibility\]\(\/docs\/reference\/compatibility\)/);
  const before = api;
  await f.run();
  assert.equal(
    fs.readFileSync(
      path.join(f.repoRoot, 'docs/_data/reference/sdk/api.md'),
      'utf8',
    ),
    before,
  );
});
test('check rejects changed output and managed metadata without overwriting either', async (t) => {
  const f = fixture(t);
  await f.run();
  const api = path.join(f.repoRoot, 'docs/_data/reference/sdk/api.md');
  fs.appendFileSync(api, 'drift\n');
  await assert.rejects(f.run(true), /Generated reference drift/);
  assert.ok(fs.readFileSync(api, 'utf8').endsWith('drift\n'));
  await f.run();
  const selected = JSON.parse(fs.readFileSync(f.file));
  selected.packages[0].peers = { sentinel: 'different' };
  fs.writeFileSync(f.file, JSON.stringify(selected));
  await assert.rejects(f.run(true), /source-derived fields/);
});
test('rejects divergent old package source and non-ancestor publication gitHead', async (t) => {
  const f = fixture(t);
  f.write(
    f.root,
    'packages/sdk/src/actions/sample.ts',
    '/** Changed. */ export function prepare() { return 4; }',
  );
  f.git('add', '.');
  f.git('commit', '-qm', 'changed unpublished package');
  f.manifest.source.commit = f.git('rev-parse', 'HEAD');
  fs.writeFileSync(f.file, JSON.stringify(f.manifest));
  await assert.rejects(f.run(), /Partial-release provenance differs/);
  f.manifest.packages[0].registry.gitHead = 'f'.repeat(40);
  fs.writeFileSync(f.file, JSON.stringify(f.manifest));
  await assert.rejects(f.run(), /Partial-release provenance differs/);
});
test('requires clean source checkout and exact HEAD, even when trees could match', async (t) => {
  const f = fixture(t);
  f.write(f.root, 'untracked.txt', 'dirty');
  await assert.rejects(f.run(), /clean source checkout/);
  fs.unlinkSync(path.join(f.root, 'untracked.txt'));
  f.manifest.source.commit = f.previous;
  fs.writeFileSync(f.file, JSON.stringify(f.manifest));
  await assert.rejects(f.run(), /Source does not match manifest/);
});
