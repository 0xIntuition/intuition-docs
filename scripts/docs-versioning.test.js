'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { versions, getVersion } = require('../docs-versions.config');
const { legacyRedirects, v2Renames, redirects, createRedirects } = require('../redirects.config');
const { rewriteTarget, transformContent, checkContent } = require('./codemods/v1-prefix-links');
const { docMetadata, parseFrontMatter, readDocs, normalizeRoute } = require('./lib/docs-tree');
const { applyLinkFixes, compareSnapshot, validateSnapshot } = require('./validate-v1-snapshot');
const { readBaseline, validateRoutes } = require('./validate-url-baseline');
const ROOT = path.resolve(__dirname, '..');

function temporaryDir(t) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'docs-versioning-'));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  return dir;
}

test('version table includes every required native and tooling value', () => {
  const fields = ['name', 'label', 'docsDir', 'routeBase', 'llmsDir', 'llmsIndexSource', 'isDefault', 'searchTag', 'path', 'banner', 'badge', 'noIndex'];
  for (const version of Object.values(versions)) for (const field of fields) assert.ok(Object.hasOwn(version, field), field);
  assert.equal(getVersion('v2'), versions.current);
  assert.throws(() => getVersion('future'), /Unknown documentation version/);
  assert.throws(() => getVersion('__proto__'), /Unknown documentation version/);
  assert.match(versions.v1.sourceCommit, /^[0-9a-f]{40}$/);
});

test('Docusaurus uses native version options and development-only filtering', () => {
  function config(env) {
    const stdout = execFileSync(process.execPath, ['-e', `const c=require('./docusaurus.config');const p=c.presets[0][1];console.log(JSON.stringify({docs:p.docs,markdown:c.markdown,broken:c.onBrokenLinks,sitemap:p.sitemap,navbar:c.themeConfig.navbar.items,editV1:p.docs.editUrl({version:'v1'}),editCurrent:p.docs.editUrl({version:'current',versionDocsDirPath:'docs/_data',docPath:'community/index.md'})}));`], { cwd: ROOT, env: { ...process.env, ...env }, encoding: 'utf8' });
    return JSON.parse(stdout);
  }
  const production = config({ NODE_ENV: 'production', DOCS_VERSIONS: 'current' });
  assert.equal(production.docs.lastVersion, 'current');
  assert.equal(production.docs.includeCurrentVersion, true);
  assert.deepEqual(production.docs.versions, {
    current: { label: 'V2', path: '', banner: 'none', badge: true, noIndex: false },
    v1: { label: 'V1', path: 'v1', banner: 'unmaintained', badge: true, noIndex: true },
  });
  assert.equal(production.docs.onlyIncludeVersions, undefined);
  assert.equal(production.editV1, undefined);
  assert.equal(production.editCurrent, 'https://github.com/0xIntuition/intuition-docs/tree/main/docs/_data/community/index.md');
  assert.equal(production.broken, 'throw');
  assert.equal(production.markdown.hooks.onBrokenMarkdownLinks, 'throw');
  assert.deepEqual(production.sitemap.ignorePatterns, ['**/tags/**', '/api/*', '/docs/v1/**']);
  assert.equal(production.navbar[0].label, 'Documentation');
  assert.deepEqual(production.navbar[1], { type: 'docsVersionDropdown', docsPluginId: '_data', position: 'left' });
  assert.deepEqual(config({ NODE_ENV: 'development', DOCS_VERSIONS: ' current, v1 ' }).docs.onlyIncludeVersions, ['current', 'v1']);
  assert.equal(config({ NODE_ENV: 'development', DOCS_VERSIONS: '' }).docs.onlyIncludeVersions, undefined);
});

test('twelve static redirects target V1 and preserve independent V2 home', () => {
  assert.equal(legacyRedirects.length, 12);
  assert.equal(new Set(legacyRedirects.map((r) => r.from)).size, 12);
  assert.ok(legacyRedirects.every((r) => r.to === versions.v1.routeBase || r.to.startsWith(`${versions.v1.routeBase}/`)));
  assert.deepEqual(v2Renames, []);
  assert.deepEqual(redirects, [...legacyRedirects, ...v2Renames]);
  assert.equal(createRedirects('/docs'), undefined);
  assert.equal(createRedirects('/docs/v1'), undefined);
  assert.equal(createRedirects('/docs/v12/foo'), undefined);
  assert.deepEqual(createRedirects('/docs/v1/category/-graphql-api'), ['/docs/category/-graphql-api']);
  assert.equal(legacyRedirects.find((r) => r.from === '/docs/introduction/overview').to, '/docs/v1');
});

