'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const test = require('node:test');
const path = require('node:path');
const os = require('node:os');
const { spawnSync } = require('node:child_process');
const { versions } = require('../docs-versions.config');

const {
  cleanContent,
  parseSections,
  serializeMdxComponents,
  generateHeader,
  generateFullTxt,
  generateMediumTxt,
  generateIndexTxt,
  selectedVersions,
  readCuratedIndexSource,
  getLastUpdatedMap,
  BASE_URL,
  llmsUrl,
  appliesToMarkdown,
} = require('./generate-llms-full');

test('serializes tab labels and preserves fenced code blocks', () => {
  const input = [
    '## Installation',
    '',
    '<Tabs>',
    '<TabItem value="npm" label="npm" default>',
    '',
    '```bash',
    'npm install package',
    '```',
    '',
    '</TabItem>',
    '<TabItem value="pnpm" label="pnpm">',
    '',
    '```bash',
    'pnpm add package',
    '```',
    '',
    '</TabItem>',
    '</Tabs>',
  ].join('\n');

  const output = cleanContent(input, 'Example');

  assert.match(output, /^### npm$/m);
  assert.match(output, /^### pnpm$/m);
  assert.match(output, /npm install package/);
  assert.match(output, /pnpm add package/);
  assert.doesNotMatch(output, /<\/?(?:Tabs|TabItem)\b/);
});

test('unwraps fragments and unknown containers without losing their children', () => {
  const input = [
    '<>',
    'Fragment content',
    '</>',
    '<Callout>',
    'Important content',
    '</Callout>',
    '<DecorativeWidget />',
  ].join('\n');

  const output = serializeMdxComponents(input);

  assert.match(output, /Fragment content/);
  assert.match(output, /Important content/);
  assert.doesNotMatch(output, /<\/?(?:Fragment|Callout)\b|<DecorativeWidget/);
});

test('drops BrowserOnly executable diagram blocks', () => {
  const input = [
    'Before diagram',
    '<BrowserOnly fallback={<p>Loading diagram...</p>}>',
    '  {() => <ExcalidrawViewer src="/diagram.json" />}',
    '</BrowserOnly>',
    'After diagram',
  ].join('\n');

  const output = serializeMdxComponents(input);

  assert.equal(output, 'Before diagram\n\nAfter diagram');
});

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function tabItemLabels(source) {
  return [...source.matchAll(/<TabItem\b([^>]*)>/g)]
    .map((match) => {
      const attributes = match[1];
      const label =
        attributes.match(/\blabel\s*=\s*(?:"([^"]*)"|'([^']*)')/) ||
        attributes.match(/\bvalue\s*=\s*(?:"([^"]*)"|'([^']*)')/);
      return label ? (label[1] ?? label[2]) : null;
    })
    .filter(Boolean);
}

test('serializes every TabItem from the docs sources into a heading', () => {
  const sections = Object.values(versions).flatMap((version) =>
    parseSections(version),
  );

  assert.ok(sections.length > 0, 'Expected generated sections');

  let checkedTabItems = 0;

  for (const section of sections) {
    assert.doesNotMatch(
      section.contentFull,
      /<\/?(?:Tabs|TabItem)\b/,
      `Expected ${section.route} to drop Tabs/TabItem tags`,
    );

    const source = fs.readFileSync(section.sourceFile, 'utf-8');

    for (const label of tabItemLabels(source)) {
      checkedTabItems += 1;
      assert.match(
        section.contentFull,
        new RegExp(`^#{1,6} ${escapeRegExp(label)}$`, 'm'),
        `Expected ${section.route} to turn TabItem "${label}" into a heading`,
      );
    }
  }

  assert.ok(
    checkedTabItems > 0,
    'Expected the docs sources to contain at least one TabItem',
  );
});

const {
  compareRouteSets,
  extractFullRoutes,
  extractMediumRoutes,
  extractIndexRoutes,
  validateHeader,
  validateSourceIsolation,
  validateFrozenTimestamps,
  validateCuratedAreaCoverage,
  runOmissionFixture,
  proveOmissionFixtureFails,
} = require('./validate-llms-coverage');

function fixtureRoot(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'llms-version-test-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  for (const version of Object.values(versions)) {
    fs.mkdirSync(path.join(root, version.docsDir), { recursive: true });
  }
  return root;
}

function writeDoc(root, version, relative, content) {
  const file = path.join(root, version.docsDir, relative);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
}

test('version selector defaults to both versions and rejects missing or unknown values', () => {
  assert.deepEqual(selectedVersions([]), [versions.current, versions.v1]);
  assert.deepEqual(selectedVersions(['--version', 'all']), [
    versions.current,
    versions.v1,
  ]);
  assert.deepEqual(selectedVersions(['--version', 'current']), [
    versions.current,
  ]);
  assert.deepEqual(selectedVersions(['--version', 'v1']), [versions.v1]);
  for (const args of [
    ['--version'],
    ['--version', 'other'],
    ['--version', 'v2'],
  ]) {
    assert.throws(() => selectedVersions(args), /--version must be/);
  }
});

test('stdout requires a single explicit version before any output is written', () => {
  const result = spawnSync(
    process.execPath,
    [path.join(__dirname, 'generate-llms-full.js'), '--stdout'],
    { encoding: 'utf8' },
  );
  assert.equal(result.status, 1);
  assert.equal(result.stdout, '');
  assert.match(result.stderr, /--stdout requires --version/);
});

test('JSON arrays and nested V1 metadata do not replace top-level title or description', (t) => {
  const root = fixtureRoot(t);
  writeDoc(
    root,
    versions.current,
    'index.md',
    '---\ntitle: Current overview\nkind: overview\nreader: ["human", "agent"]\npackages: []\ndepends_on: ["atoms"]\n---\nA short overview.\n',
  );
  writeDoc(
    root,
    versions.v1,
    'index.md',
    '---\ntitle: "V1: Original"\ndescription: "Original description"\nlast_updated: "2099-01-01"\nimage: \n  title: Nested title\n  description: Nested description\n---\nA short overview.\n',
  );
  const [current] = parseSections('current', { rootDir: root });
  const [v1] = parseSections('v1', { rootDir: root });
  assert.deepEqual(current.frontMatter.reader, ['human', 'agent']);
  assert.deepEqual(current.frontMatter.packages, []);
  assert.deepEqual(current.frontMatter.depends_on, ['atoms']);
  assert.equal(current.route, versions.current.routeBase);
  assert.equal(current.contentFull, 'A short overview.');
  assert.equal(v1.title, 'V1: Original');
  assert.equal(v1.description, 'Original description');
  assert.equal(v1.lastUpdated, getLastUpdatedMap(versions.v1).get('index.md'));
  assert.notEqual(v1.lastUpdated, v1.frontMatter.last_updated);
});

test('version routes use shared IDs/slugs and preserve allowed body cross-links', (t) => {
  const root = fixtureRoot(t);
  writeDoc(
    root,
    versions.current,
    'index.md',
    `---\ntitle: Current\n---\n[V1](${versions.v1.routeBase})\n`,
  );
  writeDoc(
    root,
    versions.v1,
    'index.md',
    `---\ntitle: V1\n---\n[Current](${versions.current.routeBase})\n`,
  );
  writeDoc(
    root,
    versions.current,
    'guide/topic.md',
    '---\ntitle: Custom\nid: custom-id\nslug: /custom-route\n---\n[Local](../index.md)\n',
  );
  const current = parseSections('current', { rootDir: root });
  const v1 = parseSections('v1', { rootDir: root });
  const home = current.find((section) => section.id === 'index');
  const custom = current.find((section) => section.id === 'guide/custom-id');
  assert.equal(custom.route, `${versions.current.routeBase}/custom-route`);
  assert.match(
    custom.contentFull,
    new RegExp(`${BASE_URL}${versions.current.routeBase}\\)`),
  );
  assert.ok(home.contentFull.includes(`${BASE_URL}${versions.v1.routeBase}`));
  assert.ok(
    v1[0].contentFull.includes(`${BASE_URL}${versions.current.routeBase}`),
  );
  assert.deepEqual(extractFullRoutes(generateFullTxt(v1, versions.v1)), [
    versions.v1.routeBase,
  ]);
  assert.doesNotThrow(() =>
    validateSourceIsolation(
      extractFullRoutes(generateFullTxt(current, versions.current)),
      versions.current,
    ),
  );
});

test('V1 keeps 230 served pages from 231 timestamped source files, all with frozen dates', () => {
  const dates = getLastUpdatedMap(versions.v1);
  const sections = parseSections('v1');
  assert.equal(dates.size, 231);
  assert.equal(sections.length, 230);
  assert.equal(new Set(sections.map((section) => section.route)).size, 230);
  for (const section of sections) {
    assert.equal(section.lastUpdated, dates.get(section.relativePath));
    assert.ok(Number.isFinite(Date.parse(section.lastUpdated)));
    assert.ok(section.url.startsWith(`${BASE_URL}${versions.v1.routeBase}`));
  }
});

test('all six static llms links survive serialization without allowing unknown doc routes', (t) => {
  const root = fixtureRoot(t);
  const urls = Object.values(versions).flatMap((version) =>
    ['llms.txt', 'llms-medium.txt', 'llms-full.txt'].map((name) =>
      llmsUrl(version, name),
    ),
  );
  const body = urls
    .map((url, i) => `[Bundle ${i}](${new URL(url).pathname}?download=1#top)`)
    .join('\n');
  writeDoc(
    root,
    versions.current,
    'index.md',
    `---\ntitle: Current\n---\n${body}\n[Missing doc](${versions.current.routeBase}/does-not-exist)\n[Missing bundle](${versions.v1.routeBase}/llms-extra.txt)\n`,
  );
  const [home] = parseSections('current', { rootDir: root });
  for (const [i, url] of urls.entries())
    assert.ok(
      home.contentFull.includes(`[Bundle ${i}](${url}?download=1#top)`),
    );
  assert.doesNotMatch(home.contentFull, /does-not-exist|llms-extra\.txt/);
  assert.match(home.contentFull, /Missing doc\nMissing bundle/);
});

test('the actual V2 home retains its V1 documentation index body link', () => {
  const home = parseSections('current').find(
    (section) => section.id === 'index',
  );
  assert.ok(
    home.contentFull.includes(
      `[V1 documentation index](${llmsUrl(versions.v1)})`,
    ),
  );
});

for (const version of Object.values(versions)) {
  test(`${version.label} headers and all output formats use the selected version`, () => {
    const section = {
      title: 'Example',
      url: `${BASE_URL}${version.routeBase}`,
      route: version.routeBase,
      contentFull: 'Full text.',
      contentMedium: 'Summary.',
      lastUpdated: '2026-01-01T00:00:00Z',
    };
    for (const [format, output] of [
      ['index', generateIndexTxt([section], version)],
      ['full', generateFullTxt([section], version)],
      ['medium', generateMediumTxt([section], version)],
    ]) {
      validateHeader(output, version, format);
      const head = output.split('\n').slice(0, 10).join('\n');
      assert.match(head, new RegExp(`Version: ${version.label}`));
      assert.match(head, /Scope:/);
      assert.match(head, /Other versions:/);
      assert.doesNotMatch(head, /(?:SDK|protocol) [234]\.x/i);
      if (version.isDefault) {
        const manifest = require('../static/intuition-release.json');
        assert.ok(
          head.includes(
            `Package source: ${manifest.source.repository}/tree/${manifest.source.commit}`,
          ),
        );
        assert.ok(
          head.includes(
            `Core source revision: ${manifest.core.repository}/tree/${manifest.core.commit}`,
          ),
        );
        assert.doesNotMatch(head, /release candidate|core\.version/);
      }
    }
    assert.deepEqual(extractFullRoutes(generateFullTxt([section], version)), [
      version.routeBase,
    ]);
    assert.deepEqual(
      extractMediumRoutes(generateMediumTxt([section], version)),
      [version.routeBase],
    );
    assert.deepEqual(extractIndexRoutes(generateIndexTxt([section], version)), [
      version.routeBase,
    ]);
    assert.ok(
      readCuratedIndexSource(version).startsWith(generateHeader(version)),
    );
  });

  test(`${version.label} coverage omission self-test proves the missing route`, () => {
    assert.throws(() => runOmissionFixture(version), /intentionally-omitted/);
    proveOmissionFixtureFails(version);
  });

  test(`${version.label} Source isolation rejects the other version but permits body cross-links`, () => {
    const other = version === versions.v1 ? versions.current : versions.v1;
    assert.throws(
      () => validateSourceIsolation([other.routeBase], version),
      /cross version/,
    );
    assert.doesNotThrow(() =>
      validateSourceIsolation(
        [version.routeBase, `${version.routeBase}/guide`],
        version,
      ),
    );
    const text = `${generateHeader(version, 'full')}\n# A page\n\nSource: ${BASE_URL}${version.routeBase}\n\n[Other](${BASE_URL}${other.routeBase})\nSource: ${BASE_URL}${other.routeBase}\n`;
    assert.deepEqual(extractFullRoutes(text), [version.routeBase]);
    assert.throws(
      () =>
        validateHeader(
          text.replace(`Version: ${version.label}`, 'Version: wrong'),
          version,
          'full',
        ),
      /header differs/,
    );
  });
}

test('route parity rejects omissions, extras and duplicates independently', () => {
  for (const actual of [[], ['/a', '/b'], ['/a', '/a']]) {
    assert.throws(
      () => compareRouteSets('fixture', ['/a'], actual),
      /missing.*extra.*duplicate/,
    );
  }
  assert.deepEqual(compareRouteSets('fixture', ['/a'], ['/a']), {
    expected: 1,
    actual: 1,
  });
});

test('V2 headers derive both immutable source revisions from the supplied manifest', () => {
  const manifest = structuredClone(require('../static/intuition-release.json'));
  manifest.source.commit = 'a'.repeat(40);
  manifest.core.commit = 'b'.repeat(40);
  for (const generate of [
    generateIndexTxt,
    generateFullTxt,
    generateMediumTxt,
  ]) {
    const output = generate([], versions.current, { manifest });
    const head = output.split('\n').slice(0, 10).join('\n');
    assert.ok(head.includes(manifest.source.commit));
    assert.ok(head.includes(manifest.core.commit));
    assert.match(head, /Version: V2/);
    assert.match(head, /Other versions: V1/);
    assert.doesNotMatch(head, /release candidate/);
  }
  assert.throws(
    () =>
      generateHeader(versions.current, 'full', {
        manifest: { ...manifest, core: { ...manifest.core, commit: 'main' } },
      }),
    /immutable/,
  );
});

test('V2 text exports exact AppliesTo versions, literal snippets and generated tables', (t) => {
  const root = fixtureRoot(t);
  const manifest = require('../static/intuition-release.json');
  fs.mkdirSync(path.join(root, 'static'));
  fs.writeFileSync(
    path.join(root, 'static/intuition-release.json'),
    JSON.stringify(manifest),
  );
  const snippet =
    '~~~~ts\nconst tag = "<AppliesTo />";\nconst value: Array<string> = ["<!-- keep -->"];\n~~~~';
  const table =
    '| Package | Version |\n| --- | --- |\n| @0xintuition/iid | 0.1.0 |';
  writeDoc(
    root,
    versions.current,
    'index.md',
    `---\ntitle: Current\npackages: ["@0xintuition/iid"]\n---\n<AppliesTo />\n\n{/* example:start quickstart/quickstart.ts#example */}\n${snippet}\n{/* example:end */}\n\n{/* generated:start release-pins */}\n${table}\n{/* generated:end */}\n`,
  );
  const [section] = parseSections('current', { rootDir: root });
  assert.match(
    section.contentFull,
    /^Applies to V2 · `@0xintuition\/iid` 0\.1\.0/,
  );
  assert.ok(section.contentFull.includes(snippet));
  assert.ok(section.contentFull.includes(table));
  assert.ok(section.contentMedium.includes(table));
  assert.doesNotMatch(section.contentMedium, /const tag/);
  assert.doesNotMatch(section.contentFull, /example:start|generated:start/);
  assert.equal(appliesToMarkdown([], manifest), '');
  assert.match(
    appliesToMarkdown(['@0xintuition/iid'], {
      ...manifest,
      status: 'published-alpha',
    }),
    / · pre-release$/,
  );
  assert.throws(
    () => appliesToMarkdown(['@0xintuition/missing'], manifest),
    /Missing AppliesTo/,
  );
});

test('Source parsing rejects noncanonical external sources', () => {
  assert.throws(
    () => extractFullRoutes('# Bad\n\nSource: https://example.org/page\n'),
    /Invalid page Source URL/,
  );
});

test('curated coverage is scoped to the selected tree and rejects a missing area', () => {
  const sections = [
    { route: '/fixture/a', relativePath: 'first/index.md' },
    { route: '/fixture/b', relativePath: 'second/page.md' },
    { route: '/fixture', relativePath: 'index.md' },
  ];
  assert.throws(
    () => validateCuratedAreaCoverage(sections, ['/fixture/a']),
    /second/,
  );
  assert.deepEqual(
    validateCuratedAreaCoverage(sections, ['/fixture/a', '/fixture/b']),
    { expected: 2, actual: 2 },
  );
});

test('Source parsing ignores page-like content inside fenced examples', () => {
  const text =
    '# Real\n\nSource: https://docs.intuition.systems/docs\n\n```md\n# Example\n\nSource: https://example.org/ignored\n```\n';
  assert.deepEqual(extractFullRoutes(text), ['/docs']);
});

test('V1 artifact metadata must keep the original frozen timestamp', () => {
  const [section] = parseSections('v1');
  const output = generateMediumTxt([section], versions.v1);
  assert.doesNotThrow(() => validateFrozenTimestamps(output, [section]));
  assert.throws(
    () =>
      validateFrozenTimestamps(
        output.replace(section.lastUpdated, '2099-01-01'),
        [section],
      ),
    /differs from frozen source history/,
  );
});
