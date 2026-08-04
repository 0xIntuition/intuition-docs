#!/usr/bin/env node
'use strict';

/**
 * Extract and typecheck selected SDK documentation examples.
 *
 * The default command first proves the checker with one passing and one
 * intentionally failing fixture, then validates the configured documentation.
 * Every mode uses the same Markdown extraction and temp-project tsc pipeline.
 *
 * Usage:
 *   node scripts/validate-sdk-examples.js              # self-test + real docs
 *   node scripts/validate-sdk-examples.js --self-test  # fixtures only
 *   node scripts/validate-sdk-examples.js --real-only  # real docs only
 *   node scripts/validate-sdk-examples.js --update-ratchet
 *   node scripts/validate-sdk-examples.js --demo-ratchet-regression
 */

const crypto = require('crypto');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const CONFIG_PATH = path.join(__dirname, 'sdk-examples.config.json');
const FIXTURES_DIR = path.join(__dirname, '__fixtures__', 'sdk-examples');
const TYPESCRIPT_EXTENSIONS = new Set(['.md', '.mdx']);
const IMPORT_PATTERN =
  /(?:^|\n)\s*import(?:\s+type)?[\s\S]*?\sfrom\s+['"]@0xintuition\/[^'"]+['"]/m;

function parseArgs(argv) {
  const flags = new Set(argv.slice(2));
  const knownFlags = new Set([
    '--self-test',
    '--real-only',
    '--update-ratchet',
    '--demo-ratchet-regression',
  ]);

  for (const flag of flags) {
    if (!knownFlags.has(flag)) {
      throw new Error(`Unknown flag: ${flag}`);
    }
  }

  if (flags.has('--self-test') && flags.has('--real-only')) {
    throw new Error('--self-test and --real-only cannot be combined');
  }
  if (
    flags.has('--update-ratchet') &&
    (flags.has('--self-test') || flags.has('--demo-ratchet-regression'))
  ) {
    throw new Error(
      '--update-ratchet cannot be combined with --self-test or --demo-ratchet-regression',
    );
  }
  if (
    flags.has('--demo-ratchet-regression') &&
    (flags.has('--self-test') || flags.has('--real-only'))
  ) {
    throw new Error(
      '--demo-ratchet-regression cannot be combined with another mode',
    );
  }

  return {
    runSelfTest:
      !flags.has('--real-only') && !flags.has('--demo-ratchet-regression'),
    runRealDocs:
      !flags.has('--self-test') && !flags.has('--demo-ratchet-regression'),
    updateRatchet: flags.has('--update-ratchet'),
    demoRatchetRegression: flags.has('--demo-ratchet-regression'),
  };
}

function readConfig({ allowMissingFingerprints = false } = {}) {
  const sourceConfig = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));

  if (
    !Array.isArray(sourceConfig.include) ||
    sourceConfig.include.length === 0
  ) {
    throw new Error(`${path.relative(ROOT, CONFIG_PATH)} must define include`);
  }
  if (
    typeof sourceConfig.skipComment !== 'string' ||
    !sourceConfig.skipComment
  ) {
    throw new Error(
      `${path.relative(ROOT, CONFIG_PATH)} must define skipComment`,
    );
  }
  if (!Array.isArray(sourceConfig.knownFailing)) {
    throw new Error(
      `${path.relative(ROOT, CONFIG_PATH)} must define knownFailing`,
    );
  }

  const ratchetIds = new Set();
  const normalizedKnownFailing = [];
  const knownFailingGroups = [];
  for (const entry of sourceConfig.knownFailing) {
    if (!entry || typeof entry.reason !== 'string' || !entry.reason) {
      throw new Error('Every knownFailing entry needs a non-empty reason');
    }

    let fences;
    if (typeof entry.id === 'string') {
      fences = [{ id: entry.id, fingerprints: entry.fingerprints }];
    } else if (
      typeof entry.file === 'string' &&
      Array.isArray(entry.fences) &&
      entry.fences.every(
        (fence) =>
          (Number.isInteger(fence) && fence > 0) ||
          (fence && Number.isInteger(fence.line) && fence.line > 0),
      )
    ) {
      fences = entry.fences.map((fence) => ({
        id: `${entry.file}#L${Number.isInteger(fence) ? fence : fence.line}`,
        fingerprints: Number.isInteger(fence)
          ? undefined
          : fence.fingerprints,
      }));
    } else {
      throw new Error(
        'Every knownFailing entry needs either id or file plus positive fence entries',
      );
    }

    for (const fence of fences) {
      const { id, fingerprints } = fence;
      if (ratchetIds.has(id)) {
        throw new Error(`Duplicate knownFailing fence: ${id}`);
      }
      if (!allowMissingFingerprints || fingerprints !== undefined) {
        if (
          !Array.isArray(fingerprints) ||
          fingerprints.length === 0 ||
          fingerprints.some(
            (fingerprint) =>
              typeof fingerprint !== 'string' || !fingerprint,
          ) ||
          new Set(fingerprints).size !== fingerprints.length
        ) {
          throw new Error(
            `knownFailing fence ${id} needs a non-empty set of unique diagnostic fingerprints; run --update-ratchet`,
          );
        }
      }
      ratchetIds.add(id);
      normalizedKnownFailing.push({
        id,
        fingerprints: fingerprints || [],
        reason: entry.reason,
      });
    }
    knownFailingGroups.push({
      label: entry.file || entry.id,
      ids: fences.map((fence) => fence.id),
      reason: entry.reason,
    });
  }

  return {
    ...sourceConfig,
    knownFailing: normalizedKnownFailing,
    knownFailingGroups,
    sourceConfig,
  };
}

