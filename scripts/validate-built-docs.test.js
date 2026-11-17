'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { versions } = require('../docs-versions.config');
const { readDocs } = require('./lib/docs-tree');
const {
  BANNER_TEXT,
  assertDocHtml,
  validateNoscript,
  validateSitemap,
  validateCollisions,
  routeFile,
  run,
} = require('./validate-built-docs');
const v1 = versions.v1.routeBase;
const v2 = versions.current.routeBase;
const doc = { id: 'community/index' };
const banner = `<div class="theme-doc-version-banner alert alert--warning">You're reading the V1 docs. They cover the first generation of Intuition: the <a href="https://github.com/0xIntuition/intuition-ts">intuition-ts</a> packages and the <a href="https://github.com/0xIntuition/intuition-rs">intuition-rs</a> services. New development happens in V2. <a href="${v2}/community">Open the V2 docs</a></div>`;
const htmlV1 = `<meta name="robots" content="noindex, nofollow"><span class="theme-doc-version-badge">Version: V1</span>${banner}<article>Frozen docs</article>`;
const htmlV2 = `<span class="theme-doc-version-badge">Version: V2</span><div class="theme-doc-markdown"><header><h1>Get help</h1></header><div><p>Useful body.</p></div></div><footer><a href="${v1}/graphql-api/overview">GraphQL API (V1)</a></footer>`;
test('built assertions separate permitted V1 chrome from V2 body text', () => {
  assert.equal(BANNER_TEXT.includes('not supported'), false);
  assert.deepEqual(
    assertDocHtml(htmlV1, {
      version: versions.v1,
      doc,
      target: `${v2}/community`,
    }),
    [],
  );
  assert.deepEqual(
    assertDocHtml(htmlV2, { version: versions.current, doc }),
    [],
  );
});
test('built package metadata is exact and directly follows the native header', () => {
  const manifest = require('../static/intuition-release.json');
  const page = {
    id: 'reference/packages/iid',
    frontMatter: { packages: ['@0xintuition/iid'] },
  };
  const strip =
    '<p data-applies-to="V2">Applies to V2 · <code>@0xintuition/iid</code> 0.1.0</p>';
  const html = htmlV2.replace('</header>', `</header>${strip}`);
  const options = { version: versions.current, doc: page, manifest };
  assert.deepEqual(assertDocHtml(html, options), []);
  assert.match(
    assertDocHtml(html.replace(strip, `<p>Preface</p>${strip}`), options).join(
      '\n',
    ),
    /first body element/,
  );
  assert.match(
    assertDocHtml(html.replace('0.1.0', '0.0.1'), options).join('\n'),
    /differ from the manifest/,
  );
  assert.match(
    assertDocHtml(html, {
      ...options,
      manifest: { ...manifest, status: 'published-alpha' },
    }).join('\n'),
    /release status/,
  );
  assert.deepEqual(
    assertDocHtml(html.replace('0.1.0</p>', '0.1.0 · pre-release</p>'), {
      ...options,
      manifest: { ...manifest, status: 'published-alpha' },
    }),
    [],
  );
  assert.match(
    assertDocHtml(html, { ...options, doc }).join('\n'),
    /without packages/,
  );
});

