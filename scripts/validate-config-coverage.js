#!/usr/bin/env node
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync, spawnSync } = require('node:child_process');
const { versions } = require('../docs-versions.config');
const { walkFiles } = require('./lib/docs-tree');
const ROOT = path.resolve(__dirname, '..');
const snapshotRoot = versions.v1.docsDir.split('/')[0];
const FROZEN = [
  snapshotRoot,
  '_data_versioned_sidebars',
  '_data_versions.json',
];
const SCHEMAS = new Set([
  'scripts/graphql-schema-mainnet.json',
  'scripts/graphql-schema-testnet.json',
  'scripts/graphql-schema-pin.json',
]);
function isFrozen(file) {
  return FROZEN.some((root) => file === root || file.startsWith(`${root}/`));
}
function validateFreeze({
  baseHasSnapshot,
  currentHasSnapshot,
  changedFiles,
  labels = [],
  nightlyRun,
  repository,
}) {
  const errors = [];
  if (!baseHasSnapshot) {
    if (!currentHasSnapshot)
      errors.push('Bootstrap requires the initial version snapshot');
    if (labels.includes('v1-exception'))
      errors.push('The foundation must not use the v1-exception label');
    return { errors, bootstrap: true };
  }
  const touched = changedFiles.filter(isFrozen);
  if (!labels.includes('v1-exception')) {
    if (touched.length)
      errors.push(
        `V1 is frozen; unlabelled snapshot changes: ${touched.join(', ')}`,
      );
    return { errors, bootstrap: false };
  }
  const allowed = (file) =>
    SCHEMAS.has(file) ||
    [
      `${versions.v1.docsDir}/graphql-api/`,
      `${versions.v1.docsDir}/tutorials/queries/`,
    ].some((prefix) => file.startsWith(prefix) && /\.mdx?$/.test(file));
  for (const file of changedFiles)
    if (!allowed(file))
      errors.push(
        `V1 exception may change only GraphQL query docs and pinned schemas: ${file}`,
      );
  if (!changedFiles.length) errors.push('V1 exception has no changes');
  if (
    !nightlyRun ||
    nightlyRun.event !== 'schedule' ||
    nightlyRun.conclusion !== 'failure' ||
    nightlyRun.path !== '.github/workflows/validate-graphql.yml' ||
    nightlyRun.repository?.full_name !== repository
  )
    errors.push(
      'V1 exception must link a verified failed nightly validate-graphql run in this repository',
    );
  return { errors, bootstrap: false };
}
function runFreeze(root = ROOT, env = process.env) {
  const opts = { cwd: root, encoding: 'utf8' };
  if (
    spawnSync('git', ['rev-parse', '--verify', 'origin/main'], opts).status !==
    0
  )
    throw new Error(
      'Missing origin/main; freeze checks require fetch-depth: 0',
    );
  const baseHasSnapshot =
    spawnSync(
      'git',
      ['cat-file', '-e', 'origin/main:_data_versions.json'],
      opts,
    ).status === 0;
  const changedFiles = execFileSync(
    'git',
    ['diff', '--name-only', 'origin/main...HEAD'],
    opts,
  )
    .trim()
    .split('\n')
    .filter(Boolean);
  const event = env.GITHUB_EVENT_PATH
    ? JSON.parse(fs.readFileSync(env.GITHUB_EVENT_PATH, 'utf8'))
    : {};
  const labels = (event.pull_request?.labels || []).map((label) => label.name);
  const repository = env.GITHUB_REPOSITORY;
  let nightlyRun;
  if (labels.includes('v1-exception') && baseHasSnapshot) {
    const urls =
      (event.pull_request?.body || '').match(
        /https:\/\/github\.com\/[^\s)<>]+\/actions\/runs\/\d+/g,
      ) || [];
    const url = urls.find((candidate) =>
      candidate.startsWith(`https://github.com/${repository}/actions/runs/`),
    );
    if (url) {
      const runId = url.split('/').at(-1);
      nightlyRun = JSON.parse(
        execFileSync(
          'gh',
          ['api', `repos/${repository}/actions/runs/${runId}`],
          { ...opts, env, stdio: ['ignore', 'pipe', 'pipe'] },
        ),
      );
    }
  }
  const result = validateFreeze({
    baseHasSnapshot,
    currentHasSnapshot: fs.existsSync(path.join(root, '_data_versions.json')),
    changedFiles,
    labels,
    nightlyRun,
    repository,
  });
  if (result.bootstrap && !result.errors.length) {
    // Main remains pre-foundation throughout the consolidated PR. Re-run the
    // original byte proof at every checkpoint; bootstrap is not a content bypass.
    if (
      spawnSync(
        'git',
        [
          'merge-base',
          '--is-ancestor',
          versions.v1.sourceCommit,
          'origin/main',
        ],
        opts,
      ).status !== 0
    )
      throw new Error('Snapshot base must be an ancestor of origin/main');
    const snapshot = require('./validate-v1-snapshot').validateSnapshot(root);
    result.errors.push(...snapshot.failures);
  }
  return result;
}
function validateCoverage({
  packageJson,
  cspell,
  tailwind,
  workflows,
  scripts,
  sdkConfig,
  hasReleaseManifest = false,
}) {
  const errors = [];
  const current = versions.current.docsDir;
  const versioned = versions.v1.docsDir.split('/')[0];
  if (
    !(
      tailwind.includes(current) ||
      tailwind.includes(`./${current.split('/')[0]}/**`)
    ) ||
    !tailwind.includes(versioned)
  )
    errors.push('Tailwind must include both docs trees');
  const staged = Object.keys(packageJson['lint-staged'] || {});
  if (
    !staged.some((glob) => glob.includes(current)) ||
    !staged.some((glob) => glob.includes(versioned))
  )
    errors.push('lint-staged must cover both docs trees');
  for (const [name, source] of Object.entries(workflows)) {
    if (source.includes(current) && !source.includes(versioned))
      errors.push(`${name} watches current docs without the snapshot`);
    for (const use of source.matchAll(/^\s*(?:-\s*)?uses:\s*([^\s#]+)/gm))
      if (!use[1].startsWith('./') && !/@[0-9a-f]{40}$/.test(use[1]))
        errors.push(`${name} contains an unpinned action: ${use[1]}`);
  }
  const checkLinks = workflows['check-links.yml'] || '';
  const quality = workflows['quality.yml'] || '';
  if (/^\s+paths:/m.test(checkLinks))
    errors.push('check-links must run on every PR');
  if (/^\s+paths:/m.test(quality) || !/fetch-depth:\s*0/.test(quality))
    errors.push('quality must run on every PR with full history');
  if (!/node-version:\s*['"]?22\.(?:1[89]|[2-9]\d)\./.test(checkLinks))
    errors.push('check-links tests require explicit Node >=22.18');
  const expectedSpell = `cspell --no-progress "${current}/**/*.{md,mdx}"`;
  if (packageJson.scripts?.['spell-check'] !== expectedSpell)
    errors.push('spell-check must cover current Markdown and MDX only');
  if (!/^\d+\.\d+\.\d+$/.test(packageJson.devDependencies?.cspell || ''))
    errors.push('cspell must be an exact devDependency');
  if (!cspell.ignorePaths?.includes(`${versioned}/**`))
    errors.push('cspell must ignore the frozen snapshot');
  for (const [name, source] of Object.entries(scripts)) {
    if (name.endsWith('.test.js')) continue;
    if (source.includes(current))
      errors.push(`${name} hard-codes the current docs directory`);
    if (
      /docusaurus\.config\.js/.test(source) &&
      /fromRegex|configContent\.match/.test(source)
    )
      errors.push(`${name} regex-parses Docusaurus config`);
  }
  if (
    JSON.stringify(sdkConfig.versions?.v2?.include) !==
    JSON.stringify([`${current}/**`])
  )
    errors.push('V2 SDK includes must cover current docs');
  if (
    !sdkConfig.versions?.v1?.include?.every(
      (glob) =>
        glob.startsWith(`${versions.v1.docsDir}/`) ||
        glob === `${current}/get-started/migrate-from-v1.md`,
    )
  )
    errors.push('V1 SDK includes must use version-table snapshot paths');
  const llms = workflows['generate-llms-txt.yml'] || '';
  if (hasReleaseManifest) {
    for (const name of ['quality.yml', 'validate-sdk-examples.yml'])
      if (
        !workflows[name]?.includes(
          'npm ci --ignore-scripts --prefix examples/v2',
        )
      )
        errors.push(
          `${name} must install isolated V2 dependencies without lifecycle scripts`,
        );
    for (const command of [
      'npm run check-release-pins',
      'node scripts/sync-generated-blocks.js --check',
      'node scripts/sync-example-snippets.js --check',
      'node scripts/validate-core-api-examples.js',
    ])
      if (!quality.includes(command))
        errors.push(`quality must run ${command}`);
    if (!llms.includes('static/intuition-release.json'))
      errors.push('llms generation must watch the release manifest');
  }
  for (const version of Object.values(versions))
    if (!llms.includes(`${version.llmsDir}/llms*.txt`))
      errors.push(
        `llms bot must validate and commit outputs in ${version.llmsDir}`,
      );
  return errors;
}
function run(root = ROOT) {
  const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
  const errors = validateCoverage({
    packageJson: JSON.parse(read('package.json')),
    cspell: JSON.parse(read('cspell.json')),
    tailwind: read('tailwind.config.cjs'),
    workflows: Object.fromEntries(
      walkFiles(path.join(root, '.github/workflows'))
        .filter((file) => /\.ya?ml$/.test(file))
        .map((file) => [path.basename(file), fs.readFileSync(file, 'utf8')]),
    ),
    scripts: Object.fromEntries(
      fs
        .readdirSync(path.join(root, 'scripts'))
        .filter((name) => name.endsWith('.js'))
        .map((name) => [name, read(`scripts/${name}`)]),
    ),
    sdkConfig: JSON.parse(read('scripts/sdk-examples.config.json')),
    hasReleaseManifest: fs.existsSync(
      path.join(root, 'static/intuition-release.json'),
    ),
  });
  const labelFiles = [
    ...walkFiles(path.join(root, 'src/theme')),
    ...['llms.txt', 'llms-medium.txt', 'llms-full.txt'].map((name) =>
      path.join(root, versions.current.llmsDir, name),
    ),
  ].filter((file) => fs.existsSync(file));
  for (const file of labelFiles)
    if (/SDK [34]\.x|protocol [23]\.x/i.test(fs.readFileSync(file, 'utf8')))
      errors.push(
        `${path.relative(root, file)} uses a package semver range as a documentation generation label`,
      );
  return errors;
}
if (require.main === module) {
  try {
    if (process.argv.includes('--freeze')) {
      const result = runFreeze();
      if (result.errors.length) throw new Error(result.errors.join('\n'));
      console.log(
        `V1 freeze PASS: ${result.bootstrap ? 'initial snapshot byte proof retained' : 'snapshot unchanged or verified narrow GraphQL exception'}.`,
      );
    } else {
      const errors = run();
      if (errors.length) throw new Error(errors.join('\n'));
      console.log(
        'Configuration coverage PASS: both versions covered; explicit V2-only spell and structure gates.',
      );
    }
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
module.exports = { isFrozen, validateFreeze, runFreeze, validateCoverage, run };