function assertInsideRoot(targetPath) {
  const relative = path.relative(ROOT, targetPath);
  if (relative.startsWith('..') || path.isAbsolute(relative)) {
    throw new Error(`Configured path escapes the repository: ${targetPath}`);
  }
}

function walkMarkdownFiles(directory) {
  const files = [];

  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkMarkdownFiles(entryPath));
    } else if (
      entry.isFile() &&
      TYPESCRIPT_EXTENSIONS.has(path.extname(entry.name))
    ) {
      files.push(entryPath);
    }
  }

  return files;
}

function expandIncludes(patterns) {
  const files = new Set();

  for (const pattern of patterns) {
    const recursive = pattern.endsWith('/**');
    const relativePath = recursive ? pattern.slice(0, -3) : pattern;
    const targetPath = path.resolve(ROOT, relativePath);
    assertInsideRoot(targetPath);

    if (!fs.existsSync(targetPath)) {
      throw new Error(`Configured include does not exist: ${pattern}`);
    }

    if (recursive) {
      for (const file of walkMarkdownFiles(targetPath)) files.add(file);
    } else if (TYPESCRIPT_EXTENSIONS.has(path.extname(targetPath))) {
      files.add(targetPath);
    } else {
      throw new Error(`Unsupported include pattern: ${pattern}`);
    }
  }

  return [...files].sort();
}

function closingFencePattern(marker) {
  return new RegExp(`^\\s*${marker[0]}{${marker.length},}\\s*$`);
}

function extractExamples(files, skipComment) {
  const examples = [];
  const coverage = {
    found: 0,
    extracted: 0,
    excludedByCriterion: 0,
    skippedByAnnotation: 0,
  };

  for (const file of files) {
    const relativeFile = path.relative(ROOT, file).split(path.sep).join('/');
    const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/);

    for (let index = 0; index < lines.length; index++) {
      const opening = lines[index].match(
        /^\s*(`{3,})(?:typescript|tsx|ts)\b.*$/i,
      );
      if (!opening) continue;
      coverage.found++;

      const fenceLine = index + 1;
      const content = [];
      const closingPattern = closingFencePattern(opening[1]);
      let closingIndex = index + 1;
      while (
        closingIndex < lines.length &&
        !closingPattern.test(lines[closingIndex])
      ) {
        content.push(lines[closingIndex]);
        closingIndex++;
      }

      if (closingIndex === lines.length) {
        throw new Error(
          `Unclosed TypeScript fence at ${relativeFile}:${fenceLine}`,
        );
      }

      const code = content.join('\n');
      const skipped = index > 0 && lines[index - 1].trim() === skipComment;
      if (skipped) {
        coverage.skippedByAnnotation++;
      } else if (IMPORT_PATTERN.test(code)) {
        examples.push({
          id: `${relativeFile}#L${fenceLine}`,
          sourceFile: relativeFile,
          fenceLine,
          code,
        });
        coverage.extracted++;
      } else {
        coverage.excludedByCriterion++;
      }

      index = closingIndex;
    }
  }

  return { examples, coverage };
}