test('generated redirects have no collisions with static redirects or V2 routes', () => {
  const v1Docs = readDocs(ROOT, versions.v1);
  const v1Routes = v1Docs.map((doc) => doc.route);
  const generated = v1Routes.flatMap((route) => createRedirects(route) ?? []);
  assert.equal(new Set(generated).size, generated.length);
  for (const redirect of legacyRedirects) {
    assert.ok(v1Routes.includes(redirect.to), `Unresolved legacy target ${redirect.to}`);
    assert.ok(!generated.includes(redirect.from), `Colliding legacy source ${redirect.from}`);
  }
  for (const route of ['/docs', '/docs/agents/skills', '/docs/community']) assert.ok(!generated.includes(route));
});

test('codemod rewrites destinations only, preserving every query and hash', () => {
  const cases = new Map([
    ['/docs', '/docs/v1'],
    ['/docs?framework=react#step', '/docs/v1?framework=react#step'],
    ['/docs#intro?literal', '/docs/v1#intro?literal'],
    ['/docs/protocol?x=1#step', '/docs/v1/protocol?x=1#step'],
    ['/docs/introduction/overview?x=1#intro', '/docs/v1?x=1#intro'],
    ['/docs/intuition-ai/index#tools', '/docs/v1/experimental-applications/mcp-server#tools'],
    ['/docs/v1', '/docs/v1'],
    ['/docs/v1?x=1#intro', '/docs/v1?x=1#intro'],
    ['/docs/v1/protocol', '/docs/v1/protocol'],
    ['/docs/v10/foo', '/docs/v1/v10/foo'],
    ['/docstring', '/docstring'],
    ['https://docs.intuition.systems/docs/a', 'https://docs.intuition.systems/docs/a'],
  ]);
  for (const [before, after] of cases) {
    assert.equal(rewriteTarget(before), after);
    assert.equal(rewriteTarget(after), after);
  }
  const input = 'Prose /docs untouched. [Title](/docs/protocol?x=1#part "Title")\n[ref]: </docs/introduction/overview#top>\n<Link to={"/docs/foo#bar"} href=\'/docs/bar?q=1\' link="/docs/baz" />\n</docs/qux>\nconst prose = "/docs/not-a-link";';
  const expected = 'Prose /docs untouched. [Title](/docs/v1/protocol?x=1#part "Title")\n[ref]: </docs/v1#top>\n<Link to={"/docs/v1/foo#bar"} href=\'/docs/v1/bar?q=1\' link="/docs/v1/baz" />\n</docs/v1/qux>\nconst prose = "/docs/not-a-link";';
  assert.equal(transformContent(input), expected);
  assert.equal(transformContent(expected), expected);
});

test('check rejects unprefixed V1 links and unknown src routes', () => {
  assert.equal(checkContent('[link](/docs/protocol)').length, 1);
  assert.equal(checkContent('[link](/docs/v1/protocol?x#y)').length, 0);
  const options = { version: 'src', launchRoutes: new Set(['/docs/agents/skills']) };
  assert.equal(checkContent('<a href="/docs/graphql-api/overview" />', options).length, 1);
  assert.equal(checkContent('const target="/docs/does-not-exist";', options).length, 1);
  assert.equal(checkContent('<a href="/docs/v1/graphql-api/overview" />', options).length, 0);
  assert.equal(checkContent('<a href="/docs/agents/skills?x#y" />', options).length, 0);
  assert.equal(checkContent('<a href="/docs#intro" />', options).length, 0);
  assert.equal(checkContent('<noscript><a href="/docs/old" /></noscript>', { ...options, excludeNoscript: true }).length, 0);
  assert.equal(checkContent('<noscript><a href="/docs/old" /></noscript>', options).length, 1);
});

