#!/usr/bin/env node
'use strict';

/**
 * Validate route parity across llms.txt, llms-full.txt, and llms-medium.txt.
 *
 * The generator owns route eligibility. This validator imports its shared
 * section walk so category shells and internal files cannot drift here.
 *
 * Zero external dependencies — uses only Node.js built-ins.
 */

const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');
const {
  BASE_URL,
  DOCS_DIR,
  getEligibleSections,
  INDEX_DIRECTORY_INTRO,
  readCuratedIndexSource,
} = require('./generate-llms-full');

const ROOT = path.resolve(__dirname, '..');
const STATIC_DIR = path.join(ROOT, 'static');
const LINK_VALIDATOR = path.join(__dirname, 'validate-internal-links.js');
const OMISSION_FIXTURE = path.join(
  __dirname,
  '__fixtures__',
  'llms-coverage',
  'directory-with-omission.md',
);
const INDEX_DIRECTORY_MARKER = `\n${INDEX_DIRECTORY_INTRO}\n\n`;

function sorted(values) {
  return [...values].sort();
}

function extractFullRoutes(content) {
  return [
    ...content.matchAll(
      new RegExp(
        `^Source: ${BASE_URL.replace(/\./g, '\\.')}(\\/docs(?:\\/[^\\s#?]*)?)\\s*$`,
        'gm',
      ),
    ),
  ].map((match) => match[1]);
}

function extractMediumRoutes(content) {
  return [
    ...content.matchAll(
      new RegExp(
        `^source: "${BASE_URL.replace(/\./g, '\\.')}(\\/docs(?:\\/[^"#?]*)?)"\\s*$`,
        'gm',
      ),
    ),
  ].map((match) => match[1]);
}

function extractIndexDirectory(content) {
  const markerIndex = content.lastIndexOf(INDEX_DIRECTORY_MARKER);
  if (markerIndex === -1) {
    throw new Error(
      'llms.txt is missing the generator-owned Optional directory marker',
    );
  }
  return content.slice(markerIndex + INDEX_DIRECTORY_MARKER.length);
}

function extractIndexRoutes(content) {
  const directory = extractIndexDirectory(content);
  const linkPattern = new RegExp(
    `^- \\[[^\\]\\n]+\\]\\(${BASE_URL.replace(/\./g, '\\.')}(\\/docs(?:\\/[^)\\s#?]*)?)\\)\\s*$`,
    'gm',
  );
  return [...directory.matchAll(linkPattern)].map((match) => match[1]);
}

function findDuplicates(routes) {
  const seen = new Set();
  const duplicates = new Set();
  for (const route of routes) {
    if (seen.has(route)) duplicates.add(route);
    seen.add(route);
  }
  return sorted(duplicates);
}

function compareRouteSets(label, expectedRoutes, actualRoutes) {
  const expected = new Set(expectedRoutes);
  const actual = new Set(actualRoutes);
  const missing = sorted([...expected].filter((route) => !actual.has(route)));
  const extra = sorted([...actual].filter((route) => !expected.has(route)));
  const duplicates = findDuplicates(actualRoutes);

  if (missing.length || extra.length || duplicates.length) {
    const details = [
      `${label}: ${missing.length} missing, ${extra.length} extra, ${duplicates.length} duplicate`,
    ];
    if (missing.length) details.push(`missing: ${missing.join(', ')}`);
    if (extra.length) details.push(`extra: ${extra.join(', ')}`);
    if (duplicates.length) details.push(`duplicate: ${duplicates.join(', ')}`);
    throw new Error(details.join('\n'));
  }

  return { expected: expected.size, actual: actual.size, missing: 0, extra: 0 };
}

function runOmissionFixture() {
  const fixture = fs.readFileSync(OMISSION_FIXTURE, 'utf-8');
  const expected = [
    '/docs/fixture/included',
    '/docs/fixture/intentionally-omitted',
  ];
  compareRouteSets('omission fixture', expected, extractIndexRoutes(fixture));
}

function proveOmissionFixtureFails() {
  const result = spawnSync(
    process.execPath,
    [__filename, '--self-test-omission'],
    {
      cwd: ROOT,
      encoding: 'utf-8',
    },
  );
  const output = `${result.stdout || ''}${result.stderr || ''}`.trim();

  if (result.status === 0) {
    throw new Error('omission self-test unexpectedly passed');
  }
  if (!output.includes('/docs/fixture/intentionally-omitted')) {
    throw new Error(
      `omission self-test failed for the wrong reason:\n${output}`,
    );
  }

  const failureSummary = output
    .split('\n')
    .find((line) => line.includes('missing:'));
  console.log(
    `✅ Omission self-test captured expected failure (exit ${result.status})`,
  );
  console.log(`   ${failureSummary.trim()}`);
}

