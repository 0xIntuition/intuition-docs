#!/usr/bin/env node
// Build only the manifest's code packages; never run CLI bundling or release tasks.
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const manifest = require('../static/intuition-release.json');
const source = process.argv[2] && path.resolve(process.argv[2]);
if (!source)
  throw new Error(
    'Usage: node scripts/build-candidate-packages.js /path/to/packages',
  );
const git = (...args) =>
  execFileSync('git', ['-C', source, ...args], { encoding: 'utf8' }).trim();
if (
  git('rev-parse', 'HEAD') !== manifest.source.commit ||
  git('status', '--porcelain')
)
  throw new Error('Build requires the clean, manifest-pinned candidate source');
const filters = [];
for (const pkg of manifest.packages) {
  const dir = path.join(source, 'packages', pkg.name.split('/')[1]);
  const actual = JSON.parse(
    fs.readFileSync(path.join(dir, 'package.json'), 'utf8'),
  );
  if (actual.version !== pkg.version)
    throw new Error(`Version mismatch: ${pkg.name}`);
  if (
    pkg.name === '@0xintuition/cli' ||
    !fs.existsSync(path.join(dir, 'tsconfig.build.json'))
  )
    continue;
  filters.push(`--filter=${pkg.name}`);
}
execFileSync('bun', ['run', 'build', '--', ...filters], {
  cwd: source,
  stdio: 'inherit',
});
if (git('status', '--porcelain'))
  throw new Error('Candidate build changed tracked source');
console.log(
  `Built ${filters.length} candidate code packages from ${manifest.source.commit}.`,
);
