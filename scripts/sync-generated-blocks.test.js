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
