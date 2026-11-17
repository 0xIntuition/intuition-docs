'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const crypto = require('node:crypto');
const { versions } = require('../docs-versions.config');
const {
  validateFreeze,
  validateCoverage,
} = require('./validate-config-coverage');
const {
  buildValidPaths,
  extractLinks,
  getFilesToScan,
} = require('./validate-internal-links');
const {
  parseArgs,
  readConfig,
  extractExamplesFromSource,
  typecheckExamples,
} = require('./validate-sdk-examples');
const v1 = versions.v1.docsDir;
const current = versions.current.docsDir;
const code = 'import { createAtomFromString } from "@0xintuition/sdk";\n';
test('freeze bootstrap is narrow, and later unlabelled snapshot edits fail', () => {
  assert.deepEqual(
    validateFreeze({
      baseHasSnapshot: false,
      currentHasSnapshot: true,
      changedFiles: [`${v1}/index.md`],
    }).errors,
    [],
  );
  assert.ok(
    validateFreeze({
      baseHasSnapshot: false,
      currentHasSnapshot: false,
      changedFiles: [],
    }).errors.length,
  );
  assert.ok(
    validateFreeze({
      baseHasSnapshot: false,
      currentHasSnapshot: true,
      changedFiles: [],
      labels: ['v1-exception'],
    }).errors.length,
  );
  assert.ok(
    validateFreeze({
      baseHasSnapshot: true,
      currentHasSnapshot: true,
      changedFiles: [`${v1}/index.md`],
    }).errors.length,
  );
  assert.deepEqual(
    validateFreeze({
      baseHasSnapshot: true,
      currentHasSnapshot: true,
      changedFiles: ['src/index.js'],
    }).errors,
    [],
  );
});
test('GraphQL exception requires only allowed files and a verified failed nightly run', () => {
  const input = {
    baseHasSnapshot: true,
    currentHasSnapshot: true,
    changedFiles: [
      `${v1}/graphql-api/overview.md`,
      'scripts/graphql-schema-mainnet.json',
    ],
    labels: ['v1-exception'],
    repository: '0xIntuition/intuition-docs',
    nightlyRun: {
      event: 'schedule',
      conclusion: 'failure',
      path: '.github/workflows/validate-graphql.yml',
      repository: { full_name: '0xIntuition/intuition-docs' },
    },
  };
  assert.deepEqual(validateFreeze(input).errors, []);
  for (const mutation of [
    (copy) => copy.changedFiles.push('package.json'),
    (copy) => copy.changedFiles.push(`${v1}/index.md`),
    (copy) => delete copy.nightlyRun,
    (copy) => (copy.nightlyRun.event = 'workflow_dispatch'),
    (copy) => (copy.nightlyRun.conclusion = 'success'),
    (copy) => (copy.nightlyRun.path = '.github/workflows/other.yml'),
    (copy) => (copy.nightlyRun.repository.full_name = 'other/repo'),
  ]) {
    const copy = structuredClone(input);
    mutation(copy);
    assert.ok(validateFreeze(copy).errors.length);
  }
});
test('AC-51 ratchet preserves all 32 code identities and 215 fingerprints after path rekeying', () => {
  const config = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'sdk-examples.config.json'), 'utf8'),
  );
  const original = config.versions.v1.knownFailing.map((entry) => ({
    ...entry,
    file: entry.file.replace(v1, current),
  }));
  assert.equal(
    crypto.createHash('sha256').update(JSON.stringify(original)).digest('hex'),
    'c992e61f386a82ed0c794b0beb2efaa49689b4f6163ca766f905090c7d16741c',
  );
  assert.equal(original.flatMap((entry) => entry.fences).length, 32);
  assert.equal(
    original.flatMap((entry) =>
      entry.fences.flatMap((fence) => fence.fingerprints),
    ).length,
    215,
  );
  assert.deepEqual(config.versions.v2.knownFailing, []);
  assert.equal(config.versions.v2.dependencyRoot, 'examples/v2');
});
test('SDK version selection and zero-fence V2 avoid creating or needing a dependency root', () => {
  assert.equal(parseArgs(['node', 'script', '--version', 'v2']).version, 'v2');
  assert.throws(
    () => parseArgs(['node', 'script', '--version', 'bad']),
    /version/,
  );
  assert.throws(
    () => parseArgs(['node', 'script', '--version', 'v2', '--update-ratchet']),
    /no ratchet/,
  );
  assert.deepEqual(
    typecheckExamples(
      [],
      path.join(os.tmpdir(), 'absent-docs-v2-dependencies'),
    ),
    { status: 0, output: '', diagnostics: [], unparsed: [] },
  );
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'sdk-config-test-'));
  try {
    const config = JSON.parse(
      fs.readFileSync(path.join(__dirname, 'sdk-examples.config.json'), 'utf8'),
    );
    config.versions.v2.knownFailing.push({ file: 'bad' });
    const configPath = path.join(directory, 'config.json');
    fs.writeFileSync(configPath, JSON.stringify(config));
    assert.throws(
      () => readConfig({ version: 'v2', configPath }),
      /must be empty/,
    );
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
  }
});
test('SDK extractors keep V1 marked migration fences separate from V2', () => {
  const source = `<!-- docs-typecheck: v1 -->\n\`\`\`ts\n${code}\`\`\`\n\`\`\`ts\n${code}\`\`\`\n`;
  const file = `${current}/get-started/migrate-from-v1.md`;
  assert.equal(
    extractExamplesFromSource(file, source, '<!-- docs-typecheck: skip -->', {
      version: 'v1',
    }).examples.length,
    1,
  );
  assert.equal(
    extractExamplesFromSource(file, source, '<!-- docs-typecheck: skip -->', {
      version: 'v2',
    }).examples.length,
    1,
  );
});
test('V2 extracts tilde and longer TypeScript fences, requiring a matching close', () => {
  const extract = (source) =>
    extractExamplesFromSource(
      `${current}/index.md`,
      source,
      '<!-- docs-typecheck: skip -->',
      { version: 'v2' },
    );
  for (const marker of ['~~~', '~~~~', '````']) {
    const source = `${marker} ts title="Example"\n${code}${marker}${marker[0]}\n`;
    const { examples, coverage } = extract(source);
    assert.equal(coverage.found, 1);
    assert.equal(examples.length, 1);
    assert.equal(examples[0].code, code.trimEnd());
    assert.equal(examples[0].fenceLine, 1);
    assert.throws(
      () => extract(`<!-- docs-typecheck: skip -->\n${source}`),
      /may not skip typechecking/,
    );
  }
  assert.throws(
    () => extract(`~~~~ts\n${code}~~~\n`),
    /Unclosed TypeScript fence/,
  );
  assert.throws(
    () => extract(`~~~ts\n${code}\`\`\`\n`),
    /Unclosed TypeScript fence/,
  );
  // A shorter fence is content and cannot hide the import after it.
  assert.match(
    extract(`~~~~ts\n~~~\n${code}~~~~\n`).examples[0].code,
    /@0xintuition/,
  );
  // A TypeScript-looking block inside a Markdown example is not executable TS.
  assert.equal(
    extract(`~~~~markdown\n~~~ts\n${code}~~~\n~~~~\n`).coverage.found,
    0,
  );
  const bad = extract(
    '~~~ts\nimport { nonexistentFixRoundExport } from "@0xintuition/sdk";\n~~~',
  );
  const checked = typecheckExamples(
    bad.examples,
    path.resolve(__dirname, '..'),
  );
  assert.notEqual(checked.status, 0);
  assert.ok(
    checked.diagnostics.some((diagnostic) => diagnostic.code === 'TS2305'),
  );
});
test('link validator includes both native generated indexes and all six bundle inputs', () => {
  const valid = buildValidPaths(path.join(__dirname, '..'));
  assert.ok(valid.has(`${versions.v1.routeBase}/category/-graphql-api`));
  assert.ok(valid.has(`${versions.v1.routeBase}/category/-intuition-concepts`));
  const scanned = getFilesToScan().filter((file) =>
    /llms(?:-medium|-full)?\.txt$/.test(file),
  );
  assert.equal(scanned.length, 6);
  const parsed = extractLinks(
    `[Home](${versions.current.routeBase})\nSource: https://docs.intuition.systems${versions.v1.routeBase}/index\n<a href="${versions.v1.routeBase}/graphql-api/overview">GraphQL</a>`,
    'llms-full.txt',
  );
  assert.equal(parsed.length, 3);
});
test('native slugger preserves duplicate-label suffix behavior', () => {
  const slugger = require('@docusaurus/utils').createSlugger();
  assert.equal(slugger.slug('⛬ GraphQL API'), '-graphql-api');
  assert.equal(slugger.slug('⛬ GraphQL API'), '-graphql-api-1');
});
test('coverage rejects unpaired globs, floating actions and cspell scope changes', () => {
  const root = path.join(__dirname, '..');
  const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
  const input = {
    packageJson: JSON.parse(read('package.json')),
    cspell: JSON.parse(read('cspell.json')),
    tailwind: read('tailwind.config.cjs'),
    workflows: Object.fromEntries(
      ['check-links.yml', 'quality.yml', 'generate-llms-txt.yml'].map(
        (name) => [name, read(`.github/workflows/${name}`)],
      ),
    ),
    scripts: {},
    sdkConfig: JSON.parse(read('scripts/sdk-examples.config.json')),
  };
  assert.deepEqual(validateCoverage(input), []);
  for (const mutate of [
    (copy) => (copy.tailwind = current),
    (copy) =>
      (copy.workflows['extra.yml'] = `${current}\nuses: actions/checkout@main`),
    (copy) => (copy.packageJson.devDependencies.cspell = '^10.5.1'),
    (copy) => (copy.cspell.ignorePaths = []),
    (copy) => (copy.scripts['wrong.js'] = `const p = '${current}';`),
  ]) {
    const copy = structuredClone(input);
    mutate(copy);
    assert.ok(validateCoverage(copy).length);
  }
});

