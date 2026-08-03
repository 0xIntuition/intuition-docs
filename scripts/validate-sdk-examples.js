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
 */

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
  const knownFlags = new Set(['--self-test', '--real-only']);

  for (const flag of flags) {
    if (!knownFlags.has(flag)) {
      throw new Error(`Unknown flag: ${flag}`);
    }
  }

  if (flags.has('--self-test') && flags.has('--real-only')) {
    throw new Error('--self-test and --real-only cannot be combined');
  }

  return {
    runSelfTest: !flags.has('--real-only'),
    runRealDocs: !flags.has('--self-test'),
  };
}

function readConfig() {
  const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));

  if (!Array.isArray(config.include) || config.include.length === 0) {
    throw new Error(`${path.relative(ROOT, CONFIG_PATH)} must define include`);
  }
  if (typeof config.skipComment !== 'string' || !config.skipComment) {
    throw new Error(
      `${path.relative(ROOT, CONFIG_PATH)} must define skipComment`,
    );
  }
  if (!Array.isArray(config.knownFailing)) {
    throw new Error(
      `${path.relative(ROOT, CONFIG_PATH)} must define knownFailing`,
    );
  }

  const ratchetIds = new Set();
  const normalizedKnownFailing = [];
  const knownFailingGroups = [];
  for (const entry of config.knownFailing) {
    if (!entry || typeof entry.reason !== 'string' || !entry.reason) {
      throw new Error('Every knownFailing entry needs a non-empty reason');
    }

    let ids;
    if (typeof entry.id === 'string') {
      ids = [entry.id];
    } else if (
      typeof entry.file === 'string' &&
      Array.isArray(entry.fences) &&
      entry.fences.every((line) => Number.isInteger(line) && line > 0)
    ) {
      ids = entry.fences.map((line) => `${entry.file}#L${line}`);
    } else {
      throw new Error(
        'Every knownFailing entry needs either id or file plus positive fence lines',
      );
    }

    for (const id of ids) {
      if (ratchetIds.has(id)) {
        throw new Error(`Duplicate knownFailing fence: ${id}`);
      }
      ratchetIds.add(id);
      normalizedKnownFailing.push({ id, reason: entry.reason });
    }
    knownFailingGroups.push({
      label: entry.file || entry.id,
      ids,
      reason: entry.reason,
    });
  }

  config.knownFailing = normalizedKnownFailing;
  config.knownFailingGroups = knownFailingGroups;

  return config;
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

  for (const file of files) {
    const relativeFile = path.relative(ROOT, file).split(path.sep).join('/');
    const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/);

    for (let index = 0; index < lines.length; index++) {
      const opening = lines[index].match(/^\s*(`{3,})(?:typescript|ts)\b.*$/i);
      if (!opening) continue;

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
      if (!skipped && IMPORT_PATTERN.test(code)) {
        examples.push({
          id: `${relativeFile}#L${fenceLine}`,
          sourceFile: relativeFile,
          fenceLine,
          code,
        });
      }

      index = closingIndex;
    }
  }

  return examples;
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

function runSelfTest(config) {
  console.log('SDK examples self-test');
  const fixtureFiles = walkMarkdownFiles(FIXTURES_DIR).sort();
  const examples = extractExamples(fixtureFiles, config.skipComment);
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

  if (!good || !bad || skipped || examples.length !== 2) {
    throw new Error(
      `Expected exactly good.md and bad.md, extracted ${examples.length}`,
    );
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

  console.log(`  PASS known-good fixture: ${good.id}`);
  console.log('  PASS immediately-preceding skip comment excluded skipped.md');
  console.log(
    `  PASS known-bad fixture failed with ${badDiagnostics.length} diagnostics:`,
  );
  for (const diagnostic of badDiagnostics) {
    console.log(`    ${formatDiagnostic(diagnostic)}`);
  }
  console.log(
    'Self-test PASS: good passed; bad failed for stale export and result field.\n',
  );
}

function runRealDocs(config) {
  console.log('SDK documentation examples');
  const files = expandIncludes(config.include);
  const examples = extractExamples(files, config.skipComment);
  const result = typecheckExamples(examples);
  const ratchet = new Map(
    config.knownFailing.map((entry) => [entry.id, entry]),
  );
  const diagnosticsByFence = new Map();

  for (const diagnostic of result.diagnostics) {
    const diagnostics = diagnosticsByFence.get(diagnostic.example.id) || [];
    diagnostics.push(diagnostic);
    diagnosticsByFence.set(diagnostic.example.id, diagnostics);
  }

  const expectedDiagnostics = result.diagnostics.filter((diagnostic) =>
    ratchet.has(diagnostic.example.id),
  );
  const unexpectedDiagnostics = result.diagnostics.filter(
    (diagnostic) => !ratchet.has(diagnostic.example.id),
  );
  const staleRatchet = config.knownFailing.filter(
    (entry) => !diagnosticsByFence.has(entry.id),
  );

  console.log(`  Scanned ${files.length} Markdown/MDX files.`);
  console.log(`  Extracted ${examples.length} qualifying TypeScript fences.`);

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

  if (staleRatchet.length > 0) {
    console.error(
      '  Ratchet entries that no longer fail (remove or update them):',
    );
    for (const entry of staleRatchet)
      console.error(`    ${entry.id}: ${entry.reason}`);
  }

  if (result.unparsed.length > 0) {
    console.error('  Unmapped tsc output:');
    for (const line of result.unparsed) console.error(`    ${line}`);
  }

  const failed =
    unexpectedDiagnostics.length > 0 ||
    staleRatchet.length > 0 ||
    result.unparsed.length > 0 ||
    (result.status !== 0 && result.diagnostics.length === 0);

  if (failed) {
    throw new Error(
      'SDK documentation example validation failed. New failures must be fixed or explicitly ratcheted.',
    );
  }

  console.log(
    `Validation PASS: ${examples.length} fences checked; ${expectedDiagnostics.length} known diagnostics remain ratcheted; 0 new diagnostics.\n`,
  );
}

function main() {
  const args = parseArgs(process.argv);
  const config = readConfig();

  if (args.runSelfTest) runSelfTest(config);
  if (args.runRealDocs) runRealDocs(config);
}

try {
  main();
} catch (error) {
  console.error(`\nERROR: ${error.message}`);
  process.exitCode = 1;
}