function parseDiagnostics(output, virtualFiles) {
  const diagnostics = [];
  const unparsed = [];
  const diagnosticPattern = /^(.*)\((\d+),(\d+)\): error (TS\d+): (.*)$/;

  for (const line of output.split(/\r?\n/)) {
    if (!line.trim()) continue;
    const match = line.match(diagnosticPattern);
    if (!match) {
      if (/^\s+/.test(line) && diagnostics.length > 0) {
        const previous = diagnostics[diagnostics.length - 1];
        previous.message = `${previous.message} ${line.trim()}`;
        continue;
      }
      unparsed.push(line);
      continue;
    }

    const virtualName = path.basename(match[1]);
    const example = virtualFiles.get(virtualName);
    if (!example) {
      unparsed.push(line);
      continue;
    }

    const virtualLine = Number(match[2]);
    diagnostics.push({
      example,
      sourceLine: example.fenceLine + virtualLine,
      column: Number(match[3]),
      code: match[4],
      message: match[5],
    });
  }

  return { diagnostics, unparsed };
}

function typecheckExamples(examples) {
  const typescriptPath = path.join(
    ROOT,
    'node_modules',
    'typescript',
    'bin',
    'tsc',
  );
  const nodeModulesPath = path.join(ROOT, 'node_modules');

  if (!fs.existsSync(typescriptPath)) {
    throw new Error(
      'TypeScript is not installed; run npm install or npm ci first',
    );
  }
  if (!fs.existsSync(nodeModulesPath)) {
    throw new Error('node_modules is missing; run npm install or npm ci first');
  }

  const tempDirectory = fs.mkdtempSync(
    path.join(os.tmpdir(), 'intuition-sdk-examples-'),
  );
  const virtualFiles = new Map();

  try {
    fs.symlinkSync(
      nodeModulesPath,
      path.join(tempDirectory, 'node_modules'),
      process.platform === 'win32' ? 'junction' : 'dir',
    );

    examples.forEach((example, index) => {
      const virtualName = `example-${String(index + 1).padStart(4, '0')}.tsx`;
      virtualFiles.set(virtualName, example);
      fs.writeFileSync(
        path.join(tempDirectory, virtualName),
        `${example.code}\n`,
      );
    });

    const tsconfig = {
      compilerOptions: {
        target: 'ES2022',
        module: 'ESNext',
        moduleResolution: 'Bundler',
        lib: ['ES2022', 'DOM', 'DOM.Iterable'],
        types: ['node'],
        jsx: 'react-jsx',
        strict: true,
        noEmit: true,
        skipLibCheck: true,
        esModuleInterop: true,
        resolveJsonModule: true,
      },
      files: [...virtualFiles.keys()],
    };
    const tsconfigPath = path.join(tempDirectory, 'tsconfig.json');
    fs.writeFileSync(tsconfigPath, `${JSON.stringify(tsconfig, null, 2)}\n`);

    const result = spawnSync(
      process.execPath,
      [typescriptPath, '--project', tsconfigPath, '--pretty', 'false'],
      {
        cwd: tempDirectory,
        encoding: 'utf8',
        maxBuffer: 50 * 1024 * 1024,
      },
    );

    if (result.error) throw result.error;
    const output = [result.stdout, result.stderr].filter(Boolean).join('\n');
    const parsed = parseDiagnostics(output, virtualFiles);

    return {
      status: result.status,
      output,
      ...parsed,
    };
  } finally {
    fs.rmSync(tempDirectory, { recursive: true, force: true });
  }
}

function formatDiagnostic(diagnostic) {
  const { example } = diagnostic;
  return `${example.sourceFile}:${diagnostic.sourceLine}:${diagnostic.column} [fence ${example.id}] ${diagnostic.code}: ${diagnostic.message}`;
}

