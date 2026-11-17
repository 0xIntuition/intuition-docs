'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const equivalents = require('../src/data/version-equivalents.json');
const { versions: config } = require('../docs-versions.config');
const { readDocs } = require('./lib/docs-tree');
const ROOT = path.resolve(__dirname, '..');
const initialPairs = [
  { v1: 'index', v2: 'index' },
  { v1: 'getting-started/ai-skills', v2: 'agents/skills' },
  { v1: 'resources/community-and-support', v2: 'community/index' },
];

function loadSource(file, mocks = {}) {
  const { outputText } = ts.transpileModule(
    fs.readFileSync(path.join(ROOT, file), 'utf8'),
    {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        jsx: ts.JsxEmit.React,
        esModuleInterop: true,
      },
    },
  );
  const result = {};
  new Function('exports', 'require', outputText)(result, (id) => {
    if (Object.hasOwn(mocks, id)) return mocks[id];
    throw new Error(`Unexpected runtime import: ${id}`);
  });
  return result;
}

const { resolveVersionEquivalent } = loadSource(
  'src/theme/versionEquivalents.ts',
);
const versions = [
  {
    name: 'current',
    path: '/docs',
    mainDocId: 'index',
    docs: [
      { id: 'index', path: '/docs' },
      { id: 'agents/skills', path: '/docs/agents/skills' },
      { id: 'community/index', path: '/docs/community' },
    ],
  },
  {
    name: 'v1',
    path: '/docs/v1',
    mainDocId: 'index',
    docs: [
      { id: 'index', path: '/docs/v1' },
      {
        id: 'getting-started/ai-skills',
        path: '/docs/v1/getting-started/ai-skills',
      },
      {
        id: 'resources/community-and-support',
        path: '/docs/v1/resources/community-and-support',
      },
      { id: 'unpaired', path: '/docs/v1/unpaired' },
    ],
  },
];

function resolve(overrides) {
  return resolveVersionEquivalent({
    versions,
    pairs: initialPairs,
    sourceVersion: 'v1',
    targetVersion: 'current',
    search: '?q=atom%20id&lang=en',
    hash: '#section',
    ...overrides,
  });
}

test('initial three seeds resolve in both directions using native doc paths', () => {
  assert.equal(equivalents.schemaVersion, 1);
  for (const pair of initialPairs) {
    assert.deepEqual(
      equivalents.pairs.find((entry) => entry.v1 === pair.v1),
      pair,
    );
    const forward = versions[0].docs.find((doc) => doc.id === pair.v2).path;
    const reverse = versions[1].docs.find((doc) => doc.id === pair.v1).path;
    const suffix =
      '?q=atom%20id&lang=en' + (pair.v1 === pair.v2 ? '#section' : '');
    assert.equal(resolve({ docId: pair.v1 }), forward + suffix);
    assert.equal(
      resolve({
        sourceVersion: 'current',
        targetVersion: 'v1',
        docId: pair.v2,
      }),
      reverse + suffix,
    );
  }
});

test('same-doc navigation retains hash, different-doc and no-doc fallbacks drop it', () => {
  assert.equal(
    resolve({ pairs: [], docId: 'index' }),
    '/docs?q=atom%20id&lang=en#section',
  );
  assert.equal(resolve({ docId: 'unpaired' }), '/docs?q=atom%20id&lang=en');
  assert.equal(resolve({}), '/docs?q=atom%20id&lang=en');
  assert.equal(
    resolve({ sourceVersion: 'current', docId: 'agents/skills' }),
    '/docs/agents/skills?q=atom%20id&lang=en#section',
  );
  assert.equal(
    resolve({ targetVersion: 'v1', docId: 'getting-started/ai-skills' }),
    '/docs/v1/getting-started/ai-skills?q=atom%20id&lang=en#section',
  );
});

test('a missing paired page uses same id then version home; unknown version is rejected', () => {
  const pairs = [
    { v1: 'index', v2: 'missing' },
    { v1: 'unpaired', v2: 'missing' },
  ];
  assert.equal(
    resolve({ pairs, docId: 'index' }),
    '/docs?q=atom%20id&lang=en#section',
  );
  assert.equal(
    resolve({ pairs, docId: 'unpaired' }),
    '/docs?q=atom%20id&lang=en',
  );
  assert.equal(
    resolve({ versions: [{ ...versions[0], docs: [] }] }),
    '/docs?q=atom%20id&lang=en',
  );
  assert.throws(
    () => resolve({ targetVersion: 'missing' }),
    /Unknown target docs version/,
  );
});

