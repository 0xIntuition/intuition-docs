#!/usr/bin/env node
// Install the documented npm artifacts in an isolated consumer, then check recipes.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const manifest = require('../static/intuition-release.json');

const temp = fs.mkdtempSync(
  path.join(os.tmpdir(), 'intuition-published-docs-'),
);
try {
  const dependencies = Object.fromEntries(
    manifest.packages.map((pkg) => [pkg.name, pkg.version]),
  );
  Object.assign(dependencies, {
    typescript: '5.9.3',
    viem: '2.31.4',
    react: '19.1.0',
    '@types/react': '19.1.10',
    '@tanstack/react-query': '5.90.2',
    wagmi: '2.15.4',
  });
  fs.writeFileSync(
    path.join(temp, 'package.json'),
    JSON.stringify(
      {
        name: 'intuition-docs-consumer',
        private: true,
        type: 'module',
        dependencies,
      },
      null,
      2,
    ),
  );
  execFileSync(
    'npm',
    [
      'install',
      '--ignore-scripts',
      '--no-audit',
      '--no-fund',
      '--registry=https://registry.npmjs.org',
    ],
    { cwd: temp, stdio: 'inherit' },
  );
  const lock = JSON.parse(
    fs.readFileSync(path.join(temp, 'package-lock.json'), 'utf8'),
  );
  for (const pkg of manifest.packages) {
    const actual = lock.packages[`node_modules/${pkg.name}`];
    assert.equal(actual?.version, pkg.version, `Version: ${pkg.name}`);
    assert.equal(
      actual?.integrity,
      pkg.registry.integrity,
      `Integrity: ${pkg.name}`,
    );
    const metadata = JSON.parse(
      fs.readFileSync(
        path.join(temp, 'node_modules', pkg.name, 'package.json'),
        'utf8',
      ),
    );
    assert.deepEqual(
      Object.keys(metadata.exports || {}),
      pkg.entrypoints,
      `Exports: ${pkg.name}`,
    );
    assert.deepEqual(
      metadata.peerDependencies || {},
      pkg.peers,
      `Peers: ${pkg.name}`,
    );
    assert.deepEqual(
      metadata.engines || {},
      pkg.engines,
      `Engines: ${pkg.name}`,
    );
  }
  execFileSync(
    process.execPath,
    [
      path.join(__dirname, 'validate-candidate-examples.js'),
      temp,
      '--installed',
    ],
    { stdio: 'inherit' },
  );
  console.log(
    `Verified all ${manifest.packages.length} npm artifacts against recorded integrity and metadata.`,
  );
} finally {
  fs.rmSync(temp, { recursive: true, force: true });
}
