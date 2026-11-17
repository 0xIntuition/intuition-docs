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
const initialFooterLinks = [
  ['Architecture (V1)', `${v1}/intuition-concepts/architecture`],
  ['Primitives (V1)', `${v1}/intuition-concepts/primitives`],
  ['Smart Contracts (V1)', `${v1}/intuition-smart-contracts`],
  ['GraphQL API (V1)', `${v1}/graphql-api/overview`],
  ['SDK (V1)', `${v1}/intuition-sdk/installation-and-setup`],
  ['AI Integration', `${v2}/agents/skills`],
];
function footer(links) {
  return `<footer><div><h3>Developers</h3><div>${links.map(([name, href]) => `<a href="${href}">${name}</a>`).join('')}</div></div></footer>`;
}
const banner = `<div class="theme-doc-version-banner alert alert--warning">You're reading the V1 docs. They cover the first generation of Intuition: the <a href="https://github.com/0xIntuition/intuition-ts">intuition-ts</a> packages and the <a href="https://github.com/0xIntuition/intuition-rs">intuition-rs</a> services. New development happens in V2. <a href="${v2}/community">Open the V2 docs</a></div>`;
const htmlV1 = `<meta name="robots" content="noindex, nofollow"><span class="theme-doc-version-badge">Version: V1</span>${banner}<article>Frozen docs</article>${footer(initialFooterLinks)}`;
const htmlV2 = `<span class="theme-doc-version-badge">Version: V2</span><div class="theme-doc-markdown"><header><h1>Get help</h1></header><div><p>Useful body.</p></div></div>${footer(initialFooterLinks)}`;
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

