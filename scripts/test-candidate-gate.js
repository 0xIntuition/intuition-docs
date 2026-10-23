#!/usr/bin/env node
const assert = require('node:assert/strict');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const source = process.argv[2];
if (!source)
  throw new Error(
    'Usage: node scripts/test-candidate-gate.js /path/to/packages',
  );
const result = spawnSync(
  process.execPath,
  [
    path.join(__dirname, 'validate-candidate-examples.js'),
    source,
    '--fixture',
    path.join(__dirname, '__fixtures__/candidate-examples/broken-import.txt'),
  ],
  { encoding: 'utf8' },
);
if (result.error) throw result.error;
assert.equal(
  result.status,
  1,
  'Broken candidate import must exit with failure',
);
assert.match(
  result.stdout + result.stderr,
  /TS2305: Module '"@0xintuition\/sdk\/actions"' has no exported member 'candidateExportThatMustNotExist'/,
  'Failure must come from the deliberately broken import, not setup',
);
console.log(
  'Negative candidate gate passed: deliberately broken SDK import failed with TS2305 (exit 1).',
);