test('built SDK API warning follows metadata before all generated declarations', () => {
  const manifest = require('../static/intuition-release.json');
  const strip =
    '<p data-applies-to="V2">Applies to V2 · <code>@0xintuition/sdk</code> 4.0.0</p>';
  const warning =
    '<p>This client calls the hosted V1 GraphQL API and is not a V2 read path; see <a href="/docs/build/read-with-sdk">The SDK read client</a>.</p>';
  const html = htmlV2.replace('</header>', `</header>${strip}${warning}`);
  const options = {
    version: versions.current,
    doc: {
      id: 'reference/sdk/api',
      frontMatter: { packages: ['@0xintuition/sdk'] },
    },
    manifest,
  };
  assert.deepEqual(assertDocHtml(html, options), []);
  assert.match(
    assertDocHtml(
      html.replace(warning, `<h2>API</h2>${warning}`),
      options,
    ).join('\n'),
    /immediately follow/,
  );
  assert.match(
    assertDocHtml(
      html.replace('Useful body.', '/api/iids/example/atoms'),
      options,
    ).join('\n'),
    /M-7/,
  );
});
test('AC-3/4/17 rejects wrong badges, indexing, edit links, banner copy and target', () => {
  for (const html of [
    htmlV1.replace('Version: V1', 'Version: V2'),
    htmlV1.replace('noindex, nofollow', 'index, follow'),
    `${htmlV1}<a href="/edit">Edit this page</a>`,
    htmlV1.replace('New development', 'Unsupported. New development'),
    htmlV1.replace(`${v2}/community`, v2),
    htmlV1.replace('intuition-rs', 'other-repo'),
  ])
    assert.ok(
      assertDocHtml(html, {
        version: versions.v1,
        doc,
        target: `${v2}/community`,
      }).length,
    );
  assert.ok(
    assertDocHtml(htmlV2 + banner, { version: versions.current, doc }).length,
  );
});
test('AC-10/26/27 rejects unlabelled V1 chrome and forbidden page-body links', () => {
  assert.match(
    assertDocHtml(htmlV2.replace('GraphQL API (V1)', 'GraphQL API'), {
      version: versions.current,
      doc,
    }).join('\n'),
    /unlabelled/,
  );
  assert.match(
    assertDocHtml(htmlV2.replace('Useful body.', 'GraphQL data'), {
      version: versions.current,
      doc,
    }).join('\n'),
    /GraphQL/,
  );
  assert.match(
    assertDocHtml(
      htmlV2.replace(
        'Useful body.',
        `<a href="${v1}/experimental-applications/mcp-server">Server</a>`,
      ),
      { version: versions.current, doc },
    ).join('\n'),
    /MCP body/,
  );
  assert.match(
    assertDocHtml(
      htmlV2.replace(
        'Useful body.',
        `<a href="${v1}/graphql-api/queries">Read</a>`,
      ),
      { version: versions.current, doc },
    ).join('\n'),
    /GraphQL body/,
  );
});
test('sitemap excludes every V1 route and includes every shipped V2 doc', () => {
  const xml = `<urlset><url><loc>https://docs.intuition.systems${v2}</loc></url></urlset>`;
  assert.deepEqual(validateSitemap(xml, [v2]), []);
  assert.ok(validateSitemap(xml, [v2, `${v2}/community`]).length);
  assert.ok(validateSitemap(xml.replace(v2, v1), [v2]).length);
});
test('noscript requires the shipped landings and resolving version/llms discovery links', () => {
  const required = [
    v1,
    '/llms.txt',
    '/llms-full.txt',
    `${v1}/llms.txt`,
    `${v2}/community`,
  ];
  const html = `<noscript>${required.map((route) => `<a href="${route}">Docs</a>`).join('')}</noscript>`;
  assert.deepEqual(
    validateNoscript(html, [`${v2}/community`], (route) =>
      required.includes(route),
    ),
    [],
  );
  assert.ok(
    validateNoscript(
      html.replace(`${v2}/community`, `${v2}/future`),
      [`${v2}/community`],
      (route) => required.includes(route),
    ).length,
  );
});
test('redirect sources may not collide with a live page or each other', () => {
  assert.deepEqual(
    validateCollisions([{ path: v2 }], [], () => undefined),
    [],
  );
  assert.ok(
    validateCollisions([{ path: v2 }], [{ from: v2, to: v1 }], () => undefined)
      .length,
  );
  assert.ok(
    validateCollisions(
      [],
      [
        { from: '/old', to: v2 },
        { from: '/old', to: v1 },
      ],
      () => undefined,
    ).length,
  );
});