function validateCuratedLinks(curated, curatedTargets, curatedRoutes) {
  // Invoke the canonical validator rather than copying its route and redirect rules.
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'llms-curated-links-'));
  const tempFile = path.join(tempDir, 'llms-curated.txt');

  try {
    fs.writeFileSync(tempFile, curated, 'utf-8');
    const result = spawnSync(process.execPath, [LINK_VALIDATOR, tempFile], {
      cwd: ROOT,
      encoding: 'utf-8',
    });
    if (result.status !== 0) {
      const output = `${result.stdout || ''}${result.stderr || ''}`.trim();
      throw new Error(`curated link validation failed:\n${output}`);
    }
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }

  const staticTargets = curatedTargets.filter(
    (target) => !target.startsWith('/docs'),
  );
  const unresolvedStaticTargets = staticTargets.filter((target) => {
    const artifactPath = path.resolve(STATIC_DIR, target.replace(/^\/+/, ''));
    return (
      !artifactPath.startsWith(`${STATIC_DIR}${path.sep}`) ||
      !fs.existsSync(artifactPath) ||
      !fs.statSync(artifactPath).isFile()
    );
  });

  if (unresolvedStaticTargets.length) {
    throw new Error(
      `curated index links to missing static artifacts: ${unresolvedStaticTargets.join(', ')}`,
    );
  }

  console.log(
    `✅ Curated links: ${curatedTargets.length}/${curatedTargets.length} same-origin targets resolve (${curatedRoutes.length} docs routes, ${staticTargets.length} static artifacts)`,
  );
}

function extractCuratedTargets(curated) {
  const linkPattern = new RegExp(
    `\\]\\(${BASE_URL.replace(/\./g, '\\.')}(\\/[^)#?]*)(?:[?#][^)]*)?\\)`,
    'g',
  );
  return [...curated.matchAll(linkPattern)].map((match) => match[1]);
}

function extractCuratedRoutes(curated) {
  const linkPattern = new RegExp(
    `\\]\\(${BASE_URL.replace(/\./g, '\\.')}(\\/docs(?:\\/[^)#?]*)?)(?:[?#][^)]*)?\\)`,
    'g',
  );
  return [...curated.matchAll(linkPattern)].map((match) => match[1]);
}

function topLevelArea(sourceFile) {
  const relative = path.relative(DOCS_DIR, sourceFile);
  const parts = relative.split(path.sep);
  return parts.length > 1 ? parts[0] : null;
}

function validateCuratedAreaCoverage(sections, curatedRoutes) {
  const areaByRoute = new Map(
    sections.map((section) => [
      section.route,
      topLevelArea(section.sourceFile),
    ]),
  );
  const expectedAreas = new Set([...areaByRoute.values()].filter(Boolean));
  const curatedAreas = new Set(
    curatedRoutes.map((route) => areaByRoute.get(route)).filter(Boolean),
  );
  const missingAreas = sorted(
    [...expectedAreas].filter((area) => !curatedAreas.has(area)),
  );

  if (missingAreas.length) {
    throw new Error(
      `curated index misses top-level docs areas: ${missingAreas.join(', ')}`,
    );
  }

  console.log(
    `✅ Curated area coverage: ${curatedAreas.size}/${expectedAreas.size} top-level docs areas`,
  );
}

function readArtifact(name) {
  return fs.readFileSync(path.join(STATIC_DIR, name), 'utf-8');
}

function validateRealArtifacts() {
  const sections = getEligibleSections();
  const expectedRoutes = sections.map((section) => section.route);
  const duplicateEligibleRoutes = findDuplicates(expectedRoutes);
  if (duplicateEligibleRoutes.length) {
    throw new Error(
      `generator emitted duplicate eligible routes: ${duplicateEligibleRoutes.join(', ')}`,
    );
  }

  const fullRoutes = extractFullRoutes(readArtifact('llms-full.txt'));
  const mediumRoutes = extractMediumRoutes(readArtifact('llms-medium.txt'));
  const index = readArtifact('llms.txt');
  const indexRoutes = extractIndexRoutes(index);

  for (const [label, routes] of [
    ['llms-full.txt', fullRoutes],
    ['llms-medium.txt', mediumRoutes],
    ['llms.txt Optional directory', indexRoutes],
  ]) {
    const totals = compareRouteSets(label, expectedRoutes, routes);
    console.log(
      `✅ ${label}: ${totals.actual}/${totals.expected} routes (0 missing, 0 extra)`,
    );
  }

  const curated = readCuratedIndexSource();
  if (!index.startsWith(`${curated}${INDEX_DIRECTORY_MARKER}`)) {
    throw new Error(
      'llms.txt curated prefix or generated directory boundary differs from scripts/llms-index-source.md',
    );
  }
  const curatedTargets = extractCuratedTargets(curated);
  const curatedRoutes = extractCuratedRoutes(curated);
  validateCuratedLinks(curated, curatedTargets, curatedRoutes);
  validateCuratedAreaCoverage(sections, curatedRoutes);
}

function main() {
  if (process.argv.includes('--self-test-omission')) {
    runOmissionFixture();
    throw new Error('omission self-test unexpectedly passed');
  }

  proveOmissionFixtureFails();
  validateRealArtifacts();
  console.log('✅ llms coverage validation passed');
}

try {
  main();
} catch (error) {
  console.error(`❌ ${error.message}`);
  process.exitCode = 1;
}
