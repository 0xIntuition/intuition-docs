'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const sidebars = require('../sidebars');
const { versions } = require('../docs-versions.config');
const { readDocs } = require('./lib/docs-tree');
const {
  loadLaunchRoutes,
  validateSidebar,
} = require('./validate-v2-structure');
const root = path.resolve(__dirname, '..');
const docs = readDocs(root, versions.current);
const rows = loadLaunchRoutes(
  fs.readFileSync(path.join(__dirname, 'v2-launch-routes.txt'), 'utf8'),
);

// Adapted from #112's complete-document navigation check. The authored sidebar
// now has a normative phase order and may not generate category index pages.
test('authored navigation covers the exact 61 Phase 2 routes once in launch order', () => {
  assert.deepEqual(Object.keys(sidebars), ['docs']);
  assert.equal(docs.length, 61);
  assert.deepEqual(
    new Set(docs.map((doc) => doc.route)),
    new Set(rows.filter((row) => row.phase <= 2).map((row) => row.route)),
  );
  assert.deepEqual(validateSidebar(sidebars, docs, rows), []);
});

test('only shipped section landings become category links', () => {
  const categories = sidebars.docs.filter((item) => item.type === 'category');
  assert.deepEqual(
    categories.map((item) => item.label),
    [
      'Get started',
      'AI agents',
      'Concepts',
      'Build',
      'Examples',
      'Reference',
      'Intuition Core',
      'Community',
    ],
  );
  assert.deepEqual(
    categories.map((item) => item.link?.id || null),
    [
      'get-started/how-it-fits',
      'agents/index',
      'concepts/index',
      null,
      'examples/index',
      null,
      null,
      'community/index',
    ],
  );
  const collect = (items) =>
    items.flatMap((item) => {
      if (typeof item === 'string') return [item];
      assert.equal(item.type, 'category');
      if (item.link) assert.equal(item.link.type, 'doc');
      return [...(item.link ? [item.link.id] : []), ...collect(item.items)];
    });
  const ids = collect(sidebars.docs);
  assert.equal(ids.length, new Set(ids).size);
  assert.deepEqual([...ids].sort(), docs.map((doc) => doc.id).sort());
});