function fingerprintDiagnostics(diagnostics) {
  const occurrences = new Map();

  // A fingerprint is TS code + SHA-256(message) + same-message occurrence.
  // It deliberately omits line/column positions, so unrelated line shifts inside
  // a fence do not churn the ratchet while duplicate diagnostics remain counted.
  return diagnostics
    .map((diagnostic) => {
      const messageHash = crypto
        .createHash('sha256')
        .update(diagnostic.message)
        .digest('hex');
      const base = `${diagnostic.code}:${messageHash}`;
      const occurrence = (occurrences.get(base) || 0) + 1;
      occurrences.set(base, occurrence);
      return {
        diagnostic,
        fingerprint: `${base}#${occurrence}`,
      };
    })
    .sort((left, right) =>
      left.fingerprint.localeCompare(right.fingerprint),
    );
}

function groupDiagnosticsByFence(diagnostics) {
  const diagnosticsByFence = new Map();

  for (const diagnostic of diagnostics) {
    const fenceDiagnostics =
      diagnosticsByFence.get(diagnostic.example.id) || [];
    fenceDiagnostics.push(diagnostic);
    diagnosticsByFence.set(diagnostic.example.id, fenceDiagnostics);
  }

  return diagnosticsByFence;
}

function compareRatchet(diagnostics, knownFailing) {
  const ratchet = new Map(knownFailing.map((entry) => [entry.id, entry]));
  const diagnosticsByFence = groupDiagnosticsByFence(diagnostics);
  const unexpectedDiagnostics = diagnostics.filter(
    (diagnostic) => !ratchet.has(diagnostic.example.id),
  );
  const mismatches = [];

  for (const entry of knownFailing) {
    const actual = fingerprintDiagnostics(
      diagnosticsByFence.get(entry.id) || [],
    );
    const expected = new Set(entry.fingerprints);
    const actualSet = new Set(actual.map((item) => item.fingerprint));
    const added = actual.filter((item) => !expected.has(item.fingerprint));
    const missing = entry.fingerprints.filter(
      (fingerprint) => !actualSet.has(fingerprint),
    );

    if (added.length > 0 || missing.length > 0) {
      mismatches.push({ entry, added, missing });
    }
  }

  return { diagnosticsByFence, unexpectedDiagnostics, mismatches };
}

function formatCoverage(coverage) {
  return `Coverage: ${coverage.found} fences found / ${coverage.extracted} extracted / ${coverage.excludedByCriterion} excluded-by-criterion / ${coverage.skippedByAnnotation} skipped-by-annotation.`;
}

function printRatchetMismatches(mismatches, logger = console.error) {
  if (mismatches.length === 0) return;

  logger('  Ratcheted fence fingerprint mismatches:');
  for (const mismatch of mismatches) {
    logger(`    ${mismatch.entry.id}: ${mismatch.entry.reason}`);
    for (const item of mismatch.added) {
      logger(`      NEW ${item.fingerprint}: ${formatDiagnostic(item.diagnostic)}`);
    }
    for (const fingerprint of mismatch.missing) {
      logger(`      MISSING ${fingerprint}`);
    }
  }
}