test('native trailing-slash metadata resolves canonical HTML, sitemap, banners and redirects', (t) => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'built-docs-native-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const write = (relative, content) => {
    const file = path.join(root, relative);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, content);
  };
  const source = readDocs(path.resolve(__dirname, '..'), versions.current);
  for (const page of source)
    write(`${versions.current.docsDir}/${page.relativePath}`, page.content);
  write(
    'scripts/v2-launch-routes.txt',
    fs.readFileSync(path.join(__dirname, 'v2-launch-routes.txt')),
  );
  const pairs = require('../src/data/version-equivalents.json');
  write('src/data/version-equivalents.json', JSON.stringify(pairs));
  // These are native Docusaurus metadata paths, before trailingSlash:false is
  // applied to emitted HTML filenames and hrefs.
  const currentDocs = [
    { id: 'index', path: '/docs/' },
    { id: 'agents/skills', path: '/docs/agents/skills' },
    { id: 'community/index', path: '/docs/community/' },
  ];
  const oldDocs = [
    { id: 'index', path: '/docs/v1/' },
    {
      id: 'getting-started/ai-skills',
      path: '/docs/v1/getting-started/ai-skills',
    },
    {
      id: 'resources/community-and-support',
      path: '/docs/v1/resources/community-and-support',
    },
    { id: 'resources/index', path: '/docs/v1/resources/' },
  ];
  write(
    '.docusaurus/globalData.json',
    JSON.stringify({
      'docusaurus-plugin-content-docs': {
        _data: {
          versions: [
            { name: 'current', docs: currentDocs },
            { name: 'v1', docs: oldDocs },
          ],
        },
      },
    }),
  );
  for (const page of source) {
    write(
      `build${page.route}.html`,
      `${htmlV2}<a href="https://github.com/0xIntuition/intuition-docs/tree/main/${versions.current.docsDir}/${page.relativePath}">Edit this page</a>`,
    );
  }
  for (const page of oldDocs) {
    const paired = pairs.pairs.find((pair) => pair.v1 === page.id);
    const target = source.find((item) => item.id === paired?.v2)?.route || v2;
    write(
      `build${page.path.replace(/\/$/, '')}.html`,
      htmlV1.replace(`${v2}/community`, target),
    );
  }
  const discovery = [
    v1,
    '/llms.txt',
    '/llms-full.txt',
    `${v1}/llms.txt`,
    `${v2}/community`,
  ];
  write(
    'build/index.html',
    `<noscript>${discovery.map((route) => `<a href="${route}">Docs</a>`).join('')}</noscript>`,
  );
  for (const route of discovery.filter((route) => route.endsWith('.txt')))
    write(`build${route}`, 'Agent bundle');
  write(
    'build/sitemap.xml',
    `<urlset>${source.map((page) => `<url><loc>https://docs.intuition.systems${page.route}</loc></url>`).join('')}</urlset>`,
  );
  assert.equal(
    routeFile(path.join(root, 'build'), '/docs/'),
    path.join(root, 'build/docs.html'),
  );
  assert.deepEqual(run({ root, phase: 1 }).errors, []);
  assert.deepEqual(
    validateSitemap(
      '<urlset><loc>https://docs.intuition.systems/docs/</loc></urlset>',
      ['/docs/'],
    ),
    [],
  );
  assert.deepEqual(
    assertDocHtml(htmlV1, {
      version: versions.v1,
      doc,
      target: `${v2}/community/`,
    }),
    [],
  );
  assert.match(
    validateCollisions(
      currentDocs,
      [{ from: '/docs/community/', to: '/elsewhere' }],
      () => undefined,
    ).join('\n'),
    /collides/,
  );
  assert.match(
    validateCollisions(
      [],
      [
        { from: '/old', to: v2 },
        { from: '/old/', to: v1 },
      ],
      () => undefined,
    ).join('\n'),
    /Duplicate/,
  );
  const communityFile = path.join(root, 'build/docs/community.html');
  fs.writeFileSync(
    communityFile,
    fs
      .readFileSync(communityFile, 'utf8')
      .replace('docs/_data/community/index.md', ''),
  );
  assert.match(
    run({ root, phase: 1 }).errors.join('\n'),
    /edit link must point to this page source/,
  );
});
