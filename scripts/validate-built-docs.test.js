'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { versions } = require('../docs-versions.config');
const {
  BANNER_TEXT,
  assertDocHtml,
  validateNoscript,
  validateSitemap,
  validateCollisions,
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