function runSelfTest(config) {
  console.log('SDK examples self-test');
  const fixtureFiles = walkMarkdownFiles(FIXTURES_DIR).sort();
  const { examples, coverage } = extractExamples(
    fixtureFiles,
    config.skipComment,
  );
  const result = typecheckExamples(examples);
  const fixtureRatchet = JSON.parse(
    fs.readFileSync(path.join(FIXTURES_DIR, 'ratcheted.json'), 'utf8'),
  );
  const good = examples.find((example) =>
    example.sourceFile.endsWith('/good.md'),
  );
  const bad = examples.find((example) =>
    example.sourceFile.endsWith('/bad.md'),
  );
  const skipped = examples.find((example) =>
    example.sourceFile.endsWith('/skipped.md'),
  );
  const ratcheted = examples.find((example) =>
    example.sourceFile.endsWith('/ratcheted.md'),
  );

  if (!good || !bad || !ratcheted || skipped || examples.length !== 3) {
    throw new Error(
      `Expected good.md, bad.md, and ratcheted.md only; extracted ${examples.length}`,
    );
  }
  if (
    coverage.found !== 4 ||
    coverage.extracted !== 3 ||
    coverage.excludedByCriterion !== 0 ||
    coverage.skippedByAnnotation !== 1
  ) {
    throw new Error(`Unexpected fixture coverage: ${formatCoverage(coverage)}`);
  }

  const goodDiagnostics = result.diagnostics.filter(
    (diagnostic) => diagnostic.example.id === good.id,
  );
  const badDiagnostics = result.diagnostics.filter(
    (diagnostic) => diagnostic.example.id === bad.id,
  );
  const badMessages = badDiagnostics
    .map((diagnostic) => diagnostic.message)
    .join('\n');
  const ratchetedDiagnostics = result.diagnostics.filter(
    (diagnostic) => diagnostic.example.id === ratcheted.id,
  );

  if (goodDiagnostics.length > 0) {
    throw new Error(
      `Known-good fixture failed:\n${goodDiagnostics.map(formatDiagnostic).join('\n')}`,
    );
  }
  if (badDiagnostics.length === 0) {
    throw new Error('Known-bad fixture unexpectedly passed');
  }
  if (
    !badMessages.includes('createMultivault') ||
    !badMessages.includes('tripleId')
  ) {
    throw new Error(
      `Known-bad fixture did not prove both stale API checks:\n${badDiagnostics
        .map(formatDiagnostic)
        .join('\n')}`,
    );
  }
  if (result.unparsed.length > 0) {
    throw new Error(`Unmapped tsc output:\n${result.unparsed.join('\n')}`);
  }

  const baseline = compareRatchet(ratchetedDiagnostics, [fixtureRatchet]);
  if (
    baseline.unexpectedDiagnostics.length > 0 ||
    baseline.mismatches.length > 0
  ) {
    throw new Error('Ratcheted fixture does not match its fingerprint baseline');
  }

  const disappearedComparison = compareRatchet([], [fixtureRatchet]);
  const disappearedMismatch = disappearedComparison.mismatches[0];
  if (
    disappearedComparison.mismatches.length !== 1 ||
    disappearedMismatch.added.length !== 0 ||
    disappearedMismatch.missing.length !== 1 ||
    disappearedMismatch.missing[0] !== fixtureRatchet.fingerprints[0]
  ) {
    throw new Error(
      'Ratcheted-fence fixture did not reject a missing expected diagnostic',
    );
  }

  const injectedExample = {
    ...ratcheted,
    code: `${ratcheted.code}\n\nconst injectedRegression: string = 123;\nvoid injectedRegression;`,
  };
  const injectedResult = typecheckExamples([injectedExample]);
  const injectedComparison = compareRatchet(injectedResult.diagnostics, [
    fixtureRatchet,
  ]);
  const injectedMismatch = injectedComparison.mismatches[0];

  if (
    injectedResult.unparsed.length > 0 ||
    injectedComparison.unexpectedDiagnostics.length > 0 ||
    injectedComparison.mismatches.length !== 1 ||
    injectedMismatch.added.length !== 1 ||
    injectedMismatch.missing.length !== 0 ||
    injectedMismatch.added[0].diagnostic.code !== 'TS2322'
  ) {
    throw new Error(
      'Ratcheted-fence regression fixture did not reject exactly the injected diagnostic',
    );
  }

  console.log(`  ${formatCoverage(coverage)}`);
  console.log(`  PASS known-good fixture: ${good.id}`);
  console.log('  PASS immediately-preceding skip comment excluded skipped.md');
  console.log(
    `  PASS TSX ratchet baseline matched ${ratchetedDiagnostics.length} expected diagnostic fingerprint: ${fixtureRatchet.id}`,
  );
  console.log(
    '  PASS ratcheted-fence disappearance: missing expected fingerprint was rejected.',
  );
  console.log(
    `  PASS known-bad fixture failed with ${badDiagnostics.length} diagnostics:`,
  );
  for (const diagnostic of badDiagnostics) {
    console.log(`    ${formatDiagnostic(diagnostic)}`);
  }
  console.log(
    '  PASS ratcheted-fence-regression: injected bad line produced a fingerprint mismatch (validator outcome: FAIL as expected):',
  );
  console.log(
    `    NEW ${injectedMismatch.added[0].fingerprint}: ${formatDiagnostic(injectedMismatch.added[0].diagnostic)}`,
  );
  console.log(
    'Self-test PASS: good passed; known-bad failed; TSX extracted; ratcheted regression rejected.\n',
  );
}

