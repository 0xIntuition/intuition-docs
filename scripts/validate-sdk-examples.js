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
const CONTENT_HASH_LENGTH = 16;
const IMPORT_PATTERN =
  /(?:^|\n)\s*import(?:\s+type)?[\s\S]*?\sfrom\s+['"]@0xintuition\/[^'"]+['"]/m;

function hashFenceContent(code) {
  return crypto
    .createHash('sha256')
    .update(code)
    .digest('hex')
    .slice(0, CONTENT_HASH_LENGTH);
}

function fenceIdentity(sourceFile, contentHash, ordinal = 1) {
  return `${sourceFile}#${contentHash}#${ordinal}`;
}

function displayFence(example) {
  return `${example.sourceFile}#L${example.fenceLine}`;
}

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

    if (typeof entry.file !== 'string' || !entry.file) {
      throw new Error('Every knownFailing entry needs a non-empty file');
    }
    if (!Array.isArray(entry.fences) || entry.fences.length === 0) {
      throw new Error(
        `knownFailing entry ${entry.file} needs a non-empty fences array`,
      );
    }

    const fences = entry.fences.map((fence) => {
      if (!fence || typeof fence !== 'object' || Array.isArray(fence)) {
        throw new Error(
          `Every fence in knownFailing entry ${entry.file} must be an object`,
        );
      }

      if (
        typeof fence.contentHash === 'string' &&
        new RegExp(`^[0-9a-f]{${CONTENT_HASH_LENGTH}}$`).test(
          fence.contentHash,
        ) &&
        (fence.ordinal === undefined ||
          (Number.isInteger(fence.ordinal) && fence.ordinal > 0))
      ) {
        const ordinal = fence.ordinal || 1;
        return {
          id: fenceIdentity(entry.file, fence.contentHash, ordinal),
          file: entry.file,
          contentHash: fence.contentHash,
          ordinal,
          fingerprints: fence.fingerprints,
        };
      }

      throw new Error(
        `Every fence in knownFailing entry ${entry.file} needs a ${CONTENT_HASH_LENGTH}-character lowercase hex contentHash and optional positive ordinal`,
      );
    });

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
            (fingerprint) => typeof fingerprint !== 'string' || !fingerprint,
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
        ...fence,
        fingerprints: fingerprints || [],
        reason: entry.reason,
      });
    }
    knownFailingGroups.push({
      label: entry.file,
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

function emptyCoverage() {
  return {
    found: 0,
    extracted: 0,
    excludedByCriterion: 0,
    skippedByAnnotation: 0,
  };
}

function addCoverage(target, addition) {
  for (const key of Object.keys(target)) target[key] += addition[key];
}

function splitSourceLines(source) {
  const lines = [];
  let start = 0;

  while (start < source.length) {
    const newline = source.indexOf('\n', start);
    const end = newline === -1 ? source.length : newline + 1;
    const raw = source.slice(start, end);
    const withoutNewline = raw.endsWith('\n') ? raw.slice(0, -1) : raw;
    const text = withoutNewline.endsWith('\r')
      ? withoutNewline.slice(0, -1)
      : withoutNewline;
    lines.push({ start, end, text });
    start = end;
  }

  return lines;
}

function extractExamplesFromSource(relativeFile, source, skipComment) {
  const examples = [];
  const coverage = emptyCoverage();
  const candidates = [];
  const lines = splitSourceLines(source);

  for (let index = 0; index < lines.length; index++) {
    const opening = lines[index].text.match(
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
      !closingPattern.test(lines[closingIndex].text)
    ) {
      content.push(lines[closingIndex].text);
      closingIndex++;
    }

    if (closingIndex === lines.length) {
      throw new Error(
        `Unclosed TypeScript fence at ${relativeFile}:${fenceLine}`,
      );
    }

    const code = content.join('\n');
    const rawCode = source.slice(lines[index].end, lines[closingIndex].start);
    candidates.push({
      sourceFile: relativeFile,
      fenceLine,
      code,
      contentHash: hashFenceContent(rawCode),
      skipped: index > 0 && lines[index - 1].text.trim() === skipComment,
    });
    index = closingIndex;
  }

  const extractedCandidates = [];
  for (const candidate of candidates) {
    if (candidate.skipped) {
      coverage.skippedByAnnotation++;
    } else if (IMPORT_PATTERN.test(candidate.code)) {
      extractedCandidates.push(candidate);
    } else {
      coverage.excludedByCriterion++;
    }
  }

  // Ordinals count extracted fences only: a skipped or excluded neighbor with
  // an identical body must never shift a tracked fence's identity.
  const contentCounts = new Map();
  for (const candidate of extractedCandidates) {
    contentCounts.set(
      candidate.contentHash,
      (contentCounts.get(candidate.contentHash) || 0) + 1,
    );
  }

  const contentOrdinals = new Map();
  for (const candidate of extractedCandidates) {
    const ordinal = (contentOrdinals.get(candidate.contentHash) || 0) + 1;
    contentOrdinals.set(candidate.contentHash, ordinal);
    examples.push({
      id: fenceIdentity(relativeFile, candidate.contentHash, ordinal),
      sourceFile: relativeFile,
      fenceLine: candidate.fenceLine,
      code: candidate.code,
      contentHash: candidate.contentHash,
      contentOrdinal: ordinal,
      duplicateCount: contentCounts.get(candidate.contentHash),
    });
    coverage.extracted++;
  }

  return { examples, coverage };
}

function extractExamples(files, skipComment) {
  const examples = [];
  const coverage = emptyCoverage();

  for (const file of files) {
    const relativeFile = path.relative(ROOT, file).split(path.sep).join('/');
    const extracted = extractExamplesFromSource(
      relativeFile,
      fs.readFileSync(file, 'utf8'),
      skipComment,
    );
    examples.push(...extracted.examples);
    addCoverage(coverage, extracted.coverage);
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
  return `${example.sourceFile}:${diagnostic.sourceLine}:${diagnostic.column} [fence ${displayFence(example)}] ${diagnostic.code}: ${diagnostic.message}`;
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
    .sort((left, right) => left.fingerprint.localeCompare(right.fingerprint));
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

function resolveKnownFailing(config, examples) {
  const examplesById = new Map(
    examples.map((example) => [example.id, example]),
  );
  const resolvedByOriginalId = new Map();
  const knownFailing = config.knownFailing.map((entry) => {
    const example = examplesById.get(entry.id);
    const resolved = {
      ...entry,
      id: example ? example.id : entry.id,
      example,
    };
    resolvedByOriginalId.set(entry.id, resolved);
    return resolved;
  });

  const resolvedIds = new Set();
  for (const entry of knownFailing) {
    if (resolvedIds.has(entry.id)) {
      throw new Error(
        `Multiple knownFailing entries resolve to the same fence: ${formatRatchetEntry(entry)}`,
      );
    }
    resolvedIds.add(entry.id);
  }

  const knownFailingGroups = config.knownFailingGroups.map((group) => ({
    ...group,
    entries: group.ids.map((id) => resolvedByOriginalId.get(id)),
  }));

  return { knownFailing, knownFailingGroups };
}

function formatRatchetEntry(entry) {
  if (entry.example) return displayFence(entry.example);
  return `${entry.file} [content ${entry.contentHash}, ordinal ${entry.ordinal} not found]`;
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
    logger(
      `    ${formatRatchetEntry(mismatch.entry)}: ${mismatch.entry.reason}`,
    );
    for (const item of mismatch.added) {
      logger(
        `      NEW ${item.fingerprint}: ${formatDiagnostic(item.diagnostic)}`,
      );
    }
    for (const fingerprint of mismatch.missing) {
      logger(`      MISSING ${fingerprint}`);
    }
  }
}

function readFixtureRatchets(filename) {
  const fixture = JSON.parse(
    fs.readFileSync(path.join(FIXTURES_DIR, filename), 'utf8'),
  );
  const fences = fixture.fences || [fixture];

  return fences.map((fence) => {
    const ordinal = fence.ordinal || 1;
    return {
      id: fenceIdentity(fixture.file, fence.contentHash, ordinal),
      file: fixture.file,
      contentHash: fence.contentHash,
      ordinal,
      fingerprints: fence.fingerprints,
      reason: fixture.reason,
    };
  });
}

function attachExamples(entries, examples) {
  const examplesById = new Map(
    examples.map((example) => [example.id, example]),
  );
  return entries.map((entry) => ({
    ...entry,
    example: examplesById.get(entry.id),
  }));
}

function runSelfTest(config) {
  console.log('SDK examples self-test');
  const fixtureFiles = walkMarkdownFiles(FIXTURES_DIR).sort();
  const { examples, coverage } = extractExamples(
    fixtureFiles,
    config.skipComment,
  );
  const result = typecheckExamples(examples);
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
  const duplicates = examples.filter((example) =>
    example.sourceFile.endsWith('/duplicate.md'),
  );
  const fixtureRatchet = attachExamples(
    readFixtureRatchets('ratcheted.json'),
    examples,
  )[0];
  const duplicateRatchets = attachExamples(
    readFixtureRatchets('duplicate.json'),
    examples,
  );

  if (
    !good ||
    !bad ||
    !ratcheted ||
    skipped ||
    duplicates.length !== 2 ||
    examples.length !== 5
  ) {
    throw new Error(
      `Expected good.md, bad.md, ratcheted.md, and two duplicate.md fences only; extracted ${examples.length}`,
    );
  }
  if (
    coverage.found !== 6 ||
    coverage.extracted !== 5 ||
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
  const duplicateDiagnostics = result.diagnostics.filter((diagnostic) =>
    duplicates.some((example) => example.id === diagnostic.example.id),
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
    throw new Error(
      'Ratcheted fixture does not match its fingerprint baseline',
    );
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

  const ratchetedSource = fs.readFileSync(
    path.join(FIXTURES_DIR, 'ratcheted.md'),
    'utf8',
  );
  const movedExtraction = extractExamplesFromSource(
    ratcheted.sourceFile,
    `Moved fixture heading\n\n\n${ratchetedSource}`,
    config.skipComment,
  );
  const moved = movedExtraction.examples[0];
  const movedResult = typecheckExamples([moved]);
  const movedComparison = compareRatchet(
    movedResult.diagnostics,
    attachExamples([fixtureRatchet], [moved]),
  );

  if (
    !moved ||
    moved.id !== ratcheted.id ||
    moved.fenceLine === ratcheted.fenceLine ||
    movedResult.unparsed.length > 0 ||
    movedComparison.unexpectedDiagnostics.length > 0 ||
    movedComparison.mismatches.length > 0
  ) {
    throw new Error(
      'Moved-but-unchanged fixture did not validate against its existing content identity',
    );
  }

  const changedSource = ratchetedSource.replace(
    'void createMultivault;',
    'void createMultivault; // content changed',
  );
  const changedExtraction = extractExamplesFromSource(
    ratcheted.sourceFile,
    changedSource,
    config.skipComment,
  );
  const changed = changedExtraction.examples[0];
  const changedResult = typecheckExamples([changed]);
  const changedComparison = compareRatchet(changedResult.diagnostics, [
    fixtureRatchet,
  ]);
  const changedMismatch = changedComparison.mismatches[0];

  if (
    !changed ||
    changed.id === ratcheted.id ||
    changedResult.unparsed.length > 0 ||
    changedComparison.unexpectedDiagnostics.length !== 1 ||
    changedComparison.mismatches.length !== 1 ||
    changedMismatch.added.length !== 0 ||
    changedMismatch.missing.length !== 1
  ) {
    throw new Error(
      'Content-changed fixture did not fail as a new identity plus a missing old identity',
    );
  }

  const duplicateComparison = compareRatchet(
    duplicateDiagnostics,
    duplicateRatchets,
  );
  if (
    duplicates[0].contentHash !== duplicates[1].contentHash ||
    duplicates[0].contentOrdinal !== 1 ||
    duplicates[1].contentOrdinal !== 2 ||
    duplicates.some((example) => example.duplicateCount !== 2) ||
    duplicates[0].id === duplicates[1].id ||
    duplicateComparison.unexpectedDiagnostics.length > 0 ||
    duplicateComparison.mismatches.length > 0 ||
    duplicateComparison.diagnosticsByFence.size !== 2
  ) {
    throw new Error(
      'Duplicate-fence fixture did not assign and validate distinct document-order ordinals',
    );
  }

  const skipCrossedBefore = `${ratchetedSource}${config.skipComment}\n${ratchetedSource}`;
  const skipCrossedAfter = `${config.skipComment}\n${ratchetedSource}\n${ratchetedSource}`;
  const skipBeforeExtraction = extractExamplesFromSource(
    ratcheted.sourceFile,
    skipCrossedBefore,
    config.skipComment,
  );
  const skipAfterExtraction = extractExamplesFromSource(
    ratcheted.sourceFile,
    skipCrossedAfter,
    config.skipComment,
  );
  const skipBeforeTracked = skipBeforeExtraction.examples[0];
  const skipAfterTracked = skipAfterExtraction.examples[0];
  const skipCrossedResult = typecheckExamples([skipAfterTracked]);
  const skipCrossedComparison = compareRatchet(
    skipCrossedResult.diagnostics,
    attachExamples([fixtureRatchet], [skipAfterTracked]),
  );

  if (
    skipBeforeExtraction.examples.length !== 1 ||
    skipAfterExtraction.examples.length !== 1 ||
    skipBeforeExtraction.coverage.skippedByAnnotation !== 1 ||
    skipAfterExtraction.coverage.skippedByAnnotation !== 1 ||
    !skipBeforeTracked ||
    !skipAfterTracked ||
    skipBeforeTracked.id !== ratcheted.id ||
    skipAfterTracked.id !== ratcheted.id ||
    skipAfterTracked.contentOrdinal !== 1 ||
    skipCrossedResult.unparsed.length > 0 ||
    skipCrossedComparison.unexpectedDiagnostics.length > 0 ||
    skipCrossedComparison.mismatches.length > 0
  ) {
    throw new Error(
      'Skip-crossed fixture did not keep a tracked fence identity stable across an identical skipped fence',
    );
  }

  console.log(`  ${formatCoverage(coverage)}`);
  console.log(`  PASS known-good fixture: ${displayFence(good)}`);
  console.log('  PASS immediately-preceding skip comment excluded skipped.md');
  console.log(
    `  PASS TSX ratchet baseline matched ${ratchetedDiagnostics.length} expected diagnostic fingerprint: ${displayFence(ratcheted)}`,
  );
  console.log(
    '  PASS ratcheted-fence disappearance: missing expected fingerprint was rejected.',
  );
  console.log(
    `  PASS moved-but-unchanged: fence shifted from L${ratcheted.fenceLine} to L${moved.fenceLine} with content identity unchanged; validation PASS with NO ratchet update needed.`,
  );
  console.log(
    `  PASS content-changed: edited line at ${displayFence(changed)} changed the content identity; validation FAIL with 1 new-unratcheted diagnostic and 1 missing old ratchet entry (add+remove pair).`,
  );
  console.log(
    `  PASS duplicate-fence ordinals: identical failing fences at L${duplicates[0].fenceLine} and L${duplicates[1].fenceLine} received ordinals 1 and 2; both ratcheted and validation PASS.`,
  );
  console.log(
    `  PASS skip-crossed: tracked fence kept identity ${ratcheted.id.split('#').slice(1).join('#')} after moving across an identical skipped fence; validation PASS with NO ratchet update needed.`,
  );
  console.log(
    `  PASS known-bad fixture failed with ${badDiagnostics.length} diagnostics:`,
  );
  for (const diagnostic of badDiagnostics) {
    console.log(`    ${formatDiagnostic(diagnostic)}`);
  }
  console.log(
    'Self-test PASS: good passed; known-bad failed; TSX extracted; moved content stayed ratcheted; edited content failed; duplicate ordinals validated; skip-crossed identity stable.\n',
  );
}

function runRatchetedRegressionDemo(config) {
  console.log('SDK examples ratcheted regression demonstration');
  const sourceFile = 'scripts/__fixtures__/sdk-examples/ratcheted.md';
  const source = fs.readFileSync(
    path.join(FIXTURES_DIR, 'ratcheted.md'),
    'utf8',
  );
  const { examples } = extractExamplesFromSource(
    sourceFile,
    source,
    config.skipComment,
  );
  const ratcheted = examples[0];
  const fixtureRatchet = attachExamples(
    readFixtureRatchets('ratcheted.json'),
    examples,
  )[0];

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
    `  Baseline PASS: ${displayFence(ratcheted)} matched its expected fingerprint set.`,
  );

  const changedSource = source.replace(
    'void createMultivault;',
    'void createMultivault; // content changed',
  );
  const changed = extractExamplesFromSource(
    sourceFile,
    changedSource,
    config.skipComment,
  ).examples[0];
  const changedResult = typecheckExamples([changed]);
  const changedComparison = compareRatchet(changedResult.diagnostics, [
    fixtureRatchet,
  ]);

  if (changedComparison.unexpectedDiagnostics.length > 0) {
    console.error('  NEW unratcheted failures:');
    for (const diagnostic of changedComparison.unexpectedDiagnostics) {
      console.error(`    ${formatDiagnostic(diagnostic)}`);
    }
  }
  printRatchetMismatches(changedComparison.mismatches);
  if (
    changedComparison.unexpectedDiagnostics.length === 0 ||
    changedComparison.mismatches.length === 0
  ) {
    throw new Error('Content-edited ratcheted fence incorrectly passed');
  }
  throw new Error(
    'Validation FAIL (expected demonstration): edited fence content produced the required new-identity plus old-identity add+remove pair',
  );
}

function runRealDocs(config) {
  console.log('SDK documentation examples');
  const files = expandIncludes(config.include);
  const { examples, coverage } = extractExamples(files, config.skipComment);
  const result = typecheckExamples(examples);
  const resolved = resolveKnownFailing(config, examples);
  const ratchet = new Map(
    resolved.knownFailing.map((entry) => [entry.id, entry]),
  );
  const comparison = compareRatchet(result.diagnostics, resolved.knownFailing);
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
    for (const group of resolved.knownFailingGroups) {
      const diagnostics = group.entries.flatMap(
        (entry) => diagnosticsByFence.get(entry.id) || [],
      );
      if (diagnostics.length === 0) continue;
      console.log(
        `    ${group.label}: ${group.entries.length} fence${group.entries.length === 1 ? '' : 's'}, ${diagnostics.length} diagnostic${diagnostics.length === 1 ? '' : 's'} — ${group.reason}`,
      );
      console.log(
        `      Fences: ${group.entries.map(formatRatchetEntry).join(', ')}`,
      );
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
    `Validation PASS: ${examples.length} fences checked; ${resolved.knownFailing.length} ratcheted fences across ${resolved.knownFailingGroups.length} files; ${expectedDiagnostics.length} known diagnostics match the fingerprint ratchet; 0 new diagnostics; 0 missing diagnostics.\n`,
  );
}

function updateRatchet(config) {
  console.log('SDK documentation examples — update ratchet');
  const files = expandIncludes(config.include);
  const { examples, coverage } = extractExamples(files, config.skipComment);
  const result = typecheckExamples(examples);
  const resolved = resolveKnownFailing(config, examples);
  const ratchetIds = new Set(resolved.knownFailing.map((entry) => entry.id));
  const diagnosticsByFence = groupDiagnosticsByFence(result.diagnostics);
  const unexpectedDiagnostics = result.diagnostics.filter(
    (diagnostic) => !ratchetIds.has(diagnostic.example.id),
  );
  const cleanEntries = resolved.knownFailing.filter(
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
      console.error(`    ${formatRatchetEntry(entry)}: ${entry.reason}`);
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
    console.error(
      '  A content-edited ratcheted fence intentionally produces this add+remove pair: a new-unratcheted failure and an old ratchet entry with no diagnostics.',
    );
    throw new Error(
      'Ratchet update refused: fix unratcheted failures and remove now-clean fence entries first.',
    );
  }

  const updatedKnownFailing = resolved.knownFailingGroups.map((group) => {
    return {
      file: group.label,
      fences: group.entries.map((entry) => {
        const fence = {
          contentHash: entry.example.contentHash,
        };
        if (entry.example.duplicateCount > 1) {
          fence.ordinal = entry.example.contentOrdinal;
        }
        fence.fingerprints = fingerprintDiagnostics(
          diagnosticsByFence.get(entry.id) || [],
        ).map((item) => item.fingerprint);
        return fence;
      }),
      reason: group.reason,
    };
  });
  const updatedConfig = {
    ...config.sourceConfig,
    ratchetPolicy:
      'knownFailing groups exact source fence content by file and records the expected diagnostic fingerprint set for each fence. Fence identity uses a truncated SHA-256 content hash plus a document-order ordinal only for identical-content fences in the same file; source line numbers are display-only. Every listed fence is still typechecked. Any added or missing fingerprint fails CI; use --update-ratchet locally for a deliberate baseline refresh, and shrink the fence list when documentation fixes or docs-typecheck skip annotations merge.',
    knownFailing: updatedKnownFailing,
  };

  fs.writeFileSync(CONFIG_PATH, `${JSON.stringify(updatedConfig, null, 2)}\n`);
  console.log(
    `Ratchet update PASS: wrote ${resolved.knownFailing.length} content-keyed fence baselines across ${resolved.knownFailingGroups.length} files with ${result.diagnostics.length} diagnostic fingerprints to ${path.relative(ROOT, CONFIG_PATH)}.\n`,
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
