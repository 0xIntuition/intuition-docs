'use strict';
const assert = require('node:assert/strict');
const test = require('node:test');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const {
  inspectText,
  validateManifest,
  checkReleasePins,
  EXAMPLE_PEER_PINS,
} = require('./check-release-pins');
const manifest = require('../static/intuition-release.json');
const cases = require('./__fixtures__/check-release-pins/cases.json');
const page = 'docs/_data/reference/example.md';
for (const fixture of cases)
  test(`rejects ${fixture.name}`, () => {
    assert.match(
      inspectText(fixture.source, page, manifest).errors.join('\n'),
      new RegExp(fixture.error),
    );
  });
test('validates source-mode schema and rejects malformed/release-only identities', () => {
  assert.deepEqual(validateManifest(manifest), []);
  for (const update of [
    { version: 'v1' },
    { releaseNotes: {} },
    { image: 'invented' },
    { sourcePath: 'README.md' },
    { distribution: 'tag' },
    { commit: 'main' },
  ]) {
    const copy = structuredClone(manifest);
    Object.assign(copy.core, update);
    assert.match(validateManifest(copy).join('\n'), /Core source mode/);
  }
  const copy = structuredClone(manifest);
  copy.packages[0].version = '^0.1.0';
  assert.match(validateManifest(copy).join('\n'), /Malformed package/);
});
test('accepts full pinned references with or without paths and clone placeholders', () => {
  const source = [
    `https://github.com/0xIntuition/intuition-core/tree/${manifest.core.commit}`,
    `https://github.com/0xIntuition/intuition-core/blob/${manifest.core.commit}/README.md`,
    `https://github.com/0xIntuition/packages/tree/${manifest.source.commit}`,
    'git clone https://github.com/YOUR_GITHUB_USERNAME/intuition-core.git',
    '@0xintuition/sdk@4.0.0.',
  ].join('\n');
  assert.deepEqual(inspectText(source, page, manifest).errors, []);
});
test('write updates package tokens, bare installs and package refs without altering Core citations', () => {
  const source =
    'npm install @0xintuition/sdk@latest @0xintuition/primitives\nhttps://github.com/0xIntuition/packages/tree/old\n';
  const result = inspectText(source, page, manifest, { write: true });
  assert.deepEqual(result.errors, []);
  assert.match(result.text, /sdk@4\.0\.0 @0xintuition\/primitives@0\.1\.0/);
  assert.ok(result.text.includes(manifest.source.commit));
  const core = inspectText(
    'https://github.com/0xIntuition/intuition-core/tree/old',
    page,
    manifest,
    { write: true },
  );
  assert.ok(core.errors.length);
  assert.match(core.text, /tree\/old/);
});
test('scoped hazard and migration exceptions do not exempt Core distribution assertions', () => {
  const hazard =
    '<!-- release-pins: hazard -->\n@0xintuition/sdk@alpha\n<!-- /release-pins -->\n';
  assert.deepEqual(
    inspectText(hazard, 'docs/_data/build/install.md', manifest).errors,
    [],
  );
  assert.ok(
    inspectText(
      hazard.replace('@0xintuition/sdk@alpha', 'IMAGE_TAG=anything'),
      'docs/_data/build/install.md',
      manifest,
    ).errors.length,
  );
  assert.ok(
    inspectText(
      hazard.replace(
        '<!-- /release-pins -->',
        '<!-- /release-pins --> npm install @0xintuition/sdk@latest',
      ),
      'docs/_data/build/install.md',
      manifest,
    ).errors.length,
  );
  const legacy =
    '<!-- docs-typecheck: v1 -->\n```ts\n// @0xintuition/sdk@3.0.1\n```\n';
  assert.deepEqual(
    inspectText(legacy, 'docs/_data/get-started/migrate-from-v1.md', manifest)
      .errors,
    [],
  );
  assert.ok(
    inspectText(
      legacy + 'npm i @0xintuition/sdk@3.0.1',
      'docs/_data/get-started/migrate-from-v1.md',
      manifest,
    ).errors.length,
  );
});
test('generated rows allow naked pins but token errors still fail', () => {
  const source =
    '{/* generated:start release-pins */}\n| @0xintuition/sdk | 4.0.0 |\n{/* generated:end */}\n';
  assert.deepEqual(inspectText(source, page, manifest).errors, []);
  assert.ok(
    inspectText(source.replace('sdk |', 'sdk@3.0.1 |'), page, manifest).errors
      .length,
  );
});
function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'release-pins-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const write = (file, text) => {
    fs.mkdirSync(path.dirname(path.join(root, file)), { recursive: true });
    fs.writeFileSync(
      path.join(root, file),
      typeof text === 'string' ? text : JSON.stringify(text),
    );
  };
  execFileSync('git', ['init', '-q', root]);
  write('static/intuition-release.json', manifest);
  write('docs/_data/index.md', 'No package install here.\n');
  write('examples/v2/package.json', {
    private: true,
    type: 'module',
    dependencies: {
      ...Object.fromEntries(
        manifest.packages.map((pkg) => [pkg.name, pkg.version]),
      ),
      ...EXAMPLE_PEER_PINS,
    },
  });
  return { root, write };
}
test('checks only tracked examples and excludes node_modules even when tracked', (t) => {
  const { root, write } = fixture(t);
  write('examples/v2/untracked.md', 'npm install @0xintuition/sdk@latest');
  write(
    'examples/v2/node_modules/readme.md',
    'npm install @0xintuition/sdk@latest',
  );
  execFileSync('git', [
    '-C',
    root,
    'add',
    'examples/v2/node_modules/readme.md',
  ]);
  assert.deepEqual(checkReleasePins({ root }).errors, []);
  write('examples/v2/tracked.md', 'npm install @0xintuition/sdk@latest');
  execFileSync('git', ['-C', root, 'add', 'examples/v2/tracked.md']);
  assert.match(checkReleasePins({ root }).errors.join('\n'), /exact/);
});
test('rejects caret example dependencies and --write repairs manifest packages', (t) => {
  const { root } = fixture(t),
    file = path.join(root, 'examples/v2/package.json');
  const pkg = JSON.parse(fs.readFileSync(file));
  pkg.dependencies['@0xintuition/sdk'] = '^4.0.0';
  fs.writeFileSync(file, JSON.stringify(pkg));
  assert.match(checkReleasePins({ root }).errors.join('\n'), /exact 4\.0\.0/);
  assert.deepEqual(checkReleasePins({ root, write: true }).errors, []);
  assert.deepEqual(checkReleasePins({ root }).errors, []);
});

test('checks all generated V2 llms heads without scanning cleaned page exceptions', (t) => {
  const { root, write } = fixture(t);
  write(
    'static/llms-full.txt',
    '# Intuition Docs (V2)\n\n@0xintuition/sdk@latest\n\n# Page body\n@0xintuition/sdk@alpha\n',
  );
  assert.match(
    checkReleasePins({ root }).errors.join('\n'),
    /static\/llms-full.txt:3.*exact/,
  );
  assert.deepEqual(checkReleasePins({ root, write: true }).errors, []);
  const source = fs.readFileSync(
    path.join(root, 'static/llms-full.txt'),
    'utf8',
  );
  assert.match(source, /sdk@4\.0\.0/);
  assert.match(source, /sdk@alpha/);
  assert.deepEqual(checkReleasePins({ root }).errors, []);
});