function runRatchetedRegressionDemo(config) {
  console.log('SDK examples ratcheted regression demonstration');
  const fixtureFiles = walkMarkdownFiles(FIXTURES_DIR).sort();
  const { examples } = extractExamples(fixtureFiles, config.skipComment);
  const ratcheted = examples.find((example) =>
    example.sourceFile.endsWith('/ratcheted.md'),
  );
  const fixtureRatchet = JSON.parse(
    fs.readFileSync(path.join(FIXTURES_DIR, 'ratcheted.json'), 'utf8'),
  );

  if (!ratcheted) {
    throw new Error('Ratcheted regression fixture was not extracted');
  }

  const baselineResult = typecheckExamples([ratcheted]);
  const baseline = compareRatchet(baselineResult.diagnostics, [fixtureRatchet]);
  if (
    baselineResult.unparsed.length > 0 ||
    baseline.unexpectedDiagnostics.length > 0 ||
    baseline.mismatches.length > 0
  ) {
    throw new Error('Ratcheted regression fixture baseline did not match');
  }
  console.log(
    `  Baseline PASS: ${fixtureRatchet.id} matched its expected fingerprint set.`,
  );

  const injectedResult = typecheckExamples([
    {
      ...ratcheted,
      code: `${ratcheted.code}\n\nconst injectedRegression: string = 123;\nvoid injectedRegression;`,
    },
  ]);
  const injectedComparison = compareRatchet(injectedResult.diagnostics, [
    fixtureRatchet,
  ]);

  printRatchetMismatches(injectedComparison.mismatches);
  if (injectedComparison.mismatches.length === 0) {
    throw new Error('Injected ratcheted-fence regression incorrectly passed');
  }
  throw new Error(
    'Validation FAIL (expected demonstration): an injected diagnostic changed the ratcheted fence fingerprint set',
  );
}

function runRealDocs(config) {
  console.log('SDK documentation examples');
  const files = expandIncludes(config.include);
  const { examples, coverage } = extractExamples(files, config.skipComment);
  const result = typecheckExamples(examples);
  const ratchet = new Map(
    config.knownFailing.map((entry) => [entry.id, entry]),
  );
  const comparison = compareRatchet(result.diagnostics, config.knownFailing);
  const { diagnosticsByFence, unexpectedDiagnostics, mismatches } = comparison;

  const expectedDiagnostics = result.diagnostics.filter((diagnostic) =>
    ratchet.has(diagnostic.example.id),
  );

  console.log(`  Scanned ${files.length} Markdown/MDX files.`);
  console.log(`  ${formatCoverage(coverage)}`);

  if (expectedDiagnostics.length > 0) {
    console.log(
      `  Expected ratcheted failures (${diagnosticsByFence.size - new Set(unexpectedDiagnostics.map((diagnostic) => diagnostic.example.id)).size} fences, ${expectedDiagnostics.length} diagnostics):`,
    );
    for (const group of config.knownFailingGroups) {
      const diagnostics = group.ids.flatMap(
        (id) => diagnosticsByFence.get(id) || [],
      );
      if (diagnostics.length === 0) continue;
      console.log(
        `    ${group.label}: ${group.ids.length} fence${group.ids.length === 1 ? '' : 's'}, ${diagnostics.length} diagnostic${diagnostics.length === 1 ? '' : 's'} — ${group.reason}`,
      );
      console.log(`      Fences: ${group.ids.join(', ')}`);
      console.log(`      Representative: ${formatDiagnostic(diagnostics[0])}`);
    }
  }

  if (unexpectedDiagnostics.length > 0) {
    console.error(
      `  NEW failures (${unexpectedDiagnostics.length} diagnostics):`,
    );
    for (const diagnostic of unexpectedDiagnostics) {
      console.error(`    ${formatDiagnostic(diagnostic)}`);
    }
  }

  printRatchetMismatches(mismatches);

  if (result.unparsed.length > 0) {
    console.error('  Unmapped tsc output:');
    for (const line of result.unparsed) console.error(`    ${line}`);
  }

  const failed =
    unexpectedDiagnostics.length > 0 ||
    mismatches.length > 0 ||
    result.unparsed.length > 0 ||
    (result.status !== 0 && result.diagnostics.length === 0);

  if (failed) {
    throw new Error(
      'SDK documentation example validation failed. Fix diagnostics or deliberately refresh the existing baseline with --update-ratchet.',
    );
  }

  console.log(
    `Validation PASS: ${examples.length} fences checked; ${expectedDiagnostics.length} known diagnostics match the fingerprint ratchet; 0 new diagnostics; 0 missing diagnostics.\n`,
  );
}

