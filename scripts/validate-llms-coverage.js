#!/usr/bin/env node
'use strict';

// Validate each configured bundle independently, including its curated index,
// authored-page directory, metadata headers, and page Source boundaries.
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { versions } = require('../docs-versions.config');
const {
  BASE_URL,
  getEligibleSections,
  getLastUpdatedMap,
  INDEX_DIRECTORY_INTRO,
  readCuratedIndexSource,
  generateHeader,
  selectedVersions,
} = require('./generate-llms-full');

const ROOT = path.resolve(__dirname, '..');
const STATIC_DIR = path.join(ROOT, versions.current.llmsDir);
const LINK_VALIDATOR = path.join(__dirname, 'validate-internal-links.js');
const INDEX_DIRECTORY_MARKER = `\n${INDEX_DIRECTORY_INTRO}\n\n`;

function sorted(values) {
  return [...values].sort();
}

function sourceRoute(url) {
  const parsed = new URL(url);
  if (parsed.origin !== BASE_URL || parsed.search || parsed.hash) {
    throw new Error(`Invalid page Source URL: ${url}`);
  }
  return parsed.pathname;
}

function stripFencedCode(content) {
  let fence = null;
  return content
    .split('\n')
    .map((line) => {
      const marker = line.match(/^ {0,3}(`{3,}|~{3,})/);
      if (fence) {
        if (
          marker &&
          marker[1][0] === fence[0] &&
          marker[1].length >= fence.length &&
          !line.slice(marker[0].length).trim()
        )
          fence = null;
        return '';
      }
      if (marker) {
        fence = marker[1];
        return '';
      }
      return line;
    })
    .join('\n');
}

function extractFullRoutes(content) {
  // Only the generator-owned page header counts: a Source line inside body
  // content or a code fence is not a section source.
  return [
    ...stripFencedCode(content).matchAll(/^# [^\n]+\n\nSource: (\S+)\s*$/gm),
  ].map((match) => sourceRoute(match[1]));
}

function extractMediumRoutes(content) {
  return [...content.matchAll(/^source: "([^"\n]+)"\s*$/gm)].map((match) =>
    sourceRoute(match[1]),
  );
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
  return [
    ...extractIndexDirectory(content).matchAll(
      /^- \[[^\]\n]+\]\(([^)\s]+)\)\s*$/gm,
    ),
  ].map((match) => sourceRoute(match[1]));
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
  return { expected: expected.size, actual: actual.size };
}

function runOmissionFixture(version) {
  const fixturePath = path.join(
    __dirname,
    '__fixtures__',
    'llms-coverage',
    `directory-with-omission.${version.name}.md`,
  );
  const fixture = fs.readFileSync(fixturePath, 'utf8');
  const expected = [
    `${version.routeBase}/fixture/included`,
    `${version.routeBase}/fixture/intentionally-omitted`,
  ];
  compareRouteSets(
    `${version.label} omission fixture`,
    expected,
    extractIndexRoutes(fixture),
  );
}

function proveOmissionFixtureFails(version) {
  const result = spawnSync(
    process.execPath,
    [__filename, '--self-test-omission', '--version', version.name],
    {
      cwd: ROOT,
      encoding: 'utf8',
    },
  );
  const output = `${result.stdout || ''}${result.stderr || ''}`.trim();
  const missing = `${version.routeBase}/fixture/intentionally-omitted`;
  if (result.status !== 1 || !output.includes(`missing: ${missing}`)) {
    throw new Error(
      `${version.label} omission self-test failed for the wrong reason (exit ${result.status}):\n${output}`,
    );
  }
  console.log(
    `✅ ${version.label} omission self-test captured expected failure (exit 1): ${missing}`,
  );
}

function extractCuratedTargets(curated) {
  return [...curated.matchAll(/\]\((https?:\/\/[^)\s]+)\)/g)]
    .map((match) => new URL(match[1]))
    .filter((url) => url.origin === BASE_URL)
    .map((url) => url.pathname);
}

function isDocRoute(target) {
  return (
    !target.endsWith('.txt') &&
    Object.values(versions).some(
      (version) =>
        target === version.routeBase ||
        target.startsWith(`${version.routeBase}/`),
    )
  );
}

function validateCuratedLinks(curated, curatedTargets, curatedRoutes) {
  // Use the canonical validator for authored routes and redirects.
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'llms-curated-links-'));
  try {
    const tempFile = path.join(tempDir, 'llms-curated.txt');
    fs.writeFileSync(tempFile, curated, 'utf8');
    const result = spawnSync(process.execPath, [LINK_VALIDATOR, tempFile], {
      cwd: ROOT,
      encoding: 'utf8',
    });
    if (result.status !== 0) {
      throw new Error(
        `curated link validation failed:\n${result.stdout || ''}${result.stderr || ''}`.trim(),
      );
    }
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
  const staticTargets = curatedTargets.filter((target) => !isDocRoute(target));
  const missing = staticTargets.filter((target) => {
    const file = path.resolve(STATIC_DIR, target.replace(/^\/+/, ''));
    return (
      !file.startsWith(`${STATIC_DIR}${path.sep}`) ||
      !fs.existsSync(file) ||
      !fs.statSync(file).isFile()
    );
  });
  if (missing.length)
    throw new Error(
      `curated index links to missing static artifacts: ${missing.join(', ')}`,
    );
  console.log(
    `✅ Curated links: ${curatedTargets.length}/${curatedTargets.length} same-origin targets resolve (${curatedRoutes.length} docs routes, ${staticTargets.length} static artifacts)`,
  );
}

function validateCuratedAreaCoverage(sections, curatedRoutes) {
  const areaByRoute = new Map(
    sections.map((section) => {
      const parts = section.relativePath.split('/');
      return [section.route, parts.length > 1 ? parts[0] : null];
    }),
  );
  const expected = new Set([...areaByRoute.values()].filter(Boolean));
  const actual = new Set(
    curatedRoutes.map((route) => areaByRoute.get(route)).filter(Boolean),
  );
  const missing = sorted([...expected].filter((area) => !actual.has(area)));
  if (missing.length)
    throw new Error(
      `curated index misses top-level docs areas: ${missing.join(', ')}`,
    );
  return { expected: expected.size, actual: actual.size };
}

function validateHeader(content, version, format) {
  const expected = generateHeader(version, format).trimEnd();
  if (!content.startsWith(`${expected}\n`)) {
    throw new Error(
      `${version.label} ${format} header differs from the required version, scope, and Other versions lines`,
    );
  }
  if (expected.split('\n').length > 10)
    throw new Error('Version header exceeds ten lines');
}

function validateSourceIsolation(routes, version) {
  const v1Base = versions.v1.routeBase;
  const isV1 = (route) => route === v1Base || route.startsWith(`${v1Base}/`);
  const invalid = routes.filter((route) =>
    version.name === 'v1' ? !isV1(route) : isV1(route),
  );
  if (invalid.length)
    throw new Error(
      `${version.label} page Source URLs cross version boundaries: ${invalid.join(', ')}`,
    );
}

function validateFrozenTimestamps(content, sections) {
  const datesByRoute = new Map();
  for (const block of content.matchAll(/^---\n([\s\S]*?)\n---$/gm)) {
    const source = block[1].match(/^source: "([^"\n]+)"$/m);
    const date = block[1].match(/^last_updated: "([^"\n]+)"$/m);
    if (source) datesByRoute.set(sourceRoute(source[1]), date?.[1]);
  }
  for (const section of sections) {
    if (datesByRoute.get(section.route) !== section.lastUpdated) {
      throw new Error(
        `V1 last_updated differs from frozen source history: ${section.route}`,
      );
    }
  }
}

function validateRealArtifacts(version) {
  const sections = getEligibleSections(version);
  if (!sections.length)
    throw new Error(`No authored pages found for ${version.label}`);
  if (version.name === 'v1') {
    console.log(
      `✅ V1 provenance: ${getLastUpdatedMap(version).size} source-file timestamps, ${sections.length} served pages (hidden sources excluded)`,
    );
  }
  const expectedRoutes = sections.map((section) => section.route);
  const duplicates = findDuplicates(expectedRoutes);
  if (duplicates.length)
    throw new Error(
      `generator emitted duplicate eligible routes: ${duplicates.join(', ')}`,
    );
  const read = (name) =>
    fs.readFileSync(path.join(ROOT, version.llmsDir, name), 'utf8');
  const full = read('llms-full.txt');
  const medium = read('llms-medium.txt');
  const index = read('llms.txt');
  for (const [format, content] of [
    ['full', full],
    ['medium', medium],
    ['index', index],
  ]) {
    validateHeader(content, version, format);
  }
  const fullRoutes = extractFullRoutes(full);
  const mediumRoutes = extractMediumRoutes(medium);
  validateSourceIsolation(fullRoutes, version);
  validateSourceIsolation(mediumRoutes, version);
  if (version.name === 'v1') validateFrozenTimestamps(medium, sections);
  for (const [label, routes] of [
    ['llms-full.txt', fullRoutes],
    ['llms-medium.txt', mediumRoutes],
    ['llms.txt Optional directory', extractIndexRoutes(index)],
  ]) {
    const totals = compareRouteSets(
      `${version.label} ${label}`,
      expectedRoutes,
      routes,
    );
    console.log(
      `✅ ${version.label} ${label}: ${totals.actual}/${totals.expected} routes (0 missing, 0 extra)`,
    );
  }
  const curated = readCuratedIndexSource(version);
  if (!index.startsWith(`${curated}${INDEX_DIRECTORY_MARKER}`)) {
    throw new Error(
      `llms.txt curated prefix differs from ${version.llmsIndexSource}`,
    );
  }
  const targets = extractCuratedTargets(curated);
  const routes = targets.filter(isDocRoute);
  validateCuratedLinks(curated, targets, routes);
  const areas = validateCuratedAreaCoverage(sections, routes);
  console.log(
    `✅ ${version.label} curated area coverage: ${areas.actual}/${areas.expected} top-level docs areas`,
  );
}

function main() {
  const selected = selectedVersions(process.argv.slice(2));
  for (const version of selected) {
    if (process.argv.includes('--self-test-omission')) {
      runOmissionFixture(version);
      throw new Error('omission self-test unexpectedly passed');
    }
    proveOmissionFixtureFails(version);
    validateRealArtifacts(version);
  }
  console.log('✅ llms coverage validation passed');
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    console.error(`❌ ${error.message}`);
    process.exitCode = 1;
  }
}

module.exports = {
  compareRouteSets,
  extractFullRoutes,
  extractMediumRoutes,
  extractIndexRoutes,
  extractCuratedTargets,
  validateCuratedAreaCoverage,
  validateHeader,
  validateSourceIsolation,
  validateFrozenTimestamps,
  runOmissionFixture,
  proveOmissionFixtureFails,
};
