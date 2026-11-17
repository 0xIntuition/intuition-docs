'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const yaml = require('js-yaml');
const plugin = require('../plugins/markdown-export-plugin.cjs');
const { versions } = require('../docs-versions.config');
const { readFrontMatter } = require('./lib/markdown-fences');
const { BASE_URL } = require('./generate-llms-full');

function fixture(t) {
  const siteDir = fs.mkdtempSync(path.join(os.tmpdir(), 'markdown-export-'));
  t.after(() => fs.rmSync(siteDir, { recursive: true, force: true }));
  const outDir = path.join(siteDir, 'build');
  const write = (name, text) => {
    const file = path.join(siteDir, name);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, text);
  };
  const title = 'Quoted: "解析" & <!tag>\n---\nversion: fake';
  const description = 'one\ntwo: [untrusted]';
  const pkg = '@0xintuition/iid';
  write(
    'static/intuition-release.json',
    JSON.stringify({
      status: 'published',
      packages: [{ name: pkg, version: '0.1.0' }],
    }),
  );
  const native = (version, id, file, permalink, front) => {
    const source = versions[version].docsDir + '/' + file;
    write(
      source,
      '---\n' +
        yaml.dump(front) +
        '---\n\n| Name | Value |\n| --- | --- |\n| sample | 42 |\n\n```ts\nconst x = "<AppliesTo />";\n```\n',
    );
    write(
      'build' + permalink.replace(/\/$/, '') + '.html',
      '<html><head><link rel="canonical" href="/"></head><body>Example</body></html>',
    );
    return {
      version,
      title,
      description,
      id,
      permalink,
      source: '@site/' + source,
    };
  };
  const current = [
    native('current', 'index', 'home.mdx', '/docs/', {
      kind: 'landing',
      reader: ['app'],
      packages: [],
    }),
    native(
      'current',
      'concepts/iid',
      'renamed/native-source.md',
      '/docs/concepts/iid',
      {
        kind: 'concept',
        reader: ['agent'],
        packages: [pkg],
        depends_on: ['identifiers'],
      },
    ),
  ];
  const v1 = [native('v1', 'index', 'README.md', '/docs/v1/', {})];
  const loadedVersions = [
    { versionName: 'v1', docs: v1 },
    { versionName: 'current', docs: current },
  ];
  const globals = loadedVersions.map((item) => ({
    name: item.versionName,
    docs: item.docs.map((doc) => ({ id: doc.id, path: doc.permalink })),
  }));
  globals[0].docs.push(
    { id: '/category/first', path: '/docs/v1/category/first' },
    { id: '/category/second', path: '/docs/v1/category/second' },
  );
  write(
    '.docusaurus/globalData.json',
    JSON.stringify({
      'docusaurus-plugin-content-docs': { _data: { versions: globals } },
    }),
  );
  return {
    args: {
      siteDir,
      outDir,
      loadedVersions,
      globalData: {
        'docusaurus-plugin-content-docs': { _data: { versions: globals } },
      },
      siteUrl: BASE_URL,
    },
    write,
    current,
    title,
    description,
    globals,
  };
}

test('native lifecycle exports both versions, skips generated indexes and preserves exact data on a second postBuild', (t) => {
  const { args, title, description } = fixture(t);
  const instance = plugin();
  instance.allContentLoaded({
    allContent: {
      'docusaurus-plugin-content-docs': {
        _data: { loadedVersions: args.loadedVersions },
      },
    },
  });
  const build = () =>
    instance.postBuild({
      siteDir: args.siteDir,
      outDir: args.outDir,
      generatedFilesDir: path.join(args.siteDir, '.docusaurus'),
      siteConfig: { url: BASE_URL },
    });
  build();
  const outputs = [
    'docs.md',
    'docs/concepts/iid.md',
    'docs/v1.md',
    'docs.html',
    'docs/concepts/iid.html',
    'docs/v1.html',
  ];
  const read = () =>
    outputs.map((file) =>
      fs.readFileSync(path.join(args.outDir, file), 'utf8'),
    );
  const first = read();
  build();
  assert.deepEqual(read(), first);
  assert.equal(
    fs.existsSync(path.join(args.outDir, 'docs/v1/category')),
    false,
  );
  const url = BASE_URL + '/docs/concepts/iid';
  assert.deepEqual(readFrontMatter(first[1]), {
    title,
    description,
    url,
    markdown_url: url + '.md',
    version: 'V2',
    llms_index: BASE_URL + '/llms.txt',
    kind: 'concept',
    reader: ['agent'],
    packages: ['@0xintuition/iid@0.1.0'],
    depends_on: [BASE_URL + '/docs/concepts/identifiers.md'],
  });
  assert.equal(readFrontMatter(first[0]).markdown_url, BASE_URL + '/docs.md');
  assert.deepEqual(
    Object.keys(readFrontMatter(first[2])).sort(),
    [
      'title',
      'description',
      'url',
      'markdown_url',
      'version',
      'llms_index',
    ].sort(),
  );
  assert.equal(
    readFrontMatter(first[2]).llms_index,
    BASE_URL + '/docs/v1/llms.txt',
  );
  for (const markdown of first.slice(0, 3)) {
    assert.ok(markdown.includes('| sample | 42 |'));
    assert.ok(markdown.includes('```ts\nconst x = "<AppliesTo />";\n```'));
  }
  for (const html of first.slice(3))
    assert.equal(html.match(/type="text\/markdown"/g)?.length, 1);
});