function updateRatchet(config) {
  console.log('SDK documentation examples — update ratchet');
  const files = expandIncludes(config.include);
  const { examples, coverage } = extractExamples(files, config.skipComment);
  const result = typecheckExamples(examples);
  const ratchetIds = new Set(config.knownFailing.map((entry) => entry.id));
  const diagnosticsByFence = groupDiagnosticsByFence(result.diagnostics);
  const unexpectedDiagnostics = result.diagnostics.filter(
    (diagnostic) => !ratchetIds.has(diagnostic.example.id),
  );
  const cleanEntries = config.knownFailing.filter(
    (entry) => !diagnosticsByFence.has(entry.id),
  );

  console.log(`  Scanned ${files.length} Markdown/MDX files.`);
  console.log(`  ${formatCoverage(coverage)}`);

  if (unexpectedDiagnostics.length > 0) {
    console.error(
      `  NEW unratcheted failures (${unexpectedDiagnostics.length} diagnostics):`,
    );
    for (const diagnostic of unexpectedDiagnostics) {
      console.error(`    ${formatDiagnostic(diagnostic)}`);
    }
  }
  if (cleanEntries.length > 0) {
    console.error('  Ratchet entries with no diagnostics:');
    for (const entry of cleanEntries) {
      console.error(`    ${entry.id}: ${entry.reason}`);
    }
  }
  if (result.unparsed.length > 0) {
    console.error('  Unmapped tsc output:');
    for (const line of result.unparsed) console.error(`    ${line}`);
  }

  if (
    unexpectedDiagnostics.length > 0 ||
    cleanEntries.length > 0 ||
    result.unparsed.length > 0 ||
    (result.status !== 0 && result.diagnostics.length === 0)
  ) {
    throw new Error(
      'Ratchet update refused: fix unratcheted failures and remove now-clean fence entries first.',
    );
  }

  const updatedKnownFailing = config.sourceConfig.knownFailing.map((entry) => {
    if (typeof entry.id === 'string') {
      return {
        ...entry,
        fingerprints: fingerprintDiagnostics(
          diagnosticsByFence.get(entry.id) || [],
        ).map((item) => item.fingerprint),
      };
    }

    return {
      ...entry,
      fences: entry.fences.map((fence) => {
        const line = Number.isInteger(fence) ? fence : fence.line;
        const id = `${entry.file}#L${line}`;
        return {
          line,
          fingerprints: fingerprintDiagnostics(
            diagnosticsByFence.get(id) || [],
          ).map((item) => item.fingerprint),
        };
      }),
    };
  });
  const updatedConfig = {
    ...config.sourceConfig,
    knownFailing: updatedKnownFailing,
  };

  fs.writeFileSync(CONFIG_PATH, `${JSON.stringify(updatedConfig, null, 2)}\n`);
  console.log(
    `Ratchet update PASS: wrote ${config.knownFailing.length} fence baselines with ${result.diagnostics.length} diagnostic fingerprints to ${path.relative(ROOT, CONFIG_PATH)}.\n`,
  );
}

function main() {
  const args = parseArgs(process.argv);
  const config = readConfig({
    allowMissingFingerprints: args.updateRatchet,
  });

  if (args.demoRatchetRegression) runRatchetedRegressionDemo(config);
  if (args.runSelfTest) runSelfTest(config);
  if (args.runRealDocs) {
    if (args.updateRatchet) updateRatchet(config);
    else runRealDocs(config);
  }
}

try {
  main();
} catch (error) {
  console.error(`\nERROR: ${error.message}`);
  process.exitCode = 1;
}