test('built SDK landing scans visible client text while allowing its API navigation href', () => {
  const manifest = require('../static/intuition-release.json');
  const strip =
    '<p data-applies-to="V2">Applies to V2 · <code>@0xintuition/sdk</code> 4.0.0</p>';
  const link = '<a href="/docs/reference/sdk/api">API client</a>';
  const html = htmlV2
    .replace('</header>', `</header>${strip}`)
    .replace('Useful body.', link);
  const options = {
    version: versions.current,
    doc: {
      id: 'reference/sdk/index',
      frontMatter: { packages: ['@0xintuition/sdk'] },
    },
    manifest,
  };
  assert.deepEqual(assertDocHtml(html, options), []);
  for (const content of [
    '<a href="/docs/reference/sdk/api">@0xintuition/sdk/api</a>',
    `${link}<code>@0xintuition/sdk/api</code>`,
    `${link}<pre><code>createIntuitionApiClient({});</code></pre>`,
    `${link}<code>getIntuitionApiUrl('mainnet')</code>`,
    `${link}<p>https://mainnet.intuition.sh/v1/graphql</p>`,
  ])
    assert.match(
      assertDocHtml(html.replace(link, content), options).join('\n'),
      /hosted read-client/,
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
test('AC-10 validates actual footer links against shipped routes in both versions', () => {
  const initialRoutes = [`${v2}/`, `${v2}/agents/skills`, `${v2}/community/`];
  const phase2Routes = [
    ...initialRoutes,
    `${v2}/get-started/how-it-fits`,
    `${v2}/concepts/`,
    `${v2}/reference/packages/protocol`,
    `${v2}/reference/packages/sdk`,
    `${v2}/agents/`,
  ];
  const phase2Links = [
    ['Architecture', `${v2}/get-started/how-it-fits`],
    ['Primitives', `${v2}/concepts`],
    ['Smart Contracts', `${v2}/reference/packages/protocol`],
    initialFooterLinks[3],
    ['SDK', `${v2}/reference/packages/sdk`],
    ['AI Integration', `${v2}/agents`],
  ];
  for (const [version, original] of [
    [versions.current, htmlV2],
    [versions.v1, htmlV1],
  ]) {
    const options = {
      version,
      doc,
      target: `${v2}/community`,
      shippedRoutes: initialRoutes,
    };
    assert.deepEqual(assertDocHtml(original, options), []);
    const html = original.replace(
      footer(initialFooterLinks),
      footer(phase2Links),
    );
    assert.deepEqual(
      assertDocHtml(html, { ...options, shippedRoutes: phase2Routes }),
      [],
    );
    const staleLinks = phase2Links.map((link, index) =>
      [1, 5].includes(index) ? initialFooterLinks[index] : link,
    );
    assert.match(
      assertDocHtml(
        original.replace(footer(initialFooterLinks), footer(staleLinks)),
        {
          ...options,
          shippedRoutes: phase2Routes,
        },
      ).join('\n'),
      /Developers footer must use shipped/,
    );
    const contractsRoutes = [...phase2Routes, `${v2}/reference/contracts/`];
    assert.match(
      assertDocHtml(html, { ...options, shippedRoutes: contractsRoutes }).join(
        '\n',
      ),
      /Developers footer must use shipped/,
    );
    const contractsLinks = phase2Links.map((link, index) =>
      index === 2 ? ['Smart Contracts', `${v2}/reference/contracts`] : link,
    );
    assert.deepEqual(
      assertDocHtml(
        original.replace(footer(initialFooterLinks), footer(contractsLinks)),
        {
          ...options,
          shippedRoutes: contractsRoutes,
        },
      ),
      [],
    );
    assert.match(
      assertDocHtml(html.replace(footer(phase2Links), ''), {
        ...options,
        shippedRoutes: phase2Routes,
      }).join('\n'),
      /expected one Developers footer column/,
    );
  }
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
  // This fixture exercises Phase 1 native metadata independently of later pages.
  const fixtureIds = new Set(['index', 'agents/skills', 'community/index']);
  const source = readDocs(
    path.resolve(__dirname, '..'),
    versions.current,
  ).filter((page) => fixtureIds.has(page.id));
  for (const page of source)
    write(`${versions.current.docsDir}/${page.relativePath}`, page.content);
  write(
    'scripts/v2-launch-routes.txt',
    fs.readFileSync(path.join(__dirname, 'v2-launch-routes.txt')),
  );
  const pairs = {
    schemaVersion: 1,
    pairs: require('../src/data/version-equivalents.json').pairs.filter(
      (pair) => fixtureIds.has(pair.v2),
    ),
  };
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

test('export inventory rejects missing, extra, and generated index Markdown', (t) => {
  const { compareExportInventory } = require('./validate-built-docs');
  const build = fs.mkdtempSync(path.join(os.tmpdir(), 'markdown-inventory-'));
  t.after(() => fs.rmSync(build, { recursive: true, force: true }));
  fs.mkdirSync(path.join(build, 'docs', 'v1'), { recursive: true });
  fs.writeFileSync(path.join(build, 'docs.md'), '');
  fs.writeFileSync(path.join(build, 'docs/v1.md'), '');
  const native = [
    { docs: [{ id: 'index', path: '/docs/' }] },
    {
      docs: [
        { id: 'index', path: '/docs/v1/' },
        { id: '/category', path: '/docs/v1/category/' },
      ],
    },
  ];
  assert.deepEqual(compareExportInventory(build, native), []);
  native[0].docs.push({ id: 'gone', path: '/docs/gone' });
  fs.writeFileSync(path.join(build, 'docs/v1/category.md'), '');
  assert.deepEqual(compareExportInventory(build, native), [
    'Missing Markdown export: /docs/gone.md',
    'Unexpected Markdown export: /docs/v1/category.md',
  ]);
});

test('built checker validates exact Markdown metadata, all deployment addresses and alternate placement', () => {
  const {
    assertAlternate,
    assertMarkdown,
    parseHtml,
  } = require('./validate-built-docs');
  const { BASE_URL } = require('./generate-llms-full');
  const yaml = require('js-yaml');
  const pkg = '@0xintuition/deployments';
  const doc = {
    id: 'reference/contracts/deployments',
    path: '/docs/reference/contracts/deployments',
  };
  const native = {
    ...doc,
    version: 'current',
    title: 'Deployments',
    description: 'Networks',
    frontMatter: { kind: 'reference', reader: ['app'], packages: [pkg] },
  };
  const url = BASE_URL + doc.path;
  const addresses = ['0x' + 'a'.repeat(40), '0x' + 'b'.repeat(40)];
  const options = {
    version: versions.current,
    native,
    doc,
    manifest: { packages: [{ name: pkg, version: '0.1.0' }] },
    source: {
      body: `{/* generated:start deployments */}\n| MultiVault | ${addresses.join(' | ')} |\n{/* generated:end */}`,
    },
  };
  const metadata = {
    title: native.title,
    description: native.description,
    url,
    markdown_url: url + '.md',
    version: 'V2',
    llms_index: BASE_URL + '/llms.txt',
    kind: 'reference',
    reader: ['app'],
    packages: [pkg + '@0.1.0'],
  };
  const markdown =
    '---\n' + yaml.dump(metadata) + '---\n\n' + addresses.join('\n');
  assert.deepEqual(assertMarkdown(markdown, options), []);
  assert.match(
    assertMarkdown(markdown.replace('@0.1.0', '@latest'), options).join('\n'),
    /front matter/,
  );
  assert.match(
    assertMarkdown(markdown.replace(addresses[1], ''), options).join('\n'),
    /missing exported deployment address/,
  );
  const link = `<link rel="alternate" type="text/markdown" href="${url}.md">`;
  assert.deepEqual(
    assertAlternate(parseHtml('<head>' + link + '</head>'), url + '.md'),
    [],
  );
  for (const html of [
    '<head></head><body>' + link + '</body>',
    '<head>' + link + link + '</head>',
  ])
    assert.ok(assertAlternate(parseHtml(html), url + '.md').length);
});

test('switcher requires both mapped destinations and exactly one accessible current version', () => {
  const { assertVersionSwitcher, parseHtml } = require('./validate-built-docs');
  const targets = [
    { label: 'V2', href: '/docs/agents' },
    { label: 'V1', href: '/docs/v1/experimental-applications/mcp-server' },
  ];
  const html =
    '<div data-docs-version-switcher="desktop"><button>V2</button><ul><li><a aria-current="page" href="/docs/agents/">V2</a></li><li><a href="' +
    targets[1].href +
    '">V1</a></li></ul></div>';
  assert.deepEqual(
    assertVersionSwitcher(parseHtml(html), versions.current, targets),
    [],
  );
  for (const bad of [
    html.replace(targets[1].href, '/docs/v1'),
    html.replace('aria-current="page"', ''),
  ]) {
    assert.ok(
      assertVersionSwitcher(parseHtml(bad), versions.current, targets).length,
    );
  }
});