test('frontmatter and routes follow native explicit IDs, relative slugs, root/index convention', () => {
  const cases = [
    ['index.md', '', 'index', '/docs/v1'],
    ['folder/page.mdx', 'id: renamed', 'folder/renamed', '/docs/v1/folder/renamed'],
    ['folder/index.md', 'id: overview', 'folder/overview', '/docs/v1/folder'],
    ['folder/README.md', '', 'folder/README', '/docs/v1/folder'],
    ['network/network.md', '', 'network/network', '/docs/v1/network'],
    ['folder/page.md', 'slug: ../sibling', 'folder/page', '/docs/v1/sibling'],
    ['folder/page.md', 'slug: /absolute', 'folder/page', '/docs/v1/absolute'],
    ['folder/page.md', 'slug: /docs/custom', 'folder/page', '/docs/v1/docs/custom'],
    ['01-folder/02-page.md', '', 'folder/page', '/docs/v1/folder/page'],
    ['01-folder/02-page.md', 'parse_number_prefixes: false', '01-folder/02-page', '/docs/v1/01-folder/02-page'],
  ];
  for (const [file, metadata, id, route] of cases) {
    const doc = docMetadata(file, `---\n${metadata}\n---\nBody`, versions.v1);
    assert.equal(doc.id, id);
    assert.equal(doc.route, route);
    assert.equal(doc.body, 'Body');
  }
  assert.equal(docMetadata('community/index.md', 'Body', versions.current).route, '/docs/community');
  assert.throws(() => docMetadata('page.md', '---\nid: bad/id\n---\n', versions.v1), /Invalid doc id/);
  assert.deepEqual(parseFrontMatter('---\npackages: ["@0xintuition/iid"]\nreader: ["app", "agent"]\ntitle: "Title: here"\n---\n'), { packages: ['@0xintuition/iid'], reader: ['app', 'agent'], title: 'Title: here' });
  assert.equal(normalizeRoute('/docs/v1/'), '/docs/v1');
});

test('snapshot comparator detects unrelated byte drift and requires explicit link-fix records', () => {
  const base = new Map([['a.md', '[link](/docs/a)\n'], ['_category_.json', '{"label":"A"}\n']]);
  const snapshot = new Map([['a.md', '[link](/docs/v1/a)\n'], ['_category_.json', '{"label":"A"}\n']]);
  assert.deepEqual(compareSnapshot(base, snapshot), []);
  assert.match(compareSnapshot(base, new Map([...snapshot, ['extra.md', 'extra']]))[0], /Unexpected snapshot file/);
  assert.match(compareSnapshot(base, new Map([['_category_.json', '{"label":"A"}\n']]))[0], /Missing snapshot file/);
  assert.match(compareSnapshot(base, new Map([...snapshot, ['a.md', '[link](/docs/v1/a) \n']]))[0], /Unexpected snapshot content change/);
  const fixes = [{ file: 'a.md', oldTarget: '/docs/v1/a', newTarget: '/docs/v1/b', occurrences: 1, evidence: 'throwing-build.log: broken target' }];
  assert.deepEqual(compareSnapshot(base, new Map([...snapshot, ['a.md', '[link](/docs/v1/b)\n']]), fixes), []);
  assert.throws(() => applyLinkFixes('absent', 'a.md', fixes), /occurrence mismatch/);
  assert.throws(() => applyLinkFixes('/docs/v1/a', 'a.md', [{ ...fixes[0], evidence: '' }]), /Incomplete/);
});

test('actual snapshot is exactly the transformed merged Phase 0 base', () => {
  const result = validateSnapshot(ROOT);
  assert.equal(result.files, 281);
  assert.deepEqual(result.failures, []);
  const quickstart = fs.readFileSync(path.join(ROOT, versions.v1.docsDir, 'quick-start/using-the-sdk.md'), 'utf8');
  assert.equal((quickstart.match(/@0xintuition\/[a-z-]+@latest/g) ?? []).length, 0);
  assert.equal((quickstart.match(/viem@latest/g) ?? []).length, 4);
});

test('baseline checks root, HTML pages and redirect index pages, failing missing routes', (t) => {
  const dir = temporaryDir(t);
  fs.mkdirSync(path.join(dir, 'docs/old'), { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), 'home');
  fs.writeFileSync(path.join(dir, 'docs.html'), 'docs');
  fs.writeFileSync(path.join(dir, 'docs/old/index.html'), 'redirect');
  assert.deepEqual(validateRoutes(['/', '/docs', '/docs/old'], dir), []);
  assert.deepEqual(validateRoutes(['/docs/missing'], dir), ['/docs/missing']);
  const fixture = path.join(dir, 'baseline.txt');
  fs.writeFileSync(fixture, '/\n/docs\n/docs\n');
  assert.throws(() => readBaseline(fixture), /duplicate/);
  fs.writeFileSync(fixture, '/../outside\n');
  assert.throws(() => readBaseline(fixture), /Invalid/);
  assert.equal(readBaseline(path.join(ROOT, 'scripts/url-baseline-2026-11-10.txt')).length, 244);
});
