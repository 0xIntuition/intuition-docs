'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { BASE_URL, INDEX_DIRECTORY_INTRO } = require('./generate-llms-full');
const {
  extractIndexRoutes,
  compareRouteSets,
  extractCuratedTargets,
} = require('./validate-llms-coverage');

test('index coverage requires Markdown exports, normalizes query/fragment and rejects a nonexistent page', () => {
  const directory = (target) =>
    `# Docs\n\n${INDEX_DIRECTORY_INTRO}\n\n- [Page](${target})\n`;
  assert.deepEqual(
    extractIndexRoutes(directory(BASE_URL + '/docs.md?version=2#start')),
    ['/docs'],
  );
  assert.throws(
    () => extractIndexRoutes(directory(BASE_URL + '/docs')),
    /Markdown directory/,
  );
  assert.throws(
    () => extractIndexRoutes(directory('https://elsewhere.test/docs.md')),
    /Markdown directory/,
  );
  assert.throws(
    () =>
      compareRouteSets(
        'index',
        ['/docs'],
        extractIndexRoutes(directory(BASE_URL + '/docs/gone.md')),
      ),
    /missing: \/docs\nextra: \/docs\/gone/,
  );
  assert.deepEqual(
    extractCuratedTargets(
      '[A](/docs.md#start) [B](https://outside.test/docs.md) [C](/llms.txt)',
    ),
    ['/docs.md', '/llms.txt'],
  );
});