test('alternate is escaped in head, including replacement-string metacharacters', () => {
  const html =
    '<head><link type=text/markdown rel=alternate href=old><link rel="canonical" href="/"></head><body>Keep body</body>';
  const result = plugin.insertAlternate(
    html,
    'https://example.org/$&/a<>"\'.md',
  );
  assert.equal(
    result,
    '<head><link rel="canonical" href="/"><link rel="alternate" type="text/markdown" href="https://example.org/$&amp;/a&lt;&gt;&quot;&#39;.md"></head><body>Keep body</body>',
  );
});

test('mismatched, missing and unsafe native sources or colliding outputs fail before writes', (t) => {
  const { args, current, globals, write } = fixture(t);
  const run = () => plugin.exportDocuments(args);
  const authored = current[1].source;
  for (const source of [
    '@site/../outside.md',
    '@site/docs/_data/missing.md',
    'wrong.md',
  ]) {
    current[1].source = source;
    assert.throws(run, /source/);
  }
  current[1].source = current[0].source;
  assert.throws(run, /collision/);
  current[1].source = authored;
  current[1].permalink = '/docs/wrong';
  assert.throws(run, /mismatch/);
  current[1].permalink = globals[1].docs[1].path;
  globals[1].docs.push({ id: 'extra', path: '/docs/extra' });
  assert.throws(run, /count mismatch/);
  globals[1].docs.pop();
  write('static/docs.md', 'asset');
  assert.throws(run, /collides/);
  assert.equal(fs.existsSync(path.join(args.outDir, 'docs.md')), false);
  fs.unlinkSync(path.join(args.siteDir, 'static/docs.md'));
  const outside = path.join(args.siteDir, 'untouched.md');
  fs.symlinkSync(outside, path.join(args.outDir, 'docs.md'));
  assert.throws(run, /linked build output/);
  assert.equal(fs.existsSync(outside), false);
  for (const route of [
    '/docs/../../x',
    '/docs/%2e%2e/x',
    '//evil',
    '/docs/a%2fb',
  ])
    assert.throws(() => plugin.contentRoute(route), /route/);
});

test('Render header configuration targets only root, shallow and nested Markdown exports', () => {
  const config = yaml.load(
    fs.readFileSync(path.join(__dirname, '../render.yaml'), 'utf8'),
  );
  const headers = config.services[0].headers.filter(
    (header) => header.name === 'Content-Type',
  );
  assert.deepEqual(
    headers.map((header) => header.path),
    ['/docs.md', '/docs/*.md', '/docs/**/*.md'],
  );
  assert.ok(
    headers.every((header) => header.value === 'text/markdown; charset=utf-8'),
  );
  // Render's extension patterns distinguish one path segment from deeper paths.
  const matches = (file) =>
    headers.filter(({ path: pattern }) =>
      new RegExp(
        '^' +
          pattern
            .replace(/\./g, '\\.')
            .replace(/\*\*|\*/g, (star) => (star === '**' ? '.+' : '[^/]*')) +
          '$',
      ).test(file),
    ).length;
  for (const file of [
    '/docs.md',
    '/docs/v1.md',
    '/docs/concepts/iid.md',
    '/docs/v1/a/b/c.md',
  ])
    assert.equal(matches(file), 1);
  for (const file of [
    '/docs',
    '/docs.html',
    '/docs/v1/llms.txt',
    '/docs/theme.css',
    '/assets/notes.md',
    '/docs/model.mdx',
  ])
    assert.equal(matches(file), 0);
});

test('native Markdown export retains all six linked Card outcomes on the V2 landing', (t) => {
  const { args, write, current, globals } = fixture(t);
  const body = fs.readFileSync(
    path.join(__dirname, '__fixtures__/validate-v2-structure/example-cards.md'),
    'utf8',
  );
  const { EXAMPLE_ROUTES, EXAMPLES_ROUTE } = require('./lib/example-cards');
  for (const route of [EXAMPLES_ROUTE, ...EXAMPLE_ROUTES]) {
    const id =
      route === EXAMPLES_ROUTE
        ? 'examples/index'
        : route.slice('/docs/'.length);
    const source = versions.current.docsDir + '/' + id + '.md';
    write(
      source,
      '---\nkind: reference\nreader: ["app"]\npackages: []\n---\n\n' +
        (route === EXAMPLES_ROUTE ? body : 'Example.'),
    );
    write('build' + route + '.html', '<head></head><body>Example</body>');
    current.push({
      id,
      source: '@site/' + source,
      version: 'current',
      permalink: route,
      title: 'Example',
      description: 'An example.',
    });
    globals[1].docs.push({ id, path: route });
  }
  plugin.exportDocuments(args);
  const result = fs.readFileSync(
    path.join(args.outDir, 'docs/examples.md'),
    'utf8',
  );
  for (const route of EXAMPLE_ROUTES)
    assert.ok(result.includes('](' + BASE_URL + route + ')'));
  assert.match(result, /Compare suggestions\./);
  assert.doesNotMatch(result, /<Card|examples-grid/);
});
