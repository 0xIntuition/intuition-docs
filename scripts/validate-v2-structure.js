#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { execFileSync, spawnSync } = require('node:child_process');
const { versions } = require('../docs-versions.config');
const { readDocs, docMetadata } = require('./lib/docs-tree');
const {
  readCodeFences,
  INTUITION_IMPORT_PATTERN,
} = require('./lib/markdown-fences');
const ROOT = path.resolve(__dirname, '..');
const TOP_LEVEL = new Set([
  'get-started',
  'agents',
  'concepts',
  'build',
  'examples',
  'reference',
  'core',
  'community',
]);
const KINDS = new Set(['tutorial', 'how-to', 'concept', 'reference']);
const READERS = new Set(['app', 'agent', 'operator', 'plugin']);
const GRAPHQL_PAGES = new Set([
  'build/read-with-sdk',
  'concepts/indexing-and-querying',
  'reference/packages/sdk',
  'reference/sdk/api',
  'get-started/migrate-from-v1',
]);
const READ_CLIENT_PAGES = new Set([
  'build/read-with-sdk',
  'reference/packages/sdk',
  'reference/sdk/api',
  'get-started/migrate-from-v1',
]);
const PHASE_COUNTS = [3, 61, 95, 114, 134];

function loadLaunchRoutes(text) {
  const rows = text
    .trim()
    .split(/\r?\n/)
    .map((line, index) => {
      const match = line.match(/^(\S+)\t([1-5])$/);
      if (!match)
        throw new Error(
          `Invalid launch route at line ${index + 1}: expected route<TAB>phase`,
        );
      return { route: match[1], phase: Number(match[2]) };
    });
  if (new Set(rows.map((row) => row.route)).size !== rows.length)
    throw new Error('Duplicate launch routes');
  for (const [index, count] of PHASE_COUNTS.entries()) {
    if (rows.filter((row) => row.phase <= index + 1).length !== count)
      throw new Error(
        `Launch route count for phase ${index + 1} must be ${count}`,
      );
  }
  for (const { route } of rows) {
    if (
      route !== versions.current.routeBase &&
      !new RegExp(
        `^${versions.current.routeBase}/(?:${[...TOP_LEVEL].join('|')})(?:/[a-z0-9]+(?:-[a-z0-9]+)*)*$`,
      ).test(route)
    )
      throw new Error(`Invalid planned V2 route: ${route}`);
  }
  return rows;
}

function withoutFences(body) {
  for (const fence of readCodeFences(body).reverse()) {
    body = body.slice(0, fence.start) + body.slice(fence.end);
  }
  return body;
}