test('resolver uses authoritative native paths without deriving routes from ids', () => {
  const changed = structuredClone(versions);
  changed[0].docs[1].path = '/deployed-base/skills';
  assert.equal(
    resolve({ versions: changed, docId: 'getting-started/ai-skills' }),
    '/deployed-base/skills?q=atom%20id&lang=en',
  );
  assert.deepEqual(versions[0].docs[1], {
    id: 'agents/skills',
    path: '/docs/agents/skills',
  });
});

test('seed V1 ids exist in the frozen tree and neither side repeats', () => {
  const v1Ids = new Set(readDocs(ROOT, config.v1).map((doc) => doc.id));
  for (const pair of equivalents.pairs) assert.ok(v1Ids.has(pair.v1), pair.v1);
  for (const key of ['v1', 'v2'])
    assert.equal(
      new Set(equivalents.pairs.map((pair) => pair[key])).size,
      equivalents.pairs.length,
    );
});

function banner(versionName, docId) {
  let preferred;
  const { default: Banner } = loadSource(
    'src/theme/DocVersionBanner/index.tsx',
    {
      react: React,
      clsx: require('clsx'),
      '@docusaurus/Link': ({ to, children, ...props }) =>
        React.createElement('a', { ...props, href: to }, children),
      '@docusaurus/router': {
        useLocation: () => ({ search: '?from=search', hash: '#old-heading' }),
      },
      '@docusaurus/theme-common': {
        ThemeClassNames: {
          docs: { docVersionBanner: 'theme-doc-version-banner' },
        },
      },
      '@docusaurus/plugin-content-docs/client': {
        useDocsVersion: () => ({ version: versionName, pluginId: '_data' }),
        useVersions: () => versions,
        useActiveDocContext: () => ({ activeDoc: { id: docId } }),
        useDocsPreferredVersion: () => ({
          savePreferredVersionName: (name) => {
            preferred = name;
          },
        }),
      },
      '@theme-original/DocVersionBanner': (props) =>
        React.createElement('div', { 'data-original': true, ...props }),
      '@site/src/data/version-equivalents.json': equivalents,
      '../versionEquivalents': { resolveVersionEquivalent },
      './styles.css': {},
    },
  );
  return {
    element: Banner({ className: 'native-class' }),
    preferred: () => preferred,
  };
}

test('V1 banner renders exact repository warning, mapped link and preferred version action', () => {
  const result = banner('v1', 'getting-started/ai-skills');
  const html = renderToStaticMarkup(result.element);
  assert.match(
    html,
    /class="native-class theme-doc-version-banner alert alert--warning margin-bottom--md"/,
  );
  assert.match(html, /href="https:\/\/github.com\/0xIntuition\/intuition-ts"/);
  assert.match(html, /href="https:\/\/github.com\/0xIntuition\/intuition-rs"/);
  assert.match(html, /href="\/docs\/agents\/skills\?from=search"/);
  const text = html.replace(/<[^>]+>/g, '').replace(/&#x27;/g, "'");
  assert.equal(
    text,
    "You're reading the V1 docs. They cover the first generation of Intuition: the intuition-ts packages and the intuition-rs services. New development happens in V2. Open the V2 docs",
  );
  assert.doesNotMatch(html, /unsupported|not supported/i);
  result.element.props.children.at(-1).props.onClick();
  assert.equal(result.preferred(), 'current');
});

test('V1 unpaired banner falls back to home; every other version delegates original props', () => {
  assert.match(
    renderToStaticMarkup(banner('v1', 'unpaired').element),
    /href="\/docs\?from=search"/,
  );
  for (const version of ['current', 'future']) {
    const html = renderToStaticMarkup(banner(version, 'index').element);
    assert.match(html, /data-original="true" class="native-class"/);
    assert.doesNotMatch(html, /theme-doc-version-banner/);
  }
});
