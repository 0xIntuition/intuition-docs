'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const crypto = require('node:crypto');
const { execFileSync } = require('node:child_process');
const yaml = require('js-yaml');
const { versions } = require('../docs-versions.config');
const {
  runFreeze,
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
    scripts: {
      'native.js':
        "const directory = '.docusaurus/docusaurus-plugin-content-docs/_data';",
    },
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
    (copy) => (copy.scripts['wrong.js'] = `const p = '../${current}/build';`),
  ]) {
    const copy = structuredClone(input);
    mutate(copy);
    assert.ok(validateCoverage(copy).length);
  }
});

test('Launch workflow coverage requires isolated installs and all source synchronization gates', () => {
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
    [
      'quality.yml',
      'node scripts/validate-v2-structure.js --launch --templates',
    ],
    [
      'check-links.yml',
      'node scripts/validate-built-docs.js --phase 5 --build-log build.log',
    ],
    [
      'validate-sdk-examples.yml',
      'node --test examples/v2/first-write/migration.test.ts',
    ],
    [
      'validate-sdk-examples.yml',
      'node --test examples/v2/first-write/first-write.test.ts',
    ],
    [
      'validate-sdk-examples.yml',
      'node --test examples/v2/core-query-api/src/query-client.test.ts',
    ],
    [
      'validate-sdk-examples.yml',
      'node --test examples/v2/react-app/src/receipt.test.ts examples/v2/react-app/src/wallet-write.test.ts',
    ],
    [
      'validate-sdk-examples.yml',
      'node examples/v2/music-catalog/src/enrichment-plugin.ts',
    ],
    ['generate-llms-txt.yml', 'npm run generate-llms'],
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
    copy.workflows[name] = copy.workflows[name].replace(
      command,
      command === 'static/intuition-release.json'
        ? 'removed'
        : `echo skipped # ${command}`,
    );
    assert.ok(validateCoverage(copy).length, `${name}: ${command}`);
  }
});

test('the real freeze command admits a verified correction and freezes its merged bytes', (t) => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'v1-freeze-'));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  const repo = path.join(dir, 'repo');
  fs.mkdirSync(repo);
  const git = (...args) =>
    execFileSync('git', args, { cwd: repo, encoding: 'utf8' });
  git('init', '--quiet');
  git('config', 'user.name', 'Freeze fixture');
  git('config', 'user.email', 'fixture@example.invalid');
  git('config', 'commit.gpgsign', 'false');
  git('config', 'core.hooksPath', '/dev/null');
  const commit = () => {
    git('add', '-A');
    git('commit', '-qm', 'fixture');
  };
  const write = (file, body) => {
    fs.mkdirSync(path.dirname(path.join(repo, file)), { recursive: true });
    fs.writeFileSync(path.join(repo, file), body);
  };
  const query = `${v1}/graphql-api/query.md`;
  const unusual = `${v1}/tutorials/odd\nname.md`;
  write('_data_versions.json', '["v1"]');
  write(query, 'query { oldField }');
  write(unusual, 'frozen');
  write('outside.md', 'outside');
  commit();
  const main = 'refs/remotes/origin/main';
  git('update-ref', main, 'HEAD');
  const repository = 'example/docs';
  const eventPath = path.join(dir, 'event.json');
  const env = {
    ...process.env,
    PATH: `${dir}${path.delimiter}${process.env.PATH}`,
    GITHUB_REPOSITORY: repository,
    GITHUB_EVENT_PATH: eventPath,
    RUN_EVENT: 'schedule',
  };
  // This offline stand-in accepts only the URL linked in the fixture PR.
  fs.writeFileSync(
    path.join(dir, 'gh'),
    [
      '#!/bin/sh',
      '[ "$1" = api ] && [ "$2" = repos/example/docs/actions/runs/42 ] || exit 1',
      'printf \'{"event":"%s","conclusion":"failure","path":".github/workflows/validate-graphql.yml","repository":{"full_name":"example/docs"}}\\n\' "$RUN_EVENT"',
    ].join('\n'),
    { mode: 0o755 },
  );
  const event = (
    labelled,
    body = 'https://github.com/example/docs/actions/runs/42',
  ) =>
    fs.writeFileSync(
      eventPath,
      JSON.stringify({
        pull_request: {
          labels: labelled ? [{ name: 'v1-exception' }] : [],
          body,
        },
      }),
    );
  const errors = () => runFreeze(repo, env).errors;
  write(query, 'query { newField }');
  commit();
  event(false);
  assert.match(errors().join('\n'), /unlabelled/);
  event(true, 'https://github.com/elsewhere/docs/actions/runs/42');
  assert.match(errors().join('\n'), /verified failed nightly/);
  event(true);
  env.RUN_EVENT = 'workflow_dispatch';
  assert.match(errors().join('\n'), /verified failed nightly/);
  env.RUN_EVENT = 'schedule';
  assert.deepEqual(errors(), []);
  git('update-ref', main, 'HEAD');
  event(false);
  write('other.md', 'unrelated follow-up');
  commit();
  assert.deepEqual(errors(), []);

  for (const [from, to] of [
    [unusual, 'moved.md'],
    ['outside.md', `${v1}/tutorials/moved in.md`],
    [query, `${v1}/graphql-api/renamed.md`],
    [query, null],
  ]) {
    git('reset', '--hard', main);
    if (to) fs.renameSync(path.join(repo, from), path.join(repo, to));
    else fs.unlinkSync(path.join(repo, from));
    commit();
    event(false);
    assert.match(errors().join('\n'), /unlabelled/);
    event(true);
    assert.ok(errors().length);
  }

  git('reset', '--hard', main);
  fs.unlinkSync(path.join(repo, query));
  fs.symlinkSync('renamed.md', path.join(repo, query));
  commit();
  assert.match(errors().join('\n'), /must modify an existing query/);
});