function validateDocs(docs, { launchRows, manifest = null, phase } = {}) {
  const errors = [];
  const planned = new Set(launchRows.map((row) => row.route));
  const packages = new Set(
    Array.isArray(manifest?.packages)
      ? manifest.packages.map((item) => item.name)
      : Object.keys(manifest?.packages || {}),
  );
  const seen = new Set();
  for (const doc of docs) {
    const {
      relativePath,
      frontMatter: fm,
      frontMatterRaw = '',
      body,
      route,
      id,
    } = doc;
    const fail = (message) => errors.push(`${relativePath}: ${message}`);
    const sourceId = relativePath.replace(/\.mdx?$/, '');
    const expectedSuffix =
      sourceId === 'index' ? '' : sourceId.replace(/\/index$/, '');
    if (
      !/^(?:index|(?:get-started|agents|concepts|build|examples|reference|core|community)\/(?:[a-z0-9]+(?:-[a-z0-9]+)*\/)*[a-z0-9]+(?:-[a-z0-9]+)*)\.mdx?$/.test(
        relativePath,
      )
    )
      fail('file path must use the V2 sections and lowercase kebab-case');
    if (
      relativePath.startsWith('concepts/') &&
      relativePath.split('/').length !== 2
    )
      fail('concepts must be flat, not tier directories');
    if (
      route !==
      `${versions.current.routeBase}${expectedSuffix ? `/${expectedSuffix}` : ''}`
    )
      fail('file path must equal its route (use index.md for landings)');
    if (!planned.has(route)) fail(`route is not in the launch plan: ${route}`);
    if (seen.has(route)) fail(`duplicate route: ${route}`);
    seen.add(route);
    if (Object.hasOwn(fm, 'id') || Object.hasOwn(fm, 'slug'))
      fail('id and slug front matter are forbidden');
    const keys = [...frontMatterRaw.matchAll(/^([\w-]+):/gm)].map((m) => m[1]);
    if (new Set(keys).size !== keys.length) fail('duplicate front-matter keys');
    for (const key of ['title', 'sidebar_label', 'description', 'kind']) {
      if (typeof fm[key] !== 'string' || !fm[key].trim())
        fail(`missing or invalid ${key}`);
    }
    if (typeof fm.description === 'string' && [...fm.description].length > 160)
      fail('description exceeds 160 characters');
    if (!KINDS.has(fm.kind)) fail(`invalid kind: ${fm.kind}`);
    for (const key of [
      'reader',
      'packages',
      ...(relativePath.startsWith('concepts/') ? ['depends_on'] : []),
    ]) {
      const raw = frontMatterRaw.match(
        new RegExp(`^${key}:\\s*(.*)$`, 'm'),
      )?.[1];
      let parsed;
      try {
        parsed = JSON.parse(raw);
      } catch {
        /* Report below. */
      }
      if (
        !Array.isArray(parsed) ||
        parsed.some((entry) => typeof entry !== 'string') ||
        new Set(parsed).size !== parsed.length
      )
        fail(`${key} must be a single-line JSON array of unique strings`);
    }
    if (
      !Array.isArray(fm.reader) ||
      !fm.reader.length ||
      fm.reader.some((reader) => !READERS.has(reader))
    )
      fail('reader must be a non-empty subset of app, agent, operator, plugin');
    if (Array.isArray(fm.packages)) {
      if (!manifest && fm.packages.length)
        fail('packages must be [] until the release manifest exists');
      if (manifest)
        for (const name of fm.packages)
          if (!packages.has(name)) fail(`unknown manifest package: ${name}`);
      if (
        fm.packages.length &&
        !/^\s*(?:import[^\n]*\n\s*)*<AppliesTo\s*\/>/.test(body)
      )
        fail('AppliesTo must be the first body element for package pages');
    }
    if (Array.isArray(fm.depends_on))
      for (const slug of fm.depends_on) {
        if (
          !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) ||
          !planned.has(`${versions.current.routeBase}/concepts/${slug}`)
        )
          fail(`depends_on must name a planned concept slug: ${slug}`);
      }
    if (/^\s{0,3}#(?:\s|$)/m.test(withoutFences(body)) || /<h1\b/i.test(body))
      fail('body H1 headings are forbidden');
    if (/graphql/i.test(route)) fail('GraphQL routes are forbidden');
    if (
      /^\s*(?:`{3,}|~{3,})\s*graphql\b/im.test(body) ||
      /\b(?:query|mutation|subscription|fragment)\s+[A-Za-z_]\w*(?:\s*\([^)]*\))?\s*(?:on\s+\w+\s*)?\{/m.test(
        body,
      )
    )
      fail('GraphQL operation documents are forbidden');
    if (/graphql/i.test(doc.content) && !GRAPHQL_PAGES.has(id))
      fail('GraphQL is not allowed in this page body');
    if (
      /sdk\/api|createIntuitionApiClient|getIntuitionApiUrl|intuition\.sh/i.test(
        body,
      ) &&
      !READ_CLIENT_PAGES.has(id)
    )
      fail('SDK hosted read-client references are not allowed here');
    const graphLinks =
      body.match(
        new RegExp(`${versions.v1.routeBase}/graphql-api/[^\\s"'<>)]*`, 'g'),
      ) || [];
    if (
      graphLinks.some(
        (target) =>
          !GRAPHQL_PAGES.has(id) ||
          target !== `${versions.v1.routeBase}/graphql-api/overview`,
      )
    )
      fail(
        'only the allowed GraphQL overview note may link V1 GraphQL from a page body',
      );
    if (/mcp/i.test(route) || /mcp/i.test(String(fm.title)))
      fail('MCP routes and titles are forbidden');
    const mcpLines = doc.content
      .split(/\r?\n/)
      .filter((line) => /\bMCP\b/i.test(line));
    if (
      mcpLines.length &&
      !(
        id === 'agents/index' &&
        (phase === undefined || phase >= 3) &&
        mcpLines.length === 1 &&
        mcpLines[0] === 'An Intuition MCP server is not available yet.'
      )
    )
      fail('MCP notice is reserved for agents/index from Phase 3');
    if (body.includes('experimental-applications/mcp-server'))
      fail('MCP body links are forbidden');
    if (
      fm.kind === 'tutorial' &&
      body.includes('<!-- docs-typecheck: skip -->')
    )
      fail('tutorial pages may not skip typechecking');
    for (const marker of body.matchAll(/<!-- docs-typecheck: skip -->/g)) {
      if (
        !/^<!-- docs-typecheck: skip -->\r?\n\s*(?:`{3,}|~{3,})/.test(
          body.slice(marker.index),
        )
      )
        fail('skip markers must immediately precede a code fence');
    }
    for (const fence of readCodeFences(body)) {
      if (/^(?:typescript|tsx|ts)\b/i.test(fence.info) && !fence.closed)
        fail(`Unclosed TypeScript fence at line ${fence.fenceLine}`);
      if (
        fence.previousLine === '<!-- docs-typecheck: skip -->' &&
        INTUITION_IMPORT_PATTERN.test(fence.code)
      )
        fail('an Intuition import fence may not skip typechecking');
    }
    if (
      body.includes('<!-- docs-typecheck: v1 -->') &&
      id !== 'get-started/migrate-from-v1'
    )
      fail('V1 typecheck markers are allowed only on the migration guide');
    if (/SDK [34]\.x|protocol [23]\.x/i.test(doc.content))
      fail('documentation generation labels must not be package semver ranges');
  }
  if (phase !== undefined) {
    const expected = launchRows
      .filter((row) => row.phase <= phase)
      .map((row) => row.route);
    for (const route of expected)
      if (!seen.has(route))
        errors.push(`Phase ${phase} missing route: ${route}`);
    for (const route of seen)
      if (!expected.includes(route))
        errors.push(`Phase ${phase} extra route: ${route}`);
  }
  return errors;
}

function sidebarIds(items, errors = []) {
  const ids = [];
  for (const item of items || []) {
    if (typeof item === 'string') ids.push(item);
    else if (item?.type === 'doc') ids.push(item.id);
    else if (item?.type === 'category') {
      if (item.link?.type === 'doc') ids.push(item.link.id);
      else if (item.link)
        errors.push('V2 categories may link only to authored docs');
      ids.push(...sidebarIds(item.items, errors));
    } else
      errors.push('V2 sidebar may contain only authored docs and categories');
  }
  return ids;
}

function validateSidebar(sidebar, docs, launchRows, phase) {
  const errors = [];
  if (
    !sidebar ||
    Object.keys(sidebar).join(',') !== 'docs' ||
    !Array.isArray(sidebar.docs)
  )
    return ['There must be exactly one authored docs sidebar'];
  const ids = sidebarIds(sidebar.docs, errors);
  const byId = new Map(docs.map((doc) => [doc.id, doc.route]));
  for (const id of ids)
    if (!byId.has(id)) errors.push(`Sidebar doc does not exist: ${id}`);
  if (new Set(ids).size !== ids.length) errors.push('Sidebar repeats a doc');
  const expected = launchRows
    .filter((row) =>
      phase === undefined
        ? docs.some((doc) => doc.route === row.route)
        : row.phase <= phase,
    )
    .map((row) => row.route);
  if (
    JSON.stringify(ids.map((id) => byId.get(id))) !== JSON.stringify(expected)
  )
    errors.push('Sidebar routes differ from the launch-plan order');
  return errors;
}

function validateMismatches(records, launchRows, { manifest = null } = {}) {
  const errors = [];
  if (!Array.isArray(records)) return ['source-mismatches must be an array'];
  const routes = new Set(launchRows.map((row) => row.route));
  const ids = new Set();
  for (const record of records) {
    if (!record || typeof record !== 'object') {
      errors.push('Invalid source-mismatch record');
      continue;
    }
    for (const key of ['id', 'repo', 'path', 'finding'])
      if (typeof record[key] !== 'string' || !record[key].trim())
        errors.push(`Mismatch ${record.id || '(unknown)'} needs ${key}`);
    if (ids.has(record.id)) errors.push(`Duplicate mismatch: ${record.id}`);
    ids.add(record.id);
    if (!['open', 'resolved'].includes(record.status))
      errors.push(`Invalid mismatch status: ${record.id}`);
    if (
      !Array.isArray(record.docsPages) ||
      !record.docsPages.length ||
      record.docsPages.some((route) => !routes.has(route))
    )
      errors.push(
        `Mismatch ${record.id} docsPages must be normalized planned routes`,
      );
  }
  for (let i = 1; i <= 8; i++)
    if (!ids.has(`M-${i}`)) errors.push(`Missing mismatch M-${i}`);
  if (!manifest) {
    const statuses = [
      'open',
      'resolved',
      'resolved',
      'resolved',
      'resolved',
      'open',
      'open',
      'open',
    ];
    for (const [i, status] of statuses.entries())
      if (
        records.find((record) => record?.id === `M-${i + 1}`)?.status !== status
      )
        errors.push(`Phase 1 M-${i + 1} status must be ${status}`);
    if (ids.has('M-9'))
      errors.push('M-9 is absent until a Core fallback actually applies');
  }
  return errors;
}

function checkRoutePermanence(
  previousRoutes,
  currentRoutes,
  renames,
  { initialized = true } = {},
) {
  if (!initialized) return [];
  const current = new Set(currentRoutes);
  const redirects = new Map(
    renames.flatMap(({ from, to }) =>
      (Array.isArray(from) ? from : [from]).map((source) => [source, to]),
    ),
  );
  return previousRoutes
    .filter((route) => !current.has(route) && !redirects.has(route))
    .map((route) => `Shipped V2 route removed without v2Renames: ${route}`);
}

function previousV2Routes(root, base = 'origin/main') {
  const opts = { cwd: root, encoding: 'utf8' };
  const exists = spawnSync('git', ['rev-parse', '--verify', base], opts);
  if (exists.status !== 0)
    throw new Error(
      `Cannot check V2 route permanence: missing ${base}; fetch full history`,
    );
  const initialized =
    spawnSync('git', ['cat-file', '-e', `${base}:_data_versions.json`], opts)
      .status === 0;
  if (!initialized) return { initialized: false, routes: [] };
  const names = execFileSync(
    'git',
    [
      'ls-tree',
      '-r',
      '--name-only',
      '-z',
      base,
      '--',
      versions.current.docsDir,
    ],
    opts,
  )
    .split('\0')
    .filter((file) => /\.mdx?$/.test(file));
  const routes = names
    .filter(
      (file) =>
        !file
          .slice(versions.current.docsDir.length + 1)
          .split('/')
          .some((part) => /^[_.]/.test(part)),
    )
    .map(
      (file) =>
        docMetadata(
          file.slice(versions.current.docsDir.length + 1),
          execFileSync('git', ['show', `${base}:${file}`], opts),
          versions.current,
        ).route,
    );
  return { initialized, routes };
}

function run({ root = ROOT, phase, base = 'origin/main' } = {}) {
  const launchRows = loadLaunchRoutes(
    fs.readFileSync(path.join(root, 'scripts/v2-launch-routes.txt'), 'utf8'),
  );
  const docs = readDocs(root, versions.current);
  const manifestFile = path.join(root, 'static/intuition-release.json');
  const manifest = fs.existsSync(manifestFile)
    ? JSON.parse(fs.readFileSync(manifestFile, 'utf8'))
    : null;
  const sidebar = require(path.join(root, 'sidebars.js'));
  const { v2Renames } = require(path.join(root, 'redirects.config.js'));
  const previous = previousV2Routes(root, base);
  const errors = [
    ...validateDocs(docs, { launchRows, manifest, phase }),
    ...validateSidebar(sidebar, docs, launchRows, phase),
    ...validateMismatches(
      JSON.parse(
        fs.readFileSync(
          path.join(root, 'scripts/source-mismatches.json'),
          'utf8',
        ),
      ),
      launchRows,
      { manifest },
    ),
    ...checkRoutePermanence(
      previous.routes,
      docs.map((doc) => doc.route),
      v2Renames,
      previous,
    ),
  ];
  for (const { from, to } of v2Renames) {
    if (
      typeof to !== 'string' ||
      !(
        to === versions.current.routeBase ||
        to.startsWith(`${versions.current.routeBase}/`)
      ) ||
      to === versions.v1.routeBase ||
      to.startsWith(`${versions.v1.routeBase}/`)
    )
      errors.push(`Invalid V2 rename target: ${to}`);
    if (
      (Array.isArray(from) ? from : [from]).some((route) =>
        docs.some((doc) => doc.route === route),
      )
    )
      errors.push(`V2 rename collides with a live route: ${from}`);
  }
  return { errors, count: docs.length, initialized: previous.initialized };
}

if (require.main === module) {
  try {
    const args = process.argv.slice(2);
    let phase;
    if (args[0] === '--phase' && /^[1-5]$/.test(args[1]) && args.length === 2)
      phase = Number(args[1]);
    else if (args.length === 1 && args[0] === '--launch') phase = 5;
    else if (args.length)
      throw new Error(
        'Usage: validate-v2-structure.js [--phase 1..5 | --launch]',
      );
    const result = run({ phase });
    if (result.errors.length) throw new Error(result.errors.join('\n'));
    console.log(
      `V2 structure PASS: ${result.count} docs; 134 planned routes; ${result.initialized ? 'shipped route permanence checked' : 'pre-foundation main recognized'}.`,
    );
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
module.exports = {
  GRAPHQL_PAGES,
  READ_CLIENT_PAGES,
  loadLaunchRoutes,
  validateDocs,
  validateSidebar,
  validateMismatches,
  checkRoutePermanence,
  previousV2Routes,
  run,
};