test('Phase 2 workflow coverage requires isolated installs and all source synchronization gates', () => {
  const root = path.join(__dirname, '..');
  const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
  const input = {
    packageJson: JSON.parse(read('package.json')),
    cspell: JSON.parse(read('cspell.json')),
    tailwind: read('tailwind.config.cjs'),
    workflows: Object.fromEntries(
      [
        'check-links.yml',
        'quality.yml',
        'generate-llms-txt.yml',
        'validate-sdk-examples.yml',
      ].map((name) => [name, read(`.github/workflows/${name}`)]),
    ),
    scripts: {},
    sdkConfig: JSON.parse(read('scripts/sdk-examples.config.json')),
    hasReleaseManifest: true,
  };
  assert.deepEqual(validateCoverage(input), []);
  for (const [name, command] of [
    ['quality.yml', 'npm ci --ignore-scripts --prefix examples/v2'],
    [
      'validate-sdk-examples.yml',
      'npm ci --ignore-scripts --prefix examples/v2',
    ],
    ['quality.yml', 'npm run check-release-pins'],
    ['quality.yml', 'node scripts/sync-generated-blocks.js --check'],
    ['quality.yml', 'node scripts/sync-example-snippets.js --check'],
    ['quality.yml', 'node scripts/validate-core-api-examples.js'],
    ['quality.yml', 'node scripts/validate-v2-structure.js --phase 2'],
    [
      'check-links.yml',
      'node scripts/validate-built-docs.js --phase 2 --build-log build.log',
    ],
    [
      'validate-sdk-examples.yml',
      'node --experimental-strip-types examples/v2/quickstart/quickstart.ts',
    ],
    [
      'validate-sdk-examples.yml',
      'diff -u examples/v2/quickstart/expected-output.txt',
    ],
    ['generate-llms-txt.yml', 'static/intuition-release.json'],
  ]) {
    const copy = structuredClone(input);
    copy.workflows[name] = copy.workflows[name].replace(command, '');
    assert.ok(validateCoverage(copy).length, `${name}: ${command}`);
  }
});