test('schema refresh retains nightly evidence on an existing exception PR', (t) => {
  const workflow = yaml.load(
    fs.readFileSync(
      path.join(__dirname, '../.github/workflows/validate-graphql.yml'),
      'utf8',
    ),
  );
  const job = workflow.jobs['schema-drift'];
  const step = job.steps.find((item) => item.name === 'Create or update PR');
  const label = job.steps.find(
    (item) => item.name === 'Label the narrow GraphQL exception',
  );
  const predicate =
    "github.event_name == 'schedule' && steps.validate.outcome == 'failure'";
  assert.ok(Object.hasOwn(workflow.on, 'schedule'));
  assert.ok(Object.hasOwn(workflow.on, 'workflow_dispatch'));
  assert.deepEqual(workflow.on.repository_dispatch.types, ['schema-changed']);
  assert.equal(job.if, "github.event_name != 'pull_request'");
  assert.deepEqual(job.concurrency, {
    group: 'graphql-schema-refresh',
    'cancel-in-progress': false,
  });
  assert.equal(step.env.NIGHTLY_EXCEPTION, '${{ ' + predicate + ' }}');
  assert.equal(label.if, predicate);

  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'schema-refresh-'));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  fs.writeFileSync(path.join(dir, 'git'), '#!/bin/sh\nexit 0\n', {
    mode: 0o755,
  });
  fs.writeFileSync(
    path.join(dir, 'gh'),
    [
      '#!/bin/sh',
      'case "$2" in',
      'list) echo "$EXISTING_PR" ;;',
      'view) echo "$LABELLED" ;;',
      'edit|create) echo "$2" >> calls ;;',
      '*) exit 1 ;;',
      'esac',
    ].join('\n'),
    { mode: 0o755 },
  );
  const calls = path.join(dir, 'calls');
  for (const [trigger, outcome, existing, labelled, action] of [
    ['schedule', 'failure', '42', true, 'edit'],
    ['schedule', 'success', '42', true, ''],
    ['workflow_dispatch', 'failure', '42', true, ''],
    ['repository_dispatch', 'failure', '42', true, ''],
    ['workflow_dispatch', 'failure', '', false, 'create'],
    ['repository_dispatch', 'success', '42', false, 'edit'],
  ]) {
    fs.writeFileSync(calls, '');
    execFileSync(
      'bash',
      ['-e', '-c', step.run.replaceAll('${{ github.event_name }}', trigger)],
      {
        cwd: dir,
        env: {
          ...process.env,
          PATH: `${dir}${path.delimiter}${process.env.PATH}`,
          NIGHTLY_EXCEPTION: String(
            trigger === 'schedule' && outcome === 'failure',
          ),
          EXISTING_PR: existing,
          LABELLED: String(labelled),
        },
      },
    );
    assert.equal(fs.readFileSync(calls, 'utf8').trim(), action);
  }
});
