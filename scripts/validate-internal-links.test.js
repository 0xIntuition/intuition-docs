'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { run } = require('./validate-internal-links');
test('Markdown URLs resolve only for authored documents, including the home route', (t) => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'markdown-links-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  for (const entry of [
    'docs/_data/index.md',
    '_data_versioned_docs/version-v1/index.md',
    '_data_versioned_docs/version-v1/renamed.md',
    'static/docs/icon.png',
  ]) {
    const file = path.join(root, entry);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, 'Page');
  }
  const cases = [
    '/docs.md#intro',
    '/docs/v1.md?q=one',
    'https://docs.intuition.systems/docs/v1/renamed.md?q=0#x',
    'https://elsewhere.test/docs/missing.md',
    '/docs/icon.png',
  ];
  fs.writeFileSync(
    path.join(root, 'index.txt'),
    cases.map((url) => `[Page](${url})`).join('\n'),
  );
  assert.deepEqual(run({ root, files: ['index.txt'] }).errors, []);
  fs.appendFileSync(
    path.join(root, 'index.txt'),
    '\n[Missing](/docs/absent.md?x#y)',
  );
  assert.deepEqual(run({ root, files: ['index.txt'] }).errors, [
    'index.txt:6 → /docs/absent.md',
  ]);
});
