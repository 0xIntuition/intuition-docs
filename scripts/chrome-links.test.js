'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { versions } = require('../docs-versions.config');
const { readDocs, walkFiles } = require('./lib/docs-tree');
const { checkContent } = require('./codemods/v1-prefix-links');
const ROOT = path.resolve(__dirname, '..');
const initialRoutes = ['/docs', '/docs/agents/skills', '/docs/community'];
const initialLinks = [
  {
    name: 'Architecture (V1)',
    href: '/docs/v1/intuition-concepts/architecture',
  },
  { name: 'Primitives (V1)', href: '/docs/v1/intuition-concepts/primitives' },
  { name: 'Smart Contracts (V1)', href: '/docs/v1/intuition-smart-contracts' },
  { name: 'GraphQL API (V1)', href: '/docs/v1/graphql-api/overview' },
  { name: 'SDK (V1)', href: '/docs/v1/intuition-sdk/installation-and-setup' },
  { name: 'AI Integration', href: '/docs/agents/skills' },
];

test('footer preserves all six positions and exact initial shipped destinations', async () => {
  const { getDeveloperLinks } = await import(
    '../src/components/homepage/developerLinks.mjs'
  );
  assert.deepEqual(getDeveloperLinks(initialRoutes), initialLinks);
  const v1Routes = new Set(readDocs(ROOT, versions.v1).map((doc) => doc.route));
  for (const { href } of initialLinks.slice(0, 5))
    assert.ok(v1Routes.has(href), href);
  const footer = fs.readFileSync(
    path.join(ROOT, 'src/components/homepage/HomeFooter.jsx'),
    'utf8',
  );
  assert.match(footer, /useVersions\('_data'\)/);
  assert.match(footer, /getDeveloperLinks\(\s*currentVersion\?\.docs\.map/);
});

test('footer preferences follow actual shipped routes and survive route removal', async () => {
  const { getDeveloperLinks } = await import(
    '../src/components/homepage/developerLinks.mjs'
  );
  const routes = [
    ...initialRoutes,
    '/docs/get-started/how-it-fits',
    '/docs/concepts',
    '/docs/reference/packages/protocol',
    '/docs/reference/packages/sdk',
    '/docs/agents',
  ];
  assert.deepEqual(getDeveloperLinks(routes), [
    { name: 'Architecture', href: '/docs/get-started/how-it-fits' },
    { name: 'Primitives', href: '/docs/concepts' },
    { name: 'Smart Contracts', href: '/docs/reference/packages/protocol' },
    initialLinks[3],
    { name: 'SDK', href: '/docs/reference/packages/sdk' },
    { name: 'AI Integration', href: '/docs/agents' },
  ]);
  assert.deepEqual(
    getDeveloperLinks([...routes, '/docs/reference/contracts'])[2],
    { name: 'Smart Contracts', href: '/docs/reference/contracts' },
  );
  assert.deepEqual(getDeveloperLinks(initialRoutes), initialLinks);
});

test('footer recognizes native trailing-slash landings and preserves fallback preferences', async () => {
  const { getDeveloperLinks } = await import(
    '../src/components/homepage/developerLinks.mjs'
  );
  const routes = [
    '/docs/',
    '/docs/agents/skills',
    '/docs/community/',
    '/docs/get-started/how-it-fits',
    '/docs/concepts/',
    '/docs/reference/packages/protocol',
    '/docs/reference/packages/sdk',
    '/docs/agents/',
  ];
  assert.deepEqual(getDeveloperLinks(routes), [
    { name: 'Architecture', href: '/docs/get-started/how-it-fits' },
    { name: 'Primitives', href: '/docs/concepts' },
    { name: 'Smart Contracts', href: '/docs/reference/packages/protocol' },
    initialLinks[3],
    { name: 'SDK', href: '/docs/reference/packages/sdk' },
    { name: 'AI Integration', href: '/docs/agents' },
  ]);
  assert.deepEqual(
    getDeveloperLinks([...routes, '/docs/reference/contracts/'])[2],
    { name: 'Smart Contracts', href: '/docs/reference/contracts' },
  );
  assert.deepEqual(getDeveloperLinks(routes.slice(0, 3)), initialLinks);
});

test('noscript links the four Phase 2 section landings and required version/agent files', () => {
  const source = fs.readFileSync(
    path.join(ROOT, 'src/pages/index.jsx'),
    'utf8',
  );
  assert.match(source, /<Redirect to="\/docs" \/>/);
  const noscript = source.match(/<noscript>[\s\S]*?<\/noscript>/)[0];
  assert.deepEqual(
    [...noscript.matchAll(/href="([^"]+)"/g)].map((match) => match[1]),
    [
      '/docs/agents',
      '/docs/concepts',
      '/docs/examples',
      '/docs/community',
      '/docs/v1',
      '/llms.txt',
      '/llms-full.txt',
      '/docs/v1/llms.txt',
    ],
  );
});

test('actual current tree drives five V2 footer links and top-level noscript coverage', async () => {
  const docs = readDocs(ROOT, versions.current);
  const { getDeveloperLinks } = await import(
    '../src/components/homepage/developerLinks.mjs'
  );
  const routes = docs.map((doc) => doc.route);
  const allRoutes = new Set([
    ...routes,
    ...readDocs(ROOT, versions.v1).map((doc) => doc.route),
  ]);
  const links = getDeveloperLinks(routes);
  assert.equal(links.filter(({ name }) => !name.endsWith(' (V1)')).length, 5);
  assert.deepEqual(links[2], {
    name: 'Smart Contracts',
    href: '/docs/reference/packages/protocol',
  });
  assert.deepEqual(links[3], initialLinks[3]);
  for (const { href } of links) assert.ok(allRoutes.has(href), href);
  const source = fs.readFileSync(
    path.join(ROOT, 'src/pages/index.jsx'),
    'utf8',
  );
  const noscript = source.match(/<noscript>[\s\S]*?<\/noscript>/)[0];
  const landings = docs.filter((doc) => /^[^/]+\/index$/.test(doc.id));
  for (const { route } of landings)
    assert.ok(noscript.includes(`href="${route}"`), route);
  for (const [, href] of noscript.matchAll(/href="([^"?#]+)"/g)) {
    if (href.startsWith(versions.current.routeBase) && !href.endsWith('.txt'))
      assert.ok(allRoutes.has(href), href);
  }
});

test('all src docs destinations pass the shared codemod matcher', (t) => {
  const launchFile = path.join(ROOT, 'scripts/v2-launch-routes.txt');
  if (!fs.existsSync(launchFile))
    return t.skip('Dependency: Lane D supplies the launch-route allowlist.');
  const launchRoutes = new Set(
    fs
      .readFileSync(launchFile, 'utf8')
      .split(/\r?\n/)
      .filter((line) => line && !line.startsWith('#'))
      .map((line) => line.split(/\s+/)[0]),
  );
  const failures = [];
  for (const file of walkFiles(path.join(ROOT, 'src')).filter((file) =>
    /\.(?:[cm]?[jt]sx?|html)$/.test(file),
  )) {
    const relative = path.relative(ROOT, file).replace(/\\/g, '/');
    for (const { target } of checkContent(fs.readFileSync(file, 'utf8'), {
      version: 'src',
      launchRoutes,
      excludeNoscript: relative === 'src/pages/index.jsx',
    }))
      failures.push(`${relative}: ${target}`);
  }
  assert.deepEqual(failures, []);
});
